import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Crafting timeless pieces for the modern lifestyle
            </p>
          </div>

          <div className="aspect-[21/9] bg-secondary/50 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Brand Story Image
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded with a passion for quality and simplicity, our brand is dedicated to creating
                products that stand the test of time. We believe in the power of thoughtful design
                and meticulous craftsmanship.
              </p>

              <p>
                Every piece in our collection is carefully selected to ensure it meets our high
                standards of quality and aesthetic excellence. We work with skilled artisans and
                use only the finest materials to create products that you'll treasure for years to come.
              </p>

              <p>
                Our philosophy is simple: less is more. We focus on creating versatile, essential
                pieces that seamlessly integrate into your daily life, bringing joy through their
                functionality and beauty.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="text-center space-y-2">
              <h3 className="text-lg uppercase tracking-wider font-medium">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                Premium materials and expert craftsmanship in every product
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg uppercase tracking-wider font-medium">Timeless Design</h3>
              <p className="text-sm text-muted-foreground">
                Classic aesthetics that never go out of style
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg uppercase tracking-wider font-medium">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Committed to ethical and sustainable practices
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
