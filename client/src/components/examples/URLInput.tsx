import { useState } from 'react';
import URLInput from '../URLInput';

export default function URLInputExample() {
  const [url, setUrl] = useState("https://example.com");
  
  return (
    <div className="p-6">
      <URLInput value={url} onChange={setUrl} />
    </div>
  );
}
