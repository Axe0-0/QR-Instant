import { z } from "zod";

export const fileUploadResponseSchema = z.object({
  content: z.string(),
  fileName: z.string(),
});

export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;
