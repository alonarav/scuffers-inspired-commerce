import { Tag } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
        <Tag className="w-4 h-4" />
        <p className="font-medium">
          Limited Time Offer: Get 20% off your first order with code{' '}
          <span className="font-bold">WELCOME20</span>
        </p>
      </div>
    </div>
  );
}
