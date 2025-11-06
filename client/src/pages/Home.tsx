import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QRTypeTabs, { QRType } from "@/components/QRTypeTabs";
import URLInput from "@/components/URLInput";
import TextInput from "@/components/TextInput";
import FileUploadInput from "@/components/FileUploadInput";
import LinkListInput, { LinkItem } from "@/components/LinkListInput";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [activeType, setActiveType] = useState<QRType>("url");
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [pdfFile, setPdfFile] = useState<{ content: string; name: string }>();
  const [imageFile, setImageFile] = useState<{ content: string; name: string }>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [qrContent, setQrContent] = useState("");

  useEffect(() => {
    let content = "";
    
    switch (activeType) {
      case "url":
        content = urlValue;
        break;
      case "text":
        content = textValue;
        break;
      case "pdf":
        content = pdfFile?.content || "";
        break;
      case "image":
        content = imageFile?.content || "";
        break;
      case "links":
        const validLinks = links.filter(link => link.url && link.label);
        if (validLinks.length > 0) {
          content = validLinks
            .map(link => `${link.label}: ${link.url}`)
            .join("\n");
        }
        break;
    }
    
    setQrContent(content);
  }, [activeType, urlValue, textValue, pdfFile, imageFile, links]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <QRTypeTabs activeType={activeType} onTypeChange={setActiveType} />
          
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div>
              <Card className="p-6">
                {activeType === "url" && (
                  <URLInput value={urlValue} onChange={setUrlValue} />
                )}
                
                {activeType === "text" && (
                  <TextInput value={textValue} onChange={setTextValue} />
                )}
                
                {activeType === "pdf" && (
                  <FileUploadInput
                    fileType="pdf"
                    onFileSelect={(content, name) => setPdfFile({ content, name })}
                    onClear={() => setPdfFile(undefined)}
                    selectedFile={pdfFile?.name}
                  />
                )}
                
                {activeType === "image" && (
                  <FileUploadInput
                    fileType="image"
                    onFileSelect={(content, name) => setImageFile({ content, name })}
                    onClear={() => setImageFile(undefined)}
                    selectedFile={imageFile?.name}
                  />
                )}
                
                {activeType === "links" && (
                  <LinkListInput links={links} onChange={setLinks} />
                )}
              </Card>
            </div>
            
            <div className="lg:sticky lg:top-8 lg:self-start">
              <QRCodeDisplay content={qrContent} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
