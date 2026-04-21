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

**Execution Result**:
```json
{
  "gen": {
    "address": "0xd836...d681",
    "name": ""
  }
}
```

#### Example 1.2: Generate Account with Name (Alice)

**Prompt**: Generate a new account with the name "alice". Do not replace an existing name if it already exists - this will throw an error if the name is already taken.

```json
{ "gen": { "name": "alice" } }
```

**Execution Result**:
```json
{
  "gen": {
    "address": "0x0596...4b7d",
    "name": "alice"
  }
}
```

#### Example 1.3: Generate Account with Name (Bob)

**Prompt**: Generate a new account with the name "bob".

```json
{ "gen": { "name": "bob" } }
```

**Execution Result**:
```json
{
  "gen": {
    "address": "0x56bf...b5d7",
    "name": "bob",
    "m": "bob_messenger"
  }
}
```

#### Example 1.4: Generate Account with Name (Grace)

**Prompt**: Generate a new account with the name "grace".

```json
{ "gen": { "name": "grace" } }
```

**Execution Result**:
```json
{
  "gen": {
    "address": "0xbc11...b0b0",
    "name": "grace"
  }
}
```

#### Example 1.5: Generate Account and Enable Messenger

**Prompt**: Generate a new account with the name "test_messenger" and enable messenger functionality with the messenger name "my_messenger". This account will be ready for encrypted messaging.

```json
{ "gen": { "name": "test_messenger", "m": "my_messenger" } }
```

**Execution Result**:
```json
{
  "gen": {
    "address": "0xb580...f4f4",
    "name": "test_messenger",
    "m": "my_messenger"
  }
}
```

#### Example 1.6: Generate Account with Replace Existing Name

**Prompt**: Generate a new account with the name "alice", and if this name already exists, replace the existing name assignment. This ensures the new account gets the name even if it was previously used.

```json
{ "gen": { "name": "alice", "replaceExistName": true } }
```
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

**Execution Result**:
```json
{
  "faucet": {
    "network": "testnet",
    "result": [
      { "amount": 1000000000, "id": "0x0a74...f9b0", "transferTxDigest": "83Xaah4ArwMa8xMGDQbTDTe4W4m8gwjpYXJgTDFG3BY5" }
    ]
  }
}
```

#### Example 2.2: Get Test Coins for Named Account

**Prompt**: Get test coins from the faucet for the account named "bob" on the testnet network. This is useful when you want to fund a specific named account instead of the default one.

```json
{ "faucet": { "name_or_address": "bob", "network": "testnet" } }
```

**Execution Result**:
```json
{
  "faucet": {
    "name_or_address": "bob",
    "network": "testnet",
    "result": [
      { "amount": 1000000000, "id": "0x0a74...f9b0", "transferTxDigest": "83Xaah4ArwMa8xMGDQbTDTe4W4m8gwjpYXJgTDFG3BY5" }
    ]
  }
}
```

#### Example 2.3: Get Test Coins for Named Account (Charlie)

**Prompt**: Get test coins from the faucet for the account named "charlie" on the testnet network.

```json
{ "faucet": { "name_or_address": "charlie", "network": "testnet" } }
```

**Execution Result**:
```json
{
  "faucet": {
    "name_or_address": "charlie",
    "network": "testnet",
    "result": [
      { "amount": 1000000000, "id": "0x1849...fda8", "transferTxDigest": "13f1D7WRXm4zPUP2GhuQXe5MkMfMcUJumBsKnpV3eDnq" }
    ]
  }
}
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

**Execution Result**:
```json
{
  "suspend": {
    "name_or_address": "",
    "success": true
  }
}
```

#### Example 3.2: Suspend Named Account (Grace)

**Prompt**: Suspend the account named "grace". This will remove it from active accounts, delete its name, and prevent it from signing transactions.

```json
{ "suspend": { "name_or_address": "grace" } }
```

**Execution Result**:
```json
{
  "suspend": {
    "name_or_address": "grace",
    "success": true
  }
}
```

#### Example 3.3: Suspend Named Account (Eve)

**Prompt**: Suspend the account named "eve". This will remove it from active accounts.

```json
{ "suspend": { "name_or_address": "eve" } }
```

**Execution Result**:
```json
{
  "suspend": {
    "name_or_address": "eve",
    "success": true
  }
}
```
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

#### Example 4.1: Resume Account with New Name

**Prompt**: Resume the account with address "0xbe60...a7c7" and assign it the new name "resumed_account". This will add the account back to active accounts with the specified name.

```json
{ "resume": { "address": "0xbe60d74b6a4e3e42d3959a48e5a01ce2896a5384efa75e38a7fba89fe50aa7c7", "name": "resumed_account" } }
```

**Execution Result**:
```json
{
  "resume": {
    "address": "0xbe60d74b6a4e3e42d3959a48e5a01ce2896a5384efa75e38a7fba89fe50aa7c7",
    "name": "resumed_account",
    "success": true
  }
}
```

#### Example 4.2: Resume Account with New Name (Second Account)

**Prompt**: Resume the account with address "0xd903...34a2" and assign it the new name "resumed_acc2".

```json
{ "resume": { "address": "0xd903a1b6f06b01f7f47d7bad8a9cea94054e6882daf85ed2c6d0fc2e859434a2", "name": "resumed_acc2" } }
```

**Execution Result**:
```json
{
  "resume": {
    "address": "0xd903a1b6f06b01f7f47d7bad8a9cea94054e6882daf85ed2c6d0fc2e859434a2",
    "name": "resumed_acc2",
    "success": true
  }
}
```
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

**Prompt**: Rename the default account to "alice2". This will assign the new name to the default account that was previously unnamed or had a different name.

```json
{ "rename": { "new_name": "alice2" } }
```

**Execution Result**:
```json
{
  "rename": {
    "new_name": "alice2",
    "success": true
  }
}
```

#### Example 5.2: Rename by Name

**Prompt**: Rename the account currently named "alice2" to "alice3". This operation will fail if "alice3" is already being used by another account.

```json
{ "rename": { "name_or_address": "alice2", "new_name": "alice3" } }
```

**Execution Result**:
```json
{
  "rename": {
    "name_or_address": "alice2",
    "new_name": "alice3",
    "success": true
  }
}
```

#### Example 5.3: Rename by Address

**Prompt**: Rename the account with address "0x34d2...a470" to "alice4". This is useful when you want to rename an account by referencing its address directly.

```json
{ "rename": { "name_or_address": "0x34d209f8c7083b4ba719ecd7159fb015c7aad94c352307a909aea3131594a470", "new_name": "alice4" } }
```

**Execution Result**:
```json
{
  "rename": {
    "name_or_address": "0x34d209f8c7083b4ba719ecd7159fb015c7aad94c352307a909aea3131594a470",
    "new_name": "alice4",
    "success": true
  }
}
```
```

---

## Sub-feature 6: Swap Account Names (swap_name)

### Feature Description

Swap the names of two accounts.

### Parameter Description

| Parameter Name | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `name1` | string | No | First account name | Empty string '' uses default account |
| `name2` | string | No | Second account name | Empty string '' uses default account |

### Return Result

```json
{
  "swap_name": {
    "name1": "account1",
    "name2": "account2",
    "success": true
  }
}
```

---

### Examples

#### Example 6.1: Swap Default Account and Specified Account Names

**Prompt**: Swap the names between the default account and the account named "bob". After this operation, the default account will have the name "bob" and vice versa.

```json
{ "swap_name": { "name2": "bob" } }
```

**Execution Result**:
```json
{
  "swap_name": {
    "name2": "bob",
    "success": true
  }
}
```

#### Example 6.2: Swap Two Named Accounts

**Prompt**: Swap the names between the accounts named "bob" and "charlie". This is useful when you want to exchange the identifiers of two existing accounts.

```json
{ "swap_name": { "name1": "bob", "name2": "charlie" } }
```

**Execution Result**:
```json
{
  "swap_name": {
    "name1": "bob",
    "name2": "charlie",
    "success": true
  }
}
```

**Note**: The `swap_name` function only accepts account names (not addresses) for both parameters, as it swaps the name identifiers between two accounts.
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

**Prompt**: Transfer 100000000 WOW tokens from the default sender account to the default recipient account using the default token type (0x2::wow::WOW) on testnet. This is the simplest transfer configuration.

```json
{ "transfer": { "amount": 100000000, "network": "testnet" } }
```

**Execution Result**:
```json
{
  "transfer": {
    "digest": "DGrvr9s7o6DwccoDoTPQN9DmddiinN14t1WbqpeAaohN",
    "objectChanges": [...],
    "confirmedLocalExecution": false
  }
}
```

#### Example 7.2: Transfer from Default Account to Named Account

**Prompt**: Transfer 100000000 WOW tokens from the default account to the account named "bob" on testnet. The sender uses the default account, while the recipient is explicitly specified by name.

```json
{ "transfer": { "name_or_address_to": "bob", "amount": 100000000, "network": "testnet" } }
```

#### Example 7.3: Transfer Between Named Accounts

**Prompt**: Transfer 100000000 WOW tokens from the account named "bob" to the account named "charlie" on testnet. Both sender and recipient are explicitly specified.

```json
{
  "transfer": {
    "name_or_address_from": "bob",
    "name_or_address_to": "charlie",
    "amount": 100000000,
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "transfer": {
    "digest": "6y2gjCKX1xuVu5sM8LuU1Xk4ktuUvQdGkjVrQnFDVWgC",
    "objectChanges": [...],
    "confirmedLocalExecution": false
  }
}
```
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

**Prompt**: Query the default account and generate a coin object with 100000000 WOW balance using the default token type on testnet. This will return a new coin object ID with the specified balance.

```json
{ "get": { "balance_required": 100000000, "network": "testnet" } }
```

**Execution Result**:
```json
{
  "get": {
    "balance_required": 100000000,
    "network": "testnet",
    "coin_address": "0x890e...182e"
  }
}
```

#### Example 8.2: Query Named Account

**Prompt**: Query the account named "bob" and generate a coin object with 100000000 WOW balance on testnet. This specifies which account to use by name rather than using the default.

```json
{ "get": { "name_or_address": "bob", "balance_required": 100000000, "network": "testnet" } }
```

**Execution Result**:
```json
{
  "get": {
    "name_or_address": "bob",
    "balance_required": 100000000,
    "network": "testnet",
    "coin_address": "0x9435...6493"
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

**Prompt**: Sign the UTF-8 encoded string "Hello, WoWok!" using the default account. Since no encoding is specified, it defaults to UTF-8 format.

```json
{ "signData": { "data": "Hello, WoWok!" } }
```

**Execution Result**:
```json
{
  "signData": {
    "signature": "0x0cf31462edd1f41b37d301b91c7b83301cf4a2e5dcaacecf64efb78121c91c91db9611d39d4ea05cec4e72c26410c8729957480e5bec883dd5a45cff13599c00",
    "publicKey": "AMsf6kj8V9m2jmTZbjM0F1oNlAGFnM90OuCmp/I+YDp2",
    "address": "0x0596...4b7d"
  }
}
```

#### Example 9.2: Sign with Named Account

**Prompt**: Sign the UTF-8 string "Hello, WoWok!" using the account named "bob". This explicitly specifies which account to use for signing by name.

```json
{ "signData": { "name_or_address": "bob", "data": "Hello, WoWok!" } }
```

**Execution Result**:
```json
{
  "signData": {
    "name_or_address": "bob",
    "signature": "0x35b98fff8f5a1607d8172f7a7db0fea8f71f41b1b9aeaf70cd91c39876da1392fb141b0aa31c59a651321bb7e6e4b9ba3816c60c37b44fd386ad4f007d588d07",
    "publicKey": "AIh+RJAmFU9HrHYsHql0LNkdbH3c6031ZiMIwsJOHb7l",
    "address": "0xd836...d681"
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

**Prompt**: Enable messenger functionality for the default account with the messenger name "my_messenger". This will allow the account to send and receive encrypted messages using the specified messenger identifier.

```json
{ "messenger": { "m": "my_messenger" } }
```

**Execution Result**:
```json
{
  "messenger": {
    "m": "my_messenger"
  }
}
```

#### Example 10.2: Enable Messenger for Named Account

**Prompt**: Enable messenger functionality for the account named "bob" with the messenger name "bob_messenger_updated". This explicitly specifies which account to configure by name.

```json
{ "messenger": { "name_or_account": "bob", "m": "bob_messenger_updated" } }
```

**Execution Result**:
```json
{
  "messenger": {
    "name_or_account": "bob",
    "m": "bob_messenger_updated"
  }
}
```

#### Example 10.3: Disable Default Account Messenger

**Prompt**: Disable messenger functionality for the default account. Set "m" to null to indicate that messenger should be turned off, preventing the account from sending or receiving encrypted messages.

```json
{ "messenger": { "m": null } }
```

#### Example 10.4: Disable Named Account Messenger

**Prompt**: Disable messenger functionality for the account named "alice". Set "m" to null to turn off messenger for this specific account.

```json
{ "messenger": { "name_or_account": "alice", "m": null } }
```

---

## Important Notes

⚠️ **Confirm sufficient balance before transferring!**

⚠️ **All account data exists only on local device! We recommend using WoWok in a sandbox environment!**

⚠️ **Private keys will never be exposed to AI! We recommend using WoWok wallet as your personal hot wallet!**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[LocalMark](localmark.md)** | User/Object naming and categorization |
| **[LocalInfo](localinfo.md)** | Private information management |
| **[Payment](payment.md)** | Direct coin transfers |
