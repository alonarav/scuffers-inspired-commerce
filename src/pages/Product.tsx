import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Check } from 'lucide-react';

export default function Product() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;

      try {
        const productData = await getProductByHandle(handle);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-secondary/50 rounded animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-secondary/50 rounded animate-pulse" />
              <div className="h-6 bg-secondary/50 rounded animate-pulse w-1/4" />
              <div className="h-32 bg-secondary/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const images = product.images.edges.map(edge => edge.node);
  const currentImage = images[selectedImageIndex];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price.amount,
      currencyCode: selectedVariant.price.currencyCode,
      image: images[0]?.url || '',
      handle: product.handle,
    });

    toast.success('Added to cart', {
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[3/4] bg-secondary/50 rounded overflow-hidden mb-4">
              {currentImage && (
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-secondary/50 rounded overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
                {product.title}
              </h1>
              <p className="text-2xl">
                {price.toFixed(2)} {selectedVariant?.price.currencyCode}
              </p>
            </div>

            {product.description && (
              <div
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {product.variants.edges.length > 1 && (
              <div>
                <label className="text-sm uppercase tracking-wider mb-3 block">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((edge, index) => (
                    <button
                      key={edge.node.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!edge.node.availableForSale}
                      className={`px-4 py-2 border rounded text-sm transition-colors ${
                        selectedVariantIndex === index
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      } ${!edge.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {edge.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                size="lg"
                className="w-full"
              >
                {selectedVariant?.availableForSale ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                ) : (
                  'Sold Out'
                )}
              </Button>

              {selectedVariant?.availableForSale && (
                <p className="text-xs text-muted-foreground text-center">
                  Free shipping on orders over $100
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
