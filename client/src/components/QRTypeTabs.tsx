// client/src/components/QRTypeTabs.tsx

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Existing forms (keep these imports as you already had them)
import UrlForm from "@/components/qr/UrlForm";
import TextForm from "@/components/qr/TextForm";
import PdfForm from "@/components/qr/PdfForm";
import ImageForm from "@/components/qr/ImageForm";
import LinkListForm from "@/components/qr/LinkListForm";

// New forms
import WifiForm from "@/components/qr/WifiForm";
import VCardForm from "@/components/qr/VCardForm";

// QR display
import QRCodeDisplay from "@/components/QRCodeDisplay";

export default function QRTypeTabs() {
  const [content, setContent] = useState("");

  return (
    <Tabs defaultValue="url" className="space-y-6">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="url">URL</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
        <TabsTrigger value="vcard">vCard</TabsTrigger>
        <TabsTrigger value="pdf">PDF</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
        <TabsTrigger value="links">Link List</TabsTrigger>
      </TabsList>

      {/* URL */}
      <TabsContent value="url">
        <UrlForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* TEXT */}
      <TabsContent value="text">
        <TextForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* WIFI (NEW) */}
      <TabsContent value="wifi">
        <WifiForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* VCARD (NEW) */}
      <TabsContent value="vcard">
        <VCardForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* PDF Upload */}
      <TabsContent value="pdf">
        <PdfForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* IMAGE Upload */}
      <TabsContent value="image">
        <ImageForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>

      {/* LINK LIST */}
      <TabsContent value="links">
        <LinkListForm onChange={setContent} />
        <div className="mt-4"><QRCodeDisplay content={content} /></div>
      </TabsContent>
    </Tabs>
  );
}

