// client/src/components/QRTypeTabs.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type QRType = "url" | "text" | "pdf" | "image" | "links";

interface QRTypeTabsProps {
  activeType: QRType;
  onTypeChange: (type: QRType) => void;
}

export default function QRTypeTabs({ activeType, onTypeChange }: QRTypeTabsProps) {
  return (
    <Tabs value={activeType} onValueChange={(value) => onTypeChange(value as QRType)}>
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="url">URL</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="pdf">PDF</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
        <TabsTrigger value="links">Link List</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

