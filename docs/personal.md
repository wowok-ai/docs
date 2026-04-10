# Personal Component (🆔 Public Identity)

---

## Component Overview

The Personal component is used to establish and manage on-chain public identity.

⚠️ **CRITICAL: All content here will be permanently public on the blockchain!**

---

## Function List

| Name | Purpose | Usage Scenario | Significance |
|------|---------|----------------|--------------|
| **Set Profile Description** | Add or update public profile description | Introducing yourself publicly on-chain | Establishes your public identity presence |
| **Add Personal Info** | Add public personal information (social media, URLs) | Sharing GitHub, Twitter, website links | Provides verifiable public contact points |
| **Remove Personal Info** | Remove specific public information items | Updating or removing outdated links | Keeps public profile current and accurate |
| **Clear All Personal Info** | Remove all public personal information | Resetting public profile completely | Wipes all public personal data from identity |
| **Add On-Chain Mark** | Add public marks (name + tags) to addresses | Labeling your services or addresses publicly | Creates public, verifiable identity labels |
| **Remove Mark Tags** | Remove specific tags from on-chain marks | Updating or deprecating service labels | Keeps public marking accurate over time |
| **Clear Marks** | Clear all marks from specified addresses | Removing public labels from addresses | Wipes public identity marks from addresses |
| **Transfer Mark** | Transfer on-chain identity mark to another address | Selling or transferring mark ownership | Allows mark ownership to change hands |
| **Replace Mark** | Replace current mark with a new mark object | Upgrading or replacing mark system | Enables mark system migration |
| **Destroy Mark** | Permanently destroy on-chain identity mark | Removing mark from blockchain permanently | Irreversibly removes public identity mark |

---

## Schema Tree

```
personal
├── operation_type: "personal"
├── data
│   ├── description (Profile description, optional)
│   ├── referrer (Referrer ID or null, optional)
│   ├── information
│   │   ├── op: "add"
│   │   │   └── data (Personal info array)
│   │   │       ├── name (Info name)
│   │   │       ├── default (Default value)
│   │   │       ├── contents (Content array, optional)
│   │   │       ├── createdAt (Creation time, optional)
│   │   │       └── updatedAt (Update time, optional)
│   │   ├── op: "remove"
│   │   │   └── name (Info name array)
│   │   └── op: "clear"
│   ├── mark
│   │   ├── op: "add"
│   │   │   └── data (Mark data array)
│   │   │       ├── address (Address)
│   │   │       ├── name (Name, optional)
│   │   │       └── tags (Tag array, optional)
│   │   ├── op: "remove"
│   │   │   └── data (Removal data array)
│   │   │       ├── address (Address)
│   │   │       └── tags (Tag array, optional)
│   │   ├── op: "clear"
│   │   │   └── address (Address array)
│   │   ├── op: "transfer"
│   │   │   └── to (Target address)
│   │   ├── op: "replace"
│   │   │   └── new_mark_object (New mark object ID)
│   │   └── op: "destroy"
└── env (optional)
    ├── account (Account name/address)
    ├── permission_guard (Permission Guard array)
    ├── no_cache (Disable cache)
    ├── network (Network: localnet/testnet)
    └── referrer (Referrer ID)
```

---

## Complete Tool Call Structure

Personal operations use the following top-level structure:

```json
{
  "operation_type": "personal",
  "data": { ... },
  "env": { ... }
}
```

---

## Function 1: Set Profile Description (description)

### Description

Set or update your public profile description. This will be permanently public on the blockchain.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "personal" |
| `data.description` | string | Yes | Profile description (max 4000 chars) |
| `data.referrer` | string/null | No | Referrer ID or null |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Description is permanently public!** Do not include sensitive information.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Set Basic Profile Description

**Prompt**: Set public profile description to "Web3 developer and open source contributor".

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Web3 developer and open source contributor"
  }
}
```

---

#### Example 1.2: Set Description with Referrer

**Prompt**: Set profile description and referrer to "alice".

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Blockchain enthusiast and builder",
    "referrer": "alice"
  }
}
```

---

## Function 2: Manage Personal Information (information)

### Description

Manage on-chain public personal information. Safe content: social media accounts, URLs, public emails. Never include: phone numbers, addresses, private keys.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "personal" |
| `data.information.op` | string | Yes | Operation type: "add" \| "remove" \| "clear" |
| `data.information.data` | array | No | Personal info array (required when op="add") |
| `data.information.name` | array | No | Info name array (required when op="remove") |
| `data.description` | string | No | Profile description |
| `data.referrer` | string/null | No | Referrer ID |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **All content is permanently public!** Do not include sensitive information.

⚠️ **Safe content: social media, URLs, public emails!**

⚠️ **Never include: phone numbers, addresses, private keys!**

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 2.1: Add Personal Information

**Prompt**: Add public personal information: GitHub link "https://github.com/devuser" and Twitter handle "@devuser".

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "add",
      "data": [
        {
          "name": "github",
          "default": "https://github.com/devuser"
        },
        {
          "name": "twitter",
          "default": "@devuser"
        }
      ]
    }
  }
}
```

---

#### Example 2.2: Remove Personal Information

**Prompt**: Remove personal information named "old_website".

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "remove",
      "name": ["old_website"]
    }
  }
}
```

---

#### Example 2.3: Clear All Personal Information

**Prompt**: Clear all public personal information from profile.

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "clear"
    }
  }
}
```

---

#### Example 2.4: Add Personal Info with Description

**Prompt**: Add website info "https://myproject.io" and set profile description.

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Building the future of decentralized applications",
    "information": {
      "op": "add",
      "data": [
        {
          "name": "website",
          "default": "https://myproject.io"
        }
      ]
    }
  }
}
```

---

## Function 3: Manage On-Chain Identity Marks (mark)

### Description

Manage on-chain identity marks. For private marks, please use the 'local' tool.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "personal" |
| `data.mark.op` | string | Yes | Operation type: "add" \| "remove" \| "clear" \| "transfer" \| "replace" \| "destroy" |
| `data.mark.data` | array | No | Mark data array (required for "add"/"remove") |
| `data.mark.address` | array | No | Address array (required for "clear") |
| `data.mark.to` | string | No | Target address (required for "transfer") |
| `data.mark.new_mark_object` | string | No | New mark object ID (required for "replace") |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **This is on-chain public marks!** For private marks, please use the 'local' tool.

⚠️ **Marks are permanently public!**

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 3.1: Add On-Chain Mark

**Prompt**: Add on-chain mark for address "service_wallet", name as "my_decentralized_service", tags as "service" and "active".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "service_wallet",
          "name": "my_decentralized_service",
          "tags": ["service", "active"]
        }
      ]
    }
  }
}
```

---

#### Example 3.2: Remove On-Chain Mark Tags

**Prompt**: Remove "deprecated" tag from address "old_service_wallet".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "remove",
      "data": [
        {
          "address": "old_service_wallet",
          "tags": ["deprecated"]
        }
      ]
    }
  }
}
```

---

#### Example 3.3: Clear On-Chain Marks

**Prompt**: Clear all marks for addresses "wallet_1" and "wallet_2".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "clear",
      "address": ["wallet_1", "wallet_2"]
    }
  }
}
```

---

#### Example 3.4: Transfer On-Chain Mark

**Prompt**: Transfer on-chain identity mark to address "new_owner_wallet".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "transfer",
      "to": "new_owner_wallet"
    }
  }
}
```

---

#### Example 3.5: Replace On-Chain Mark

**Prompt**: Replace current on-chain identity mark with new mark object "new_mark_object_id".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "replace",
      "new_mark_object": "new_mark_object_id"
    }
  }
}
```

---

#### Example 3.6: Destroy On-Chain Mark

**Prompt**: Permanently destroy on-chain identity mark.

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "destroy"
    }
  }
}
```

---

## Function 4: Combined Operations

### Description

Execute multiple Personal operations in one transaction, such as adding personal information and marks simultaneously.

### Important Notes

⚠️ **Combined operations execute in the same transaction!** All operations are atomic, either all succeed or all fail.

### Examples

#### Example 4.1: Add Personal Info + Add Mark

**Prompt**: Add GitHub info, add mark for "service_wallet", and set profile description.

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Full-stack developer building decentralized services",
    "information": {
      "op": "add",
      "data": [
        {
          "name": "github",
          "default": "https://github.com/devbuilder"
        }
      ]
    },
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "service_wallet",
          "name": "my_service",
          "tags": ["service"]
        }
      ]
    }
  }
}
```

---

#### Example 4.2: Full Parameters Example

**Prompt**: On testnet network, set description, add personal info, add mark, and set referrer to "bob".

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Complete public identity profile",
    "referrer": "bob",
    "information": {
      "op": "add",
      "data": [
        {
          "name": "website",
          "default": "https://myprofile.io"
        },
        {
          "name": "twitter",
          "default": "@myprofile"
        }
      ]
    },
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "main_wallet",
          "name": "primary_wallet",
          "tags": ["personal", "primary"]
        }
      ]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

## Important Notes

⚠️ **All content is permanently public!** Do not include sensitive information.

⚠️ **Safe content: social media, URLs, public emails!**

⚠️ **Never include: phone numbers, addresses, private keys!**

⚠️ **On-chain marks are permanently public!** For private marks, please use the 'local' tool.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading |
| **[Contact](contact.md)** | Public contact information |
| **[LocalMark](localmark.md)** | User/Object naming and categorization |
| **[Account](account.md)** | Local wallet management |
