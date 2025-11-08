import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import claroLogo from '../../assets/claro-logo2.svg';
import { getLogoPlacement } from '@/lib/shopify';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoPlacement, setLogoPlacement] = useState<string>('middle');
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getLogoPlacement().then(setLogoPlacement);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    // { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 mb-2 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-background/70 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button - Left on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-full transition-colors order-first"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo - Center on mobile, left on desktop */}
          {logoPlacement === 'up' ? (
            <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <Link to="/" className="hover:opacity-70 transition-opacity flex items-center">
                <img src={claroLogo} alt="claro logo" className="h-8 md:h-10" />
              </Link>
              <span className="text-2xl md:text-3xl font-optimus tracking-wider flex items-center">CLARO</span>
            </div>
          ) : (
            <Link to="/" className="text-xl md:text-2xl font-light tracking-wider hover:opacity-70 transition-opacity absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center">
              <img src={claroLogo} alt="claro logo" className="h-8 md:h-10" />
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm uppercase tracking-wider hover:text-muted-foreground transition-colors flex items-center h-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart - Right on both mobile and desktop */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm uppercase tracking-wider hover:text-muted-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
