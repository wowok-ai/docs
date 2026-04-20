
# Permission Component (🔑 Permission Management)

---

## Component Overview

The Permission component is used to manage access control permissions for WoWok objects. Through the Permission object, you can define who (entities) can perform which operations (permission indexes), making it the core of the WoWok permission system.

---

## Object Type Permission Range Overview

**Note**: Use the `wowok_buildin_info` tool to view all built-in permission numbers and their detailed descriptions.

WoWok organizes built-in permissions by object type. Each object type has a dedicated permission index range:

| Object Type | Permission Range | Description | Permission Count |
|-------------|-------------------|-------------|------------------|
| **Repository** | 100-109 | Consensus data storage repositories for storing shared state data | 6 |
| **Reward** | 150-159 | Incentive pools for distributing rewards and bonuses | 8 |
| **Machine** | 200-209 | Workflow templates defining automated service delivery processes | 9 |
| **Progress** | 220-229 | Active workflow executions (instances of Machine templates) | 6 |
| **Treasury** | 250-260 | Team funds management for holding and distributing team assets | 11 |
| **Service** | 300-320 | Service marketplace listings for offering and selling services | 21 |
| **Arbitration** | 350-368 | Dispute resolution system for resolving service conflicts | 19 |
| **Demand** | 400-408 | Service requests for seeking service providers | 9 |
| **Contact** | 450-454 | Encrypted messenger for secure communication | 5 |
| **User-defined** | 1000-65535 | Custom permissions for your specific business needs | 64536 |

### Detailed Permission Index List

All built-in permissions are listed below:

| Index | Object Type | Name | Description |
|-------|-------------|------|-------------|
| **100** | Repository | REPOSITORY_NEW | Create new Repository object |
| **101** | Repository | REPOSITORY_DESCRIPTION | Set Repository description |
| **102** | Repository | REPOSITORY_POLICY | Manage Repository policies |
| **103** | Repository | REPOSITORY_REWARD | Manage Repository rewards |
| **104** | Repository | REPOSITORY_OWNER_RECEIVE | Receive objects/payments for Repository |
| **105** | Repository | REPOSITORY_UM | Manage Repository UM (User Manager) |
| **150** | Reward | REWARD_NEW | Create new Reward object |
| **151** | Reward | REWARD_DESCRIPTION | Set Reward description |
| **152** | Reward | REWARD_GUARD | Manage Reward guards |
| **153** | Reward | REWARD_COIN_ADD | Add coin to Reward |
| **154** | Reward | REWARD_RECEIVE | Receive payment for Reward |
| **155** | Reward | REWARD_GUARD_EXPIRATION_TIME_ADD | Add guard expiration time |
| **156** | Reward | REWARD_OWNER_RECEIVE | Receive objects/payments for Reward |
| **157** | Reward | REWARD_UM | Manage Reward UM (User Manager) |
| **200** | Machine | MACHINE_NEW | Create new Machine object |
| **201** | Machine | MACHINE_DESCRIPTION | Set Machine description |
| **203** | Machine | MACHINE_CONSENSUS_REPOSITORIES | Manage Machine consensus repositories |
| **204** | Machine | MACHINE_PAUSE | Pause or resume Machine |
| **205** | Machine | MACHINE_PUBLISH | Publish Machine |
| **206** | Machine | MACHINE_NODE | Manage Machine nodes |
| **207** | Machine | MACHINE_OWNER_RECEIVE | Receive objects/payments for Machine |
| **208** | Machine | MACHINE_UM | Manage Machine UM (User Manager) |
| **220** | Progress | PROGRESS_NEW | Create new Progress object |
| **221** | Progress | PROGRESS_NAMED_OPERATOR | Manage Progress named operators |
| **222** | Progress | PROGRESS_TASK | Set Progress task |
| **223** | Progress | PROGRESS_CONTEXT_REPOSITORY | Manage Progress context repositories |
| **224** | Progress | PROGRESS_UNHOLD | Unhold Progress |
| **225** | Progress | PROGRESS_OWNER_RECEIVE | Receive objects/payments for Progress |
| **250** | Treasury | TREASURY_NEW | Create new Treasury object |
| **251** | Treasury | TREASURY_DESCRIPTION | Set Treasury description |
| **252** | Treasury | TREASURY_DEPOSIT | Deposit coins to Treasury |
| **253** | Treasury | TREASURY_RECEIVE | Receive payment for Treasury |
| **254** | Treasury | TREASURY_WITHDRAW | Withdraw coins from Treasury |
| **255** | Treasury | TREASURY_EXTERNAL_DEPOSIT | External deposit to Treasury |
| **256** | Treasury | TREASURY_EXTERNAL_WITHDRAW | External withdraw from Treasury |
| **257** | Treasury | TREASURY_EXTERNAL_DEPOSIT_GUARD | Manage external deposit guards |
| **258** | Treasury | TREASURY_EXTERNAL_WITHDRAW_GUARD | Manage external withdraw guards |
| **259** | Treasury | TREASURY_OWNER_RECEIVE | Receive objects/payments for Treasury |
| **260** | Treasury | TREASURY_UM | Manage Treasury UM (User Manager) |
| **300** | Service | SERVICE_NEW | Create new Service object |
| **301** | Service | SERVICE_DESCRIPTION | Set Service description |
| **303** | Service | SERVICE_LOCATION | Set Service location |
| **304** | Service | SERVICE_REPOSITORY | Manage Service repositories |
| **305** | Service | SERVICE_SALES | Manage Service sales |
| **306** | Service | SERVICE_MACHINE | Manage Service machines |
| **307** | Service | SERVICE_BUY_GUARD | Manage Service buy guards |
| **308** | Service | SERVICE_ARBITRATION | Manage Service arbitrations |
| **309** | Service | SERVICE_CUSTOMER_INFO_REQUIRED | Manage customer info requirements |
| **310** | Service | SERVICE_PAUSE | Pause or resume Service |
| **311** | Service | SERVICE_PUBLISH | Publish Service |
| **312** | Service | SERVICE_DISCOUNT | Manage Service discounts |
| **313** | Service | SERVICE_ORDER_ALLOCATOR | Manage Service order allocators |
| **314** | Service | SERVICE_COMPENSATION_FUND_WITHDRAW | Withdraw from compensation fund |
| **315** | Service | SERVICE_COMPENSATION_FUND_DEPOSIT | Deposit to compensation fund |
| **316** | Service | SERVICE_COMPENSATION_FUND_RECEIVE | Receive payments for compensation fund |
| **317** | Service | SERVICE_COMPENSATION_LOCKED_TIME_ADD | Add locked time to compensation |
| **318** | Service | SERVICE_REWARD | Manage Service rewards |
| **319** | Service | SERVICE_OWNER_RECEIVE | Receive objects/payments for Service |
| **320** | Service | SERVICE_UM | Manage Service UM (User Manager) |
| **350** | Arbitration | ARBITRATION_NEW | Create new Arbitration object |
| **351** | Arbitration | ARBITRATION_DESCRIPTION | Set Arbitration description |
| **353** | Arbitration | ARBITRATION_LOCATION | Set Arbitration location |
| **354** | Arbitration | ARBITRATION_VOTING_GUARD | Manage voting guards |
| **355** | Arbitration | ARBITRATION_USAGE_GUARD | Set usage guard |
| **356** | Arbitration | ARBITRATION_PAUSE | Pause or resume Arbitration |
| **357** | Arbitration | ARBITRATION_FEE | Set Arbitration fee |
| **358** | Arbitration | ARBITRATION_VOTE | Vote on Arbitration |
| **359** | Arbitration | ARBITRATION_ARBITRATION | Perform Arbitration |
| **360** | Arbitration | ARBITRATION_FEEDBACK | Provide Arbitration feedback |
| **361** | Arbitration | ARBITRATION_CONFIRM | Confirm Arbitration |
| **362** | Arbitration | ARBITRATION_VOTING_DEADLINE_CHANGE | Change voting deadline |
| **363** | Arbitration | ARBITRATION_RESET | Reset Arbitration |
| **364** | Arbitration | ARBITRATION_ARB_WITHDRAW | Withdraw Arbitration |
| **365** | Arbitration | ARBITRATION_FEES_ALLOC | Allocate Arbitration fees |
| **366** | Arbitration | ARBITRATION_FEES_TRANSFER | Transfer Arbitration fees |
| **367** | Arbitration | ARBITRATION_OWNER_RECEIVE | Receive objects/payments for Arbitration |
| **368** | Arbitration | ARBITRATION_UM | Manage Arbitration UM (User Manager) |
| **400** | Demand | DEMAND_NEW | Create new Demand object |
| **401** | Demand | DEMAND_DESCRIPTION | Set Demand description |
| **402** | Demand | DEMAND_LOCATION | Set Demand location |
| **404** | Demand | DEMAND_GUARD | Manage Demand guards |
| **405** | Demand | DEMAND_REWARD | Manage Demand rewards |
| **406** | Demand | DEMAND_FEEDBACK | Provide Demand feedback |
| **407** | Demand | DEMAND_OWNER_RECEIVE | Receive objects for Demand |
| **408** | Demand | DEMAND_UM | Manage Demand UM (User Manager) |
| **450** | Contact | MESSNGER_NEW | Create new Messenger (Contact) object |
| **451** | Contact | MESSNGER_DESCRIPTION | Set Messenger description |
| **452** | Contact | MESSNGER_LOCATION | Set Messenger location |
| **453** | Contact | MESSNGER_IM | Manage IM address |
| **454** | Contact | MESSNGER_OWNER_RECEIVE | Receive objects/payments for Messenger |
| **1000+** | User-defined | Custom | Custom business permissions defined by you |

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Permission** | Establish new permission object with access controls | Set up team access control, define role permissions | Creates secure on-chain permission system with admin management |
| **Manage Admins** | Add/remove/set permission administrators | Manage who can modify permissions, delegate authority | Controls who has full access to the permission system |
| **Manage Permissions by Index** | Grant/revoke permissions by permission ID | Give one permission to many users, revoke access | Permission-centric approach for mass permission assignment |
| **Manage Permissions by Entity** | Grant/revoke permissions by user/Guard | Give many permissions to one user, define role access | Entity-centric approach for role-based access control |
| **Manage Remarks** | Add descriptive remarks to custom permissions | Document custom permission purposes, improve clarity | Makes custom permissions easier to understand and maintain |
| **Advanced Entity Operations** | Swap/replace/copy/delete entity permissions | Transfer roles, duplicate permissions, clean up access | Streamlines complex permission management workflows |
| **Apply to Objects** | Apply permission set to other WoWok objects | Share permission scheme across multiple objects | Standardizes access control across your organization |
| **Transfer Ownership** | Change permission object owner | Hand over management, pass responsibility to new owner | Transfers full control of the permission system |
| **Owner Receive** | Unwrap and send received assets to owner | Forward received tokens, process payments | Delivers received assets to permission owner |

---

## Complete Tool Call Structure

Permission operations use the following top-level structure:

```json
{
  "operation_type": "permission",
  "data": { ... },    // Permission data definition
  "env": { ... },       // Execution environment (optional)
  "submission": { ... }  // Submission data (optional)
}
```

---

## Schema Tree

```
permission (Permission Object)
├── operation_type: "permission" (fixed value)
├── data (Permission data definition)
│   ├── object (object definition, optional)
│   │   ├── name|id (reference existing object)
│   │   └── name|tags|type_parameter|permission (create new object)
│   ├── description (description, optional)
│   ├── remark (remark operations, optional)
│   │   ├── op (operation: set|remove|clear)
│   │   ├── index (permission index)
│   │   └── remark (remark text)
│   ├── table (permission table operations, optional)
│   │   ├── op (operation: add|set|remove perm by index/entity)
│   │   ├── index (permission index or index array)
│   │   └── entity (entity or entities)
│   ├── entity (advanced entity operations, optional)
│   │   ├── op (operation: swap|replace|copy|del)
│   │   ├── entity1 (source entity)
│   │   ├── entity2 (target entity)
│   │   └── entity (entity to delete)
│   ├── admin (admin operations, optional)
│   │   ├── op (operation: add|remove|set)
│   │   └── addresses (admin addresses)
│   ├── apply (apply to objects, optional)
│   ├── builder (transfer ownership, optional)
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

## Sub-feature 1: Create Permission Object

### Feature Description

Create a new Permission object. You can set the name, description, and tags. The creator automatically becomes the owner (builder) and administrator.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | object/string | Yes | Object reference | Provide object configuration when creating a new object |
| `data.object.name` | string | No | Object name | Max 64 characters |
| `data.object.tags` | array | No | Object tags | String array for classification |
| `data.description` | string | No | Permission object description | Explain the purpose and management scope |

### Important Notes

⚠️ **Built-in permissions (0-999)**: Reserved for WoWok core system objects.

⚠️ **User-defined permissions (1000-65535)**: For your custom business needs.

---

### Examples

#### Example 1.1: Create Minimal Permission Object

**Prompt**: Create a basic Permission object named "my_permission", use default account and network, no other configuration specified.

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "my_permission"
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x414d0d...88eb0c",
  "type": "Permission",
  "version": "10316068",
  "change": "created"
}
```

---

#### Example 1.2: Create Permission with Description

**Prompt**: Create a Permission named "service_team_permission", add description "Service team permission management - responsible for service creation, sales, and customer operations".

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "service_team_permission"
    },
    "description": "Service team permission management - responsible for service creation, sales, and customer operations"
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x43f904...0df93",
  "type": "Permission",
  "version": "10316069",
  "change": "created"
}
```

---

#### Example 1.3: Create Permission with Tags

**Prompt**: Create a Permission named "design_team_permission", add tags "design", "team", "internal", "creative" for better categorization.

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "design_team_permission",
      "tags": ["design", "team", "internal", "creative"]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x0bfbcf...c8295",
  "type": "Permission",
  "version": "10316070",
  "change": "created"
}
```

---

## Sub-feature 2: Admin Management

### Feature Description

Add, remove, or set administrators for the Permission object. Only the object owner (builder) can perform this operation. Administrators can manage permissions, entities, etc.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.admin.op` | string | Yes | Operation type | "add" / "remove" / "set" |
| `data.admin.addresses` | object | Yes | Administrator addresses | ManyAccountOrMark_Address |

---

### Examples

#### Example 2.1: Add Administrators

**Prompt**: Add "product_manager" and "team_lead" as administrators to the "my_permission" Permission object.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "admin": {
      "op": "add",
      "addresses": {
        "entities": [
          { "name_or_address": "product_manager" },
          { "name_or_address": "team_lead" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x414d0d...88eb0c",
  "type": "Permission",
  "version": "10316071",
  "change": "mutated"
}
```

---

#### Example 2.2: Remove Administrator

**Prompt**: Remove "former_lead" from the administrators of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "admin": {
      "op": "remove",
      "addresses": {
        "entities": [
          { "name_or_address": "former_lead" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x414d0d...88eb0c",
  "type": "Permission",
  "version": "10316072",
  "change": "mutated"
}
```

---

#### Example 2.3: Set Complete Administrator List (Overwrite)

**Prompt**: Set the complete administrator list for "my_permission" to ["product_manager", "tech_lead"], overwriting any existing administrators.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "admin": {
      "op": "set",
      "addresses": {
        "entities": [
          { "name_or_address": "product_manager" },
          { "name_or_address": "tech_lead" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x414d0d...88eb0c",
  "type": "Permission",
  "version": "10316073",
  "change": "mutated"
}
```

---

## Sub-feature 3: Manage Permissions by Permission Index

### Feature Description

Add, set, or remove entities (accounts or Guard IDs) for a specific permission index. This is the permission-centric approach. **Requires administrator permission**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.table.op` | string | Yes | Operation type | "add perm by index" / "set perm by index" / "remove perm by index" |
| `data.table.index` | number | Yes | Permission index | Built-in index (e.g., 300) or 1000-65535 (custom) |
| `data.table.entity` | object | Yes | Entities | ManyAccountOrMark_Address |

---

### Examples

#### Example 3.1: Add Single Entity to Permission Index

**Prompt**: Add "marketing_specialist" to the service creation permission (index 300) of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "add perm by index",
      "index": 300,
      "entity": {
        "entities": [
          { "name_or_address": "marketing_specialist" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10318774",
  "change": "mutated"
}
```

---

#### Example 3.2: Add Multiple Entities to Permission Index

**Prompt**: Add "marketing_specialist_1", "marketing_specialist_2", and "marketing_specialist_3" to permission index 300 of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "add perm by index",
      "index": 300,
      "entity": {
        "entities": [
          { "name_or_address": "marketing_specialist_1" },
          { "name_or_address": "marketing_specialist_2" },
          { "name_or_address": "marketing_specialist_3" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10319086",
  "change": "mutated"
}
```

---

#### Example 3.3: Remove Entity from Permission Index

**Prompt**: Remove "former_team_member" from permission index 300 of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "remove perm by index",
      "index": 300,
      "entity": {
        "entities": [
          { "name_or_address": "former_team_member" }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10319087",
  "change": "mutated"
}
```

---

## Sub-feature 4: Manage Permissions by Entity

### Feature Description

Add, set, or remove permission indexes for a specific entity. This is the entity-centric approach. **Requires administrator permission**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.table.op` | string | Yes | Operation type | "add perm by entity" / "set perm by entity" / "remove perm by entity" |
| `data.table.entity` | object | Yes | Entity | AccountOrMark_Address |
| `data.table.index` | array | Yes | Permission index array | number[] |

---

### Examples

#### Example 4.1: Add Single Permission to Entity

**Prompt**: Add permission index 300 to the "product_manager" entity of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "add perm by entity",
      "entity": { "name_or_address": "product_manager" },
      "index": [300]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10319645",
  "change": "mutated"
}
```

---

#### Example 4.2: Add Multiple Permissions to Entity

**Prompt**: Add permission indexes 300, 301, and 305 to "marketing_manager" in "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "add perm by entity",
      "entity": { "name_or_address": "marketing_manager" },
      "index": [300, 301, 305]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10319887",
  "change": "mutated"
}
```

---

#### Example 4.3: Remove Some Permissions from Entity

**Prompt**: Remove permission index 305 from "marketing_manager" in "my_permission" while keeping other permissions.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "table": {
      "op": "remove perm by entity",
      "entity": { "name_or_address": "marketing_manager" },
      "index": [305]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10319888",
  "change": "mutated"
}
```

---

## Sub-feature 5: Permission Remark Management

### Feature Description

Set, remove, or clear remarks for permission indexes (custom permissions with index &gt;= 1000), making it easier to manage and identify permission purposes.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.remark.op` | string | Yes | Operation type | "set" / "remove" / "clear" |
| `data.remark.index` | number | Conditional | Permission index | Required when op is "set"/"remove" |
| `data.remark.remark` | string | Conditional | Remark text | Required when op is "set" |

---

### Examples

#### Example 5.1: Set Permission Remark

**Prompt**: Add a remark "Machine Node 'order confirm': confirm operation" to permission index 1001 of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "remark": {
      "op": "set",
      "index": 1001,
      "remark": "Machine Node 'order confirm': confirm operation"
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x030c79...9b5faa",
  "type": "Permission",
  "version": "10319890",
  "change": "mutated"
}
```

---

#### Example 5.2: Remove Permission Remark

**Prompt**: Remove the remark from permission index 1001 of "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "remark": {
      "op": "remove",
      "index": 1001
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x030c79...9b5faa",
  "type": "Permission",
  "version": "10319891",
  "change": "mutated"
}
```

---

#### Example 5.3: Clear All Remarks

**Prompt**: Clear all permission remarks from "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "remark": {
      "op": "clear"
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x030c79...9b5faa",
  "type": "Permission",
  "version": "10319892",
  "change": "mutated"
}
```

---

## Sub-feature 6: Advanced Entity Operations

### Feature Description

Perform advanced operations on entity permissions, including swapping permissions between two entities, replacing permissions, copying permissions, and deleting all permissions of an entity. **Requires administrator permission**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.entity.op` | string | Yes | Operation type | "swap" / "replace" / "copy" / "del" |
| `data.entity.entity1` | object | Conditional | First entity | Required for swap/replace/copy |
| `data.entity.entity2` | object | Conditional | Second entity | Required for swap/replace/copy |
| `data.entity.entity` | object | Conditional | Entity | Required for del |

---

### Examples

#### Example 6.1: Copy Entity Permissions

**Prompt**: Copy all permissions from "senior_marketer" to "junior_marketer" in "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "entity": {
      "op": "copy",
      "entity1": { "name_or_address": "senior_marketer" },
      "entity2": { "name_or_address": "junior_marketer" }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10321162",
  "change": "mutated"
}
```

---

#### Example 6.2: Swap Permissions Between Two Entities

**Prompt**: Swap all permissions between "role_a" and "role_b" in "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "entity": {
      "op": "swap",
      "entity1": { "name_or_address": "role_a" },
      "entity2": { "name_or_address": "role_b" }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10321754",
  "change": "mutated"
}
```

---

#### Example 6.3: Replace Entity Permissions

**Prompt**: Transfer all permissions from "old_manager" to "new_manager" in "my_permission" (old_manager loses permissions).

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "entity": {
      "op": "replace",
      "entity1": { "name_or_address": "old_manager" },
      "entity2": { "name_or_address": "new_manager" }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10322233",
  "change": "mutated"
}
```

---

#### Example 6.4: Delete All Permissions of an Entity

**Prompt**: Delete all permissions from "former_employee" in "my_permission".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "entity": {
      "op": "del",
      "entity": { "name_or_address": "former_employee" }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10322234",
  "change": "mutated"
}
```

---

## Sub-feature 7: Apply to Other Objects

### Feature Description

Apply the current Permission object to other WoWok objects so that these objects use this permission control. **Only the object owner (builder) can perform this operation**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.apply` | array | Yes | Object ID or name array | String array, can be Machine, Service, Repository, etc. |

---

### Examples

#### Example 7.1: Apply to Single Object

**Prompt**: Apply "marketing_team_permission" to the "service_marketing_workflow" Machine object.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "marketing_team_permission",
    "apply": ["service_marketing_workflow"]
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x40cfa6...35e653",
  "type": "Repository",
  "version": "10322920",
  "change": "mutated"
}
```

---

#### Example 7.2: Apply to Multiple Objects

**Prompt**: Apply "marketing_team_permission" to "service_marketing_workflow", "customer_service_workflow", and "campaign_management_repo".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "marketing_team_permission",
    "apply": ["service_marketing_workflow", "customer_service_workflow", "campaign_management_repo"]
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    { "object": "0x40cfa6...35e653", "type": "Repository", "change": "mutated" },
    { "object": "0xc44fbd...c2046", "type": "Repository", "change": "mutated" }
  ]
}
```

---

## Sub-feature 8: Transfer Ownership

### Feature Description

Transfer ownership of the Permission object to another user. Only the current owner can perform this operation. **After transfer, the original owner no longer has management permissions for this object, please operate with caution!**

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.builder` | object | Yes | New owner | AccountOrMark_Address |

---

### Examples

#### Example 8.1: Transfer Ownership to Specified Account

**Prompt**: Transfer ownership of "my_permission" to "new_owner" using the local mark name.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "my_permission",
    "builder": { "name_or_address": "new_owner" }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x030c79...9b5faa",
  "type": "Permission",
  "version": "10323203",
  "change": "mutated"
}
```

---

## Sub-feature 9: Set Contact Object (um)

### Feature Description

Bind a Contact object to the Permission object. The Contact object is used for instant messaging and communication. **Only the object owner (builder) can perform this operation**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.um` | string/null | Yes | Contact object name or ID | Set to `null` to unbind |

---

### Examples

#### Example 9.1: Bind Contact Object

**Prerequisites**: Before binding a Contact object, you need to create a Contact object first.

**Step 1: Create Contact Object**

See [Contact Documentation](contact.md) for more details.

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "test_contact_um"
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Step 2: Bind Contact to Permission**

**Prompt**: Bind Contact object "test_contact_um" to Permission object "test_permission_for_table".

```json
{
  "operation_type": "permission",
  "data": {
    "object": "test_permission_for_table",
    "um": "test_contact_um"
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10355080",
  "change": "mutated"
}
```

---

## Sub-feature 10: Receive Objects (owner_receive)

### Feature Description

Receive objects (such as CoinWrapper) sent to the Permission object and unwrap them to transfer to the Permission owner (builder). This is typically used to collect payments or funds sent to the Permission object. **Only the object owner (builder) can perform this operation**.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "permission" |
| `data.object` | string/object | Yes | Existing Permission object name or ID | |
| `data.owner_receive` | string/array/object | Yes | Objects to receive | `"recently"` for all recent objects, or array of specific objects |

---

### Examples

#### Example 10.1: Receive All Recent Objects

**Prerequisites**: Before using `owner_receive`, you need to create a Payment object to send funds to the Permission object.

**Step 1: Create Payment Object**

See [Payment Documentation](payment.md) for more details.

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "test_payment_for_perm"
    },
    "revenue": [
      {
        "recipient": {
          "name_or_address": "test_permission_for_table"
        },
        "amount": {
          "balance": 1000000
        }
      }
    ],
    "info": {
      "remark": "Test payment",
      "index": 1
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Step 2: Receive Objects**

**Prompt**: Receive all recently sent objects to Permission object "test_permission_for_table" and transfer them to the owner.

```json
{
  "operation_type": "permission",
  "data": {
    "object": "test_permission_for_table",
    "owner_receive": "recently"
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x9233e7...1699de",
  "type": "Permission",
  "version": "10356781",
  "change": "mutated"
}
```

---

## Sub-feature 11: Combined Operations

### Feature Description

Perform multiple operations in a single call, such as creating an object while configuring permissions, administrators, etc. This can reduce the number of transactions and improve efficiency.

---

### Example

#### Example 9.1: Create Permission and Configure Complete Permissions

**Prompt**: Create a complete marketing department permission configuration: 1) Create a Permission named "full_marketing_permission", 2) Add description and tags, 3) Add "marketing_director" as administrator, 4) Add service creation permission (300) to "marketing_specialist_1" and "marketing_specialist_2", 5) Add a remark to permission 1001: "Machine Node 'order confirm': confirm operation".

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "full_marketing_permission",
      "tags": ["marketing", "team", "complete-setup"]
    },
    "description": "Complete marketing department permission configuration - includes administrator, service creation, sales management, and other permissions",
    "admin": {
      "op": "add",
      "addresses": {
        "entities": [
          { "name_or_address": "marketing_director" }
        ]
      }
    },
    "table": {
      "op": "add perm by index",
      "index": 300,
      "entity": {
        "entities": [
          { "name_or_address": "marketing_specialist_1" },
          { "name_or_address": "marketing_specialist_2" }
        ]
      }
    },
    "remark": {
      "op": "set",
      "index": 1001,
      "remark": "Machine Node 'order confirm': confirm operation"
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x19f825...e7eb5",
  "type": "Permission",
  "version": "10323983",
  "change": "created"
}
```

---

## Important Notes

### ⚠️ Network and Account Configuration

All examples in this document use the **testnet** network and **default account** (empty string `""`). When using in production, please configure according to your actual environment:

```json
{
  "operation_type": "permission",
  "data": { ... },
  "env": {
    "account": "",              // Empty string for default account, or use account name/address
    "network": "testnet"        // Options: "testnet" | "mainnet"
  }
}
```

**Note**: If the `env` field is not specified, the operation will use the **default account** and the **last used network** for execution.
```

### ⚠️ Permission Index Ranges

- **Built-in permissions (0-999)**: Reserved for WoWok core system objects.
- **User-defined permissions (1000-65535)**: For your custom business needs.

### ⚠️ Permission Requirements

- **table and entity operations require administrator permission!**
- **Only the object owner (builder) can manage admin!**
- **After transferring ownership, the original owner no longer has permissions!**

### ⚠️ Data Format Notes

- `addresses` field must use object format: `{"entities": [{"name_or_address": "..."}]}`
- `entity`, `entity1`, `entity2`, `builder` fields must use object format: `{"name_or_address": "..."}`
- `table.op` must use full operation names: `"add perm by index"`, `"remove perm by entity"`, etc.
- `index` field in entity-centric operations must be an array: `[300, 301]`

### ⚠️ Tool Reference

- Use `wowok_buildin_info` tool to query the most up-to-date permission list and detailed descriptions.
---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Guard](guard.md)** | Trust verification engine - can be used as Permission entities for complex validation |
| **[Service](service.md)** | WYSIWYG product trading - commonly managed by Permission |
| **[Machine](machine.md)** | Workflow template - requires permission control |
| **[Repository](repository.md)** | Data ownership and usage rights - can be controlled via Permission |
| **[Treasury](treasury.md)** | Team fund management - permissions control who can deposit/withdraw |

