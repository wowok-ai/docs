# Wowok Query Complete Technical Reference

## Overview

Wowok Query is a comprehensive querying system for the Wowok protocol that provides multiple specialized query tools for retrieving on-chain data, local information, protocol metadata, and various object states. This document provides complete technical specifications for all available query operations.

## Table of Contents

1. [Objects Query](#objects-query)
2. [Local Query](#local-query)
3. [Table Items Query](#table-items-query)
4. [Table Item Query](#table-item-query)
5. [Events Query](#events-query)
6. [Personal Information Query](#personal-information-query)
7. [Permissions Query](#permissions-query)
8. [Received Objects Query](#received-objects-query)
9. [Wowok Protocol Query](#wowok-protocol-query)
10. [Common Parameters](#common-parameters)

---

## Objects Query

**Purpose**: Retrieves detailed on-chain content of specified Wowok objects.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `objects` | array[string] | Yes | - | List of Wowok object addresses or names |
| `session` | object | No | - | Network session configuration |
| `no_cache` | boolean | No | false | Whether to bypass local cache |

### Session Object Structure

```json
{
  "network": "sui mainnet" | "sui testnet" | "wowok mainnet" | "wowok testnet",
  "retentive": "always" | "session"  // Default: "always"
}
```

### Usage Examples

```json
{
  "objects": ["0x123abc...", "repository_name"],
  "session": {
    "network": "sui testnet",
    "retentive": "session"
  },
  "no_cache": true
}
```

### Return Data

Returns detailed on-chain content data (excluding table data) for each queried object.

---

## Local Query

**Purpose**: Queries local accounts, address marks, and personal information stored on device.

### Query Types

#### 1. Account List Query

```json
{
  "query": {
    "name": "account_list",
    "data": {
      "showSuspendedAccount": boolean  // Default: false
    }
  }
}
```

#### 2. Account Detail Query

```json
{
  "query": {
    "name": "account",
    "data": {
      "name_or_address": string,  // Optional, undefined means default account
      "balance_or_coin": "balance" | "coin",
      "token_type": string,  // Optional, defaults to platform token
      "session": SessionObject
    }
  }
}
```

#### 3. Info List Query

```json
{
  "query": {
    "name": "info_list",
    "data": {}
  }
}
```

#### 4. Info Detail Query

```json
{
  "query": {
    "name": "info",
    "data": {
      "name": string  // Default: "Address of delivery"
    }
  }
}
```

#### 5. Mark List Query

```json
{
  "query": {
    "name": "mark_list",
    "data": {
      "address": string,  // Optional filter
      "name": string,     // Optional filter
      "tags": array[string]  // Optional filter
    }
  }
}
```

#### 6. Mark Detail Query

```json
{
  "query": {
    "name": "mark",
    "data": {
      "name": string  // Required mark name
    }
  }
}
```

---

## Table Items Query

**Purpose**: Retrieves paginated table data records from Wowok on-chain objects.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `parent` | string | Yes | - | Address or name of the object that owns the table |
| `cursor` | string\|null | No | null | Paging cursor for pagination |
| `limit` | number\|null | No | 50 | Maximum items returned per page |
| `session` | object | No | - | Network session configuration |
| `no_cache` | boolean | No | false | Whether to bypass local cache |

### Supported Object Types

- **Permission**: Entity addresses, permission lists, Guard constraints
- **Machine**: Node entries with names, operation paths, metadata
- **Treasury**: Financial transaction records with timestamps
- **Repository**: Stored data entries with type-coded fields
- **Service**: Product items with names, prices, stock quantities
- **Progress**: Workflow node entries with session logs
- **Arb**: Arbitration vote entries with voter addresses and weights
- **PersonalMark**: Address entries with names and tags
- **Demand**: Records with timestamps and entity details

### Usage Example

```json
{
  "parent": "treasury_address",
  "cursor": "eyJsYXN0X2l0ZW1faWQiOiIxMjMifQ==",
  "limit": 100,
  "session": {
    "network": "sui mainnet"
  },
  "no_cache": false
}
```

---

## Table Item Query

**Purpose**: Retrieves specific table data items from Wowok on-chain objects.

### Query Types by Object Type

#### 1. Treasury Query

```json
{
  "query": {
    "name": "treasury",
    "data": {
      "parent": string,  // Treasury object address
      "index": number,   // Auto-incrementing index starting at 0
      "session": SessionObject,
      "no_cache": boolean
    }
  }
}
```

#### 2. Service Query

```json
{
  "query": {
    "name": "service",
    "data": {
      "parent": string,  // Service object address or name
      "name": string,    // Product name
      "session": SessionObject,
      "no_cache": boolean
    }
  }
}
```

#### 3. Arbitration Query

```json
{
  "query": {
    "name": "arb",
    "data": {
      "parent": string,  // Arb object address or name
      "address": string, // Voter address
      "session": SessionObject,
      "no_cache": boolean
    }
  }
}
```

#### 4. Repository Query

```json
{
  "query": {
    "name": "repository",
    "data": {
      "parent": string,           // Repository object address or name
      "address": string|number,   // Data owner address or number
      "name": string,             // Data field name
      "session": SessionObject,
      "no_cache": boolean
    }
  }
}
```

#### 5. Other Object Queries

Similar patterns for: `demand`, `machine`, `personalmark`, `permission`, `progress`

```json
{
  "query": {
    "name": "demand|machine|personalmark|permission|progress",
    "data": {
      "parent": string,
      "address|name|index": string|number,  // Query key varies by type
      "session": SessionObject,
      "no_cache": boolean
    }
  }
}
```

---

## Events Query

**Purpose**: Retrieves paginated on-chain event data for the Wowok protocol.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | string | Yes | - | Event type to query |
| `cursor` | object\|null | No | null | Event retrieval cursor |
| `limit` | number\|null | No | 50 | Maximum items per page |
| `order` | string\|null | No | "ascending" | Query result ordering |
| `session` | object | No | - | Network session configuration |

### Event Types

- `OnNewArb`: New arbitration request created
- `OnPresentService`: New service recommended to Demand
- `OnNewProgress`: New task progress record created
- `OnNewOrder`: New order created

### Cursor Object Structure

```json
{
  "eventSeq": string,  // Event sequence
  "txDigest": string   // Transaction digest
}
```

### Usage Example

```json
{
  "type": "OnNewOrder",
  "cursor": {
    "eventSeq": "12345",
    "txDigest": "0xabc123..."
  },
  "limit": 100,
  "order": "descending",
  "session": {
    "network": "sui mainnet"
  }
}
```

---

## Personal Information Query

**Purpose**: Queries on-chain personal data by name, account, or address.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `address` | object | Yes | - | Personal address to query |
| `session` | object | No | - | Network session configuration |
| `no_cache` | boolean | No | false | Whether to bypass local cache |

### Address Object Structure

```json
{
  "name_or_address": string,     // Account name or address
  "local_mark_first": boolean    // Search local marks first
}
```

### Usage Example

```json
{
  "address": {
    "name_or_address": "user_account",
    "local_mark_first": true
  },
  "session": {
    "network": "sui testnet"
  },
  "no_cache": false
}
```

---

## Permissions Query

**Purpose**: Queries permission list for a specific address from on-chain Permission object.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `permission_object` | string | Yes | - | Permission object address or name |
| `address` | object | Yes | - | Address to query permissions for |
| `session` | object | No | - | Network session configuration |

### Usage Example

```json
{
  "permission_object": "permission_addr",
  "address": {
    "name_or_address": "0x123...",
    "local_mark_first": false
  },
  "session": {
    "network": "sui mainnet"
  }
}
```

---

## Received Objects Query

**Purpose**: Retrieves list of ReceivedObject objects received by Treasury or Order.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `object` | string | Yes | - | Treasury or Order object address/name |
| `cursor` | string\|null | No | null | Paging cursor |
| `limit` | number\|null | No | 50 | Maximum items per page |
| `session` | object | No | - | Network session configuration |

---

## Wowok Protocol Query

**Purpose**: Retrieves protocol metadata including built-in permissions and guard queries.

### Query Types

#### 1. Built-in Permissions Query

```json
{
  "built_in_permissions": {
    "module": ["repository", "service", "demand", ...] | "all"
  }
}
```

#### 2. Guard Queries Query

```json
{
  "queries_for_guard": {
    "module": ["permission", "repository", "entity", ...] | "all"
  }
}
```

### Supported Modules

**For Built-in Permissions:**
- repository
- service  
- demand
- machine
- progress
- treasury
- arbitration

**For Guard Queries:**
- permission
- repository
- entity
- demand
- service
- order
- machine
- progress
- wowok
- payment
- treasury
- arbitration
- arb

---

## Common Parameters

### Session Object (Used across all queries)

```json
{
  "network": "sui mainnet" | "sui testnet" | "wowok mainnet" | "wowok testnet",
  "retentive": "always" | "session"
}
```

- **network**: Target blockchain network
- **retentive**: Session persistence mode
  - `"always"`: All device sessions use same network
  - `"session"`: Current program uses same network

### Address Object (Used in multiple queries)

```json
{
  "name_or_address": string,     // Account name or blockchain address
  "local_mark_first": boolean    // Search strategy preference
}
```

- **name_or_address**: Can be a human-readable name or hex address
- **local_mark_first**: When true, searches local marks before accounts

---

## Data Types and Constraints

### Common Data Types

- **string**: UTF-8 text, minimum length often 1 character
- **number**: Integer values, ranges specified per parameter
- **boolean**: true/false values
- **array**: Ordered collections of specified types
- **object**: Structured data with defined properties

### Address Formats

- Hex addresses: `0x` followed by hexadecimal characters
- Named addresses: Human-readable strings from local marks
- Account names: Local account identifiers

### Pagination

- **cursor**: Opaque pagination token (string or object)
- **limit**: Positive integer, typically defaults to 50
- **order**: `"ascending"` (oldest first) or `"descending"` (newest first)

---

## Error Handling

### Common Error Scenarios

1. **Invalid Object Address**: Object not found or inaccessible
2. **Network Connectivity**: Blockchain network unreachable
3. **Permission Denied**: Insufficient access rights
4. **Invalid Parameters**: Malformed or missing required parameters
5. **Cache Issues**: Local cache corruption or inconsistency

### Best Practices

1. Always validate addresses before querying
2. Use appropriate cache settings for your use case
3. Handle pagination correctly for large datasets
4. Implement retry logic for network failures
5. Validate returned data structure before processing

---

## Performance Considerations

### Optimization Tips

1. **Caching**: Use cache when data freshness isn't critical
2. **Pagination**: Use appropriate limit values (50-200 recommended)
3. **Parallel Queries**: Batch multiple independent queries
4. **Network Selection**: Use testnet for development
5. **Local Queries**: Prefer local queries when possible

### Rate Limits

- No explicit rate limits mentioned in specifications
- Implement reasonable delays between requests
- Consider batch operations for bulk data retrieval

---

## Examples Collection

### Basic Object Query

```json
{
  "objects": ["service_address"],
  "session": {"network": "sui testnet"}
}
```

### Local Account Information

```json
{
  "query": {
    "name": "account",
    "data": {
      "balance_or_coin": "balance",
      "session": {"network": "sui testnet"}
    }
  }
}
```

### Service Product Query

```json
{
  "query": {
    "name": "service", 
    "data": {
      "parent": "service_name",
      "name": "product_name"
    }
  }
}
```

### Event History Query

```json
{
  "type": "OnNewOrder",
  "limit": 10,
  "order": "descending",
  "session": {"network": "sui mainnet"}
}
```

This comprehensive reference covers all available Wowok Query operations with complete parameter specifications, usage examples, and technical details.

---

## Object-Specific Query Capabilities

This section provides standardized query documentation for each Wowok object type, designed to be copied to individual object documentation.

### Permission Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**
• `builder` - The permission object creator address
• `admin` - List of administrator addresses  
• `description` - Permission object description
• `biz_permission` - Custom permission definitions (index ≥1000)
• Permission entity table with entity addresses and their permission sets

**Table Item Fields (per entity):**
• `entity_address` - The address that has permissions
• `permissions` - Array of permission indices (built-in + custom)
• `guard_constraints` - Optional Guard object address for additional verification

**Built-in Permission Modules:**
• `repository` - Repository operation permissions
• `service` - Service management permissions  
• `demand` - Demand object permissions
• `machine` - Machine workflow permissions
• `progress` - Progress execution permissions
• `treasury` - Financial operation permissions
• `arbitration` - Arbitration process permissions

**How to Query:**

• **Object Query** - Understand the permission hierarchy, administrator structure, and overall access control configuration
• **Table Items Query** - Paginate through all entities and see who has what permissions for permission auditing
• **Table Item Query** - Check specific access rights with an entity address to see exactly what permissions that entity possesses
• **Protocol Query** - Understand what built-in permissions are available across different modules of the Wowok ecosystem

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete permission object metadata, admin list, builder info | `objects`, `session`, `no_cache` | Understand permission structure, audit administrator access, check permission hierarchy |
| **Table Items Query** | Paginated list of all entities with their permission sets | `parent`, `limit`, `cursor`, `session` | Permission auditing, access review, compliance checking |
| **Table Item Query** | Specific entity's complete permission details and constraints | `parent`, `address`, `session` | Check user permissions, validate access rights, troubleshoot authorization |
| **Protocol Query** | Built-in permission definitions by module | `module`, `built_in_permissions` | Understand available permissions, design access controls, reference permission capabilities |

**Special Features:**
- **Administrator Hierarchy**: Query builder and admin relationships
- **Guard Constraints**: See additional verification requirements for permissions
- **Module-specific Permissions**: Access built-in permissions for each protocol module
- **Custom Permissions**: View user-defined permissions (index ≥1000)

**Sample Query Prompts:**
- "Please show me the complete permission structure for permission_name including all administrators"
- "List all entities that have permissions in this permission object, showing their access levels"
- "Check what specific permissions entity address 0x123... has in the system"
- "Show me all built-in permissions available for the treasury and service modules"
- "Audit all permission assignments in permission_addr to verify access controls"
- "Retrieve the permission details for user_account to troubleshoot their access issues"

---

### Machine Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**
• `description` - Machine workflow description and purpose
• `bPublished` - Whether the Machine is published and can create Progress instances
• `bPaused` - Whether new Progress creation is temporarily paused
• `consensus_repository` - List of Repository objects for data sharing
• `endpoint` - HTTPS endpoint for process operations view
• `permission` - Associated Permission object address

**Node Definition Fields (per node name):**
• `node_name` - Unique identifier for workflow node
• `pairs` - List of operation paths from prior nodes
• `prior_node` - Previous node name (empty string for initial node)
• `threshold` - Weight threshold to proceed to this node
• `forwards` - Available operations to next nodes

**Operation Path Fields (per forward operation):**
• `name` - Operation identifier between nodes
• `permission` - Required permission index for operation
• `namedOperator` - Permission namespace for operators
• `guard` - Guard verification requirement
• `order_ids` - Supplier order commitment IDs in Guard
• `weight` - Operation weight for threshold calculation

**Progress Creation Events:**
• `progress_address` - New Progress instance address  
• `machine_address` - Source Machine template address
• `creation_timestamp` - When Progress was created
• `task_address` - Associated task object (e.g., Order)

**How to Query:**

• **Object Query** - Understand the complete workflow design, publication status, and overall machine configuration including consensus repositories and permissions
• **Table Items Query** - Browse all workflow nodes and see the complete process structure for workflow analysis
• **Table Item Query** - Examine specific workflow steps with a node name to see detailed operation definitions, prior node connections, and transition requirements
• **Events Query** - Monitor when new Progress instances are created from this Machine template

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete machine metadata, publication status, consensus repositories | `objects`, `session`, `no_cache` | Understand workflow architecture, check machine configuration, verify publication status |
| **Table Items Query** | Paginated list of all workflow nodes with their connections | `parent`, `limit`, `cursor`, `session` | Workflow analysis, process mapping, node relationship exploration |
| **Table Item Query** | Specific node details including operations, thresholds, prior connections | `parent`, `name`, `session` | Examine workflow steps, understand node transitions, analyze operation requirements |
| **Events Query** | New Progress instances created from this Machine | `type`, `limit`, `order`, `session` | Track workflow usage, monitor process instances, audit machine utilization |

**Special Features:**
- **Workflow Orchestration**: See complete node-to-node operation paths and transition logic
- **Permission Namespaces**: Query named operator permissions for different workflow instances
- **Guard Integration**: View Guard verification requirements for workflow operations
- **Consensus Repositories**: Access shared data repositories used by workflow processes

**Sample Query Prompts:**
- "Please show me the complete workflow design for machine_name including all nodes and their connections"
- "List all workflow nodes in this machine to understand the process flow"
- "Query the 'order_confirmation' node details to see what operations and thresholds are defined"
- "Show me recent Progress instances created from this Machine to see how it's being used"
- "Examine the workflow transition from 'payment_received' to 'order_processing' nodes"
- "Check if this Machine is published and ready for creating new Progress instances"

---

### Treasury Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**
• `token_type` - The specific token type managed by this Treasury
• `balance` - Current treasury balance
• `withdraw_mode` - Withdrawal permission mode (0=Permission, 1=Guard, 2=Both)
• `withdraw_guard` - List of Guard objects and maximum withdrawal amounts
• `deposit_guard` - Optional Guard for deposit verification
• `description` - Treasury description and purpose
• `permission` - Associated Permission object address

**Transaction Record Fields (per index):**
• `operation_code` - Transaction type (DEPOSIT, WITHDRAW, etc.)
• `operator` - Address that initiated the transaction
• `payment_address` - Payment object address with transaction details  
• `amount` - Transaction amount in treasury tokens
• `timestamp` - When the transaction occurred
• `index` - Sequential transaction number
• `remark` - Transaction description/purpose
• `for_object` - Related object address (if applicable)
• `for_guard` - Guard verification purpose (if applicable)

**ReceivedObject Fields:**
• `received_object_id` - Unique identifier for pending payment
• `sender_address` - Who sent the payment
• `amount` - Amount waiting to be deposited
• `token_type` - Token type of the received payment

**How to Query:**

• **Object Query** - Understand the treasury's token type, withdrawal permissions, guard configurations, and overall financial structure
• **Table Items Query** - Paginate through all transaction records and see the complete financial history for financial auditing
• **Table Item Query** - Investigate specific transactions with a transaction index to get detailed information including operator, amounts, timestamps, and payment purposes
• **Received Query** - See pending payments that have been sent to the treasury but not yet deposited

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete treasury metadata, token type, withdrawal modes, guard settings | `objects`, `session`, `no_cache` | Understand financial structure, audit treasury configuration, check access controls |
| **Table Items Query** | Paginated financial transaction history with full details | `parent`, `limit`, `cursor`, `session` | Financial auditing, transaction analysis, compliance reporting |
| **Table Item Query** | Specific transaction details by sequential index | `parent`, `index`, `session` | Investigate specific transactions, verify payment details, audit financial operations |
| **Received Query** | Pending ReceivedObject instances awaiting processing | `object`, `limit`, `cursor`, `session` | Monitor incoming payments, process pending deposits, track payment processing |

**Special Features:**
- **Financial Transaction Tracking**: Complete audit trail with operator, amount, timestamp, and purpose
- **Multi-mode Withdrawals**: Query both permission-based and Guard-based withdrawal configurations
- **Payment Purpose Tracking**: See detailed business context for each transaction
- **Pending Payment Processing**: Monitor and process incoming ReceivedObject instances

**Sample Query Prompts:**
- "Please show me the complete treasury configuration for treasury_name including withdrawal permissions and guards"
- "List the latest 50 financial transactions in this treasury to review recent activity"
- "Query transaction #25 details to see who made the payment and for what purpose"
- "Show me all pending ReceivedObject instances that need to be processed into this treasury"
- "Audit all deposit transactions in treasury_addr to verify incoming payments"
- "Check the withdrawal transaction history to see how funds have been distributed"

---

### Repository Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**
• `description` - Repository purpose and description
• `mode` - Policy enforcement mode (0=Open, 1=Strict policy only)
• `policy` - Consensus policy definitions for data fields
• `reference` - List of objects that use this Repository
• `guard` - Optional Guard for data access verification
• `permission` - Associated Permission object address

**Policy Definition Fields:**
• `key` - Data field name (e.g., "medical_record", "credit_score")
• `description` - Field meaning and purpose
• `dataType` - Data type code (200=address, 202=number, 204=string, etc.)
• `permissionIndex` - Required permission for writing this field
• `guard` - Additional Guard verification for this field

**Data Entry Fields (per address + field name):**
• `data_fields` - The actual stored data (type-coded)
• `searchable_address` - Data owner address (or timestamp for time-series)
• `field_name` - Policy-defined field name
• `data_type` - Wowok protocol data type identifier

**Supported Data Types:**
• `200` - Address data
• `201` - Address vector data  
• `202` - Positive number data
• `203` - Positive number vector data
• `204` - String data
• `205` - String vector data
• `206` - Boolean data

**How to Query:**

• **Object Query** - Get the full Repository details including all policy definitions and data organization rules
• **Table Items Query** - Paginate through all data entries across different addresses and field names for exploring stored data
• **Table Item Query** - Provide the data owner's address (or timestamp for time-based data) and the exact field name as defined in the repository's consensus policy
• **Guard Query** - Validate data access conditions and permissions

**Note:** Repository queries support both standard blockchain addresses and numerical timestamps converted to addresses for time-series data storage.

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete repository metadata, policy definitions, consensus rules | `objects`, `session`, `no_cache` | Get repository structure, understand data organization, check policy settings |
| **Table Items Query** | Paginated list of all data entries across all addresses and fields | `parent`, `limit`, `cursor`, `session` | Browse all stored data, explore repository contents, data discovery |
| **Table Item Query** | Specific data entry by address and field name | `parent`, `address`, `name`, `session` | Retrieve user medical records, get specific consensus data, access time-series data |
| **Guard Query** | Validation of data access conditions and permissions | `guard_object`, `witness`, `session` | Verify data access rights, validate policy compliance |

**Special Features:**
- **Time-based Queries**: Use Unix timestamps as addresses (e.g., 1640995200 for hourly data)
- **Consensus Data**: Access verified data through policy-defined field names
- **Cross-referencing**: Query data relationships between different addresses and fields
- **Policy Validation**: Check data type compliance and access permissions

**Sample Query Prompts:**
- "Please query the complete repository configuration for repository_name to understand its data policies"
- "Show me all medical records stored in the healthcare repository, paginated with 50 entries per page"
- "Retrieve the 'diagnosis' field data for patient address 0x123... from the medical repository"
- "Get hourly diving recommendations for January 1st, 2022 (timestamp 1640995200) from the diving_data repository"
- "List all data entries in the insurance repository to see what information is available"
- "Query the 'credit_score' field for user 0xabc... in the financial_data repository"

---

### Service Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Service description and purpose |
| `bPublished` | boolean | Whether service is published and can accept orders |
| `bPaused` | boolean | Whether new order creation is paused |
| `machine` | address | Associated Machine object for workflow |
| `buy_guard` | address | Guard verification required for purchases |
| `arbitration` | array | List of Arbitration objects for dispute resolution |
| `repository` | array | Consensus Repository objects for data sharing |
| `withdraw_guard` | array | Guard objects and rates for fund withdrawals |
| `refund_guard` | array | Guard objects for refund processing |
| `extern_withdraw_treasury` | array | External Treasury objects for incentives |
| `payee_treasury` | address | Treasury for receiving payments |
| `customer_required_info` | object | Required customer information and encryption |
| `endpoint` | string | HTTPS endpoint for product browsing |
| `location` | string | Service location or coordinates |
| `permission` | address | Associated Permission object |

**Product Catalog Fields (per product name):**

| Field | Type | Description |
|-------|------|-------------|
| `item` | string | Product/service name |
| `price` | number | Product price in service tokens |
| `stock` | number | Available inventory quantity |
| `endpoint` | string | Product-specific information endpoint |

**Order Creation Events:**

| Field | Type | Description |
|-------|------|-------------|
| `order_address` | address | New Order object address |
| `service_address` | address | Source Service object |
| `buyer_address` | address | Customer who placed the order |
| `total_amount` | number | Total order amount |
| `items_purchased` | array | List of purchased items and quantities |
| `creation_timestamp` | number | When order was created |

**How to Query:**

• **Object Query** - Understand the service structure, publication status, machine workflows, guard requirements, and arbitration commitments before making purchase decisions
• **Table Items Query** - Browse all available products and see pricing, inventory, and availability for product discovery
• **Table Item Query** - Examine specific products with a product name to get detailed specifications, pricing, stock levels, and endpoint information
• **Events Query** - Monitor Order creation activity and track service usage patterns

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete service metadata, workflow machine, guards, arbitration setup | `objects`, `session`, `no_cache` | Understand service structure, verify commitments, check publication status |
| **Table Items Query** | Paginated product catalog with pricing and inventory | `parent`, `limit`, `cursor`, `session` | Product discovery, catalog browsing, inventory checking |
| **Table Item Query** | Specific product details including price, stock, endpoint | `parent`, `name`, `session` | Product research, pricing verification, availability checking |
| **Events Query** | New Order creation events for this service | `type`, `limit`, `order`, `session` | Monitor service usage, track customer activity, analyze demand patterns |

**Special Features:**
- **Service Commitments**: Query workflow machines, arbitration objects, and treasury incentives
- **Purchase Requirements**: See buy guards and customer information requirements
- **Product Catalog**: Complete product listings with real-time inventory and pricing
- **Order Tracking**: Monitor new orders and customer purchase activity

**Sample Query Prompts:**
- "Please show me the complete service configuration for service_name including workflow and arbitration commitments"
- "List all available products in this service to see the catalog and pricing"
- "Query the 'premium_flowers' product details to check price, stock, and delivery information"
- "Show me recent orders created for this service to understand customer activity"
- "Check the service workflow machine and arbitration setup before making a purchase"
- "Browse all products in service_addr to compare options and pricing"

---

### Progress Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `current_node` | string | Current workflow node position |
| `machine_address` | address | Source Machine template |
| `task_address` | address | Associated task object (e.g., Order) |
| `context_repository` | address | Repository for shared workflow data |
| `namedOperator` | object | Permission namespace operators |
| `session_count` | number | Total number of workflow sessions |

**Session Record Fields (per index):**

| Field | Type | Description |
|-------|------|-------------|
| `prev_node` | string | Previous workflow node |
| `next_node` | string | Next workflow node |
| `operator_address` | address | Who performed the operation |
| `operation_name` | string | Name of the operation performed |
| `timestamp` | number | When the operation occurred |
| `deliverable` | string | Operation deliverables/remarks |
| `session_index` | number | Sequential session number |
| `hold_status` | boolean | Whether operation is held |
| `session_logs` | array | Detailed operation logs |

**Progress Creation Events:**

| Field | Type | Description |
|-------|------|-------------|
| `progress_address` | address | New Progress instance address |
| `machine_address` | address | Source Machine template |
| `creator_address` | address | Who created the Progress |
| `task_address` | address | Associated task object |
| `creation_timestamp` | number | When Progress was created |

**How to Query:**

• **Object Query** - Understand the progress state, current workflow position, associated Machine template, and task relationships
• **Table Items Query** - Paginate through all execution sessions and see the complete workflow progression history for workflow tracking
• **Table Item Query** - Investigate specific workflow steps with a session index to get detailed information about operator actions, timestamps, and deliverables
• **Events Query** - Monitor when new Progress instances are created across all Machine templates

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete progress metadata, current state, machine reference, task info | `objects`, `session`, `no_cache` | Track workflow status, understand current position, check task associations |
| **Table Items Query** | Paginated workflow execution history with all session details | `parent`, `limit`, `cursor`, `session` | Workflow monitoring, execution analysis, progress tracking |
| **Table Item Query** | Specific session details including operator, timestamp, deliverables | `parent`, `index`, `session` | Investigate workflow steps, audit operator actions, verify deliverables |
| **Events Query** | New Progress instances created across all machines | `type`, `limit`, `order`, `session` | Monitor system activity, track new workflows, analyze usage patterns |

**Special Features:**
- **Workflow State Tracking**: See current node position and execution progress
- **Operator Activity Logs**: Complete audit trail of who did what and when
- **Task Association**: Link to specific tasks (like orders) that triggered the workflow
- **Machine Template Reference**: Connect back to the original Machine that defined the workflow

**Sample Query Prompts:**
- "Please show me the current workflow state for progress_name including which node it's on"
- "List all execution sessions in this progress to see the complete workflow history"
- "Query session #8 details to see what the operator did and what deliverables were provided"
- "Show me recent Progress instances created across all machines to monitor system activity"
- "Track the workflow progression in progress_addr to see how the process is advancing"
- "Check which operators have been involved in this workflow and what actions they took"

---

### Arbitration Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Arbitration service description |
| `bPaused` | boolean | Whether arbitration applications are paused |
| `fee` | number | Cost of initiating arbitration (0 = free) |
| `fee_treasury` | address | Treasury for collecting arbitration fees |
| `guard` | address | Guard verification for arbitration applications |
| `voting_guard` | array | List of Guard objects and voting weights |
| `endpoint` | string | HTTPS endpoint for arbitration information |
| `permission` | address | Associated Permission object |

**Voting Configuration Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `guard_address` | address | Guard object for voting verification |
| `voting_weight` | number | Weight assigned to this Guard's verification |

**Arb Creation Events:**

| Field | Type | Description |
|-------|------|-------------|
| `arb_address` | address | New Arb dispute object address |
| `arbitration_address` | address | Source Arbitration service |
| `order_address` | address | Disputed Order object |
| `applicant_address` | address | Who filed the dispute |
| `description` | string | Dispute description |
| `votable_proposition` | array | List of claims for arbitration |
| `max_fee` | number | Maximum fee paid for arbitration |
| `creation_timestamp` | number | When dispute was filed |

**Guard Query Modules:**
• `arbitration` - Arbitration object verification queries
• `arb` - Arb dispute object verification queries

**How to Query:**

• **Object Query** - Understand the arbitration structure, fee requirements, voting configurations, and pause status
• **Events Query** - Track when new Arb instances are created and see overall arbitration system usage for monitoring dispute activity
• **Protocol Query** - Understand what Guard conditions and verification options are available for arbitration processes
• **Permission Query** - Verify which addresses have arbitrator permissions and what their voting weights are in the system

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete arbitration metadata, fees, voting guards, treasury settings | `objects`, `session`, `no_cache` | Understand arbitration structure, check fees, verify voting requirements |
| **Events Query** | New Arb instance creation events across the system | `type`, `limit`, `order`, `session` | Monitor dispute activity, track arbitration usage, analyze system load |
| **Protocol Query** | Guard query definitions for arbitration and Arb modules | `module`, `queries_for_guard` | Understand verification options, design dispute processes, configure Guards |
| **Permission Query** | Arbitrator permissions and voting weights | `permission_object`, `address`, `session` | Verify arbitrator status, check voting weights, audit arbitration permissions |

**Special Features:**
- **Fee Structure**: Query arbitration costs and treasury configurations
- **Voting Guards**: See what verification is required for arbitrators
- **Dispute Tracking**: Monitor Arb creation across all arbitration objects
- **Permission Verification**: Check arbitrator qualifications and voting weights

**Sample Query Prompts:**
- "Please show me the arbitration configuration for arbitration_name including fees and voting requirements"
- "Monitor recent arbitration requests (Arb objects) created in the system to see dispute activity"
- "Check what Guard query options are available for arbitration processes"
- "Verify if address 0x123... has arbitrator permissions and what their voting weight is"
- "Show me the fee structure and treasury settings for this arbitration service"
- "Track dispute creation patterns to understand arbitration system usage"

---

### Arb Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `order_address` | address | Disputed Order object |
| `arbitration_address` | address | Arbitration service handling the dispute |
| `machine_address` | address | Associated Machine for workflow |
| `progress_address` | address | Progress tracking workflow execution |
| `service_address` | address | Service object related to the dispute |
| `description` | string | Detailed dispute description |
| `votable_proposition` | array | Claims being arbitrated |
| `feedback` | string | Final arbitration feedback/conclusion |
| `indemnity` | number | Compensation amount (if determined) |
| `status` | string | Current arbitration status |

**Voting Records (per voter address):**

| Field | Type | Description |
|-------|------|-------------|
| `voter_address` | address | Arbitrator who cast the vote |
| `voting_weight` | number | Weight of this arbitrator's vote |
| `claim_list` | array | Which claims this arbitrator supported |
| `voting_timestamp` | number | When the vote was cast |
| `guard_verification` | address | Guard used for voting verification |

**Arbitration Events:**

| Field | Type | Description |
|-------|------|-------------|
| `arb_address` | address | Arb dispute object address |
| `event_type` | string | Type of arbitration event |
| `participant_address` | address | Address involved in the event |
| `timestamp` | number | When the event occurred |
| `details` | string | Additional event information |

**How to Query:**

• **Object Query** - Understand the dispute context, involved parties, claims being arbitrated, and current status
• **Table Items Query** - See all arbitrator votes and their decisions on the various claims for voting analysis
• **Table Item Query** - Examine specific arbitrator positions with a voter address to see their detailed voting record, voting weight, and which claims they supported
• **Events Query** - Monitor new arbitration cases being filed across all Arbitration objects

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete dispute details, claims, order info, arbitration status | `objects`, `session`, `no_cache` | Understand dispute context, check arbitration progress, review claims |
| **Table Items Query** | Paginated voting records from all arbitrators | `parent`, `limit`, `cursor`, `session` | Analyze voting patterns, review arbitrator decisions, audit voting process |
| **Table Item Query** | Specific arbitrator's voting decision and supported claims | `parent`, `address`, `session` | Check individual votes, verify arbitrator positions, investigate voting decisions |
| **Events Query** | New Arb creation events across all arbitration objects | `type`, `limit`, `order`, `session` | Monitor dispute filing activity, track system usage, analyze dispute trends |

**Special Features:**
- **Voting Transparency**: Complete record of who voted for what claims
- **Claim Analysis**: See which specific claims are being disputed and supported
- **Voting Weights**: Understand the influence of different arbitrators
- **Dispute Resolution**: Track arbitration outcomes and compensation decisions

**Sample Query Prompts:**
- "Please show me the complete dispute details for arb_name including all claims and current status"
- "List all arbitrator voting records in this dispute to see how the decision is being made"
- "Check how arbitrator 0x123... voted on this dispute and which claims they supported"
- "Monitor recent arbitration cases filed across the system to see dispute trends"
- "Analyze the voting pattern in arb_addr to understand the arbitration outcome"
- "Show me which claims have the most arbitrator support in this dispute case"

---

### Demand Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Demand requirements and description |
| `bounty` | object | Reward pool for service recommendations |
| `time_expire` | number | Bounty pool expiration timestamp |
| `guard` | address | Guard verification for recommenders |
| `service_id_in_guard` | number | Service ID requirement in Guard verification |
| `location` | string | Geographic location or coordinates |
| `permission` | address | Associated Permission object |

**Recommendation Records (per recommender address):**

| Field | Type | Description |
|-------|------|-------------|
| `recommender_address` | address | Who recommended the service |
| `service_address` | address | Service object that was recommended |
| `recommend_words` | string | Recommendation description/reasoning |
| `timestamp` | number | When recommendation was made |
| `associated_entity` | address | Related entity details |

**Service Presentation Events:**

| Field | Type | Description |
|-------|------|-------------|
| `demand_address` | address | Demand object receiving the presentation |
| `service_address` | address | Service being presented |
| `presenter_address` | address | Who presented the service |
| `presentation_timestamp` | number | When service was presented |
| `recommendation_details` | string | Presentation content |

**Bounty Pool Information:**

| Field | Type | Description |
|-------|------|-------------|
| `total_value` | number | Total bounty pool value |
| `token_type` | string | Type of tokens in bounty pool |
| `expiration_time` | number | When bounty expires |
| `distribution_status` | string | Whether bounty has been distributed |

**How to Query:**

• **Object Query** - Understand the demand requirements, guard restrictions, bounty pool settings, and expiration times
• **Table Items Query** - See all services that have been recommended and their presentation details for recommendation analysis
• **Table Item Query** - Examine specific recommendations with a recommender address to see their recommendation history and details
• **Events Query** - Monitor service presentation activity across all Demand objects in the system

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete demand metadata, requirements, guard settings, bounty pool | `objects`, `session`, `no_cache` | Understand service requirements, check bounty rewards, verify guard restrictions |
| **Table Items Query** | Paginated service recommendation records with timestamps | `parent`, `limit`, `cursor`, `session` | Review service recommendations, analyze presentation activity, track recommendations |
| **Table Item Query** | Specific recommender's recommendation details and history | `parent`, `address`, `session` | Check recommendation quality, verify recommender activity, investigate presentations |
| **Events Query** | Service presentation events across all Demand objects | `type`, `limit`, `order`, `session` | Monitor recommendation activity, track system usage, analyze presentation patterns |

**Special Features:**
- **Bounty Management**: Query reward pools and expiration times for recommendations
- **Guard Requirements**: See what verification is needed to recommend services
- **Recommendation Tracking**: Complete history of who recommended what services when
- **Reward Distribution**: Track bounty pool distribution to successful recommenders

**Sample Query Prompts:**
- "Please show me the complete demand requirements for demand_name including bounty rewards and restrictions"
- "List all service recommendations made to this demand to see available options"
- "Check what services were recommended by address 0x123... and when they were presented"
- "Monitor recent service presentations across all demands to see recommendation activity"
- "Review the bounty pool and reward settings for this demand to understand incentives"
- "Show me the recommendation history for demand_addr to analyze presentation quality"

---

### PersonalMark Object Query Capabilities

**What You Can Query:**

**Object-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `owner_address` | address | Who owns this PersonalMark object |
| `description` | string | Purpose and description of the marking system |
| `total_marks` | number | Total number of marked addresses |

**Address Mark Records (per marked address):**

| Field | Type | Description |
|-------|------|-------------|
| `address` | address | The blockchain address being marked |
| `name` | string | Human-readable name assigned to the address |
| `tags` | array | Categorical tags for organization |

**Personal Information Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Information field name (e.g., "Phone", "Email") |
| `value` | string | The actual information content |
| `visibility` | string | Privacy setting for this information |

**Supported Tag Categories:**
• `business` - Business-related addresses
• `personal` - Personal contact addresses  
• `service` - Service provider addresses
• `treasury` - Financial/treasury addresses
• `contract` - Smart contract addresses
• `friend` - Friend and family addresses
• `vendor` - Vendor and supplier addresses
• `custom` - User-defined categories

**How to Query:**

• **Object Query** - Understand the personal marking system structure and overall organization approach
• **Table Items Query** - Browse all marked addresses and see how they are categorized and named for address exploration
• **Table Item Query** - Look up specific addresses to see its assigned name, tags, and organizational context
• **Personal Query** - Access additional personal information associated with marked addresses for complete identification

**Supported Query Operations:**

| Query Type | What It Returns | Key Parameters | Use Cases |
|------------|-----------------|----------------|-----------|
| **Object Query** | Complete PersonalMark metadata and organizational structure | `objects`, `session`, `no_cache` | Understand marking system, check organization approach, review structure |
| **Table Items Query** | Paginated address marks with names and tags | `parent`, `limit`, `cursor`, `session` | Browse address organization, explore marking system, discover tagged addresses |
| **Table Item Query** | Specific address mark details including name and tags | `parent`, `address`, `session` | Look up address labels, check address organization, verify address identity |
| **Personal Query** | Associated personal information for marked addresses | `address`, `session`, `no_cache` | Access personal data, complete address identification, get contact information |

**Special Features:**
- **Address Organization**: See how addresses are categorized with names and tags
- **Personal Information Integration**: Link address marks to personal data
- **Tag-based Categorization**: Organize addresses by functional or contextual categories
- **Identity Management**: Connect blockchain addresses to human-readable identities

**Sample Query Prompts:**
- "Please show me the complete address marking system for personalmark_name to understand the organization"
- "List all marked addresses to see how they are categorized and named"
- "Check the mark details for address 0x123... to see its assigned name and tags"
- "Retrieve personal information associated with marked address user_account for complete identification"
- "Browse all address marks in personalmark_addr to explore the address organization system"
- "Show me the tags and names assigned to addresses to understand the categorization approach"

---

**Usage Instructions:**
Copy the relevant object query section to the end of each object's documentation. Each section provides complete query capabilities specific to that object type, with practical examples and ready-to-use prompts for users.
