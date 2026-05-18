# onchain_operations / service

Create and manage product/service listings with transparent promises, bind workflow templates, set pricing, issue discount coupons.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Service uses `TypedPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallService_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: TypedPermissionObject
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
  
  // Sales operations (discriminated union)
  sales?: {
    op: "add" | "set";
    sales: {                       // Array of sale items (REQUIRED)
      name: string;                // Product name
      price: number;               // Price
      stock: number;               // Stock quantity
      suspension: boolean;         // Whether suspended
      wip: string;                 // WIP file URL
      wip_hash: string;            // WIP hash
    }[];
  } | {
    op: "remove";
    sales_name: string[];          // Sale names to remove (REQUIRED)
  } | {
    op: "clear";
  };
  
  repositories?: ObjectsOp;  // Repository operations
  rewards?: ObjectsOp;       // Reward operations
  arbitrations?: ObjectsOp;  // Arbitration operations
  machine?: string | null;   // Machine object ID
  
  // Discount coupon
  discount?: {
    name: string;
    discount_type: 0 | 1;  // 0 = RATES (percentage), 1 = FIXED (fixed amount)
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
  setting_locked_time_add?: number;
  compensation_fund_receive?: ReceivedBalanceOrRecently;
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;            // Contact object
  pause?: boolean;               // Pause new orders
  publish?: boolean;             // Publish service (immutable)
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, ObjectsOp, CoinParam, NamedObject, AccountOrMark_Address, ManyAccountOrMark_Address, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently, Recipient.