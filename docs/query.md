# WatchQuery Component (🔍 Data Query)

---

## Component Overview

The WatchQuery component is used to query local and on-chain data, including accounts, balances, events, objects, table data, etc.

---

## Complete Tool Call Structure

This is the complete top-level tool JSON structure; all sub-features below are part of this structure:

```json
{
  "query_type": "local_mark_list|account_list|local_info_list|token_list|account_balance|onchain_personal_profile|onchain_objects|onchain_table|onchain_table_item_repository_data|onchain_table_item_permission_perm|onchain_table_item_entity_registrar|onchain_table_item_entity_linker|onchain_table_item_reward_record|onchain_table_item_demand_presenter|onchain_table_item_treasury_history|onchain_table_item_machine_node|onchain_table_item_progress_history|onchain_item_address_mark|onchain_received",
  "filter": {},
  "account": "string",
  "token_type": "string",
  "objects": ["string"],
  "parent": "string",
  "object_type": "string",
  "name": "string",
  "entity": "string|number",
  "address": "string",
  "key": "string",
  "u64": "number|string",
  "object": "string",
  "all_type": false
}
```

---

## Feature Tree

| Feature Type | Description |
|----------|------|
| **Local Query** | Query locally stored accounts, marks, info, tokens |
| **On-Chain Query** | Query on-chain objects, personal profiles, table data, events |
| **Table Item Query** | Query specific data items of various tables |

---

## Sub-feature 1: Query Local Mark List

### 📝 Natural Language Prompt

Please help me query the local mark list.
- Filter: {FILTER}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{FILTER}` | object | No | Local mark filter | {"tags": ["friend"]} |

### 📋 Generated Function JSON

```json
{
  "query_type": "local_mark_list",
  "filter": {FILTER}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "local_mark_list",
  "filter": {
    "tags": ["friend"]
  }
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "marks": [
    {
      "name": "alice",
      "address": "0x1234...abcd",
      "tags": ["friend", "designer"]
    }
  ]
}
```

---

## Sub-feature 2: Query Account List

### 📝 Natural Language Prompt

Please help me query the account list.
- Filter: {FILTER}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{FILTER}` | object | No | Account filter | {} |

### 📋 Generated Function JSON

```json
{
  "query_type": "account_list",
  "filter": {FILTER}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "account_list"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "accounts": [
    {
      "name": "my_account",
      "address": "0x1234...abcd",
      "suspended": false
    }
  ]
}
```

---

## Sub-feature 3: Query Local Info List

### 📝 Natural Language Prompt

Please help me query the local info list.
- Filter: {FILTER}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{FILTER}` | object | No | Local info filter | {} |

### 📋 Generated Function JSON

```json
{
  "query_type": "local_info_list",
  "filter": {FILTER}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "local_info_list"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "infos": [
    {
      "name": "shipping_address",
      "default": "123 Main St",
      "contents": ["123 Main St", "10001"]
    }
  ]
}
```

---

## Sub-feature 4: Query Token List

### 📝 Natural Language Prompt

Please help me query the token list.
- Filter: {FILTER}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{FILTER}` | object | No | Token data filter | {} |

### 📋 Generated Function JSON

```json
{
  "query_type": "token_list",
  "filter": {FILTER}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "token_list"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "tokens": [
    {
      "type": "0x2::wow::WOW",
      "symbol": "WOW",
      "decimals": 9
    }
  ]
}
```

---

## Sub-feature 5: Query Account Balance

### 📝 Natural Language Prompt

Please help me query the account balance.
- Account: {ACCOUNT}
- Token type: {TOKEN_TYPE}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{ACCOUNT}` | string | No | Account name or address | "my_account" |
| `{TOKEN_TYPE}` | string | No | Token type | "0x2::wow::WOW" |

### 📋 Generated Function JSON

```json
{
  "query_type": "account_balance",
  "account": "{ACCOUNT}",
  "token_type": "{TOKEN_TYPE}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "account_balance",
  "account": "my_account",
  "token_type": "0x2::wow::WOW"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "account": "my_account",
  "balance": "100000000000"
}
```

---

## Sub-feature 6: Query Personal Profile

### 📝 Natural Language Prompt

Please help me query the personal profile.
- Account: {ACCOUNT}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{ACCOUNT}` | string | No | Account name or address | "my_account" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_personal_profile",
  "account": "{ACCOUNT}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_personal_profile",
  "account": "my_account"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "profile": {
    "address": "0x1234...abcd",
    "like": 10,
    "dislike": 2,
    "description": "This is my profile"
  }
}
```

---

## Sub-feature 7: Query Objects

### 📝 Natural Language Prompt

Please help me query objects.
- Object ID list: {OBJECTS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{OBJECTS}` | array | Yes | Object ID list | ["object_id_1", "object_id_2"] |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_objects",
  "objects": {OBJECTS}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_objects",
  "objects": ["object_id_1", "object_id_2"]
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "objects": [
    {
      "id": "object_id_1",
      "type": "Service",
      "data": {}
    }
  ]
}
```

---

## Sub-feature 8: Query Table Data

### 📝 Natural Language Prompt

Please help me query table data.
- Parent object ID: {PARENT}
- Object type: {OBJECT_TYPE}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "object_id" |
| `{OBJECT_TYPE}` | string | Yes | Object type | "Service" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table",
  "parent": "{PARENT}",
  "object_type": "{OBJECT_TYPE}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table",
  "parent": "object_id",
  "object_type": "Service"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "items": [
    {
      "name": "item1",
      "data": {}
    }
  ]
}
```

---

## Sub-feature 9: Query RepositoryData Table Item

### 📝 Natural Language Prompt

Please help me query the RepositoryData table item.
- Parent object ID: {PARENT}
- Name: {NAME}
- Entity: {ENTITY}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "repository_object_id" |
| `{NAME}` | string | Yes | Record name | "item_name" |
| `{ENTITY}` | string/number | Yes | Entity ID or address | "entity_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_repository_data",
  "parent": "{PARENT}",
  "name": "{NAME}",
  "entity": "{ENTITY}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_repository_data",
  "parent": "repository_object_id",
  "name": "item_name",
  "entity": "entity_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "name": "item_name",
    "data": {}
  }
}
```

---

## Sub-feature 10: Query PermissionPerm Table Item

### 📝 Natural Language Prompt

Please help me query the PermissionPerm table item.
- Parent object ID: {PARENT}
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "permission_object_id" |
| `{ADDRESS}` | string | Yes | User or Guard address | "user_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_permission_perm",
  "parent": "{PARENT}",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_permission_perm",
  "parent": "permission_object_id",
  "address": "user_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "user_address",
    "permissions": []
  }
}
```

---

## Sub-feature 11: Query EntityRegistrar Table Item

### 📝 Natural Language Prompt

Please help me query the EntityRegistrar table item.
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{ADDRESS}` | string | Yes | Entity address | "entity_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_entity_registrar",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_entity_registrar",
  "address": "entity_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "entity_address",
    "description": "Entity description"
  }
}
```

---

## Sub-feature 12: Query EntityLinker Table Item

### 📝 Natural Language Prompt

Please help me query the EntityLinker table item.
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{ADDRESS}` | string | Yes | Address | "entity_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_entity_linker",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_entity_linker",
  "address": "entity_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "entity_address",
    "votes": []
  }
}
```

---

## Sub-feature 13: Query RewardRecord Table Item

### 📝 Natural Language Prompt

Please help me query the RewardRecord table item.
- Parent object ID: {PARENT}
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "reward_object_id" |
| `{ADDRESS}` | string | Yes | Claimer address | "user_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_reward_record",
  "parent": "{PARENT}",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_reward_record",
  "parent": "reward_object_id",
  "address": "user_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "user_address",
    "records": []
  }
}
```

---

## Sub-feature 14: Query DemandPresenter Table Item

### 📝 Natural Language Prompt

Please help me query the DemandPresenter table item.
- Parent object ID: {PARENT}
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "demand_object_id" |
| `{ADDRESS}` | string | Yes | Submitter address | "presenter_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_demand_presenter",
  "parent": "{PARENT}",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_demand_presenter",
  "parent": "demand_object_id",
  "address": "presenter_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "presenter_address",
    "data": {}
  }
}
```

---

## Sub-feature 15: Query TreasuryHistory Table Item

### 📝 Natural Language Prompt

Please help me query the TreasuryHistory table item.
- Parent object ID: {PARENT}
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "treasury_object_id" |
| `{ADDRESS}` | string | Yes | Payment ID | "payment_id" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_treasury_history",
  "parent": "{PARENT}",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_treasury_history",
  "parent": "treasury_object_id",
  "address": "payment_id"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "payment_id",
    "data": {}
  }
}
```

---

## Sub-feature 16: Query MachineNode Table Item

### 📝 Natural Language Prompt

Please help me query the MachineNode table item.
- Parent object ID: {PARENT}
- Key: {KEY}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "machine_object_id" |
| `{KEY}` | string | Yes | Node name key | "start" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_machine_node",
  "parent": "{PARENT}",
  "key": "{KEY}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_machine_node",
  "parent": "machine_object_id",
  "key": "start"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "key": "start",
    "node": {}
  }
}
```

---

## Sub-feature 17: Query ProgressHistory Table Item

### 📝 Natural Language Prompt

Please help me query the ProgressHistory table item.
- Parent object ID: {PARENT}
- U64 value: {U64}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "progress_object_id" |
| `{U64}` | number/string | Yes | Record U64 value | 1 |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_progress_history",
  "parent": "{PARENT}",
  "u64": "{U64}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_progress_history",
  "parent": "progress_object_id",
  "u64": 1
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "u64": 1,
    "history": {}
  }
}
```

---

## Sub-feature 18: Query AddressMark Table Item

### 📝 Natural Language Prompt

Please help me query the AddressMark table item.
- Parent object ID: {PARENT}
- Address: {ADDRESS}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{PARENT}` | string | Yes | Parent object ID | "resource_object_id" |
| `{ADDRESS}` | string | Yes | Mark address | "entity_address" |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_address_mark",
  "parent": "{PARENT}",
  "address": "{ADDRESS}"
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_table_item_address_mark",
  "parent": "resource_object_id",
  "address": "entity_address"
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "item": {
    "address": "entity_address",
    "name": "tag_name",
    "tags": []
  }
}
```

---

## Sub-feature 19: Query Received Objects

### 📝 Natural Language Prompt

Please help me query received objects.
- Object ID: {OBJECT}
- Query all types: {ALL_TYPE}

### 🔧 Variable Description

| Variable Name | Type | Required | Description | Example |
|--------|------|------|------|------|
| `{OBJECT}` | string | Yes | Object ID | "object_id" |
| `{ALL_TYPE}` | boolean | No | Query all types | false |

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_received",
  "object": "{OBJECT}",
  "all_type": {ALL_TYPE}
}
```

### 🎯 Complete Tool Call Example

```json
{
  "query_type": "onchain_received",
  "object": "object_id",
  "all_type": false
}
```

### 📤 Return Result Format

```json
{
  "success": true,
  "received": []
}
```

---

## Best Practices

### 1. Use Filters Reasonably
Use filters to narrow query scope and improve efficiency.

### 2. Batch Query Objects
Query multiple objects at once to reduce network requests.

### 3. Query Balance Regularly
Regularly query account balance and transaction records.

### 4. Cache Query Results
Cache frequently queried data.

---

## Important Notes

⚠️ **On-chain queries require network connection!**

⚠️ **Local queries are only on local device!**

⚠️ **Querying large amounts of data may take longer!**

---

## Related Components

- **Account**: Account management
- **LocalMark**: Local marks
- **LocalInfo**: Local info
- **Personal**: Public identity
