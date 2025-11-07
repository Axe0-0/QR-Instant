import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import TextInput from "@/components/TextInput";

interface TextFormProps {
  onChange: (content: string) => void;
}

export default function TextForm({ onChange }: TextFormProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    onChange(text.trim());
  }, [text, onChange]);

  return (
    <Card className="p-4 space-y-4">
      <TextInput value={text} onChange={setText} />
      <p className="text-xs text-muted-foreground">
        Long passages are automatically shortened if needed so the QR code stays scannable.
      </p>
    </Card>
  );
}
