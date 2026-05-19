# Stage 7: Data Query 🔍

---

**[← Stage 6: Personal Services](stage-06-personal.md) | [Stage 8: Practical Examples →](stage-08-examples.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about data queries in WoWok, including:

- How to use **query_toolkit** to query local and on-chain data
- How to use **onchain_events** to query on-chain events
- How to use **wowok_buildin_info** to query protocol information
- How to use **schema_query** to get tool schemas and operation definitions
- How to query Messenger messages via **messenger_operation**

---

## 📚 Learning Content

### 7.1 Query Tools Overview

WoWok provides five specialized query tools:

| Tool Name | Purpose | Main Functions |
|---------|------|---------|
| **query_toolkit** | General data query | Local data, on-chain objects, balances, profiles, received assets |
| **onchain_table_data** | Dynamic table data query | Object dynamic fields tables, table items (permission, repository, reward, etc.) |
| **onchain_events** | On-chain event query | Arbitration events, order events, progress events, etc. |
| **wowok_buildin_info** | Protocol information query | Constants, permissions, Guard instructions, network info, etc. |
| **schema_query** | Tool schema query | Get JSON schemas for all WoWok MCP tools and operations |

**⚠️ Important Note**: Messenger message queries do not go through the above tools; you need to use the **messenger_operation** tool with the appropriate parameters.

---

### 7.2 query_toolkit (Data Query Toolkit 🔍)

**Why do we need query_toolkit?**

query_toolkit is WoWok's core query tool, capable of querying data on local devices and various data on the blockchain.

**Supported Query Types:**

**Local Queries:**
- 👤 `account_list` — Query your LOCAL accounts (addresses, public keys, messenger status)
- 📇 `local_mark_list` — Query your LOCAL address book (name→address mappings with tags)
- 📝 `local_info_list` — Query your LOCAL private info (delivery addresses, phone numbers, contacts)
- 🏷️ `local_names` — Query LOCAL names by a list of addresses (returns resolved account and mark names)
- 💎 `token_list` — Query cached token metadata (symbol, decimals, icon URL)
- 💰 `account_balance` — Query account coin balance OR paginated coin objects

**On-Chain Queries:**
- 👤 `onchain_personal_profile` — Query any user's PUBLIC on-chain profile (social links, reputation, votes)
- 📦 `onchain_objects` — Batch query on-chain WOWOK objects by ID
- 📥 `onchain_received` — Query objects (payments, tokens, NFTs) received by an on-chain object

> **Note**: Dynamic table data queries (`onchain_table`, `onchain_table_item_*`) have been moved to the dedicated **`onchain_table_data`** tool. See [7.2b onchain_table_data](#72b-onchain_table_data-dynamic-table-data-query) below.

**→ [View query_toolkit Detailed Documentation →](query.md)**

**→ [View onchain_events Detailed Documentation →](onchain_events.md)**

**→ [View wowok_buildin_info Detailed Documentation →](wowok_buildin_info.md)**

---

#### Example 1: Query Account List

Query all local accounts:

```json
{
  "query_type": "account_list"
}
```

---

#### Example 2: Query Account Balance

Query the WOW token balance of a specified account:

```json
{
  "query_type": "account_balance",
  "name_or_address": "my_account",
  "balance": true,
  "token_type": "0x2::wow::WOW"
}
```

---

#### Example 3: Query On-Chain Objects

Query detailed information of multiple objects:

```json
{
  "query_type": "onchain_objects",
  "objects": ["0x1234...abcd", "0x5678...efgh"]
}
```

---

### 7.2b onchain_table_data (Dynamic Table Data Query 📊)

**Why do we need onchain_table_data?**

This tool was split from `query_toolkit` to handle the unique characteristics of dynamic table queries. On-chain objects have fixed size, but their table data (dynamic fields) can grow dynamically. The `onchain_table_data` tool is specialized for querying these dynamic tables and their items.

**Supported Query Types (12 total):**

| # | query_type | Parent Object | Key | Meaning |
|---|-----------|--------------|-----|---------|
| 1 | `onchain_table` | Any object | — | Paginated query of ANY object's dynamic fields table |
| 2 | `onchain_table_item_repository_data` | Repository | name + entity | Query a record from a Repository's key-value database |
| 3 | `onchain_table_item_permission_perm` | Permission | user/Guard address | Query permission entries from access control table |
| 4 | `onchain_table_item_entity_registrar` | System EntityRegistrar | user address | Query entity registration records |
| 5 | `onchain_table_item_entity_linker` | System EntityLinker | entity address | Query community votes/endorsements |
| 6 | `onchain_table_item_reward_record` | Reward | recipient address | Query reward claim records |
| 7 | `onchain_table_item_demand_presenter` | Demand | presenter address | Query demand submissions |
| 8 | `onchain_table_item_treasury_history` | Treasury | payment ID | Query treasury payment records |
| 9 | `onchain_table_item_machine_node` | Machine | node name | Query workflow node definitions |
| 10 | `onchain_table_item_progress_history` | Progress | sequence number | Query progress step records |
| 11 | `onchain_table_item_address_mark` | AddressMark | address | Query PUBLIC on-chain name/tag marks |
| 12 | `onchain_table_item_generic` | Any object | any key type | Query generic table item from ANY object (supports address, u64, string, object ID keys) |

**→ [View onchain_table_data Detailed Documentation →](query.md#onchain_table_data-tool)**

---

#### Example: Query Table Data

Query the table data of a Service object with pagination:

```json
{
  "query_type": "onchain_table",
  "parent": "service_object_id",
  "cursor": null,
  "limit": 20
}
```

#### Example: Query Permission Perm Item

Query the permission record for a specific user:

```json
{
  "query_type": "onchain_table_item_permission_perm",
  "parent": "perm_admin",
  "address": "alice"
}
```

#### Example: Query Entity Registrar Item

Query an entity's registration record:

```json
{
  "query_type": "onchain_table_item_entity_registrar",
  "address": "service_provider"
}
```

---

### 7.3 onchain_events (On-Chain Event Query 📅)

**Why do we need onchain_events?**

On-chain events record important activities in the WoWok ecosystem, such as order creation, arbitration initiation, progress updates, etc. By querying these events, you can:

- Track order lifecycle
- Monitor arbitration status
- Get demand feedback
- View new entity registrations

**Supported Event Types:**

| Event Type | Description |
|---------|------|
| `ArbEvent` | Arbitration events |
| `NewOrderEvent` | New order events |
| `ProgressEvent` | Progress events |
| `DemandPresentEvent` | Demand submission events |
| `DemandFeedbackEvent` | Demand feedback events |
| `NewEntityEvent` | New entity registration events |

> **Note**: Any arbitrary string('{package_address::module_name::event_name}') can also be used as an event type for custom events.

---

#### Example 5: Query New Order Events

Query the latest new order events:

```json
{
  "type": "NewOrderEvent",
  "limit": 10,
  "order": "descending"
}
```

---

#### Example 6: Paginated Query of Arbitration Events

Use pagination cursor to query arbitration events:

```json
{
  "type": "ArbEvent",
  "cursor": null,
  "limit": 20,
  "order": "descending",
  "network": "testnet"
}
```

**The response includes `nextCursor` for the next page query:**

```json
{
  "type": "ArbEvent",
  "cursor": {
    "txDigest": "0xabc...",
    "eventSeq": "123"
  },
  "limit": 20,
  "order": "descending"
}
```

---

### 7.4 wowok_buildin_info (Protocol Information Query ℹ️)

**Why do we need wowok_buildin_info?**

Query WoWok protocol's built-in information, including system constants, permission definitions, Guard instructions, etc.

**Supported Information Types:**

| Information Type | Description |
|---------|------|
| `constants` | System constants |
| `built-in permissions` | Built-in permission list |
| `guard instructions` | Guard instruction list |
| `current network` | Current network entry point |
| `value types` | Supported value types |

---

#### Example 7: Query System Constants

```json
{
  "info": "constants"
}
```

---

#### Example 8: Query Built-in Permissions

```json
{
  "info": "built-in permissions"
}
```

**Permission query with filter:**

```json
{
  "info": "built-in permissions",
  "filter": {
    "name": "order",
    "index": 300
  }
}
```

---

#### Example 9: Query Guard Instructions

```json
{
  "info": "guard instructions"
}
```

---

#### Example 10: Query Current Network

```json
{
  "info": "current network"
}
```

---

#### Example 11: Query Value Types

```json
{
  "info": "value types"
}
```

---

### 7.5 schema_query (Tool Schema Query 📋)

**Why do we need schema_query?**

When you need to understand the exact structure required for calling WoWok MCP tools, you can use this tool to get JSON schemas. This is useful for:

- AI that needs exact parameter formats for tool calls
- Developers who want to understand tool interfaces
- Finding detailed schema definitions for specific operations

**Features:**

- List all available tool schemas
- Get specific schema by name (e.g., `onchain_operations`, `account_operation`)
- Search schemas by keyword
- List all on-chain operations

**Actions:**

- `list` — List all available schemas
- `get` — Get a specific schema by name
- `search` — Search schemas by keyword
- `list_operations` — List all on-chain operations

---

#### Example 12: List All Available Schemas

Get a list of all available tool schemas:

```json
{
  "action": "list"
}
```

---

#### Example 13: Get Schema for Specific Tool

Get the JSON schema for `onchain_operations`:

```json
{
  "action": "get",
  "name": "onchain_operations"
}
```

Get the schema for a specific operation type:

```json
{
  "action": "get",
  "name": "onchain_operations_permission"
}
```

---

#### Example 14: Search Schemas

Search for schemas related to "guard":

```json
{
  "action": "search",
  "query": "guard"
}
```

---

### 7.6 Messenger Message Query 💬

**⚠️ Important Note**: Messenger message queries **do not** go through `query_toolkit`; you need to use the dedicated **messenger_operation** tool.

**How to Query Messenger Messages:**

Use the `messenger_operation` tool, specifying `operation` as `"watch_messages"` or `"watch_conversations"`.

---

#### Example 15: View Conversation List

```json
{
  "operation": "watch_conversations",
  "account": "my_account"
}
```

---

#### Example 16: View Message History

View all messages:

```json
{
  "operation": "watch_messages"
}
```

View messages with a specific user:

```json
{
  "operation": "watch_messages",
  "filter": {
    "peerAddress": {
      "name_or_address": "friend_address"
    }
  }
}
```

View received messages:

```json
{
  "operation": "watch_messages",
  "filter": {
    "direction": "received"
  }
}
```

Search by keyword:

```json
{
  "operation": "watch_messages",
  "filter": {
    "keyword": "hello",
    "limit": 50
  }
}
```

---

## 🎓 Practice Exercises

### Exercise 1: Query Local Account List

See what local accounts you have:

```json
{
  "query_type": "account_list"
}
```

---

### Exercise 2: Query Account Balance

Query the WOW balance of the default account:

```json
{
  "query_type": "account_balance",
  "token_type": "0x2::wow::WOW"
}
```

---

### Exercise 3: Query On-Chain Events

Query the latest 10 new order events:

```json
{
  "type": "NewOrderEvent",
  "limit": 10,
  "order": "descending"
}
```

---

### Exercise 4: Query Protocol Constants

Query WoWok protocol constants:

```json
{
  "info": "constants"
}
```

---

### Exercise 5: Query Messenger Conversations

View your Messenger conversation list:

```json
{
  "operation": "watch_conversations"
}
```

---

### Exercise 6: Query Object Details

Query detailed information of a Service object:

```json
{
  "query_type": "onchain_objects",
  "objects": ["service_object_id"]
}
```

---

### Exercise 7: Query Tool Schema

Get the JSON schema for onchain_operations:

```json
{
  "action": "get",
  "name": "onchain_operations"
}
```

Search for schemas related to "guard":

```json
{
  "action": "search",
  "query": "guard"
}
```

---

## 🏆 Stage Checklist

Congratulations on reaching the final stage! Please confirm that you have:

- [ ] Understood the differences and uses of the five query tools
- [ ] Used query_toolkit to query account list
- [ ] Used query_toolkit to query account balance
- [ ] Used onchain_table_data to query dynamic table data
- [ ] Used onchain_events to query on-chain events
- [ ] Used wowok_buildin_info to query protocol information
- [ ] Used schema_query to get tool schemas
- [ ] Used messenger_operation to query Messenger messages
- [ ] Understood how to query various data

---

## 🎉 Congratulations!

You have completed Stage 7! Now you have mastered WoWok's data query capabilities and are ready to move on to the final stage to explore practical examples!

**[→ Go to Stage 8: Practical Examples 🚀 →](stage-08-examples.md)

---

**[← Return to Main Directory](../README.md)**

---