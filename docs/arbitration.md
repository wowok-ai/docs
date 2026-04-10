# Arbitration Component (⚖️ Dispute Resolution)

---

## Component Overview

The Arbitration component provides a transparent on-chain arbitration system for resolving order disputes.

---

## Function Tree

```
Arbitration Component
├── Create New Arbitration
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   ├── Set Description (description)
│   ├── Set Location (location)
│   └── Set Arbitration Fee (fee)
├── Create Dispute (dispute)
├── Manage Arbitration Process
│   ├── Confirm Materials (confirm)
│   ├── Change Voting Deadline (voting_deadline_change)
│   ├── Vote (vote)
│   ├── Provide Feedback (feedback)
│   ├── Give Arbitration Result (arbitration)
│   ├── Reset Arbitration (reset)
│   └── Withdraw Arbitration Fee (arb_withdraw)
├── Distribute Arbitration Fees (fees_transfer)
├── Manage Guards
│   ├── Set Usage Guard (usage_guard)
│   └── Manage Voting Guards (voting_guard)
│       ├── Add Guard (voting_guard.op = "add")
│       ├── Set Guard List (voting_guard.op = "set")
│       ├── Remove Guard (voting_guard.op = "remove")
│       └── Clear Guards (voting_guard.op = "clear")
├── Pause/Resume (pause)
├── Bind Contact (um)
└── Receive Objects (owner_receive)
```

---

## Sub-function 1: Create New Arbitration

### Function Description

Create a new Arbitration object for resolving order disputes.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.id` | string | No | Object ID | 0x prefix + 64 hex characters |
| `object.type` | string | Yes | Object type | Must be "Arbitration" |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Arbitration object description | Max 4000 characters |
| `location` | string | No | Arbitration location | Max 256 characters |
| `fee` | string | No | Arbitration fee |

### Examples

#### Example 1.1: Create Simple Arbitration

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration",
      "type": "Arbitration",
      "permission": "existing_permission"
    },
    "description": "Service dispute arbitration",
    "location": "Online arbitration",
    "fee": "1000000000"
  }
}
```

#### Example 1.2: Create Arbitration with New Permission

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "product_arbitration",
      "type": "Arbitration",
      "permission": {
        "name": "arbitration_permission"
      }
    },
    "description": "Product dispute arbitration",
    "location": "Online arbitration"
  }
}
```

---

## Sub-function 2: Create Dispute (dispute)

### Function Description

Create a new Arb object for an order to initiate dispute arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dispute.order` | string | Yes | Order object ID or name |
| `dispute.description` | string | No | Dispute description |
| `dispute.proposition` | array | Yes | List of dispute propositions |
| `dispute.fee` | string | Yes | Dispute processing fee |
| `dispute.namedArb.name` | string | No | Name for the newly created arbitration object |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "dispute": {
      "order": "my_order",
      "description": "Product quality does not meet requirements",
      "proposition": ["Full refund", "Partial refund", "No refund"],
      "fee": "1000000000",
      "namedArb": {
        "name": "my_dispute"
      }
    }
  }
}
```

---

## Sub-function 3: Confirm Materials (confirm)

### Function Description

Confirm the arbitration materials submitted by the user.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `confirm.arb` | string | Yes | Arb object ID or name |
| `confirm.voting_deadline` | number/null | No | Voting deadline (milliseconds), null means no deadline |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "confirm": {
      "arb": "my_dispute",
      "voting_deadline": 1738000000000
    }
  }
}
```

---

## Sub-function 4: Change Voting Deadline (voting_deadline_change)

### Function Description

Change the voting deadline for arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `voting_deadline_change.arb` | string | Yes | Arb object ID or name |
| `voting_deadline_change.voting_deadline` | number/null | Yes | New voting deadline (milliseconds), null means no deadline |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "voting_deadline_change": {
      "arb": "my_dispute",
      "voting_deadline": null
    }
  }
}
```

---

## Sub-function 5: Vote (vote)

### Function Description

Vote on user propositions.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vote.arb` | string | Yes | Arb object ID or name |
| `vote.votes` | array | Yes | Vote list, each value 0-255 |
| `vote.voting_guard` | string | No | Voting Guard object ID/name |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "vote": {
      "arb": "my_dispute",
      "votes": [200, 100, 50]
    }
  }
}
```

---

## Sub-function 6: Provide Feedback (feedback)

### Function Description

Provide arbitration feedback for an Arb object.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `feedback.arb` | string | Yes | Arb object ID or name |
| `feedback.feedback` | string | Yes | Arbitration feedback |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "feedback": {
      "arb": "my_dispute",
      "feedback": "All materials have been reviewed, ready to give arbitration result"
    }
  }
}
```

---

## Sub-function 7: Give Arbitration Result (arbitration)

### Function Description

Provide the final arbitration result.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `arbitration.arb` | string | Yes | Arb object ID or name |
| `arbitration.feedback` | string | Yes | Arbitration feedback |
| `arbitration.indemnity` | number | Yes | Compensation amount, 0 or greater |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "arbitration": {
      "arb": "my_dispute",
      "feedback": "Based on submitted materials, the buyer wins the case",
      "indemnity": 5000000000
    }
  }
}
```

---

## Sub-function 8: Reset Arbitration (reset)

### Function Description

User applies to resubmit materials and restart arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reset.arb` | string | Yes | Arb object ID or name |
| `reset.feedback` | string | Yes | Arbitration feedback |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "reset": {
      "arb": "my_dispute",
      "feedback": "Apply to resubmit materials"
    }
  }
}
```

---

## Sub-function 9: Withdraw Arbitration Fee (arb_withdraw)

### Function Description

Withdraw arbitration fees from the Arb object.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `arb_withdraw.arb` | string | Yes | Arb object ID or name |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "arb_withdraw": {
      "arb": "my_dispute"
    }
  }
}
```

---

## Sub-function 10: Distribute Arbitration Fees (fees_transfer)

### Function Description

Distribute withdrawn arbitration fees.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fees_transfer.to` | object | Yes | Receiving object, can choose allocation or treasury |
| `fees_transfer.to.allocation` | string | No | Allocation object ID/name |
| `fees_transfer.to.treasury` | string | No | Treasury object ID/name |
| `fees_transfer.payment_remark` | string | Yes | Payment remark |
| `fees_transfer.payment_index` | number | Yes | Payment index |
| `fees_transfer.newPayment.name` | string | No | Name for the newly created Payment object |

### Examples

#### Example 10.1: Distribute to Allocation

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "fees_transfer": {
      "to": {
        "allocation": "fee_allocation"
      },
      "payment_remark": "Arbitration fee distribution",
      "payment_index": 0,
      "newPayment": {
        "name": "fee_payment"
      }
    }
  }
}
```

#### Example 10.2: Distribute to Treasury

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "fees_transfer": {
      "to": {
        "treasury": "platform_treasury"
      },
      "payment_remark": "Arbitration fees transferred to platform",
      "payment_index": 0
    }
  }
}
```

---

## Sub-function 11: Set Usage Guard (usage_guard)

### Function Description

Set the verification Guard for users applying for arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `usage_guard` | string/null | Yes | Guard object ID/name, or null to unbind |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "usage_guard": "arbitration_eligibility_check"
  }
}
```

---

## Sub-function 12: Manage Voting Guards (voting_guard)

### Function Description

Manage the verification Guards for arbitration voting.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `voting_guard.op` | string | Yes | Operation type: add/set/remove/clear |
| `voting_guard.guards` | array | Required for add/set | List of Guard object ID/names |

### Operation Type Description

| Operation Type | Description |
|----------------|-------------|
| `add` | Add new Guard to existing list |
| `set` | Replace entire Guard list |
| `remove` | Remove specified Guard (use ID or name) |
| `clear` | Clear all Guards |

### Examples

#### Example 12.1: Add Guard

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "voting_guard": {
      "op": "add",
      "guards": ["voter_eligibility_check"]
    }
  }
}
```

#### Example 12.2: Set Guard List (Replace)

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "voting_guard": {
      "op": "set",
      "guards": ["voter_eligibility_check"]
    }
  }
}
```

#### Example 12.3: Remove Guard

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "voting_guard": {
      "op": "remove",
      "guards": ["old_guard"]
    }
  }
}
```

#### Example 12.4: Clear Guards

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "voting_guard": {
      "op": "clear"
    }
  }
}
```

---

## Sub-function 13: Pause/Resume (pause)

### Function Description

Pause or resume arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pause` | boolean | Yes | Whether to pause |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "pause": true
  }
}
```

---

## Sub-function 14: Bind Contact (um)

### Function Description

Bind a Contact object to Arbitration.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `um` | string/null | Yes | Contact object ID/name, or null to unbind |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "um": "arbitration_contact"
  }
}
```

---

## Sub-function 15: Receive Objects (owner_receive)

### Function Description

Receive objects sent to this Arbitration object and unpack them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner_receive.objects` | array | No | List of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-function 16: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "complete_arbitration",
      "type": "Arbitration",
      "permission": "arbitration_permission"
    },
    "description": "Complete arbitration example",
    "location": "Online arbitration",
    "fee": "1000000000",
    "usage_guard": "arbitration_eligibility_check",
    "voting_guard": {
      "op": "add",
      "guards": ["voter_eligibility_check"]
    },
    "um": "arbitration_contact"
  }
}
```

---

## Important Notes

⚠️ **Arbitration results are irreversible**.

⚠️ **Service needs to pre-configure compensation amount**.

---

## Related Components

- **Service**: Service marketplace
- **Machine**: Workflow template
- **Progress**: Order progress
- **Treasury**: Fund management
- **Order**: Order management
- **Guard**: Validation rules
- **Contact**: Contact information
