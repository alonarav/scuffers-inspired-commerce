import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCollectionByHandle, ShopifyProduct } from '@/lib/shopify';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  collectionHandle?: string;
}

export default function HeroCarousel({ collectionHandle = 'hero-banners' }: HeroCarouselProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const collection = await getCollectionByHandle(collectionHandle);
        const heroProducts = collection.products.edges.map(edge => edge.node);
        console.log('Hero products fetched:', heroProducts.length, heroProducts);
        setProducts(heroProducts);
      } catch (error) {
        console.error('Error fetching hero images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, [collectionHandle]);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-secondary/30 animate-pulse" />
    );
  }

  if (products.length === 0) {
    console.log('No products found in hero-banners collection');
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <p className="text-muted-foreground">No hero images found in collection</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];
  const currentImage = currentProduct?.images.edges[0]?.node;

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
              alt={currentImage.altText || currentProduct.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {products.length > 1 && (
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
      {products.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {products.map((_, index) => (
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
