import { useState } from 'react';
import TextInput from '../TextInput';

export default function TextInputExample() {
  const [text, setText] = useState("Hello World! This is a sample text for the QR code.");
  
  return (
    <div className="p-6">
      <TextInput value={text} onChange={setText} />
    </div>
  );
}
