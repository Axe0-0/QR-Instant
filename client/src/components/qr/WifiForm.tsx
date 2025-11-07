import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

function escapeWifiField(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/:/g, "\\:");
}

export default function WifiForm({ onChange }: { onChange: (content: string) => void }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [enc, setEnc] = useState<WifiEncryption>("WPA");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const S = escapeWifiField(ssid.trim());
    const P = enc === "nopass" ? "" : escapeWifiField(password);
    const T = enc;
    const H = hidden ? "true" : "false";

    const content = S
      ? `WIFI:T:${T};S:${S};${enc !== "nopass" ? `P:${P};` : ""}H:${H};`
      : "";

    onChange(content);
  }, [ssid, password, enc, hidden, onChange]);

  return (
    <Card className="p-4 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="ssid">Network Name (SSID)</Label>
          <Input
            id="ssid"
            placeholder="MyHomeWifi"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>Security</Label>
          <Select value={enc} onValueChange={(v) => setEnc(v as WifiEncryption)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA / WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">No Password</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder={enc === "nopass" ? "No password required" : "Enter password"}
            disabled={enc === "nopass"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-3">
          <Switch id="hidden" checked={hidden} onCheckedChange={setHidden} />
          <Label htmlFor="hidden">Hidden Network</Label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This QR works offline and can be printed near your router for easy guest access.
      </p>
    </Card>
  );
}
