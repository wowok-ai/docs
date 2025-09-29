# Permission Object: Your Access Control Foundation

> "Define who can do what in your digital spaces - the security system that powers all your Wowok objects"

**MCP Tools**: 
- [`wowok_permission_mcp_server`](https://www.npmjs.com/package/wowok_permission_mcp_server) 

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: Permission capabilities and hierarchical structure
- **[Core Parameters](#core-parameters)**: All configuration options organized by operation type
- **[Data Types & Formats](#data-types--formats)**: Permission indexes and address formats
- **[Integration Patterns](#integration-patterns)**: How Permission controls other objects
- **[Complete Examples](#complete-examples)**: Working configurations with expected results
- **[Query Capabilities](#query-capabilities)**: What you can query and how to access Permission data

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Create new Permission | [Core Parameters → Account & Object](#1-account--object-identification) |
| Add team members | [Core Parameters → Permission Assignment](#3-permission-assignment) |
| Set administrators | [Core Parameters → Admin Management](#4-admin-management) |
| Create custom permissions | [Core Parameters → Business Permissions](#5-business-permissions) |
| Find permission indexes | [Data Types & Formats → Built-in Permissions](#built-in-permission-indexes) |
| Connect to other objects | [Integration Patterns](#integration-patterns) |
| Query permission data | [Query Capabilities](#query-capabilities) |

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
| `add entity` | Setting up new team member with multiple permissions | Admin |
| `add permission` | Adding multiple people to same role | Admin |
| `remove permission` | Revoking specific access while keeping other permissions | Admin |
| `remove entity` | Completely removing someone from Permission object | Admin |
| `transfer permission` | Moving role from departing to new team member | Admin |
| `add admin` | Adding new administrators to help manage permissions | Builder only |
| `remove admin` | Removing administrators from management roles | Builder only |
| `set admin` | Replacing all administrators with new set | Builder only |
💡 **Cold Wallet Integration**: Add external addresses for enhanced security: `"name_or_address": "0x1234..."` - hardware wallets, multi-sig addresses, or any external address can receive full administrative rights for secure management through external wallet interfaces.

💡 **AI Prompt Tip**: "Assign [permission types] to team member [name] for [business purpose] with appropriate Guard conditions."

---

### 4. Admin Management

Permission objects use a two-tier administrative structure for organizational flexibility while maintaining security boundaries.

| Role | Capabilities | Restrictions |
|------|-------------|-------------|
| **Builder** | • Transfer Builder role (permanent, irreversible)<br>• Add/remove/replace all administrators<br> | Cannot assign/remove specific permissions to addresses<br>Cannot manage custom business permissions<br>Cannot perform operational permission tasks |
| **Admin** | • Assign/remove any permissions to any addresses<br> • Manage custom business permissions<br>• All permission operations | Cannot remove Builder or other admins<br>Cannot transfer Builder role |

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

💡 **AI Prompt Tip**: "Add [person] as administrator with capability to [specific admin tasks] while maintaining Builder role for admin management."

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

## Data Types & Formats

### Built-in Permission Indexes


**Query All Permissions**: Use `mcp_wowok_permission_Built-in_permissions` with `{"module": "all"}` for complete list or `{"module": "treasury"}` for specific module.

### Address Format Options

All address fields use consistent format with local name resolution:

**External Address**: `"name_or_address": "0x1234567890abcdef..."` for hardware wallets or multi-sig  
**Named Address**: `"name_or_address": "alice_manager"` for saved local names  
**Resolution Priority**: `"local_mark_first": true` searches saved names first, `false` searches account names first

**Local Marks**: Local marks are nicknames you save on your device for addresses you use often. Set `local_mark_first: true` to search your saved nicknames first, or `false` to search your account names first. This way you can reference "alice_manager" instead of remembering the long address.

**Troubleshooting Address Issues**: If "Address not found" errors occur, try switching the `local_mark_first` setting or use the full blockchain address directly.
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
<img width="1903" height="1065" alt="image" src="https://github.com/user-attachments/assets/cfc84597-6c1b-4c70-9fd2-0fe5e429ca08" />

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

## AI Assistant Troubleshooting

Instead of manually diagnosing Permission issues, use these AI prompts to get personalized help:

### 🤖 **Permission Assignment Issues**

**Prompt**: "I'm getting 'Permission denied for permission assignment' when trying to assign permission [PERMISSION_INDEX] to address [ADDRESS] in Permission object [PERMISSION_NAME]. Can you help me diagnose what's wrong?"

**The AI will check**:
- Your admin rights in the Permission object
- Address format and local_mark_first settings
- Whether custom permissions need to be created first
- Network consistency between components

### 🤖 **Object Integration Problems**

**Prompt**: "I'm trying to create a [SERVICE/TREASURY/REPOSITORY] object but getting 'Permission object not found' error with Permission object [NAME_OR_ADDRESS]. What should I check?"

**The AI will verify**:
- Permission object existence and accessibility
- Network alignment between objects  
- Permission object configuration and admin structure
- Correct reference format (name vs address)

### 🤖 **Admin Role Confusion**

**Prompt**: "I can't perform admin operations on Permission object [NAME]. I'm getting 'Access denied' but I think I should have admin rights. Can you check my role and permissions?"

**The AI will clarify**:
- Your current role (Builder vs Admin vs User)
- What operations your role allows
- How to transfer or escalate permissions if needed
- Admin hierarchy and delegation rules

### 🤖 **Permission Index Problems**

**Prompt**: "Permission index [INDEX] isn't working as expected in my Permission object [NAME]. Can you verify if this permission exists and help me understand how to use it correctly?"

**The AI will**:
- Check built-in permission indexes and their functions
- Verify custom permission setup (≥1000 indexes)
- Query live permission configurations
- Suggest correct permission assignment methods

### 🎯 **General Troubleshooting Prompt**

**Comprehensive Issue Resolution**: "I'm having trouble with Permission object [NAME]. Here's what I'm trying to do: [DESCRIBE_GOAL]. Here's the error I'm getting: [ERROR_MESSAGE]. Can you walk me through diagnosing and fixing this step by step?"

💡 **Development Tip**: Test Permission configurations with minimal team first. Use query operations to verify assignments before creating dependent objects. Save working JSON configurations for future use.

---

## Query Capabilities

Permission objects provide comprehensive query access to examine access control structures, audit permissions, and verify authorization settings.

**What You Can Query:**
- **Complete permission structure** - including administrator roles, entity access rights, and custom permission definitions
- **Entity permission details** - specific access rights for any address with pagination support
- **Built-in permission definitions** - available permissions across all protocol modules
- **Administrator hierarchy** - builder and admin relationships for governance auditing

**Quick Query Examples:**
- "Show me the complete permission structure for permission_name including all administrators"
- "List all entities that have permissions in this permission object, showing their access levels"
- "Check what specific permissions entity address 0x123... has in the system"
- "Show me all built-in permissions available for the treasury and service modules"

**Detailed Query Reference:** See the complete [Permission Object Query Capabilities](./Query_Reference.md#permission-object-query-capabilities) in the Wowok Query Technical Reference for field specifications, query operations, and advanced usage patterns.

---
