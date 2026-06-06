# onchain_operations / arbitration

Create arbitration rules for dispute resolution.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Arbitration uses `TypedPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallArbitration_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: TypedPermissionObject
  object: TypedPermissionObject;
  
  // Create new Arb object for an order
  dispute?: {
    order: NameOrAddress;                // Order ID or name
    description?: string;                // Dispute description (max 4000 bcs chars)
    proposition: string[];               // List of dispute propositions (each max 256 bcs chars)
    fee: CoinParam;                      // Dispute processing fee
    namedArb?: NamedObject;              // Name for newly created arbitration object
  };
  
  description?: string;                  // Introduction of the Arbitration object (max 4000 bcs chars)
  location?: string;                     // Arbitration location (max 256 bcs chars)
  fee?: string | number;                 // Arbitration fee
  pause?: boolean;                       // Whether to pause arbitration
  
  // Confirm materials submitted for arbitration
  confirm?: {
    arb: NameOrAddress;                  // Arb object ID or name
    voting_deadline: number | null;      // Voting deadline
  };
  
  // Change voting deadline
  voting_deadline_change?: {
    arb: NameOrAddress;                  // Arb object ID or name
    voting_deadline: number | null;      // New voting deadline
  };
  
  // Vote on propositions
  vote?: {
    arb: NameOrAddress;                  // Arb object ID or name
    votes: number[];                     // Vote values (per proposition, 0-255)
    voting_guard?: NameOrAddress;        // Voting Guard object ID or name
  };
  
  // Provide arbitration feedback
  feedback?: {
    arb: NameOrAddress;                  // Arb object ID or name
    feedback: string;                    // Arbitration feedback (max 4000 bcs chars)
  };
  
  // Provide definitive arbitration result
  arbitration?: {
    arb: NameOrAddress;                  // Arb object ID or name
    feedback: string;                    // Arbitration feedback (max 4000 bcs chars)
    indemnity: number;                   // Indemnity amount (int >= 0)
  };
  
  // User applies to resubmit materials and restart arbitration
  reset?: {
    arb: NameOrAddress;                  // Arb object ID or name
    feedback: string;                    // Arbitration feedback (max 4000 bcs chars)
  };
  
  // Withdraw arbitration fees
  arb_withdraw?: {
    arb: NameOrAddress;                  // Arb object ID or name
  };
  
  // Distribute withdrawn arbitration fees
  fees_transfer?: {
    to: 
      | { allocation: NameOrAddress }     // Transfer to Allocation object
      | { treasury: NameOrAddress };      // Transfer to Treasury object
    payment_remark: string;              // Payment remark (max 64 bcs chars)
    payment_index: number;               // Payment index (int >= 0)
    newPayment?: NamedObject;            // Name for new payment object
  };
  
  usage_guard?: NameOrAddress | null;    // Guard for verifying when users apply
  voting_guard?: VotingGuardAction;      // Guard for verifying during voting
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;            // Contact object ID or name
}

// Voting guard operations (discriminated union)
VotingGuardAction = 
  | {
      op: "add" | "set";
      guards: VotingGuard[];             // Array of voting guard configs
    }
  | {
      op: "remove";
      guards: NameOrAddress[];             // Guard IDs or names to remove
    }
  | {
      op: "clear";
    };
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, NamedObject, VotingGuard, ReceivedObjectsOrRecently.