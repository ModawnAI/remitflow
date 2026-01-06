# RemitFlow API Integration Analysis

## Executive Summary

After comprehensive analysis of Revolut Business API capabilities for RemitFlow (UK→Nigeria GBP→NGN remittance), a **critical limitation** was identified:

> **Revolut cannot send NGN to Nigeria. Only USD transfers to Nigeria are supported.**

This necessitates a **hybrid architecture** leveraging Revolut for UK-side operations and Flutterwave for Nigeria-side disbursements.

---

## 1. Research Findings

### 1.1 Revolut Business API Capabilities

| Feature | Capability | RemitFlow Relevance |
|---------|------------|---------------------|
| Multi-currency accounts | 25+ currencies | ✅ GBP account management |
| Payments API | `/pay` endpoint | ✅ UK customer refunds |
| Counterparties | Bank account storage | ✅ Recipient pre-validation |
| FX Conversion | Real-time rates | ⚠️ Cannot convert to NGN |
| Account Management | Balance, statements | ✅ Treasury management |
| Webhooks | Payment status updates | ✅ Real-time sync |

**Authentication**:
- Bearer token with 40-minute expiry
- OAuth 2.0 flow for access tokens
- Scopes: READ, WRITE, PAY, READ_SENSITIVE_CARD_DATA

**Key Endpoints**:
```
POST /pay                    - Create payment
GET  /accounts               - List accounts
POST /counterparty           - Create counterparty
GET  /transactions           - Transaction history
POST /exchange               - FX conversion
```

### 1.2 Critical Limitation: Nigeria/NGN

From Revolut documentation:
> "You can use Revolut to send money to Nigeria. However, you can only send it in US dollars (USD)."
> "You can't convert currency to and from NGN in your account."

**Impact on RemitFlow**:
- ❌ Cannot use Revolut for GBP→NGN conversion
- ❌ Cannot use Revolut for NGN disbursement to Nigerian banks
- ✅ Can use Revolut for GBP collection and treasury

### 1.3 Flutterwave API (Alternative for Nigeria)

| Feature | Capability | RemitFlow Relevance |
|---------|------------|---------------------|
| Real-Time FX | GBP→NGN conversion | ✅ Core remittance function |
| Nigerian Banks | 20+ banks supported | ✅ Recipient payouts |
| Account Resolution | Validate accounts | ✅ Pre-transfer validation |
| Payout Subaccounts | Multi-currency | ✅ Treasury management |
| Webhooks | Transfer status | ✅ Real-time updates |

**Key Endpoints**:
```
GET  /transfers/rates        - Real-time FX rates
GET  /banks?country=NG       - Nigerian bank list
POST /banks/account-resolve  - Validate bank account
POST /direct-transfers       - Execute payout
GET  /transfers/{id}         - Transfer status
```

---

## 2. Recommended Hybrid Architecture

### 2.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        REMITFLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │   UK SIDE    │     │   TREASURY   │     │   NIGERIA SIDE   │ │
│  │              │     │              │     │                  │ │
│  │  • Revolut   │ ──▶ │  • Internal  │ ──▶ │  • Flutterwave   │ │
│  │  • GBP Acct  │     │  • FX Logic  │     │  • NGN Payout    │ │
│  │  • UK Rails  │     │  • Margin    │     │  • Bank API      │ │
│  └──────────────┘     └──────────────┘     └──────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

**Revolut (UK Side)**:
- GBP collection from UK customers
- UK bank account management
- FCA-compliant payment processing
- Customer refund processing
- Statement generation for compliance

**Internal Treasury**:
- Exchange rate management with margins
- Liquidity pool management
- Transaction orchestration
- Risk and limit management
- Reconciliation

**Flutterwave (Nigeria Side)**:
- Real-time GBP→NGN FX rates
- Nigerian bank account validation
- NGN disbursement to recipients
- Transfer status tracking
- Settlement management

---

## 3. Simplification Opportunities

### 3.1 Bank Account Validation (NEW)

**Current State**: Manual recipient bank details entry
**With Flutterwave**: Real-time account validation

```typescript
// Before: Trust user input
const recipient = {
  bankCode: '044',
  accountNumber: '0690000031',
  name: 'User-entered name' // No validation
};

// After: Validate via Flutterwave
const validation = await flutterwave.banks.resolveAccount({
  account_number: '0690000031',
  account_bank: '044'
});
// Returns: { account_name: 'JOHN DOE', account_number: '0690000031' }
```

**Benefits**:
- Prevent failed transfers due to wrong account numbers
- Auto-fill recipient name (reduces input errors)
- Improved user experience

### 3.2 Real-Time Exchange Rates (IMPROVED)

**Current State**: Manual rate management in `fx_rates` table
**With Flutterwave**: Real-time API rates + configurable margins

```typescript
// Current: Static rates from database
const rate = await supabase
  .from('fx_rates')
  .select('rate, markup')
  .eq('from_currency', 'GBP')
  .eq('to_currency', 'NGN')
  .single();

// Improved: Real-time rates with internal margin
const flutterwaveRate = await flutterwave.transfers.getRates({
  source: 'GBP',
  destination: 'NGN',
  amount: 100
});

const customerRate = flutterwaveRate.rate * (1 - kycTierMargin);
```

**Benefits**:
- Always current rates (no manual updates)
- Competitive pricing
- Margin management per KYC tier (already in your types)

### 3.3 Transaction Status Automation (NEW)

**Current State**: Manual status updates
**With APIs**: Webhook-driven status sync

```typescript
// Webhook handler for both APIs
export async function handleWebhook(provider: 'revolut' | 'flutterwave', event: WebhookEvent) {
  const statusMap = {
    'payment.completed': 'processing',    // GBP received
    'transfer.successful': 'completed',   // NGN delivered
    'transfer.failed': 'failed',
  };

  await supabase
    .from('transactions')
    .update({ status: statusMap[event.type] })
    .eq('external_ref', event.reference);

  // Also insert transaction_event for audit trail
  await supabase
    .from('transaction_events')
    .insert({
      transaction_id: transactionId,
      event_type: event.type,
      title: getEventTitle(event.type),
      description: event.description,
      metadata: event
    });
}
```

**Benefits**:
- Real-time status updates
- Complete audit trail
- No polling required

### 3.4 Simplified Error Handling

Both APIs provide structured error responses that map to RemitFlow's `failureReason`:

```typescript
// Flutterwave error mapping
const errorMap = {
  'INSUFFICIENT_BALANCE': 'Provider liquidity issue - please retry',
  'INVALID_ACCOUNT': 'Recipient bank account not found',
  'BANK_UNAVAILABLE': 'Recipient bank temporarily unavailable',
};
```

---

## 4. Data Model Enhancements

### 4.1 New Fields for API Integration

```sql
-- Add to transactions table
ALTER TABLE transactions ADD COLUMN revolut_payment_id TEXT;
ALTER TABLE transactions ADD COLUMN flutterwave_transfer_id TEXT;
ALTER TABLE transactions ADD COLUMN provider_rate NUMERIC(12,4);
ALTER TABLE transactions ADD COLUMN internal_margin NUMERIC(6,4);

-- Add to recipients table
ALTER TABLE recipients ADD COLUMN flutterwave_validated BOOLEAN DEFAULT FALSE;
ALTER TABLE recipients ADD COLUMN validated_name TEXT;
ALTER TABLE recipients ADD COLUMN last_validated_at TIMESTAMPTZ;
```

### 4.2 New Table: Provider Rates Cache

```sql
CREATE TABLE provider_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'flutterwave', 'revolut'
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  buy_rate NUMERIC(12,6) NOT NULL,
  sell_rate NUMERIC(12,6) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_provider_rates_currencies
  ON provider_rates(from_currency, to_currency, provider);
```

---

## 5. Implementation Roadmap

### Phase 1: Flutterwave Integration (Priority)
**Scope**: Nigeria-side disbursement (core remittance function)

1. **API Client Setup**
   - Create `src/lib/flutterwave/client.ts`
   - Implement token management
   - Add webhook handlers

2. **Bank Account Validation**
   - Integrate `/banks/account-resolve`
   - Update recipient creation flow
   - Add validation UI feedback

3. **Real-Time FX Rates**
   - Integrate `/transfers/rates`
   - Implement rate caching (5-min TTL)
   - Apply KYC tier margins

4. **Transfer Execution**
   - Integrate `/direct-transfers`
   - Map to transaction lifecycle
   - Implement retry logic

### Phase 2: Revolut Integration (Enhancement)
**Scope**: UK-side operations

1. **API Client Setup**
   - Create `src/lib/revolut/client.ts`
   - Implement OAuth token refresh
   - Configure webhooks

2. **Account Monitoring**
   - GBP balance visibility
   - Transaction reconciliation
   - Statement export

3. **Counterparty Management**
   - Pre-register recurring recipients
   - Faster payment initiation

### Phase 3: Treasury Orchestration
**Scope**: Internal operations

1. **Liquidity Management**
   - Balance monitoring alerts
   - Auto-rebalancing triggers

2. **Margin Optimization**
   - Rate comparison engine
   - Dynamic margin adjustment

3. **Reconciliation**
   - Cross-provider matching
   - Discrepancy alerts

---

## 6. Service Layer Architecture

```typescript
// src/lib/remittance/index.ts

interface RemittanceService {
  // Quote generation
  getQuote(params: QuoteParams): Promise<Quote>;

  // Recipient validation
  validateRecipient(bankCode: string, accountNumber: string): Promise<RecipientValidation>;

  // Transaction lifecycle
  createTransfer(params: TransferParams): Promise<Transfer>;
  getTransferStatus(id: string): Promise<TransferStatus>;
  cancelTransfer(id: string): Promise<void>;

  // Rate management
  getCurrentRate(from: string, to: string): Promise<Rate>;
}

// Provider implementations
class FlutterwaveProvider implements NigeriaProvider { }
class RevolutProvider implements UKProvider { }

// Orchestrator
class RemittanceOrchestrator implements RemittanceService {
  constructor(
    private ukProvider: UKProvider,
    private ngProvider: NigeriaProvider,
    private treasury: TreasuryService
  ) {}
}
```

---

## 7. Security Considerations

### API Credentials
- Store in environment variables (never in code)
- Use Supabase Vault for production secrets
- Rotate keys quarterly

### Webhook Verification
```typescript
// Flutterwave webhook verification
function verifyFlutterwaveWebhook(req: Request): boolean {
  const hash = req.headers.get('verif-hash');
  return hash === process.env.FLUTTERWAVE_WEBHOOK_SECRET;
}

// Revolut webhook verification
function verifyRevolutWebhook(req: Request, body: string): boolean {
  const signature = req.headers.get('Revolut-Request-Timestamp');
  // HMAC verification logic
}
```

### Rate Limiting
- Implement request queuing for API calls
- Cache frequently accessed data
- Use exponential backoff for retries

---

## 8. Cost Analysis

| Item | Revolut | Flutterwave |
|------|---------|-------------|
| API Access | Grow plan (~£25/mo) | Free tier available |
| Transfer Fee | £0.20 local, £3 intl | 0.5-2% of transfer |
| FX Margin | ~0.4% | ~1-2% (negotiable) |
| Webhook | Included | Included |

**Recommendation**:
- Start with Flutterwave for Nigeria (core function)
- Add Revolut when UK treasury management needed
- Negotiate volume discounts with Flutterwave

---

## 9. Summary of Improvements

| Area | Current | With Integration |
|------|---------|------------------|
| Bank Validation | Manual entry | Real-time API validation |
| Exchange Rates | Manual in DB | Live API + auto-margin |
| Transfer Status | Manual updates | Webhook automation |
| Error Handling | Generic | Provider-specific mapping |
| Audit Trail | Basic events | Full API response logging |
| Rate Updates | Admin action | 5-min auto-refresh |
| Recipient Verify | None | Name matching from bank |

---

## 10. Next Steps

1. **Immediate**: Set up Flutterwave sandbox account
2. **Week 1**: Implement bank validation endpoint
3. **Week 2**: Integrate real-time FX rates
4. **Week 3**: Build transfer execution flow
5. **Week 4**: Add webhook handlers and testing
6. **Future**: Evaluate Revolut for UK-side enhancements

---

*Analysis Date: 2026-01-06*
*Analyst: Claude Code (ultrathink mode)*
