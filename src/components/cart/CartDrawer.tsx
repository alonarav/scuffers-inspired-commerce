import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { createCheckout } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg uppercase tracking-wider font-medium">Cart ({items.length})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button onClick={closeCart} asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 h-20 bg-secondary/50 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.handle}`}
                          onClick={closeCart}
                          className="text-sm font-medium hover:text-muted-foreground transition-colors block truncate"
                        >
                          {item.title}
                        </Link>
                        {item.variantTitle !== 'Default Title' && (
                          <p className="text-xs text-muted-foreground mt-1">{item.variantTitle}</p>
                        )}
                        <p className="text-sm mt-1">
                          {parseFloat(item.price).toFixed(2)} {item.currencyCode}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-accent rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-accent rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="uppercase tracking-wider">Subtotal</span>
                  <span className="font-medium">
                    ${subtotal.toFixed(2)} {items[0]?.currencyCode}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full"
                  size="lg"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
