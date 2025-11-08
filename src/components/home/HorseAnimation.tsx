import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import horse1 from '@/assets/horse/1.svg';
import horse2 from '@/assets/horse/2.svg';
import horse3 from '@/assets/horse/3.svg';
import horse4 from '@/assets/horse/4.svg';
import horse5 from '@/assets/horse/5.svg';
import horse6 from '@/assets/horse/6.svg';
import horse7 from '@/assets/horse/7.svg';
import horse8 from '@/assets/horse/8.svg';
import horse9 from '@/assets/horse/9.svg';

const horseFrames = [horse1, horse2, horse3, horse4, horse5, horse6, horse7, horse8, horse9];

export default function HorseAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to frame index (0-8)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex items-center justify-center"
          style={{
            willChange: 'transform'
          }}
        >
          <motion.div className="relative w-full max-w-md lg:max-w-lg">
            {horseFrames.map((frame, index) => (
              <motion.img
                key={index}
                src={frame}
                alt={`Horse running frame ${index + 1}`}
                className="w-full h-auto"
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  opacity: useTransform(
                    frameIndex,
                    [index - 0.5, index, index + 0.5],
                    [0, 1, 0]
                  ),
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
