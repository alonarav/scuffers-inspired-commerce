import { Tag } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-2 px-4 text-center">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
        <Tag className="w-4 h-4" />
        <p className="font-medium">
          20% הנחה בקנייה מעל מאה שקל{' '}
          <span className="font-bold">WELCOME20</span>
        </p>
      </div>
    </div>
  );
}
