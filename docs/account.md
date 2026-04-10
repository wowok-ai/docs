# Account Component (🔒 Wallet Management)

---

## Component Overview

The Account component manages local wallets, all operations are stored exclusively on the local device. Users can use names to reference and operate on corresponding accounts.

> **Note**: Use the `watch_and_query` tool to query all or filtered accounts.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Generate Account** | Create new wallet accounts | Set up new identities, team members | Foundation for all wallet operations |
| **Get Test Coins** | Fund accounts for testing | Development, testing on testnet | Enables on-chain testing without real funds |
| **Suspend Account** | Disable account temporarily | Security, account management | Prevents unauthorized transactions |
| **Resume Account** | Reactivate suspended accounts | Restore access, account recovery | Regains control of suspended accounts |
| **Rename Account** | Change account identifier | Organization, name changes | Keeps accounts manageable and identifiable |
| **Swap Names** | Exchange identifiers between accounts | Team restructuring, role changes | Flexible account management |
| **Transfer Tokens** | Send funds between accounts | Payments, settlements | Core transaction functionality |
| **Query Account** | Get balance and coin objects | Prepare transactions, check funds | Ensures sufficient balance for operations |
| **Sign Data** | Cryptographically sign messages | Transaction authorization, proofs | Enables secure on-chain operations |
| **Messenger Config** | Enable/disable encrypted messaging | Communication, team coordination | Integrates wallet with messaging |

---

## Complete Tool Call Structure


```json
{
  "gen": { ... },           // Generate new account
  "faucet": { ... },        // Get test coins
  "suspend": { ... },       // Suspend account
  "resume": { ... },        // Resume account
  "rename": { ... },        // Rename account
  "swap_name": { ... },     // Swap account names
  "transfer": { ... },      // Transfer tokens
  "get": { ... },           // Query account/get coin object
  "signData": { ... },      // Sign data
  "messenger": { ... }      // Enable/disable messenger
}
```

---

## Sub-feature 1: Generate New Account (gen)

### Feature Description

Generate a new WoWok account, optionally specifying a name, whether to replace an existing name, and whether to enable messenger.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name` | string | No | Account name | Max 64 BCS characters, cannot start with '0x'. Omit or empty string uses default account |
| `replaceExistName` | boolean | No | Whether to replace existing name | true=replace; false=error if name exists (default) |
| `m` | string | null | No | Messenger name | Max 64 characters. null=disable messenger; omit=no change |

### Return Result

```json
{
  "gen": {
    "address": "0x1234...abcd",
    "name": "my_account",
    "m": "my_messenger"
  }
}
```

---

### Examples

#### Example 1.1: Generate Default Account (No Name)

**Prompt**: Generate a new account without specifying a name. This will create a default account without any custom name. The account will be stored locally on your device.

```json
{ "gen": {} }
```

#### Example 1.2: Generate Account with Name

**Prompt**: Generate a new account with the name "my_account". Do not replace an existing name if it already exists - this will throw an error if the name is already taken.

```json
{ "gen": { "name": "my_account" } }
```

#### Example 1.3: Generate Account and Replace Existing Name

**Prompt**: Generate a new account with the name "my_account", and if this name already exists, replace the existing name assignment. This ensures the new account gets the name even if it was previously used.

```json
{ "gen": { "name": "my_account", "replaceExistName": true } }
```

#### Example 1.4: Generate Account and Enable Messenger

**Prompt**: Generate a new account with the name "my_account" and enable messenger functionality with the messenger name "my_messenger". This account will be ready for encrypted messaging.

```json
{ "gen": { "name": "my_account", "m": "my_messenger" } }
```

#### Example 1.5: Generate Account and Disable Messenger

**Prompt**: Generate a new account with the name "my_account" and explicitly disable messenger functionality. This ensures the account cannot send or receive encrypted messages.

```json
{ "gen": { "name": "my_account", "m": null } }
```

#### Example 1.6: Complete Parameter Generation

**Prompt**: Generate a new account with all parameters configured: set the account name to "my_account", do not replace an existing name (so it will error if name exists), and enable messenger with the name "my_messenger".

```json
{ "gen": { "name": "my_account", "replaceExistName": false, "m": "my_messenger" } }
```

---

## Sub-feature 2: Get Test Coins (faucet)

### Feature Description

Get test coins from the faucet to a specified account. Only supports localnet and testnet networks.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address` | string | No | Account name or address | Empty string '' uses default account |
| `network` | enum | Yes | Network type | "localnet" or "testnet" |

### Return Result

```json
{
  "faucet": {
    "name_or_address": "my_account",
    "result": [
      { "amount": 10000000000, "id": "0x...", "transferTxDigest": "0x..." }
    ],
    "network": "testnet"
  }
}
```

---

### Examples

#### Example 2.1: Get Test Coins for Default Account (testnet)

**Prompt**: Get test coins from the faucet for the default account on the testnet network. This will distribute test tokens to your default wallet for testing purposes.

```json
{ "faucet": { "network": "testnet" } }
```

#### Example 2.2: Get Test Coins for Named Account

**Prompt**: Get test coins from the faucet for the account named "my_account" on the testnet network. This is useful when you want to fund a specific named account instead of the default one.

```json
{ "faucet": { "name_or_address": "my_account", "network": "testnet" } }
```

#### Example 2.3: Get Test Coins for Address

**Prompt**: Get test coins from the faucet for the specific address "0xabc123...def456" on the localnet network. This is useful when you need to fund an account by its address directly.

```json
{ "faucet": { "name_or_address": "0xabc123...def456", "network": "localnet" } }
```

---

## Sub-feature 3: Suspend Account (suspend)

### Feature Description

Remove an account from the active account list. After suspension, the account cannot sign transactions, and its name is deleted.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address` | string | No | Account name or address | Empty string '' uses default account |

### Return Result

```json
{
  "suspend": {
    "name_or_address": "my_account",
    "success": true
  }
}
```

---

### Examples

#### Example 3.1: Suspend Default Account

**Prompt**: Suspend the default account. This will remove it from the active accounts list and delete any name associated with it. The account will no longer be able to sign transactions.

```json
{ "suspend": {"name_or_address": "" } }
```

#### Example 3.2: Suspend Named Account

**Prompt**: Suspend the account named "my_account". This will remove it from active accounts, delete its name, and prevent it from signing transactions.

```json
{ "suspend": { "name_or_address": "my_account" } }
```

#### Example 3.3: Suspend Account by Address

**Prompt**: Suspend the account with address "0xabc123...def456". This is useful when you need to suspend an account by its address rather than by name.

```json
{ "suspend": { "name_or_address": "0xabc123...def456" } }
```

---

## Sub-feature 4: Resume Account (resume)

### Feature Description

Add a suspended account back to the active account list, optionally specifying a new name.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `address` | string | Yes | Account address | Format: 0x + 64 hex characters |
| `name` | string | No | New name | Max 64 BCS characters, cannot start with '0x' |

### Return Result

```json
{
  "resume": {
    "address": "0x1234...abcd",
    "name": "my_account",
    "success": true
  }
}
```

---

### Examples

#### Example 4.1: Resume Account Only (No Name)

**Prompt**: Resume the account with address "0xabc123...def456" without assigning a name. This will add the account back to active accounts but leave it unnamed.

```json
{ "resume": { "address": "0xabc123...def456" } }
```

#### Example 4.2: Resume Account with New Name

**Prompt**: Resume the account with address "0xabc123...def456" and assign it the new name "alice". This will add the account back to active accounts with the specified name.

```json
{ "resume": { "address": "0xabc123...def456", "name": "alice" } }
```

---

## Sub-feature 5: Rename Account (rename)

### Feature Description

Change an account's name. If the new name already exists, an error will be thrown.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address` | string | No | Original account name or address | Empty string '' uses default account |
| `new_name` | string | Yes | New account name | Max 64 BCS characters, cannot start with '0x' |

### Return Result

```json
{
  "rename": {
    "name_or_address": "old_name",
    "new_name": "new_name",
    "success": true
  }
}
```

---

### Examples

#### Example 5.1: Rename Default Account

**Prompt**: Rename the default account to "alice". This will assign the new name to the default account that was previously unnamed or had a different name.

```json
{ "rename": { "new_name": "alice" } }
```

#### Example 5.2: Rename by Name

**Prompt**: Rename the account currently named "old_account" to "bob". This operation will fail if "bob" is already being used by another account.

```json
{ "rename": { "name_or_address": "old_account", "new_name": "bob" } }
```

#### Example 5.3: Rename by Address

**Prompt**: Rename the account with address "0xabc123...def456" to "charlie". This is useful when you want to rename an account by referencing its address directly.

```json
{ "rename": { "name_or_address": "0xabc123...def456", "new_name": "charlie" } }
```

---

## Sub-feature 6: Swap Account Names (swap_name)

### Feature Description

Swap the names of two accounts.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address1` | string | No | First account name or address | Empty string '' uses default account |
| `name_or_address2` | string | No | Second account name or address | Empty string '' uses default account |

### Return Result

```json
{
  "swap_name": {
    "name_or_address1": "account1",
    "name_or_address2": "account2",
    "success": true
  }
}
```

---

### Examples

#### Example 6.1: Swap Default Account and Specified Account Names

**Prompt**: Swap the names between the default account and the account named "alice". After this operation, the default account will have the name "alice" and vice versa.

```json
{ "swap_name": { "name_or_address2": "alice" } }
```

#### Example 6.2: Swap Two Named Accounts

**Prompt**: Swap the names between the accounts named "alice" and "bob". This is useful when you want to exchange the identifiers of two existing accounts.

```json
{ "swap_name": { "name_or_address1": "alice", "name_or_address2": "bob" } }
```

#### Example 6.3: Swap Two Address Accounts

**Prompt**: Swap the names between two accounts specified by their addresses: "0xabc123...def456" and "0xdef456...abc123". This allows you to swap names without referencing existing names.

```json
{ "swap_name": { "name_or_address1": "0xabc123...def456", "name_or_address2": "0xdef456...abc123" } }
```

#### Example 6.4: Mixed Usage of Name and Address

**Prompt**: Swap names between the account named "alice" and the account with address "0xdef456...abc123". This demonstrates flexible referencing using both name and address formats.

```json
{ "swap_name": { "name_or_address1": "alice", "name_or_address2": "0xdef456...abc123" } }
```

---

## Sub-feature 7: Transfer Tokens (transfer)

### Feature Description

Transfer tokens from one account to another.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address_from` | string | No | Sender account name or address | Empty string '' uses default account |
| `name_or_address_to` | string | No | Recipient account name or address | Empty string '' uses default account |
| `amount` | number \| string | Yes | Transfer amount | Minimum token unit |
| `token_type` | string | No | Token type | Default "0x2::wow::WOW" |
| `network` | enum | No | Network type | "localnet" or "testnet" |

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 7.1: Transfer Between Default Accounts (Using Default Token)

**Prompt**: Transfer 1000000000 WOW tokens from the default sender account to the default recipient account using the default token type (0x2::wow::WOW). This is the simplest transfer configuration.

```json
{ "transfer": { "amount": 1000000000 } }
```

#### Example 7.2: Transfer from Default Account to Specified Account

**Prompt**: Transfer 1000000000 WOW tokens from the default account to the account named "bob". The sender uses the default account, while the recipient is explicitly specified by name.

```json
{ "transfer": { "name_or_address_to": "bob", "amount": 1000000000 } }
```

#### Example 7.3: Transfer from Specified Account to Default Account

**Prompt**: Transfer 1000000000 WOW tokens from the account named "alice" to the default account. This reverses the direction, specifying the sender and using the default as recipient.

```json
{ "transfer": { "name_or_address_from": "alice", "amount": 1000000000 } }
```

#### Example 7.4: Specify Both Sender and Recipient

**Prompt**: Transfer 1000000000 WOW tokens from the account named "alice" to the account named "bob". Both accounts are explicitly specified by their names for maximum clarity.

```json
{
  "transfer": {
    "name_or_address_from": "alice",
    "name_or_address_to": "bob",
    "amount": 1000000000
  }
}
```

#### Example 7.5: Transfer Using Addresses

**Prompt**: Transfer 1000000000 WOW tokens between two accounts specified by their addresses: sender "0xabc123...def456" and recipient "0xdef456...abc123". This is useful when accounts don't have names assigned.

```json
{
  "transfer": {
    "name_or_address_from": "0xabc123...def456",
    "name_or_address_to": "0xdef456...abc123",
    "amount": 1000000000
  }
}
```

#### Example 7.6: Specify Token Type

**Prompt**: Transfer 1000000000 SUI tokens from the account named "alice" to the account named "bob". Instead of using the default WOW token, this specifies SUI (0x2::sui::SUI) as the token type.

```json
{
  "transfer": {
    "name_or_address_from": "alice",
    "name_or_address_to": "bob",
    "amount": 1000000000,
    "token_type": "0x2::sui::SUI"
  }
}
```

#### Example 7.7: Complete Parameter Transfer

**Prompt**: Complete transfer with all parameters configured: use sender "alice", recipient "bob", transfer amount "1000000000" (specified as a string), token type "0x2::wow::WOW", and network "testnet". This demonstrates all available options.

```json
{
  "transfer": {
    "name_or_address_from": "alice",
    "name_or_address_to": "bob",
    "amount": "1000000000",
    "token_type": "0x2::wow::WOW",
    "network": "testnet"
  }
}
```

---

## Sub-feature 8: Query Account/Get Coin Object (get)

### Feature Description

Query account information and generate a new coin object based on the required balance.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address` | string | No | Account name or address | Empty string '' uses default account |
| `balance_required` | string \| number | Yes | Required balance | Minimum token unit |
| `token_type` | string | No | Token type | Default "0x2::wow::WOW" |
| `network` | enum | No | Network type | "localnet" or "testnet" |

### Return Result

```json
{
  "get": {
    "coin_address": "0x...",
    "name_or_address": "my_account",
    "balance_required": "1000000000",
    "token_type": "0x2::wow::WOW",
    "network": "testnet"
  }
}
```

---

### Examples

#### Example 8.1: Query Default Account (Get Default Token)

**Prompt**: Query the default account and generate a coin object with 1000000000 WOW balance using the default token type. This will return a new coin object ID with the specified balance.

```json
{ "get": { "balance_required": 1000000000 } }
```

#### Example 8.2: Query Named Account

**Prompt**: Query the account named "alice" and generate a coin object with 1000000000 WOW balance. This specifies which account to use by name rather than using the default.

```json
{ "get": { "name_or_address": "alice", "balance_required": 1000000000 } }
```

#### Example 8.3: Query by Address

**Prompt**: Query the account with address "0xabc123...def456" and generate a coin object with 1000000000 WOW balance. This references the account directly by its address.

```json
{ "get": { "name_or_address": "0xabc123...def456", "balance_required": 1000000000 } }
```

#### Example 8.4: Specify Token Type

**Prompt**: Query the account named "alice" and generate a coin object with 1000000000 SUI balance. Instead of using the default WOW token, this specifies SUI (0x2::sui::SUI) as the token type.

```json
{
  "get": {
    "name_or_address": "alice",
    "balance_required": 1000000000,
    "token_type": "0x2::sui::SUI"
  }
}
```

#### Example 8.5: Complete Parameter Query

**Prompt**: Complete query with all parameters configured: use account "alice", balance required "1000000000" (specified as a string), token type "0x2::wow::WOW", and network "testnet". This demonstrates all available options.

```json
{
  "get": {
    "name_or_address": "alice",
    "balance_required": "1000000000",
    "token_type": "0x2::wow::WOW",
    "network": "testnet"
  }
}
```

---

## Sub-feature 9: Sign Data (signData)

### Feature Description

Sign data using the account's private key.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_address` | string | No | Account name or address | Empty string '' uses default account |
| `data` | string | Yes | Data to sign | If encoding not specified, treated as UTF-8 string |
| `data_encoding` | enum | No | Data encoding format | "utf8", "base64", "hex" (default utf8) |

### Return Result

```json
{
  "signData": {
    "name_or_address": "my_account",
    "signature": "0xabcdef...",
    "publicKey": "0x123456...",
    "address": "0x1234...abcd"
  }
}
```

---

### Examples

#### Example 9.1: Default Account Sign UTF-8 String

**Prompt**: Sign the UTF-8 encoded string "Hello World" using the default account. Since no encoding is specified, it defaults to UTF-8 format.

```json
{ "signData": { "data": "Hello World" } }
```

#### Example 9.2: Sign with Named Account

**Prompt**: Sign the UTF-8 string "Hello World" using the account named "alice". This explicitly specifies which account to use for signing by name.

```json
{ "signData": { "name_or_address": "alice", "data": "Hello World" } }
```

#### Example 9.3: Sign with Address

**Prompt**: Sign the UTF-8 string "Hello World" using the account with address "0xabc123...def456". This references the account directly by its address.

```json
{ "signData": { "name_or_address": "0xabc123...def456", "data": "Hello World" } }
```

#### Example 9.4: Sign Hex Encoded Data

**Prompt**: Sign the hex encoded data "48656c6c6f20576f726c64" (which represents "Hello World") using the account named "alice". Specify data_encoding as "hex" to indicate the input format.

```json
{
  "signData": {
    "name_or_address": "alice",
    "data": "48656c6c6f20576f726c64",
    "data_encoding": "hex"
  }
}
```

#### Example 9.5: Sign Base64 Encoded Data

**Prompt**: Sign the base64 encoded data "SGVsbG8gV29ybGQ=" (which represents "Hello World") using the account named "alice". Specify data_encoding as "base64" to indicate the input format.

```json
{
  "signData": {
    "name_or_address": "alice",
    "data": "SGVsbG8gV29ybGQ=",
    "data_encoding": "base64"
  }
}
```

#### Example 9.6: Explicitly Specify UTF-8 Encoding

**Prompt**: Sign the string "Hello World" using the account named "alice", explicitly specifying the encoding as UTF-8. While this is the default, it's shown here for clarity and explicitness.

```json
{
  "signData": {
    "name_or_address": "alice",
    "data": "Hello World",
    "data_encoding": "utf8"
  }
}
```

#### Example 9.7: Complete Parameter Signing

**Prompt**: Complete signing with all parameters configured: use account "alice", sign the hex data "48656c6c6f", and specify encoding as "hex". This demonstrates all available options for the signData operation.

```json
{
  "signData": {
    "name_or_address": "alice",
    "data": "48656c6c6f",
    "data_encoding": "hex"
  }
}
```

---

## Sub-feature 10: Enable/Disable Messenger (messenger)

### Feature Description

Enable or disable messenger functionality for an account.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name_or_account` | string | No | Account name or address | Empty string '' uses default account |
| `m` | string \| null | Yes | Messenger name | Max 64 characters. null=disable messenger |

### Return Result

```json
{
  "messenger": {
    "name_or_account": "my_account",
    "m": "my_messenger"
  }
}
```

---

### Examples

#### Example 10.1: Enable Messenger for Default Account

**Prompt**: Enable messenger functionality for the default account with the messenger name "alice_messenger". This will allow the account to send and receive encrypted messages using the specified messenger identifier.

```json
{ "messenger": { "m": "alice_messenger" } }
```

#### Example 10.2: Enable Messenger for Named Account

**Prompt**: Enable messenger functionality for the account named "alice" with the messenger name "alice_messenger". This explicitly specifies which account to configure by name.

```json
{ "messenger": { "name_or_account": "alice", "m": "alice_messenger" } }
```

#### Example 10.3: Enable Messenger for Address

**Prompt**: Enable messenger functionality for the account with address "0xabc123...def456" with the messenger name "alice_messenger". This references the account directly by its address.

```json
{ "messenger": { "name_or_account": "0xabc123...def456", "m": "alice_messenger" } }
```

#### Example 10.4: Disable Default Account Messenger

**Prompt**: Disable messenger functionality for the default account. Set "m" to null to indicate that messenger should be turned off, preventing the account from sending or receiving encrypted messages.

```json
{ "messenger": { "m": null } }
```

#### Example 10.5: Disable Named Account Messenger

**Prompt**: Disable messenger functionality for the account named "alice". Set "m" to null to turn off messenger for this specific account.

```json
{ "messenger": { "name_or_account": "alice", "m": null } }
```

---

## Comprehensive Combined Examples

### Example 1: Complete Account Setup Workflow

**Prompt**: Generate a new account named "alice", enable messenger for it with messenger name "alice_chat", then get test coins from the faucet on testnet. This covers multiple account operations in sequence.

```json
{ "gen": { "name": "alice", "m": "alice_chat" } }
```

After creating the account, follow with:

```json
{ "faucet": { "name_or_address": "alice", "network": "testnet" } }
```

---

### Example 2: Transfer with Multiple Preparations

**Prompt**: First rename the account from "old_name" to "bob", then transfer 500000000000 WOW tokens from "bob" to "alice", and finally sign a transaction confirmation message with "bob". This demonstrates a complete transfer workflow with account management.

Step 1: Rename account

```json
{ "rename": { "name_or_address": "old_name", "new_name": "bob" } }
```

Step 2: Transfer tokens

```json
{ "transfer": { "name_or_address_from": "bob", "name_or_address_to": "alice", "amount": 500000000000, "network": "testnet" } }
```

Step 3: Sign confirmation

```json
{ "signData": { "name_or_address": "bob", "data": "Transfer confirmed: 500000000000 WOW to alice" } }
```

---

### Example 3: Multi-User Token Exchange

**Prompt**: Set up two accounts ("alice" and "bob"), fund both with test coins, enable messengers for both, then have alice transfer SUI tokens to bob and bob transfer WOW tokens to alice. This covers a complete token exchange scenario.

Step 1: Generate alice's account

```json
{ "gen": { "name": "alice", "m": "alice_messenger" } }
```

Step 2: Generate bob's account

```json
{ "gen": { "name": "bob", "m": "bob_messenger" } }
```

Step 3: Fund alice with testnet coins

```json
{ "faucet": { "name_or_address": "alice", "network": "testnet" } }
```

Step 4: Fund bob with testnet coins

```json
{ "faucet": { "name_or_address": "bob", "network": "testnet" } }
```

Step 5: Alice transfers SUI to bob (if available)

```json
{ "transfer": { "name_or_address_from": "alice", "name_or_address_to": "bob", "amount": 2000000000, "token_type": "0x2::sui::SUI", "network": "testnet" } }
```

Step 6: Bob transfers WOW to alice

```json
{ "transfer": { "name_or_address_from": "bob", "name_or_address_to": "alice", "amount": 100000000000, "token_type": "0x2::wow::WOW", "network": "testnet" } }
```

---

### Example 4: Account Recovery and Security Workflow

**Prompt**: Suspend a compromised account, resume it with a new name, transfer remaining funds to a safe account, then suspend the original address again. This demonstrates security-focused account management.

Step 1: Suspend the compromised account

```json
{ "suspend": { "name_or_address": "compromised_account" } }
```

Step 2: Resume with a temporary name

```json
{ "resume": { "address": "0xabc123...def456", "name": "temp_recovery" } }
```

Step 3: Transfer all funds to safe account "alice"

```json
{ "transfer": { "name_or_address_from": "temp_recovery", "name_or_address_to": "alice", "amount": 1000000000000, "network": "testnet" } }
```

Step 4: Get coin object for exact amount (optional)

```json
{ "get": { "name_or_address": "temp_recovery", "balance_required": 1000000000000, "network": "testnet" } }
```

Step 5: Suspend the recovery account after funds are secure

```json
{ "suspend": { "name_or_address": "temp_recovery" } }
```

---

### Example 5: Business Payment Workflow

**Prompt**: Create a business account, rename it to "merchant", enable messenger for customer support, fund with test coins, then generate a coin object for a specific payment amount and sign an invoice. This demonstrates business operations.

Step 1: Generate business account

```json
{ "gen": { "name": "temp_business", "m": "merchant_support" } }
```

Step 2: Rename to proper business name

```json
{ "rename": { "name_or_address": "temp_business", "new_name": "merchant" } }
```

Step 3: Fund the merchant account

```json
{ "faucet": { "name_or_address": "merchant", "network": "testnet" } }
```

Step 4: Generate coin object for invoice amount (250000000000 WOW)

```json
{ "get": { "name_or_address": "merchant", "balance_required": 250000000000, "token_type": "0x2::wow::WOW", "network": "testnet" } }
```

Step 5: Sign the invoice message

```json
{ "signData": { "name_or_address": "merchant", "data": "Invoice #1234: 250000000000 WOW - Product Purchase", "data_encoding": "utf8" } }
```

---

## Important Notes

⚠️ **All account data exists only on local device! We recommend using WoWok in a sandbox environment!**

⚠️ **Private keys will never be exposed to AI! We recommend using WoWok wallet as your personal hot wallet!**

⚠️ **Confirm sufficient balance before transferring!**
---

## Related Components

- **LocalMark**: Local marking
- **LocalInfo**: Local information
- **Payment**: Direct transfer
