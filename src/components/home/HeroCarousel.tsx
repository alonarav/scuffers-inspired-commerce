import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPromoImages } from '@/lib/shopify';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoImage {
  id: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  title: string;
  placement: string;
  bright: string;
}

interface HeroCarouselProps {
  placement?: string;
  onBrightnessChange?: (bright: string) => void;
}

export default function HeroCarousel({ placement = 'hero-banner', onBrightnessChange }: HeroCarouselProps) {
  const [images, setImages] = useState<PromoImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const promoImages = await getPromoImages(placement);
        console.log('Promo images fetched:', promoImages.length, promoImages);
        setImages(promoImages);
      } catch (error) {
        console.error('Error fetching promo images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, [placement]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Update brightness when image changes
  useEffect(() => {
    const currentImage = images[currentIndex];
    if (currentImage && onBrightnessChange) {
      onBrightnessChange(currentImage.bright);
    }
  }, [currentIndex, images, onBrightnessChange]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-secondary/30 animate-pulse" />
    );
  }

  if (images.length === 0) {
    console.log('No promo images found with placement:', placement);
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <p className="text-muted-foreground">No hero images found</p>
      </div>
    );
  }

  const currentImage = images[currentIndex]?.image;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {currentImage && (
            <img
              src={currentImage.url}
              alt={currentImage.altText || images[currentIndex].title || 'Hero image'}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
