import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import sharp from "sharp";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    if (req.file.mimetype !== "application/pdf")
      return res.status(400).json({ error: "Only PDF files are allowed" });

    const result = await pdfParse(req.file.buffer);
    // Be reasonable about QR size: don’t push huge text into a QR.
    const MAX_QR_TEXT = 1800;
    const content = result.text.trim().slice(0, MAX_QR_TEXT);

    return res.json({
      content,
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to parse PDF" });
  }
});

  app.post("/api/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Only PNG, JPEG, WEBP, or GIF allowed" });
    }

    // We are NOT embedding the image in the QR (too big). Provide a short descriptor instead.
    // If you plan to host the image and encode a URL later, that can be added.
    const content = `Image: ${req.file.originalname}`;

    return res.json({
      content,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).json({ error: "Failed to process image file" });
  }
});

  const httpServer = createServer(app);

  return httpServer;
}
