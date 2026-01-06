// Transaction types
export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface Transaction {
  id: string;
  reference: string;
  status: TransactionStatus;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  senderId: string;
  senderName: string;
  senderPhone: string;
  recipientId: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
  rail?: RemittanceRail;
}

export interface TransactionEvent {
  id: string;
  transactionId: string;
  type: string;
  status: 'success' | 'failed' | 'pending';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// User and KYC types
export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type KYCTier = 'basic' | 'standard' | 'enhanced';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  kycStatus: KYCStatus;
  kycTier: KYCTier;
  transactionLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

export interface KYCApplication {
  id: string;
  userId: string;
  userName?: string;
  userPhone: string;
  status: KYCStatus;
  tier: KYCTier;
  documents: KYCDocument[];
  biometricResult?: BiometricResult;
  amlResult?: AMLResult;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface KYCDocument {
  id: string;
  type: 'passport' | 'driving_license' | 'national_id' | 'selfie' | 'proof_of_address';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

export interface BiometricResult {
  provider: 'smile_id';
  matchScore: number;
  livenessScore: number;
  passed: boolean;
  verifiedAt: string;
}

export interface AMLResult {
  pepMatch: boolean;
  sanctionsMatch: boolean;
  adverseMediaMatch: boolean;
  riskScore: number;
  screenedAt: string;
}

// Alert types
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  readAt?: string;
}

// Metric types
export interface Metric {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'number' | 'percentage';
  currency?: string;
}

// Recipient types
export interface Recipient {
  id: string;
  userId: string;
  name: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  createdAt: string;
  lastUsedAt?: string;
}

// Report types
export interface Report {
  id: string;
  name: string;
  type: 'transaction' | 'compliance' | 'financial';
  status: 'generating' | 'completed' | 'failed';
  format: 'csv' | 'pdf' | 'xlsx';
  url?: string;
  createdAt: string;
  generatedBy: string;
}

// Settings types
export interface FXSettings {
  baseMargin: number;
  tier1Margin: number;
  tier2Margin: number;
  updateFrequencyMinutes: number;
  rateSource: string;
}

export interface LimitSettings {
  basic: {
    perTransaction: number;
    daily: number;
    monthly: number;
  };
  standard: {
    perTransaction: number;
    daily: number;
    monthly: number;
  };
  enhanced: {
    perTransaction: number;
    daily: number;
    monthly: number;
  };
}

// Filter types
export interface TransactionFilters {
  status?: TransactionStatus[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  rail?: RemittanceRail[];
}

// Crypto Remittance Types
export type RemittanceRail = 'traditional' | 'crypto_fast' | 'crypto_cheap';

export type CryptoStage =
  | 'initiated'
  | 'gbp_received'
  | 'converting_to_usd'
  | 'usd_converted'
  | 'converting_to_usdt'
  | 'usdt_acquired'
  | 'sending_to_offramp'
  | 'offramp_processing'
  | 'ngn_disbursed'
  | 'completed'
  | 'failed';

export interface CryptoLeg {
  id: string;
  type: 'fiat_conversion' | 'stablecoin_mint' | 'blockchain_transfer' | 'offramp';
  provider: CryptoProvider;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputAmount: number;
  inputCurrency: string;
  outputAmount: number;
  outputCurrency: string;
  fee: number;
  txHash?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // seconds
}

export type CryptoProvider =
  | 'revolut'
  | 'revolut_x'
  | 'yellow_card'
  | 'circle'
  | 'moonpay';

export interface CryptoTransactionDetails {
  rail: RemittanceRail;
  stage: CryptoStage;
  legs: CryptoLeg[];
  totalCryptoFees: number;
  savingsVsTraditional: number;
  savingsPercentage: number;
  estimatedCompletionTime: string;
  blockchainNetwork?: 'ethereum' | 'polygon' | 'tron' | 'solana';
  stablecoin?: 'USDT' | 'USDC';
}

export interface CryptoRateQuote {
  id: string;
  rail: RemittanceRail;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  effectiveRate: number;
  breakdown: {
    gbpToUsd: { rate: number; fee: number };
    usdToUsdt: { rate: number; fee: number };
    usdtToNgn: { rate: number; fee: number };
  };
  totalFees: number;
  totalFeesPercentage: number;
  estimatedTime: string;
  estimatedTimeMinutes: number;
  expiresAt: string;
  savingsVsTraditional: {
    amount: number;
    percentage: number;
  };
}

export interface RailComparison {
  traditional: {
    receiveAmount: number;
    fees: number;
    feePercentage: number;
    estimatedTime: string;
    estimatedMinutes: number;
  };
  cryptoFast: {
    receiveAmount: number;
    fees: number;
    feePercentage: number;
    estimatedTime: string;
    estimatedMinutes: number;
    savings: number;
    savingsPercentage: number;
  };
  cryptoCheap: {
    receiveAmount: number;
    fees: number;
    feePercentage: number;
    estimatedTime: string;
    estimatedMinutes: number;
    savings: number;
    savingsPercentage: number;
  };
}

// Extended Transaction with optional crypto fields
export interface TransactionWithCrypto extends Transaction {
  rail: RemittanceRail;
  crypto?: CryptoTransactionDetails;
}
