import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import URLInput from "@/components/URLInput";

interface UrlFormProps {
  onChange: (content: string) => void;
}

export default function UrlForm({ onChange }: UrlFormProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    onChange(url.trim());
  }, [url, onChange]);

  return (
    <Card className="p-4 space-y-4">
      <URLInput value={url} onChange={setUrl} />
      <p className="text-xs text-muted-foreground">
        Paste the website address you want to share. We'll keep it exactly as you enter it.
      </p>
    </Card>
  );
}
