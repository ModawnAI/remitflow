'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function KYCStartButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    // Small delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push('/verify/document');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Button
        onClick={handleStart}
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <CircleNotch size={20} className="animate-spin" />
            Starting verification...
          </>
        ) : (
          <>
            Start Verification
            <ArrowRight size={20} />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-3">
        By continuing, you agree to our{' '}
        <button className="text-accent hover:underline">Terms of Service</button>
        {' '}and{' '}
        <button className="text-accent hover:underline">Privacy Policy</button>
      </p>
    </motion.div>
  );
}
