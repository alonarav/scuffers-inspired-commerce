import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Using mailto as a simple form submission
    window.location.href = `mailto:hello@boutique.com?subject=${encodeURIComponent(
      subject as string
    )}&body=${encodeURIComponent(message as string)}%0D%0A%0D%0AFrom: ${email}`;

    toast.success('Opening your email client...');
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6">
              צרו איתנו קשר
            </h1>
            <p className="text-xl text-muted-foreground">
              נשמח לשמוע מכם
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light tracking-wider mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:hello@boutique.com"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        hello@boutique.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        123 Main Street
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                <div className="text-muted-foreground space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
