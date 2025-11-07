import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fileUploadResponseSchema } from "@shared/schema";

interface FileUploadInputProps {
  fileType: "pdf" | "image";
  onFileSelect: (content: string, fileName: string) => void;
  onClear: () => void;
  selectedFile?: string;
}

export default function FileUploadInput({ fileType, onFileSelect, onClear, selectedFile }: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const accept = fileType === "pdf" ? ".pdf" : "image/*";
  const label = fileType === "pdf" ? "PDF File" : "Image File";

  const handleFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/upload/${fileType}`, {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.text();
      let parsedBody: unknown;

      if (responseBody) {
        try {
          parsedBody = JSON.parse(responseBody);
        } catch (parseError) {
          parsedBody = undefined;
        }
      }

      if (!response.ok) {
        const errorMessage =
          typeof parsedBody === "object" && parsedBody !== null && "error" in parsedBody &&
          typeof (parsedBody as { error?: unknown }).error === "string"
            ? (parsedBody as { error: string }).error
            : responseBody || "Upload failed";

        throw new Error(errorMessage);
      }

      const parsed = fileUploadResponseSchema.safeParse(parsedBody);

      if (!parsed.success) {
        throw new Error("Unexpected upload response");
      }

      onFileSelect(parsed.data.url, parsed.data.fileName);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Label data-testid={`label-${fileType}`}>{label}</Label>
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center transition-colors hover-elevate ${
            dragActive ? "border-primary bg-accent" : "border-border"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          data-testid={`dropzone-${fileType}`}
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 mx-auto mb-4 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          )}
          <p className="text-sm font-medium mb-2" data-testid="text-upload-instruction">
            {uploading ? "Processing..." : `Drag and drop your ${fileType.toUpperCase()} here`}
          </p>
          {!uploading && (
            <>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                data-testid={`button-browse-${fileType}`}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
                data-testid={`input-file-${fileType}`}
              />
              <p className="text-xs text-muted-foreground mt-4">
                {fileType === "pdf" ? "PDF files only" : "PNG, JPG, JPEG supported"}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-md p-4 flex items-center justify-between" data-testid={`container-selected-file`}>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium" data-testid="text-filename">{selectedFile}</p>
              <p className="text-xs text-muted-foreground">File uploaded</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            data-testid="button-clear-file"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
