import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getMetaobject, getShippingDetails } from '@/lib/shopify';

interface ProductDeliveryInfoProps {
  description: string;
}

export default function ProductDeliveryInfo({ description }: ProductDeliveryInfoProps) {
  const [deliveryTime, setDeliveryTime] = useState<string>('7');
  const [shippingDetails, setShippingDetails] = useState<Array<Record<string, string>>>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delivery = await getMetaobject('delivery');
        if (delivery?.time) {
          setDeliveryTime(delivery.time);
        }
      } catch (error) {
        console.error('Error fetching delivery data:', error);
      }

      try {
        const details = await getShippingDetails();
        setShippingDetails(details);
      } catch (error) {
        console.error('Error fetching shipping details:', error);
      }
    };

    fetchData();

    // Animate progress steps
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { icon: CheckCircle2, label: 'הזמנה בוצעה', progress: 0 },
    { icon: Package, label: 'נארז ונשלח', progress: 50 },
    { icon: Truck, label: 'המשלוח יגיע', progress: 100 },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      MapPin,
      Package,
      Truck,
      CheckCircle2,
    };
    return icons[iconName] || MapPin;
  };

  return (
    <div className="space-y-6">
      {/* Delivery Timeline */}
      <div className="bg-secondary/30 rounded-lg p-6 space-y-4" dir="rtl">
        <div className="flex items-center justify-center gap-2 text-lg">
          <span className="font-medium">המשלוח יגיע תוך</span>
          <span className="font-bold text-primary">{deliveryTime}</span>
          <span className="font-medium">ימי עסקים</span>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const showProgress = index < currentStep;

            return (
              <div key={index} className="space-y-2">
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  className="flex items-center justify-end gap-3"
                >
                  <span className={`text-sm ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </motion.div>

                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.5 }}
                  >
                    <Progress
                      value={showProgress ? 100 : 0}
                      className="h-1.5"
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping Details */}
      {shippingDetails.length > 0 && (
        <div className="rounded-lg p-6 space-y-3" style={{ backgroundColor: '#F4E3C1' }} dir="rtl">
          {shippingDetails.map((detail, index) => {
            const IconComponent = getIconComponent(detail.icon);
            return (
              <div key={index} className="flex items-start justify-end gap-3">
                <p className="text-sm text-right">{detail.description}</p>
                <IconComponent className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details */}
      <div className="bg-secondary/30 rounded-lg p-6" dir="rtl">
        <h3 className="text-lg font-medium mb-3 text-right">פרטי המוצר</h3>
        <div
          className="text-sm text-muted-foreground text-right leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
}
