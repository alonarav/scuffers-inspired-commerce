import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/store/cartStore';
import { Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.edges[0]?.node;
  const variant = product.variants.edges[0]?.node;
  const price = variant ? parseFloat(variant.price.amount) : 0;
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price.amount,
      currencyCode: variant.price.currencyCode,
      image: mainImage?.url || '',
      handle: product.handle,
    });

    toast.success('המוצר נוסף לעגלה', {
      icon: <Check className="w-4 h-4" />,
      className: 'bg-green-500/50 border-green-500',
      position: 'bottom-center',
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${product.handle}`} className="group block">
        <div className="relative aspect-[3/4] bg-secondary/50 rounded overflow-hidden mb-4">
          {mainImage && (
            <img
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {!variant?.availableForSale && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="bg-white text-black px-4 py-2 text-sm uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
          {variant?.availableForSale && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-4 left-4 w-10 h-10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-10 drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
              aria-label="Add to cart"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm uppercase tracking-wider group-hover:text-muted-foreground transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {price.toFixed(2)} {variant?.price.currencyCode}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
