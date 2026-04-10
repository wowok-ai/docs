# WatchQuery Component (🔍 Data Query)

---

## Component Overview

The WatchQuery component is used to query local and on-chain data, including accounts, balances, objects, table data, etc.

---

## Function List

| Name | Purpose | Usage Scenario | Significance |
|------|---------|----------------|-------------|
| **Query Local Mark List** | Query local ID/user address book with optional filter | When you need to retrieve your local saved names and addresses | Quick access to locally stored address mappings |
| **Query Account List** | Query local account list with optional filter | When managing multiple local accounts | Overview of all available accounts |
| **Query Local Info List** | Query local info list with optional filter | When accessing saved private data (addresses, phone numbers) | Manage sensitive personal information locally |
| **Query Token List** | Query token list with optional filter | When exploring available token types | Understand supported token options |
| **Query Account Balance** | Query account balance for specific token type | When checking your wallet balance | Monitor financial status |
| **Query Personal Profile** | Query public on-chain personal profile | When viewing someone's public identity | Access public user information |
| **Query Objects** | Query multiple on-chain objects by ID | When retrieving object details | Batch access to on-chain data |
| **Query Table Data** | Query table data of specified object | When accessing object's table items | Retrieve structured object data |
| **Query Repository Data Item** | Query specific repository data record | When accessing stored repository policy data | Get individual data records |
| **Query Permission Perm Item** | Query specific permission record | When checking user/guard permissions | Verify access control settings |
| **Query Entity Registrar Item** | Query entity registration record | When checking on-chain entity details | Access entity registration info |
| **Query Entity Linker Item** | Query entity follow/vote record | When checking social follow relationships | View social interaction data |
| **Query Reward Record Item** | Query reward claim record | When checking reward distribution history | Track reward payouts |
| **Query Demand Presenter Item** | Query demand submission record | When checking service recommendation history | Review demand submissions |
| **Query Treasury History Item** | Query treasury transaction record | When checking financial history | Audit treasury operations |
| **Query Machine Node Item** | Query machine workflow node | When checking workflow definitions | Access workflow configurations |
| **Query Progress History Item** | Query progress execution history | When checking workflow execution logs | Review workflow history |
| **Query Address Mark Item** | Query address tag record | When checking on-chain address tags | View address labeling |
| **Query Received Objects** | Query received payments and NFTs | When checking incoming assets | Monitor received value |

---

## Schema Tree

```
query_toolkit (Query Operations)
├── query_type (discriminator, required)
│   ├── "local_mark_list"
│   │   └── filter (optional, LocalMarkFilter)
│   ├── "account_list"
│   │   └── filter (optional, AccountFilter)
│   ├── "local_info_list"
│   │   └── filter (optional, LocalInfoFilter)
│   ├── "token_list"
│   │   └── filter (optional, TokenDataFilter)
│   ├── "account_balance"
│   │   ├── account (optional, NameOrAddress)
│   │   └── token_type (optional, TokenType)
│   ├── "onchain_personal_profile"
│   │   └── account (optional, NameOrAddress)
│   ├── "onchain_objects"
│   │   └── objects (required, NameOrAddress[])
│   ├── "onchain_table"
│   │   ├── parent (required, NameOrAddress)
│   │   └── object_type (required, ObjectType)
│   ├── "onchain_table_item_repository_data"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── name (required, string)
│   │   └── entity (required, Address/number)
│   ├── "onchain_table_item_permission_perm"
│   │   ├── parent (required, NameOrAddress)
│   │   └── address (required, Address/string)
│   ├── "onchain_table_item_entity_registrar"
│   │   └── address (required, Address/string)
│   ├── "onchain_table_item_entity_linker"
│   │   └── address (required, Address/string)
│   ├── "onchain_table_item_reward_record"
│   │   ├── parent (required, NameOrAddress)
│   │   └── address (required, Address)
│   ├── "onchain_table_item_demand_presenter"
│   │   ├── parent (required, NameOrAddress)
│   │   └── address (required, Address)
│   ├── "onchain_table_item_treasury_history"
│   │   ├── parent (required, NameOrAddress)
│   │   └── address (required, Address)
│   ├── "onchain_table_item_machine_node"
│   │   ├── parent (required, NameOrAddress)
│   │   └── key (required, string)
│   ├── "onchain_table_item_progress_history"
│   │   ├── parent (required, NameOrAddress)
│   │   └── u64 (required, number/string)
│   ├── "onchain_table_item_address_mark"
│   │   ├── parent (required, NameOrAddress)
│   │   └── address (required, Address)
│   └── "onchain_received"
│       ├── object (required, string)
│       └── all_type (optional, boolean)
└── (no other top-level fields)
```

---

## Example 1: Query Local Mark List

### 📝 Natural Language Prompt

Please help me query my local mark list, filtering for marks tagged with 'friend'.

### 📋 Generated Function JSON

```json
{
  "query_type": "local_mark_list",
  "filter": {
    "tags": ["friend"]
  }
}
```

---

## Example 2: Query Account List

### 📝 Natural Language Prompt

Please help me query all my local accounts.

### 📋 Generated Function JSON

```json
{
  "query_type": "account_list"
}
```

---

## Example 3: Query Local Info List

### 📝 Natural Language Prompt

Please help me query all my locally saved information entries.

### 📋 Generated Function JSON

```json
{
  "query_type": "local_info_list"
}
```

---

## Example 4: Query Token List

### 📝 Natural Language Prompt

Please help me query the list of available token types.

### 📋 Generated Function JSON

```json
{
  "query_type": "token_list"
}
```

---

## Example 5: Query Account Balance

### 📝 Natural Language Prompt

Please help me query the WOW token balance for my account named 'alice'.

### 📋 Generated Function JSON

```json
{
  "query_type": "account_balance",
  "account": "alice",
  "token_type": "0x2::wow::WOW"
}
```

---

## Example 6: Query Personal Profile

### 📝 Natural Language Prompt

Please help me query the public on-chain personal profile for the account named 'bob'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_personal_profile",
  "account": "bob"
}
```

---

## Example 7: Query Multiple Objects

### 📝 Natural Language Prompt

Please help me query the on-chain objects with IDs 'service_marketplace' and 'treasury_main'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_objects",
  "objects": ["service_marketplace", "treasury_main"]
}
```

---

## Example 8: Query Table Data

### 📝 Natural Language Prompt

Please help me query the table data for the Service object with parent ID 'my_service'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table",
  "parent": "my_service",
  "object_type": "Service"
}
```

---

## Example 9: Query Repository Data Item

### 📝 Natural Language Prompt

Please help me query the repository data record named 'user_settings' for entity 'alice' from the repository object 'repo_main'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_repository_data",
  "parent": "repo_main",
  "name": "user_settings",
  "entity": "alice"
}
```

---

## Example 10: Query Permission Perm Item

### 📝 Natural Language Prompt

Please help me query the permission record for address 'alice' from the permission object 'perm_admin'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_permission_perm",
  "parent": "perm_admin",
  "address": "alice"
}
```

---

## Example 11: Query Entity Registrar Item

### 📝 Natural Language Prompt

Please help me query the entity registration record for address 'service_provider'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_entity_registrar",
  "address": "service_provider"
}
```

---

## Example 12: Query Entity Linker Item

### 📝 Natural Language Prompt

Please help me query the follow/vote record for address 'popular_creator'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_entity_linker",
  "address": "popular_creator"
}
```

---

## Example 13: Query Reward Record Item

### 📝 Natural Language Prompt

Please help me query the reward claim record for address 'alice' from the reward object 'reward_pool'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_reward_record",
  "parent": "reward_pool",
  "address": "alice"
}
```

---

## Example 14: Query Demand Presenter Item

### 📝 Natural Language Prompt

Please help me query the service submission record for address 'bob' from the demand object 'demand_market'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_demand_presenter",
  "parent": "demand_market",
  "address": "bob"
}
```

---

## Example 15: Query Treasury History Item

### 📝 Natural Language Prompt

Please help me query the treasury transaction record for payment ID 'payment_123' from the treasury object 'treasury_main'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_treasury_history",
  "parent": "treasury_main",
  "address": "payment_123"
}
```

---

## Example 16: Query Machine Node Item

### 📝 Natural Language Prompt

Please help me query the machine workflow node with key 'validation_step' from the machine object 'workflow_v1'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_machine_node",
  "parent": "workflow_v1",
  "key": "validation_step"
}
```

---

## Example 17: Query Progress History Item

### 📝 Natural Language Prompt

Please help me query the progress execution history record with u64 value 1 from the progress object 'order_456'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_progress_history",
  "parent": "order_456",
  "u64": 1
}
```

---

## Example 18: Query Address Mark Item

### 📝 Natural Language Prompt

Please help me query the address tag record for address 'alice' from the resource object 'address_tags'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_table_item_address_mark",
  "parent": "address_tags",
  "address": "alice"
}
```

---

## Example 19: Query Received Objects

### 📝 Natural Language Prompt

Please help me query all types of received objects for the object 'service_wallet'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_received",
  "object": "service_wallet",
  "all_type": true
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
