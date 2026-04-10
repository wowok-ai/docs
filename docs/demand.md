# Demand Component (🎯 Service Requests)

---

## Component Overview

The Demand component is used to post service requests with reward pools on-chain.

---

## Function Tree

```
Demand Component
├── Create New Demand
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   ├── Set Description (description)
│   └── Set Location (location)
├── Recommend Service (present)
│   ├── Recommendation (present.recommend)
│   ├── Guard Selection (present.by_guard)
│   └── Target Service (present.service)
├── Manage Validation Guard List (guards)
│   ├── Add Guard (guards.op = "add")
│   ├── Set Guard List (guards.op = "set")
│   ├── Remove Guard (guards.op = "remove")
│   └── Clear Guards (guards.op = "clear")
├── Bind Components
│   ├── Bind Reward (rewards)
│   └── Bind Contact (um)
├── Provide User Feedback (feedback)
│   ├── Target User (feedback[].who)
│   ├── Acceptance Score (feedback[].acceptance_score)
│   └── Feedback Content (feedback[].feedback)
└── Receive Objects (owner_receive)
    ├── Specify Objects (object array)
    └── Recent Objects ("recently")
```

---

## Sub-function 1: Create New Demand

### Function Description

Create a new Demand object for posting service requests.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `object` | string/object | Yes | Object name/ID or object definition | Required in all cases |
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Demand description | Max 4000 characters |
| `location` | string | No | Service location | Max 256 characters |


### Examples

#### Example 1.1: Create Simple Demand

```json
{
  "operation_type": "demand",
  "data": {
    "object": {
      "name": "logo_design_demand"
    },
    "description": "Need a professional corporate LOGO design",
    "location": "Online service"
  }
}
```

#### Example 1.2: Create Demand with Existing Permission

```json
{
  "operation_type": "demand",
  "data": {
    "object": {
      "name": "website_design_demand",
      "permission": "existing_permission"
    },
    "description": "Need a modern corporate website design",
    "location": "Online service"
  }
}
```

#### Example 1.3: Create Demand with New Permission

```json
{
  "operation_type": "demand",
  "data": {
    "object": {
      "name": "app_development_demand",
      "permission": {
        "name": "demand_permission"
      }
    },
    "description": "Need a mobile app development service",
    "location": "Online service"
  }
}
```

#### Example 1.4: Operate Existing Demand

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "description": "Updated description for the demand"
  }
}
```

---

## Sub-function 2: Recommend Service (present)

### Function Description

Recommend a Service to the Demand object.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `present.recommend` | string | Yes | Recommendation description |
| `present.by_guard` | string | No | Guard ID or name, used to select which Guard's verification to pass through |
| `present.service` | string | No | Service ID or name to present |

### Example

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "present": {
      "recommend": "This design service is very suitable for your needs",
      "service": "design_service"
    }
  }
}
```

---

## Sub-function 3: Manage Validation Guard List (guards)

### Function Description

Manage the Demand object's validation Guard list, used to verify whether the service recommended by the user meets the requirements.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guards.op` | string | Yes | Operation type: add/set/remove/clear |
| `guards.guard` | array | Required for add/set | List of Guard object IDs/names |

### Operation Type Description

| Operation Type | Description |
|----------------|-------------|
| `add` | Add new Guards to existing list |
| `set` | Replace entire Guard list |
| `remove` | Remove specified Guards (use ID or name) |
| `clear` | Clear all Guards |

### Examples

#### Example 3.1: Add Guard

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "add",
      "guard": ["service_qualification_check", "price_check"]
    }
  }
}
```

#### Example 3.2: Set Guard List (Replace)

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "set",
      "guard": ["service_qualification_check"]
    }
  }
}
```

#### Example 3.3: Remove Guard

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "remove",
      "guard": ["old_guard"]
    }
  }
}
```

#### Example 3.4: Clear Guards

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "clear"
    }
  }
}
```

---

## Sub-function 4: Bind Components

### Function Description

Bind Reward, Contact and other components to Demand.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rewards` | object | No | Reward object list operation |
| `rewards.op` | string | Yes | Operation: add/set/remove/clear |
| `rewards.objects` | array | Required for add/set/remove | List of Reward object IDs/names |
| `um` | string/null | No | Contact object ID/name, or null to unbind |

### Examples

#### Example 4.1: Add Rewards

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "rewards": {
      "op": "add",
      "objects": ["demand_reward"]
    },
    "um": "demand_contact"
  }
}
```

#### Example 4.2: Set Rewards (Replace)

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "rewards": {
      "op": "set",
      "objects": ["reward_1", "reward_2"]
    }
  }
}
```

#### Example 4.3: Remove Rewards

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "rewards": {
      "op": "remove",
      "objects": ["old_reward"]
    }
  }
}
```

#### Example 4.4: Clear Rewards

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "rewards": {
      "op": "clear"
    }
  }
}
```

#### Example 4.5: Bind Contact

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "um": "demand_contact"
  }
}
```

#### Example 4.6: Unbind Contact

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "um": null
  }
}
```

---

## Sub-function 5: Provide User Feedback (feedback)

### Function Description

Provide user feedback information for the Demand object.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `feedback` | array | Yes | Feedback information list |
| `feedback[].who` | string | Yes | Account address or mark name, used to identify providing feedback to this user |
| `feedback[].acceptance_score` | number | No | Acceptance score (0-255), used to evaluate the reception level of the service recommended by the user |
| `feedback[].feedback` | string | No | Feedback content for the user |

### Example

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "feedback": [
      {
        "who": "service_provider",
        "acceptance_score": 200,
        "feedback": "The recommended service meets the requirements very well"
      }
    ]
  }
}
```

---

## Sub-function 6: Receive Objects (owner_receive)

### Function Description

Receive objects sent to this Demand object and unwrap them to send to the owner of its Permission object.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner_receive` | array/object/string | No | Received objects configuration |
| `owner_receive` (array) | array | No | List of received object records |
| `owner_receive` (object) | object | No | Received balance information |
| `owner_receive` (string) | string | No | Use "recently" to receive all recent objects |

### Received Object Record Structure

When `owner_receive` is an array of received normal objects:
```json
[
  {
    "id": "object_id",
    "type": "object_type"
  }
]
```

When `owner_receive` is a balance object:
```json
{
  "balance": "1000000000",
  "token_type": "0x2::wow::WOW",
  "received": [
    {
      "id": "coin_object_id",
      "balance": "1000000000",
      "payment": "payment_object_id"
    }
  ]
}
```

### Examples

#### Example 6.1: Receive Recent Objects

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "owner_receive": "recently"
  }
}
```

#### Example 6.2: Receive Specific Objects

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "owner_receive": [
      {
        "id": "0x1234...",
        "type": "0x2::object::Object"
      },
      {
        "id": "0x5678...",
        "type": "0x2::object::Object"
      }
    ]
  }
}
```

#### Example 6.3: Receive Balance

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "owner_receive": {
      "balance": "1000000000",
      "token_type": "0x2::wow::WOW",
      "received": [
        {
          "id": "0x1234...",
          "balance": "1000000000",
          "payment": "0xabcd..."
        }
      ]
    }
  }
}
```

---

## Sub-function 7: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

#### Example 7.1: Create Demand and Configure Guards

```json
{
  "operation_type": "demand",
  "data": {
    "object": {
      "name": "complete_demand",
      "permission": "demand_permission"
    },
    "description": "Complete demand example",
    "location": "Online service",
    "rewards": {
      "op": "add",
      "objects": ["demand_reward"]
    },
    "guards": {
      "op": "add",
      "guard": ["service_check"]
    },
    "um": "demand_contact"
  }
}
```

#### Example 7.2: Full Combined Operation

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "description": "Updated demand description",
    "present": {
      "recommend": "Highly recommended design service",
      "service": "premium_design_service"
    },
    "feedback": [
      {
        "who": "designer_1",
        "acceptance_score": 220,
        "feedback": "Excellent service quality"
      }
    ],
    "owner_receive": "recently"
  }
}
```

---

## Important Notes

⚠️ **Guards are used to verify whether the service recommended by the user meets the requirements.**

⚠️ **`rewards` uses the `ObjectsSchema` structure with `op` and `objects` fields.**

⚠️ **`owner_receive` can be:**
- `"recently"` - receive all recent objects
- Array of received normal objects
- Received balance object

---

## Related Components

- **Service**: Service marketplace
- **Reward**: Reward pools
- **Arbitration**: Dispute resolution
- **Payment**: Direct transfers
- **Guard**: Validation rules
- **Contact**: Contact information
