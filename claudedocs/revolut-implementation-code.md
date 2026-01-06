# Revolut Integration - Implementation Code Examples

## Directory Structure

```
src/
├── lib/
│   └── revolut/
│       ├── client.ts       # Main API client
│       ├── auth.ts         # Authentication handling
│       ├── types.ts        # TypeScript interfaces
│       ├── rates.ts        # FX rate service
│       ├── webhooks.ts     # Webhook verification
│       └── index.ts        # Exports
├── app/
│   └── api/
│       └── webhooks/
│           └── revolut/
│               └── route.ts  # Webhook endpoint
└── services/
    └── reconciliation.ts     # Payment matching
```

---

## Core Implementation Files

### 1. Type Definitions (`src/lib/revolut/types.ts`)

```typescript
// Revolut API Types
export interface RevolutAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  state: 'active' | 'inactive';
  public: boolean;
  created_at: string;
  updated_at: string;
}

export interface RevolutCounterparty {
  id: string;
  name: string;
  phone?: string;
  profile_type: 'personal' | 'business';
  country: string;
  state: 'created' | 'deleted';
  created_at: string;
  updated_at: string;
  accounts: RevolutCounterpartyAccount[];
}

export interface RevolutCounterpartyAccount {
  id: string;
  currency: string;
  type: 'revolut' | 'external';
  account_no?: string;
  sort_code?: string;
  iban?: string;
  bic?: string;
  bank_country?: string;
  recipient_charges?: 'no' | 'expected';
}

export interface RevolutTransaction {
  id: string;
  type: 'transfer' | 'card_payment' | 'exchange' | 'fee' | 'refund';
  state: 'pending' | 'completed' | 'declined' | 'failed' | 'reverted';
  reason_code?: string;
  created_at: string;
  completed_at?: string;
  updated_at: string;
  merchant?: { name: string; city: string; category_code: string };
  reference?: string;
  legs: RevolutTransactionLeg[];
}

export interface RevolutTransactionLeg {
  leg_id: string;
  account_id: string;
  counterparty?: { id: string; type: string; account_id: string };
  amount: number;
  currency: string;
  description: string;
  balance?: number;
  bill_amount?: number;
  bill_currency?: string;
}

export interface RevolutExchangeRate {
  from: { amount: number; currency: string };
  to: { amount: number; currency: string };
  rate: number;
  fee: { amount: number; currency: string };
  rate_date: string;
}

export interface RevolutWebhookEvent {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface CreateCounterpartyInput {
  company_name?: string;
  individual_name?: { first_name: string; last_name: string };
  profile_type: 'personal' | 'business';
  bank_country: string;
  currency: string;
  account_no?: string;
  sort_code?: string;
  iban?: string;
  bic?: string;
  email?: string;
  phone?: string;
  address?: {
    street_line1: string;
    street_line2?: string;
    city: string;
    region?: string;
    postcode: string;
    country: string;
  };
}

export interface CreateTransferInput {
  request_id: string; // Idempotency key
  account_id: string;
  receiver: {
    counterparty_id: string;
    account_id?: string;
  };
  amount: number;
  currency: string;
  reference?: string;
  transfer_reason_code?: string;
}
```

### 2. Authentication (`src/lib/revolut/auth.ts`)

```typescript
import crypto from 'crypto';

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
}

interface AuthConfig {
  clientId: string;
  privateKey: string;
  refreshToken: string;
  baseUrl: string;
}

class RevolutAuth {
  private config: AuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  private generateClientAssertion(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.config.clientId,
      sub: this.config.clientId,
      aud: 'https://revolut.com',
      iat: now,
      exp: now + 60,
    };

    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
      .toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .sign('RSA-SHA256', Buffer.from(`${header}.${body}`), this.config.privateKey)
      .toString('base64url');

    return `${header}.${body}.${signature}`;
  }

  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const response = await fetch(`${this.config.baseUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: this.generateClientAssertion(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();

    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000);

    return this.accessToken;
  }
}

export const revolutAuth = new RevolutAuth({
  clientId: process.env.REVOLUT_CLIENT_ID!,
  privateKey: process.env.REVOLUT_PRIVATE_KEY!,
  refreshToken: process.env.REVOLUT_REFRESH_TOKEN!,
  baseUrl: process.env.REVOLUT_API_URL || 'https://b2b.revolut.com/api/1.0',
});
```

### 3. API Client (`src/lib/revolut/client.ts`)

```typescript
import { revolutAuth } from './auth';
import type {
  RevolutAccount,
  RevolutCounterparty,
  RevolutTransaction,
  RevolutExchangeRate,
  CreateCounterpartyInput,
  CreateTransferInput,
} from './types';

const BASE_URL = process.env.REVOLUT_API_URL || 'https://b2b.revolut.com/api/1.0';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await revolutAuth.getAccessToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Revolut API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

export const revolutClient = {
  // Accounts
  async getAccounts(): Promise<RevolutAccount[]> {
    return apiRequest<RevolutAccount[]>('/accounts');
  },

  async getAccount(accountId: string): Promise<RevolutAccount> {
    return apiRequest<RevolutAccount>(`/accounts/${accountId}`);
  },

  // Counterparties
  async getCounterparties(): Promise<RevolutCounterparty[]> {
    return apiRequest<RevolutCounterparty[]>('/counterparties');
  },

  async getCounterparty(id: string): Promise<RevolutCounterparty> {
    return apiRequest<RevolutCounterparty>(`/counterparty/${id}`);
  },

  async createCounterparty(
    data: CreateCounterpartyInput
  ): Promise<RevolutCounterparty> {
    return apiRequest<RevolutCounterparty>('/counterparty', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteCounterparty(id: string): Promise<void> {
    await apiRequest(`/counterparty/${id}`, { method: 'DELETE' });
  },

  // Transactions
  async getTransactions(params?: {
    from?: string;
    to?: string;
    counterparty?: string;
    count?: number;
    type?: string;
  }): Promise<RevolutTransaction[]> {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.set('from', params.from);
    if (params?.to) searchParams.set('to', params.to);
    if (params?.counterparty) searchParams.set('counterparty', params.counterparty);
    if (params?.count) searchParams.set('count', params.count.toString());
    if (params?.type) searchParams.set('type', params.type);

    return apiRequest<RevolutTransaction[]>(
      `/transactions?${searchParams.toString()}`
    );
  },

  async getTransaction(id: string): Promise<RevolutTransaction> {
    return apiRequest<RevolutTransaction>(`/transaction/${id}`);
  },

  // Transfers
  async createTransfer(data: CreateTransferInput): Promise<RevolutTransaction> {
    return apiRequest<RevolutTransaction>('/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Exchange Rates
  async getExchangeRate(
    from: string,
    to: string,
    amount: number = 1
  ): Promise<RevolutExchangeRate> {
    return apiRequest<RevolutExchangeRate>(
      `/rate?from=${from}&to=${to}&amount=${amount}`
    );
  },

  // Exchange (requires PAY scope)
  async exchangeCurrency(data: {
    request_id: string;
    from: { account_id: string; currency: string; amount: number };
    to: { account_id: string; currency: string };
    reference?: string;
  }): Promise<RevolutTransaction> {
    return apiRequest<RevolutTransaction>('/exchange', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

### 4. FX Rate Service (`src/lib/revolut/rates.ts`)

```typescript
import { revolutClient } from './client';

interface RateResult {
  rate: number;
  source: 'revolut' | 'xe' | 'openexchange';
  timestamp: Date;
  fee?: number;
}

// Cache for rates (1-minute TTL)
const rateCache = new Map<string, { rate: RateResult; expires: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export async function getExchangeRate(
  from: string,
  to: string
): Promise<RateResult> {
  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    return cached.rate;
  }

  try {
    // Try Revolut first
    const revolutRate = await revolutClient.getExchangeRate(from, to);
    const result: RateResult = {
      rate: revolutRate.rate,
      source: 'revolut',
      timestamp: new Date(revolutRate.rate_date),
      fee: revolutRate.fee.amount,
    };

    rateCache.set(cacheKey, { rate: result, expires: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (error) {
    console.warn('Revolut rate unavailable, falling back to XE:', error);
    return getFallbackRate(from, to);
  }
}

async function getFallbackRate(from: string, to: string): Promise<RateResult> {
  // XE API fallback
  const response = await fetch(
    `https://api.xe.com/v1/convert_from.json?from=${from}&to=${to}&amount=1`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.XE_API_ID}:${process.env.XE_API_KEY}`
        ).toString('base64')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get exchange rate from XE');
  }

  const data = await response.json();
  return {
    rate: data.to[0].mid,
    source: 'xe',
    timestamp: new Date(data.timestamp),
  };
}

export function calculateCustomerRate(
  baseRate: number,
  markupPercentage: number
): number {
  // Markup reduces the rate customer receives
  return baseRate * (1 - markupPercentage / 100);
}
```

### 5. Webhook Handler (`src/app/api/webhooks/revolut/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import type { RevolutWebhookEvent, RevolutTransaction } from '@/lib/revolut/types';

const WEBHOOK_SECRET = process.env.REVOLUT_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('Revolut-Signature') || '';

  // Verify webhook signature
  if (!verifySignature(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event: RevolutWebhookEvent = JSON.parse(rawBody);
  const supabase = createClient();

  // Store event for audit
  await supabase.from('revolut_webhook_events').insert({
    event_id: `${event.event}_${event.timestamp}`,
    event_type: event.event,
    payload: event.data,
  });

  try {
    switch (event.event) {
      case 'TransactionCreated':
        await handleTransactionCreated(event.data as RevolutTransaction);
        break;
      case 'TransactionStateChanged':
        await handleTransactionStateChanged(event.data as RevolutTransaction);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function handleTransactionCreated(tx: RevolutTransaction) {
  const supabase = createClient();

  // Check if this is an incoming payment with a matching reference
  if (tx.type === 'transfer' && tx.state === 'completed') {
    const reference = tx.reference;

    if (reference) {
      // Find matching pending remittance
      const { data: paymentRef } = await supabase
        .from('revolut_payment_references')
        .select('*, transactions(*)')
        .eq('reference', reference)
        .eq('status', 'pending')
        .single();

      if (paymentRef) {
        const receivedAmount = tx.legs[0]?.amount || 0;

        // Update payment reference
        await supabase
          .from('revolut_payment_references')
          .update({
            received_amount: receivedAmount,
            received_at: new Date().toISOString(),
            revolut_transaction_id: tx.id,
            status: 'matched',
          })
          .eq('id', paymentRef.id);

        // Update transaction status to processing
        await supabase
          .from('transactions')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('id', paymentRef.transaction_id);

        console.log(`Matched payment for transaction: ${paymentRef.transaction_id}`);
      }
    }
  }
}

async function handleTransactionStateChanged(tx: RevolutTransaction) {
  const supabase = createClient();

  // Update local record if we have it
  const { data: paymentRef } = await supabase
    .from('revolut_payment_references')
    .select('*')
    .eq('revolut_transaction_id', tx.id)
    .single();

  if (paymentRef) {
    if (tx.state === 'declined' || tx.state === 'failed') {
      await supabase
        .from('revolut_payment_references')
        .update({ status: 'failed' })
        .eq('id', paymentRef.id);

      // Update main transaction
      await supabase
        .from('transactions')
        .update({
          status: 'failed',
          failure_reason: tx.reason_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRef.transaction_id);
    }
  }
}
```

### 6. Payment Reference Generator (`src/lib/revolut/reference.ts`)

```typescript
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Generate unique payment reference for reconciliation
export function generatePaymentReference(transactionId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  // Format: RF-{timestamp}-{random}
  // e.g., RF-M5X2Y-A3B4C5
  return `RF-${timestamp}-${random}`;
}

export async function createPaymentReference(
  transactionId: string,
  expectedAmount: number,
  currency: string = 'GBP'
): Promise<string> {
  const supabase = createClient();
  const reference = generatePaymentReference(transactionId);

  await supabase.from('revolut_payment_references').insert({
    transaction_id: transactionId,
    reference,
    expected_amount: expectedAmount,
    expected_currency: currency,
    status: 'pending',
  });

  return reference;
}

export async function matchPaymentByReference(
  reference: string
): Promise<{ transactionId: string; matched: boolean } | null> {
  const supabase = createClient();

  const { data } = await supabase
    .from('revolut_payment_references')
    .select('transaction_id, status')
    .eq('reference', reference)
    .single();

  if (!data) return null;

  return {
    transactionId: data.transaction_id,
    matched: data.status === 'matched',
  };
}
```

---

## Environment Variables

```bash
# .env.local

# Revolut API
REVOLUT_API_URL=https://b2b.revolut.com/api/1.0
REVOLUT_CLIENT_ID=your_client_id
REVOLUT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
REVOLUT_REFRESH_TOKEN=your_refresh_token
REVOLUT_WEBHOOK_SECRET=your_webhook_secret

# Fallback FX Rate Provider
XE_API_ID=your_xe_api_id
XE_API_KEY=your_xe_api_key
```

---

## Usage Examples

### Get Live Exchange Rate

```typescript
import { getExchangeRate, calculateCustomerRate } from '@/lib/revolut/rates';

// Get GBP to NGN rate
const rateInfo = await getExchangeRate('GBP', 'NGN');
console.log(`1 GBP = ${rateInfo.rate} NGN (source: ${rateInfo.source})`);

// Apply 2% markup
const customerRate = calculateCustomerRate(rateInfo.rate, 2);
console.log(`Customer rate: 1 GBP = ${customerRate} NGN`);
```

### Create Customer Payment Reference

```typescript
import { createPaymentReference } from '@/lib/revolut/reference';

// When customer initiates transfer
const reference = await createPaymentReference(
  transactionId,
  100, // Expected GBP amount
  'GBP'
);

// Display to customer
console.log(`Please use reference: ${reference} when making payment`);
```

### Check Revolut Account Balance

```typescript
import { revolutClient } from '@/lib/revolut';

const accounts = await revolutClient.getAccounts();
const gbpAccount = accounts.find((a) => a.currency === 'GBP');
console.log(`GBP Balance: £${gbpAccount?.balance}`);
```

---

## Migration SQL

```sql
-- Run in Supabase SQL Editor

-- Create Revolut-related tables
CREATE TABLE IF NOT EXISTS revolut_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revolut_account_id VARCHAR(50) UNIQUE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  name VARCHAR(100),
  balance DECIMAL(18, 2) DEFAULT 0,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revolut_payment_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  reference VARCHAR(50) UNIQUE NOT NULL,
  expected_amount DECIMAL(18, 2) NOT NULL,
  expected_currency VARCHAR(3) DEFAULT 'GBP',
  received_amount DECIMAL(18, 2),
  received_at TIMESTAMPTZ,
  revolut_transaction_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'failed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revolut_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(100) UNIQUE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_payment_ref_reference ON revolut_payment_references(reference);
CREATE INDEX idx_payment_ref_status ON revolut_payment_references(status);
CREATE INDEX idx_payment_ref_transaction ON revolut_payment_references(transaction_id);
CREATE INDEX idx_webhook_events_type ON revolut_webhook_events(event_type);
```
