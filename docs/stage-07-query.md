# Stage 7: Data Query 🔍

---

**[← Stage 6: Personal Services](stage-06-personal.md) | [Stage 8: Practical Examples →](stage-08-query.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about data queries in WoWok, including:

- How to use **query_toolkit** to query local and on-chain data
- How to use **onchain_events** to query on-chain events
- How to use **wowok_buildin_info** to query protocol information
- How to use **documents_and_learn** to get documentation and learning resources
- How to query Messenger messages via **messenger_operation**

---

## 📚 Learning Content

### 7.1 Query Tools Overview

WoWok provides four specialized query tools:

| Tool Name | Purpose | Main Functions |
|---------|------|---------|
| **query_toolkit** | General data query | Local data, on-chain objects, table data, balances, etc. |
| **onchain_events** | On-chain event query | Arbitration events, order events, progress events, etc. |
| **wowok_buildin_info** | Protocol information query | Constants, permissions, Guard instructions, network info, etc. |
| **documents_and_learn** | Documentation and learning resources | Get official documentation URLs for users and AI to get help |

**⚠️ Important Note**: Messenger message queries do not go through the above tools; you need to use the **messenger_operation** tool with the appropriate parameters.

---

### 7.2 query_toolkit (Data Query Toolkit 🔍)

**Why do we need query_toolkit?**

query_toolkit is WoWok's core query tool, capable of querying data on local devices and various data on the blockchain.

**Supported Query Types:**

**Local Queries:**
- 👤 `account_list` - Account list
- 📇 `local_mark_list` - Local mark list
- 📝 `local_info_list` - Local information list
- 💎 `token_list` - Token list
- 💰 `account_balance` - Account balance

**On-Chain Queries:**
- 👤 `onchain_personal_profile` - Public profile
- 📦 `onchain_objects` - Query objects
- 📊 `onchain_table` - Query table data
- 📋 `onchain_table_item_*` - Query table items
- 📥 `onchain_received` - Query received objects

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
  "account": "my_account",
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

#### Example 4: Query Table Data

Query the sales list of a Service object:

```json
{
  "query_type": "onchain_table",
  "parent": "service_object_id",
  "object_type": "Service"
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

### 7.5 documents_and_learn (Documentation and Learning Resources 📚)

**Why do we need documents_and_learn?**

When you need to learn more about WoWok, you can use this tool to get official documentation URLs. This is useful for:

- Users who want to learn how to use WoWok
- AI that needs more context to answer user questions
- Finding detailed documentation on specific topics

**Features:**

- Provide official documentation link: `https://github.com/wowok-ai/docs#`
- Support specifying topic parameters to jump directly to relevant documentation
- Return structured documentation information

---

#### Example 12: Get Documentation Home Page

Get the WoWok official documentation home page link:

```json
{}
```

Or explicitly call:

```json
{
  "topic": ""
}
```

---

#### Example 13: Get Documentation for Specific Topic

Get documentation link about Guard:

```json
{
  "topic": "guard"
}
```

Get documentation link about Service:

```json
{
  "topic": "service"
}
```

---

### 7.6 Messenger Message Query 💬

**⚠️ Important Note**: Messenger message queries **do not** go through `query_toolkit`; you need to use the dedicated **messenger_operation** tool.

**How to Query Messenger Messages:**

Use the `messenger_operation` tool, specifying `operation` as `"watch_messages"` or `"watch_conversations"`.

---

#### Example 14: View Conversation List

```json
{
  "operation": "watch_conversations",
  "account": "my_account"
}
```

---

#### Example 15: View Message History

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

### Exercise 7: Get Documentation Link

Get WoWok official documentation link:

```json
{}
```

Get documentation about a specific topic:

```json
{
  "topic": "guard"
}
```

---

## 🏆 Stage Checklist

Congratulations on reaching the final stage! Please confirm that you have:

- [ ] Understood the differences and uses of the four query tools
- [ ] Used query_toolkit to query account list
- [ ] Used query_toolkit to query account balance
- [ ] Used onchain_events to query on-chain events
- [ ] Used wowok_buildin_info to query protocol information
- [ ] Used documents_and_learn to get documentation links
- [ ] Used messenger_operation to query Messenger messages
- [ ] Understood how to query various data

---

## 🎉 Congratulations!

You have completed Stage 7! Now you have mastered WoWok's data query capabilities and are ready to move on to the final stage to explore practical examples!

**[→ Go to Stage 8: Practical Examples 🚀 →](stage-08-query.md)

---

**[← Return to Main Directory](../README.md)**

---