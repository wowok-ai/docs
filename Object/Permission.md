# Permission Object: Your Access Control Foundation

> "Define who can do what in your digital spaces - the security system that powers all your other Wowok objects"

**MCP Tools**: 
- `mcp_wowok_permission_permission_operations` (main operations)
- `mcp_wowok_permission_Built-in_permissions` (query permission indexes)
- `mcp_wowok_permission_replace_permission_object` (batch management)

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: Permission capabilities and hierarchical structure
- **[Core Parameters](#core-parameters)**: All configuration options organized by operation type
- **[Data Types & Formats](#data-types--formats)**: Permission indexes and address formats
- **[Integration Patterns](#integration-patterns)**: How Permission controls other objects
- **[Complete Examples](#complete-examples)**: Working configurations with expected results

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Create new Permission | [Core Parameters → Account & Object](#1-account--object-identification) |
| Add team members | [Core Parameters → Permission Assignment](#3-permission-assignment) |
| Set administrators | [Core Parameters → Admin Management](#4-admin-management) |
| Create custom permissions | [Core Parameters → Business Permissions](#5-business-permissions) |
| Find permission indexes | [Data Types & Formats → Built-in Permissions](#built-in-permission-indexes) |
| Connect to other objects | [Integration Patterns](#integration-patterns) |

---

## Overview

### Definition
Permission objects provide granular access control for Wowok operations through index-based permission assignment. Every other Wowok object (Treasury, Service, Repository, etc.) requires a Permission object to control who can perform which operations.

### Core Capabilities
- **Index-Based Access Control**: Assign specific permissions through numeric indexes (built-in 100-811, custom ≥1000)
- **Hierarchical Management**: Clear builder→admin→user structure with defined boundaries  
- **Multi-Object Governance**: Single Permission object can control unlimited other objects
- **Guard Integration**: Add time, location, or condition-based verification to any permission
- **External Address Support**: Grant permissions to hardware wallets, multi-sig addresses, or any external address

### Organizational Identity
Permission objects represent persistent organizational identity beyond individual accounts, providing stable governance structure that maintains continuity despite personnel changes. Like company legal entities, they offer lasting institutional control that could prove valuable for future reputation and trust systems.

### Core Workflow
1. **Create**: Initialize Permission object with [basic configuration](#2-basic-configuration)
2. **Structure**: Set up [admin hierarchy](#4-admin-management) with clear role boundaries
3. **Define**: Create [custom permissions](#5-business-permissions) for specific organizational needs
4. **Assign**: Grant [specific permissions](#3-permission-assignment) to team members and external addresses
5. **Connect**: Reference Permission in [other objects](#integration-patterns) to inherit full team structure
6. **Manage**: Update assignments, transfer roles, and maintain governance as organization evolves

---

## Core Parameters

### 1. Account & Object Identification

**Note**: All Permission operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

#### Object Reference (Existing Permission)
```json
{
  "object": "existing_permission_name_or_address"
}
```

#### Object Creation (New Permission)
```json
{
  "object": {
    "name": "permission_identifier",
    "onChain": true,
    "tags": ["category", "project", "team"],
    "useAddressIfNameExist": false
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Optional | Human-readable identifier for easy reference |
| `onChain` | boolean | Optional | Whether metadata visible on blockchain |
| `tags` | string[] | Optional | Organizational labels for categorization |
| `useAddressIfNameExist` | boolean | Optional | Name conflict resolution: false=use new name, true=use address |

**Auto-Creation vs Manual Control**: When creating other Wowok objects, you choose the permission model - omit the permission field for automatic Permission creation (you become Builder and sole administrator), or specify existing Permission like `"permission": "team_permission"` to inherit complete team structure.

💡 **AI Prompt Tip**: "Create Permission object for [organization type] managing [list of objects] with [team structure description]."

---

### 2. Basic Configuration

```json
{
  "description": "Permission object purpose and scope",
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

| Parameter | Options | Description |
|-----------|---------|-------------|
| `description` | string | Human-readable purpose explanation |
| `network` | `sui testnet`, `sui mainnet`, `wowok testnet`, `wowok mainnet` | Target blockchain |
| `retentive` | `always`, `session` | Session persistence mode |

---

### 3. Permission Assignment

Permission assignment supports entity-centered (assign multiple permissions to one person) or permission-centered (assign one permission to multiple people) approaches.

#### Add Permissions by Entity (Person-Centered)
```json
{
  "permission": {
    "op": "add entity",
    "entities": [
      {
        "address": {
          "name_or_address": "alice_manager",
          "local_mark_first": true
        },
        "permissions": [
          {"index": 702},
          {"index": 703, "guard": "manager_approval_guard"}
        ]
      }
    ]
  }
}
```

#### Add Entities by Permission (Role-Centered)
```json
{
  "permission": {
    "op": "add permission", 
    "permissions": [
      {
        "index": 702,
        "entities": [
          {
            "address": {
              "name_or_address": "alice_manager",
              "local_mark_first": true
            }
          },
          {
            "address": {
              "name_or_address": "bob_staff",
              "local_mark_first": true
            },
            "guard": "working_hours_guard"
          }
        ]
      }
    ]
  }
}
```

#### Other Permission Operations
```json
{
  "permission": {
    "op": "remove permission",
    "address": {"name_or_address": "alice_manager", "local_mark_first": true},
    "index": [702, 703]
  }
}
```

```json
{
  "permission": {
    "op": "remove entity",
    "addresses": [
      {"name_or_address": "alice_manager", "local_mark_first": true}
    ]
  }
}
```

```json
{
  "permission": {
    "op": "transfer permission",
    "from": {"name_or_address": "alice_manager", "local_mark_first": true},
    "to": {"name_or_address": "carol_new_manager", "local_mark_first": true}
  }
}
```

| Operation | Use Case | Who Can Execute |
|-----------|----------|-----------------|
| `add entity` | Setting up new team member with multiple permissions | Builder, Admin |
| `add permission` | Adding multiple people to same role | Builder, Admin |
| `remove permission` | Revoking specific access while keeping other permissions | Builder, Admin |
| `remove entity` | Completely removing someone from Permission object | Builder, Admin |
| `transfer permission` | Moving role from departing to new team member | Builder, Admin |

💡 **Cold Wallet Integration**: Add external addresses for enhanced security: `"name_or_address": "0x1234..."` - hardware wallets, multi-sig addresses, or any external address can receive full administrative rights for secure management through external wallet interfaces.

💡 **AI Prompt Tip**: "Assign [permission types] to team member [name] for [business purpose] with appropriate Guard conditions."

---

### 4. Admin Management

Permission objects use a two-tier administrative structure for organizational flexibility while maintaining security boundaries.

| Role | Capabilities | Restrictions |
|------|-------------|-------------|
| **Builder** | • Transfer Builder role (permanent, irreversible)<br>• Add/remove/replace all administrators<br>• All admin capabilities plus ownership transfer<br>• Replace entire Permission object via batch operations | None - ultimate control |
| **Admin** | • Assign/remove any permissions to any addresses<br>• Add other admins<br>• Manage custom business permissions<br>• All permission operations | Cannot remove Builder or other admins<br>Cannot transfer Builder role |

#### Add Administrators
```json
{
  "admin": {
    "op": "add",
    "addresses": [
      {
        "name_or_address": "alice_manager",
        "local_mark_first": true
      }
    ]
  }
}
```

#### Admin Operations Summary
```json
{
  "admin": {
    "op": "remove",        // Builder only: Remove specific admins
    "addresses": [...]
  }
}
```

```json
{
  "admin": {
    "op": "set",          // Builder only: Replace all admins
    "addresses": [...]
  }
}
```

```json
{
  "admin": {
    "op": "removeall"     // Builder only: Remove all admins
  }
}
```

#### Transfer Builder Role
```json
{
  "builder": {
    "name_or_address": "alice_manager", 
    "local_mark_first": true
  }
}
```

⚠️ **Critical Warning**: Builder transfer is permanent and irreversible. The original Builder loses all control over the Permission object and cannot reclaim ownership.

💡 **AI Prompt Tip**: "Add [person] as administrator with capability to [specific admin tasks] while maintaining Builder control."

---

### 5. Business Permissions

Custom permissions (index ≥1000) enable organization-specific access control beyond Wowok's built-in operations. You define their meaning and implementation in your workflows.

#### Understanding Custom Permissions
Custom permissions are organizational concepts you create - the system provides the index structure, you define the business logic. When other objects reference these permissions, they inherit your defined access patterns.

**Common organizational approaches**:
- **Department-based**: Marketing (1001), Engineering (1002), Finance (1003)
- **Security levels**: Public (1100), Internal (1101), Confidential (1102)  
- **Project phases**: Planning (1200), Development (1201), Launch (1202)
- **Geographic regions**: US Operations (1300), EU Operations (1301)
- **Functional roles**: Customer Support (1400), Quality Assurance (1401)

#### Add Custom Business Permissions
```json
{
  "biz_permission": {
    "op": "add",
    "data": [
      {"index": 1001, "name": "Customer Management"},
      {"index": 1002, "name": "Project Delivery"}, 
      {"index": 1003, "name": "Financial Oversight"}
    ]
  }
}
```

#### Remove Custom Business Permissions
```json
{
  "biz_permission": {
    "op": "remove",
    "permissions": [1001, 1002]
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `op` | string | Required | `add` or `remove` |
| `index` | number | Required | Permission index ≥1000 (for add operation) |
| `name` | string | Required | Human-readable permission description (for add operation) |
| `permissions` | number[] | Required | Permission indexes to remove (for remove operation) |

💡 **AI Prompt Tip**: "Create custom business permissions for [organization type] including [role descriptions] with logical index numbering."

---

### 6. Advanced Features

#### Witness Verification System
For operations requiring Guard verification, provide real-time proof data like current location or temporary access codes:

```json
{
  "witness": {
    "guards": ["guard_address"],
    "witness": [
      {
        "guard": "guard_address",
        "identifier": 1,
        "type": 101,
        "witness": "your_proof_value",
        "cmd": [{"cmd": 30, "witness": 30}],
        "cited": 1,
        "witnessTypes": [30, 31, 32]
      }
    ]
  }
}
```

**Witness Usage**: Only modify `witness` field with your proof value (GPS coordinates for location Guards, timestamps for time-based restrictions, verification codes for approval workflows, etc.). All other fields are system-generated.

---

## Data Types & Formats

### Built-in Permission Indexes

| Module | Index Range | Key Permissions | Example Use |
|--------|-------------|----------------|-------------|
| **Repository** | 100-105 | 100: Launch, 103: Policy | Data storage management |
| **Service** | 200-219 | 200: Launch, 212: Publish | Service offering management |
| **Demand** | 260-266 | 260: Launch, 261: Refund | Service request management |
| **Machine** | 600-607 | 600: Launch, 607: Publish | Workflow management |
| **Progress** | 650-655 | 650: Launch, 651: Operator | Workflow execution tracking |
| **Treasury** | 700-707 | 700: Launch, 702: Deposit, 703: Withdraw | Fund management |
| **Arbitration** | 800-811 | 800: Launch, 807: Vote, 808: Arbitrate | Dispute resolution |

**Complete Permission List**: [Repository: 100-105] [Service: 200-219] [Demand: 260-266] [Machine: 600-607] [Progress: 650-655] [Treasury: 700-707] [Arbitration: 800-811]

**Query All Permissions**: Use `mcp_wowok_permission_Built-in_permissions` with `{"module": "all"}` for complete list or `{"module": "treasury"}` for specific module.

### Address Format Options

All address fields use consistent format with local name resolution:

**External Address**: `"name_or_address": "0x1234567890abcdef..."` for hardware wallets or multi-sig  
**Named Address**: `"name_or_address": "alice_manager"` for saved local names  
**Resolution Priority**: `"local_mark_first": true` searches saved names first, `false` searches account names first

**Troubleshooting Address Issues**: If "Address not found" errors occur, try switching the `local_mark_first` setting or use the full blockchain address directly.

### Witness Data Types

| Type Code | Data Type | Common Applications |
|-----------|-----------|-------------------|
| **100** | Bool | Yes/no verification flags |
| **101** | Address | Object relationship proofs |
| **103** | U64 | Timestamps, large numbers |
| **104** | Vec<U8> | Binary data, document hashes |

---

## Integration Patterns

### Single Permission, Multiple Objects
Permission objects serve as unified governance across unlimited other objects with inherited settings. When Treasury, Service, and Repository all reference the same Permission, team members automatically get consistent access across all resources where alice_manager can deposit to Treasury AND publish Services AND manage Repository data through one permission assignment.

### Permission + Guard Integration  
Guards add conditional verification to any permission: `{"index": 703, "guard": "working_hours_guard"}` creates layered security where users need both the permission AND must pass Guard verification (current time is business hours, user is at office location, manager approves via app, etc.).

### Multi-Permission Architecture
Organizations can use different Permission objects for different security domains:
- **Public Permission**: Community access to Repository data
- **Business Permission**: Service and financial operations  
- **Admin Permission**: System configuration and governance

### Common Permission Patterns

| Pattern | Team Structure | Permission Design | Example Configuration |
|---------|---------------|-------------------|--------------------|
| **Solo Operation** | Single person | Builder = Admin = User | All operations through one account |
| **Small Team** | Owner + 2-5 members | Builder (owner) + Admin (manager) + members with specific permissions | Builder: all access, Admin: operational control, Members: task-specific permissions |
| **Department Structure** | Multiple departments | Separate Permissions per department + shared admin Permission | Each department has independent Permission object |
| **Enterprise Governance** | Complex hierarchy | Builder (board) + Admins (executives) + department-specific custom permissions | Board controls Builder role, executives manage operations, departments use custom permissions ≥1000 |

---

## Complete Examples

### Basic Team Setup
```json
{
  "account": "cafe_owner",
  "data": {
    "object": {
      "name": "coffee_shop_permission",
      "onChain": true,
      "tags": ["business", "coffee-shop", "operations"]
    },
    "description": "Coffee shop permission management for treasury, operations, and staff",
    "admin": {
      "op": "add",
      "addresses": [
        {
          "name_or_address": "alice_manager",
          "local_mark_first": true
        }
      ]
    },
    "biz_permission": {
      "op": "add",
      "data": [
        {"index": 1001, "name": "Customer Service"},
        {"index": 1002, "name": "Inventory Management"},
        {"index": 1003, "name": "Staff Scheduling"}
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

### Team Permission Assignment
```json
{
  "account": "cafe_owner",
  "data": {
    "object": "coffee_shop_permission",
    "permission": {
      "op": "add entity",
      "entities": [
        {
          "address": {
            "name_or_address": "alice_manager",
            "local_mark_first": true
          },
          "permissions": [
            {"index": 700},
            {"index": 702},
            {"index": 703},
            {"index": 1001},
            {"index": 1002},
            {"index": 1003}
          ]
        },
        {
          "address": {
            "name_or_address": "bob_barista",
            "local_mark_first": true
          },
          "permissions": [
            {"index": 1001},
            {"index": 1002}
          ]
        },
        {
          "address": {
            "name_or_address": "carol_parttime",
            "local_mark_first": true
          },
          "permissions": [
            {"index": 1001}
          ]
        }
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

**Expected Result**: alice_manager gets full operational control (Treasury create/deposit/withdraw + all business operations), bob_barista gets customer service and inventory duties, carol_parttime gets customer service only.

### External Address Integration
```json
{
  "account": "cafe_owner",
  "data": {
    "object": "coffee_shop_permission",
    "permission": {
      "op": "add entity",
      "entities": [
        {
          "address": {
            "name_or_address": "0x1234567890abcdef1234567890abcdef12345678",
            "local_mark_first": false
          },
          "permissions": [
            {"index": 700},
            {"index": 703}
          ]
        }
      ]
    }
  }
}
```

**Expected Result**: Hardware wallet address gets Treasury management permissions for secure financial operations through external wallet interface.

---

## Common Issues & Troubleshooting

### Permission Assignment Failures
**Problem**: "Permission denied for permission assignment"  
**Solutions**:
1. Verify you have Admin rights in Permission object (check if your address is in admin list)
2. Ensure target addresses use correct format and local_mark_first setting (see [Address Format Options](#address-format-options))
3. For custom permissions: create in biz_permission before assigning to users

### Object Integration Errors  
**Problem**: "Permission object not found" when creating Treasury/Service/Repository  
**Solutions**:
1. Verify Permission object exists using exact name or address
2. Ensure Permission and target object are on same network
3. Check Permission object is properly configured with required admin structure

### Admin Role Confusion
**Problem**: "Cannot perform admin operations" or "Access denied"  
**Solutions**: Review the [Admin Management](#4-admin-management) role table - Builder can do everything including ownership transfer, Admin can assign permissions but cannot remove other admins or transfer Builder role

### Technical Implementation Issues
**Problem**: Permission indexes don't work as expected  
**Solutions**:
1. Use exact permission indexes from the [Built-in Permission table](#built-in-permission-indexes)
2. Ensure custom permissions use indexes ≥1000
3. Query live permission lists using `mcp_wowok_permission_Built-in_permissions` for verification

💡 **Development Tip**: Test Permission configurations with minimal team first. Use query operations to verify assignments before creating dependent objects. Save working JSON configurations for future use.

---
