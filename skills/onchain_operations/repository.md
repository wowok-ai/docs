# onchain_operations / repository

Define trusted data sources with typed policies, data read/write rules, and contribution incentives.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Repository uses `WithPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallRepository_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: WithPermissionObject
  object: WithPermissionObject;
  
  description?: string;               // Repository description (max 4000 bcs chars)
  
  // Policy rules (discriminated union)
  policies?: {
    op: "add" | "set";
    policy: PolicyRule[];             // Policy rule list
  } | {
    op: "remove";
    policy: string[];                 // Policy rule names to remove
  } | {
    op: "clear";
  };
  
  // Add data
  data_add?: 
    | {
        name: string;                  // Data item name (must match PolicyRule)
        write_guard?: NameOrAddress;   // Guard for write permissions
        data: SupportedValue;          // Data value (ID = timestamp or signer)
      }
    | {
        name: string;                  // Data item name
        items: {
          data: {
            id: AccountOrMark_Address | number;  // Data item ID
            data: SupportedValue;       // Data value
          }[];
          write_guard?: NameOrAddress;  // Guard for write permissions
        }[];
      };
  
  // Remove data
  data_remove?: 
    | {
        name: string;                  // Data item name
        write_guard?: NameOrAddress;   // Guard for verifying deletion permission
      }
    | {
        name: string;
        items: {
          id: (AccountOrMark_Address | number)[]; // Data item IDs
          write_guard?: NameOrAddress;  // Guard for verifying deletion permission
        }[];
      };
  
  rewards?: ObjectsOp;                 // Reward object list (contribution incentives)
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;          // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, ReceivedObjectsOrRecently.  
`PolicyRule` schema is defined in the MCP source at `src/schema/query/index.ts`.