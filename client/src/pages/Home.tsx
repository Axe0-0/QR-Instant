import { useEffect, useState } from "react";
import Header from "@/components/Header";
import QRTypeTabs, { QRType } from "@/components/QRTypeTabs";
import URLInput from "@/components/URLInput";
import TextInput from "@/components/TextInput";
import FileUploadInput from "@/components/FileUploadInput";
import LinkListInput, { LinkItem } from "@/components/LinkListInput";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { LinkListTheme } from "@shared/schema";

export default function Home() {
  const [activeType, setActiveType] = useState<QRType>("url");
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [pdfFile, setPdfFile] = useState<{ url: string; name: string }>();
  const [imageFile, setImageFile] = useState<{ url: string; name: string }>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linkListTheme, setLinkListTheme] = useState<LinkListTheme>("minimal");
  const [linkListUrl, setLinkListUrl] = useState<string>();
  const [qrContent, setQrContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (activeType === "links") {
      return;
    }

    let content = "";

    switch (activeType) {
      case "url":
        content = urlValue.trim();
        break;
      case "text":
        content = textValue;
        break;
      case "pdf":
        content = pdfFile?.url ?? "";
        break;
      case "image":
        content = imageFile?.url ?? "";
        break;
    }

    setQrContent(content);
  }, [activeType, urlValue, textValue, pdfFile, imageFile]);

  useEffect(() => {
    if (activeType !== "links") {
      return;
    }

    const validLinks = links.filter((link) => link.label.trim() && link.url.trim());

    if (validLinks.length === 0) {
      setLinkListUrl(undefined);
      setQrContent("");
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/link-lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            links: validLinks.map((link) => ({
              label: link.label.trim(),
              url: link.url.trim(),
            })),
            theme: linkListTheme,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || "Failed to create link list");
        }

        const data = await response.json();
        if (!cancelled) {
          setLinkListUrl(data.url);
          setQrContent(data.url);
        }
      } catch (error) {
        if (!cancelled) {
          setLinkListUrl(undefined);
          setQrContent("");
          toast({
            title: "Link list error",
            description: error instanceof Error ? error.message : "Unable to host link list",
            variant: "destructive",
          });
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [activeType, links, linkListTheme, toast]);

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
                    onFileSelect={(url, name) => setPdfFile({ url, name })}
                    onClear={() => setPdfFile(undefined)}
                    selectedFile={pdfFile?.name}
                  />
                )}

                {activeType === "image" && (
                  <FileUploadInput
                    fileType="image"
                    onFileSelect={(url, name) => setImageFile({ url, name })}
                    onClear={() => setImageFile(undefined)}
                    selectedFile={imageFile?.name}
                  />
                )}

                {activeType === "links" && (
                  <LinkListInput
                    links={links}
                    onChange={setLinks}
                    theme={linkListTheme}
                    onThemeChange={setLinkListTheme}
                    shareUrl={linkListUrl}
                  />
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
