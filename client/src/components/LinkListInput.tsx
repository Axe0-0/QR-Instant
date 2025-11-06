import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

interface LinkListInputProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}

export default function LinkListInput({ links, onChange }: LinkListInputProps) {
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
        <p className="text-xs text-muted-foreground" data-testid="text-helper">
          QR code will encode all links in a list format
        </p>
      )}
    </div>
  );
}
