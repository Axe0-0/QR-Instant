import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { linkListCreateSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

function buildAbsoluteUrl(req: Request, path: string) {
  const protoHeader = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader || req.protocol;
  const host = req.get("host") ?? "localhost";
  return `${protocol}://${host}${path}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload/pdf", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      const record = storage.saveFile({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      });

      const url = buildAbsoluteUrl(req, `/files/${record.id}`);

      return res.json({
        url,
        fileName: record.originalName,
      });
    } catch (error) {
      console.error("PDF upload failed:", error);
      return res.status(500).json({ error: "Failed to store PDF" });
    }
  });

  app.post("/api/upload/image", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Only PNG, JPEG, WEBP, GIF, or SVG allowed" });
      }

      const record = storage.saveFile({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      });

      const url = buildAbsoluteUrl(req, `/files/${record.id}`);

      return res.json({
        url,
        fileName: record.originalName,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      res.status(500).json({ error: "Failed to store image" });
    }
  });

  app.get("/files/:id", (req, res) => {
    const file = storage.getFile(req.params.id);
    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(file.buffer);
  });

  app.post("/api/link-lists", async (req: Request, res: Response) => {
    const parsed = linkListCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid link list payload" });
    }

    const sanitizedLinks = parsed.data.links
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
      }))
      .filter((link) => link.label && link.url);

    if (sanitizedLinks.length === 0) {
      return res.status(400).json({ error: "At least one valid link is required" });
    }

    if (sanitizedLinks.length > 50) {
      return res.status(400).json({ error: "Too many links" });
    }

    const record = storage.saveLinkList({
      links: sanitizedLinks,
      theme: parsed.data.theme,
    });

    const url = buildAbsoluteUrl(req, `/links/${record.id}`);

    return res.json({
      id: record.id,
      url,
      theme: record.theme,
      links: record.links,
      createdAt: new Date(record.createdAt).toISOString(),
    });
  });

  app.get("/api/link-lists/:id", (req, res) => {
    const record = storage.getLinkList(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Link list not found" });
    }

    const url = buildAbsoluteUrl(req, `/links/${record.id}`);

    return res.json({
      id: record.id,
      url,
      theme: record.theme,
      links: record.links,
      createdAt: new Date(record.createdAt).toISOString(),
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
