import { useState } from "react";
import { Card } from "@/components/ui/card";
import FileUploadInput from "@/components/FileUploadInput";

interface ImageFormProps {
  onChange: (content: string) => void;
}

export default function ImageForm({ onChange }: ImageFormProps) {
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
        fileType="image"
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        selectedFile={fileName}
      />
      <p className="text-xs text-muted-foreground">
        We'll reference the uploaded image so scanners know which file to look for.
      </p>
    </Card>
  );
}
