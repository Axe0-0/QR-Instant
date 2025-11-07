import { useState } from "react";
import { Card } from "@/components/ui/card";
import FileUploadInput from "@/components/FileUploadInput";

interface PdfFormProps {
  onChange: (content: string) => void;
}

export default function PdfForm({ onChange }: PdfFormProps) {
  const [fileName, setFileName] = useState<string | undefined>();

  const handleFileSelect = (content: string, selectedFile: string) => {
    setFileName(selectedFile);
    onChange(content);
  };

  const handleClear = () => {
    setFileName(undefined);
    onChange("");
  };

  return (
    <Card className="p-4 space-y-4">
      <FileUploadInput
        fileType="pdf"
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        selectedFile={fileName}
      />
      <p className="text-xs text-muted-foreground">
        We extract the readable text from your PDF and encode it directly into the QR code.
      </p>
    </Card>
  );
}
