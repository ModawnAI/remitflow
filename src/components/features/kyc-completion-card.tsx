'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  WhatsappLogo,
  ArrowRight,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type VerificationStatus = 'processing' | 'approved' | 'pending_review';

interface KYCCompletionCardProps {
  status?: VerificationStatus;
}

export function KYCCompletionCard({ status = 'processing' }: KYCCompletionCardProps) {
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>(status);

  useEffect(() => {
    // Simulate status update after processing
    if (currentStatus === 'processing') {
      const timer = setTimeout(() => {
        setCurrentStatus('approved');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  const handleReturnToWhatsApp = () => {
    // TODO: Deep link back to WhatsApp
    window.location.href = 'https://wa.me/447123456789';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center">
          {currentStatus === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Clock size={40} className="text-accent animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Processing Your Verification
              </h2>
              <p className="text-muted-foreground">
                We&apos;re checking your documents. This usually takes just a few seconds...
              </p>
              <div className="flex justify-center gap-2 pt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-accent/60"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentStatus === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center"
              >
                <CheckCircle size={48} className="text-success" weight="fill" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Verification Complete!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Your identity has been verified successfully. You can now send money
                  with higher limits.
                </p>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <h3 className="font-medium text-foreground mb-2">Your new limits:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Single Transfer</p>
                    <p className="font-semibold text-foreground">Up to £1,000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Limit</p>
                    <p className="font-semibold text-foreground">Up to £10,000</p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleReturnToWhatsApp}
                className="w-full"
              >
                <WhatsappLogo size={24} weight="fill" />
                Return to WhatsApp
                <ArrowRight size={20} />
              </Button>

              <p className="text-xs text-muted-foreground">
                You can close this page and continue on WhatsApp
              </p>
            </motion.div>
          )}

          {currentStatus === 'pending_review' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
                <Clock size={40} className="text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Under Review
                </h2>
                <p className="text-muted-foreground mt-2">
                  Your documents are being reviewed by our team. This usually takes
                  up to 24 hours. We&apos;ll notify you on WhatsApp once complete.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleReturnToWhatsApp}
                className="w-full"
              >
                <WhatsappLogo size={24} weight="fill" />
                Return to WhatsApp
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
