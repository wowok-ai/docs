
# Arbitration Component (⚖️ Dispute Resolution)

---

## Component Overview

The Arbitration component is WoWok protocol's on-chain dispute resolution module, providing a transparent arbitration system for resolving order conflicts. Arbitration objects can be created with configurable voting rules, receive dispute submissions, confirm materials, vote on propositions, and provide final arbitration results.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Arbitration** | Set up dispute resolution system | Establish order governance | Provides framework for fair conflict resolution |
| **Initiate Dispute** | File conflict case | Report order issues, service failures | Formalizes dispute submission |
| **Confirm Materials** | Validate evidence submission | Review dispute documents | Ensures arbitration based on verified data |
| **Vote on Propositions** | Participate in decision-making | Jury voting, governance | Enables democratic dispute resolution |
| **Issue Ruling** | Deliver final arbitration result | Resolve conflicts, decide compensation | Concludes dispute with binding outcome |

---

## Complete Tool Call Structure

Arbitration operations use the following top-level structure:

```json
{
  "operation_type": "arbitration",
  "data": { ... },    // Arbitration data definition
  "env": { ... },      // Execution environment (optional)
  "submission": { ... } // Guard verification submission (optional)
}
```

---

## Sub-feature 1: Create New Arbitration

### Feature Description

Create a new Arbitration object for resolving order disputes. Newly created arbitrations can be configured with descriptions, locations, fees, and voting guards.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | object | Yes | Create new Arbitration | TypedPermissionObject structure |
| `data.object.name` | string | No | Local mark name | Max 64 characters |
| `data.object.tags` | array | No | Tags array | String array |
| `data.object.onChain` | boolean | No | Whether to mark on-chain | |
| `data.object.replaceExistName` | boolean | No | Replace existing name | |
| `data.object.type` | string | Yes | Object type | Must be "Arbitration" |
| `data.object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `data.object.type_parameter` | string | No | Token type | Default: 0x2::wow::WOW |
| `data.description` | string | No | Arbitration description | Max 65535 characters |
| `data.location` | string | No | Arbitration location | Max 256 characters |
| `data.fee` | number | No | Arbitration fee in smallest units | No decimals or negatives |

---

### Examples

#### Example 1.1: Create Simple Arbitration

**Prompt**: Create a new arbitration named "service_arbitration" with: 1) Type "Arbitration", 2) Permission "existing_permission", 3) Description "Service dispute resolution", 4) Location "Global online arbitration", 5) Fee at 1000000000 (1 WOW).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "service_arbitration",
      "type": "Arbitration",
      "permission": "existing_permission",
      "type_parameter": "0x2::wow::WOW",
      "tags": ["arbitration", "service"],
      "onChain": false
    },
    "description": "Service dispute resolution",
    "location": "Global online arbitration",
    "fee": 1000000000
  }
}
```

#### Example 1.2: Create Arbitration with New Permission and Guards

**Prompt**: Create arbitration "product_arbitration" with: 1) Type "Arbitration", 2) New permission named "arb_permission", 3) Description "Product quality arbitration", 4) Usage guard "eligibility_guard", 5) Voting guards: "senior_judge" with FixedValue 100, "junior_judge" with GuardIdentifier 5.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "product_arbitration",
      "type": "Arbitration",
      "permission": {
        "name": "arb_permission"
      }
    },
    "description": "Product quality arbitration",
    "usage_guard": "eligibility_guard",
    "voting_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "senior_judge",
          "vote_weight": {
            "FixedValue": 100
          }
        },
        {
          "guard": "junior_judge",
          "vote_weight": {
            "GuardIdentifier": 5
          }
        }
      ]
    }
  }
}
```

---

## Sub-feature 2: Create Dispute (dispute)

### Feature Description

Create a new Arb object for an order to initiate dispute arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.dispute.order` | string | Yes | Order object ID or name | |
| `data.dispute.description` | string | No | Dispute description | Max 65535 characters |
| `data.dispute.proposition` | array | Yes | List of dispute propositions | String array |
| `data.dispute.fee` | object/string | Yes | Dispute processing fee | CoinParam structure |
| `data.dispute.namedArb.name` | string | No | Name for the newly created arbitration object | Max 64 characters |

---

### Example

#### Example 2.1: Create Dispute

**Prompt**: Create a dispute for "service_arbitration" with: 1) Order "my_order", 2) Description "Product does not match description", 3) Propositions ["Full refund", "Partial refund", "No refund"], 4) Fee 1000000000 (1 WOW), 5) Name new dispute "order_123_dispute".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "dispute": {
      "order": "my_order",
      "description": "Product does not match description",
      "proposition": ["Full refund", "Partial refund", "No refund"],
      "fee": {
        "balance": 1000000000
      },
      "namedArb": {
        "name": "order_123_dispute"
      }
    }
  }
}
```

---

## Sub-feature 3: Confirm Materials (confirm)

### Feature Description

Confirm the arbitration materials submitted by the user.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.confirm.arb` | string | Yes | Arb object ID or name | |
| `data.confirm.voting_deadline` | number or null | Yes | Voting deadline (milliseconds) | No decimals or negatives, or null |

---

### Example

#### Example 3.1: Confirm Materials with Voting Deadline

**Prompt**: For "service_arbitration", confirm materials for "order_123_dispute" with voting deadline at 1738000000000.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "confirm": {
      "arb": "order_123_dispute",
      "voting_deadline": 1738000000000
    }
  }
}
```

---

## Sub-feature 4: Change Voting Deadline (voting_deadline_change)

### Feature Description

Change the voting deadline for arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.voting_deadline_change.arb` | string | Yes | Arb object ID or name | |
| `data.voting_deadline_change.voting_deadline` | number or null | Yes | New voting deadline (milliseconds) | No decimals or negatives, or null |

---

### Example

#### Example 4.1: Remove Voting Deadline

**Prompt**: For "service_arbitration", remove voting deadline for "order_123_dispute" (set to null).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "voting_deadline_change": {
      "arb": "order_123_dispute",
      "voting_deadline": null
    }
  }
}
```

---

## Sub-feature 5: Vote (vote)

### Feature Description

Vote on user propositions.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.vote.arb` | string | Yes | Arb object ID or name | |
| `data.vote.votes` | array | Yes | Vote list | Each value 0-255 |
| `data.vote.voting_guard` | string | No | Voting Guard object ID/name | |

---

### Example

#### Example 5.1: Vote on Propositions

**Prompt**: For "service_arbitration", vote on "order_123_dispute" with votes [200, 100, 50] using "senior_judge" guard.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "vote": {
      "arb": "order_123_dispute",
      "votes": [200, 100, 50],
      "voting_guard": "senior_judge"
    }
  }
}
```

---

## Sub-feature 6: Provide Feedback (feedback)

### Feature Description

Provide arbitration feedback for an Arb object.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.feedback.arb` | string | Yes | Arb object ID or name | |
| `data.feedback.feedback` | string | Yes | Arbitration feedback | Max 65535 characters |

---

### Example

#### Example 6.1: Provide Feedback

**Prompt**: For "service_arbitration", provide feedback on "order_123_dispute" that "All materials have been reviewed, ready for final decision".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "feedback": {
      "arb": "order_123_dispute",
      "feedback": "All materials have been reviewed, ready for final decision"
    }
  }
}
```

---

## Sub-feature 7: Give Arbitration Result (arbitration)

### Feature Description

Provide the final arbitration result.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.arbitration.arb` | string | Yes | Arb object ID or name | |
| `data.arbitration.feedback` | string | Yes | Arbitration feedback | Max 65535 characters |
| `data.arbitration.indemnity` | number | Yes | Compensation amount in smallest units | No decimals or negatives |

---

### Example

#### Example 7.1: Give Arbitration Result

**Prompt**: For "service_arbitration", give final result on "order_123_dispute": 1) Feedback "Based on all evidence, buyer wins the case", 2) Indemnity 5000000000 (5 WOW).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "arbitration": {
      "arb": "order_123_dispute",
      "feedback": "Based on all evidence, buyer wins the case",
      "indemnity": 5000000000
    }
  }
}
```

---

## Sub-feature 8: Reset Arbitration (reset)

### Feature Description

User applies to resubmit materials and restart arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.reset.arb` | string | Yes | Arb object ID or name | |
| `data.reset.feedback` | string | Yes | Arbitration feedback | Max 65535 characters |

---

### Example

#### Example 8.1: Reset Arbitration

**Prompt**: For "service_arbitration", apply to reset "order_123_dispute" with feedback "New evidence discovered, request to resubmit materials".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "reset": {
      "arb": "order_123_dispute",
      "feedback": "New evidence discovered, request to resubmit materials"
    }
  }
}
```

---

## Sub-feature 9: Withdraw Arbitration Fee (arb_withdraw)

### Feature Description

Withdraw arbitration fees from the Arb object.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.arb_withdraw.arb` | string | Yes | Arb object ID or name | |

---

### Example

#### Example 9.1: Withdraw Arbitration Fee

**Prompt**: For "service_arbitration", withdraw fee from "order_123_dispute".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "arb_withdraw": {
      "arb": "order_123_dispute"
    }
  }
}
```

---

## Sub-feature 10: Distribute Arbitration Fees (fees_transfer)

### Feature Description

Distribute withdrawn arbitration fees.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.fees_transfer.to` | object | Yes | Receiving object | Must have either "allocation" or "treasury" |
| `data.fees_transfer.to.allocation` | string | No | Allocation object ID/name | |
| `data.fees_transfer.to.treasury` | string | No | Treasury object ID/name | |
| `data.fees_transfer.payment_remark` | string | Yes | Payment remark | Max 64 characters |
| `data.fees_transfer.payment_index` | number | Yes | Payment index | No decimals or negatives |
| `data.fees_transfer.newPayment.name` | string | No | Name for the newly created Payment object | Max 64 characters |

---

### Examples

#### Example 10.1: Distribute to Allocation

**Prompt**: For "service_arbitration", distribute fees to "fee_allocation" with: 1) Remark "Arbitration fee distribution", 2) Index 0, 3) Name new payment "fee_payment".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
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

**Prompt**: For "service_arbitration", distribute fees to "platform_treasury" with: 1) Remark "Arbitration fees to platform", 2) Index 0.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "fees_transfer": {
      "to": {
        "treasury": "platform_treasury"
      },
      "payment_remark": "Arbitration fees to platform",
      "payment_index": 0
    }
  }
}
```

---

## Sub-feature 11: Set Usage Guard (usage_guard)

### Feature Description

Set the verification Guard for users applying for arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.usage_guard` | string or null | Yes | Guard object ID/name, or null to unbind | |

---

### Examples

#### Example 11.1: Set Usage Guard

**Prompt**: For "service_arbitration", set usage guard to "eligibility_check".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "usage_guard": "eligibility_check"
  }
}
```

#### Example 11.2: Unbind Usage Guard

**Prompt**: For "service_arbitration", unbind usage guard (set to null).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "usage_guard": null
  }
}
```

---

## Sub-feature 12: Manage Voting Guards (voting_guard)

### Feature Description

Manage the verification Guards for arbitration voting.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.voting_guard.op` | string | Yes | Operation type | "add", "set", "remove", or "clear" |
| `data.voting_guard.guards` | array | Required for add/set/remove | List of VotingGuard objects or Guard names |

### Operation Type Description

| Operation Type | Description |
|----------------|-------------|
| `add` | Add new Guard to existing list |
| `set` | Replace entire Guard list |
| `remove` | Remove specified Guard (use ID or name) |
| `clear` | Clear all Guards |

---

### Examples

#### Example 12.1: Add Voting Guard

**Prompt**: For "service_arbitration", add voting guard "expert_judge" with FixedValue 50.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "voting_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "expert_judge",
          "vote_weight": {
            "FixedValue": 50
          }
        }
      ]
    }
  }
}
```

#### Example 12.2: Set Voting Guard List

**Prompt**: For "service_arbitration", set voting guards to only "chief_judge" with GuardIdentifier 10.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "voting_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "chief_judge",
          "vote_weight": {
            "GuardIdentifier": 10
          }
        }
      ]
    }
  }
}
```

#### Example 12.3: Remove Voting Guard

**Prompt**: For "service_arbitration", remove voting guard "old_judge".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "voting_guard": {
      "op": "remove",
      "guards": ["old_judge"]
    }
  }
}
```

#### Example 12.4: Clear All Voting Guards

**Prompt**: For "service_arbitration", clear all voting guards.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "voting_guard": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 13: Pause/Resume (pause)

### Feature Description

Pause or resume arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.pause` | boolean | Yes | Whether to pause | |

---

### Examples

#### Example 13.1: Pause Arbitration

**Prompt**: For "service_arbitration", pause arbitration operations.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "pause": true
  }
}
```

#### Example 13.2: Resume Arbitration

**Prompt**: For "service_arbitration", resume arbitration operations.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "pause": false
  }
}
```

---

## Sub-feature 14: Bind Contact (um)

### Feature Description

Bind a Contact object to Arbitration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.um` | string or null | Yes | Contact object ID/name, or null to unbind | |

---

### Examples

#### Example 14.1: Bind Contact

**Prompt**: For "service_arbitration", bind contact "arb_support".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "um": "arb_support"
  }
}
```

#### Example 14.2: Unbind Contact

**Prompt**: For "service_arbitration", unbind contact (set to null).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "um": null
  }
}
```

---

## Sub-feature 15: Receive Objects (owner_receive)

### Feature Description

Receive objects sent to this Arbitration object and unpack them to send to the permission owner.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "arbitration" |
| `data.object` | string | Yes | Reference existing Arbitration | Arbitration name or ID |
| `data.owner_receive.objects` | array | No | List of object IDs to receive | |
| `data.owner_receive.recent` | boolean | No | Whether to receive recent objects | |

---

### Examples

#### Example 15.1: Receive Recent Objects

**Prompt**: For "service_arbitration", receive all recent objects.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "owner_receive": {
      "recent": true
    }
  }
}
```

#### Example 15.2: Receive Specific Objects

**Prompt**: For "service_arbitration", receive specific objects by ID.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "service_arbitration",
    "owner_receive": {
      "objects": ["0xabc123...def456", "0x123abc...456def"]
    }
  }
}
```

---

## Sub-feature 16: Combined Operations

### Feature Description

Execute multiple operations in a single call.

---

### Example

#### Example 16.1: Complete Arbitration Setup

**Prompt**: Create "complete_arbitration" with: 1) Type "Arbitration", 2) Permission "arbitration_permission", 3) Description "Full-featured arbitration", 4) Location "Online", 5) Fee 1000000000 (1 WOW), 6) Usage guard "eligibility_guard", 7) Add voting guard "head_judge" with FixedValue 100, 8) Bind contact "arb_support".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "complete_arbitration",
      "type": "Arbitration",
      "permission": "arbitration_permission",
      "type_parameter": "0x2::wow::WOW"
    },
    "description": "Full-featured arbitration",
    "location": "Online",
    "fee": 1000000000,
    "usage_guard": "eligibility_guard",
    "voting_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "head_judge",
          "vote_weight": {
            "FixedValue": 100
          }
        }
      ]
    },
    "um": "arb_support"
  }
}
```

---

## Important Notes

⚠️ **Dispute fees are required to initiate arbitration.**

⚠️ **Voting weights must be either FixedValue (0-65535) or GuardIdentifier (0-255).**

---

## Related Components

- **Service**: Service marketplace - creates orders that may need arbitration
- **Order**: Order management - subject of arbitration disputes
- **Treasury**: Fund management - can receive arbitration fees
- **Allocation**: Auto distribution - can receive arbitration fees
- **Permission**: Permission management - controls arbitration operations
- **Guard**: Validation rules - used for eligibility and voting
- **Contact**: Contact information - provides support channels

