import { useEffect, useState } from "react";
import Header from "@/components/Header";
import QRTypeTabs, { QRType } from "@/components/QRTypeTabs";
import URLInput from "@/components/URLInput";
import TextInput from "@/components/TextInput";
import FileUploadInput from "@/components/FileUploadInput";
import LinkListInput, { LinkItem } from "@/components/LinkListInput";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import WifiForm from "@/components/qr/WifiForm";
import VCardForm from "@/components/qr/VCardForm";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { linkListResponseSchema } from "@shared/schema";
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
  const [wifiContent, setWifiContent] = useState("");
  const [vcardContent, setVcardContent] = useState("");
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
      case "wifi":
        content = wifiContent;
        break;
      case "vcard":
        content = vcardContent;
        break;
    }

    setQrContent(content);
  }, [activeType, urlValue, textValue, pdfFile, imageFile, wifiContent, vcardContent]);

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
              : responseBody || "Failed to create link list";

          throw new Error(errorMessage);
        }

        const parsedResponse = linkListResponseSchema.safeParse(parsedBody);

        if (!parsedResponse.success) {
          throw new Error("Unexpected link list response");
        }

        if (!cancelled) {
          setLinkListUrl(parsedResponse.data.url);
          setQrContent(parsedResponse.data.url);
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
        <div className="max-w-6xl mx-auto px-6 py-8">
          <QRTypeTabs activeType={activeType} onTypeChange={setActiveType} />

          <div className="grid gap-8 mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
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

                {activeType === "wifi" && <WifiForm onChange={setWifiContent} />}

                {activeType === "vcard" && <VCardForm onChange={setVcardContent} />}

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
