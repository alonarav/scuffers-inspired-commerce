import { useEffect, useState } from 'react';
import { getDiscountTexts } from '@/lib/shopify';

export default function AnnouncementBar() {
  const [discountTexts, setDiscountTexts] = useState<string[]>(['20% הנחה בקנייה מעל מאה שקל WELCOME20']);

  useEffect(() => {
    getDiscountTexts().then(texts => {
      if (texts && texts.length > 0) {
        setDiscountTexts(texts);
      }
    });
  }, []);

  // Create a seamless loop by duplicating the content
  const allTexts = [...discountTexts, ...discountTexts];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {allTexts.map((text, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
