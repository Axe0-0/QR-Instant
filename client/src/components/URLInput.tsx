import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function URLInput({ value, onChange }: URLInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url-input" data-testid="label-url">Website URL</Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-base"
          data-testid="input-url"
        />
        <p className="text-xs text-muted-foreground" data-testid="text-helper">
          Enter a valid URL starting with http:// or https://
        </p>
      </div>
    </div>
  );
}
