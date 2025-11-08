import { useEffect, useState } from 'react';
import { getDiscountText } from '@/lib/shopify';

export default function AnnouncementBar() {
  const [discountText, setDiscountText] = useState<string>('20% הנחה בקנייה מעל מאה שקל WELCOME20');

  useEffect(() => {
    getDiscountText().then(text => {
      if (text) {
        setDiscountText(text);
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm font-medium">{discountText}</span>
        <span className="mx-4 text-sm font-medium">{discountText}</span>
        <span className="mx-4 text-sm font-medium">{discountText}</span>
        <span className="mx-4 text-sm font-medium">{discountText}</span>
      </div>
    </div>
  );
}
