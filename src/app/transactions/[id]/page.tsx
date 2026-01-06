import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TransactionDetailPageWrapper } from '@/components/wrappers/transaction-detail-page-wrapper';
import { generateCryptoLegs } from '@/lib/crypto-mock-data';
import type { RemittanceRail, CryptoTransactionDetails, CryptoStage, TransactionEvent } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Transaction ${id} | RemitFlow Admin`,
    description: 'Transaction details and audit trail',
  };
}

// Mock crypto transaction scenarios
const cryptoScenarios: Record<string, {
  rail: RemittanceRail;
  stage: CryptoStage;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  senderName: string;
  recipientName: string;
  recipientBank: string;
  amountGBP: number;
}> = {
  'TXN-CRYPTO-001': {
    rail: 'crypto_fast',
    stage: 'completed',
    status: 'completed',
    senderName: 'James Wilson',
    recipientName: 'Chukwuemeka Nwosu',
    recipientBank: 'GTBank',
    amountGBP: 750,
  },
  'TXN-CRYPTO-002': {
    rail: 'crypto_fast',
    stage: 'offramp_processing',
    status: 'processing',
    senderName: 'Sarah Thompson',
    recipientName: 'Adaeze Obi',
    recipientBank: 'First Bank',
    amountGBP: 500,
  },
  'TXN-CRYPTO-003': {
    rail: 'crypto_cheap',
    stage: 'usdt_acquired',
    status: 'processing',
    senderName: 'Michael Chen',
    recipientName: 'Oluwaseun Adeyemi',
    recipientBank: 'Zenith Bank',
    amountGBP: 1200,
  },
  'TXN-CRYPTO-004': {
    rail: 'crypto_cheap',
    stage: 'completed',
    status: 'completed',
    senderName: 'Emily Roberts',
    recipientName: 'Ngozi Eze',
    recipientBank: 'Access Bank',
    amountGBP: 350,
  },
};

async function getTransaction(id: string) {
  // Check if it's a crypto transaction
  const cryptoScenario = cryptoScenarios[id];

  if (cryptoScenario) {
    const baseTime = Date.now() - 1800000; // 30 min ago
    const legs = generateCryptoLegs(
      cryptoScenario.amountGBP,
      cryptoScenario.rail,
      cryptoScenario.stage,
      new Date(baseTime)
    );
    const receiveAmount = legs[legs.length - 1]?.outputAmount || 0;
    const totalFees = legs.reduce((sum, leg) => sum + leg.fee, 0);
    const traditionalReceive = cryptoScenario.amountGBP * 1578.25; // Lower rate
    const savings = receiveAmount - traditionalReceive;

    // Mark legs as completed/processing based on stage
    const stageOrder: CryptoStage[] = [
      'initiated', 'gbp_received', 'converting_to_usd', 'usd_converted',
      'converting_to_usdt', 'usdt_acquired', 'sending_to_offramp',
      'offramp_processing', 'ngn_disbursed', 'completed'
    ];
    const currentStageIndex = stageOrder.indexOf(cryptoScenario.stage);

    // Map stages to legs
    const legStageMap: Record<number, CryptoStage[]> = {
      0: ['gbp_received', 'converting_to_usd', 'usd_converted'],
      1: ['converting_to_usdt', 'usdt_acquired'],
      2: ['sending_to_offramp'],
      3: ['offramp_processing', 'ngn_disbursed', 'completed'],
    };

    legs.forEach((leg, index) => {
      const legStages = legStageMap[index] || [];
      const legMaxStageIndex = Math.max(...legStages.map(s => stageOrder.indexOf(s)));
      const legMinStageIndex = Math.min(...legStages.map(s => stageOrder.indexOf(s)));

      if (currentStageIndex > legMaxStageIndex) {
        leg.status = 'completed';
        leg.completedAt = new Date(Date.now() - (legs.length - index) * 300000).toISOString();
      } else if (currentStageIndex >= legMinStageIndex) {
        leg.status = 'processing';
        leg.startedAt = new Date(Date.now() - 120000).toISOString();
      } else {
        leg.status = 'pending';
      }
    });

    const cryptoDetails: CryptoTransactionDetails = {
      rail: cryptoScenario.rail,
      stage: cryptoScenario.stage,
      legs,
      totalCryptoFees: totalFees,
      savingsVsTraditional: savings,
      savingsPercentage: (savings / traditionalReceive) * 100,
      estimatedCompletionTime: cryptoScenario.stage === 'completed'
        ? 'Completed'
        : cryptoScenario.rail === 'crypto_fast'
          ? '~8 minutes remaining'
          : '~45 minutes remaining',
      blockchainNetwork: cryptoScenario.rail === 'crypto_fast' ? 'polygon' : 'tron',
      stablecoin: 'USDT',
    };

    // Generate crypto-specific events
    const events: TransactionEvent[] = [
      {
        id: 'evt-1',
        transactionId: id,
        type: 'initiated',
        status: 'success',
        description: `${cryptoScenario.rail === 'crypto_fast' ? 'Crypto Express' : 'Crypto Saver'} transaction initiated`,
        timestamp: new Date(baseTime).toISOString(),
      },
      {
        id: 'evt-2',
        transactionId: id,
        type: 'payment_received',
        status: 'success',
        description: 'GBP payment confirmed',
        timestamp: new Date(baseTime + 60000).toISOString(),
      },
      {
        id: 'evt-3',
        transactionId: id,
        type: 'fx_conversion',
        status: 'success',
        description: 'GBP → USD converted via Revolut (0.4% fee)',
        timestamp: new Date(baseTime + 180000).toISOString(),
      },
      {
        id: 'evt-4',
        transactionId: id,
        type: 'stablecoin_mint',
        status: 'success',
        description: 'USD → USDT minted (1:1, no fee)',
        timestamp: new Date(baseTime + 240000).toISOString(),
      },
    ];

    if (currentStageIndex >= stageOrder.indexOf('sending_to_offramp')) {
      events.push({
        id: 'evt-5',
        transactionId: id,
        type: 'blockchain_transfer',
        status: 'success',
        description: `USDT sent to Yellow Card via ${cryptoScenario.rail === 'crypto_fast' ? 'Polygon' : 'Tron'}`,
        timestamp: new Date(baseTime + 360000).toISOString(),
      });
    }

    if (currentStageIndex >= stageOrder.indexOf('offramp_processing')) {
      events.push({
        id: 'evt-6',
        transactionId: id,
        type: 'offramp_started',
        status: cryptoScenario.stage === 'offramp_processing' ? 'pending' : 'success',
        description: 'Yellow Card processing USDT → NGN conversion',
        timestamp: new Date(baseTime + 480000).toISOString(),
      });
    }

    if (cryptoScenario.stage === 'completed') {
      events.push({
        id: 'evt-7',
        transactionId: id,
        type: 'completed',
        status: 'success',
        description: `NGN credited to ${cryptoScenario.recipientBank} account`,
        timestamp: new Date(baseTime + 720000).toISOString(),
      });
    }

    return {
      id,
      senderName: cryptoScenario.senderName,
      senderPhone: '+44 7700 ' + Math.floor(100000 + Math.random() * 900000),
      senderEmail: cryptoScenario.senderName.toLowerCase().replace(' ', '.') + '@email.com',
      recipientName: cryptoScenario.recipientName,
      recipientBank: cryptoScenario.recipientBank,
      recipientAccount: '0' + Math.floor(100000000 + Math.random() * 900000000),
      amountGBP: cryptoScenario.amountGBP,
      amountNGN: receiveAmount,
      exchangeRate: receiveAmount / cryptoScenario.amountGBP,
      fee: totalFees,
      status: cryptoScenario.status,
      paymentMethod: 'Apple Pay',
      createdAt: new Date(baseTime).toISOString(),
      completedAt: cryptoScenario.stage === 'completed' ? new Date(baseTime + 720000).toISOString() : undefined,
      events,
      rail: cryptoScenario.rail,
      crypto: cryptoDetails,
    };
  }

  // Traditional transaction (original mock)
  const mockTransaction = {
    id,
    senderName: 'John Smith',
    senderPhone: '+44 7700 900000',
    senderEmail: 'john.smith@email.com',
    recipientName: 'Adebayo Okonkwo',
    recipientBank: 'GTBank',
    recipientAccount: '0123456789',
    amountGBP: 500,
    amountNGN: 825000,
    exchangeRate: 1650,
    fee: 4.99,
    status: 'completed' as const,
    paymentMethod: 'Apple Pay',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString(),
    events: [
      {
        id: 'evt-1',
        transactionId: id,
        type: 'initiated',
        status: 'success' as const,
        description: 'Transaction initiated via WhatsApp',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'evt-2',
        transactionId: id,
        type: 'payment_received',
        status: 'success' as const,
        description: 'Apple Pay payment confirmed',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'evt-3',
        transactionId: id,
        type: 'compliance_check',
        status: 'success' as const,
        description: 'Compliance checks passed',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 'evt-4',
        transactionId: id,
        type: 'settlement_started',
        status: 'success' as const,
        description: 'Funds sent to liquidity provider in Nigeria',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'evt-5',
        transactionId: id,
        type: 'completed',
        status: 'success' as const,
        description: 'NGN credited to recipient account',
        timestamp: new Date().toISOString(),
      },
    ],
    rail: 'traditional' as RemittanceRail,
  };

  if (!id.startsWith('TXN-')) {
    return null;
  }

  return mockTransaction;
}

export default async function TransactionDetailPage({ params }: Props) {
  const { id } = await params;
  const transaction = await getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return <TransactionDetailPageWrapper transaction={transaction} />;
}
