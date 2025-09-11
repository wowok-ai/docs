# Repository Object: Your Shared Information Hub

> "Create organized information storage that multiple entities(Human, AI and Device) can contribute to and reference"

**MCP Tool**: `mcp_wowok_repository_repository_operations`

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: What Repository is and core capabilities
- **[Core Parameters](#core-parameters)**: All configuration options organized by function
- **[Data Types & Formats](#data-types--formats)**: Reference tables for types and addresses  
- **[Integration Patterns](#integration-patterns)**: How Repository works with other objects
- **[Complete Examples](#complete-examples)**: Ready-to-use configurations

### Navigation by Need
| I want to... | Go to section |
|--------------|---------------|
| Create basic Repository | [Core Parameters → Account & Object](#1-account--object-identification) |
| Add/remove data | [Core Parameters → Data Operations](#3-data-operations) |
| Set up field structure | [Core Parameters → Policy Management](#4-policy-management) |
| Connect with Guards/Services | [Integration Patterns](#integration-patterns) |
| See working examples | [Complete Examples](#complete-examples) |

### Parameter Quick Lookup
| Parameter | Section | Required | Purpose |
|-----------|---------|----------|---------|
| `account`, `object` | [Account & Object](#1-account--object-identification) | Yes | Basic creation |
| `mode`, `description` | [Basic Configuration](#2-basic-configuration) | Partial | Behavior control |
| `policy` | [Policy Management](#4-policy-management) | Strict mode only | Field definitions |
| `data` operations | [Data Operations](#3-data-operations) | As needed | Add/remove data |
| `reference`, `witness` | [Advanced Features](#5-advanced-features) | Optional | Complex integration |

---

## Overview

### What is Repository?
Repository is a policy-driven, on-chain database enabling structured information storage with configurable access controls. Repository data is permanently stored on blockchain and can be queried by other Wowok objects for verification and automation.

### Core Capabilities
- **Data Storage**: Store typed data (text, numbers, addresses, arrays, booleans)
- **Access Control**: Field-level permissions and Guard integration  
- **Cross-Object Integration**: Other Wowok objects can query Repository data
- **Policy Management**: Define and modify data structure rules

**Example**: Errand delivery service uses Repository for communication records (messages, photos, locations) with automated verification by other objects.

---

## Core Parameters

### 1. Account & Object Identification

#### Global Required Structure
```json
{
  "account": "signer_account_name_or_address",
  "data": {
    // All Repository configuration here
  }
}
```

#### Object Reference (Existing)
```json
{
  "object": "existing_repository_name_or_address"
}
```
**Use this when**: You want to modify an existing Repository (add data, update policies, etc.)

#### Object Creation (New)
```json
{
  "object": {
    "name": "repository_name",
    "onChain": true,
    "permission": "permission_object_reference",
    "tags": ["category", "purpose"],
    "useAddressIfNameExist": false
  }
}
```
**Use this when**: You're creating a brand new Repository from scratch

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Optional | Repository identifier |
| `onChain` | boolean | Optional | Metadata visibility on blockchain |
| `permission` | string/object | Required | Permission object reference |
| `tags` | string[] | Optional | Organizational labels |
| `useAddressIfNameExist` | boolean | Optional | Name conflict resolution |

---

### 2. Basic Configuration

```json
{
  "description": "Repository purpose description",
  "guard": "guard_object_reference_or_null",
  "mode": 1
}
```

| Parameter | Options | Description | When to Use |
|-----------|---------|-------------|-------------|
| `description` | string | Human-readable purpose | Always recommended |
| `guard` | string/null | Additional access verification | Sensitive data |
| `mode` | 0 or 1 | **0**: Free (any data) <br>**1**: Strict (policy only) | **Free**: Prototyping<br>**Strict**: Team collaboration |

**Mode Selection Guidance:**
- **Free Mode (0)**: Use when you need flexibility to add any data fields without planning ahead. Good for personal notes, experimentation, or rapidly changing requirements.
- **Strict Mode (1)**: Use when you need structured collaboration with predefined data fields. Good for team projects, formal documentation, or consistent data validation.

💡 **AI Prompt Tip**: "Help me choose Repository mode for [project type] with [team size] collaborators."

---

### 3. Data Operations

#### Add Data by Key (Group by Field)
```json
{
  "data": {
    "op": "add_by_key",
    "data": {
      "key": "field_name",
      "data": [
        {
          "address": "target_address",
          "data": {
            "type": 204,
            "data": "content"
          }
        }
      ]
    }
  }
}
```

#### Add Data by Address (Group by User)
```json
{
  "data": {
    "op": "add_by_address",
    "data": {
      "address": "target_address", 
      "data": [
        {
          "key": "field_name",
          "data": {
            "type": 204,
            "data": "content"
          }
        }
      ]
    }
  }
}
```

#### Remove Data
```json
{
  "data": {
    "op": "remove",
    "data": [
      {
        "key": "field_name",
        "address": "target_address"
      }
    ]
  }
}
```

**Operation Selection Guide**:
- **add_by_key**: Use when multiple users contribute to the same data field. For example, all team members adding messages to a "chat" field, creating a shared conversation thread.
- **add_by_address**: Use when storing complete records for individual users. For example, each user has their own profile data with multiple fields (name, email, preferences) stored together.
- **remove**: Delete specific data entries by providing both the field name and user address. This removes only the targeted data, leaving other entries intact.

---

### 4. Policy Management

#### Add/Set Field Definitions
```json
{
  "policy": {
    "op": "add",
    "data": [
      {
        "key": "field_name",
        "description": "Field purpose",
        "dataType": 204,
        "permissionIndex": 1001,
        "guard": "field_guard"
      }
    ]
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | Required | Unique field identifier |
| `description` | string | Required | Field purpose explanation |
| `dataType` | 200-206 | Required | Data type enforcement |
| `permissionIndex` | number ≥1000 | Optional | Custom permission requirement |
| `guard` | string | Optional | Additional field verification |

#### Policy Operations
| Operation | Purpose | Parameters |
|-----------|---------|------------|
| `add` | Add new fields | `data` array |
| `set` | Replace all fields | `data` array |
| `remove` | Delete specific fields | `keys` array |
| `removeall` | Delete all fields | None |
| `rename` | Change field names | `data` with `old`/`new` |

**Policy Field Planning:**
- **Simple fields**: Use basic data types (string/number) without permissions for general team access
- **Restricted fields**: Add custom permissions (≥1000) when only certain team members should write
- **Sensitive fields**: Add Guard verification when additional proof is required beyond permissions

💡 **AI Prompt Tip**: "Design Repository field structure for [data type] with [access requirements] and [validation needs]."

#### Data vs Policy Best Practices

**When to Set Policy First:**
- Mode 1 (Strict): Policy MUST be defined before data operations
- Team collaboration with structured fields
- Formal projects requiring data validation

**When to Add Data Directly:**
- Mode 0 (Free): Data can be added without pre-defined policy
- Rapid prototyping and experimentation
- Simple personal data storage

**Policy Migration Pattern:**
1. **Start Free**: "Help me create a Repository in free mode for [project type] experimentation"
2. **Add Data**: "Help me add data fields for [describe your data needs] without strict structure"  
3. **Analyze Patterns**: "Review my Repository usage and suggest which fields to formalize as policies"
4. **Create Policies**: "Design policies for these data fields: [list your used fields] with [access requirements]"
5. **Switch Mode**: "Help me migrate my Repository to strict mode with proper policy validation"

This migration approach allows you to prototype quickly without predefined structure, then formalize the data structure once you understand your requirements. Note that switching from free to strict mode requires adding policies before any new data operations can succeed.

**AI Prompt Template:**
```
"I have a Repository in free mode with [describe your data]. Please design policies for strict mode that cover these data types: [list field names and data types you've been using]. I need [describe access requirements]. Show me the complete policy configuration and explain each field's purpose. I'll confirm before implementing."
```

---

### 5. Advanced Features

#### Cross-Repository References
```json
{
  "reference": {
    "op": "add",
    "objects": ["repository1", "repository2"]
  }
}
```

References declare which other objects use this Repository's data, creating a dependency map for integration management. This helps you track which Services, Machines, or Guards rely on your Repository data, making it easier to plan updates and avoid breaking dependent systems.

| Operation | Purpose |
|-----------|---------|
| `set` | Replace all references |
| `add` | Add new references |
| `remove` | Remove specific references |
| `removeall` | Clear all references |

#### Network Configuration
```json
{
  "session": {
    "network": "wowok testnet",
    "retentive": "always"
  }
}
```

| Parameter | Options | Description |
|-----------|---------|-------------|
| `network` | `sui mainnet/testnet`<br>`wowok mainnet/testnet` | Blockchain network |
| `retentive` | `always` / `session` | Session persistence |

#### Guard Witness System

**What is a Witness?**
A Witness is **real-time data that doesn't exist on the blockchain** and must be provided at the moment of verification. Unlike regular data checks that query existing blockchain information, witnesses capture dynamic, temporal, or private information that only you know.

**Witness vs Regular Data Verification:**
- **Regular Verification**: Checks existing blockchain data (account balances, object ownership, transaction history)  
- **Witness Verification**: Requires real-time input that only exists when you provide it

**When do you need Witnesses?**
- **Time-sensitive decisions**: Your mood when making a decision, current location, today's weather preference
- **Dynamic verification codes**: One-time passwords, temporary access codes, session tokens
- **Private information**: Personal opinions, confidential ratings, subjective assessments  
- **External real-time data**: Current market sentiment, immediate availability status, live preferences

```json
{
  "witness": {
    "guards": ["guard1", "guard2"],
    "witness": [
      {
        "guard": "guard_object",
        "cmd": [{"cmd": 1, "witness": 35}],
        "cited": 0,
        "type": 101,
        "identifier": 1,
        "witnessTypes": [35],
        "witness": "happy_confirmed"  // ← YOUR REAL-TIME PROOF
      }
    ]
  }
}
```

**Witness Parameters:**
| Parameter | User Input | Description |
|-----------|------------|-------------|
| `guard`, `cmd`, `cited`, `type`, `identifier`, `witnessTypes` | ❌ | Auto-filled by system |
| **`witness`** | **✅** | **User proof value (only field to modify)** |

**Witness Examples:**
- **Mood verification**: "happy" (your current emotional state when making a decision)
- **Dynamic code**: "AUTH2024" (a temporary verification code sent to your phone)
- **Real-time preference**: "urgent" (your current priority level for this specific request)
- **Private assessment**: "8.5" (your confidential rating that shouldn't be stored on-chain)

**Common Witness Types:**
| Code | Description | Example Use |
|------|-------------|-------------|
| **35** | Arbitration context | Current dispute resolution preference |
| 30-38 | Dynamic session data | Real-time operation context or temporary states |

---

## Data Types & Formats

### Repository Data Types

| Code | Type | Description | Example Use |
|------|------|-------------|-------------|
| **200** | address | Blockchain addresses | User accounts, object references |
| **201** | address vector | Address arrays | Team member lists |
| **202** | positive number | Numbers/decimals | Amounts, counts, ratings |
| **203** | positive number vector | Number arrays | Price lists, score collections |
| **204** | string | Text content | Messages, descriptions, IPFS links |
| **205** | string vector | Text arrays | Tags, option lists |
| **206** | bool | Boolean values | Status flags, toggles |

### Address Format Options

#### Simple Address
```json
{
  "address": 123456789
}
```
Use integers for time-based addresses (like timestamps) or when you have numeric identifiers that need to be converted to blockchain addresses.

#### Named Address
```json
{
  "address": {
    "local_mark_first": true,
    "name_or_address": "user_name_or_0x123..."
  }
}
```
Use named addresses when you've saved addresses locally with human-readable names. Set `local_mark_first: true` to search your saved names first, or `false` to search account names first.

---

## Integration Patterns

### Cross-Object References
**Repository → Service**: Service objects can query customer preferences, delivery addresses, or purchase history stored in Repository to customize offerings and automate order processing.
**Repository → Guard**: Guard objects can verify Repository data (like completion status, approval records, or verification timestamps) as conditions for payment releases or workflow progression.  
**Repository → Machine**: Machine workflows can update Repository data during progress (status updates, deliverable confirmations, or communication logs) and query Repository for decision-making.

### Guard Integration
Repository can be protected by Guards requiring:
- Time-based access windows
- Multi-party approval
- External verification proof
- Complex business logic

### Multi-Repository Architecture
Link repositories for:
- Customer data + Service provider data
- Project documentation + Transaction records  
- Public information + Private details

### Common Repository Patterns

| Pattern | Configuration | Use Case |
|---------|---------------|----------|
| **Personal Storage** | `mode: 0`, minimal policy | Individual notes, experimentation |
| **Team Collaboration** | `mode: 1`, structured policy | Shared project data, documentation |
| **Service Integration** | `mode: 1`, Guards, references | Cross-object automation, payments |

**AI Prompt Template for Repository Design:**
```
"I need a Repository for [describe your use case]. I have [number] users who need to [describe access needs]. Please design a Repository configuration including mode, policies, and security settings. Show me the complete configuration and explain why each setting fits my needs. I'll confirm before creating it."
```

---

## Complete Examples

### Basic Repository Setup
```json
{
  "account": "my_account",
  "data": {
    "object": {
      "name": "team_communication",
      "onChain": true,
      "permission": "team_permission",
      "tags": ["communication", "team"]
    },
    "description": "Team project communication records",
    "mode": 1,
    "policy": {
      "op": "add",
      "data": [
        {
          "key": "message",
          "description": "Team messages",
          "dataType": 204,
          "permissionIndex": 1001
        },
        {
          "key": "attachment",
          "description": "File links",
          "dataType": 204
        }
      ]
    }
  },
  "session": {
    "network": "wowok testnet",
    "retentive": "always"
  }
}
```
Result should look like:
![img_v3_02q1_525eb735-3a79-4468-a892-eb67b4e4979g](https://github.com/user-attachments/assets/449c6c01-0642-4157-9601-53d92c890293)

### Add Communication Data
```json
{
  "account": "my_account",
  "data": {
    "object": "team_communication",
    "data": {
      "op": "add_by_address",
      "data": {
        "address": {"local_mark_first": false, "name_or_address": ""},
        "data": [
          {
            "key": "message",
            "data": {
              "type": 204,
              "data": "Project milestone completed"
            }
          },
          {
            "key": "attachment", 
            "data": {
              "type": 204,
              "data": "ipfs://QmXrP7jKd..."
            }
          }
        ]
      }
    }
  }
}
```
Result should look like:
![img_v3_02q1_5d1f60fc-d36c-4010-975e-0dc5ae8a049g](https://github.com/user-attachments/assets/3c973ca1-f175-4806-b384-0a65b4fdb705)
![img_v3_02q1_c8363c47-d730-498b-9554-51dd41d8078g](https://github.com/user-attachments/assets/5ec7a552-a676-4037-909f-86a8c334d991)

### Guard-Protected Repository
```json
{
  "account": "admin_account",
  "data": {
    "object": {
      "name": "sensitive_records",
      "permission": "admin_permission",
      "onChain": false
    },
    "guard": "time_access_guard",
    "mode": 1,
    "policy": {
      "op": "add",
      "data": [
        {
          "key": "confidential_data",
          "description": "Sensitive information",
          "dataType": 204,
          "permissionIndex": 2000,
          "guard": "approval_guard"
        }
      ]
    }
  }
}
```
Result should look like:
<img width="1878" height="815" alt="image" src="https://github.com/user-attachments/assets/cc2efb5b-a6f3-4078-8c47-57d9a80a7ec7" />


**Key Features**: This example demonstrates layered security with Repository-level Guard (`time_access_guard`) controlling when anyone can access the Repository, plus Field-level Guard (`approval_guard`) requiring additional approval for the specific confidential data field. The high permission requirement (2000) restricts write access to senior users, while private metadata (`onChain: false`) keeps the Repository name and tags off the public blockchain.

---

## Common Issues & Troubleshooting

### Permission Errors
**Problem**: "Permission denied for data operation"
**Solution**: 
1. Check if Repository mode is 1 (strict) and policy exists
2. Verify your account has required `permissionIndex` permission
3. Ensure Guard conditions are met if configured

### Data Type Mismatches
**Problem**: "Invalid data type for field"
**Solution**:
1. Verify `dataType` in policy matches data `type` in operation
2. Check Repository-specific types (200-206) vs general Wowok types (100-122)
3. Use correct type codes for your data format

### Mode Conflicts
**Problem**: "Cannot add data without policy in strict mode"
**Solution**:
1. **Option A**: Switch to mode 0 (free) temporarily
2. **Option B**: Define policy first, then add data
3. **Option C**: Use migration pattern (free → data → strict → policy)

### Address Resolution Issues
**Problem**: "Address not found or invalid"
**Solution**:
1. Check `local_mark_first` setting for named addresses
2. Verify address format (string, number, or object)
3. Ensure referenced addresses exist in your local marks

### Guard Witness Errors
**Problem**: "Witness verification failed"
**Solution**:
1. Only modify the `witness` field value
2. Keep all other witness parameters unchanged
3. Ensure proof value matches Guard requirements

---

## Appendix: Complete Wowok Protocol Types

*For reference when Repository needs to integrate with other Wowok objects:*

| Code | Type | Code | Type |
|------|------|------|------|
| 100 | Bool | 111 | Option\<Address\> |
| 101 | Address | 112 | Option\<Bool\> |
| 102 | U8 | 113 | Option\<U8\> |
| 103 | U64 | 114 | Option\<U64\> |
| 104 | Vec\<U8\> | 115 | Option\<U128\> |
| 105 | U128 | 116 | Option\<U256\> |
| 106 | Vec\<Address\> | 117 | Option\<String\> |
| 107 | Vec\<Bool\> | 118 | Option\<Vec\<U8\>\> |
| 108 | Vec\<Vec\<U8\>\> | 119 | Vec\<U256\> |
| 109 | Vec\<U64\> | 120 | String |
| 110 | Vec\<U128\> | 121 | Vec\<String\> |
|  |  | 122 | U256 |

---

**Related Documentation**: [→ Complete Errand Flower Delivery Implementation](./Errand-flower_delivery.md)
