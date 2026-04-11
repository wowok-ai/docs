
# Repository Component (📦 Data Repository)

---

## Component Overview

Repository is WoWok's on-chain data repository component, used to store structured data. Repository can be bound to Machine, Service, and other components to provide data storage and query capabilities.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Repository** | Establish data repository with access controls | Set up service data storage, user data records | Creates secure on-chain database with permission management |
| **Manage Policies** | Define data write/read rules with Guard verification | Configure data permissions, set up access control | Defines who can write/read which data and under what conditions |
| **Add Data** | Write data items to repository | Store user records, save workflow states | Persists structured data on-chain with policy validation |
| **Remove Data** | Delete data items from repository | Clean up outdated records, remove invalid entries | Manages data lifecycle with permission checks |
| **Bind Rewards** | Link reward objects for data incentives | Encourage data contributions, reward active users | Incentivizes data quality and participation |
| **Owner Receive** | Unwrap and send received assets to owner | Forward received tokens, process payments | Delivers received assets to permission owner |

---

## Complete Tool Call Structure

Repository operations use the following top-level structure:

```json
{
  "operation_type": "repository",
  "data": { ... },    // Repository data definition
  "env": { ... },       // Execution environment (optional)
  "submission": { ... }  // Submission data (optional)
}
```

---

## Schema Tree

```
repository (Repository Object)
├── operation_type: "repository" (fixed value)
├── data (Repository data definition)
│   ├── object (object definition, required)
│   │   ├── name|id (reference existing object)
│   │   └── name|tags|type_parameter|permission (create new object)
│   ├── description (description, optional)
│   ├── policies (policy rules, optional)
│   │   ├── op (operation: add|set|remove|clear)
│   │   └── policy|policy_name (policy list or names)
│   ├── data_add (add data items, optional)
│   ├── data_remove (remove data items, optional)
│   ├── rewards (reward objects, optional)
│   ├── owner_receive (unwrap and send to owner, optional)
│   └── um (Contact object, optional)
├── env (optional, execution environment)
└── submission (optional, submission data)
```

---

## Sub-feature 1: Create New Repository

### Feature Description

Create a new Repository object for storing structured data.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "repository" |
| `data.object` | object or string | Yes | Object definition | WithPermissionObject |
| `data.description` | string | No | Repository description | Max 65535 characters |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Policy Rules**: Policies define data write/read permissions using PolicyRule objects, which include write_guard, id_from, and value_type.

---

### Examples

#### Example 1.1: Create Minimal Repository

**Prompt**: Create a Repository named "service_data", use default account and network, no other configuration specified.

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    }
  }
}
```

---

#### Example 1.2: Create Repository with Tags

**Prompt**: Create a Repository named "user_records", add tags "users", "storage", description "User data storage repository".

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "user_records",
      "tags": ["users", "storage"]
    },
    "description": "User data storage repository"
  }
}
```

---

#### Example 1.3: Create Complete Repository with Policies

**Prompt**: Create a Repository named "complete_repo": 1) Add tags "service", "database", 2) Add description "Complete repository example", 3) Add a policy named "user_notes" with write guard "user_write_guard", id from clock, value type string, 4) Bind reward object "contribution_reward".

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "complete_repo",
      "tags": ["service", "database"]
    },
    "description": "Complete repository example",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "user_notes",
          "description": "User notes storage",
          "write_guard": ["user_write_guard"],
          "id_from": "Clock",
          "value_type": "string"
        }
      ]
    },
    "rewards": ["contribution_reward"]
  }
}
```

---

## Sub-feature 2: Manage Policies

### Feature Description

Add, set, remove, or clear policy rules that define data write permissions and ID sources.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "repository" |
| `data.object` | string | Yes | Repository name or ID | |
| `data.policies` | object | Yes | Policy operations | { op: "add\|set\|remove\|clear", ... } |

### PolicyRule Structure

| Field | Type | Required | Description |
|-------|------|------|------|
| `name` | string | Yes | Policy rule name |
| `description` | string | Yes | Policy rule description |
| `write_guard` | array | Yes | Guard object list for write verification |
| `quote_guard` | string or null | No | Guard for on-chain reference verification |
| `id_from` | enum or number | Yes | ID source: can be string ("None", "Clock", "Signer", case-insensitive) or number (0=None, 1=Clock, 2=Signer) |
| `value_type` | enum | Yes | Value type: "string", "number", "boolean", etc. |

### Operation Types

- **add**: Add new policies to existing list
- **set**: Replace entire policy list
- **remove**: Remove specified policies (by name)
- **clear**: Clear all policies

---

### Examples

#### Example 2.1: Add Single Policy

**Prompt**: Add a policy to "user_records": 1) Policy name "user_profile", 2) Write guard "profile_guard", 3) ID from signer, 4) Value type object.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "user_records",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "user_profile",
          "description": "User profile data",
          "write_guard": ["profile_guard"],
          "id_from": "Signer",
          "value_type": "object"
        }
      ]
    }
  }
}
```

---

#### Example 2.2: Add Multiple Policies

**Prompt**: Add two policies to "service_data": 1) First policy "order_info" with clock ID and number type, 2) Second policy "feedback" with signer ID and string type.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "order_info",
          "description": "Order information records",
          "write_guard": ["order_guard"],
          "id_from": "Clock",
          "value_type": "number"
        },
        {
          "name": "feedback",
          "description": "User feedback records",
          "write_guard": ["feedback_guard"],
          "id_from": "Signer",
          "value_type": "string"
        }
      ]
    }
  }
}
```

---

#### Example 2.3: Remove Policies

**Prompt**: Remove policies "old_policy_1" and "old_policy_2" from "service_data".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "policies": {
      "op": "remove",
      "policy": ["old_policy_1", "old_policy_2"]
    }
  }
}
```

---

#### Example 2.4: Clear All Policies

**Prompt**: Clear all policies from "service_data".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "policies": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 3: Add Data

### Feature Description

Add data items to the repository, following policy rules for ID source and value type.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "repository" |
| `data.object` | string | Yes | Repository name or ID | |
| `data.data_add` | object | Yes | Data to add | Must match policy name and type |

### DataAdd Types

1. **SignerOrClock**: `{ name: "...", write_guard: "...", data: value }`
2. **DataAddWithItems**: `{ name: "...", items: [{ data: [{ id, data }], write_guard: "..." }] }`

---

### Examples

#### Example 3.1: Add Data with Signer/Clock ID

**Prompt**: Add data to "user_records": 1) Policy name "user_profile", 2) Write guard "profile_guard", 3) Data value { name: "alice", email: "alice@example.com" }.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "user_records",
    "data_add": {
      "name": "user_profile",
      "write_guard": "profile_guard",
      "data": {
        "name": "alice",
        "email": "alice@example.com"
      }
    }
  }
}
```

---

#### Example 3.2: Add Multiple Data Items

**Prompt**: Add multiple data items to "service_data" for policy "feedback": 1) First item with id 1 and value "Great service!", 2) Second item with id 2 and value "Very helpful".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "data_add": {
      "name": "feedback",
      "items": [
        {
          "data": [
            {
              "id": 1,
              "data": "Great service!"
            },
            {
              "id": 2,
              "data": "Very helpful"
            }
          ],
          "write_guard": "feedback_guard"
        }
      ]
    }
  }
}
```

---

## Sub-feature 4: Remove Data

### Feature Description

Remove data items from the repository.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "repository" |
| `data.object` | string | Yes | Repository name or ID | |
| `data.data_remove` | object | Yes | Data to remove | Must match policy name |

### DataRemove Types

1. **SignerOrClockBase**: `{ name: "...", write_guard: "..." }`
2. **By IDs**: `{ name: "...", items: [{ id: [...], write_guard: "..." }] }`

---

### Examples

#### Example 4.1: Remove Data by Signer/Clock

**Prompt**: Remove data from "user_records" for policy "user_profile", using write guard "profile_guard".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "user_records",
    "data_remove": {
      "name": "user_profile",
      "write_guard": "profile_guard"
    }
  }
}
```

---

#### Example 4.2: Remove Data by Specific IDs

**Prompt**: Remove data items with ids 1 and 3 from "service_data" for policy "feedback", using write guard "feedback_guard".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "data_remove": {
      "name": "feedback",
      "items": [
        {
          "id": [1, 3],
          "write_guard": "feedback_guard"
        }
      ]
    }
  }
}
```

---

## Sub-feature 5: Bind Rewards and Receive Assets

### Feature Description

Bind reward objects for data contribution incentives, and process received assets.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "repository" |
| `data.object` | string | Yes | Repository name or ID | |
| `data.rewards` | array | No | Reward object names/IDs to bind | |
| `data.owner_receive` | string or object | No | Unwrap and send to owner | "recently" or ReceivedObjects |

---

### Examples

#### Example 5.1: Bind Reward Objects

**Prompt**: Bind reward objects "contribution_reward" and "quality_reward" to "service_data".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "rewards": ["contribution_reward", "quality_reward"]
  }
}
```

---

#### Example 5.2: Unwrap and Send to Owner

**Prompt**: Unwrap recently received CoinWrapper and other objects of "service_data", send to permission owner.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "service_data",
    "owner_receive": "recently"
  }
}
```

---

## Sub-feature 6: Combined Operations

### Feature Description

Perform multiple operations on existing Repository in a single transaction.

---

### Example

#### Example 6.1: Complete Repository Setup

**Prompt**: For "complete_repo": 1) Set description "Updated repository description", 2) Add two policies, 3) Add data, 4) Bind a reward, 5) Process received assets.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "complete_repo",
    "description": "Updated repository description",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "activity_log",
          "description": "User activity records",
          "write_guard": ["activity_guard"],
          "id_from": "Clock",
          "value_type": "string"
        },
        {
          "name": "settings",
          "description": "User preferences",
          "write_guard": ["settings_guard"],
          "id_from": "Signer",
          "value_type": "object"
        }
      ]
    },
    "data_add": {
      "name": "activity_log",
      "write_guard": "activity_guard",
      "data": "user_login_event"
    },
    "rewards": ["participation_reward"],
    "owner_receive": "recently"
  }
}
```

---

## Important Notes

⚠️ **Policies define data structure and permissions**, always define policies before adding data.

⚠️ **All data must conform to policy-defined value types and ID sources.**

⚠️ **Use names instead of addresses in prompts for better readability.**

⚠️ **Write guards must verify successfully before data can be written.**

⚠️ **Repository can bind multiple Reward objects for data contribution incentives.**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading - can bind Repository to Service |
| **[Machine](machine.md)** | Workflow template - can bind Repository to Machine |
| **[Guard](guard.md)** | Trust verification engine - required for data write permissions |
| **[Permission](permission.md)** | Permission management |
| **[Reward](reward.md)** | Marketing incentives - can bind for data incentives |

