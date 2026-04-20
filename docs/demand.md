# Demand Component (🎯 Service Requests)

---

## Component Overview

The Demand component is used to post service requests with reward pools on-chain.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Demand** | Post service requests | Request specific services with requirements | Initiates service discovery process |
| **Recommend Service** | Suggest services to fulfill demand | Match demand with suitable providers | Facilitates service-provider matching |
| **Manage Guards** | Configure validation rules | Ensure recommended services meet criteria | Quality control for service recommendations |
| **Bind Components** | Attach rewards, contacts, etc. | Set up incentive pools and communication | Enhances demand with additional features |
| **Provide Feedback** | Give feedback on recommendations | Rate and comment on suggested services | Improves matching quality over time |
| **Owner Receive** | Unwrap and receive objects | Collect rewards, payments for fulfilled demands | Enables value transfer to demand owners |

---

## Schema Tree (4-Level Structure)

```
Demand Component
├── operation_type: "demand"
├── data
│   ├── object
│   │   ├── Option 1: Name or Address (string)
│   │   │   └── [demand_name or demand_id]
│   │   └── Option 2: Named Object with Permission
│   │       ├── name (string, optional)
│   │       ├── tags (array of strings, optional)
│   │       ├── onChain (boolean, optional)
│   │       ├── replaceExistName (boolean, optional)
│   │       └── permission
│   │           ├── Option 1: Name or Address (string)
│   │           │   └── [permission_name or permission_id]
│   │           └── Option 2: Named Object with Description
│   │               ├── name (string, optional)
│   │               ├── tags (array of strings, optional)
│   │               ├── onChain (boolean, optional)
│   │               ├── replaceExistName (boolean, optional)
│   │               └── description (string, optional)
│   ├── present (optional)
│   │   ├── recommend (string)
│   │   ├── by_guard (string, optional)
│   │   └── service (string, optional)
│   ├── description (string, optional)
│   ├── location (string, optional)
│   ├── rewards (optional)
│   │   ├── op: "add"
│   │   │   └── objects (array of strings)
│   │   ├── op: "set"
│   │   │   └── objects (array of strings)
│   │   ├── op: "remove"
│   │   │   └── objects (array of strings)
│   │   └── op: "clear"
│   ├── feedback (optional, array)
│   │   └── [feedback_item]
│   │       ├── who (object)
│   │       │   ├── name_or_address (string, optional)
│   │       │   └── local_mark_first (boolean, optional)
│   │       ├── acceptance_score (number, optional, 0-255)
│   │       └── feedback (string, optional)
│   ├── guards (optional)
│   │   ├── op: "add"
│   │   │   └── guard (array)
│   │   │       └── [service_guard]
│   │   │           ├── guard (string)
│   │   │           └── service_identifier (number or null, optional, 0-255)
│   │   ├── op: "set"
│   │   │   └── guard (array)
│   │   │       └── [service_guard]
│   │   │           ├── guard (string)
│   │   │           └── service_identifier (number or null, optional, 0-255)
│   │   ├── op: "remove"
│   │   │   └── guard (array of strings)
│   │   └── op: "clear"
│   ├── owner_receive (transfer received coins or NFT objects to owner, optional)
│   │   ├── Option 1: "recently" (string) - receive all recent objects
│   │   ├── Option 2: Array of received objects
│   │   │   └── [{ id: "object_id", type: "object_type" }]
│   │   └── Option 3: Received balance object
│   │       ├── balance (number or string)
│   │       ├── token_type (string)
│   │       └── received (array of received items)
│   └── um (Contact object, optional)
│       ├── Option 1: Contact object name or ID (string)
│       └── Option 2: null (to unbind contact)
├── env (optional, execution environment)
│   ├── account (string, optional) - account name or address, empty string for default
│   ├── network (string, optional) - "testnet" or "mainnet"
│   ├── permission_guard (array, optional) - list of permission guard IDs
│   ├── no_cache (boolean, optional) - disable caching
│   └── referrer (string, optional) - referrer ID
└── submission (optional, submission data)
    ├── type (string) - fixed value "submission"
    ├── guard (array) - list of guards to verify
    │   └── [{ object: "guard_id", impack: boolean }]
    └── submission (array) - submission data for guards
        └── [{ guard: "guard_id", submission: [guard_submission_items] }]
            └── guard_submission_items
                ├── identifier (number, 0-255) - Guard table item identifier
                ├── b_submission (boolean) - whether this item requires submission
                ├── value_type (number | string) - value type (e.g., 6 or "U64" for U64 type)
                ├── **value (any) - submitted value**
                └── name (string, optional) - item name
```

---

### ⚠️ Important Note About Submission

If the execution returns a `submission` field in the response, it indicates that additional Guard verification data is required. You must:

1. Complete all required submission data within the `submission` structure
2. Resubmit the operation with the completed submission data
3. **Do not modify any other parts of the structure** - only fill in the required submission values

The submission structure will specify which Guard objects need verification and what data needs to be provided for each Guard table item.

**Query Value Types**: Use the `wowok_buildin_info` tool with `{ "info": "value types" }` to query all supported value types with their numeric and string representations. This helps you understand what `value_type` values are valid for submission data.

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

**Prompt:** Create a new demand object named "logo_design_demand" with description "Need a professional corporate LOGO design" and location "Online service".

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

**Prompt:** Create a new demand named "website_design_demand", bind to existing permission "existing_permission", set description to "Need a modern corporate website design", and location to "Online service".

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

**Prompt:** Create a new demand named "app_development_demand", create a new permission object named "demand_permission", set description to "Need a mobile app development service", and location to "Online service".

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

**Prompt:** Use the existing demand "logo_design_demand" and update its description to "Updated description for the demand".

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

**Prompt:** Use the existing demand "logo_design_demand" and present the service "design_service" with recommendation "This design service is very suitable for your needs".

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

**Prompt:** Use the existing demand "logo_design_demand" and add two guards: "service_qualification_check" and "price_check".

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "add",
      "guard": [
        {
          "guard": "service_qualification_check"
        },
        {
          "guard": "price_check"
        }
      ]
    }
  }
}
```

#### Example 3.2: Set Guard List (Replace)

**Prompt:** Use the existing demand "logo_design_demand" and replace the entire guard list with "service_qualification_check".

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "guards": {
      "op": "set",
      "guard": [
        {
          "guard": "service_qualification_check"
        }
      ]
    }
  }
}
```

#### Example 3.3: Remove Guard

**Prompt:** Use the existing demand "logo_design_demand" and remove the guard "old_guard".

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

**Prompt:** Use the existing demand "logo_design_demand" and clear all guards.

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

**Prompt:** Use the existing demand "logo_design_demand", add reward "demand_reward", and bind contact "demand_contact".

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

**Prompt:** Use the existing demand "logo_design_demand" and replace the entire reward list with "reward_1" and "reward_2".

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

**Prompt:** Use the existing demand "logo_design_demand" and remove reward "old_reward".

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

**Prompt:** Use the existing demand "logo_design_demand" and clear all rewards.

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

**Prompt:** Use the existing demand "logo_design_demand" and bind contact "demand_contact".

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

**Prompt:** Use the existing demand "logo_design_demand" and unbind the contact.

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
| `feedback[].who` | object | Yes | Account address or mark name, used to identify providing feedback to this user |
| `feedback[].who.name_or_address` | string | No | Account or object name or address |
| `feedback[].who.local_mark_first` | boolean | No | Whether to prioritize local marks |
| `feedback[].acceptance_score` | number | No | Acceptance score (0-255), used to evaluate the reception level of the service recommended by the user |
| `feedback[].feedback` | string | No | Feedback content for the user |

### Example

**Prompt:** Use the existing demand "logo_design_demand" and provide feedback to "service_provider" with acceptance score 200 and feedback "The recommended service meets the requirements very well".

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "feedback": [
      {
        "who": {
          "name_or_address": "service_provider"
        },
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

**Prompt:** Use the existing demand "logo_design_demand" and receive all recently sent objects.

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

**Prompt:** Use the existing demand "logo_design_demand" and receive specific objects.

```json
{
  "operation_type": "demand",
  "data": {
    "object": "logo_design_demand",
    "owner_receive": [
      {
        "id": "0xabc123...def456",
        "type": "0x2::object::Object"
      },
      {
        "id": "0x5678...9abc",
        "type": "0x2::object::Object"
      }
    ]
  }
}
```

#### Example 6.3: Receive Balance

**Prompt:** Use the existing demand "logo_design_demand" and receive balance.

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
          "id": "0xabc123...def456",
          "balance": "1000000000",
          "payment": "0xabcd...efgh"
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

**Prompt:** Create a new demand named "complete_demand" with existing permission "demand_permission", set description to "Complete demand example", set location to "Online service", add reward "demand_reward", add guard "service_check", and bind contact "demand_contact".

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
      "guard": [
        {
          "guard": "service_check"
        }
      ]
    },
    "um": "demand_contact"
  }
}
```

#### Example 7.2: Full Combined Operation

**Prompt:** Use the existing demand "logo_design_demand", update description to "Updated demand description", present service "premium_design_service" with recommendation "Highly recommended design service", provide feedback to "designer_1" with acceptance score 220 and feedback "Excellent service quality", and receive recent objects.

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
        "who": {
          "name_or_address": "designer_1"
        },
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

⚠️ **`owner_receive` can be:**
- `"recently"` - receive all recent objects
- Array of received normal objects
- Received balance object

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading |
| **[Reward](reward.md)** | Marketing incentives |
| **[Arbitration](arbitration.md)** | Dispute resolution |
| **[Payment](payment.md)** | Direct coin transfers |
| **[Guard](guard.md)** | Trust verification engine |
| **[Contact](contact.md)** | Public contact information |
