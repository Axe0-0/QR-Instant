import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

function esc(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export default function VCardForm({ onChange }: { onChange: (content: string) => void }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [org, setOrg] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [addr, setAddr] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!first && !last && !phone && !email) {
      onChange("");
      return;
    }

    const lines: string[] = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${esc(last)};${esc(first)};;;`,
      `FN:${esc([first, last].filter(Boolean).join(" "))}`,
    ];

    if (org) lines.push(`ORG:${esc(org)}`);
    if (title) lines.push(`TITLE:${esc(title)}`);
    if (phone) lines.push(`TEL;TYPE=CELL:${esc(phone)}`);
    if (email) lines.push(`EMAIL:${esc(email)}`);
    if (url) lines.push(`URL:${esc(url)}`);
    if (addr) lines.push(`ADR;TYPE=HOME:;;${esc(addr)};;;;`);
    if (note) lines.push(`NOTE:${esc(note)}`);

    lines.push("END:VCARD");

    onChange(lines.join("\n"));
  }, [first, last, org, title, phone, email, url, addr, note, onChange]);

  return (
    <Card className="p-4 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>First Name</Label>
          <Input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Jane" />
        </div>

        <div className="space-y-1">
          <Label>Last Name</Label>
          <Input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Doe" />
        </div>

        <div className="space-y-1">
          <Label>Company</Label>
          <Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Macgear" />
        </div>

        <div className="space-y-1">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Manager" />
        </div>

        <div className="space-y-1">
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+61 4xx xxx xxx" />
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Website</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Address</Label>
          <Input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="123 Sample St, Sydney" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Notes</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Met at event..." />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This vCard can be scanned offline to add contact details instantly.
      </p>
    </Card>
  );
}
