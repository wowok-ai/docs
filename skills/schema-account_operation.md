# Schema: account_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN. Manage WoWok accounts locally on the device. All operations are private and never touch the blockchain.

---

## Top-Level Structure

```
AccountOperation
├── Exactly one operation type (see below)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Operations

### gen — Generate New Account

```
{
  "gen": {
    "name": "my_account",           // Account name (max 64 chars, optional, empty = default)
    "m": "messenger_name",          // Enable messenger (optional, max 64 chars)
    "replaceExistName": false       // Replace existing name (default: false)
  }
}
```

**Notes**:
- If `name` is empty, generates the default account.
- If `replaceExistName` is false and name exists, throws error.
- `m` enables the encrypted messenger for this account.

---

### rename — Rename Account

```
{
  "rename": {
    "name_or_address": "old_name",  // Current name or address
    "new_name": "new_name"          // New name (max 64 chars)
  }
}
```

---

### suspend — Suspend Account

```
{
  "suspend": {
    "name_or_address": "account_name"  // Name or address to suspend
  }
}
```

**Effect**: Removes account from active list. Cannot sign transactions until resumed.

---

### resume — Resume Account

```
{
  "resume": {
    "address": "0x...",             // Full 66-char address (0x + 64 hex)
    "name": "new_name"              // Optional new name
  }
}
```

---

### swap_name — Swap Account Names

```
{
  "swap_name": {
    "name1": "account_a",
    "name2": "account_b"
  }
}
```

---

### transfer — Transfer Tokens Between Accounts

```
{
  "transfer": {
    "name_or_address_from": "sender",   // Sender (empty = default)
    "name_or_address_to": "recipient",  // Recipient
    "amount": "10WOW",                  // Amount (unit string or number)
    "token_type": "0x2::wow::WOW",      // Optional: non-default token type
    "network": "testnet"                // Required: localnet or testnet
  }
}
```

---

### faucet — Request Test Coins

```
{
  "faucet": {
    "name_or_address": "account_name",  // Target account (empty = default)
    "network": "testnet"                // Required: localnet or testnet
  }
}
```

**Note**: Only available on testnet and localnet.

---

### get — Generate Coin Object ID

```
{
  "get": {
    "name_or_address": "account_name",  // Source account (empty = default)
    "balance_required": "5WOW",         // Required balance amount
    "token_type": "0x2::wow::WOW",      // Optional: non-default token type
    "network": "testnet"                // Required
  }
}
```

**Returns**: Coin object ID with sufficient balance.

---

### messenger — Enable/Disable Messenger

```
{
  "messenger": {
    "name_or_account": "account_name",  // Target account (empty = default)
    "m": "messenger_name"               // Enable messenger (null = disable)
  }
}
```

---

### signData — Sign Data with Account

```
{
  "signData": {
    "name_or_address": "account_name",  // Signing account (empty = default)
    "data": "message_to_sign",          // Data to sign
    "data_encoding": "utf8"             // Optional: utf8 (default), base64, hex
  }
}
```

**Returns**: Signature bytes.

---

## AI Planning Notes

1. **Default account**: Use empty string `""` for the default account in all operations.
2. **Address format**: Full WoWok address is `0x` prefix + 64 hex characters (66 chars total).
3. **Network requirement**: `transfer`, `faucet`, and `get` require explicit `network` field.
4. **Token amounts**: Accept unit strings (e.g., `"2WOW"`) or plain numbers.
5. **Account lifecycle**: `gen` → `rename` → operations → `suspend`/`resume`.
6. **Messenger integration**: Enable messenger per-account for encrypted communication features.
