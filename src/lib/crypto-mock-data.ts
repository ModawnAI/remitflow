import type {
  TransactionWithCrypto,
  CryptoTransactionDetails,
  CryptoLeg,
  CryptoRateQuote,
  RailComparison,
  RemittanceRail,
  CryptoStage,
} from '@/types';

// Realistic exchange rates as of January 2025
const LIVE_RATES = {
  GBP_USD: 1.2685,
  GBP_NGN_TRADITIONAL: 1685.50, // Traditional bank rate (worse)
  USD_USDT: 1.0, // 1:1 via Revolut (no fee during business hours)
  USDT_NGN: 1578.25, // Yellow Card off-ramp rate (better)
} as const;

// Realistic fee structures
const FEES = {
  traditional: {
    fixedGBP: 2.99,
    percentageMarkup: 0.045, // 4.5% FX markup
  },
  cryptoFast: {
    revolutFx: 0.004, // 0.4% during hours
    stablecoinMint: 0, // Free 1:1 conversion
    yellowCardOfframp: 0.015, // 1.5% Yellow Card fee
    networkFee: 0.50, // ~$0.50 for Polygon/Tron
  },
  cryptoCheap: {
    revolutFx: 0.004,
    stablecoinMint: 0,
    yellowCardOfframp: 0.01, // 1% with batching
    networkFee: 0.10, // Batched, lower per-tx
  },
} as const;

// Nigerian bank details for realistic mock data
const NIGERIAN_BANKS = [
  { code: '058', name: 'GTBank', swift: 'GTBINGLA' },
  { code: '011', name: 'First Bank', swift: 'FBNINGLA' },
  { code: '057', name: 'Zenith Bank', swift: 'ZEABORLAG' },
  { code: '044', name: 'Access Bank', swift: 'ACCBPHHC' },
  { code: '033', name: 'UBA', swift: 'UNABORLAG' },
  { code: '032', name: 'Union Bank', swift: 'UBNMNGLA' },
  { code: '070', name: 'Fidelity Bank', swift: 'FIDTNGLA' },
  { code: '039', name: 'Stanbic IBTC', swift: 'SBICNGLX' },
  { code: '214', name: 'FCMB', swift: 'FCMBNGLA' },
  { code: '076', name: 'Polaris Bank', swift: 'PLATELAG' },
] as const;

// Realistic Nigerian recipient names
const NIGERIAN_NAMES = [
  'Adebayo Okonkwo', 'Chioma Eze', 'Emeka Nwosu', 'Oluwaseun Adeyemi',
  'Ngozi Okoro', 'Chukwudi Okafor', 'Funke Adesanya', 'Tunde Bakare',
  'Amara Nwachukwu', 'Ifeanyi Agu', 'Yetunde Olaniyan', 'Obinna Eze',
  'Adaobi Nnamdi', 'Kayode Fashola', 'Blessing Udoh', 'Chinedu Obi',
] as const;

// UK sender names
const UK_SENDERS = [
  { name: 'John Smith', phone: '+44 7700 900123' },
  { name: 'Sarah Johnson', phone: '+44 7911 123456' },
  { name: 'Michael Brown', phone: '+44 7850 987654' },
  { name: 'Emma Wilson', phone: '+44 7712 345678' },
  { name: 'David Lee', phone: '+44 7923 456789' },
  { name: 'Olumide Adeyinka', phone: '+44 7834 567890' },
  { name: 'Grace Okonkwo', phone: '+44 7745 678901' },
  { name: 'James Chen', phone: '+44 7656 789012' },
] as const;

/**
 * Calculate rail comparison for given GBP amount
 */
export function calculateRailComparison(amountGBP: number): RailComparison {
  // Traditional calculation
  const traditionalFee = FEES.traditional.fixedGBP + (amountGBP * FEES.traditional.percentageMarkup);
  const traditionalNetGBP = amountGBP - FEES.traditional.fixedGBP;
  const traditionalNGN = traditionalNetGBP * LIVE_RATES.GBP_NGN_TRADITIONAL;

  // Crypto Fast calculation (GBP → USD → USDT → NGN)
  const cryptoFastUSD = amountGBP * LIVE_RATES.GBP_USD * (1 - FEES.cryptoFast.revolutFx);
  const cryptoFastUSDT = cryptoFastUSD * LIVE_RATES.USD_USDT; // 1:1 free
  const cryptoFastFeeUSD = cryptoFastUSDT * FEES.cryptoFast.yellowCardOfframp + FEES.cryptoFast.networkFee;
  const cryptoFastNGN = (cryptoFastUSDT - cryptoFastFeeUSD) * LIVE_RATES.USDT_NGN;
  const cryptoFastTotalFees = (amountGBP * FEES.cryptoFast.revolutFx) + (cryptoFastFeeUSD / LIVE_RATES.GBP_USD);

  // Crypto Cheap calculation (batched, slower)
  const cryptoCheapUSD = amountGBP * LIVE_RATES.GBP_USD * (1 - FEES.cryptoCheap.revolutFx);
  const cryptoCheapUSDT = cryptoCheapUSD * LIVE_RATES.USD_USDT;
  const cryptoCheapFeeUSD = cryptoCheapUSDT * FEES.cryptoCheap.yellowCardOfframp + FEES.cryptoCheap.networkFee;
  const cryptoCheapNGN = (cryptoCheapUSDT - cryptoCheapFeeUSD) * LIVE_RATES.USDT_NGN;
  const cryptoCheapTotalFees = (amountGBP * FEES.cryptoCheap.revolutFx) + (cryptoCheapFeeUSD / LIVE_RATES.GBP_USD);

  return {
    traditional: {
      receiveAmount: Math.round(traditionalNGN),
      fees: Number(traditionalFee.toFixed(2)),
      feePercentage: Number(((traditionalFee / amountGBP) * 100).toFixed(2)),
      estimatedTime: '1-3 business days',
      estimatedMinutes: 2880, // 2 days average
    },
    cryptoFast: {
      receiveAmount: Math.round(cryptoFastNGN),
      fees: Number(cryptoFastTotalFees.toFixed(2)),
      feePercentage: Number(((cryptoFastTotalFees / amountGBP) * 100).toFixed(2)),
      estimatedTime: '10-30 minutes',
      estimatedMinutes: 20,
      savings: Math.round(cryptoFastNGN - traditionalNGN),
      savingsPercentage: Number((((cryptoFastNGN - traditionalNGN) / traditionalNGN) * 100).toFixed(2)),
    },
    cryptoCheap: {
      receiveAmount: Math.round(cryptoCheapNGN),
      fees: Number(cryptoCheapTotalFees.toFixed(2)),
      feePercentage: Number(((cryptoCheapTotalFees / amountGBP) * 100).toFixed(2)),
      estimatedTime: '2-6 hours',
      estimatedMinutes: 240,
      savings: Math.round(cryptoCheapNGN - traditionalNGN),
      savingsPercentage: Number((((cryptoCheapNGN - traditionalNGN) / traditionalNGN) * 100).toFixed(2)),
    },
  };
}

/**
 * Generate crypto rate quote
 */
export function generateCryptoQuote(
  amountGBP: number,
  rail: RemittanceRail
): CryptoRateQuote {
  const comparison = calculateRailComparison(amountGBP);
  const railData = rail === 'crypto_fast' ? comparison.cryptoFast : comparison.cryptoCheap;

  const usdAmount = amountGBP * LIVE_RATES.GBP_USD;
  const fxFee = usdAmount * (rail === 'crypto_fast' ? FEES.cryptoFast.revolutFx : FEES.cryptoCheap.revolutFx);
  const offrampFee = rail === 'crypto_fast' ? FEES.cryptoFast.yellowCardOfframp : FEES.cryptoCheap.yellowCardOfframp;

  return {
    id: `QT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    rail,
    sendAmount: amountGBP,
    sendCurrency: 'GBP',
    receiveAmount: railData.receiveAmount,
    receiveCurrency: 'NGN',
    effectiveRate: railData.receiveAmount / amountGBP,
    breakdown: {
      gbpToUsd: { rate: LIVE_RATES.GBP_USD, fee: Number(fxFee.toFixed(4)) },
      usdToUsdt: { rate: 1.0, fee: 0 },
      usdtToNgn: { rate: LIVE_RATES.USDT_NGN, fee: offrampFee },
    },
    totalFees: railData.fees,
    totalFeesPercentage: railData.feePercentage,
    estimatedTime: railData.estimatedTime,
    estimatedTimeMinutes: railData.estimatedMinutes,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min expiry
    savingsVsTraditional: {
      amount: railData.savings,
      percentage: railData.savingsPercentage,
    },
  };
}

/**
 * Generate crypto legs for a transaction
 */
export function generateCryptoLegs(
  amountGBP: number,
  rail: RemittanceRail,
  stage: CryptoStage,
  createdAt: Date
): CryptoLeg[] {
  const comparison = calculateRailComparison(amountGBP);
  const isFast = rail === 'crypto_fast';
  const usdAmount = amountGBP * LIVE_RATES.GBP_USD;
  const fxFee = usdAmount * (isFast ? FEES.cryptoFast.revolutFx : FEES.cryptoCheap.revolutFx);
  const netUSD = usdAmount - fxFee;
  const offrampFee = netUSD * (isFast ? FEES.cryptoFast.yellowCardOfframp : FEES.cryptoCheap.yellowCardOfframp);
  const networkFee = isFast ? FEES.cryptoFast.networkFee : FEES.cryptoCheap.networkFee;
  const finalUSDT = netUSD - offrampFee - networkFee;

  const stageOrder: CryptoStage[] = [
    'initiated', 'gbp_received', 'converting_to_usd', 'usd_converted',
    'converting_to_usdt', 'usdt_acquired', 'sending_to_offramp',
    'offramp_processing', 'ngn_disbursed', 'completed'
  ];
  const currentIndex = stageOrder.indexOf(stage);

  const legs: CryptoLeg[] = [
    {
      id: 'leg-1-fx',
      type: 'fiat_conversion',
      provider: 'revolut',
      status: currentIndex >= 3 ? 'completed' : currentIndex >= 2 ? 'processing' : 'pending',
      inputAmount: amountGBP,
      inputCurrency: 'GBP',
      outputAmount: Number(netUSD.toFixed(2)),
      outputCurrency: 'USD',
      fee: Number(fxFee.toFixed(2)),
      startedAt: currentIndex >= 2 ? new Date(createdAt.getTime() + 60000).toISOString() : undefined,
      completedAt: currentIndex >= 3 ? new Date(createdAt.getTime() + 180000).toISOString() : undefined,
      estimatedDuration: 120, // 2 minutes
    },
    {
      id: 'leg-2-mint',
      type: 'stablecoin_mint',
      provider: 'revolut_x',
      status: currentIndex >= 5 ? 'completed' : currentIndex >= 4 ? 'processing' : 'pending',
      inputAmount: Number(netUSD.toFixed(2)),
      inputCurrency: 'USD',
      outputAmount: Number(netUSD.toFixed(2)), // 1:1
      outputCurrency: 'USDT',
      fee: 0,
      startedAt: currentIndex >= 4 ? new Date(createdAt.getTime() + 200000).toISOString() : undefined,
      completedAt: currentIndex >= 5 ? new Date(createdAt.getTime() + 260000).toISOString() : undefined,
      estimatedDuration: 60, // 1 minute
    },
    {
      id: 'leg-3-transfer',
      type: 'blockchain_transfer',
      provider: 'revolut_x',
      status: currentIndex >= 7 ? 'completed' : currentIndex >= 6 ? 'processing' : 'pending',
      inputAmount: Number(netUSD.toFixed(2)),
      inputCurrency: 'USDT',
      outputAmount: Number((netUSD - networkFee).toFixed(2)),
      outputCurrency: 'USDT',
      fee: networkFee,
      txHash: currentIndex >= 6 ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined,
      startedAt: currentIndex >= 6 ? new Date(createdAt.getTime() + 280000).toISOString() : undefined,
      completedAt: currentIndex >= 7 ? new Date(createdAt.getTime() + 400000).toISOString() : undefined,
      estimatedDuration: isFast ? 120 : 600, // 2 min fast, 10 min batched
    },
    {
      id: 'leg-4-offramp',
      type: 'offramp',
      provider: 'yellow_card',
      status: currentIndex >= 9 ? 'completed' : currentIndex >= 7 ? 'processing' : 'pending',
      inputAmount: Number((netUSD - networkFee).toFixed(2)),
      inputCurrency: 'USDT',
      outputAmount: Math.round(finalUSDT * LIVE_RATES.USDT_NGN),
      outputCurrency: 'NGN',
      fee: Number(offrampFee.toFixed(2)),
      startedAt: currentIndex >= 7 ? new Date(createdAt.getTime() + 420000).toISOString() : undefined,
      completedAt: currentIndex >= 9 ? new Date(createdAt.getTime() + 900000).toISOString() : undefined,
      estimatedDuration: isFast ? 480 : 3600, // 8 min fast, 1 hour batched
    },
  ];

  return legs;
}

/**
 * Generate realistic mock transactions with crypto rails
 */
export function generateMockCryptoTransactions(): TransactionWithCrypto[] {
  const now = new Date();

  const transactions: TransactionWithCrypto[] = [
    // Completed crypto fast transaction (15 min ago)
    {
      id: 'TXN-CF-001',
      reference: 'RF-CF-78234',
      status: 'completed',
      sendAmount: 500,
      sendCurrency: 'GBP',
      receiveAmount: 796542,
      receiveCurrency: 'NGN',
      exchangeRate: 1593.08,
      fee: 2.85,
      senderId: 'USR-001',
      senderName: 'Olumide Adeyinka',
      senderPhone: '+44 7834 567890',
      recipientId: 'RCP-001',
      recipientName: 'Adebayo Okonkwo',
      recipientBank: 'GTBank',
      recipientAccount: '****5678',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      rail: 'crypto_fast',
      crypto: {
        rail: 'crypto_fast',
        stage: 'completed',
        legs: generateCryptoLegs(500, 'crypto_fast', 'completed', new Date(now.getTime() - 15 * 60 * 1000)),
        totalCryptoFees: 2.85,
        savingsVsTraditional: 12340,
        savingsPercentage: 1.55,
        estimatedCompletionTime: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        blockchainNetwork: 'polygon',
        stablecoin: 'USDT',
      },
    },
    // In-progress crypto fast (off-ramp processing)
    {
      id: 'TXN-CF-002',
      reference: 'RF-CF-78235',
      status: 'processing',
      sendAmount: 1000,
      sendCurrency: 'GBP',
      receiveAmount: 1593084,
      receiveCurrency: 'NGN',
      exchangeRate: 1593.08,
      fee: 5.70,
      senderId: 'USR-002',
      senderName: 'Grace Okonkwo',
      senderPhone: '+44 7745 678901',
      recipientId: 'RCP-002',
      recipientName: 'Chioma Eze',
      recipientBank: 'First Bank',
      recipientAccount: '****1234',
      createdAt: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      rail: 'crypto_fast',
      crypto: {
        rail: 'crypto_fast',
        stage: 'offramp_processing',
        legs: generateCryptoLegs(1000, 'crypto_fast', 'offramp_processing', new Date(now.getTime() - 8 * 60 * 1000)),
        totalCryptoFees: 5.70,
        savingsVsTraditional: 24680,
        savingsPercentage: 1.55,
        estimatedCompletionTime: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
        blockchainNetwork: 'polygon',
        stablecoin: 'USDT',
      },
    },
    // In-progress crypto cheap (converting to USDT - batched)
    {
      id: 'TXN-CC-001',
      reference: 'RF-CC-45123',
      status: 'processing',
      sendAmount: 2000,
      sendCurrency: 'GBP',
      receiveAmount: 3198452,
      receiveCurrency: 'NGN',
      exchangeRate: 1599.23,
      fee: 8.40,
      senderId: 'USR-003',
      senderName: 'John Smith',
      senderPhone: '+44 7700 900123',
      recipientId: 'RCP-003',
      recipientName: 'Emeka Nwosu',
      recipientBank: 'Zenith Bank',
      recipientAccount: '****9012',
      createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      rail: 'crypto_cheap',
      crypto: {
        rail: 'crypto_cheap',
        stage: 'converting_to_usdt',
        legs: generateCryptoLegs(2000, 'crypto_cheap', 'converting_to_usdt', new Date(now.getTime() - 45 * 60 * 1000)),
        totalCryptoFees: 8.40,
        savingsVsTraditional: 68950,
        savingsPercentage: 2.16,
        estimatedCompletionTime: new Date(now.getTime() + 90 * 60 * 1000).toISOString(),
        blockchainNetwork: 'tron',
        stablecoin: 'USDT',
      },
    },
    // Completed traditional transaction (2 days ago)
    {
      id: 'TXN-TR-001',
      reference: 'RF-TR-34567',
      status: 'completed',
      sendAmount: 750,
      sendCurrency: 'GBP',
      receiveAmount: 1230893,
      receiveCurrency: 'NGN',
      exchangeRate: 1685.50,
      fee: 19.99,
      senderId: 'USR-004',
      senderName: 'Sarah Johnson',
      senderPhone: '+44 7911 123456',
      recipientId: 'RCP-004',
      recipientName: 'Oluwaseun Adeyemi',
      recipientBank: 'Access Bank',
      recipientAccount: '****3456',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      rail: 'traditional',
    },
    // Failed crypto transaction
    {
      id: 'TXN-CF-003',
      reference: 'RF-CF-78236',
      status: 'failed',
      sendAmount: 300,
      sendCurrency: 'GBP',
      receiveAmount: 0,
      receiveCurrency: 'NGN',
      exchangeRate: 1593.08,
      fee: 0,
      senderId: 'USR-005',
      senderName: 'Michael Brown',
      senderPhone: '+44 7850 987654',
      recipientId: 'RCP-005',
      recipientName: 'Ngozi Okoro',
      recipientBank: 'UBA',
      recipientAccount: '****7890',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
      failureReason: 'Recipient bank account validation failed - account number mismatch',
      rail: 'crypto_fast',
      crypto: {
        rail: 'crypto_fast',
        stage: 'failed',
        legs: generateCryptoLegs(300, 'crypto_fast', 'sending_to_offramp', new Date(now.getTime() - 3 * 60 * 60 * 1000)),
        totalCryptoFees: 0,
        savingsVsTraditional: 0,
        savingsPercentage: 0,
        estimatedCompletionTime: '',
        blockchainNetwork: 'polygon',
        stablecoin: 'USDT',
      },
    },
    // Pending crypto cheap (waiting for batch)
    {
      id: 'TXN-CC-002',
      reference: 'RF-CC-45124',
      status: 'pending',
      sendAmount: 5000,
      sendCurrency: 'GBP',
      receiveAmount: 7996130,
      receiveCurrency: 'NGN',
      exchangeRate: 1599.23,
      fee: 21.00,
      senderId: 'USR-006',
      senderName: 'Emma Wilson',
      senderPhone: '+44 7712 345678',
      recipientId: 'RCP-006',
      recipientName: 'Chukwudi Okafor',
      recipientBank: 'Fidelity Bank',
      recipientAccount: '****2345',
      createdAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      rail: 'crypto_cheap',
      crypto: {
        rail: 'crypto_cheap',
        stage: 'gbp_received',
        legs: generateCryptoLegs(5000, 'crypto_cheap', 'gbp_received', new Date(now.getTime() - 2 * 60 * 1000)),
        totalCryptoFees: 21.00,
        savingsVsTraditional: 172375,
        savingsPercentage: 2.16,
        estimatedCompletionTime: new Date(now.getTime() + 240 * 60 * 1000).toISOString(),
        blockchainNetwork: 'tron',
        stablecoin: 'USDT',
      },
    },
    // Crypto fast - USDT acquired stage
    {
      id: 'TXN-CF-004',
      reference: 'RF-CF-78237',
      status: 'processing',
      sendAmount: 800,
      sendCurrency: 'GBP',
      receiveAmount: 1274467,
      receiveCurrency: 'NGN',
      exchangeRate: 1593.08,
      fee: 4.56,
      senderId: 'USR-007',
      senderName: 'David Lee',
      senderPhone: '+44 7923 456789',
      recipientId: 'RCP-007',
      recipientName: 'Funke Adesanya',
      recipientBank: 'Stanbic IBTC',
      recipientAccount: '****6789',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 1000).toISOString(),
      rail: 'crypto_fast',
      crypto: {
        rail: 'crypto_fast',
        stage: 'usdt_acquired',
        legs: generateCryptoLegs(800, 'crypto_fast', 'usdt_acquired', new Date(now.getTime() - 5 * 60 * 1000)),
        totalCryptoFees: 4.56,
        savingsVsTraditional: 19744,
        savingsPercentage: 1.55,
        estimatedCompletionTime: new Date(now.getTime() + 8 * 60 * 1000).toISOString(),
        blockchainNetwork: 'polygon',
        stablecoin: 'USDT',
      },
    },
    // Traditional pending
    {
      id: 'TXN-TR-002',
      reference: 'RF-TR-34568',
      status: 'processing',
      sendAmount: 400,
      sendCurrency: 'GBP',
      receiveAmount: 656300,
      receiveCurrency: 'NGN',
      exchangeRate: 1685.50,
      fee: 10.99,
      senderId: 'USR-008',
      senderName: 'James Chen',
      senderPhone: '+44 7656 789012',
      recipientId: 'RCP-008',
      recipientName: 'Tunde Bakare',
      recipientBank: 'FCMB',
      recipientAccount: '****8901',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      rail: 'traditional',
    },
  ];

  return transactions;
}

/**
 * Get current live rates
 */
export function getCurrentRates() {
  return {
    ...LIVE_RATES,
    lastUpdated: new Date().toISOString(),
    source: 'revolut',
  };
}

/**
 * Get fee structure
 */
export function getFeeStructure() {
  return FEES;
}

/**
 * Get list of supported Nigerian banks
 */
export function getSupportedBanks() {
  return NIGERIAN_BANKS;
}
