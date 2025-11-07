import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts, ShopifyProduct } from '@/lib/shopify';
import ProductGrid from '@/components/products/ProductGrid';

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts(24);
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
              Shop All
            </h1>
            <p className="text-muted-foreground">
              Explore our complete collection
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 bg-secondary/50 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
