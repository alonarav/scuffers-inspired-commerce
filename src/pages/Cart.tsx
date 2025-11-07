import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { createCheckout } from '@/lib/shopify';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const subtotal = getSubtotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const lineItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const checkout = await createCheckout(lineItems);
      window.location.href = checkout.webUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-light tracking-wider mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover our collection and find something you love
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-12">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-6 pb-6 border-b border-border last:border-0"
                >
                  <Link
                    to={`/product/${item.handle}`}
                    className="w-32 h-32 bg-secondary/50 rounded overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.handle}`}
                      className="text-lg font-medium hover:text-muted-foreground transition-colors block mb-1"
                    >
                      {item.title}
                    </Link>
                    {item.variantTitle !== 'Default Title' && (
                      <p className="text-sm text-muted-foreground mb-2">{item.variantTitle}</p>
                    )}
                    <p className="text-lg mb-4">
                      {parseFloat(item.price).toFixed(2)} {item.currencyCode}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-2 hover:bg-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-2 hover:bg-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <p className="ml-auto text-lg font-medium">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl uppercase tracking-wider mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      ${subtotal.toFixed(2)} {items[0]?.currencyCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>
                      ${subtotal.toFixed(2)} {items[0]?.currencyCode}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  size="lg"
                  className="w-full mb-4"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
