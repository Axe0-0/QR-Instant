// client/src/components/QRTypeTabs.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export type QRType = "url" | "text" | "pdf" | "image" | "wifi" | "vcard" | "links";

interface QRTypeTabsProps {
  activeType: QRType;
  onTypeChange: (type: QRType) => void;
}

const DISABLED_TYPES: QRType[] = ["pdf", "image", "links"];

export default function QRTypeTabs({ activeType, onTypeChange }: QRTypeTabsProps) {
  return (
    <Tabs
      value={activeType}
      onValueChange={(value) => {
        const nextType = value as QRType;
        if (DISABLED_TYPES.includes(nextType)) {
          return;
        }

        onTypeChange(nextType);
      }}
    >
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="url">URL</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="pdf" disabled className="gap-2">
          PDF
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[9px] uppercase tracking-wide"
          >
            Coming Soon
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="image" disabled className="gap-2">
          Image
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[9px] uppercase tracking-wide"
          >
            Coming Soon
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
        <TabsTrigger value="vcard">vCard</TabsTrigger>
        <TabsTrigger value="links" disabled className="gap-2">
          Link List
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[9px] uppercase tracking-wide"
          >
            Coming Soon
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

