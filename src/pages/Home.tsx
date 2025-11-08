import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getProducts, ShopifyProduct } from '@/lib/shopify';
import ProductGrid from '@/components/products/ProductGrid';
import HeroCarousel from '@/components/home/HeroCarousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brightness, setBrightness] = useState<string>('dark');
  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel Background */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mt-8">
        <HeroCarousel placement="hero-banner" onBrightnessChange={setBrightness} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-optimus tracking-wider  transition-all duration-700 ${
            brightness === 'bright' ? 'text-primary' : 'text-white'
          }`}
          style={{
            textShadow: brightness === 'bright' 
              ? '2px 2px 8px rgba(0, 0, 0, 0.3)' 
              : '2px 2px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          CLARO
        </h1>
          <p 
            className={`text-2xl md:text-3xl font-script mb-5 max-w-2xl mx-auto transition-all duration-700 ${
              brightness === 'bright' ? 'text-primary/80' : 'text-white/90'
            }`}
            style={{
              textShadow: brightness === 'bright' 
                ? '1px 1px 6px rgba(0, 0, 0, 0.2)' 
                : '1px 1px 6px rgba(0, 0, 0, 0.7)'
            }}
          >
            Refined by nature
          </p>
          <Button asChild size="lg" className="group">
            <Link to="/shop">
              Shop Now
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Handpicked favorites from our latest collection
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 bg-secondary/50 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
