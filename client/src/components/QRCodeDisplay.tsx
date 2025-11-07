// client/src/components/QRCodeDisplay.tsx
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type QRSize = "256" | "512" | "1024" | "2048";
type QRECL = "L" | "M" | "Q" | "H";

interface QRCodeDisplayProps {
  content: string;
}

export default function QRCodeDisplay({ content }: QRCodeDisplayProps) {
  const PREVIEW_SIZE: QRSize = "256";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<QRSize>("512");
  const [ecc, setEcc] = useState<QRECL>("M");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Render preview with the selected settings
  useEffect(() => {
    if (!content || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, content, {
      width: Number(PREVIEW_SIZE),
      margin: 2,
      errorCorrectionLevel: ecc,
      color: { dark, light },
    }).catch((err) => {
      console.error(err);
      toast({ title: "QR render failed", description: String(err), variant: "destructive" });
    });
  }, [content, ecc, dark, light, toast]);

  const handleDownloadPng = async () => {
    if (!content) return;
    const pngDataUrl = await QRCode.toDataURL(content, {
      width: Number(size),
      margin: 2,
      errorCorrectionLevel: ecc,
      color: { dark, light },
    });
    const a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = "qr.png";
    a.click();
  };

  const handleDownloadSvg = async () => {
    if (!content) return;
    const svg = await QRCode.toString(content, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: ecc,
      color: { dark, light },
    } as any);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPng = async () => {
    if (!content) return;
    const pngDataUrl = await QRCode.toDataURL(content, {
      width: Number(size),
      margin: 2,
      errorCorrectionLevel: ecc,
      color: { dark, light },
    });
    const res = await fetch(pngDataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new window.ClipboardItem({ [blob.type]: blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <canvas ref={canvasRef} width={Number(PREVIEW_SIZE)} height={Number(PREVIEW_SIZE)} />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Size</Label>
              <Select value={size} onValueChange={(v) => setSize(v as QRSize)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="256">S (256×256)</SelectItem>
                  <SelectItem value="512">M (512×512)</SelectItem>
                  <SelectItem value="1024">L (1024×1024)</SelectItem>
                  <SelectItem value="2048">XL (2048×2048)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Error Correction</Label>
              <Select value={ecc} onValueChange={(v) => setEcc(v as QRECL)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L (7%)</SelectItem>
                  <SelectItem value="M">M (15%)</SelectItem>
                  <SelectItem value="Q">Q (25%)</SelectItem>
                  <SelectItem value="H">H (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Dark Color</Label>
              <Input type="color" value={dark} onChange={(e) => setDark(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label>Light Color</Label>
              <Input type="color" value={light} onChange={(e) => setLight(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleDownloadPng}>
              <Download className="w-4 h-4 mr-2" /> Download PNG
            </Button>
            <Button variant="secondary" onClick={handleDownloadSvg}>
              <Download className="w-4 h-4 mr-2" /> SVG
            </Button>
            <Button variant="ghost" onClick={handleCopyPng}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

