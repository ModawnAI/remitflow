import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount with proper locale
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: Intl.NumberFormatOptions
): string {
  // Ensure minimumFractionDigits doesn't exceed maximumFractionDigits
  const maxDigits = options?.maximumFractionDigits ?? 2;
  const minDigits = options?.minimumFractionDigits ?? Math.min(2, maxDigits);

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
    ...options,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateObj, { dateStyle: 'short' });
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format crypto amount with proper decimals
 */
export function formatCryptoAmount(
  amount: number,
  currency: string
): string {
  const decimals = ['USDT', 'USDC', 'ETH', 'BTC'].includes(currency) ? 6 : 2;
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })} ${currency}`;
}

/**
 * Format estimated time for crypto transactions
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 minute';
  if (minutes < 60) return `~${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `~${hours} hour${hours > 1 ? 's' : ''}`;
  return `~${hours}h ${remainingMins}m`;
}

/**
 * Format savings percentage for display
 */
export function formatSavingsPercentage(percentage: number): string {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
}

/**
 * Get rail display name
 */
export function getRailDisplayName(rail: string): string {
  switch (rail) {
    case 'traditional':
      return 'Bank Transfer';
    case 'crypto_fast':
      return 'Crypto Express';
    case 'crypto_cheap':
      return 'Crypto Saver';
    default:
      return rail;
  }
}

/**
 * Get crypto stage display info
 */
export function getCryptoStageInfo(stage: string): { label: string; description: string } {
  const stages: Record<string, { label: string; description: string }> = {
    initiated: { label: 'Initiated', description: 'Transaction created' },
    gbp_received: { label: 'GBP Received', description: 'Payment confirmed by Revolut' },
    converting_to_usd: { label: 'Converting to USD', description: 'GBP → USD via Revolut FX' },
    usd_converted: { label: 'USD Ready', description: 'Funds converted to USD' },
    converting_to_usdt: { label: 'Minting USDT', description: 'USD → USDT (1:1 conversion)' },
    usdt_acquired: { label: 'USDT Ready', description: 'Stablecoin acquired' },
    sending_to_offramp: { label: 'Sending to Off-ramp', description: 'Transferring to Yellow Card' },
    offramp_processing: { label: 'Off-ramp Processing', description: 'Converting USDT → NGN' },
    ngn_disbursed: { label: 'NGN Sent', description: 'Funds sent to recipient bank' },
    completed: { label: 'Completed', description: 'Recipient received funds' },
    failed: { label: 'Failed', description: 'Transaction encountered an error' },
  };
  return stages[stage] || { label: stage, description: '' };
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: string): string {
  const providers: Record<string, string> = {
    revolut: 'Revolut',
    revolut_x: 'Revolut X Exchange',
    yellow_card: 'Yellow Card',
    circle: 'Circle',
    moonpay: 'MoonPay',
  };
  return providers[provider] || provider;
}

/**
 * Calculate progress percentage from crypto stage
 */
export function getCryptoProgressPercentage(stage: string): number {
  const stageProgress: Record<string, number> = {
    initiated: 5,
    gbp_received: 15,
    converting_to_usd: 25,
    usd_converted: 35,
    converting_to_usdt: 45,
    usdt_acquired: 55,
    sending_to_offramp: 65,
    offramp_processing: 80,
    ngn_disbursed: 95,
    completed: 100,
    failed: 0,
  };
  return stageProgress[stage] ?? 0;
}
