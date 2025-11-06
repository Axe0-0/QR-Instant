import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  content: string;
}

type QRSize = "256" | "512" | "1024" | "2048";

export default function QRCodeDisplay({ content }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<QRSize>("512");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (content && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, content, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }
  }, [content]);

  const handleDownload = async () => {
    if (!content) return;

    try {
      const dataUrl = await QRCode.toDataURL(content, {
        width: parseInt(size),
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Download started",
        description: `QR code (${size}x${size}px) is downloading`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate QR code for download",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!content) return;

    try {
      const dataUrl = await QRCode.toDataURL(content, {
        width: parseInt(size),
        margin: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "QR code image copied successfully",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy QR code to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!content) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-64 h-64 bg-muted rounded-md flex items-center justify-center">
            <div className="text-muted-foreground">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                <rect x="14" y="14" width="3" height="3" strokeWidth="2" />
                <rect x="18" y="18" width="3" height="3" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs" data-testid="text-empty-state">
            Enter content above to generate your QR code
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-md">
          <canvas ref={canvasRef} data-testid="canvas-qr" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="size-select" data-testid="label-size">Download Size</Label>
          <Select value={size} onValueChange={(value) => setSize(value as QRSize)}>
            <SelectTrigger id="size-select" data-testid="select-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="256" data-testid="option-size-256">Small (256x256px)</SelectItem>
              <SelectItem value="512" data-testid="option-size-512">Medium (512x512px)</SelectItem>
              <SelectItem value="1024" data-testid="option-size-1024">Large (1024x1024px)</SelectItem>
              <SelectItem value="2048" data-testid="option-size-2048">XL (2048x2048px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            data-testid="button-copy"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
