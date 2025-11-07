import { useState } from "react";
import LinkListInput, { type LinkItem } from "../LinkListInput";
import type { LinkListTheme } from "@shared/schema";

export default function LinkListInputExample() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", label: "Website", url: "https://example.com" },
    { id: "2", label: "GitHub", url: "https://github.com/example" },
  ]);
  const [theme, setTheme] = useState<LinkListTheme>("minimal");

  return (
    <div className="p-6">
      <LinkListInput
        links={links}
        onChange={setLinks}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
