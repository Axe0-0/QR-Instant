import { z } from "zod";

export const fileUploadResponseSchema = z.object({
  url: z.string().url(),
  fileName: z.string(),
});

export const linkListThemes = ["minimal", "cards", "spotlight"] as const;

export type LinkListTheme = typeof linkListThemes[number];

export const linkItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const linkListCreateSchema = z.object({
  links: z.array(linkItemSchema).min(1),
  theme: z.enum(linkListThemes),
});

export const linkListResponseSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  theme: z.enum(linkListThemes),
  links: z.array(linkItemSchema),
  createdAt: z.string(),
});

export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;
export type LinkListResponse = z.infer<typeof linkListResponseSchema>;
