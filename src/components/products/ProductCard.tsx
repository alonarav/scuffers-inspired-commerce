import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShopifyProduct } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.edges[0]?.node;
  const variant = product.variants.edges[0]?.node;
  const price = variant ? parseFloat(variant.price.amount) : 0;

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
        </div>

        <div className="space-y-1">
          <h3 className="text-sm uppercase tracking-wider group-hover:text-muted-foreground transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            ${price.toFixed(2)} {variant?.price.currencyCode}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
