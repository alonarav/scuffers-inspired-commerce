import { useEffect, useState } from 'react';
import { getDiscountTexts } from '@/lib/shopify';
import Marquee from 'react-fast-marquee';
import claroLogo from '@/assets/claro-logo.svg';

export default function AnnouncementBar() {
  const [discountTexts, setDiscountTexts] = useState<string[]>([
    '20% הנחה בקנייה מעל מאה שקל WELCOME20'
  ]);

  useEffect(() => {
    getDiscountTexts().then(texts => {
      if (texts && texts.length > 0) {
        setDiscountTexts(texts);
      }
    });
  }, []);

  // Repeat the texts 100 times to create an endless loop
  const repeatedTexts = Array(500).fill(discountTexts).flat();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 overflow-hidden">
      <Marquee speed={50} gradient={false}>
        {repeatedTexts.map((text, i) => (
          <span key={i} className=" text-sm font-medium"  style={{ direction: 'rtl' }}>
            {text}
            <img
              src={claroLogo}
              style={{ color: 'white' }}
              alt="Claro Logo"
              className="w-5 h-5 mx-4 inline-block filter invert brightness-0"
            />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
