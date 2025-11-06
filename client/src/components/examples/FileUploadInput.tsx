import { useState } from 'react';
import FileUploadInput from '../FileUploadInput';

export default function FileUploadInputExample() {
  const [pdfFile, setPdfFile] = useState<string>();
  const [imageFile, setImageFile] = useState<string>();
  
  return (
    <div className="p-6 space-y-8">
      <FileUploadInput
        fileType="pdf"
        onFileSelect={(content, name) => setPdfFile(name)}
        onClear={() => setPdfFile(undefined)}
        selectedFile={pdfFile}
      />
      <FileUploadInput
        fileType="image"
        onFileSelect={(content, name) => setImageFile(name)}
        onClear={() => setImageFile(undefined)}
        selectedFile={imageFile}
      />
    </div>
  );
}
