import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  const charCount = value.length;
  const maxChars = 2000;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text-input" data-testid="label-text">Text Content</Label>
          <span className="text-xs text-muted-foreground" data-testid="text-char-count">
            {charCount} / {maxChars}
          </span>
        </div>
        <Textarea
          id="text-input"
          placeholder="Type or paste your text here..."
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onChange(e.target.value);
            }
          }}
          className="min-h-32 text-base resize-none"
          data-testid="input-text"
        />
        <p className="text-xs text-muted-foreground" data-testid="text-helper">
          Enter any text you want to encode in the QR code
        </p>
      </div>
    </div>
  );
}
