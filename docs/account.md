# Account Component (🔒 Account Management)

---

## Component Overview

The Account component manages local wallets, all operations are stored exclusively on the local device. Users can use names to reference and operate on corresponding accounts.

> **Note**: Use the `watch_and_query` tool to query all or filtered accounts.

---

## Complete Tool Call Structure

The `account_operation` tool uses the following top-level structure, all sub-functions are part of this structure:

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

**Important Rule**: Only one operation can be specified per call (only one of the above fields can exist).

---

## Feature Tree

```
account_operation
├── gen (Generate new account)
│   ├── name: Account name (optional)
│   ├── replaceExistName: Whether to replace existing name (optional)
│   └── m: Messenger name (optional, null=disable)
├── faucet (Get test coins)
│   ├── name_or_address: Account name or address (optional, default uses default account)
│   └── network: Network type (localnet/testnet)
├── suspend (Suspend account)
│   └── name_or_address: Account name or address (optional, default uses default account)
├── resume (Resume account)
│   ├── address: Account address (required)
│   └── name: New name (optional)
├── rename (Rename account)
│   ├── name_or_address: Original account name or address (optional, default uses default account)
│   └── new_name: New account name (required)
├── swap_name (Swap account names)
│   ├── name_or_address1: First account name or address (optional)
│   └── name_or_address2: Second account name or address (optional)
├── transfer (Transfer tokens)
│   ├── name_or_address_from: Sender account name or address (optional)
│   ├── name_or_address_to: Recipient account name or address (optional)
│   ├── amount: Transfer amount (required)
│   ├── token_type: Token type (optional, default 0x2::wow::WOW)
│   └── network: Network type (optional)
├── get (Query account/get coin object)
│   ├── name_or_address: Account name or address (optional)
│   ├── balance_required: Required balance (required)
│   ├── token_type: Token type (optional, default 0x2::wow::WOW)
│   └── network: Network type (optional)
├── signData (Sign data)
│   ├── name_or_address: Account name or address (optional)
│   ├── data: Data to sign (required)
│   └── data_encoding: Data encoding format (optional, utf8/base64/hex)
└── messenger (Enable/disable messenger)
    ├── name_or_account: Account name or address (optional)
    └── m: Messenger name (required, null=disable)
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
| `m` | string \| null | No | Messenger name | Max 64 characters. null=disable messenger; omit=no change |

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

### Examples

#### Example 1.1: Generate Default Account (No Name)

**Prompt**: Generate a new account without a name. This will be the default account.

```json
{ "gen": {} }
```

#### Example 1.2: Generate Account with Name

**Prompt**: Generate a new account with name "my_account". Do not replace existing name if it already exists.

```json
{ "gen": { "name": "my_account" } }
```

#### Example 1.3: Generate Account and Replace Existing Name

**Prompt**: Generate a new account with name "my_account", and replace the existing name if it already exists.

```json
{ "gen": { "name": "my_account", "replaceExistName": true } }
```

#### Example 1.4: Generate Account and Enable Messenger

**Prompt**: Generate a new account with name "my_account" and enable messenger with name "my_messenger".

```json
{ "gen": { "name": "my_account", "m": "my_messenger" } }
```

#### Example 1.5: Generate Account and Disable Messenger

**Prompt**: Generate a new account with name "my_account" and explicitly disable messenger.

```json
{ "gen": { "name": "my_account", "m": null } }
```

#### Example 1.6: Complete Parameter Generation

**Prompt**: Generate a new account with complete parameters: name "my_account", do not replace existing name, and enable messenger "my_messenger".

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
      { "amount": 10000000000, "id": "0x...", "transferTx": "0x..." }
    ],
    "network": "testnet"
  }
}
```

### Examples

#### Example 2.1: Get Test Coins for Default Account (testnet)

**Prompt**: Get test coins from the faucet for the default account on testnet.

```json
{ "faucet": { "network": "testnet" } }
```

#### Example 2.2: Get Test Coins for Named Account

**Prompt**: Get test coins for account named "my_account" on testnet.

```json
{ "faucet": { "name_or_address": "my_account", "network": "testnet" } }
```

#### Example 2.3: Get Test Coins for Address

**Prompt**: Get test coins for address "0x1234...abcd" on localnet.

```json
{ "faucet": { "name_or_address": "0x1234...abcd", "network": "localnet" } }
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

### Examples

#### Example 3.1: Suspend Default Account

**Prompt**: Suspend the default account. This will remove it from active accounts and delete its name.

```json
{ "suspend": {"name_or_address": "" } }
```

#### Example 3.2: Suspend Named Account

**Prompt**: Suspend the account named "my_account".

```json
{ "suspend": { "name_or_address": "my_account" } }
```

#### Example 3.3: Suspend Account by Address

**Prompt**: Suspend the account with address "0x1234...abcd".

```json
{ "suspend": { "name_or_address": "0x1234...abcd" } }
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

### Examples

#### Example 4.1: Resume Account Only (No Name)

**Prompt**: Resume the account with address "0x1234567890abcdef..." without assigning a name.

```json
{ "resume": { "address": "0x1234567890abcdef..." } }
```

#### Example 4.2: Resume Account with New Name

**Prompt**: Resume the account with address "0x1234567890abcdef..." and assign it the name "my_account".

```json
{ "resume": { "address": "0x1234567890abcdef...", "name": "my_account" } }
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

### Examples

#### Example 5.1: Rename Default Account

**Prompt**: Rename the default account to "my_new_account".

```json
{ "rename": { "new_name": "my_new_account" } }
```

#### Example 5.2: Rename by Name

**Prompt**: Rename the account named "old_name" to "new_name".

```json
{ "rename": { "name_or_address": "old_name", "new_name": "new_name" } }
```

#### Example 5.3: Rename by Address

**Prompt**: Rename the account with address "0x1234...abcd" to "new_name".

```json
{ "rename": { "name_or_address": "0x1234...abcd", "new_name": "new_name" } }
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

### Examples

#### Example 6.1: Swap Default Account and Specified Account Names

**Prompt**: Swap the names between the default account and the account named "my_account".

```json
{ "swap_name": { "name_or_address2": "my_account" } }
```

#### Example 6.2: Swap Two Named Accounts

**Prompt**: Swap the names between "account1" and "account2".

```json
{ "swap_name": { "name_or_address1": "account1", "name_or_address2": "account2" } }
```

#### Example 6.3: Swap Two Address Accounts

**Prompt**: Swap the names between two accounts specified by their addresses.

```json
{ "swap_name": { "name_or_address1": "0x1234...", "name_or_address2": "0xabcd..." } }
```

#### Example 6.4: Mixed Usage of Name and Address

**Prompt**: Swap names between "account1" (by name) and "0xabcd..." (by address).

```json
{ "swap_name": { "name_or_address1": "account1", "name_or_address2": "0xabcd..." } }
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

### Examples

#### Example 7.1: Transfer Between Default Accounts (Using Default Token)

**Prompt**: Transfer 1000000000 WOW tokens from the default account to the default recipient account.

```json
{ "transfer": { "amount": 1000000000 } }
```

#### Example 7.2: Transfer from Default Account to Specified Account

**Prompt**: Transfer 1000000000 WOW tokens from the default account to the account named "recipient".

```json
{ "transfer": { "name_or_address_to": "recipient", "amount": 1000000000 } }
```

#### Example 7.3: Transfer from Specified Account to Default Account

**Prompt**: Transfer 1000000000 WOW tokens from "sender" to the default account.

```json
{ "transfer": { "name_or_address_from": "sender", "amount": 1000000000 } }
```

#### Example 7.4: Specify Both Sender and Recipient

**Prompt**: Transfer 1000000000 WOW tokens from "sender" to "recipient".

```json
{
  "transfer": {
    "name_or_address_from": "sender",
    "name_or_address_to": "recipient",
    "amount": 1000000000
  }
}
```

#### Example 7.5: Transfer Using Addresses

**Prompt**: Transfer 1000000000 WOW tokens between two accounts specified by their addresses.

```json
{
  "transfer": {
    "name_or_address_from": "0x1234...",
    "name_or_address_to": "0xabcd...",
    "amount": 1000000000
  }
}
```

#### Example 7.6: Specify Token Type

**Prompt**: Transfer 1000000000 SUI tokens from "sender" to "recipient".

```json
{
  "transfer": {
    "name_or_address_from": "sender",
    "name_or_address_to": "recipient",
    "amount": 1000000000,
    "token_type": "0x2::sui::SUI"
  }
}
```

#### Example 7.7: Complete Parameter Transfer

**Prompt**: Complete transfer with all parameters: sender "sender", recipient "recipient", amount "1000000000", token type "0x2::wow::WOW", network "testnet".

```json
{
  "transfer": {
    "name_or_address_from": "sender",
    "name_or_address_to": "recipient",
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

### Examples

#### Example 8.1: Query Default Account (Get Default Token)

**Prompt**: Query the default account and generate a coin object with 1000000000 WOW balance.

```json
{ "get": { "balance_required": 1000000000 } }
```

#### Example 8.2: Query Named Account

**Prompt**: Query account "my_account" and generate a coin object with 1000000000 WOW balance.

```json
{ "get": { "name_or_address": "my_account", "balance_required": 1000000000 } }
```

#### Example 8.3: Query by Address

**Prompt**: Query account with address "0x1234...abcd" and generate a coin object with 1000000000 WOW balance.

```json
{ "get": { "name_or_address": "0x1234...abcd", "balance_required": 1000000000 } }
```

#### Example 8.4: Specify Token Type

**Prompt**: Query account "my_account" and generate a coin object with 1000000000 SUI balance.

```json
{
  "get": {
    "name_or_address": "my_account",
    "balance_required": 1000000000,
    "token_type": "0x2::sui::SUI"
  }
}
```

#### Example 8.5: Complete Parameter Query

**Prompt**: Complete query with all parameters: account "my_account", balance required "1000000000", token type "0x2::wow::WOW", network "testnet".

```json
{
  "get": {
    "name_or_address": "my_account",
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

### Examples

#### Example 9.1: Default Account Sign UTF-8 String

**Prompt**: Sign the UTF-8 string "Hello World" using the default account.

```json
{ "signData": { "data": "Hello World" } }
```

#### Example 9.2: Sign with Named Account

**Prompt**: Sign the string "Hello World" using the account named "my_account".

```json
{ "signData": { "name_or_address": "my_account", "data": "Hello World" } }
```

#### Example 9.3: Sign with Address

**Prompt**: Sign the string "Hello World" using the account with address "0x1234...".

```json
{ "signData": { "name_or_address": "0x1234...", "data": "Hello World" } }
```

#### Example 9.4: Sign Hex Encoded Data

**Prompt**: Sign the hex encoded data "48656c6c6f20576f726c64" using account "my_account".

```json
{
  "signData": {
    "name_or_address": "my_account",
    "data": "48656c6c6f20576f726c64",
    "data_encoding": "hex"
  }
}
```

#### Example 9.5: Sign Base64 Encoded Data

**Prompt**: Sign the base64 encoded data "SGVsbG8gV29ybGQ=" using account "my_account".

```json
{
  "signData": {
    "name_or_address": "my_account",
    "data": "SGVsbG8gV29ybGQ=",
    "data_encoding": "base64"
  }
}
```

#### Example 9.6: Explicitly Specify UTF-8 Encoding

**Prompt**: Sign the string "Hello World" using account "my_account", explicitly specifying UTF-8 encoding.

```json
{
  "signData": {
    "name_or_address": "my_account",
    "data": "Hello World",
    "data_encoding": "utf8"
  }
}
```

#### Example 9.7: Complete Parameter Signing

**Prompt**: Complete signing with all parameters: account "my_account", data "48656c6c6f", encoding "hex".

```json
{
  "signData": {
    "name_or_address": "my_account",
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

### Examples

#### Example 10.1: Enable Messenger for Default Account

**Prompt**: Enable messenger for the default account with name "my_messenger".

```json
{ "messenger": { "m": "my_messenger" } }
```

#### Example 10.2: Enable Messenger for Named Account

**Prompt**: Enable messenger for account "my_account" with name "my_messenger".

```json
{ "messenger": { "name_or_account": "my_account", "m": "my_messenger" } }
```

#### Example 10.3: Enable Messenger for Address

**Prompt**: Enable messenger for account with address "0x1234..." with name "my_messenger".

```json
{ "messenger": { "name_or_account": "0x1234...", "m": "my_messenger" } }
```

#### Example 10.4: Disable Default Account Messenger

**Prompt**: Disable messenger for the default account.

```json
{ "messenger": { "m": null } }
```

#### Example 10.5: Disable Named Account Messenger

**Prompt**: Disable messenger for account "my_account".

```json
{ "messenger": { "name_or_account": "my_account", "m": null } }
```

---

## Query Account List

```json
{
  "query_type": "account_list"
}
```

## Query Balance

```json
{
  "query_type": "account_balance",
  "account": "my_account",
  "token_type": "0x2::wow::WOW"
}
```

---

## Best Practices

### 1. Use Test Network First
Test on the test network first.

### 2. Test with Small Amounts
Test with small amounts before first transfer.

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

