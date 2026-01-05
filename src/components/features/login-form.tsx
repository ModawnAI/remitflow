'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SignIn, Envelope, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OTPInput } from '@/components/ui/otp-input';

type LoginStep = 'credentials' | 'otp';

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('otp');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border p-8 shadow-lg"
    >
      {step === 'credentials' ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              label="Email address"
              placeholder="admin@remitflow.com"
              icon={<Envelope size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            <SignIn size={20} />
            Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Forgot your password?{' '}
            <button
              type="button"
              className="text-accent hover:text-accent/80 font-medium"
            >
              Reset it here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Two-Factor Authentication
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <OTPInput
            value={otp}
            onChange={setOtp}
            length={6}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={otp.length !== 6}
            className="w-full"
          >
            Verify
          </Button>

          <button
            type="button"
            onClick={() => setStep('credentials')}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Back to login
          </button>
        </form>
      )}
    </motion.div>
  );
}
