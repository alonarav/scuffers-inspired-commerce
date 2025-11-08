import { useEffect, useState } from 'react';
import { getDiscountTexts } from '@/lib/shopify';
import Marquee from 'react-fast-marquee';

export default function AnnouncementBar() {
  const [discountTexts, setDiscountTexts] = useState<string[]>(['20% הנחה בקנייה מעל מאה שקל WELCOME20']);

  useEffect(() => {
    getDiscountTexts().then(texts => {
      if (texts && texts.length > 0) {
        setDiscountTexts(texts);
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 overflow-hidden">
      <Marquee speed={50} gradient={false}>
        {discountTexts.map((text, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            {text}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
