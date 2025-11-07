import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LinkListTheme } from "@shared/schema";

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

interface LinkListInputProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
  theme: LinkListTheme;
  onThemeChange: (theme: LinkListTheme) => void;
  shareUrl?: string;
}

const themeOptions: Record<LinkListTheme, { label: string; description: string; itemClass: string; containerClass: string }> = {
  minimal: {
    label: "Minimal",
    description: "Clean typography on a subtle background",
    containerClass: "space-y-3",
    itemClass: "block rounded-md border border-border bg-background px-4 py-3 text-left hover:border-primary transition-colors",
  },
  cards: {
    label: "Card stack",
    description: "Elevated cards with accent borders",
    containerClass: "space-y-3",
    itemClass: "block rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-left shadow-sm hover:bg-primary/10 transition-colors",
  },
  spotlight: {
    label: "Spotlight",
    description: "Bold buttons that demand attention",
    containerClass: "space-y-3",
    itemClass: "block rounded-full bg-primary text-primary-foreground px-5 py-3 text-center font-medium shadow hover:shadow-md transition-shadow",
  },
};

const previewItems = [
  { label: "Website", url: "https://example.com" },
  { label: "Portfolio", url: "https://me.link" },
];

export default function LinkListInput({ links, onChange, theme, onThemeChange, shareUrl }: LinkListInputProps) {
  const { toast } = useToast();

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      label: "",
      url: "",
    };
    onChange([...links, newLink]);
  };

  const removeLink = (id: string) => {
    onChange(links.filter(link => link.id !== id));
  };

  const updateLink = (id: string, field: "label" | "url", value: string) => {
    onChange(
      links.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Shareable page URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please copy it manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label data-testid="label-links">Links</Label>
        <Button
          variant="secondary"
          size="sm"
          onClick={addLink}
          className="flex items-center gap-2"
          data-testid="button-add-link"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="border border-dashed rounded-md p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-empty-state">
            No links added yet
          </p>
          <Button
            variant="secondary"
            onClick={addLink}
            data-testid="button-add-first-link"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => (
            <div
              key={link.id}
              className="border rounded-md p-4 space-y-3"
              data-testid={`container-link-${index}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Link {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(link.id)}
                  data-testid={`button-remove-link-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Label (e.g., Website)"
                  value={link.label}
                  onChange={(e) => updateLink(link.id, "label", e.target.value)}
                  data-testid={`input-label-${index}`}
                />
                <Input
                  placeholder="https://example.com"
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  data-testid={`input-url-${index}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Design style</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(themeOptions).map(([value, option]) => (
                <Button
                  key={value}
                  type="button"
                  variant={theme === value ? "default" : "outline"}
                  className="flex flex-col items-start gap-1 h-full text-left whitespace-normal"
                  onClick={() => onThemeChange(value as LinkListTheme)}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground text-left">
                    {option.description}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Preview</Label>
            <div className={`rounded-lg border border-dashed p-4 ${themeOptions[theme].containerClass}`}>
              {previewItems.map((item, index) => (
                <span
                  key={index}
                  className={`${themeOptions[theme].itemClass}`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.url}</span>
                </span>
              ))}
            </div>
          </div>

          {shareUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Shareable page</Label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-muted/50">
                <span className="text-sm truncate" title={shareUrl} data-testid="text-share-url">
                  {shareUrl}
                </span>
                <Button variant="secondary" size="icon" onClick={handleCopyShareUrl}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground" data-testid="text-helper">
            We host the link list for you and encode the shareable page in the QR code.
          </p>
        </div>
      )}
    </div>
  );
}
