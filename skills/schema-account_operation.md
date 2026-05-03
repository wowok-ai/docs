# Schema: account_operation

> 100% LOCAL, NEVER ON-CHAIN - Manage WoWok accounts locally on device: generate, suspend, resume, faucet-test, operate assets, sign data, etc.

---

## Top-Level Structure

```typescript
AccountOperation {
  // Exactly ONE operation type must be specified
  gen?: GenOperation;
  faucet?: FaucetOperation;
  suspend?: SuspendOperation;
  resume?: ResumeOperation;
  rename?: RenameOperation;
  swap_name?: SwapNameOperation;
  transfer?: TransferOperation;
  get?: GetOperation;
  signData?: SignDataOperation;
  messenger?: MessengerOperation;
}
```

---

## Operation Types

### gen

Generate a new account.

```typescript
GenOperation {
  name?: string;              // Account name (max 64 chars). Empty = default account
  replaceExistName?: boolean; // Force claim existing name
  m?: string | null;          // Messenger name to enable. Null = disable
}
```

**Result**:

```typescript
GenResult {
  address: string;            // New account ID
  name?: string;              // Account name
  m?: string | null;          // Messenger name if enabled
}
```

---

### faucet

Distribute test coins from faucet.

```typescript
FaucetOperation {
  name_or_address?: string;   // Account name or address. Empty = default
  network: "localnet" | "testnet";
}
```

**Result**:

```typescript
FaucetResult {
  name_or_address?: string;
  result: {
    amount: number;
    id: string;
    transferTxDigest: string;
  }[];
  network: "localnet" | "testnet";
}
```

---

### suspend

Remove account from active list (cannot sign transactions).

```typescript
SuspendOperation {
  name_or_address?: string;   // Account name or address. Empty = default
}
```

**Result**:

```typescript
SuspendResult {
  name_or_address?: string;
  success: boolean;
}
```

---

### resume

Add account back to active list.

```typescript
ResumeOperation {
  address: string;            // Account ID (0x + 64 hex chars)
  name?: string;              // New name for resumed account
}
```

**Result**:

```typescript
ResumeResult {
  address: string;
  name?: string;
  success: boolean;
}
```

---

### rename

Rename an account.

```typescript
RenameOperation {
  name_or_address?: string;   // Source account. Empty = default
  new_name: string;           // New account name (max 64 chars)
}
```

**Result**:

```typescript
RenameResult {
  name_or_address?: string;
  new_name: string;
  success: boolean;
}
```

---

### swap_name

Swap names between two accounts.

```typescript
SwapNameOperation {
  name1?: string;             // First account name. Empty = default
  name2?: string;             // Second account name. Empty = default
}
```

**Result**:

```typescript
SwapNameResult {
  name1?: string;
  name2?: string;
  success: boolean;
}
```

---

### transfer

Transfer tokens between accounts.

```typescript
TransferOperation {
  name_or_address_from?: string;  // Sender. Empty = default
  name_or_address_to?: string;    // Recipient. Empty = default
  amount: number | string;        // Amount to transfer
  token_type?: string;            // Default: 0x2::wow::WOW
  network?: "localnet" | "testnet";
}
```

**Result**: `WowTransactionBlockResponse` (see Transaction Response Schema)

---

### get

Generate new coin object by required amount.

```typescript
GetOperation {
  name_or_address?: string;       // Account. Empty = default
  balance_required: number | string;
  token_type?: string;            // Default: 0x2::wow::WOW
  network?: "localnet" | "testnet";
}
```

**Result**:

```typescript
GetResult {
  coin_address?: string;          // New coin object ID
  name_or_address?: string;
  balance_required: number | string;
  token_type?: string;
  network?: "localnet" | "testnet";
}
```

---

### signData

Sign data with account's private key.

```typescript
SignDataOperation {
  name_or_address?: string;   // Account. Empty = default
  data: string;               // Data to sign
  data_encoding?: "utf8" | "base64" | "hex";  // Default: utf8
}
```

**Result**:

```typescript
SignDataResult {
  name_or_address?: string;
  signature: string;          // Signature in hex
  publicKey: string;          // Public key in hex
  address: string;            // Account address
}
```

---

### messenger

Enable or disable messenger for an account.

```typescript
MessengerOperation {
  name_or_account?: string;   // Account. Empty = default
  m: string | null;           // Messenger name. Null = disable
}
```

**Result**:

```typescript
MessengerResult {
  name_or_account?: string;
  m: string | null;
}
```

---

## Common Sub-Schemas

### WowTransactionBlockResponse

```typescript
WowTransactionBlockResponse {
  digest: string;
  effects?: TransactionEffects;
  events?: WowEvent[];
  balanceChanges?: BalanceChange[];
  objectChanges?: WowObjectChange[];
  errors?: string[];
  // ... additional fields
}
```

### TransactionEffects

```typescript
TransactionEffects {
  status: {
    status: "success" | "failure";
    error?: string;
  };
  gasUsed: {
    computationCost: string;
    storageCost: string;
    storageRebate: string;
    nonRefundableStorageFee: string;
  };
  gasObject: OwnedObjectRef;
  created?: OwnedObjectRef[];
  mutated?: OwnedObjectRef[];
  deleted?: WowObjectRef[];
  // ... additional fields
}
```

### WowEvent

```typescript
WowEvent {
  id: {
    eventSeq: string;
    txDigest: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: Record<string, string | number | boolean>;
  bcs: string;
  bcsEncoding: "base64" | "base58";
  timestampMs?: string;
}
```

### BalanceChange

```typescript
BalanceChange {
  amount: string;     // Negative for spending, positive for receiving
  coinType: string;
  owner: ObjectOwner;
}
```

### WowObjectChange

```typescript
WowObjectChange =
  | { type: "created"; objectId: string; objectType: string; owner: ObjectOwner; sender: string; version: string | number; digest: string }
  | { type: "mutated"; objectId: string; objectType: string; owner: ObjectOwner | null; sender: string; version: string | number; digest: string; previousVersion: string | number }
  | { type: "deleted"; objectId: string; objectType: string; sender: string; version: string | number }
  | { type: "transferred"; objectId: string; objectType: string; recipient: ObjectOwner; sender: string; version: string | number; digest: string }
  | { type: "wrapped"; objectId: string; objectType: string; sender: string; version: string | number }
  | { type: "published"; packageId: string; version: string | number; digest: string; modules: string[] };
```

### ObjectOwner

```typescript
ObjectOwner =
  | { AddressOwner: string }
  | { ObjectOwner: string }
  | { Shared: { initial_shared_version: number } }
  | "Immutable";
```

### WowObjectRef

```typescript
WowObjectRef {
  objectId: string;
  version: string | number;
  digest: string;
}
```

### OwnedObjectRef

```typescript
OwnedObjectRef {
  owner: ObjectOwner;
  reference: WowObjectRef;
}
```

---

## Output Structure

```typescript
AccountOperationOutput {
  status: "success" | "error";
  data?: AccountOperationResult;  // Present when status = "success"
  error?: string;                 // Present when status = "error"
}

// Wrapped format
{
  result: AccountOperationOutput;
}
```

### AccountOperationResult

```typescript
AccountOperationResult {
  gen?: GenResult;
  faucet?: FaucetResult;
  suspend?: SuspendResult;
  resume?: ResumeResult;
  rename?: RenameResult;
  swap_name?: SwapNameResult;
  transfer?: WowTransactionBlockResponse;
  get?: GetResult;
  signData?: SignDataResult;
  messenger?: MessengerResult;
}
```
