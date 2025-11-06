import { useState } from 'react';
import LinkListInput, { LinkItem } from '../LinkListInput';

export default function LinkListInputExample() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", label: "Website", url: "https://example.com" },
    { id: "2", label: "GitHub", url: "https://github.com/example" },
  ]);
  
  return (
    <div className="p-6">
      <LinkListInput links={links} onChange={setLinks} />
    </div>
  );
}
