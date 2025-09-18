# Guard Object: Your Smart Verification Controller

> "Create automatic verification rules that check conditions before allowing operations - transform business requirements into unbreakable verification logic"

**MCP Tool**: [`wowok_guard_mcp_server`](https://www.npmjs.com/package/wowok_guard_mcp_server)

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: What Guards do and core concepts
- **[Core Parameters](#core-parameters)**: Guard creation configuration options
- **[Logic System Parameters](#logic-system-parameters)**: Detailed root field structure and parameters
- **[Table System Parameters](#table-system-parameters)**: Constants and witness data configuration
- **[Data Types & Formats](#data-types--formats)**: Type codes and witness usage
- **[Simple Examples](#simple-examples)**: Basic Guards demonstrating parameter usage
- **[Integration Patterns](#integration-patterns)**: How Guards connect with other objects
- **[Complete Examples](#complete-examples)**: Advanced Guard configurations

### Navigation by Need
| I want to... | Go to section |
|--------------|---------------|
| Understand Guard verification logic | [Logic System Parameters](#logic-system-parameters) |
| Learn about constants and witness data | [Table System Parameters](#table-system-parameters) |
| See basic verification examples | [Simple Examples](#simple-examples) |
| Connect Guards to Treasury/Service | [Integration Patterns](#integration-patterns) |
| Find complete working configurations | [Complete Examples](#complete-examples) |

---

## Overview

### Definition
Guards are immutable on-chain verification controllers that automatically evaluate conditions before allowing operations. They transform business rules into verifiable code that cannot be manipulated.

### Core Capabilities
- **Condition Verification**: Check time windows, account balances, object states, or any custom conditions
- **Multi-Object Integration**: Query data from Treasury, Permission, Repository, Service, and all other objects
- **Dynamic Validation**: Accept real-time proof data for conditions that isn't stored on-chain
- **Complex Logic**: Support AND/OR operations, mathematical calculations, and nested conditions
- **Reusable Templates**: Once created, Guards can be referenced by multiple objects and cloned for modifications

### Key Characteristics
- **Immutable Logic**: Once created, verification logic cannot be changed - ensures consistent rule enforcement
- **Cloneable Design**: Can copy existing Guards and modify for new requirements
- **Reference by Address**: Other objects reference Guards by blockchain address for verification
- **Gas Efficient**: Simple conditions execute with minimal transaction costs

### Development Recommendations
For Guards that verify specific node names (like Machine workflow nodes) or reference specific object properties, create the referenced objects first, then create Guards. This ensures accurate parameter matching.

Objects that depend on Guards (Treasury, Service, Machine) can be adjusted multiple times - you don't need to configure everything perfectly at once. Unpublished objects remain editable; published objects can be paused, cloned, modified, and republished if needed.

💡 **AI Collaboration Tip**: "I want to create a new Guard. Please guide me through what information you need to help me design the right verification logic."

---

## Core Parameters

### 1. Account & Object Creation

**Note**: All Guard operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

```json
{
  "account": "guard_creator_account",
  "data": {
    "description": "Human-readable explanation of Guard's verification purpose",
    "namedNew": {
      "name": "guard_identifier",
      "onChain": true,
      "tags": ["category", "purpose"],
      "useAddressIfNameExist": false
    },
    "root": {
      // Core verification logic - see Logic System Parameters
    },
    "table": [
      // Constants and witness data - see Table System Parameters
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
| `description` | string | Recommended | Clear explanation of what this Guard verifies |
| `name` | string | Optional | Local identifier for easy reference in other objects |
| `onChain` | boolean | Optional (default: false) | Whether metadata is publicly visible on blockchain |
| `tags` | string[] | Optional | Categorization labels for organization |
| `root` | object | **Required** | Core verification logic definition |
| `table` | array | Optional | Constants and witness data definitions |

---

## Logic System Parameters

The `root` field contains the core verification logic. Understanding each parameter is essential for building effective Guards.

### Root Structure Types

Guards support six types of root logic structures:

#### 1. Logic Operations (`logic` field)
**Purpose**: Combine multiple conditions using logical operators

```json
{
  "root": {
    "logic": 19,
    "parameters": [
      // array of conditions to evaluate
    ]
  }
}
```

**Parameters**:
- `logic` (number, required): Logic operation code
- `parameters` (array, required): Conditions to evaluate with this logic

**Logic Operation Codes**:
| Code | Operation | Description | Parameters |
|------|-----------|-------------|------------|
| **11** | Greater than (>) | Left > Right | 2 items |
| **12** | Greater/equal (≥) | Left ≥ Right | 2 items |
| **13** | Less than (<) | Left < Right | 2 items |
| **14** | Less/equal (≤) | Left ≤ Right | 2 items |
| **15** | Numeric equal (==) | Numbers match | 2 items |
| **16** | Strict equal (===) | Values and types match | 2 items |
| **18** | Logical NOT | Inverse result | 1 item |
| **19** | Logical AND | All conditions true | 2+ items |
| **20** | Logical OR | Any condition true | 2+ items |

**Example**: Check if value1 ≥ value2
```json
{
  "logic": 12,
  "parameters": [
    {"identifier": 1},
    {"identifier": 2}
  ]
}
```

#### 2. Mathematical Calculations (`calc` field)
**Purpose**: Perform mathematical operations on values

```json
{
  "root": {
    "calc": 2,
    "parameters": [
      // array of values to calculate
    ]
  }
}
```

**Parameters**:
- `calc` (number, required): Math operation code
- `parameters` (array, required): Values to use in calculation

**Math Operation Codes**:
| Code | Operation | Description | Parameters |
|------|-----------|-------------|------------|
| **2** | Addition (+) | Sum values | 2+ items |
| **3** | Subtraction (-) | Difference | 2 items |
| **4** | Multiplication (*) | Product | 2+ items |
| **5** | Division (/) | Quotient | 2 items |
| **6** | Modulo (%) | Remainder | 2 items |

**Example**: Add two values
```json
{
  "calc": 2,
  "parameters": [
    {"identifier": 1},
    {"value": "3600", "value_type": 103}
  ]
}
```

#### 3. Object Queries (`object` + `query` fields)
**Purpose**: Retrieve data from other Wowok objects

```json
{
  "root": {
    "object": {"identifier": 1},
    "query": {"module": "treasury", "function": "Balance"},
    "parameters": []
  }
}
```

**Parameters**:
- `object` (object, required): Reference to object to query (identifier or direct address)
- `query` (object, required): Module and function specification
- `parameters` (array, required): Parameters for the query function (can be empty)

**Query Structure**:
- `module` (string): Object type - "treasury", "permission", "repository", "service", etc.
- `function` (string): Query function name - "Balance", "Has Rights", "Current Node", etc.

**Example**: Check Treasury balance
```json
{
  "object": {"identifier": 1},
  "query": {"module": "treasury", "function": "Balance"},
  "parameters": []
}
```

#### 4. Context Data (`context` field)  
**Purpose**: Access real-time blockchain data during verification

```json
{
  "root": {
    "context": 61
  }
}
```

**Parameters**:
- `context` (number, required): Context data type code

**Context Data Codes**:
| Code | Data Source | Type | Description |
|------|-------------|------|-------------|
| **60** | Transaction signer | Address | Who is performing the current operation |
| **61** | Current time | U64 | Current blockchain timestamp |
| **62** | Guard address | Address | Address of the current Guard object |

**Example**: Get current time
```json
{"context": 61}
```

#### 5. Fixed Values (`value` + `value_type` fields)
**Purpose**: Use specific constants in verification logic

```json
{
  "root": {
    "value": "1000000000",
    "value_type": 103
  }
}
```

**Parameters**:
- `value` (any, required): The specific value to use
- `value_type` (number, required): Data type code for the value

**Example**: Fixed timestamp value
```json
{
  "value": "1703923200",
  "value_type": 103
}
```

#### 6. Table References (`identifier` field)
**Purpose**: Reference data defined in the table array

```json
{
  "root": {
    "identifier": 1
  }
}
```

**Parameters**:
- `identifier` (number, required): Reference to table entry (1-255)

**Example**: Reference table item 1
```json
{"identifier": 1}
```

### Combining Logic Structures

Logic structures can be nested to create complex verification rules. Each `parameters` array can contain any combination of the six structure types.

**Example**: Time check with calculation
```json
{
  "logic": 12,
  "parameters": [
    {"context": 61},
    {
      "calc": 2,
      "parameters": [
        {"identifier": 1},
        {"value": "3600", "value_type": 103}
      ]
    }
  ]
}
```

This checks if current time ≥ (table value 1 + 3600 seconds).

---

## Table System Parameters

The `table` array defines constants and witness data requirements for your Guard. Each table entry has a unique identifier that can be referenced in the root logic.

### Table Entry Structure

```json
{
  "table": [
    {
      "identifier": 1,
      "bWitness": false,
      "value_type": 103,
      "value": "1000000000"
    }
  ]
}
```

### Table Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `identifier` | number (1-255) | Required | Unique ID for referencing this entry |
| `bWitness` | boolean | Required | Data source type: false=constant, true=witness |
| `value_type` | number | Required | Data type code (100-122) |
| `value` | any | Conditional | Required for constants (bWitness: false), null for witness |

### Constant vs Witness Data

#### Constants (`bWitness: false`)
**Use for**: Fixed values that never change
```json
{
  "identifier": 1,
  "bWitness": false,
  "value_type": 103,
  "value": "3600"
}
```
- `value` field contains the actual constant value
- Value is set during Guard creation and never changes
- Examples: time limits, minimum amounts, fixed addresses

#### Witness Data (`bWitness: true`)
**Use for**: Dynamic values provided during verification
```json
{
  "identifier": 2,
  "bWitness": true,
  "value_type": 101,
  "value": null
}
```
- `value` field is null or omitted
- Actual value provided when using the Guard
- Examples: user-specific addresses, current amounts, dynamic conditions

### Data Type Codes

| Code | Type | Description | Example Use |
|------|------|-------------|-------------|
| **100** | Bool | true/false values | Status flags |
| **101** | Address | Blockchain addresses | Object references |
| **103** | U64 | 64-bit numbers | Amounts, timestamps |
| **120** | String | Text values | Status messages |

Complete type reference available in [Data Types & Formats](#data-types--formats).

### Table Planning Strategy

1. **Identify Required Data**: What information does your verification logic need?
2. **Classify Data Types**: Which values are constants vs dynamic (witness)?
3. **Assign Identifiers**: Use unique numbers 1-255 for each data item
4. **Set Appropriate Types**: Choose correct value_type codes for your data

**Example Planning**:
- Cooldown period (1 hour) → Constant → identifier: 1, bWitness: false, value: "3600"
- User's last action time → Witness → identifier: 2, bWitness: true, value: null
- Treasury address to check → Witness → identifier: 3, bWitness: true, value: null

---

## Data Types & Formats

### Core Data Types Reference

| Code | Type | Size | Description | JSON Example |
|------|------|------|-------------|-------------|
| **100** | Bool | 1 bit | Boolean values | `true`, `false` |
| **101** | Address | 32 bytes | Blockchain addresses | `"0x1234567890abcdef..."` |
| **102** | U8 | 1 byte | Small integers | `255` |
| **103** | U64 | 8 bytes | Large integers | `"1000000000"` |
| **120** | String | Variable | Text strings | `"completed"` |
| **105** | U128 | 16 bytes | Very large integers | `"999999999999999999"` |
| **106** | Vec<Address> | Variable | Address arrays | `["0x111...", "0x222..."]` |
| **121** | Vec<String> | Variable | String arrays | `["status1", "status2"]` |

**Important**: Large numbers (103, 105) must be strings to avoid precision loss: `"1000000000"` not `1000000000`.

### Witness System

**Witness Overview**: Dynamic proof data you provide when using Guards. Unlike constants stored in the table, witness data represents your specific situation during verification.

#### Witness in Guard Creation
When creating a Guard, you specify which data will be provided as witness:
```json
{
  "table": [
    {
      "identifier": 1,
      "bWitness": true,
      "value_type": 101,
      "value": null
    }
  ]
}
```

#### Witness in Guard Usage
When using the Guard, you provide the actual witness values:
```json
{
  "witness": {
    "guards": ["guard_address"],
    "witness": [
      {
        "guard": "guard_address",
        "identifier": 1,
        "type": 101,
        "witness": "0x_actual_treasury_address"
      }
    ]
  }
}
```

**Key Points**:
- Only modify the `witness` field value - other fields are auto-generated
- `type` must match the `value_type` specified in Guard creation
- `identifier` must exist in the Guard's table configuration

#### Common Witness Scenarios

**Address Verification**:
```json
"witness": "0x1234567890abcdef..."
```
Proving ownership of specific Treasury, Service, or other object.

**Amount Verification**:
```json
"witness": "5000000000"
```
Specifying withdrawal amount, balance threshold, or payment value.

**Status Verification**:
```json
"witness": "emergency_confirmed"
```
Providing current status, approval state, or condition confirmation.

**Time Verification**:
```json
"witness": "1703923200"
```
Last action timestamp, deadline, or event time.

---

## Simple Examples

These examples demonstrate basic parameter usage with minimal complexity.

### Example 1: Always True Guard
**Purpose**: Understand basic Guard structure
```json
{
  "account": "test_account",
  "data": {
    "description": "Always returns true for testing",
    "namedNew": {"name": "always_true_guard"},
    "root": {
      "value": true,
      "value_type": 100
    }
  }
}
```
**Key Learning**: `root` with `value` + `value_type` creates fixed return value.

### Example 2: Simple Time Check
**Purpose**: Understand context data usage
```json
{
  "account": "test_account", 
  "data": {
    "description": "Check if current time is after January 1, 2024",
    "namedNew": {"name": "time_check_guard"},
    "root": {
      "logic": 12,
      "parameters": [
        {"context": 61},
        {"value": "1703923200", "value_type": 103}
      ]
    }
  }
}
```
**Key Learning**: `logic: 12` (≥) compares `context: 61` (current time) with fixed timestamp.

### Example 3: Basic Witness Usage
**Purpose**: Understand witness data mechanism
```json
{
  "account": "test_account",
  "data": {
    "description": "Check if provided amount is greater than 100",
    "namedNew": {"name": "amount_check_guard"},
    "root": {
      "logic": 11,
      "parameters": [
        {"identifier": 1},
        {"value": "100", "value_type": 103}
      ]
    },
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 103,
        "value": null
      }
    ]
  }
}
```
**Key Learning**: `identifier: 1` references witness data, `logic: 11` (>) compares with constant.

**Using this Guard**:
```json
{
  "witness": {
    "guards": ["amount_check_guard"],
    "witness": [
      {
        "guard": "amount_check_guard",
        "identifier": 1,
        "type": 103,
        "witness": "150"
      }
    ]
  }
}
```

### Example 4: Object Query
**Purpose**: Understand object querying
```json
{
  "account": "test_account",
  "data": {
    "description": "Check if Treasury balance is at least 1 SUI",
    "namedNew": {"name": "balance_check_guard"},
    "root": {
      "logic": 12,
      "parameters": [
        {
          "object": {"identifier": 1},
          "query": {"module": "treasury", "function": "Balance"},
          "parameters": []
        },
        {"value": "1000000000", "value_type": 103}
      ]
    },
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "value": null
      }
    ]
  }
}
```
**Key Learning**: `object` + `query` retrieves data from other objects for comparison.

---

## Integration Patterns

### Treasury Integration
**Purpose**: Control Treasury operations with Guard verification

#### Withdrawal Control
```json
{
  "withdraw_guard": {
    "op": "add",
    "data": [
      {
        "guard": "time_limit_guard",
        "max_withdrawal_amount": "100000000000"
      }
    ]
  }
}
```
Treasury allows withdrawals up to 100 SUI only when Guard verification passes.

#### Deposit Control
```json
{
  "deposit_guard": "authorized_users_guard"
}
```
Only users passing Guard verification can deposit funds.

### Service Integration
**Purpose**: Control Service access and purchase eligibility

```json
{
  "guard": {
    "guard": "qualification_check_guard"
  }
}
```
Only users passing Guard verification can purchase or recommend the Service.

### Permission Integration
**Purpose**: Add conditional requirements to Permission-based access

```json
{
  "permission": {
    "op": "add entity",
    "entities": [
      {
        "address": {"name_or_address": "user_address"},
        "permissions": [
          {"index": 703, "guard": "business_hours_guard"}
        ]
      }
    ]
  }
}
```
User has Treasury withdrawal permission but only during hours when Guard allows.

### Repository Integration
**Purpose**: Control Repository data access

```json
{
  "policy": {
    "op": "add",
    "data": [
      {
        "key": "sensitive_field",
        "dataType": 204,
        "guard": "clearance_check_guard"
      }
    ]
  }
}
```
Repository field requires Guard verification before allowing access.

### Machine Integration
**Purpose**: Control Machine workflow progression

```json
{
  "forwards": [
    {
      "name": "complete_milestone",
      "guard": "completion_verification_guard",
      "weight": 2
    }
  ]
}
```
Machine workflow advances only when Guard confirms completion criteria.

💡 **Integration Strategy**: Start with simple Guards, test functionality, then add to other objects. Objects can reference multiple Guards for layered security.

---

## Complete Examples

### Advanced Time Control Guard
```json
{
  "account": "business_manager",
  "data": {
    "description": "Allow operations only during business hours (9 AM - 6 PM) with 1-hour cooldown between operations",
    "namedNew": {
      "name": "business_hours_cooldown_guard",
      "onChain": true,
      "tags": ["business-hours", "cooldown", "time-control"]
    },
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 19,
          "parameters": [
            {
              "logic": 12,
              "parameters": [
                {"calc": 6, "parameters": [{"context": 61}, {"identifier": 1}]},
                {"identifier": 2}
              ]
            },
            {
              "logic": 14,
              "parameters": [
                {"calc": 6, "parameters": [{"context": 61}, {"identifier": 1}]},
                {"identifier": 3}
              ]
            }
          ]
        },
        {
          "logic": 12,
          "parameters": [
            {"context": 61},
            {
              "calc": 2,
              "parameters": [
                {"identifier": 4},
                {"identifier": 5}
              ]
            }
          ]
        }
      ]
    },
    "table": [
      {"identifier": 1, "bWitness": false, "value_type": 103, "value": "86400"},
      {"identifier": 2, "bWitness": false, "value_type": 103, "value": "32400"},
      {"identifier": 3, "bWitness": false, "value_type": 103, "value": "64800"},
      {"identifier": 4, "bWitness": true, "value_type": 103, "value": null},
      {"identifier": 5, "bWitness": false, "value_type": 103, "value": "3600"}
    ]
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

**Logic Breakdown**:
- AND logic combines business hours check + cooldown check
- Business hours: time-of-day between 9 AM (32400s) and 6 PM (64800s)
- Cooldown: current time ≥ (last action time + 1 hour)
- Uses modulo (calc: 6) to get time-of-day from timestamp

**How to use**:
```json
{
  "witness": {
    "guards": ["business_hours_cooldown_guard"],
    "witness": [
      {
        "guard": "business_hours_cooldown_guard",
        "identifier": 4,
        "type": 103,
        "witness": "1703923200"
      }
    ]
  }
}
```

### Multi-Object Verification Guard
```json
{
  "account": "system_admin",
  "data": {
    "description": "Verify user has Treasury balance ≥ 5 SUI AND specific permission AND is current transaction signer",
    "namedNew": {
      "name": "multi_verification_guard",
      "onChain": true,
      "tags": ["multi-object", "balance", "permission", "identity"]
    },
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 12,
          "parameters": [
            {
              "object": {"identifier": 1},
              "query": {"module": "treasury", "function": "Balance"},
              "parameters": []
            },
            {"identifier": 2}
          ]
        },
        {
          "object": {"identifier": 3},
          "query": {"module": "permission", "function": "Has Rights"},
          "parameters": [
            {"context": 60},
            {"identifier": 4}
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"context": 60},
            {"identifier": 5}
          ]
        }
      ]
    },
    "table": [
      {"identifier": 1, "bWitness": true, "value_type": 101, "value": null},
      {"identifier": 2, "bWitness": false, "value_type": 103, "value": "5000000000"},
      {"identifier": 3, "bWitness": true, "value_type": 101, "value": null},
      {"identifier": 4, "bWitness": false, "value_type": 103, "value": "1001"},
      {"identifier": 5, "bWitness": true, "value_type": 101, "value": null}
    ]
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

**Logic Breakdown**:
- AND logic requires ALL three conditions
- Treasury balance ≥ 5 SUI (5000000000 MIST)
- User has permission index 1001 in Permission object
- Current signer equals expected address (identity verification)

**How to use**:
```json
{
  "witness": {
    "guards": ["multi_verification_guard"],
    "witness": [
      {
        "guard": "multi_verification_guard",
        "identifier": 1,
        "type": 101,
        "witness": "treasury_address"
      },
      {
        "guard": "multi_verification_guard",
        "identifier": 3,
        "type": 101,
        "witness": "permission_address"
      },
      {
        "guard": "multi_verification_guard",
        "identifier": 5,
        "type": 101,
        "witness": "expected_signer_address"
      }
    ]
  }
}
```

---

## Common Issues & Troubleshooting

### Guard Creation Problems
**Problem**: "Invalid root configuration" or "Schema validation failed"  
**Solutions**:
1. Check `identifier` values are unique and within 1-255 range
2. Ensure `value_type` codes match actual data types (101=address, 103=numbers)
3. Verify logic operation codes (11-20) and math operation codes (2-6) are valid
4. Confirm witness entries have `value: null`

### Logic Verification Errors  
**Problem**: "Guard evaluation failed" or unexpected true/false results
**Solutions**:
1. Test individual conditions before combining with AND/OR logic
2. Use string format for large numbers: `"1000000000"` not `1000000000`
3. Verify object queries use correct module/function names from reference tables
4. Check mathematical operations receive compatible data types

### Witness Data Issues
**Problem**: "Witness verification failed" or "Type mismatch"
**Solutions**:
1. Ensure witness `type` matches Guard table `value_type` exactly
2. Verify `identifier` exists in Guard's table configuration
3. Use proper address format with "0x" prefix for blockchain addresses
4. Only modify `witness` field value - leave other witness parameters unchanged

### Integration Problems
**Problem**: Guard blocks legitimate operations
**Solutions**:
1. Test Guard independently before integrating with Treasury/Service/Permission
2. Verify referenced objects exist and are accessible on same network
3. Review business logic - ensure Guard conditions match actual requirements
4. Check time-based logic for timezone and timestamp format issues

⚠️ **Development Reminder**: Guards are immutable once created. Always test logic thoroughly on testnet before creating production Guards. For modifications, clone existing Guards and adjust parameters rather than recreating from scratch.

💡 **Testing Strategy**: Start with simple logic, verify basic functionality, then gradually add complexity. Test each parameter change before deploying to production environments.

---