import QRCodeDisplay from '../QRCodeDisplay';

export default function QRCodeDisplayExample() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Empty State</h3>
        <QRCodeDisplay content="" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">With Content</h3>
        <QRCodeDisplay content="https://example.com" />
      </div>
    </div>
  );
}
