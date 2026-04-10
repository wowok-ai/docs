# Personal Component (🆔 Public Identity)

---

## Component Overview

The Personal component is used to establish and manage on-chain public identity.

⚠️ **CRITICAL: All content here will be permanently public on the blockchain!**

---

## Complete Tool Call Structure

Personal operations use the following top-level structure:

```json
{
  "operation_type": "personal",
  "data": { ... },    // Personal data definition
  "env": { ... },      // Execution environment (optional)
  "submission": { ... } // Guard submission data (optional)
}
```

---

## Feature Tree

```
personal (Public Identity Profile)
├── operation_type: "personal" (fixed value)
├── data (Personal data definition)
│   ├── description (optional, description)
│   ├── referrer (optional, referrer ID)
│   ├── information (optional, personal information management)
│   │   ├── op: "add" (add personal information)
│   │   │   └── data (personal information array)
│   │   │       ├── name (information name)
│   │   │       ├── default (default value)
│   │   │       ├── contents (content array)
│   │   │       ├── createdAt (creation time)
│   │   │       └── updatedAt (update time)
│   │   ├── op: "remove" (remove personal information)
│   │   │   └── name (information name array)
│   │   └── op: "clear" (clear all personal information)
│   ├── mark (optional, on-chain identity mark management)
│   │   ├── op: "add" (add mark)
│   │   │   └── data (mark data array)
│   │   │       ├── address (address)
│   │   │       ├── name (optional, name)
│   │   │       └── tags (optional, tag array)
│   │   ├── op: "remove" (remove mark)
│   │   │   └── data (removal data array)
│   │   │       ├── address (address)
│   │   │       └── tags (optional, tag array)
│   │   ├── op: "clear" (clear marks)
│   │   │   └── address (address array)
│   │   ├── op: "transfer" (transfer mark)
│   │   │   └── to (target address)
│   │   ├── op: "replace" (replace mark)
│   │   │   └── new_mark_object (new mark object ID)
│   │   └── op: "destroy" (destroy mark)
│   └── faucet (optional, whether to claim faucet tokens)
├── env (optional, execution environment)
│   ├── account (optional, use specified account)
│   ├── permission_guard (optional, permission Guard list)
│   ├── no_cache (optional, whether to disable cache)
│   ├── network (optional, network selection)
│   └── referrer (optional, referrer ID)
└── submission (optional, Guard submission data)
    └── items (submission item array)
        ├── index (index)
        └── data (data)
```

---

## Sub-feature 1: Manage Personal Information (information)

### Feature Description

Manage on-chain public personal information. Safe content: social media accounts, URLs, public emails. Never include: phone numbers, addresses, private keys.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "personal" |
| `data.description` | string | No | Description | Max 4000 characters |
| `data.referrer` | string | No | Referrer ID | Account name or address |
| `data.information.op` | string | Yes | Operation type | "add" \| "remove" \| "clear" |
| `data.information.data` | array | No | Personal information array | Required when op is "add" |
| `data.information.name` | array | No | Information name array | Required when op is "remove" |
| `data.faucet` | boolean | No | Whether to claim faucet tokens | Only valid on some networks |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.permission_guard` | array | No | Permission Guard list | Guard ID array |
| `env.no_cache` | boolean | No | Whether to disable cache | true=disable; false=enable |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |
| `env.referrer` | string | No | Referrer ID | Account name or address |

### Important Notes

⚠️ **All content is permanently public!** Do not include sensitive information.

⚠️ **Safe content: social media, URLs, public emails!**

⚠️ **Never include: phone numbers, addresses, private keys!**

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Add Personal Information

**Prompt**: Add public personal information, including GitHub link and Twitter account.

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "add",
      "data": [
        {
          "name": "github",
          "default": "https://github.com/username"
        },
        {
          "name": "twitter",
          "default": "@username"
        }
      ]
    }
  }
}
```

---

#### Example 1.2: Remove Personal Information

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

#### Example 1.3: Clear All Personal Information

**Prompt**: Clear all public personal information.

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

#### Example 1.4: Add Personal Information and Claim Faucet

**Prompt**: Add personal information and claim faucet tokens.

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "add",
      "data": [
        {
          "name": "website",
          "default": "https://example.com"
        }
      ]
    },
    "faucet": true
  }
}
```

---

## Sub-feature 2: Manage On-Chain Identity Marks (mark)

### Feature Description

Manage on-chain identity marks. For private marks, please use the 'local' tool.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "personal" |
| `data.mark.op` | string | Yes | Operation type | "add" \| "remove" \| "clear" \| "transfer" \| "replace" \| "destroy" |
| `data.mark.data` | array | No | Mark data array | Required when op is "add"/"remove" |
| `data.mark.address` | array | No | Address array | Required when op is "clear" |
| `data.mark.to` | string | No | Target address | Required when op is "transfer" |
| `data.mark.new_mark_object` | string | No | New mark object ID | Required when op is "replace" |
| `env` | object | No | Execution environment | Same as above |

### Important Notes

⚠️ **This is on-chain public marks!** For private marks, please use the 'local' tool.

⚠️ **Marks are permanently public!**

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 2.1: Add On-Chain Mark

**Prompt**: Add on-chain mark for address, name as "my_service", tags as "service" and "active".

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "service_address",
          "name": "my_service",
          "tags": ["service", "active"]
        }
      ]
    }
  }
}
```

---

#### Example 2.2: Remove On-Chain Mark Tags

**Prompt**: Remove "deprecated" tag from address.

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "remove",
      "data": [
        {
          "address": "old_service_address",
          "tags": ["deprecated"]
        }
      ]
    }
  }
}
```

---

#### Example 2.3: Clear On-Chain Marks

**Prompt**: Clear all tags for specified address.

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "clear",
      "address": ["address_1", "address_2"]
    }
  }
}
```

---

#### Example 2.4: Transfer On-Chain Mark

**Prompt**: Transfer on-chain identity mark to another address.

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "transfer",
      "to": "new_owner_address"
    }
  }
}
```

---

#### Example 2.5: Replace On-Chain Mark

**Prompt**: Replace current on-chain identity mark with a new mark object.

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

#### Example 2.6: Destroy On-Chain Mark

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

## Sub-feature 3: Combined Operations

### Feature Description

Execute multiple Personal operations in one transaction, such as adding personal information and marks simultaneously.

### Important Notes

⚠️ **Combined operations execute in the same transaction!** All operations are atomic, either all succeed or all fail.

### Examples

#### Example 3.1: Add Personal Information + Add Mark

**Prompt**: Add personal information and on-chain mark.

```json
{
  "operation_type": "personal",
  "data": {
    "description": "My public identity profile",
    "information": {
      "op": "add",
      "data": [
        {
          "name": "github",
          "default": "https://github.com/username"
        }
      ]
    },
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "my_service_address",
          "name": "my_service",
          "tags": ["service"]
        }
      ]
    }
  }
}
```

---

#### Example 3.2: Full Parameter Example

**Prompt**: On testnet network, add personal information, add mark, set referrer, claim faucet, and use default account.

```json
{
  "operation_type": "personal",
  "data": {
    "description": "Full parameter example",
    "referrer": "referrer_address",
    "information": {
      "op": "add",
      "data": [
        {
          "name": "website",
          "default": "https://example.com"
        }
      ]
    },
    "mark": {
      "op": "add",
      "data": [
        {
          "address": "service_address",
          "name": "my_service",
          "tags": ["service"]
        }
      ]
    },
    "faucet": true
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

- **Service**: Service marketplace
- **Contact**: Communication center
- **LocalMark**: Local marks
- **Account**: Account management
