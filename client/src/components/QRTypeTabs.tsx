import { Link2, FileText, FileUp, Image, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export type QRType = "url" | "text" | "pdf" | "image" | "links";

interface QRTypeTabsProps {
  activeType: QRType;
  onTypeChange: (type: QRType) => void;
}

const tabs = [
  { type: "url" as QRType, label: "URL", icon: Link2 },
  { type: "text" as QRType, label: "Text", icon: FileText },
  { type: "pdf" as QRType, label: "PDF", icon: FileUp },
  { type: "image" as QRType, label: "Image", icon: Image },
  { type: "links" as QRType, label: "Link List", icon: List },
];

export default function QRTypeTabs({ activeType, onTypeChange }: QRTypeTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" data-testid="container-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeType === tab.type;
        return (
          <Button
            key={tab.type}
            variant={isActive ? "default" : "secondary"}
            size="sm"
            onClick={() => onTypeChange(tab.type)}
            className="flex items-center gap-2 whitespace-nowrap"
            data-testid={`button-tab-${tab.type}`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
