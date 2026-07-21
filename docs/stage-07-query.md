# Stage 7: Data Query 🔍

---

**[← Stage 6: Personal Services](stage-06-personal.md) | [Stage 8: Practical Examples →](stage-08-examples.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about data queries in WoWok, including:

- How to use **query_toolkit** to query local and on-chain data
- How to use **onchain_table_data** to query dynamic table data
- How to use **onchain_events** to query on-chain events
- How to use **wowok_buildin_info** to query protocol information
- How to use **schema_query** to get sub-tool schemas and operation definitions
- How to use **guard2file** to export Guard definitions to files
- How to use **machineNode2file** to export Machine node definitions to files
- How to query Messenger messages via **messenger_operation**

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`. The query sub-tools below are dispatched via this single entry point. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

---

## 📚 Learning Content

### 7.1 Query Sub-Tools Overview

WoWok provides seven specialized query sub-tools (all dispatched via the unified `wowok` tool):

| Sub-tool | Purpose | Main Functions |
|----------|---------|-----------------|
| **query_toolkit** | General data query | Local data, on-chain objects, balances, profiles, received assets |
| **onchain_table_data** | Dynamic table data query | Object dynamic fields tables, table items (permission, repository, reward, etc.) |
| **onchain_events** | On-chain event query | Arbitration events, order events, progress events, etc. |
| **wowok_buildin_info** | Protocol information query | Constants, permissions, Guard instructions, network info, etc. |
| **schema_query** | Sub-tool schema query | Get JSON schemas for all WoWok MCP sub-tools and operations |
| **guard2file** | Export Guard definitions | Export Guard object definitions to JSON or Markdown files |
| **machineNode2file** | Export Machine nodes | Export Machine node definitions to JSON or Markdown files |

**⚠️ Important Note**: Messenger message queries do not go through the above sub-tools; you need to use the **messenger_operation** sub-tool with the appropriate parameters.

> **💡 Related Tool**: The [`trust_score`](trust-score.md) sub-tool provides proactive service trust & risk assessment. While not a generic query tool, it queries on-chain Service data to compute a 0-100 trust score (5 dimensions) and an optional 4-dimension risk score. Use it before purchasing from a service for due diligence.

---

### 7.2 query_toolkit (Data Query Toolkit 🔍)

**Why do we need query_toolkit?**

query_toolkit is WoWok's core query sub-tool, capable of querying data on local devices and various data on the blockchain.

**Supported Query Types:**

**Local Queries:**
- 👤 `account_list` — Query your LOCAL accounts (addresses, messenger status, suspension state; use `includePubkey=true` in filter to include public keys)
- 📇 `local_mark_list` — Query your LOCAL address book (name→address mappings with tags)
- 📝 `local_info_list` — Query your LOCAL private info (delivery addresses, phone numbers, contacts)
- 🏷️ `local_names` — Query LOCAL names by a list of addresses (returns resolved account and mark names)
- 💎 `token_list` — Query cached token metadata (symbol, decimals, icon URL)
- 💰 `account_balance` — Query account coin balance OR paginated coin objects

**On-Chain Queries:**
- 👤 `onchain_personal_profile` — Query any user's PUBLIC on-chain profile (social links, reputation, votes)
- 📦 `onchain_objects` — Batch query on-chain WOWOK objects by ID
- 📥 `onchain_received` — Query objects (payments, tokens, NFTs) received by an on-chain object

> **Note**: Dynamic table data queries (`onchain_table`, `onchain_table_item_*`) have been moved to the dedicated **`onchain_table_data`** sub-tool. See [7.2b onchain_table_data](#72b-onchain_table_data-dynamic-table-data-query) below.

**→ [View query_toolkit Detailed Documentation →](query.md)**

**→ [View onchain_events Detailed Documentation →](onchain_events.md)**

**→ [View wowok_buildin_info Detailed Documentation →](wowok_buildin_info.md)**

---

#### Example 1: Query Account List

Query all local accounts:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "account_list"
  }
}
```

---

#### Example 2: Query Account Balance

Query the WOW token balance of a specified account:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "account_balance",
    "name_or_address": "my_account",
    "balance": true,
    "token_type": "0x2::wow::WOW"
  }
}
```

---

#### Example 3: Query On-Chain Objects

Query detailed information of multiple objects:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["0x1234...abcd", "0x5678...efgh"]
  }
}
```

---

#### Example 4: Query Local Names

Query local names (account name and local mark name) for a list of addresses:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "local_names",
    "addresses": ["0x1234...abcd", "0x5678...efgh"]
  }
}
```

---

### 7.2b onchain_table_data (Dynamic Table Data Query 📊)

**Why do we need onchain_table_data?**

This sub-tool was split from `query_toolkit` to handle the unique characteristics of dynamic table queries. On-chain objects have fixed size, but their table data (dynamic fields) can grow dynamically. The `onchain_table_data` sub-tool is specialized for querying these dynamic tables and their items.

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
  "tool": "onchain_table_data",
  "data": {
    "query_type": "onchain_table",
    "parent": "service_object_id",
    "cursor": null,
    "limit": 20
  }
}
```

#### Example: Query Permission Perm Item

Query the permission record for a specific user:

```json
{
  "tool": "onchain_table_data",
  "data": {
    "query_type": "onchain_table_item_permission_perm",
    "parent": "perm_admin",
    "address": "alice"
  }
}
```

#### Example: Query Entity Registrar Item

Query an entity's registration record:

```json
{
  "tool": "onchain_table_data",
  "data": {
    "query_type": "onchain_table_item_entity_registrar",
    "address": "service_provider"
  }
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
  "tool": "onchain_events",
  "data": {
    "type": "NewOrderEvent",
    "limit": 10,
    "order": "descending"
  }
}
```

---

#### Example 6: Paginated Query of Arbitration Events

Use pagination cursor to query arbitration events:

```json
{
  "tool": "onchain_events",
  "data": {
    "type": "ArbEvent",
    "cursor": null,
    "limit": 20,
    "order": "descending",
    "network": "testnet"
  }
}
```

**The response includes `nextCursor` for the next page query:**

Response structure:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "data": ["..."],
        "hasNextPage": true,
        "nextCursor": {
          "txDigest": "0xabc...",
          "eventSeq": "123"
        }
      },
      "semantic": {
        "intent": "onchain_events",
        "status": "success",
        "summary": "Queried on-chain events"
      }
    }
  },
  "schema": null
}
```

Use `nextCursor` for the next query:
```json
{
  "tool": "onchain_events",
  "data": {
    "type": "ArbEvent",
    "cursor": {
      "txDigest": "0xabc...",
      "eventSeq": "123"
    },
    "limit": 20,
    "order": "descending"
  }
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
| `mainnet bridge tokens` | Mainnet bridge token list (USDT, USDC, ETH, WBTC, WETH) with `wowTypeTag` values usable as `type_parameter` |

---

#### Example 7: Query System Constants

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "constants"
  }
}
```

---

#### Example 8: Query Built-in Permissions

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "built-in permissions"
  }
}
```

**Permission query with filter:**

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "built-in permissions",
    "filter": {
      "name": "order",
      "index": 300
    }
  }
}
```

---

#### Example 9: Query Guard Instructions

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "guard instructions"
  }
}
```

---

#### Example 10: Query Current Network

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "current network"
  }
}
```

---

#### Example 11: Query Value Types

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "value types"
  }
}
```

---

### 7.5 schema_query (Universal Lookup Skill 📋)

**Why do we need schema_query?**

`schema_query` is a **meta sub-tool** — it does not query business data; it queries **the sub-tools themselves**. It is the authoritative source for "how do I call this sub-tool?" and "what does this sub-tool return?".

**Core principle:** the `wowok` handler already returns the correct schema on any parameter mismatch (see [Response Format](response-format.md#status-schema_mismatch)), so you usually do **not** need to call `schema_query` proactively. Use it when you want to browse all available schemas, discover capabilities, or pre-fetch a schema for planning.

**Features:**

- List all available sub-tool schemas (17 sub-tools + 16 on-chain operations)
- Get the **input** schema of a sub-tool or operation by name
- Get the **output** schema of a sub-tool by name
- Search schemas by keyword
- List only on-chain operations

**Actions:**

- `list` — List all available schemas
- `get` — Get a specific schema by name
- `get_output` — Get the output schema of a sub-tool by name
- `search` — Search schemas by keyword
- `list_operations` — List all on-chain operations

---

#### Example 12: List All Available Schemas

Get a list of all available sub-tool schemas:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "list"
  }
}
```

---

#### Example 13: Get Schema for Specific Sub-Tool

Get the JSON schema for `onchain_operations`:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get",
    "name": "onchain_operations"
  }
}
```

Get the schema for a specific operation type:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get",
    "name": "onchain_operations_permission"
  }
}
```

---

#### Example 14: Search Schemas

Search for schemas related to "guard":

```json
{
  "tool": "schema_query",
  "data": {
    "action": "search",
    "query": "guard"
  }
}
```

**→ [View schema_query Detailed Documentation (Universal Lookup Skill) →](schema-query.md)**

---

### 7.6 guard2file (Export Guard Definitions 📄)

**Why do we need guard2file?**

When you want to understand or reuse an existing Guard's validation logic, you can export its definition to a local file. This is useful for:

- **Learning**: Study how existing Guards are structured
- **Reusing**: Modify existing Guard definitions to create new Guard objects

**Features:**

- Export Guard definitions to JSON (for programmatic use)
- Export Guard definitions to Markdown (for human reading)
- Query Guard objects by ID or name

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guard` | string | Yes | Guard object ID or name to export |
| `file_path` | string | Yes | Output file path (absolute or relative) |
| `format` | string | No | Output format: "json" (default) or "markdown" |

---

#### Example 15: Export Guard to JSON

Export a Guard definition to a JSON file:

```json
{
  "tool": "guard2file",
  "data": {
    "guard": "my_guard",
    "file_path": "./exported_guard.json",
    "format": "json"
  }
}
```

---

#### Example 16: Export Guard to Markdown

Export a Guard definition to a Markdown file for easy reading:

```json
{
  "tool": "guard2file",
  "data": {
    "guard": "0x1234...abcd",
    "file_path": "./guard_definition.md",
    "format": "markdown"
  }
}
```

**→ [View guard2file Detailed Documentation →](guard.md#sub-feature-18-export-guard-definitions-with-guard2file)**

---

### 7.7 machineNode2file (Export Machine Node Definitions ⚙️)

**Why do we need machineNode2file?**

When you want to understand or reuse an existing Machine's workflow structure, you can export its node definitions to a local file. This is useful for:

- **Learning**: Study how existing Machines define workflows
- **Reusing**: Copy and modify existing node definitions
- **Templating**: Create new Machines based on existing ones

**Features:**

- Export Machine node definitions to JSON (for programmatic use)
- Export Machine node definitions to Markdown (for human reading)

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `machine` | string | Yes | Machine object ID or name to export |
| `file_path` | string | Yes | Output file path (absolute or relative) |
| `format` | string | No | Output format: "json" (default) or "markdown" |

---

#### Example 17: Export Machine Nodes to JSON

Export a Machine's node definitions to a JSON file:

```json
{
  "tool": "machineNode2file",
  "data": {
    "machine": "my_workflow",
    "file_path": "./exported_nodes.json",
    "format": "json"
  }
}
```

---

#### Example 18: Export Machine Nodes to Markdown

Export a Machine's node definitions to a Markdown file:

```json
{
  "tool": "machineNode2file",
  "data": {
    "machine": "0x5678...efgh",
    "file_path": "./workflow_nodes.md",
    "format": "markdown"
  }
}
```

**→ [View machineNode2file Detailed Documentation →](machine.md#sub-feature-19-export-node-definitions-with-machinenode2file)**

---

### 7.8 Messenger Message Query 💬

**⚠️ Important Note**: Messenger message queries **do not** go through `query_toolkit`; you need to use the dedicated **messenger_operation** sub-tool.

**How to Query Messenger Messages:**

Use the `messenger_operation` sub-tool, specifying `operation` as `"watch_messages"` or `"watch_conversations"`.

---

#### Example 19: View Conversation List

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_conversations",
    "filter": {
      "account": "my_account"
    }
  }
}
```

---

#### Example 20: View Message History

View all messages:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_messages"
  }
}
```

View messages with a specific user:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_messages",
    "filter": {
      "peerAddress": "friend_address"
    }
  }
}
```

View received messages:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_messages",
    "filter": {
      "direction": "received"
    }
  }
}
```

Search by keyword:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_messages",
    "filter": {
      "keyword": "hello",
      "limit": 50
    }
  }
}
```

---

## 🎓 Practice Exercises

### Exercise 1: Query Local Account List

See what local accounts you have:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "account_list"
  }
}
```

---

### Exercise 2: Query Account Balance

Query the WOW balance of the default account:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "account_balance",
    "token_type": "0x2::wow::WOW"
  }
}
```

---

### Exercise 3: Query On-Chain Events

Query the latest 10 new order events:

```json
{
  "tool": "onchain_events",
  "data": {
    "type": "NewOrderEvent",
    "limit": 10,
    "order": "descending"
  }
}
```

---

### Exercise 4: Query Protocol Constants

Query WoWok protocol constants:

```json
{
  "tool": "wowok_buildin_info",
  "data": {
    "info": "constants"
  }
}
```

---

### Exercise 5: Query Messenger Conversations

View your Messenger conversation list:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_conversations"
  }
}
```

Specify account and filter options:

```json
{
  "tool": "messenger_operation",
  "data": {
    "operation": "watch_conversations",
    "filter": {
      "account": "my_account",
      "unreadOnly": true
    }
  }
}
```

---

### Exercise 6: Query Object Details

Query detailed information of a Service object:

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["service_object_id"]
  }
}
```

---

### Exercise 7: Query Sub-Tool Schema

Get the JSON schema for onchain_operations:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get",
    "name": "onchain_operations"
  }
}
```

Search for schemas related to "guard":

```json
{
  "tool": "schema_query",
  "data": {
    "action": "search",
    "query": "guard"
  }
}
```

---

### Exercise 8: Export Guard Definition

Export a Guard definition to a JSON file:

```json
{
  "tool": "guard2file",
  "data": {
    "guard": "my_guard",
    "file_path": "./my_guard.json",
    "format": "json"
  }
}
```

---

### Exercise 9: Export Machine Nodes

Export a Machine's node definitions to a Markdown file:

```json
{
  "tool": "machineNode2file",
  "data": {
    "machine": "my_workflow",
    "file_path": "./my_workflow.md",
    "format": "markdown"
  }
}
```

---

## 📚 Related Documentation

Understanding the response format is essential for processing MCP tool outputs:

| Document | Description |
|----------|-------------|
| [Response Format Reference](response-format.md) | Unified `wowok` envelope, status variants, schema_mismatch flow, semantic layer, error classification, and harness report |
| [Query Component](query.md) | Detailed query_toolkit and onchain_table_data API documentation |
| [On-chain Events](onchain_events.md) | Real-time event watching and querying |
| [Schema Query](schema-query.md) | JSON schema retrieval for MCP sub-tools |

---

## 🏆 Stage Checklist

Congratulations on reaching the final stage! Please confirm that you have:

- [ ] Understood the single unified `wowok` tool call format `{ tool, data }`
- [ ] Understood the differences and uses of the seven query sub-tools
- [ ] Used query_toolkit to query account list
- [ ] Used query_toolkit to query account balance
- [ ] Used onchain_table_data to query dynamic table data
- [ ] Used onchain_events to query on-chain events
- [ ] Used wowok_buildin_info to query protocol information
- [ ] Used schema_query to get sub-tool schemas
- [ ] Used guard2file to export Guard definitions
- [ ] Used machineNode2file to export Machine node definitions
- [ ] Used messenger_operation to query Messenger messages
- [ ] Understood how to query various data

---

## 🎉 Congratulations!

You have completed Stage 7! Now you have mastered WoWok's data query capabilities and are ready to move on to the final stage to explore practical examples!

**[→ Go to Stage 8: Practical Examples 🚀 →](stage-08-examples.md)

---

**[← Return to Main Directory](../README.md)**

---
