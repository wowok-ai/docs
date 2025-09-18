# Guard Object: Your Smart Verification Engine

> "Create automatic rules that verify conditions before allowing operations - turn business requirements into unbreakable code"

**MCP Tool**: [`wowok_guard_mcp_server`](https://www.npmjs.com/package/wowok_guard_mcp_server)

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: What Guards do and core concepts
- **[Core Parameters](#core-parameters)**: Guard creation configuration options
- **[Logic System Parameters](#logic-system-parameters)**: Detailed root field structure and parameters
- **[Data Types & Formats](#data-types--formats)**: Type codes and witness usage
- **[Integration Patterns](#integration-patterns)**: How Guards connect with other objects
- **[Complete Examples](#complete-examples)**: Advanced Guard configurations

### Navigation by Need
| I want to... | Go to section |
|--------------|---------------|
| Understand what Guards do | [Overview](#overview) |
| Create a new Guard | [Core Parameters](#core-parameters) |
| Build verification logic | [Logic System Parameters](#logic-system-parameters) |
| Work with constants and witness data | [Logic System Parameters → Table References](#6-table-references-identifier-field) |
| Check data type codes | [Data Types & Formats](#data-types--formats) |
| Connect Guards to other objects | [Integration Patterns](#integration-patterns) |
| Find complete working configurations | [Complete Examples](#complete-examples) |

---

## Overview

### Definition
Guards are immutable verification engines that return true or false based on configurable conditions. They can verify on-chain data, real-time blockchain state, and dynamic off-chain proof data. Other Wowok objects reference Guards to make automated decisions.

### Core Capabilities
- **Automatic Verification**: Check time windows, account balances, object states, and any custom conditions
- **Multi-Object Integration**: Query data from Treasury, Permission, Repository, Service, and all other objects
- **Real-time Validation**: Accept dynamic proof data for conditions that isn't stored onchain
- **Complex Logic**: Support AND/OR operations, mathematical calculations, and nested conditions
- **Immutable & Reusable**: Once created, verification logic cannot be changed, but Guards can be cloned for improvements and reused across multiple objects

### Development Recommendations

💡 **Create Dependencies First**: For Guards that verify specific conditions (like Machine node names, Treasury balances, or Permission indices), create the referenced objects first, then create the Guard. This ensures accurate parameter matching.

**Example workflow**:
1. Create Machine with specific node names like "order_confirmed", "payment_received" → Create Guard that verifies current node equals "payment_received"
2. Create Treasury with known address like "0x1234...cafe" → Create Guard that queries balance from "0x1234...cafe"
3. Create Permission with specific indices like permission 703 (Treasury withdrawal) → Create Guard that checks if user has permission 703

💡 **Iterative Development**: Objects like Machine, Service, and Treasury can be modified multiple times before publishing. If issues arise after publishing, you can pause the object, clone it, make corrections, and republish.


---

## Core Parameters

### 1. Account & Object Identification

**Note**: All Guard operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

#### Guard Creation (New)
```json
{
  "account": "guard_creator_account",  // Leave blank to use the default account
  "data": {
    "description": "Guard purpose and verification logic description",
    "namedNew": {
      "name": "guard_identifier",
      "onChain": true,
      "tags": ["security", "automation", "verification"],
      "useAddressIfNameExist": false
    },
    "root": {
      // Core verification logic - see Logic Building Blocks
    },
    "table": [
      // Constants and witness data - optional
      // For details on how to define constants and witness data, see the "Constants and Witness Data" section below 
    ]
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | string | Recommended | Human-readable explanation of Guard's purpose |
| `name` | string | Optional | Local identifier for easy reference |
| `onChain` | boolean | Optional (default: false) | Whether metadata is publicly visible |
| `tags` | string[] | Optional | Categorization labels |
| `root` | object | **Required** | Core verification logic definition |
| `table` | array | Optional | Constants and witness data definitions |
| `network` | string | **Required** | Blockchain network: "sui mainnet", "sui testnet", "wowok mainnet", "wowok testnet" |
| `retentive` | string | Optional (default: "always") | Network scope: "always" (all device sessions), "session" (current program only) |

💡 **AI Prompt Tip**: "I want to create a new Guard. Please guide me through what information you need to help me create it accurately."
---

## Logic System Parameters

### The `root` Field Concept

```json
{
  "data": {
    "root": {
      // Verification logic structure
    }
  }
}
```

### Root Field Structure Types

The `root` field contains verification logic structures. Guards support six different structure types, each using different field combinations:

- **[Logic Operations](#1-logic-operations-logic-field)**: Use `logic` + `parameters` fields to compare values or combine multiple conditions with AND/OR logic
- **[Mathematical Calculations](#2-mathematical-calculations-calc-field)**: Use `calc` + `parameters` fields to perform arithmetic like addition, subtraction, or percentage calculations
- **[Object Queries](#3-object-queries-object--query-fields)**: Use `object` + `query` + `parameters` fields to retrieve current data from Treasury, Permission, Service, or other objects
- **[Context Data](#4-context-data-context-field)**: Use `context` field to access real-time transaction information like current time or transaction signer
- **[Fixed Values](#5-fixed-values-value--value_type-fields)**: Use `value` + `value_type` fields to embed constant thresholds, addresses, or limits directly in logic
- **[Table References](#6-table-references-identifier-field)**: Use `identifier` field to access data stored in the table array, either constants or user-provided witness data

#### 1. Logic Operations (`logic` field)

```json
{
  "root": {
    "logic": 12,
    "parameters": ["left_value", "right_value"]
  }
}
```

**`logic`**: Specifies a comparison method. Different comparison methods have different numeric codes. For example, code 12 means "greater than or equal" comparison.

**Parameters for logic operations**: Must contain exactly 2 items for comparisons (>, ≥, ==, etc.) or 2+ items for combinations (AND, OR). Each item can be current time, stored numbers, object query results, or calculations. For example, [current_time, deadline_timestamp] compares time values, or [user_balance_query, minimum_amount] compares balance against threshold.


**Logic Field Concepts**:
- **Comparison operations** (11-16): Compare two values and return true/false
- **Logical operations** (18-20): Combine multiple conditions with NOT/AND/OR logic
- **Return value**: Always boolean (true if condition met, false otherwise)

**Complete Logic Operation Reference**:

**Structure Pattern**: `{"logic": code, "parameters": [...]}`

| Code | Operation | Description | Parameters |
|------|-----------|-------------|------------|
| **11** | Greater than (>) | Left > Right | 2 values |
| **12** | Greater/equal (≥) | Left ≥ Right | 2 values |
| **13** | Less than (<) | Left < Right | 2 values |
| **14** | Less/equal (≤) | Left ≤ Right | 2 values |
| **15** | Numeric equal (==) | Numbers match | 2 values |
| **16** | Strict equal (===) | Values and types match | 2 values |
| **18** | Logical NOT | Inverse result | 1 condition |
| **19** | Logical AND | All conditions true | 2+ conditions |
| **20** | Logical OR | Any condition true | 2+ conditions |

#### 2. Mathematical Calculations (`calc` field)

```json
{
  "root": {
        "calc": 2,
    "parameters": ["value1", "value2"]
  }
}
```

**`calc`**: Specifies a mathematical operation method. Different math operations have different numeric codes. For example, code 2 means "addition" operation.

**Parameters for calculations**: Must contain 2 numbers for most operations (addition needs 2+, subtraction needs exactly 2). Each item can be stored constants, user-provided witness data, object query results, or context values. For example, [last_action_time, cooldown_duration] adds time values, or [treasury_balance, percentage_number] calculates portions.

**Calculation Field Concepts**:
- **Arithmetic operations**: Perform math on numeric values (addition, subtraction, etc.)
- **Return value**: Numeric result of the calculation
- **Common use**: Time calculations, percentage calculations, dynamic thresholds

**Complete Mathematical Operation Reference**:

**Structure Pattern**: `{"calc": code, "parameters": [...]}`

| Code | Operation | Description | Parameters |
|------|-----------|-------------|------------|
| **2** | Addition (+) | Sum values | 2+ numbers |
| **3** | Subtraction (-) | Difference | 2 numbers |
| **4** | Multiplication (*) | Product | 2+ numbers |
| **5** | Division (/) | Quotient | 2 numbers |
| **6** | Modulo (%) | Remainder | 2 numbers |

#### 3. Object Queries (`object` + `query` fields)

```json
{
  "root": {
    "object": "object_reference",
    "query": {"module": "module_name", "function": "function_name"},
    "parameters": ["query_param1", "query_param2"]
  }
}
```

**`object`**: Points to which Wowok object you want to get information from.

**Object Reference Format Options**:
- **Fixed address**: `"object": "0x1234567890abcdef..."` - Direct blockchain address reference
- **Table reference**: `"object": {"identifier": 1}` - References address stored at table identifier 1
- **Named reference**: `"object": {"name_or_address": "treasury_name"}` - References object by local name or address

**`query`**: Tells the system what specific information to get from that object. For example, `{"module": "treasury", "function": "Balance"}` gets the current balance amount, or `{"module": "permission", "function": "Has Rights"}` checks if user has a specific permission.

**Parameters for object queries**: Contains the inputs that the query function needs to work. For permission checks, needs [user_address, permission_index]. For balance checks, needs no inputs so use empty array `[]`. For data retrieval, needs [address, field_name]. The number and type depend on which function you're calling.

**Object Query Concepts**:
- **Cross-object verification**: Check data from Treasury, Permission, Service, etc.
- **Real-time data**: Gets current state of objects during verification
- **Return value**: Depends on query function (balance numbers, boolean status, addresses)

**Query Structure Reference**:
- `module`: Object type ("treasury", "permission", "repository", "service", "machine", "order")
- `function`: Query function name ("Balance", "Has Rights", "Current Node", "Published")
- `parameters`: Function-specific parameters (See appendix for complete function reference)

#### 4. Context Data (`context` field)

```json
{
  "root": {
    "context": 60/61/62
  }
}
```

**`context`**: Gets real-time information from the blockchain transaction using numeric codes.

| Code | Data Source | Return Type | Description |
|------|-------------|-------------|-------------|
| **60** | Transaction signer | Address | Gets the blockchain address of whoever is currently executing this transaction |
| **61** | Current time | U64 | Gets the current blockchain timestamp in seconds since Unix epoch |
| **62** | Guard address | Address | Gets the blockchain address of this specific Guard object being executed |

#### 5. Fixed Values (`value` + `value_type` fields)

```json
{
  "root": {
    "value": "constant_value",
    "value_type": type_code
  }
}
```

**`value`**: Contains a specific constant that never changes during verification.

**`value_type`**: Numeric code specifying the data format of the value. Must match the actual data type you're providing.

**When to use Fixed Values**: Use when you need constant thresholds that don't change - minimum amounts, fixed deadlines, specific addresses, or status codes that apply universally.

**Common Value Type Codes**:
| Code | Type | Use For | Example Value |
|------|------|---------|---------------|
| **100** | Bool | True/false flags | `true`, `false` |
| **101** | Address | Blockchain addresses | `"0x1234567890abcdef..."` |
| **103** | U64 | Numbers, timestamps | `"1000000000"`, `"1703923200"` |
| **120** | String | Text status, names | `"completed"`, `"emergency"` |

Complete type reference: [Data Types & Formats](#data-types--formats)

#### 6. Table References (`identifier` field)

```json
{
  "root": {
    "identifier": 1
  }
}
```

**What it is**: `identifier` is a reference label pointing to data defined in this Guard's table. Think of it as giving your data a number tag so you can reference it multiple times in complex logic.

**How it works**: When your Guard has complex verification logic that needs to use the same piece of data multiple times, you define the data once in the table with an identifier number, then reference that number wherever you need that data.

**Example - Multiple references to same data**:
```json
{
  "table": [
    {
      "identifier": 1,
      "bWitness": true,      // The user must provide this data during verification; it is not a preset value
      "value_type": 103      // The user-provided data must be a 64-bit unsigned integer
    },
    {
      "identifier": 5,
      "bWitness": false,     // This is a preset constant defined when creating the Guard
      "value": "1000"        // Sets the minimum limit to 1000 base units
    }
  ],
  "root": {
    "logic": 19,  // AND logic: both conditions must be satisfied
        "parameters": [
      {
        "logic": 11,  // Checks if user amount > preset minimum
        "parameters": [{"identifier": 1}, {"identifier": 5}]
      },
      {
        "logic": 13,  // Checks if user amount < upper limit of 10000
        "parameters": [{"identifier": 1}, {"value": "10000", "value_type": 103}]
      }
    ]
  }
}
```

In this example, `identifier: 1` (user amount) is referenced twice in different verification logic, but defined only once in the table.

**Identifier Range**: Use numbers 1-255 as reference labels. No special meaning - just pick any unused number for each data item you define.

### Combining Logic Structures

Logic structures can be nested to create verification rules with multiple conditions. Each `parameters` array can contain any combination of the six structure types. For example, checking both time constraints AND permission levels AND balance thresholds all in one verification.

**Example: Business hours access with permission and balance verification**
```json
{
  "logic": 19,  // AND logic (19): all three conditions below must be satisfied
    "parameters": [
      {
      // First condition: Check if current time is within business hours (9AM-6PM)
      "logic": 19,  // AND logic (19): both start and end time conditions must be met
        "parameters": [
          {
          "logic": 12,  // Greater than or equal (12): current time >= 9AM
            "parameters": [
            {"calc": 6, "parameters": [{"context": 61}, {"value": "86400", "value_type": 103}]},  // Divide current timestamp by 86400 seconds to get seconds elapsed today
            {"value": "32400", "value_type": 103}  // 32400 seconds = 9AM (9 hours × 3600 seconds)
            ]
          },
          {
          "logic": 14,  // Less than or equal (14): current time <= 6PM
            "parameters": [
            {"calc": 6, "parameters": [{"context": 61}, {"value": "86400", "value_type": 103}]},  // Also calculates seconds elapsed today
            {"value": "64800", "value_type": 103}  // 64800 seconds = 6PM (18 hours × 3600 seconds)
        ]
      }
    ]
  },
      {
      // Second condition: Check if the current operator has management permission
      "object": {"identifier": 1},  // Reference the Permission object address at identifier 1 in the table
      "query": {"module": "permission", "function": "Has Rights"},  // Call the Permission object's permission check function
        "parameters": [
        {"context": 60},  // context 60: gets the current transaction signer's address
        {"value": "1001", "value_type": 103}  // Checks for permission index 1001 (admin permission)
      ]
    },
    {
      // Third condition: Check if Treasury balance is sufficient
      "logic": 12,  // Greater than or equal (12): Treasury balance >= minimum requirement
      "parameters": [
        {
          "object": {"identifier": 2},  // Reference the Treasury object address at identifier 2 in the table
          "query": {"module": "treasury", "function": "Balance"},  // Query the current Treasury balance
          "parameters": []  // No extra parameters needed for balance query
        },
        {"value": "1000000000", "value_type": 103}  // 1000000000 base units = minimum required balance of 1 SUI
      ]
    }
  ]
}
```
This Guard returns true only when all three conditions are met: current time is during business hours (9AM-6PM) AND user has management permission (1001) AND Treasury balance is at least 1 SUI. It combines time calculation, object querying, and permission verification.
## Data Types & Formats

### Complete Data Types Reference

| Code | Type | Size | Description | JSON Format |
|------|------|------|-------------|-------------|
| **100** | Bool | 1 bit | Boolean values | `true`, `false` |
| **101** | Address | 32 bytes | Blockchain addresses | `"0x1234567890abcdef..."` |
| **102** | U8 | 1 byte | Small integers | `255` |
| **103** | U64 | 8 bytes | Large integers | `"1000000000"` |
| **105** | U128 | 16 bytes | Very large integers | `"999999999999999999"` |
| **106** | Vec<Address> | Variable | Address arrays | `["0x111...", "0x222..."]` |
| **120** | String | Variable | Text strings | `"completed"` |
| **121** | Vec<String> | Variable | String arrays | `["status1", "status2"]` |

**Technical Note**: Large numbers (103, 105) must be strings to avoid precision loss: `"1000000000"` not `1000000000`.

---

## Integration Patterns

Guards integrate by being referenced in other objects' configuration fields. Different objects put the guard field in different places, triggering verification at different moments.

### With Treasury

Treasury references Guards in `withdraw_guard` and `deposit_guard` fields. Before processing deposits or withdrawals, Treasury runs the Guard verification - true allows the transaction, false blocks it. 
Example: **business_hours_guard** blocks weekend withdrawals.

### With Service

Service references Guards in `buy_guard` for purchases and `withdraw_guard` for payments. Guard runs when customers buy services or providers withdraw earnings. 
Example: **vip_qualification_guard** blocks regular users from premium services.

### With Permission

Permission attaches Guards to specific permission entries using the `guard` field. Users need both the permission index AND Guard approval to perform actions. 
Example: Treasury withdrawal permission + **time_lock_guard** = no weekend access.

### With Repository 

Repository attaches Guards to data policies through `guard` in policy definitions and cites Guards for Repository access control. Guard runs when users read or write protected data fields, or when other objects attempt to cite this Repository. 
Example: **security_clearance_guard** blocks access to confidential records, **payment_verification_guard** requires payment before Repository citation.

### With Machine

Machine references Guards in workflow `forwards` for node transitions. Progress advancement requires Guard approval before moving to next workflow stage. 
Example: **weather_condition_guard** checks if weather data shows rain today, then allows forward to Refund node.

### With Arbitration

Arbitration references Guards in customer and voting configurations. Guard verification gates case creation and voting participation. 
Example: **stake_requirement_guard** ensures voters have skin in the game.

**Pattern**: Same Guard address works across objects - Treasury's `withdraw_guard`, Service's `buy_guard`, Permission's `guard` field can all reference the same Guard for consistent verification logic.

---

## Complete Examples

### Example 1: Time-Based Access Control

**Purpose**: Create a Guard that blocks all operations before a specific launch date using fixed timestamp comparison.
**Methods Used**: Logic operations (comparison), Context data (current time), Fixed values (launch timestamp).

```json
{
  "account": "business_owner",
  "data": {
    "description": "Allow operations only after January 1, 2024 to enforce go-live date",
    "namedNew": {
      "name": "launch_date_guard",
      "onChain": true,
      "tags": ["time-control", "launch"]
    },
    "root": {
      "logic": 12,  // Greater than or equal: current time >= launch timestamp
      "parameters": [
        {"context": 61},  // Gets current blockchain timestamp in seconds
        {"value": "1704067200", "value_type": 103}  // January 1, 2024 00:00:00 UTC timestamp
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

**Learning Focus**: Basic comparison logic using fixed values and context data. No witness data, no complex calculations.
**Expected Result**: Guard blocks all operations before January 1, 2024, allows them after.

### Example 2: Dynamic Balance Verification with Treasury Integration

**Purpose**: Create a Guard that prevents Treasury withdrawals when balance would drop below reserves, with user-provided Treasury address.
**Methods Used**: Object queries (Treasury balance), Logic operations (comparison), Witness data (Treasury address), Treasury integration.

```json
{
  "account": "team_manager", 
  "data": {
    "description": "Allow Treasury withdrawals only when balance exceeds 10 SUI to maintain minimum reserves",
    "namedNew": {
      "name": "minimum_balance_guard",
      "onChain": true,
      "tags": ["treasury", "balance-check", "reserves"]
    },
    "root": {
      "logic": 11,  // Greater than: current balance > minimum threshold
      "parameters": [
        {
          "object": {"identifier": 1},  // References Treasury object address provided in table
          "query": {"module": "treasury", "function": "Balance"},  // Queries current Treasury balance
          "parameters": []  // Balance query requires no additional parameters
        },
        {"value": "10000000000", "value_type": 103}  // 10 SUI minimum (10 billion MIST)
      ]
    },
  "table": [
    {
      "identifier": 1,
        "bWitness": true,  // User must provide Treasury address when using this Guard
        "value_type": 101  // Treasury address must be in address format
      }
    ]
  },
  "session": {
    "network": "sui testnet", 
    "retentive": "always"
  }
}
```

**Learning Focus**: Object queries for real-time data verification and witness data usage.
**Expected Result**: Guard blocks Treasury withdrawals when balance would drop below 10 SUI.



---
## Common Issues & Troubleshooting

### Guard Creation Problems
**Problem**: "Schema validation failed" or "Invalid root configuration"  
**Solutions**:
1. Verify all `identifier` values in table are unique (1-255)
2. Ensure `value_type` codes match actual data types (101 for address, 103 for numbers)
3. Check that witness entries have `value: null` or no value field
4. Use valid logic operation codes (11-20) and math operation codes (2-6)

**Example Reference**: See [Fixed Threshold Guard](#fixed-threshold-guard) for the simplest valid configuration.

### Logic Verification Errors
**Problem**: "Guard evaluation failed" or unexpected results  
**Solutions**:
1. Test each condition separately before combining with AND/OR operations
2. Verify number values are strings: `"1000000000"` not `1000000000`
3. Check that object queries use correct module and function names
4. Ensure time calculations use correct timestamp format (Unix seconds)

**Common Logic Issues**:
- **Time comparison fails**: Verify timestamp values use Unix seconds, not milliseconds
- **Balance query returns zero**: Ensure Treasury address is correct and has been funded
- **Permission check fails**: Verify permission index exists in referenced Permission object

### Witness Data Issues  
**Problem**: "Witness verification failed" or "Type mismatch"  
**Solutions**:
1. Verify witness `type` matches Guard table `value_type` exactly (101=address, 103=numbers)
2. Ensure witness `identifier` exists in Guard's table configuration
3. Check address format includes "0x" prefix for blockchain addresses
4. Only modify the `witness` field value - leave all other witness parameters unchanged

**Example Reference**: See "Balance Verification + Treasury Integration" for correct witness usage.

### Object Integration Problems
**Problem**: Guard prevents legitimate operations or "Object not found"  
**Solutions**:
1. Test Guard independently before integrating with Treasury/Service/Permission
2. Verify referenced objects exist and are accessible on same network (testnet vs mainnet)
3. Check Treasury/Permission objects are published and not paused
4. Ensure witness data provides correct object addresses that Guard expects

**Integration Debugging**:
- **Treasury integration**: Test Guard with correct Treasury address in witness data
- **Permission integration**: Verify user has the permission index Guard is checking
- **Cross-object queries**: Ensure queried objects exist before Guard creation

⚠️ **Critical Reminder**: Guards are immutable once created. Always test logic thoroughly on testnet before creating production Guards.

💡 **Development Workflow**:
1. **Design**: Map business requirements to Guard logic using examples as templates
2. **Simple Test**: Create basic version (like "Fixed Threshold Guard") to verify core functionality  
3. **Add Complexity**: Build up logic gradually, testing each condition separately
4. **Integration Test**: Verify Guard works with target Treasury/Service objects
5. **Production Deploy**: Create final version with tested witness data requirements

---
## Complete Query Functions Reference

### Permission Module Queries (1-9)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **1** | Owner | None | Address (101) | Get Permission object owner address |
| **2** | Is Admin | address | Bool (100) | Check if address is administrator |
| **3** | Has Rights | address, permission_index | Bool (100) | Check if address has specific permission |
| **4** | Contains Address | address | Bool (100) | Check if address exists in permission table |
| **5** | Contains Permission | address, permission_index | Bool (100) | Check if permission is defined for address |
| **6** | Contains Permission Guard | address, permission_index | Bool (100) | Check if permission has Guard verification |
| **7** | Permission Guard | address, permission_index | Address (101) | Get Guard address for permission |
| **8** | Number of Entities | None | U64 (103) | Count of entities in permission table |
| **9** | Number of Admin | None | U64 (103) | Count of administrators |

### Repository Module Queries (100-119)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **100** | Permission | None | Address (101) | Get Permission object address |
| **101** | Contains Policy | field_name | Bool (100) | Check if consensus policy exists |
| **102** | Is Permission set of Policy | policy_name | Bool (100) | Check if policy has permission requirements |
| **103** | Permission of Policy | policy_name | U64 (103) | Get permission index for policy |
| **104** | Guard of Policy | policy_name | Address (101) | Get Guard address for policy |
| **105** | Value Type of Policy | policy_name | U8 (102) | Get data type defined by policy |
| **106** | Contains Data | address, field_name | Bool (100) | Check if data exists for address/field |
| **107** | Is Guard for data query been set | None | Bool (100) | Check if query Guard is configured |
| **108** | Guard address for data query | None | Address (101) | Get query Guard address |
| **109** | Type | None | U8 (102) | Get repository type (0: Normal, 1: Wowok greenee) |
| **110** | Policy Mode | None | U8 (102) | Get policy mode (0: Free, 1: Strict) |
| **111** | Reference Count | None | U64 (103) | Count of object references |
| **112** | Is Referenced by An Object | address | Bool (100) | Check if referenced by specific object |
| **113** | Number Data | address, field_name | U256 (122) | Get numeric data for address/field |
| **114** | String Data | address, field_name | String (120) | Get string data for address/field |
| **115** | Address Data | address, field_name | Address (101) | Get address data for address/field |
| **116** | Bool Data | address, field_name | Bool (100) | Get boolean data for address/field |
| **117** | Number Vector Data | address, field_name | Vec<U256> (119) | Get numeric array for address/field |
| **118** | String Vector Data | address, field_name | Vec<String> (121) | Get string array for address/field |
| **119** | Address Vector Data | address, field_name | Vec<Address> (106) | Get address array for address/field |

### Treasury Module Queries (1400-1430)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **1401** | Balance | None | U64 (103) | Get current Treasury balance |
| **1402** | Number of Flow Records | None | U64 (103) | Count of transaction records |
| **1403** | Inflow Amount | None | U128 (105) | Total amount deposited |
| **1404** | Outflow Amount | None | U128 (105) | Total amount withdrawn |
| **1405** | Has Deposit Guard | None | Bool (100) | Check if deposit Guard exists |
| **1406** | Deposit Guard | None | Address (101) | Get deposit Guard address |
| **1407** | Number of Withdraw Guards | None | U64 (103) | Count of withdrawal Guards |
| **1408** | Has Withdraw Guard | guard_address | Bool (100) | Check if specific withdraw Guard exists |
| **1409** | Withdrawal Amount with Guard | guard_address | U64 (103) | Get withdrawal limit for Guard |
| **1410** | Recent Time with Operation | operation_type | U64 (103) | Get time of recent operation |
| **1411** | Recent Signer with Operation | operation_type | Address (101) | Get signer of recent operation |
| **1412** | Recent Payment with Operation | operation_type | Address (101) | Get payment of recent operation |
| **1413** | Recent Amount with Operation | operation_type | U64 (103) | Get amount of recent operation |
| **1414** | Recent Time with Op/Pmt | operation_type, payment_address | U64 (103) | Get time of operation with payment |
| **1415** | Recent Signer with Op&Pmt | operation_type, payment_address | Address (101) | Get signer of operation with payment |
| **1416** | Recent Amount with Op/Pmt | operation_type, payment_address | U64 (103) | Get amount of operation with payment |
| **1417** | Recent Time with Op/Sgr | operation_type, signer_address | U64 (103) | Get time of operation by signer |
| **1418** | Recent Payment with Op/Sgr | operation_type, signer_address | Address (101) | Get payment of operation by signer |
| **1419** | Recent Amount with Op/Sgr | operation_type, signer_address | U64 (103) | Get amount of operation by signer |
| **1420** | Recent Time with Op/Pmt/Sgr | operation_type, payment_address, signer_address | U64 (103) | Get time of specific operation |
| **1421** | Recent Amount with Op/Pmt/Sgr | operation_type, payment_address, signer_address | U64 (103) | Get amount of specific operation |
| **1422** | Has Operation | operation_type | Bool (100) | Check if operation type occurred |
| **1423** | Has Operation with Pmt | operation_type, payment_address | Bool (100) | Check operation with payment |
| **1424** | Has Operation with Sgr | operation_type, signer_address | Bool (100) | Check operation by signer |
| **1425** | Has Operation with Pmt/Sgr | operation_type, payment_address, signer_address | Bool (100) | Check specific operation |
| **1426** | Operation at Least Times | operation_type, minimum_times | Bool (100) | Check minimum operation count |
| **1427** | Operation at Least Times by a Signer | operation_type, signer_address, minimum_times | Bool (100) | Check signer operation frequency |
| **1428** | Type | None | String (120) | Get Treasury token type |
| **1429** | Type with Original Ids | None | String (120) | Get Treasury type with IDs |
| **1430** | Withdraw mode | None | U8 (102) | Get withdrawal mode (0: permission, 1: guardOnly, 2: both) |

**Treasury Operation Types**:
- `0`: Withdraw
- `1`: Deposit  
- `2`: Receive

### Service Module Queries (400-425)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **400** | Permission | None | Address (101) | Get Permission object address |
| **401** | Payee | None | Address (101) | Get payee address for withdrawals |
| **402** | Has Buying Guard | None | Bool (100) | Check if purchase Guard exists |
| **403** | Buying Guard | None | Address (101) | Get purchase Guard address |
| **404** | Contains Repository | address | Bool (100) | Check if Repository is referenced |
| **405** | Has Withdrawing Guard | address | Bool (100) | Check if withdrawal Guard exists |
| **406** | Withdrawing Guard Percent | address | U64 (103) | Get withdrawal percentage for Guard |
| **407** | Has Refunding Guard | address | Bool (100) | Check if refund Guard exists |
| **408** | Refunding Guard Percent | address | U64 (103) | Get refund percentage for Guard |
| **409** | Has Sales Item | item_name | Bool (100) | Check if sales item exists |
| **410** | Sale Item Price | item_name | U64 (103) | Get price of sales item |
| **411** | Sale Item Inventory | item_name | U64 (103) | Get inventory of sales item |
| **412** | Has Machine | None | Bool (100) | Check if Machine is configured |
| **413** | Machine | None | Address (101) | Get Machine address |
| **414** | Paused | None | Bool (100) | Check if Service is paused |
| **415** | Published | None | Bool (100) | Check if Service is published |
| **416** | Has Required Info | None | Bool (100) | Check if customer info is required |
| **417** | Required Info of Service-Pubkey | None | String (120) | Get encryption public key |
| **418** | Required Info | None | Vec<String> (121) | Get required info field names |
| **419** | Number of Treasuries | None | U64 (103) | Count of external Treasuries |
| **420** | Contains Treasury | treasury_address | Bool (100) | Check if Treasury is referenced |
| **421** | Number of Arbitrations | None | U64 (103) | Count of Arbitration objects |
| **422** | Contains Arbitration | arbitration_address | Bool (100) | Check if Arbitration is referenced |
| **423** | Type | None | String (120) | Get Service token type |
| **424** | Type with Original Ids | None | String (120) | Get Service type with IDs |
| **425** | Location | None | String (120) | Get Service location |

### Order Module Queries (500-521)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **500** | Amount | None | U64 (103) | Get Order total amount |
| **501** | Payer | None | Address (101) | Get Order payer address |
| **502** | Service | None | Address (101) | Get Service address |
| **503** | Has Progress | None | Bool (100) | Check if Progress exists |
| **504** | Progress | None | Address (101) | Get Progress address |
| **505** | Required Info | None | Bool (100) | Check if required info is set |
| **506** | Discount Used | None | Bool (100) | Check if discount was applied |
| **507** | Discount | None | Address (101) | Get Discount object address |
| **508** | Balance | None | U64 (103) | Get current Order balance |
| **511** | Number of Agents | None | U64 (103) | Count of Order agents |
| **512** | Has Agent | agent_address | Bool (100) | Check if address is Order agent |
| **513** | Number of Disputes | None | U64 (103) | Count of arbitration cases |
| **514** | Has Arb | arb_address | Bool (100) | Check if Arb exists for Order |
| **515** | Type | None | String (120) | Get Order token type |
| **516** | Type with Original Ids | None | String (120) | Get Order type with IDs |
| **517** | Number of Items | None | U64 (103) | Count of purchased items |
| **518** | Has Item | item_name | Bool (100) | Check if item was purchased |
| **519** | Item Price | item_name | U64 (103) | Get price of purchased item |
| **520** | Item Quantity | item_name | U64 (103) | Get quantity of purchased item |
| **521** | Time | None | U64 (103) | Get Order creation time |

### Machine Module Queries (700-705)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **700** | Permission | None | Address (101) | Get Permission object address |
| **701** | Paused | None | Bool (100) | Check if Machine is paused |
| **702** | Published | None | Bool (100) | Check if Machine is published |
| **703** | Is Consensus Repository | address | Bool (100) | Check if address is consensus Repository |
| **704** | Has Endpoint | None | Bool (100) | Check if endpoint is configured |
| **705** | Endpoint | None | String (120) | Get endpoint URL |

### Progress Module Queries (800-830)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **800** | Machine | None | Address (101) | Get Machine address |
| **801** | Current Node | None | String (120) | Get current node name |
| **802** | Has Parent | None | Bool (100) | Check if parent Progress exists |
| **803** | Parent | None | Address (101) | Get parent Progress address |
| **804** | Has Task | None | Bool (100) | Check if task is assigned |
| **805** | Task | None | Address (101) | Get task object address |
| **806** | Has Unique Permission | operator_name | Bool (100) | Check if unique permission exists |
| **807** | Is Unique Permission Operator | operator_name, address | Bool (100) | Check if address is unique operator |
| **808** | Has Context Repository | None | Bool (100) | Check if context Repository exists |
| **809** | Context Repository | None | Address (101) | Get context Repository address |
| **810** | Last Session Time | None | U64 (103) | Get last session completion time |
| **811** | Last Session Node | None | String (120) | Get last completed node name |
| **812** | Current Session-id | None | U64 (103) | Get current session ID |
| **813** | Parent Session-id | None | U64 (103) | Get parent session ID |
| **814** | Parent Next Node | None | String (120) | Get parent's next node |
| **815** | Parent Forward | None | String (120) | Get parent's forward name |
| **816** | Parent Node | None | String (120) | Get parent node name |
| **817** | Forward Accomplished | session_id, next_node_name, forward_name | Bool (100) | Check if forward is accomplished |
| **818** | Forward Operator | session_id, next_node_name, forward_name | Address (101) | Get forward operator address |
| **819** | Forward Message | session_id, next_node_name, forward_name | String (120) | Get forward message |
| **820** | Forward Order Count | session_id, next_node_name, forward_name | U64 (103) | Get forward Order count |
| **821** | Forward Time | session_id, next_node_name, forward_name | U64 (103) | Get forward trigger time |
| **822** | Forward has Order | session_id, next_node_name, forward_name, order_address | Bool (100) | Check if forward contains Order |
| **823** | Closest Session Time | node_name | U64 (103) | Get closest session completion time |
| **824** | Closest Forward Accomplished | node_name, next_node_name, forward_name | Bool (100) | Check closest forward accomplishment |
| **825** | Closest Forward Operator | node_name, next_node_name, forward_name | Address (101) | Get closest forward operator |
| **826** | Closest Forward Message | node_name, next_node_name, forward_name | String (120) | Get closest forward message |
| **827** | Closest Forward Order Count | node_name, next_node_name, forward_name | U64 (103) | Get closest forward Order count |
| **828** | Closest Forward Time | node_name, next_node_name, forward_name | U64 (103) | Get closest forward time |
| **829** | Closest Forward has Order | node_name, next_node_name, forward_name, order_address | Bool (100) | Check closest forward Order |
| **830** | Node Sessions completed | node_name | U64 (103) | Get completed session count for node |

### Arbitration Module Queries (1500-1513)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **1500** | Permission | None | Address (101) | Get Permission object address |
| **1501** | Paused | None | Bool (100) | Check if Arbitration is paused |
| **1502** | Fee | None | U64 (103) | Get arbitration fee amount |
| **1503** | Has Endpoint | None | Bool (100) | Check if endpoint is configured |
| **1504** | Endpoint | None | String (120) | Get endpoint URL |
| **1505** | Has Customer Guard | None | Bool (100) | Check if customer Guard exists |
| **1506** | Customer Guard | None | Address (101) | Get customer Guard address |
| **1507** | Number of Voting Guard | None | U64 (103) | Count of voting Guards |
| **1508** | Has Voting Guard | guard_address | Bool (100) | Check if voting Guard exists |
| **1509** | Voting Weight | guard_address | U64 (103) | Get voting weight for Guard |
| **1510** | Treasury | None | Address (101) | Get Treasury address for fees |
| **1511** | Type | None | String (120) | Get Arbitration token type |
| **1512** | Type with Original Ids | None | String (120) | Get Arbitration type with IDs |
| **1513** | Location | None | String (120) | Get Arbitration location |

### Arb Module Queries (1600-1616)

| ID | Function Name | Parameters | Return Type | Description |
|----|---------------|------------|-------------|-------------|
| **1600** | Order | None | Address (101) | Get Order under arbitration |
| **1601** | Arbitration | None | Address (101) | Get Arbitration object address |
| **1602** | Feedback | None | String (120) | Get arbitration feedback |
| **1603** | Has Compensation | None | Bool (100) | Check if compensation is determined |
| **1604** | Compensation | None | U64 (103) | Get compensation amount |
| **1605** | Unclaimed Arbitration Costs | None | U64 (103) | Get unclaimed arbitration costs |
| **1606** | Turnout | None | U64 (103) | Get number of voters |
| **1607** | Has voted | voter_address | Bool (100) | Check if address has voted |
| **1608** | Voting weight | voter_address | U64 (103) | Get voting weight for address |
| **1609** | Voting Time | voter_address | U64 (103) | Get voting time for address |
| **1610** | Voting Option | voter_address, option_index | Bool (100) | Check voting option for address |
| **1611** | Number of Options | None | U64 (103) | Get number of voting options |
| **1612** | Number of Voters | None | U64 (103) | Get total number of voters |
| **1613** | Number of Votes for the Option | option_index | U64 (103) | Get vote count for option |
| **1614** | Type | None | String (120) | Get Arb token type |
| **1615** | Type with Original Ids | None | String (120) | Get Arb type with IDs |
| **1616** | Time | None | U64 (103) | Get Arb creation time |

---

---

## Complete Witness Types Reference

### Witness Type Codes (30-38)

| Code | Object Relationship | Data Type | Technical Function |
|------|-------------------|-----------|-------------------|
| **30** | Order → Progress | Address | Provides Progress address associated with Order |
| **31** | Order → Machine | Address | Provides Machine address associated with Order |
| **32** | Order → Service | Address | Provides Service address associated with Order |
| **33** | Progress → Machine | Address | Provides Machine address associated with Progress |
| **34** | Arbitration → Order | Address | Provides Order address associated with Arbitration |
| **35** | Arbitration → Arbitration | Address | Provides Arbitration address for arbitration rules |
| **36** | Arbitration → Progress | Address | Provides Progress address associated with Arbitration |
| **37** | Arbitration → Machine | Address | Provides Machine address associated with Arbitration |
| **38** | Arbitration → Service | Address | Provides Service address associated with Arbitration |

**Technical Note**: Witness types verify object relationships by requiring users to provide addresses that demonstrate specific connections between Wowok objects. All witness types return Address format (type 101).

---