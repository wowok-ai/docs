# Schema: onchain_operations

> On-chain operations for WoWok objects. Discriminated union by `operation_type` with 16 object types. Every operation may submit a blockchain transaction and consume gas.

---

## Top-Level Structure

```typescript
OnchainOperations {
  operation_type: string;     // One of 16 types (see below)
  data: object;               // Type-specific data (required)
  env?: CallEnv;              // Optional environment
  submission?: SubmissionCall; // Optional Guard submission data
}
```

### CallEnv (Common)

```typescript
CallEnv {
  account?: string;              // Operating account (empty = default)
  permission_guard?: string[];   // Permission Guard ID list
  no_cache?: boolean;            // Disable cache
  network?: "localnet" | "testnet"; // Target network
  referrer?: string;             // Referrer ID
}
```

### SubmissionCall (Common)

```typescript
SubmissionCall {
  type: "submission";
  guard: {
    object: string;    // Guard object name or ID
    impack: boolean;   // Whether affects final outcome
  }[];
  submission: {
    guard: string;     // Guard object name or ID
    submission: {
      identifier: number;      // 0-255
      value_type: ValueType;   // Expected type
      value: SupportedValue;   // User value
    }[];
  }[];
}
```

---

## Operation Types

### service

**Description**: Create and manage product/service listings with transparent promises, bind workflow templates, set pricing, issue discount coupons.

**Data Schema**:

```typescript
CallService_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  // Create new order (customer purchase)
  order_new?: {
    buy: {
      items: {
        name: string;        // Product name
        stock: number;       // Quantity
        wip_hash: string;    // WIP file hash
      }[];
      total_pay: CoinParam;  // Payment amount
      discount?: string;     // Discount object ID
      payment_remark?: string;
      payment_index?: number;
    };
    agents?: ManyAccountOrMark_Address;  // Order agents
    order_required_info?: string;        // Contact or WTS proof
    transfer?: AccountOrMark_Address;    // New order owner
    namedNewOrder?: NamedObject;         // Name for new Order
    namedNewAllocation?: NamedObject;    // Name for new Allocation
    namedNewProgress?: NamedObject;      // Name for new Progress
  };
  
  description?: string;      // Service description
  location?: string;         // Service location
  
  // Sales operations
  sales?: {
    op: "add" | "set" | "remove" | "clear";
    sales?: {
      name: string;          // Product name
      price: number;         // Price
      stock: number;         // Stock quantity
      suspension: boolean;   // Whether suspended
      wip: string;           // WIP file URL
      wip_hash: string;      // WIP hash
    }[];
    sales_name?: string[];   // For remove op
    bReplace?: boolean;      // For add/set ops
  };
  
  repositories?: ObjectsOp;  // Repository operations
  rewards?: ObjectsOp;       // Reward operations
  arbitrations?: ObjectsOp;  // Arbitration operations
  machine?: string | null;   // Machine object ID
  
  // Discount coupon
  discount?: {
    name: string;
    discount_type: "Ratio" | "Amount" | "Ratio2";
    discount_value: number;
    benchmark?: number;
    time_ms_start?: number;
    time_ms_end?: number;
    count?: number;
    recipient: ManyAccountOrMark_Address;
    transferable?: boolean;
  };
  
  discount_destroy?: string[];  // Discount IDs to destroy
  customer_required?: string[]; // Required info (phone, email, etc.)
  
  // Order fund allocators
  order_allocators?: {
    description: string;
    threshold: number;
    allocators: {
      guard: string;         // Guard object ID
      sharing: {
        who: Recipient;      // Recipient specification
        sharing: number;     // Amount or rate
        mode: "Amount" | "Rate" | "Surplus";
      }[];
      fix?: number;          // Fixed amount
      max?: number;          // Maximum amount
    }[];
  } | null;
  
  buy_guard?: string | null;     // Purchase Guard
  compensation_fund_add?: CoinParam;
  compensation_locked_time_add?: number;
  compensation_fund_receive?: ReceivedBalanceOrRecently;
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;            // Contact object
  pause?: boolean;               // Pause new orders
  publish?: boolean;             // Publish service (immutable)
}
```

---

### machine

**Description**: Design and deploy automated workflow templates (Machines) that define how services are delivered.

**Data Schema**:

```typescript
CallMachine_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  // Generate new Progress
  progress_new?: {
    task?: string | null;           // Task ID
    repository?: ObjectsOp;         // Repository list
    progress_namedOperator?: {      // Manage namespace operators
      op: "add" | "set" | "remove";
      name: string;
      operators: ManyAccountOrMark_Address;
    };
    namedNew?: NamedObject;         // Name for new Progress
  };
  
  description?: string;             // Machine description
  repository?: ObjectsOp;           // Consensus repositories
  
  // Node operations - TWO MODES (mutually exclusive)
  node?: 
    // Mode 1: Incremental operations
    | {
        op: "add" | "set";
        nodes: MachineNode[];
        bReplace?: boolean;
      }
    | { op: "remove"; nodes: string[] }
    | { op: "clear" }
    | { op: "exchange"; node_one: string; node_other: string }
    | { op: "rename"; node_name_old: string; node_name_new: string }
    | { op: "remove prior node"; pairs: NodeRemovePriorNodeData[] }
    | { op: "add forward"; data: NodeAddForwardData[] }
    | { op: "remove forward"; data: NodeRemoveForwardData[] }
    // Mode 2: Complete replacement from file
    | { json_or_markdown_file: string };
  
  pause?: boolean;                  // Pause new Progress
  publish?: boolean;                // Publish (nodes immutable)
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}

// MachineNode definition
MachineNode {
  name: string;                     // Node name (initial is "")
  pairs: {
    prior_node: string;             // Previous node ("" for entry)
    forwards: {
      name: string;                 // Forward name
      namedOperator?: string;       // Per-Progress namespace
      permissionIndex?: number;     // Shared permission index
      weight: number;               // Forward weight
      guard?: string;               // Optional Guard
    }[];
    threshold?: number;             // Weight threshold
  }[];
}
```

---

### progress

**Description**: Track and manage active workflows in real-time.

**Data Schema**:

```typescript
CallProgress_Data {
  object: string;                   // Progress ID or name (required)
  task?: string | null;             // Target task ID
  repository?: ObjectsOp;           // Context repositories
  
  // Manage namespace operators
  progress_namedOperator?: {
    op: "add" | "set" | "remove";
    name: string;
    operators: ManyAccountOrMark_Address;
  };
  
  // Advance workflow
  operate?: {
    operation: {
      next_node_name: string;       // Target node
      forward: string;              // Forward name
    };
    hold?: boolean;                 // Lock permission
    adminUnhold?: boolean;          // Allow admin unlock
    message?: string;               // Operation note
  };
}
```

---

### repository

**Description**: Read/write database with consensus field + address as key, strongly-typed data as value.

**Data Schema**:

```typescript
CallRepository_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  description?: string;             // Repository description
  
  // Policy rules
  policies?: {
    op: "add" | "set" | "remove" | "clear";
    policy?: {
      name: string;
      type_guard?: string;          // Guard for type validation
      read_guard?: string;          // Guard for read access
      consensus?: boolean;          // Whether consensus required
      write_guard?: string;         // Guard for write access
    }[];
    policy_name?: string[];         // For remove op
  };
  
  // Add data
  data_add?: {
    name: string;
    write_guard?: string;
    data: SupportedValue;
  } | {
    name: string;
    items: {
      data: {
        id: string | number;
        data: SupportedValue;
      }[];
      write_guard?: string;
    }[];
  };
  
  // Remove data
  data_remove?: {
    name: string;
    write_guard?: string;
  } | {
    name: string;
    items: {
      id: (string | number)[];
      write_guard?: string;
    }[];
  };
  
  rewards?: ObjectsOp;              // Reward operations
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### arbitration

**Description**: Access a transparent on-chain arbitration system for resolving order conflicts.

**Data Schema**:

```typescript
CallArbitration_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  // Create new Arb for order
  dispute?: {
    order: string;                  // Order ID
    description?: string;
    proposition: string[];          // Dispute propositions
    fee: CoinParam;                 // Arbitration fee
    namedArb?: NamedObject;         // Name for new Arb
  };
  
  description?: string;             // Institution description
  location?: string;                // Arbitration location
  fee?: number;                     // Arbitration fee
  pause?: boolean;                  // Pause arbitration
  
  // Confirm user's materials
  confirm?: {
    arb: string;                    // Arb object ID
    voting_deadline: number | null;
  };
  
  // Modify voting deadline
  voting_deadline_change?: {
    arb: string;
    voting_deadline: number | null;
  };
  
  // Vote on propositions
  vote?: {
    arb: string;
    votes: number[];                // Supported proposition indices
    voting_guard?: string;          // Guard for voting
  };
  
  // Arbitration feedback
  feedback?: {
    arb: string;
    feedback: string;
  };
  
  // Final arbitration result
  arbitration?: {
    arb: string;
    feedback: string;
    indemnity: number;              // Compensation amount
  };
  
  // Request resubmission
  reset?: {
    arb: string;
    feedback: string;
  };
  
  // Withdraw arbitration fee
  arb_withdraw?: {
    arb: string;
  };
  
  // Distribute fees
  fees_transfer?: {
    to: { allocation: string } | { treasury: string };
    payment_remark: string;
    payment_index: number;
    newPayment?: NamedObject;
  };
  
  usage_guard?: string | null;      // Guard for applying
  
  // Guard for voting
  voting_guard?: {
    op: "add" | "set" | "remove" | "clear";
    guards?: {
      guard: string;
      service_identifier?: number;
    }[];
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### contact

**Description**: Manage on-chain instant messaging contact profiles.

**Data Schema**:

```typescript
CallContact_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  my_status?: string;               // Status message
  description?: string;             // Contact description
  location?: string;                // Location
  
  // IM contact list
  ims?: {
    op: "add" | "set" | "remove" | "clear";
    im?: {
      at: string;                   // IM address
      description?: string;
    }[];
    im_at?: string[];               // For remove op
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### treasury

**Description**: Create and manage treasury for team funds with deposit/withdrawal rules.

**Data Schema**:

```typescript
CallTreasury_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  description?: string;             // Treasury description
  receive?: ReceivedBalanceOrRecently; // Receive CoinWrapper
  
  // Deposit funds
  deposit?: {
    coin: CoinParam;
    by_external_deposit_guard?: string;
    payment_info: {
      remark?: string;
      index?: number;
    };
    namedNewPayment?: NamedObject;
  };
  
  // Withdraw funds
  withdraw?: {
    amount: { fixed: number } | { by_external_withdraw_guard: string };
    recipient: AccountOrMark_Address;
    payment_info: {
      remark?: string;
      index?: number;
    };
    namedNewPayment?: NamedObject;
  };
  
  // External deposit Guards
  external_deposit_guard?: {
    op: "add" | "set" | "remove" | "clear";
    guards?: {
      guard: string;
      amount: {
        type: "GuardU64Identifier" | "Fixed";
        value: number;
      };
    }[];
  };
  
  // External withdraw Guards
  external_withdraw_guard?: {
    op: "add" | "set" | "remove" | "clear";
    guards?: {
      guard: string;
      amount: {
        type: "GuardU64Identifier" | "Fixed";
        value: number;
      };
    }[];
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### reward

**Description**: Create reward pools and set claim conditions by Guard verification.

**Data Schema**:

```typescript
CallReward_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  claim?: string;                   // Guard object ID for claiming
  description?: string;             // Reward description
  coin_add?: CoinParam;             // Add funds
  receive?: ReceivedBalanceOrRecently; // Unwrap CoinWrapper
  
  // Add reward Guards
  guard_add?: {
    guard: string;                  // Guard object ID
    recipient: Recipient;           // Who receives reward
    amount: {
      type: "GuardU64Identifier" | "Fixed";
      value: number;
    };
    expiration_time?: number;       // Expiration timestamp
    store_from_id?: number;         // Storage identifier
  }[];
  
  guard_remove?: string[];          // Guard IDs to remove
  guard_pause?: boolean;            // Pause claiming
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}

// Recipient specification
Recipient =
  | { GuardIdentifier: number }    // From Guard table
  | { Entity: string }             // Specific address
  | { Signer: boolean };           // Transaction signer
```

---

### allocation

**Description**: Create distribution plans to auto-distribute funds to multiple recipients.

**Data Schema**:

```typescript
CallAllocation_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  description?: string;             // Allocation description
  bPaused?: boolean;                // Pause distribution
  
  // Execute distribution
  withdraw?: {
    guard: string;                  // Guard for verification
    submission?: SubmissionCall;
  };
  
  // Deposit funds
  deposit?: {
    coin: CoinParam;
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### permission

**Description**: Define who can perform which operations on WoWok objects.

**Data Schema**:

```typescript
CallPermission_Data {
  // Object reference - string (existing) or object (create new)
  object?: NormalObject;
  
  description?: string;             // Permission description
  
  // Permission table operations
  table?: {
    op: "add perm by index" | "set perm by index" | "remove perm by index";
    index: number;                  // Permission index
    entity: ManyAccountOrMark_Address;
  } | {
    op: "add perm by entity" | "set perm by entity" | "remove perm by entity";
    entity: AccountOrMark_Address;
    index: number[];
  };
  
  // Remark operations
  remark?: {
    op: "set" | "remove" | "clear";
    index?: number;
    remark?: string;
  };
  
  apply?: string[];                 // Objects to apply permission to
  builder?: AccountOrMark_Address;  // Set/transfer ownership
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### guard

**Description**: Create immutable programmable validation rules that return boolean results.

**Data Schema**:

```typescript
CallGuard_Data {
  namedNew?: NamedObject;           // Name for new Guard
  description?: string;             // Guard description
  
  // Data table definitions
  table?: {
    identifier: number;             // 0-255
    b_submission: boolean;          // User submission required
    value_type: ValueType;          // Expected type
    value?: SupportedValue;         // Default value (if b_submission=false)
    name?: string;                  // Description
  }[];
  
  // Rule tree root (required)
  root: {
    type: "node";
    node: GuardNode;                // Direct node tree
  } | {
    type: "file";
    file_path: string;              // Load from file
    format?: "json" | "markdown";
  };
  
  // Dependent Guards
  rely?: {
    guards: string[];
    logic_or?: boolean;             // OR vs AND logic
  };
}

// GuardNode (recursive structure)
GuardNode = {
  // Multi-operand nodes (2-8 children)
  logic?: "and" | "or";
  nodes: GuardNode[];
} | {
  // Single-operand nodes
  logic?: "not";
  node: GuardNode;
} | {
  // Query nodes
  type: "query";
  query: number | string;
  object: {
    identifier: number;
    convert_witness?: number;
  };
  parameters: GuardNode[];
} | {
  // Context nodes
  type: "context";
  context: "Signer" | "Clock" | "Guard";
} | {
  // Identifier nodes
  type: "identifier";
  identifier: number;
} | {
  // Constant value nodes
  type: "constant";
  value_type: ValueType;
  value: SupportedValue;
}
```

---

### personal

**Description**: Establish and manage your on-chain public identity. **CRITICAL: Everything here is PERMANENTLY PUBLIC on the blockchain!**

**Data Schema**:

```typescript
CallPersonal_Data {
  // Object reference - string (existing) or object (create new)
  object?: NormalObject;
  
  description?: string;             // Public description
  avatar?: string;                  // Avatar URL
  resource?: string;                // Resource object ID
  entity?: string;                  // Entity registrar ID
  linker?: string;                  // Entity linker ID
  mark?: string;                    // Address mark object ID
}
```

---

### payment

**Description**: Send instant, irreversible coin transfers to any wallet address.

**Data Schema**:

```typescript
CallPayment_Data {
  // Object reference - string (existing) or object (create new)
  object?: NormalObject;
  
  for?: string;                     // Payment purpose
  to?: AccountOrMark_Address;       // Recipient
  coin?: CoinParam;                 // Amount to pay
  remark?: string;                  // Payment remark
  index?: number;                   // Payment index
  guard?: string;                   // Guard for validation
}
```

---

### demand

**Description**: Post service requests with reward pools on-chain.

**Data Schema**:

```typescript
CallDemand_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  description?: string;             // Demand description
  location?: string;                // Demand location
  
  // Reward operations
  rewards?: ObjectsOp;
  
  // Service Guard operations
  guards?: {
    op: "add" | "set" | "remove" | "clear";
    guards?: {
      guard: string;
      service_identifier?: number;
    }[];
  };
  
  // Submit solution
  present?: {
    service: string;                // Service ID
    namedNew?: NamedObject;         // Name for presenter
  };
  
  // Feedback on solution
  feedback?: {
    presenter: string;              // Presenter ID
    score: number;                  // Score (0-100)
    feedback?: string;              // Feedback text
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

### order

**Description**: Manage the order lifecycle, including arbitration, progress advancement, refunds, and setting agents.

**Data Schema**:

```typescript
CallOrder_Data {
  object: string;                   // Order ID or name (required)
  
  // Manage agents
  agents?: ManyAccountOrMark_Address;
  
  // Set required info (Contact or WTS)
  required_info?: string | null;
  
  // Advance progress
  progress?: {
    operation: {
      next_node_name: string;
      forward: string;
    };
    hold?: boolean;
    adminUnhold?: boolean;
    message?: string;
  };
  
  // Submit compensation request
  arb_confirm?: {
    arb: string;                    // Arb object ID
    confirm: boolean;               // Confirm materials valid
    description?: string;
    proposition?: string[];         // Compensation claims
  };
  
  // Appeal arbitration result
  arb_objection?: {
    arb: string;
    objection: string;              // Appeal reason
  };
  
  // Claim compensation
  arb_claim_compensation?: {
    arb: string;
  };
  
  // Receive funds/objects
  receive?: QueryReceivedResult;
  
  // Transfer order ownership
  transfer_to?: AccountOrMark_Address;
}
```

---

### gen_passport

**Description**: Create immutable verified credentials after Guard validation passes.

**Data Schema**:

```typescript
CallGenPassport_Data {
  guard: string;                    // Guard object ID to verify
  info?: SubmissionCall;            // Optional submission data
}
```

---

## Common Sub-Schemas Reference

### TypedPermissionObject

```typescript
TypedPermissionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;                 // Object name
      tags?: string[];               // Tags
      onChain?: boolean;             // Public on-chain name
      replaceExistName?: boolean;    // Force claim name
      type_parameter?: string;       // Token type
      permission?: DescriptionObject; // Permission object
    };
```

### WithPermissionObject

```typescript
WithPermissionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      permission?: DescriptionObject;
    };
```

### DescriptionObject

```typescript
DescriptionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      description?: string;
    };
```

### NormalObject

```typescript
NormalObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
    };
```

### NamedObject

```typescript
NamedObject {
  name?: string;
  tags?: string[];
  onChain?: boolean;
  replaceExistName?: boolean;
}
```

### CoinParam

```typescript
CoinParam = 
  | { balance: string | number }     // Amount (can include unit like "10WOW")
  | { coin: string };                // Specific coin object ID
```

### ObjectsOp

```typescript
ObjectsOp = {
  op: "add" | "set" | "remove";
  objects: string[];
} | {
  op: "clear";
};
```

### AccountOrMark_Address

```typescript
AccountOrMark_Address = {
  name_or_address?: string;
  local_mark_first?: boolean;
};
```

### ManyAccountOrMark_Address

```typescript
ManyAccountOrMark_Address = {
  entities: AccountOrMark_Address[];
  check_all_founded?: boolean;
};
```

### ReceivedBalanceOrRecently

```typescript
ReceivedBalanceOrRecently = 
  | {
      balance: number;
      token_type: string;
      received: {
        id: string;
        balance: number;
        payment: string;
      }[];
    }
  | "recently";
```

### ReceivedObjectsOrRecently

```typescript
ReceivedObjectsOrRecently = 
  | {
      id: string;
      type: string;
    }[]
  | ReceivedBalanceOrRecently;
```

---

## Value Types

| Type | ID | Description |
|------|-----|-------------|
| Bool | 0 | Boolean true/false |
| Address | 1 | Object or account address |
| String | 2 | UTF-8 string |
| U8 | 3 | 8-bit unsigned integer |
| U16 | 4 | 16-bit unsigned integer |
| U32 | 5 | 32-bit unsigned integer |
| U64 | 6 | 64-bit unsigned integer |
| U128 | 7 | 128-bit unsigned integer |
| U256 | 8 | 256-bit unsigned integer |
| VecBool | 9 | Vector of booleans |
| VecAddress | 10 | Vector of addresses |
| VecString | 11 | Vector of strings |
| VecU8 | 12 | Vector of U8 |
| VecU16 | 13 | Vector of U16 |
| VecU32 | 14 | Vector of U32 |
| VecU64 | 15 | Vector of U64 |
| VecU128 | 16 | Vector of U128 |
| VecU256 | 17 | Vector of U256 |
| VecVecU8 | 18 | Vector of VecU8 |
