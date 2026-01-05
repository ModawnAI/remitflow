'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, LockSimple } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
        <Icon size={20} className="text-accent" weight="fill" />
      </div>
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function KYCIntroCard() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Verification',
      description: 'Your data is encrypted and handled with the highest security standards',
    },
    {
      icon: Clock,
      title: 'Quick Process',
      description: 'Complete verification in just 2 minutes',
    },
    {
      icon: LockSimple,
      title: 'Privacy Protected',
      description: 'We only use your information for identity verification',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <FeatureItem {...feature} />
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
