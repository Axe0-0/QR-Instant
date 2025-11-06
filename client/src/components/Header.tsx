import { QrCode } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b h-16 flex items-center justify-center px-6">
      <div className="flex items-center gap-3">
        <QrCode className="w-6 h-6 text-primary" data-testid="icon-logo" />
        <div>
          <h1 className="text-xl font-semibold" data-testid="text-title">QR Code Generator</h1>
          <p className="text-xs text-muted-foreground" data-testid="text-tagline">Generate QR Codes Instantly - No Signup Required</p>
        </div>
      </div>
    </header>
  );
}
