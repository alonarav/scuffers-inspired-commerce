import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary/30 mt-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-light tracking-wider mb-4">CLARO</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeless Essentials, Everyday Comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 font-medium">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/shop" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shop All
              </Link>
              {/* <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link> */}
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 font-medium">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/claro_wear/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a> */}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Claro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
