import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import LinkListInput, { type LinkItem } from "@/components/LinkListInput";

interface LinkListFormProps {
  onChange: (content: string) => void;
}

export default function LinkListForm({ onChange }: LinkListFormProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    const formatted = links
      .map(({ label, url }) => {
        const cleanLabel = label.trim();
        const cleanUrl = url.trim();

        if (!cleanLabel && !cleanUrl) return "";
        if (cleanLabel && cleanUrl) return `${cleanLabel}: ${cleanUrl}`;
        return cleanLabel || cleanUrl;
      })
      .filter(Boolean)
      .join("\n");

    onChange(formatted);
  }, [links, onChange]);

  return (
    <Card className="p-4 space-y-4">
      <LinkListInput links={links} onChange={setLinks} />
      <p className="text-xs text-muted-foreground">
        Each line becomes a separate entry in the QR code so viewers can pick the right link.
      </p>
    </Card>
  );
}
