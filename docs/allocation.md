# Allocation Component (📤 Auto Distribution)

---

## Component Overview

The Allocation component is used to create distribution plans that automatically distribute funds to multiple recipients.

---

## Function Tree

```
Allocation Component
├── Create New Allocation
│   ├── Set Name (object.name)
│   ├── Set Type (object.type = "Allocation")
│   ├── Configure Allocators (allocators)
│   ├── Initial Deposit (coin)
│   └── Set Payment Info (payment_info)
└── Operate Existing Allocation
    ├── Receive Funds (received_coins)
    └── Execute Distribution (alloc_by_guard)
```

---

## Sub-function 1: Create New Allocation

### Function Description

Create a new Allocation object for automatic fund distribution.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.type` | string | Yes | Object type | Must be "Allocation" |
| `allocators.allocators` | array | Yes | Allocator list |
| `allocators.allocators[].to` | string | Yes | Recipient address or name |
| `allocators.allocators[].ratio` | string | Yes | Distribution ratio (1000000000 = 100%) |
| `coin` | string | No | Initial deposit amount (minimum unit) |
| `payment_info.payment_remark` | string | No | Payment remark |
| `payment_info.payment_index` | number | No | Payment index |

### Important Notes

⚠️ **The sum of ratios should equal 10000 (i.e., 100%)**.

### Examples

#### Example 1.1: Create Simple Allocation

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "name": "profit_sharing",
      "type": "Allocation"
    },
    "allocators": {
      "allocators": [
        {
          "to": "founder_address",
          "ratio": "500000000"
        },
        {
          "to": "developer_address",
          "ratio": "300000000"
        },
        {
          "to": "marketing_address",
          "ratio": "200000000"
        }
      ]
    }
  }
}
```

#### Example 1.2: Create Allocation with Initial Deposit

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "name": "monthly_profit",
      "type": "Allocation"
    },
    "allocators": {
      "allocators": [
        {
          "to": "ceo_address",
          "ratio": "400000000"
        },
        {
          "to": "cto_address",
          "ratio": "300000000"
        },
        {
          "to": "coo_address",
          "ratio": "300000000"
        }
      ]
    },
    "coin": "100000000000",
    "payment_info": {
      "payment_remark": "Monthly profit sharing"
    }
  }
}
```

---

## Sub-function 2: Operate Existing Allocation - Receive Funds

### Function Description

Receive CoinWrapper objects sent to the Allocation object and deposit them into the pending distribution balance.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `object` | string/object | Yes | Allocation object ID or name |
| `received_coins` | object | No | Receive funds configuration |
| `received_coins.balance` | string | No | Specify balance |
| `received_coins.object` | string | No | Specify object |
| `received_coins.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "received_coins": {
      "recent": true
    }
  }
}
```

---

## Sub-function 3: Operate Existing Allocation - Execute Distribution

### Function Description

Verify the specified Guard and execute the corresponding fund distribution.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `object` | string/object | Yes | Allocation object ID or name |
| `alloc_by_guard` | string | Yes | Guard object ID or name |

### Example

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "alloc_by_guard": "distribution_guard"
  }
}
```

---

## Sub-function 4: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "received_coins": {
      "recent": true
    },
    "alloc_by_guard": "distribution_guard"
  }
}
```

---

## Important Notes

⚠️ **The sum of ratios should equal 10000 (i.e., 100%)**.

⚠️ **Automatic distribution can be initiated after deposit**.

⚠️ **Distribution records are permanently public**.

---

## Related Components

- **Treasury**: Fund management
- **Reward**: Reward pool
- **Service**: Service marketplace
- **Permission**: Permission management
- **Guard**: Validation rules
