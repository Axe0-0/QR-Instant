import { useState } from 'react';
import QRTypeTabs, { QRType } from '../QRTypeTabs';

export default function QRTypeTabsExample() {
  const [activeType, setActiveType] = useState<QRType>("url");
  
  return (
    <div className="p-6">
      <QRTypeTabs activeType={activeType} onTypeChange={setActiveType} />
      <p className="mt-4 text-sm text-muted-foreground">Active: {activeType}</p>
    </div>
  );
}
