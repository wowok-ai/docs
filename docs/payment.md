
# Payment Component (💰 Direct Transfer)

---

## Component Overview

The Payment component is used to send instant, irreversible token transfers to any wallet address. Payment is an immutable object that can only be created, not modified.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Single Recipient Payment** | Send tokens to one recipient | Personal payments, simple transfers | Direct, secure one-to-one token transfers |
| **Create Multi-Recipient Payment** | Send tokens to multiple recipients in one transaction | Team bonuses, payroll, bulk transfers | Efficiently distribute tokens to multiple addresses simultaneously |
| **Named Payment** | Create a named Payment object for tracking | Recorded transactions, audit trails | Creates identifiable payment objects on-chain |
| **Payment with Info** | Add payment metadata (remark, index, for_object, for_guard) | Service payments, order payments, Guard-verified payments | Provides context and verification for payments |

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

## Schema Tree

```
payment (Payment Object)
├── operation_type: "payment" (fixed value)
├── data (Payment data definition)
│   ├── object (object definition, required)
│   │   ├── name|tags|type_parameter (create new object)
│   │   └── type_parameter (token type, e.g., 0x2::wow::WOW)
│   ├── revenue (recipient and amount array, required)
│   │   └── [] (each item has recipient + amount)
│   └── info (payment information, required)
│       ├── remark (payment remark)
│       ├── index (payment index)
│       ├── for_object (optional, related object)
│       └── for_guard (optional, Guard verification)
└── env (optional, execution environment)
    ├── account (string, optional) - account name or address, empty string for default
    ├── network (string, optional) - "testnet" or "mainnet"
    ├── permission_guard (array, optional) - list of permission guard IDs
    ├── no_cache (boolean, optional) - disable caching
    └── referrer (string, optional) - referrer ID
```

---

## Sub-feature 1: Create Single Recipient Payment

### Feature Description

Create a Payment object to send tokens to a single recipient. Payment is an immutable object and cannot be modified after creation.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "payment" |
| `data.object` | object | Yes | Object configuration | Must include type_parameter |
| `data.object.type_parameter` | string | Yes | Token type | e.g., "0x2::wow::WOW" |
| `data.object.name` | string | No | Payment name | Max 64 characters |
| `data.revenue` | array | Yes | Recipient and amount array | At least one recipient, max 200 |
| `data.revenue[].recipient` | object | Yes | Recipient | AccountOrMark_Address with name_or_address |
| `data.revenue[].amount` | object | Yes | Amount | CoinParam with balance field |
| `data.revenue[].amount.balance` | string/number | Yes | Amount value | Minimum unit, no decimals or negatives |
| `data.info` | object | Yes | Payment information | Must include remark and index |
| `data.info.remark` | string | Yes | Payment remark | Description of the payment |
| `data.info.index` | number/string | Yes | Payment index | Numeric identifier for this payment |

### Important Notes

⚠️ **Payment is an immutable object!** Can only be created, not modified.

⚠️ **Transfer is irreversible!** Please confirm recipient address is correct.

⚠️ **Ensure sufficient balance!**

⚠️ **Maximum 200 recipients per payment!**

---

### Examples

#### Example 1.1: Minimal Single Recipient Payment

**Prompt**: Create a Payment to send 5000000000 minimum unit WOW tokens to "alice", add remark "Thanks for the help!", set index 1.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "alice" },
        "amount": { "balance": "5000000000" }
      }
    ],
    "info": {
      "remark": "Thanks for the help!",
      "index": 1
    }
  }
}
```

---

#### Example 1.2: Named Single Recipient Payment

**Prompt**: Create a Payment named "payment_to_alice" to send to "alice", add tags "personal", "payment", use WOW token, remark "Birthday gift", index 2.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "payment_to_alice",
      "tags": ["personal", "payment"],
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "alice" },
        "amount": { "balance": "10000000000" }
      }
    ],
    "info": {
      "remark": "Birthday gift",
      "index": 2
    }
  }
}
```

---

## Sub-feature 2: Create Multi-Recipient Payment

### Feature Description

Create a Payment object to send tokens to multiple recipients in a single transaction. This is efficient for bulk transfers.

---

### Examples

#### Example 2.1: Two Recipients Payment

**Prompt**: Create a Payment to send to "alice" and "bob" simultaneously: "alice" gets 3000000000, "bob" gets 2000000000, add remark "Team bonus", index 10.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "alice" },
        "amount": { "balance": "3000000000" }
      },
      {
        "recipient": { "name_or_address": "bob" },
        "amount": { "balance": "2000000000" }
      }
    ],
    "info": {
      "remark": "Team bonus",
      "index": 10
    }
  }
}
```

---

#### Example 2.2: Named Multi-Recipient Payment

**Prompt**: Create a Payment named "q1_bonus_payment" with tags "payroll", "q1-2025", send to three team members: "charlie" gets 5000000000, "dave" gets 4000000000, "eve" gets 3500000000, remark "Q1 2025 performance bonus", index 15.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "q1_bonus_payment",
      "tags": ["payroll", "q1-2025"],
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "charlie" },
        "amount": { "balance": "5000000000" }
      },
      {
        "recipient": { "name_or_address": "dave" },
        "amount": { "balance": "4000000000" }
      },
      {
        "recipient": { "name_or_address": "eve" },
        "amount": { "balance": "3500000000" }
      }
    ],
    "info": {
      "remark": "Q1 2025 performance bonus",
      "index": 15
    }
  }
}
```

---

## Sub-feature 3: Payment with Additional Info

### Feature Description

Create a Payment with additional metadata, such as linking to a specific object or Guard for verification purposes.

---

### Examples

#### Example 3.1: Payment Linked to Object

**Prompt**: Create a Payment linked to "my_service_order", send 8000000000 to "service_provider", remark "Service order payment", index 100, set for_object to "my_service_order".

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "service_provider" },
        "amount": { "balance": "8000000000" }
      }
    ],
    "info": {
      "remark": "Service order payment",
      "index": 100,
      "for_object": "my_service_order"
    }
  }
}
```

---

#### Example 3.2: Payment with Guard Verification

**Prompt**: Create a Payment that requires Guard verification: send 25000000000 to "merchant", remark "Purchase payment", index 200, set for_guard to "purchase_guard".

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "purchase_payment",
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "merchant" },
        "amount": { "balance": "25000000000" }
      }
    ],
    "info": {
      "remark": "Purchase payment",
      "index": 200,
      "for_guard": "purchase_guard"
    }
  }
}
```

---

#### Example 3.3: Full Payment with Object and Guard

**Prompt**: Create a complete Payment with all fields: named "order_500_payment", tags "service", "order-500", send 15000000000 to "vendor_alice", link to "service_order_500", use "service_guard" for verification, remark "Payment for service order #500", index 500, use WOW token.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "order_500_payment",
      "tags": ["service", "order-500"],
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "vendor_alice" },
        "amount": { "balance": "15000000000" }
      }
    ],
    "info": {
      "remark": "Payment for service order #500",
      "index": 500,
      "for_object": "service_order_500",
      "for_guard": "service_guard"
    }
  }
}
```

---

## Sub-feature 4: Payment with Environment Configuration

### Feature Description

Create a Payment with custom environment settings, such as specifying network or account.

---

### Examples

#### Example 4.1: Payment on Testnet

**Prompt**: On testnet network, create a Payment to send to "test_recipient", 1000000000 WOW, remark "Test payment", index 1, use default account.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "test_recipient" },
        "amount": { "balance": "1000000000" }
      }
    ],
    "info": {
      "remark": "Test payment",
      "index": 1
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

---

#### Example 4.2: Payment with Specific Account

**Prompt**: Use account "payment_manager" to create a Payment to send 6000000000 to "recipient_bob", remark "Project milestone payment", index 88.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": { "name_or_address": "recipient_bob" },
        "amount": { "balance": "6000000000" }
      }
    ],
    "info": {
      "remark": "Project milestone payment",
      "index": 88
    }
  },
  "env": {
    "account": "payment_manager"
  }
}
```

---

## Important Notes

⚠️ **Payment is an immutable object!** Can only be created, not modified.

⚠️ **Transfer is irreversible!** Please confirm recipient address is correct.

⚠️ **Ensure sufficient balance!**

⚠️ **Maximum 200 recipients per payment!**

⚠️ **type_parameter is required!** Specify token type inside object.

⚠️ **All amount values must be positive integers!** No decimals or negative values.

⚠️ **info.remark and info.index are required!** Must provide both for every payment.

⚠️ **Use names instead of addresses in prompts for better readability.**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Treasury](treasury.md)** | Team fund management |
| **[Reward](reward.md)** | Marketing incentives |
| **[Allocation](allocation.md)** | Automatic fund distribution |
| **[Service](service.md)** | WYSIWYG product trading |
| **[Order](order.md)** | Order management |
| **[Guard](guard.md)** | Trust verification engine |

