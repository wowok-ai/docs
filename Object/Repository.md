# Repository Object: Your Shared Information Hub

> "Create organized information storage that multiple entities(Human, AI and Device) can contribute to and reference"

**MCP Tool**: [wowok_repository_mcp_server](https://www.npmjs.com/package/wowok_repository_mcp_server)

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

---

## Overview

### What is Repository?
Repository is a policy-driven, on-chain database enabling structured information storage with configurable access controls. Repository data is permanently stored on blockchain and can be queried by other Wowok objects for verification and automation.

### Core Capabilities
- **Data Storage**: Store typed data (text, number, address, boolean, array)
- **Access Control**: Field-level permissions and Guard integration  
- **Cross-Object Integration**: Other Wowok objects can query Repository data
- **Policy Management**: Define and modify data structure rules

**Example**: Errand delivery service uses Repository for communication records (messages, photos, locations) with automated verification by other objects.
 [→ Complete Errand Flower Delivery Implementation](./Errand-flower_delivery.md)
---

## Core Parameters

### 1. Account & Object Identification

**Note**: All Repository operations require an `account` parameter to specify the transaction signer. If not specified, the current active account is used by default.

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

| Parameter | Options | Description | Default | When to Use |
|-----------|---------|-------------|---------|-------------|
| `description` | string | Human-readable purpose | None | Always recommended |
| `guard` | string/null | Additional access verification | null | Sensitive data |
| `mode` | 0 or 1 | **0**: Free (any data) <br>**1**: Strict (policy only) | **0 (Free)** | **Free**: Prototyping<br>**Strict**: Team collaboration |

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
| `permissionIndex` | number ≥1000 | Optional | Custom permission requirement. Set this to require a specific permission (from the Permission object) for users to access or modify this field. For example, if you set `"permissionIndex": 1001`, only users with permission 1001 can operate on this field. |
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
- **Permission-controlled fields**: Add custom permissions (≥1000) for role-based access control
- **Guard-only fields**: Add Guard verification without permission requirements for condition-based access
- **Double-protected fields**: Combine both custom permissions AND Guard verification for maximum security

**Field Access Control Combinations:**
1. **No Protection**: Field accessible to anyone with basic Repository access
2. **Permission Only**: `"permissionIndex": 1001` - User must have specific permission in Permission object
3. **Permission + Embedded Guard**: Permission itself has Guard requirements - user must pass Guard to get permission, then use permission to access field
4. **Guard Only**: `"guard": "field_guard"` - Direct Guard verification for field access, no permission needed
5. **Permission + Field Guard**: Both permission requirement AND separate field-level Guard verification

💡 **AI Prompt Tip**: "Design Repository field structure for [data type] with [access requirements] and [validation needs]."

#### Data vs Policy Best Practices

**Policy Rules Apply to Both Modes:**
- If Policy is defined for a field, data operations MUST follow the Policy rules (dataType, permissions, etc.) regardless of mode
- Policy defines the "contract" for how data should be structured and accessed

**Mode Differences:**
- **Mode 0 (Free)**: Can add data to fields without pre-defined Policy, OR follow existing Policy rules if Policy exists
- **Mode 1 (Strict)**: Can ONLY add data to fields that have pre-defined Policy

**When to Set Policy:**
- Define field structure and access controls before team collaboration
- Enforce data consistency and validation rules
- Set custom permissions or Guard verification for sensitive fields

**When to Add Data Without Policy (Free Mode Only):**
- Rapid prototyping with unknown data structure
- Personal experimentation and flexible data storage
- Simple data collection before formalizing structure

**Policy Migration Pattern:**
1. **Start Free**: "Help me create a Repository in free mode for [project type] experimentation"
2. **Add Data**: "Help me add data fields for [describe your data needs] without strict structure"  
3. **Analyze Patterns**: "Review my Repository usage and suggest which fields to formalize as policies"
4. **Create Policies**: "Design policies for these data fields: [list your used fields] with [access requirements]"
5. **Switch Mode**: "Help me migrate my Repository to strict mode with proper policy validation"

This migration approach allows you to prototype quickly without predefined structure, then formalize the data structure once you understand your requirements. Note that switching from free to strict mode requires adding policies before any new data operations can succeed.

**AI Prompt Template:**
```
"I have a Repository in free mode with [describe your data]. Please design policies for strict mode that cover these data types: [list field names and data types you've been using]. I need [describe access requirements]. Show me the complete policy configuration and explain each field's purpose. Don't execute the operation yet, just show me the configuration first."
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
    "guards": ["guard_address"],
    "witness": [
      {
        "guard": "guard_address",
        "identifier": 1,
        "type": 120,  // String type
        "witness": "happy_confirmed",  // ← YOUR REAL-TIME PROOF
        "cmd": [],  // Empty array, no on-chain data queries required
        "cited": 1,
        "witnessTypes": []  // Empty array, no witness types required
      }
    ]
  }
}
```


**Witness Parameters:**
| Parameter | User Input | Description |
|-----------|------------|-------------|
| `guards`, `guard`, `cmd`, `cited`, `type`, `identifier`, `witnessTypes`, `payload` | ❌ | Auto-filled by system |
| **`witness`** | **✅** | **User proof value (only field to modify)** |

**Payload Field:**
The `payload` field is automatically managed by the system and carries additional verification data or context information. Users do not need to manually modify this field - it's populated automatically based on the verification requirements and provides richer context for complex validation scenarios.

**Witness Logic Mechanism:**

The Witness system works through **predictable type derivation**:
1. **Guard defines verification need**: "Verify user owns this Order"
2. **System derives witness type**: Since it's about Order ownership, witness type = 34 (Order address)  
3. **User provides witness value**: Actual Order address they claim to own
4. **Guard verifies**: Checks if the provided Order address is actually owned by the user

**Type Derivation Examples:**
- Guard needs "Arb's Order verification" → Type 34 → User provides specific Order address
- Guard needs "Progress's Machine verification" → Type 33 → User provides specific Machine address  
- Guard needs "Service relationship proof" → Type 32/38 → User provides specific Service address

**Witness Examples:**
- **Mood verification**: "happy" (your current emotional state when making a decision)
- **Dynamic code**: "AUTH2024" (a temporary verification code sent to your phone)
- **Real-time preference**: "urgent" (your current priority level for this specific request)
- **Private assessment**: "8.5" (your confidential rating that shouldn't be stored on-chain)
- **Object relationship**: "0x123abc..." (specific address proving your relationship to an object)

**Complete Witness Types:**
| Code | Description | Example Use |
|------|-------------|-------------|
| **30** | Order's Progress address | Progress address associated with Order object |
| **31** | Order's Machine address | Machine address associated with Order object |
| **32** | Order's Service address | Service address associated with Order object |
| **33** | Progress's Machine address | Machine address associated with Progress object |
| **34** | Arb's Order address | Order address under arbitration dispute |
| **35** | Arb's Arbitration address | Arbitration object handling the dispute |
| **36** | Arb's Progress address | Progress address related to arbitration |
| **37** | Arb's Machine address | Machine address related to arbitration |
| **38** | Arb's Service address | Service address related to arbitration |

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
  "address": 202509102100
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

**Local Marks**: Local marks are nicknames you save on your device for addresses you use often. Set `local_mark_first: true` to search your saved nicknames first, or `false` to search your account names first. This way you can reference "user_name" instead of remembering the long address.

---

## Integration Patterns

### Cross-Object References
**Repository → Service**: Service objects can query customer preferences, delivery addresses, or purchase history stored in Repository to customize offerings and automate order processing.

**Repository → Guard**: Guard objects can verify Repository data (like completion status, approval records, or verification timestamps) as conditions for payment releases or workflow progression. For example, checking weather data stored in Repository to determine if outdoor service delivery should proceed.

**Repository → Machine**: Machine can reference Repository for unified data management. Machine workflow execution data is stored in Progress objects, while Repository provides optional centralized data storage for Machine instances. For example, a Machine can bind to a Repository with "message" field, allowing flexible real-time updates to shared communication data across all Progress instances of that Machine.

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

