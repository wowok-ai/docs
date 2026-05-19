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
        name: string;              // Product name (max 256 bcs chars)
        stock: string | number;    // Quantity
        wip_hash: string;          // WIP file hash
      }[];
      total_pay: CoinParam;        // Payment amount
      discount?: string;           // Discount object ID
      payment_remark?: string;     // Payment remark
      payment_index?: number;      // Payment index
    };
    agents?: ManyAccountOrMark_Address;  // Order agents
    order_required_info?: string;        // Contact object ID or WTS Proof
    transfer?: AccountOrMark_Address;    // New order owner
    namedNewOrder?: NamedObject;         // Name for new Order
    namedNewAllocation?: NamedObject;    // Name for new Allocation
    namedNewProgress?: NamedObject;      // Name for new Progress
  };
  
  description?: string;              // Service description (max 4000 bcs chars)
  location?: string;                 // Service location (max 256 bcs chars)
  
  // Sales operations (discriminated union)
  sales?: {
    op: "add" | "set";
    sales: ServiceSale[];            // Array of sale items (REQUIRED for add/set)
  } | {
    op: "remove";
    sales_name: string[];            // Sale names to remove (REQUIRED) (each max 256 bcs chars)
  } | {
    op: "clear";
  };
  
  repositories?: ObjectsOp;          // Repository operations
  rewards?: ObjectsOp;               // Reward operations
  arbitrations?: ObjectsOp;          // Arbitration operations
  machine?: NameOrAddress | null;    // Machine object ID
  
  // Discount coupon
  discount?: Discount;
  
  discount_destroy?: NameOrAddress[];  // Discount IDs to destroy
  customer_required?: NotEmptyName[];  // Required info names (non-empty strings)
  
  // Order fund allocators
  order_allocators?: Allocators | null;
  
  buy_guard?: NameOrAddress | null;    // Purchase Guard ID or name
  compensation_fund_add?: CoinParam; // Compensation fund
  setting_locked_time_add?: number;  // Additional lock time (ms), extends 30-day default
  compensation_fund_receive?: ReceivedBalanceOrRecently;
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;         // Contact object ID or name
  pause?: boolean;                   // Pause new orders
  publish?: boolean;                 // Publish service (immutable after)
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, NamedObject, CoinParam, ObjectsOp, ServiceSale, Discount, Allocators, AccountOrMark_Address, ManyAccountOrMark_Address, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently.