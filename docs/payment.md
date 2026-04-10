# Payment Component (💰 Direct Transfer)

---

## Component Overview

The Payment component is used to send instant, irreversible token transfers to any wallet address. Payment is an immutable object that can only be created, not modified.

---

## Complete Tool Call Structure

Payment operations use the following top-level structure:

```json
{
  "operation_type": "payment",
  "data": { ... },    // Payment data definition
  "env": { ... }       // Execution environment (optional)
}
```

---

## Feature Tree

```
payment (Payment Object)
├── operation_type: "payment" (fixed value)
├── data (Payment data definition)
│   ├── object (required, Payment object)
│   │   ├── name (optional, Payment name)
│   │   └── type (type)
│   ├── revenue (required, recipient and amount array)
│   │   ├── recipient (recipient address)
│   │   └── amount (amount)
│   └── info (required, payment information)
└── env (optional, execution environment)
    ├── account (optional, use specified account)
    ├── permission_guard (optional, permission Guard list)
    ├── no_cache (optional, whether to disable cache)
    ├── network (optional, network selection)
    └── referrer (optional, referrer ID)
```

---

## Sub-feature 1: Create Payment

### Feature Description

Create a Payment object to send tokens to one or more recipients. Payment is an immutable object and cannot be modified after creation.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "payment" |
| `data.object.name` | string | No | Payment name | Max 64 BCS characters, cannot start with '0x' |
| `data.revenue` | array | Yes | Recipient and amount array | At least one recipient |
| `data.revenue[].recipient` | string | Yes | Recipient address | Account name or address |
| `data.revenue[].amount` | string/number | Yes | Amount | Minimum unit |
| `data.info` | object | Yes | Payment information | Payment related information |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.permission_guard` | array | No | Permission Guard list | Guard ID array |
| `env.no_cache` | boolean | No | Whether to disable cache | true=disable; false=enable |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |
| `env.referrer` | string | No | Referrer ID | Account name or address |

### Important Notes

⚠️ **`name` must be placed inside `object`!** Do not place at data root level.

⚠️ **Payment is an immutable object!** Can only be created, not modified.

⚠️ **Transfer is irreversible!** Please confirm recipient address is correct.

⚠️ **Ensure sufficient balance!**

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Single Recipient Transfer

**Prompt**: Create a Payment to transfer 5000000000 minimum unit tokens to "friend_address".

```json
{
  "operation_type": "payment",
  "data": {
    "object": {},
    "revenue": [
      {
        "recipient": "friend_address",
        "amount": "5000000000"
      }
    ],
    "info": {
      "remark": "Thanks for the help!"
    }
  }
}
```

---

#### Example 1.2: Named Payment

**Prompt**: Create a Payment named "payment_to_friend" to transfer to "friend_address".

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "payment_to_friend"
    },
    "revenue": [
      {
        "recipient": "friend_address",
        "amount": "5000000000"
      }
    ],
    "info": {
      "remark": "Thanks for the help!"
    }
  }
}
```

---

#### Example 1.3: Multiple Recipients Transfer

**Prompt**: Create a Payment to transfer to multiple recipients simultaneously.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "team_payment"
    },
    "revenue": [
      {
        "recipient": "alice_address",
        "amount": "3000000000"
      },
      {
        "recipient": "bob_address",
        "amount": "2000000000"
      }
    ],
    "info": {
      "remark": "Team bonus"
    }
  }
}
```

---

#### Example 1.4: Full Parameter Example

**Prompt**: On testnet network, create a Payment named "full_payment" to transfer to "recipient_address", add remark, use default account, and set network.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "full_payment"
    },
    "revenue": [
      {
        "recipient": "recipient_address",
        "amount": "10000000000"
      }
    ],
    "info": {
      "remark": "Full parameter example payment"
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

⚠️ **Payment is an immutable object!** Can only be created, not modified.

⚠️ **Transfer is irreversible!** Please confirm recipient address is correct.

⚠️ **Ensure sufficient balance!**

---

## Related Components

- **Treasury**: Fund management
- **Reward**: Reward pool
- **Allocation**: Auto distribution
- **Service**: Service marketplace
- **Order**: Order management
