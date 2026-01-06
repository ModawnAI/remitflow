# Revolut Business API Integration Strategy for RemitFlow

## Executive Summary

This analysis explores how Revolut Business API can enhance RemitFlow's UK to Nigeria remittance operations. While **Revolut does not support direct NGN transfers**, the API offers significant value for GBP collection, FX rate sourcing, and operational automation.

---

## 1. Current State Analysis

### RemitFlow Architecture
| Component | Current Implementation |
|-----------|----------------------|
| Transaction Flow | GBP → NGN with local payout partner |
| FX Rate Source | Manual/external provider |
| Payment Collection | Direct bank transfer/card |
| Recipient Management | Internal database |
| Compliance | Internal KYC + AML screening |

### Key Data Types (from `src/types/index.ts`)
- `Transaction`: GBP→NGN with exchange rate, fees
- `Recipient`: Nigerian bank details (bankCode, accountNumber)
- `FXSettings`: markup, rate source, update frequency

---

## 2. Revolut Business API Capabilities Assessment

### 2.1 What Revolut CAN Do

| Capability | API Endpoint | Benefit for RemitFlow |
|------------|--------------|----------------------|
| **GBP Account Management** | `/accounts` | Hold and manage GBP funds |
| **Real-time FX Rates** | `/rate` | Live GBP/NGN reference rates |
| **Currency Exchange** | `/exchange` | Convert GBP to supported currencies |
| **Bank Transfer Collection** | `/pay`, `/counterparty` | Receive GBP from UK customers |
| **Transaction History** | `/transactions` | Automated reconciliation |
| **Webhook Notifications** | `/webhooks` | Real-time payment notifications |

### 2.2 Critical Limitation: NGN Not Supported

**Revolut does NOT support:**
- Holding NGN in accounts
- Direct transfers to Nigeria
- GBP→NGN currency exchange

**Implication**: Revolut cannot replace your Nigerian payout partner. It can only handle the **GBP collection side** of the remittance.

### 2.3 Supported Currencies for International Transfers
```
GBP, EUR, USD, AED, AUD, CAD, CHF, CZK, DKK, HKD, HUF,
ILS, INR, JPY, KRW, MXN, NOK, NZD, PHP, PLN, RON,
SAR, SEK, SGD, THB, TRY, USD, ZAR
```

---

## 3. Integration Strategy

### 3.1 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RemitFlow System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Customer   │───▶│   Revolut    │───▶│  RemitFlow   │  │
│  │   (GBP)      │    │   Business   │    │   Backend    │  │
│  └──────────────┘    │   Account    │    └──────┬───────┘  │
│                      └──────────────┘           │          │
│                                                 │          │
│  ┌──────────────────────────────────────────────▼───────┐  │
│  │              Nigerian Payout Partner                 │  │
│  │         (Flutterwave/Paystack/Interswitch)          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Integration Points

#### A. GBP Collection Layer (Revolut)
```typescript
// Collect GBP from UK customers
interface RevolutPaymentCollection {
  // Create counterparty for incoming payments
  createCustomerCounterparty(customer: Customer): Promise<Counterparty>;

  // Generate payment reference
  generatePaymentReference(transactionId: string): string;

  // Webhook for payment confirmation
  handlePaymentWebhook(event: PaymentEvent): Promise<void>;
}
```

#### B. FX Rate Service (Revolut + Fallback)
```typescript
// Use Revolut for live FX rates
interface FXRateService {
  // Get live GBP/NGN reference rate
  getExchangeRate(from: 'GBP', to: 'NGN'): Promise<{
    rate: number;
    timestamp: Date;
    source: 'revolut' | 'xe' | 'openexchange';
  }>;

  // Calculate customer rate with markup
  getCustomerRate(baseRate: number, markup: number): number;
}
```

**Note**: While Revolut doesn't exchange GBP→NGN directly, they may provide reference rates. If not, use XE API or Open Exchange Rates as fallback.

#### C. Reconciliation Layer (Revolut)
```typescript
// Automate treasury operations
interface ReconciliationService {
  // Sync transactions from Revolut
  syncRevolutTransactions(): Promise<Transaction[]>;

  // Match incoming GBP to pending remittances
  matchPaymentToTransaction(payment: RevolutPayment): Promise<Transaction>;

  // Update transaction status
  updateTransactionStatus(id: string, status: TransactionStatus): Promise<void>;
}
```

---

## 4. Implementation Phases

### Phase 1: GBP Collection Automation (4-6 weeks)

**Objective**: Accept GBP payments via Revolut Business Account

**Tasks**:
1. Set up Revolut Business Account (Grow plan or higher)
2. Generate API credentials and configure sandbox
3. Implement counterparty creation for customers
4. Set up webhook for payment notifications
5. Auto-match incoming payments to pending transactions

**Code Changes**:
```typescript
// New service: src/lib/revolut/client.ts
export class RevolutClient {
  private baseUrl = 'https://b2b.revolut.com/api/1.0';

  async getAccounts(): Promise<Account[]>;
  async createCounterparty(data: CounterpartyInput): Promise<Counterparty>;
  async getTransactions(accountId: string): Promise<Transaction[]>;
}
```

### Phase 2: Real-time FX Rates (2-3 weeks)

**Objective**: Display live rates from Revolut with markup

**Tasks**:
1. Implement `/rate` endpoint integration
2. Cache rates with 1-minute TTL
3. Update `FXSettingsCard` to show Revolut as rate source
4. Add rate provider selection in settings

**Code Changes**:
```typescript
// Update: src/components/features/fx-settings-card.tsx
interface FXSettings {
  currentRate: number;
  markup: number;
  lastUpdated: string;
  autoUpdate: boolean;
  updateFrequency: number;
  provider: 'revolut' | 'xe' | 'manual';  // New field
}
```

### Phase 3: Automated Reconciliation (3-4 weeks)

**Objective**: Auto-reconcile GBP receipts with pending transfers

**Tasks**:
1. Set up webhooks for real-time notifications
2. Implement payment matching algorithm
3. Auto-update transaction status on GBP receipt
4. Generate reconciliation reports

### Phase 4: Treasury Optimization (Future)

**Objective**: Optimize currency holding and transfers

**Tasks**:
1. Multi-currency account management
2. Pre-fund USD/EUR for partner payouts
3. Automated FX hedging (if supported)

---

## 5. Technical Implementation Details

### 5.1 API Authentication

```typescript
// src/lib/revolut/auth.ts
interface RevolutAuth {
  clientId: string;
  privateKey: string; // RSA private key for JWT signing
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export async function getAccessToken(auth: RevolutAuth): Promise<string> {
  if (auth.accessToken && auth.expiresAt > new Date()) {
    return auth.accessToken;
  }

  // Refresh or generate new token
  const response = await fetch(`${REVOLUT_API}/auth/token`, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken,
    }),
  });

  const { access_token, expires_in } = await response.json();
  return access_token;
}
```

### 5.2 Webhook Integration

```typescript
// src/app/api/webhooks/revolut/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyRevolutSignature } from '@/lib/revolut/security';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const signature = request.headers.get('Revolut-Signature');

  if (!verifyRevolutSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  switch (body.event) {
    case 'TransactionCreated':
      await handleIncomingPayment(body.data);
      break;
    case 'TransactionStateChanged':
      await handleTransactionUpdate(body.data);
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 5.3 FX Rate Polling

```typescript
// src/lib/revolut/rates.ts
interface RateResponse {
  from: { amount: number; currency: string };
  to: { amount: number; currency: string };
  rate: number;
  fee: { amount: number; currency: string };
  rate_date: string;
}

export async function getGBPtoNGNRate(): Promise<number> {
  // Note: NGN may not be directly supported
  // Fallback to external provider if needed
  try {
    const response = await fetch(
      `${REVOLUT_API}/rate?from=GBP&to=NGN&amount=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      // Fallback to XE or Open Exchange Rates
      return await getExternalRate('GBP', 'NGN');
    }

    const data: RateResponse = await response.json();
    return data.rate;
  } catch (error) {
    return await getExternalRate('GBP', 'NGN');
  }
}
```

---

## 6. Database Schema Updates

### New Tables for Revolut Integration

```sql
-- Revolut account mapping
CREATE TABLE revolut_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revolut_account_id VARCHAR(50) UNIQUE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  name VARCHAR(100),
  balance DECIMAL(18, 2) DEFAULT 0,
  synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment references for matching
CREATE TABLE revolut_payment_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  reference VARCHAR(50) UNIQUE NOT NULL,
  expected_amount DECIMAL(18, 2) NOT NULL,
  expected_currency VARCHAR(3) DEFAULT 'GBP',
  received_amount DECIMAL(18, 2),
  received_at TIMESTAMP,
  revolut_transaction_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook events for audit
CREATE TABLE revolut_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(50) UNIQUE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Risk Analysis

### 7.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| NGN rate API unavailable | High | Medium | XE/OpenExchange fallback |
| API rate limits | Medium | Low | Request caching, backoff |
| Webhook delivery failures | Low | Medium | Polling backup, retry queue |
| Token expiration | Medium | Low | Auto-refresh logic |

### 7.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Revolut account suspension | Low | High | Multiple payment providers |
| Pricing changes | Medium | Medium | Cost monitoring, alerts |
| Feature deprecation | Low | Medium | Version pinning, monitoring |

---

## 8. Cost Analysis

### Revolut Business Pricing (Grow Plan - Required for API)

| Item | Cost |
|------|------|
| Monthly subscription | £25/month |
| GBP transfers (domestic) | Free |
| SEPA transfers | Free |
| SWIFT transfers | £3-5 per transfer |
| FX exchange | 0.4% during hours, 1% off-hours |

### ROI Considerations

- **Reduced manual reconciliation**: ~20 hours/month saved
- **Faster payment confirmation**: Real-time vs. 1-2 days
- **Lower FX spread**: Competitive rates vs. traditional banks
- **Automation**: Reduced operational errors

---

## 9. Alternative Approaches

### If Revolut NGN Support is Required

Consider these alternatives that DO support NGN:

| Provider | NGN Support | API Availability | Notes |
|----------|-------------|-----------------|-------|
| **Wise Business** | Yes | Full API | Better for NGN corridor |
| **Flutterwave** | Yes | Full API | Nigerian-focused |
| **Paystack** | Yes | Full API | Strong in Africa |
| **Lemfi** | Yes | Limited | UK-Africa specialist |

### Recommended Hybrid Approach

1. **Revolut**: GBP collection + treasury management
2. **Flutterwave/Paystack**: NGN payout in Nigeria
3. **XE API**: FX rate reference (backup)

---

## 10. Implementation Checklist

### Prerequisites
- [ ] Revolut Business Account (Grow plan+)
- [ ] API access approved
- [ ] SSL certificate for webhooks
- [ ] Nigerian payout partner API ready

### Phase 1: Setup
- [ ] Generate API credentials
- [ ] Configure sandbox environment
- [ ] Set up webhook endpoint
- [ ] Create Supabase tables for Revolut data

### Phase 2: Integration
- [ ] Implement Revolut client library
- [ ] Add counterparty creation flow
- [ ] Set up rate polling service
- [ ] Configure webhook handlers

### Phase 3: Testing
- [ ] Sandbox end-to-end testing
- [ ] Load testing for rate polling
- [ ] Webhook delivery testing
- [ ] Reconciliation accuracy testing

### Phase 4: Production
- [ ] Production API credentials
- [ ] Monitoring and alerting
- [ ] Documentation and runbooks
- [ ] Staff training

---

## 11. Conclusion

### Recommended Strategy

**Use Revolut for:**
1. GBP collection and account management
2. Payment matching and reconciliation automation
3. FX rate reference (with fallback)

**Do NOT use Revolut for:**
1. NGN payouts (not supported)
2. Direct GBP→NGN exchange (not supported)

### Next Steps

1. Apply for Revolut Business Grow plan
2. Request API access
3. Set up sandbox environment
4. Begin Phase 1 implementation

---

## Sources

- [Revolut Business API Documentation](https://developer.revolut.com/docs/business/business-api)
- [Revolut Supported Currencies](https://help.revolut.com/business/help/receiving-payments/currency-exchanges/which-currencies-can-i-exchange-and-keep-in-my-account/)
- [Revolut Transfer Destinations](https://help.revolut.com/business/help/receiving-payments/sending-money-to-an-external-bank-account/where-can-i-transfer-money/)
- [Revolut FX Exchange API](https://developer.revolut.com/docs/guides/manage-accounts/exchange-money)
- [Revolut Bank Transfers](https://developer.revolut.com/docs/guides/manage-accounts/transfers/bank-transfers)
