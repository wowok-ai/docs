# WoWok Build-in Information Component (ℹ️ WoWok Build-in Information)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "wowok_buildin_info", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The WoWok Build-in Information component is used to query WoWok protocol information, including constants, built-in permissions, guard instructions, current network, value types, and mainnet bridge tokens.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Query Constants** | Get protocol constant values | Reference system limits and defaults | Understand protocol configuration |
| **Query Built-in Permissions** | Get built-in permission definitions | Set up permission objects | Know available permission options |
| **Query Guard Instructions** | Get Guard instruction reference | Build Guard logic | Access all available operations |
| **Query Current Network** | Get current network entrypoint | Check which network is active | Verify environment configuration |
| **Query Value Types** | Get supported value type mappings | Work with on-chain data types | Understand type system |
| **Query Mainnet Bridge Tokens** | Get mainnet bridge token list | Use bridged tokens (USDT/USDC/ETH/WBTC/WETH) as payment types | Extend official payment beyond WOW token |

---

## Complete Tool Call Structure

Build-in info query uses the following top-level structure:

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "info_type"
    // optional filter fields
  }
}
```

---

## Schema Tree

```
wowok_buildin_info (Build-in Information Operations)
├── info (discriminator, required)
│   ├── "constants"
│   ├── "built-in permissions"
│   │   └── filter (optional, PermissionFilter)
│   │       ├── objectType (optional, ObjectType)
│   │       ├── name (optional, string)
│   │       ├── index (optional, PermissionIndexType - builtin permission index or 1000-65535)
│   │       └── description (optional, string)
│   ├── "guard instructions"
│   │   └── filter (optional, GuardInstructFilter)
│   │       ├── name (optional, string)
│   │       ├── id (optional, number[])
│   │       ├── returnType (optional, ValueType)
│   │       ├── paramCount (optional, number)
│   │       ├── scope (optional, "instruct"/"object query"/"all")
│   │       └── objectType (optional, ObjectType, only for "object query" scope)
│   ├── "current network"
│   ├── "value types"
│   └── "mainnet bridge tokens"
└── (no other top-level fields)
```

---

## Example 1: Query Constants

### Feature Description

Get protocol constant values, including system limits, default values, and configuration parameters.

### Examples

#### Example 1.1: Get All Constants

**Prompt**: Query all protocol constants to understand system configuration.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "constants"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "Protocol Package ID", "value": "0x2", "description": "Protocol package ID"},
        {"name": "Gas Token Type", "value": "0x2::wow::WOW", "description": "Gas token type"},
        {"name": "Gas Coin Type", "value": "0x2::coin::Coin<0x2::wow::WOW>", "description": "Gas coin type"},
        {"name": "Entity Linker ID", "value": "0xaaa", "description": "Entity Linker ID"},
        {"name": "Entity Registrar ID", "value": "0xaab", "description": "Entity registrar ID"}
      ]
    }
  },
  "schema": null
}
```

---

## Example 2: Query Built-in Permissions

### Feature Description

Get definitions of built-in permissions, including their indexes, names, descriptions, and applicable object types.

### Examples

#### Example 2.1: Get All Built-in Permissions

**Prompt**: Query all built-in permissions to see available options.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "built-in permissions"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"index": 100, "name": "repository.new", "description": "Create new repository", "object_type": "Repository"},
        {"index": 101, "name": "repository.description", "description": "Set repository description", "object_type": "Repository"},
        {"index": 102, "name": "repository.policy", "description": "Manage repository policies", "object_type": "Repository"},
        {"index": 103, "name": "repository.reward", "description": "Manage repository rewards", "object_type": "Repository"},
        {"index": 104, "name": "repository.owner_receive", "description": "Receive objects or payments for repository", "object_type": "Repository"},
        {"index": 105, "name": "repository.um", "description": "Manage repository UM (User Manager)", "object_type": "Repository"},
        {"index": 150, "name": "reward.new", "description": "Create new reward", "object_type": "Reward"},
        {"index": 151, "name": "reward.description", "description": "Set reward description", "object_type": "Reward"},
        {"index": 152, "name": "reward.guard", "description": "Manage reward guards", "object_type": "Reward"},
        {"index": 153, "name": "reward.coin_add", "description": "Add coin to reward", "object_type": "Reward"},
        {"index": 154, "name": "reward.receive", "description": "Receive payment for reward", "object_type": "Reward"},
        {"index": 155, "name": "reward.guard_expiration_time_add", "description": "Add guard expiration time", "object_type": "Reward"},
        {"index": 156, "name": "reward.owner_receive", "description": "Receive objects or payments for reward", "object_type": "Reward"},
        {"index": 157, "name": "reward.um", "description": "Manage reward UM (User Manager)", "object_type": "Reward"},
        {"index": 200, "name": "machine.new", "description": "Create new machine", "object_type": "Machine"},
        {"index": 201, "name": "machine.description", "description": "Set machine description", "object_type": "Machine"},
        {"index": 203, "name": "machine.consensus_repositories", "description": "Manage machine consensus repositories", "object_type": "Machine"},
        {"index": 204, "name": "machine.pause", "description": "Pause or resume machine", "object_type": "Machine"},
        {"index": 205, "name": "machine.publish", "description": "Publish machine", "object_type": "Machine"},
        {"index": 206, "name": "machine.node", "description": "Manage machine nodes", "object_type": "Machine"},
        {"index": 207, "name": "machine.owner_receive", "description": "Receive objects or payments for machine", "object_type": "Machine"},
        {"index": 208, "name": "machine.um", "description": "Manage machine UM (User Manager)", "object_type": "Machine"},
        {"index": 220, "name": "progress.new", "description": "Create new progress", "object_type": "Progress"},
        {"index": 221, "name": "progress.namedOperator", "description": "Manage progress named operators (add, remove, set)", "object_type": "Progress"},
        {"index": 222, "name": "progress.task", "description": "Set progress task", "object_type": "Progress"},
        {"index": 223, "name": "progress.context_repository", "description": "Manage progress context repositories (add, remove, clear)", "object_type": "Progress"},
        {"index": 224, "name": "progress.unhold", "description": "Unhold progress", "object_type": "Progress"},
        {"index": 225, "name": "progress.owner_receive", "description": "Receive objects or payments for progress", "object_type": "Progress"},
        {"index": 250, "name": "treasury.new", "description": "Create new treasury", "object_type": "Treasury"},
        {"index": 251, "name": "treasury.description", "description": "Set treasury description", "object_type": "Treasury"},
        {"index": 252, "name": "treasury.deposit", "description": "Deposit coins to treasury", "object_type": "Treasury"},
        {"index": 253, "name": "treasury.receive", "description": "Receive payment for treasury", "object_type": "Treasury"},
        {"index": 254, "name": "treasury.withdraw", "description": "Withdraw coins from treasury", "object_type": "Treasury"},
        {"index": 255, "name": "treasury.external_deposit", "description": "External deposit to treasury", "object_type": "Treasury"},
        {"index": 256, "name": "treasury.external_withdraw", "description": "External withdraw from treasury", "object_type": "Treasury"},
        {"index": 257, "name": "treasury.external_deposit_guard", "description": "Manage treasury external deposit guards", "object_type": "Treasury"},
        {"index": 258, "name": "treasury.external_withdraw_guard", "description": "Manage treasury external withdraw guards", "object_type": "Treasury"},
        {"index": 259, "name": "treasury.owner_receive", "description": "Receive objects or payments for treasury", "object_type": "Treasury"},
        {"index": 260, "name": "treasury.um", "description": "Manage treasury UM (User Manager)", "object_type": "Treasury"},
        {"index": 300, "name": "service.new", "description": "Create new service", "object_type": "Service"},
        {"index": 301, "name": "service.description", "description": "Set service description", "object_type": "Service"},
        {"index": 303, "name": "service.location", "description": "Set service location", "object_type": "Service"},
        {"index": 304, "name": "service.repository", "description": "Manage service repositories", "object_type": "Service"},
        {"index": 305, "name": "service.sales", "description": "Manage service sales", "object_type": "Service"},
        {"index": 306, "name": "service.machine", "description": "Manage service machines", "object_type": "Service"},
        {"index": 307, "name": "service.buy_guard", "description": "Manage service buy guards", "object_type": "Service"},
        {"index": 308, "name": "service.arbitration", "description": "Manage service arbitrations", "object_type": "Service"},
        {"index": 309, "name": "service.customer_info_required", "description": "Manage service customer info requirements", "object_type": "Service"},
        {"index": 310, "name": "service.pause", "description": "Pause or resume service", "object_type": "Service"},
        {"index": 311, "name": "service.publish", "description": "Publish service", "object_type": "Service"},
        {"index": 312, "name": "service.discount", "description": "Manage service discounts", "object_type": "Service"},
        {"index": 313, "name": "service.order_allocator", "description": "Manage service order allocators", "object_type": "Service"},
        {"index": 314, "name": "service.compensation_fund_withdraw", "description": "Withdraw from service compensation fund", "object_type": "Service"},
        {"index": 315, "name": "service.compensation_fund_deposit", "description": "Deposit to service compensation fund", "object_type": "Service"},
        {"index": 316, "name": "service.compensation_fund_receive", "description": "Receive payments for service compensation fund", "object_type": "Service"},
        {"index": 317, "name": "service.setting_locked_time_add", "description": "Add locked time to service compensation", "object_type": "Service"},
        {"index": 318, "name": "service.reward", "description": "Manage service rewards", "object_type": "Service"},
        {"index": 319, "name": "service.owner_receive", "description": "Receive objects or payments for service", "object_type": "Service"},
        {"index": 320, "name": "service.um", "description": "Manage service UM (User Manager)", "object_type": "Service"},
        {"index": 350, "name": "arbitration.new", "description": "Create new arbitration", "object_type": "Arbitration"},
        {"index": 351, "name": "arbitration.description", "description": "Set arbitration description", "object_type": "Arbitration"},
        {"index": 353, "name": "arbitration.location", "description": "Set arbitration location", "object_type": "Arbitration"},
        {"index": 354, "name": "arbitration.voting_guard", "description": "Manage arbitration voting guards", "object_type": "Arbitration"},
        {"index": 355, "name": "arbitration.usage_guard", "description": "Set arbitration usage guard", "object_type": "Arbitration"},
        {"index": 356, "name": "arbitration.pause", "description": "Pause or resume arbitration", "object_type": "Arbitration"},
        {"index": 357, "name": "arbitration.fee", "description": "Set arbitration fee", "object_type": "Arbitration"},
        {"index": 358, "name": "arbitration.vote", "description": "Vote on arbitration", "object_type": "Arbitration"},
        {"index": 359, "name": "arbitration.arbitration", "description": "Perform arbitration", "object_type": "Arbitration"},
        {"index": 360, "name": "arbitration.feedback", "description": "Provide arbitration feedback", "object_type": "Arbitration"},
        {"index": 361, "name": "arbitration.confirm", "description": "Confirm arbitration", "object_type": "Arbitration"},
        {"index": 362, "name": "arbitration.voting_deadline_change", "description": "Change voting deadline", "object_type": "Arbitration"},
        {"index": 363, "name": "arbitration.reset", "description": "Reset arbitration", "object_type": "Arbitration"},
        {"index": 364, "name": "arbitration.arb_withdraw", "description": "Withdraw arbitration", "object_type": "Arbitration"},
        {"index": 365, "name": "arbitration.fees_alloc", "description": "Allocate arbitration fees", "object_type": "Arbitration"},
        {"index": 366, "name": "arbitration.fees_transfer", "description": "Transfer arbitration fees", "object_type": "Arbitration"},
        {"index": 367, "name": "arbitration.owner_receive", "description": "Receive objects or payments for arbitration", "object_type": "Arbitration"},
        {"index": 368, "name": "arbitration.um", "description": "Manage arbitration UM (User Manager)", "object_type": "Arbitration"},
        {"index": 400, "name": "demand.new", "description": "Create new demand", "object_type": "Demand"},
        {"index": 401, "name": "demand.description", "description": "Set demand description", "object_type": "Demand"},
        {"index": 402, "name": "demand.location", "description": "Set demand location", "object_type": "Demand"},
        {"index": 404, "name": "demand.guard", "description": "Manage demand guards", "object_type": "Demand"},
        {"index": 405, "name": "demand.reward", "description": "Manage demand rewards", "object_type": "Demand"},
        {"index": 406, "name": "demand.feedback", "description": "Provide demand feedback", "object_type": "Demand"},
        {"index": 407, "name": "demand.owner_receive", "description": "Receive objects for demand", "object_type": "Demand"},
        {"index": 408, "name": "demand.um", "description": "Manage demand UM (User Manager)", "object_type": "Demand"},
        {"index": 450, "name": "messenger.new", "description": "Create new messenger", "object_type": "Contact"},
        {"index": 451, "name": "messenger.description", "description": "Set messenger description", "object_type": "Contact"},
        {"index": 452, "name": "messenger.location", "description": "Set messenger location", "object_type": "Contact"},
        {"index": 453, "name": "messenger.im", "description": "Manager im address", "object_type": "Contact"},
        {"index": 454, "name": "messenger.owner_receive", "description": "Receive objects or payments for messenger", "object_type": "Contact"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: The result shows 90 built-in permissions across all object types. Indexes below 1000 are reserved for built-in permissions.

---

#### Example 2.2: Filter by Object Type

**Prompt**: Filter built-in permissions to only show those applicable to Service objects.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "built-in permissions",
    "filter": {
      "objectType": "Service"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"index": 300, "name": "service.new", "description": "Create new service", "object_type": "Service"},
        {"index": 301, "name": "service.description", "description": "Set service description", "object_type": "Service"},
        {"index": 303, "name": "service.location", "description": "Set service location", "object_type": "Service"},
        {"index": 304, "name": "service.repository", "description": "Manage service repositories", "object_type": "Service"},
        {"index": 305, "name": "service.sales", "description": "Manage service sales", "object_type": "Service"},
        {"index": 306, "name": "service.machine", "description": "Manage service machines", "object_type": "Service"},
        {"index": 307, "name": "service.buy_guard", "description": "Manage service buy guards", "object_type": "Service"},
        {"index": 308, "name": "service.arbitration", "description": "Manage service arbitrations", "object_type": "Service"},
        {"index": 309, "name": "service.customer_info_required", "description": "Manage service customer info requirements", "object_type": "Service"},
        {"index": 310, "name": "service.pause", "description": "Pause or resume service", "object_type": "Service"},
        {"index": 311, "name": "service.publish", "description": "Publish service", "object_type": "Service"},
        {"index": 312, "name": "service.discount", "description": "Manage service discounts", "object_type": "Service"},
        {"index": 313, "name": "service.order_allocator", "description": "Manage service order allocators", "object_type": "Service"},
        {"index": 314, "name": "service.compensation_fund_withdraw", "description": "Withdraw from service compensation fund", "object_type": "Service"},
        {"index": 315, "name": "service.compensation_fund_deposit", "description": "Deposit to service compensation fund", "object_type": "Service"},
        {"index": 316, "name": "service.compensation_fund_receive", "description": "Receive payments for service compensation fund", "object_type": "Service"},
        {"index": 317, "name": "service.setting_locked_time_add", "description": "Add locked time to service compensation", "object_type": "Service"},
        {"index": 318, "name": "service.reward", "description": "Manage service rewards", "object_type": "Service"},
        {"index": 319, "name": "service.owner_receive", "description": "Receive objects or payments for service", "object_type": "Service"},
        {"index": 320, "name": "service.um", "description": "Manage service UM (User Manager)", "object_type": "Service"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Filtering by "Service" returns 20 permissions specific to Service objects.

---

#### Example 2.3: Filter by Name

**Prompt**: Search for built-in permissions with "service" in their name.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "built-in permissions",
    "filter": {
      "name": "service"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"index": 300, "name": "service.new", "description": "Create new service", "object_type": "Service"},
        {"index": 301, "name": "service.description", "description": "Set service description", "object_type": "Service"},
        {"index": 303, "name": "service.location", "description": "Set service location", "object_type": "Service"},
        {"index": 304, "name": "service.repository", "description": "Manage service repositories", "object_type": "Service"},
        {"index": 305, "name": "service.sales", "description": "Manage service sales", "object_type": "Service"},
        {"index": 306, "name": "service.machine", "description": "Manage service machines", "object_type": "Service"},
        {"index": 307, "name": "service.buy_guard", "description": "Manage service buy guards", "object_type": "Service"},
        {"index": 308, "name": "service.arbitration", "description": "Manage service arbitrations", "object_type": "Service"},
        {"index": 309, "name": "service.customer_info_required", "description": "Manage service customer info requirements", "object_type": "Service"},
        {"index": 310, "name": "service.pause", "description": "Pause or resume service", "object_type": "Service"},
        {"index": 311, "name": "service.publish", "description": "Publish service", "object_type": "Service"},
        {"index": 312, "name": "service.discount", "description": "Manage service discounts", "object_type": "Service"},
        {"index": 313, "name": "service.order_allocator", "description": "Manage service order allocators", "object_type": "Service"},
        {"index": 314, "name": "service.compensation_fund_withdraw", "description": "Withdraw from service compensation fund", "object_type": "Service"},
        {"index": 315, "name": "service.compensation_fund_deposit", "description": "Deposit to service compensation fund", "object_type": "Service"},
        {"index": 316, "name": "service.compensation_fund_receive", "description": "Receive payments for service compensation fund", "object_type": "Service"},
        {"index": 317, "name": "service.setting_locked_time_add", "description": "Add locked time to service compensation", "object_type": "Service"},
        {"index": 318, "name": "service.reward", "description": "Manage service rewards", "object_type": "Service"},
        {"index": 319, "name": "service.owner_receive", "description": "Receive objects or payments for service", "object_type": "Service"},
        {"index": 320, "name": "service.um", "description": "Manage service UM (User Manager)", "object_type": "Service"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Name filtering is case-insensitive and matches partial strings. The filter "service" returns all permissions with "service" in their name.

---

## Example 3: Query Guard Instructions

### Feature Description

Get reference information for Guard instructions and object queries, including their IDs, names, parameters, return types, and descriptions.

### Examples

#### Example 3.1: Get All Guard Instructions

**Prompt**: Query all Guard instructions to understand available operations.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "identifier", "id": 40, "description": "Returns the constant value stored at the specified identifier in the Guard table..."},
        {"name": "query_wowok_object", "id": 40, "description": "Returns the result of executing a data query instruction on the specified object..."},
        {"name": "logic_as_u256_greater_or_equal", "id": 92, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser_or_equal", "id": 94, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_greater", "id": 91, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser", "id": 93, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_equal", "id": 95, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_equal", "id": 90, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes of any type..."},
        {"name": "logic_not", "id": 98, "returnType": 0, "description": "Returns Bool. Input: [Bool]..."},
        {"name": "logic_and", "id": 96, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_or", "id": 97, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_string_contains", "id": 64, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_contains", "id": 65, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_equal", "id": 66, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "calc_number_add", "id": 200, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_multiply", "id": 202, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_subtract", "id": 201, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_divide", "id": 203, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_mod", "id": 204, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_string_length", "id": 61, "returnType": 6, "description": "Returns U64. Input: [String]..."},
        {"name": "calc_string_indexof", "id": 62, "returnType": 6, "description": "Returns U64. Input: [String, String, Order]..."},
        {"name": "calc_string_nocase_indexof", "id": 63, "returnType": 6, "description": "Returns U64. Input: [String, String, Order]..."},
        {"name": "convert_number_address", "id": 205, "returnType": 1, "description": "Returns Address. Input: [numeric]..."},
        {"name": "convert_address_number", "id": 207, "returnType": 8, "description": "Returns U256. Input: [Address]..."},
        {"name": "convert_number_string", "id": 206, "returnType": 2, "description": "Returns String. Input: [numeric]..."},
        {"name": "convert_string_number", "id": 208, "returnType": 8, "description": "Returns U256. Input: [String]..."},
        {"name": "convert_safe_u8", "id": 220, "returnType": 3, "description": "Returns U8. Input: [numeric]..."},
        {"name": "convert_safe_u16", "id": 221, "returnType": 4, "description": "Returns U16. Input: [numeric]..."},
        {"name": "convert_safe_u32", "id": 222, "returnType": 5, "description": "Returns U32. Input: [numeric]..."},
        {"name": "convert_safe_u64", "id": 223, "returnType": 6, "description": "Returns U64. Input: [numeric]..."},
        {"name": "convert_safe_u128", "id": 224, "returnType": 7, "description": "Returns U128. Input: [numeric]..."},
        {"name": "convert_safe_u256", "id": 225, "returnType": 8, "description": "Returns U256. Input: [numeric]..."},
        {"name": "value_type", "id": 70, "returnType": 3, "description": "Returns U8. Input: [any type]..."},
        {"name": "vec_length", "id": 71, "returnType": 6, "description": "Returns U64. Input: [Vec type]..."},
        {"name": "vec_contains_bool", "id": 72, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_address", "id": 73, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string", "id": 74, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string_nocase", "id": 75, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_number", "id": 76, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "context_signer", "id": 45, "returnType": 1, "description": "Returns transaction sender address (Address)."},
        {"name": "context_clock", "id": 46, "returnType": 6, "description": "Returns current on-chain timestamp (U64)."},
        {"name": "context_guard", "id": 47, "returnType": 1, "description": "Returns current Guard object ID (Address)."},
        {"id": 1001, "name": "permission.description", "objectType": "Permission", "parameters": [], "return": 2, "description": "Description of the permission"},
        {"id": 1002, "name": "permission.owner", "objectType": "Permission", "parameters": [], "return": 1, "description": "Builder ID who has the ownership of the permission"},
        {"id": 1003, "name": "permission.admin count", "objectType": "Permission", "parameters": [], "return": 6, "description": "Number of users with admin permission"},
        {"id": 1004, "name": "permission.admin has", "objectType": "Permission", "parameters": [1], "return": 0, "description": "Whether the user has admin permission"},
        {"id": 1150, "name": "repository.description", "objectType": "Repository", "parameters": [], "return": 2, "description": "Description of the repository"},
        {"id": 1151, "name": "repository.policy count", "objectType": "Repository", "parameters": [], "return": 6, "description": "Number of policies in the repository"},
        {"id": 1200, "name": "machine.description", "objectType": "Machine", "parameters": [], "return": 2, "description": "Description of the machine"},
        {"id": 1201, "name": "machine.node_count", "objectType": "Machine", "parameters": [], "return": 6, "description": "Number of nodes in the machine"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: The full result contains 100+ instructions including basic logic operations, calculations, conversions, vector operations, context queries, and object-specific queries.

---

#### Example 3.2: Filter by Name

**Prompt**: Search for Guard instructions with "equal" in their name (case-insensitive).

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "name": "equal"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "logic_as_u256_greater_or_equal", "id": 92, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser_or_equal", "id": 94, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_equal", "id": 95, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_equal", "id": 90, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes of any type..."},
        {"name": "logic_string_nocase_equal", "id": 66, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Name filtering found 5 instructions containing "equal" in their name.

---

#### Example 3.3: Filter by Return Type

**Prompt**: Find all Guard instructions that return Bool type (returnType = 0).

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "returnType": 0
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "logic_as_u256_greater_or_equal", "id": 92, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser_or_equal", "id": 94, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_greater", "id": 91, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser", "id": 93, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_equal", "id": 95, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_equal", "id": 90, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes of any type..."},
        {"name": "logic_not", "id": 98, "returnType": 0, "description": "Returns Bool. Input: [Bool]..."},
        {"name": "logic_and", "id": 96, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_or", "id": 97, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_string_contains", "id": 64, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_contains", "id": 65, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_equal", "id": 66, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "vec_contains_bool", "id": 72, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_address", "id": 73, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string", "id": 74, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string_nocase", "id": 75, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_number", "id": 76, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."}
      ]
    }
  },
  "schema": null
}
```

> **Note**: returnType uses numeric values (0 = Bool, 1 = Address, 2 = String, 3-8 = numeric types, 9+ = vector types). Use "value types" query to see all mappings.

---

#### Example 3.4: Filter by Parameter Count

**Prompt**: Find Guard instructions that take exactly 2 parameters.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "paramCount": 2
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "logic_as_u256_greater_or_equal", "id": 92, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser_or_equal", "id": 94, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_greater", "id": 91, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_lesser", "id": 93, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_as_u256_equal", "id": 95, "returnType": 0, "description": "Returns Bool. Requires 2-8 numeric nodes..."},
        {"name": "logic_equal", "id": 90, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes of any type..."},
        {"name": "logic_and", "id": 96, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_or", "id": 97, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_string_contains", "id": 64, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_contains", "id": 65, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "logic_string_nocase_equal", "id": 66, "returnType": 0, "description": "Returns Bool. Requires 2-8 string nodes..."},
        {"name": "calc_number_add", "id": 200, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_multiply", "id": 202, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_subtract", "id": 201, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_divide", "id": 203, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "calc_number_mod", "id": 204, "returnType": 8, "description": "Returns U256. Requires 2-8 numeric nodes..."},
        {"name": "vec_contains_bool", "id": 72, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_address", "id": 73, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string", "id": 74, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_string_nocase", "id": 75, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."},
        {"name": "vec_contains_number", "id": 76, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes..."}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Found 21 instructions that accept exactly 2 parameters (most instructions support 2-8 parameters, but paramCount filters for exact match).

---

#### Example 3.5: Filter by Scope

**Prompt**: Show only object query instructions (not basic instructions).

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "scope": "object query"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"id": 1001, "name": "permission.description", "objectType": "Permission", "parameters": [], "return": 2, "description": "Description of the permission"},
        {"id": 1002, "name": "permission.owner", "objectType": "Permission", "parameters": [], "return": 1, "description": "Builder ID who has the ownership of the permission"},
        {"id": 1003, "name": "permission.admin count", "objectType": "Permission", "parameters": [], "return": 6, "description": "Number of users with admin permission"},
        {"id": 1004, "name": "permission.admin has", "objectType": "Permission", "parameters": [1], "return": 0, "description": "Whether the user has admin permission"},
        {"id": 1050, "name": "allocation.description", "objectType": "Allocation", "parameters": [], "return": 2, "description": "Description of the allocation"},
        {"id": 1051, "name": "allocation.balance", "objectType": "Allocation", "parameters": [], "return": 6, "description": "Funding amount of the allocation"},
        {"id": 1100, "name": "payment.amount", "objectType": "Payment", "parameters": [], "return": 6, "description": "Amount of the payment"},
        {"id": 1150, "name": "repository.description", "objectType": "Repository", "parameters": [], "return": 2, "description": "Description of the repository"},
        {"id": 1151, "name": "repository.policy count", "objectType": "Repository", "parameters": [], "return": 6, "description": "Number of policies in the repository"},
        {"id": 1200, "name": "machine.description", "objectType": "Machine", "parameters": [], "return": 2, "description": "Description of the machine"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Object query instructions allow querying on-chain object state. IDs 1000+ are reserved for object queries.

---

#### Example 3.6: Multiple Filters Combined

**Prompt**: Find instructions with "logic" in name, returning Bool, with 2 parameters.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "name": "logic",
      "returnType": 0,
      "paramCount": 2,
      "scope": "all"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "logic_equal", "id": 90, "returnType": 0, "description": "Returns Bool. Requires 2-8 nodes of any type..."},
        {"name": "logic_and", "id": 96, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."},
        {"name": "logic_or", "id": 97, "returnType": 0, "description": "Returns Bool. Requires 2-8 boolean nodes..."}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Multiple filters are combined with AND logic. This query finds 3 logic instructions that return Bool and accept 2+ parameters.

---

#### Example 3.7: Filter by Object Type

**Prompt**: Show only object query instructions that operate on Permission objects.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions",
    "filter": {
      "scope": "object query",
      "objectType": "Permission"
    }
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"id": 1001, "name": "permission.description", "objectType": "Permission", "parameters": [], "return": 2, "description": "Description of the permission"},
        {"id": 1002, "name": "permission.owner", "objectType": "Permission", "parameters": [], "return": 1, "description": "Builder ID who has the ownership of the permission"},
        {"id": 1003, "name": "permission.admin count", "objectType": "Permission", "parameters": [], "return": 6, "description": "Number of users with admin permission"},
        {"id": 1004, "name": "permission.admin has", "objectType": "Permission", "parameters": [1], "return": 0, "description": "Whether the user has admin permission"},
        {"id": 1005, "name": "permission.entity count", "objectType": "Permission", "parameters": [], "return": 6, "description": "Number of users or guard objects with entity permission"},
        {"id": 1006, "name": "permission.entity has", "objectType": "Permission", "parameters": [1], "return": 0, "description": "Whether the user or guard object has entity permission"},
        {"id": 1007, "name": "permission.entity.perm count", "objectType": "Permission", "parameters": [1], "return": 6, "description": "Number of permissions the user or guard object has"},
        {"id": 1008, "name": "permission.entity.perm has", "objectType": "Permission", "parameters": [1, 4], "return": 0, "description": "Whether the user or guard object has the specified permission"},
        {"id": 1009, "name": "permission.perm.remark count", "objectType": "Permission", "parameters": [], "return": 6, "description": "Number of permission remarks"},
        {"id": 1010, "name": "permission.perm.remark has", "objectType": "Permission", "parameters": [4], "return": 0, "description": "Whether the permission has a remark"},
        {"id": 1011, "name": "permission.perm.remark", "objectType": "Permission", "parameters": [4], "return": 2, "description": "Remark of the permission"},
        {"id": 1012, "name": "permission.um some", "objectType": "Permission", "parameters": [], "return": 0, "description": "Whether the permission has set a Contact object"},
        {"id": 1013, "name": "permission.um", "objectType": "Permission", "parameters": [], "return": 1, "description": "Contact object ID of the permission"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Found 13 object query instructions for Permission objects. These allow querying permission state on-chain.

---

## Example 4: Query Current Network

### Feature Description

Get the current network entrypoint to verify which blockchain environment you're connected to.

### Examples

#### Example 4.1: Get Current Network

**Prompt**: Check which network is currently active (localnet or testnet).

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "current network"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": "testnet"
    }
  },
  "schema": null
}
```

> **Note**: Current network is "testnet". Other possible values are "localnet" for local development and "mainnet" for production.

---

## Example 5: Query Value Types

### Feature Description

Get mappings of supported value types, showing both their numeric IDs and string representations.

### Examples

#### Example 5.1: Get All Value Types

**Prompt**: Query all supported value types to understand type system mappings.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "value types"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {"name": "Bool", "value": "Bool", "description": "Value type Bool = 0"},
        {"name": "Address", "value": "Address", "description": "Value type Address = 1"},
        {"name": "String", "value": "String", "description": "Value type String = 2"},
        {"name": "U8", "value": "U8", "description": "Value type U8 = 3"},
        {"name": "U16", "value": "U16", "description": "Value type U16 = 4"},
        {"name": "U32", "value": "U32", "description": "Value type U32 = 5"},
        {"name": "U64", "value": "U64", "description": "Value type U64 = 6"},
        {"name": "U128", "value": "U128", "description": "Value type U128 = 7"},
        {"name": "U256", "value": "U256", "description": "Value type U256 = 8"},
        {"name": "VecBool", "value": "VecBool", "description": "Value type VecBool = 9"},
        {"name": "VecAddress", "value": "VecAddress", "description": "Value type VecAddress = 10"},
        {"name": "VecString", "value": "VecString", "description": "Value type VecString = 11"},
        {"name": "VecU8", "value": "VecU8", "description": "Value type VecU8 = 12"},
        {"name": "VecU16", "value": "VecU16", "description": "Value type VecU16 = 13"},
        {"name": "VecU32", "value": "VecU32", "description": "Value type VecU32 = 14"},
        {"name": "VecU64", "value": "VecU64", "description": "Value type VecU64 = 15"},
        {"name": "VecU128", "value": "VecU128", "description": "Value type VecU128 = 16"},
        {"name": "VecU256", "value": "VecU256", "description": "Value type VecU256 = 17"},
        {"name": "VecVecU8", "value": "VecVecU8", "description": "Value type VecVecU8 = 18"}
      ]
    }
  },
  "schema": null
}
```

> **Note**: Value types 0-8 are scalar types, 9-18 are vector types. These numeric IDs are used in Guard instruction returnType fields.

---

## Example 6: Query Mainnet Bridge Tokens

### Feature Description

Get the list of tokens deployed on the mainnet bridge. Each token includes its symbol, WOW-side type tag (`wowTypeTag`), EVM-side contract address, decimals, and description.

The `wowTypeTag` (format `{address}::{module}::{struct}`) is the most important field: it can be used directly as the `type_parameter` of **Service**, **Treasury**, **Reward**, and **Allocation** objects to set their payment token. This extends the WOW system's official payment types beyond the native WOW token — for example, use USDT's `wowTypeTag` to create a Service that accepts USDT payments.

### Examples

#### Example 6.1: Get All Mainnet Bridge Tokens

**Prompt**: Query all mainnet bridge tokens to see which tokens can be used as payment types.

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "mainnet bridge tokens"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": [
        {
          "tokenId": 1,
          "symbol": "WBTC",
          "wowTypeTag": "0x06c69f212cc7bef6ff730b42bc739be7786902c501f15e99dbce1b8b5c7eff58::btc::BTC",
          "evmAddress": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          "evmDecimals": 8,
          "wowDecimals": 8,
          "evmChains": [10],
          "description": "Wrapped BTC (ERC20). Bitcoin price exposure on Ethereum; 1 WBTC = 1 BTC."
        },
        {
          "tokenId": 2,
          "symbol": "ETH",
          "wowTypeTag": "0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH",
          "evmAddress": "0x0000000000000000000000000000000000000000",
          "evmDecimals": 18,
          "wowDecimals": 8,
          "evmChains": [10],
          "description": "Native ETH. Calls bridgeETHV2{value}; vault auto-wraps to WETH internally. 18 decimals on EVM, 8 decimals on WOW."
        },
        {
          "tokenId": 2,
          "symbol": "WETH",
          "wowTypeTag": "0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH",
          "evmAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          "evmDecimals": 18,
          "wowDecimals": 8,
          "evmChains": [10],
          "description": "Wrapped ETH (ERC20). Calls bridgeERC20V2; shares Token ID 2 and WOW type tag with native ETH."
        },
        {
          "tokenId": 3,
          "symbol": "USDC",
          "wowTypeTag": "0xe70fcfd8ef984292b11346ee43880ea9d6fba9f270c90bd0432574db14af67bf::usdc::USDC",
          "evmAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "evmDecimals": 6,
          "wowDecimals": 6,
          "evmChains": [10],
          "description": "USD Coin (USDC). Fully collateralized USD stablecoin; 6 decimals on both sides."
        },
        {
          "tokenId": 4,
          "symbol": "USDT",
          "wowTypeTag": "0x4f160cf9a28ca8ac8bc0a46e13b02588dc05722148dd964807b9be89a0fcfe4d::usdt::USDT",
          "evmAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          "evmDecimals": 6,
          "wowDecimals": 6,
          "evmChains": [10],
          "description": "Tether USD (USDT). Fiat-collateralized stablecoin; 6 decimals on both sides."
        }
      ]
    }
  },
  "schema": null
}
```

> **Note**: The result returns 5 token entries (WBTC, ETH, WETH, USDC, USDT). ETH and WETH share the same `tokenId` (2) and `wowTypeTag` — native ETH is auto-wrapped to WETH internally by the bridge vault. The `evmChains` value `10` corresponds to the bridge protocol's chain ID for ETH mainnet.

#### Using wowTypeTag as type_parameter

The `wowTypeTag` values returned by this query can be used directly as the `type_parameter` field when creating Service, Treasury, Reward, or Allocation objects. For example, to create a Service that accepts USDT payments:

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": {
        "name": "my_usdt_service",
        "type_parameter": "0x4f160cf9a28ca8ac8bc0a46e13b02588dc05722148dd964807b9be89a0fcfe4d::usdt::USDT"
      }
    }
  }
}
```

If `type_parameter` is omitted, it defaults to `0x2::wow::WOW` (the native WOW gas token).

---

## Mainnet Bridge Token Reference

The following table lists all mainnet bridge tokens with their `wowTypeTag` values. These values are fixed and will not change — they can be used directly in `type_parameter` fields.

| Symbol | Token ID | wowTypeTag (type_parameter) | EVM Address | EVM Decimals | WOW Decimals |
|--------|----------|-----------------------------|-------------|--------------|--------------|
| **WBTC** | 1 | `0x06c69f212cc7bef6ff730b42bc739be7786902c501f15e99dbce1b8b5c7eff58::btc::BTC` | 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 | 8 | 8 |
| **ETH** | 2 | `0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH` | 0x0000000000000000000000000000000000000000 (native) | 18 | 8 |
| **WETH** | 2 | `0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH` | 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 | 18 | 8 |
| **USDC** | 3 | `0xe70fcfd8ef984292b11346ee43880ea9d6fba9f270c90bd0432574db14af67bf::usdc::USDC` | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | 6 | 6 |
| **USDT** | 4 | `0x4f160cf9a28ca8ac8bc0a46e13b02588dc05722148dd964807b9be89a0fcfe4d::usdt::USDT` | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | 6 | 6 |

> **Note**: ETH and WETH share the same `wowTypeTag` because native ETH is auto-wrapped to WETH by the bridge vault. When using ETH/WETH as a payment type, use the shared `wowTypeTag`. The `decimals` difference (18 on EVM vs 8 on WOW for ETH/WBTC) is handled automatically by the bridge protocol.

---

## Important Notes

⚠️ **Constants are protocol-wide** - these values are fixed and consistent across the entire WoWok ecosystem.

⚠️ **Built-in permissions have fixed indexes** - indexes below 1000 are reserved for built-in permissions. Custom permissions start from index 1000.

⚠️ **Guard instructions are comprehensive** - use name filtering to find specific operations quickly. Instructions are categorized into:
   - Basic instructions (IDs 40-99): Logic, calculation, conversion, vector operations
   - Context instructions (IDs 45-47): Signer, clock, guard context
   - Object query instructions (IDs 1000+): Query on-chain object state

⚠️ **Value type mappings** - Use numeric IDs in Guard instruction filters:
   | ID | Type | ID | Type |
   |----|------|----|------|
   | 0 | Bool | 9 | VecBool |
   | 1 | Address | 10 | VecAddress |
   | 2 | String | 11 | VecString |
   | 3 | U8 | 12 | VecU8 |
   | 4 | U16 | 13 | VecU16 |
   | 5 | U32 | 14 | VecU32 |
   | 6 | U64 | 15 | VecU64 |
   | 7 | U128 | 16 | VecU128 |
   | 8 | U256 | 17 | VecU256 |
   | | | 18 | VecVecU8 |

⚠️ **Current network indicates environment** - localnet for development, testnet for testing, mainnet for production.

⚠️ **Filter behavior**:
   - Name filtering is case-insensitive and matches partial strings
   - Multiple filters are combined with AND logic
   - Empty result means no matching instructions found

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Guard](guard.md)** | Trust verification engine - uses guard instructions |
| **[Permission](permission.md)** | Permission management - uses built-in permissions |
| **All components** | Every object uses the value type system |
