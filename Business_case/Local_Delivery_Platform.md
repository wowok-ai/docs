# Local Delivery Platform based on Wowok: A Brief Project Implementation

This project implements a minimal framework of a food-delivery platform, built natively on Wowok and integrating merchant craftsmanship, trusted couriers, and programmable workflows. Customers describe the meal and constraints to AI agent once, Service objects, Machine workflows, Guards, and Repository data make sure every promise is executed transparently.

## 🔁 Build Sequence (permission → treasury → repository → arbitration → guard → machine → service)

Because many Wowok objects become immutable after being referenced, **stick to this order**:

>1. **[Permission](##1.PermissionFoundation)** – define all custom permission indexes up front so every other object can reference them.
>2. **[Treasury](##2.TreasuryConfiguration)** – services and Guards reference the payout pool; create it before anything binds to it.
>3. **[Repository](##3.Repository(StrictMode))** – declare strict-mode policies while the Permission address is known; changing later requires a new Repository.
>4. **[Arbitration](##4.Arbitration+FeeTreasury)** – attach the dispute board and fee treasury.
>5. **[Guards](##5.GuardSuite)** – publish buy/withdraw Guards once Permission/Treasury exist.
>6. **[Machine](##6.MachineWorkflow)** – clone/edit while unpublished, wire in Guard addresses, then publish.
>7. **[Service](##7.Service(Storefront))** – bind Machine, Guards, and Treasury. Publishing freezes those references.

Following this chain prevents “object already referenced/cannot modify” errors when cloning or iterating.

## 1. Permission Foundation

The permission layer keeps every later object under a single governance umbrella. It defines the custom indices used by Repository policies and grants the admin address the ability to operate guards, machines, and treasuries. Clone this whenever you roll out a new city and simply swap the admin address.

> 💡 Agent Prompt: Create the foundational permission object for delivery platform governance, establishe custom permission indices (1120-1123) for customer verification, order reputation, merchant operations, and rider geolocation tracking across the entire delivery ecosystem.

> Replace {ADMIN} with your actual admin address before executing.

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "name": "delivery_reputation_permission",
      "onChain": true,
      "tags": ["delivery","permission"]
    },
    "description": "Unified governance for merchants, couriers, arbitration",
    "biz_permission": {
      "op": "add",
      "data": [
        { "index": 1120, "name": "customer_verification_write" },
        { "index": 1121, "name": "order_reputation_record_write" },
        { "index": 1122, "name": "order_ready_snapshot_write" },
        { "index": 1123, "name": "rider_geolocation_write" }
      ]
    },
    "admin": {
      "op": "add",
      "addresses": [
        { "name_or_address": "{ADMIN}", "local_mark_first": false }
      ]
    },
    "permission": {
      "op": "add entity",
      "entities": [
        {
          "address": { "name_or_address": "{ADMIN}" },
          "permissions": [
            { "index": 1120 }, { "index": 1121 },
            { "index": 1122 }, { "index": 1123 }
          ]
        }
      ]
    }
  }
}
```

The results may be as below:
<img width="977" height="771" alt="Screenshot 2025-11-14 at 6 58 24 PM" src="https://github.com/user-attachments/assets/e451601d-ed81-4406-ab66-5c38d89dbd18" />

For complete Permission object documentation: [Permission Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Permission.md)

## 2. Treasury Configuration

Create the payout pool once and reuse it across services. The treasury inherits the same permission object so that only approved operators can deposit/withdraw funds from the delivery business.

>💡 Agent Prompt: Establish the treasury for delivery platform financial operations, creates the central payout pool that manages all delivery-related transactions, incentives, and withdrawals with proper permission controls.

>Replace {ADMIN} and {PERMISSION_ADDRESS} with your actual addresses

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "type_parameter": "0x2::sui::SUI",
      "name": "delivery_reputation_treasury",
      "permission": "{PERMISSION_ADDRESS}",
      "onChain": true,
      "tags": ["delivery","treasury"]
    },
    "description": "Food delivery payouts and incentives"
  }
}
```

The results may be as below:
<img width="976" height="671" alt="Screenshot 2025-11-14 at 7 00 02 PM" src="https://github.com/user-attachments/assets/098060bb-fa0a-4ad0-8e6c-3447e0c70b64" />

For complete Treasury object documentation: [Treasury Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Treasury.md)

## 3. Repository (Strict Mode)

This repository acts as the evidence vault. Each field lines up with a specific business event—buyer vetting, merchant prep proof, courier status, or final reputation summary. Because the repository runs in strict mode, only addresses with the correct permission index can write to each field.

>💡 Agent Prompt: Initialize the evidence repository for delivery platform data integrity. Creates strict-mode data policies for customer verification, order snapshots, rider tracking, and reputation records with proper permission-based access control.

>Replace {ADMIN} and {PERMISSION_ADDRESS} with your actual addresses

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "name": "delivery_reputation_repository",
      "permission": "{PERMISSION_ADDRESS}",
      "onChain": true,
      "tags": ["delivery","reputation"]
    },
    "mode": 1,
    "description": "Reputation + evidence records",
    "policy": {
      "op": "add",
      "data": [
        { "key": "customer_verification", "description": "Buyer status", "dataType": 204, "permissionIndex": 1120 },
        { "key": "order_ready_snapshot", "description": "Merchant prep proof", "dataType": 204, "permissionIndex": 1122 },
        { "key": "rider_geolocation", "description": "Courier location/status", "dataType": 204, "permissionIndex": 1123 },
        { "key": "order_reputation_record", "description": "Per-order summary", "dataType": 204, "permissionIndex": 1121 }
      ]
    }
  }
}
```

The results may be as below:
<img width="977" height="749" alt="Screenshot 2025-11-14 at 6 59 23 PM" src="https://github.com/user-attachments/assets/f72945ec-1282-48a1-8830-e2ff9c33e7f8" />

For complete Repository object documentation: [Repository Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Repository.md)

## 4. Arbitration + Fee Treasury

Disputes reference the same evidence the workflow produces. This arbitration object shares the Permission with the rest of the stack and creates its own fee treasury so arbitrators can be compensated.

>💡 Agent Prompt: Establish arbitration system with fee treasury for dispute resolution. Creates the arbitration board and dedicated fee treasury to handle delivery disputes and compensate arbitrators while maintaining permission consistency with the platform.

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "name": "delivery_reputation_arbitration",
      "type_parameter": "0x2::sui::SUI",
      "permission": "{PERMISSION_ADDRESS}",
      "onChain": true,
      "tags": ["delivery","arbitration"]
    },
    "description": "Food delivery dispute board",
    "location": "online",
    "bPaused": false,
    "fee_treasury": {
      "type_parameter": "0x2::sui::SUI",
      "permission": "{PERMISSION_ADDRESS}",
      "name": "delivery_arbitration_fee_pool",
      "onChain": true
    }
  }
}
```

The results may be as below:
<img width="976" height="483" alt="Screenshot 2025-11-14 at 7 02 13 PM" src="https://github.com/user-attachments/assets/892f0450-e089-4d28-952b-ea72da69f5bd" />

>💡 Agent Prompt: Connect arbitration system to the main delivery service.

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": "{SERVICE_ADDRESS}",
    "arbitration": {
      "op": "set",
      "objects": ["{ARBITRATION_ADDRESS}"]
    }
  }
}
```

For complete Arbitration object documentation: [Arbitration Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Arbitration.md)

## 5. Guard Suite

### 5.1 Buyer Guard (`guard_customer_verified`)

White-listing keeps fake buyers out of the workflow. This guard checks whether the transaction signer is either the designated customer account or the admin (useful for dry runs and emergency overrides).

>💡 Agent Prompt: Create customer verification guard for buyer access control. Implements whitelist-based authentication allowing only verified customers and admin to interact with order placement and confirmation processes.

```json
{
  "account": "{ADMIN}",
  "data": {
    "description": "Whitelist buyers/admin for confirmation and reviews",
    "namedNew": {
      "name": "guard_customer_verified",
      "onChain": true,
      "tags": ["buy_guard","delivery"]
    },
    "root": {
      "logic": 20,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            { "context": 60 },
            { "value": "{USR}", "value_type": 101 }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            { "context": 60 },
            { "value": "{ADMIN}", "value_type": 101 }
          ]
        }
      ]
    }
  }
}
```

### 5.2 Withdrawal Guard (`guard_reputation_withdraw`)

Withdrawals are delayed until an admin attests the workflow is complete (witness flag). Later you can swap this guard for one that queries the repository or progress history once the guard MPC server supports it.

>💡 Agent Prompt: Configure withdrawal guard for treasury fund release. Enforces admin attestation requirement before allowing fund withdrawals, ensuring completion verification before financial settlements.

```json
{
  "account": "{ADMIN}",
  "data": {
    "description": "Allow withdrawals after admin attests completion",
    "namedNew": {
      "name": "guard_reputation_withdraw",
      "onChain": true,
      "tags": ["withdraw_guard","delivery"]
    },
    "table": [
      { "identifier": 1, "bWitness": true, "value_type": 100 }
    ],
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            { "context": 60 },
            { "value": "{ADMIN}", "value_type": 101 }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            { "identifier": 1 },
            { "value": true, "value_type": 100 }
          ]
        }
      ]
    }
  }
}
```

The results may be as below:
<img width="976" height="709" alt="Screenshot 2025-11-14 at 7 03 03 PM" src="https://github.com/user-attachments/assets/3d12c886-3390-46b2-8909-174eda42b3f2" />

For complete Guard object documentation: [Guard Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Guard.md)

## 6. Machine Workflow

Now create the machine object following the process shown in the diagram.

<img width="699" height="604" alt="Screenshot 2025-11-06 at 9 46 13 PM" src="https://github.com/user-attachments/assets/4fc0e352-26db-4fd3-8802-9cc3e84d77bb" />

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "name": "delivery_reputation_machine_guarded",
      "permission": "ADMIN",
      "onChain": true,
      "tags": ["delivery","workflow"]
    },
    "nodes": {
      "op": "add",
      "bReplace": true,
      "data": [
        {
          "name": "order_accepted",
          "pairs": [
            {
              "prior_node": "",
              "threshold": 0,
              "forwards": [
                {
                  "name": "merchant_accept_order",
                  "namedOperator": "merchant_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "rider_accepted",
          "pairs": [
            {
              "prior_node": "order_accepted",
              "threshold": 0,
              "forwards": [
                { "name": "rider_assignment", "namedOperator": "OrderPayer", "weight": 1 }
              ]
            }
          ]
        },
        {
          "name": "order_ready",
          "pairs": [
            {
              "prior_node": "order_accepted",
              "threshold": 0,
              "forwards": [
                {
                  "name": "order_ready",
                  "namedOperator": "merchant_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "order_picked_up",
          "pairs": [
            {
              "prior_node": "rider_accepted",
              "threshold": 2,
              "forwards": [
                {
                  "name": "rider_pick_up",
                  "namedOperator": "rider_operator",
                  "weight": 1,
                }
              ]
            },
            {
              "prior_node": "order_ready",
              "threshold": 2,
              "forwards": [
                {
                  "name": "pick_up_confirmed",
                  "namedOperator": "merchant_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "order_delivered",
          "pairs": [
            {
              "prior_node": "order_picked_up",
              "threshold": 1,
              "forwards": [
                {
                  "name": "rider_delivered",
                  "namedOperator": "rider_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "confirm_receipt",
          "pairs": [
            {
              "prior_node": "order_delivered",
              "threshold": 0,
              "forwards": [
                {
                  "name": "usr_confirm",
                  "namedOperator": "usr_operation",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "user_review",
          "pairs": [
            {
              "prior_node": "confirm_receipt",
              "threshold": 0,
              "forwards": [
                {
                  "name": "usr_review",
                  "namedOperator": "usr_operation",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "rider_review",
          "pairs": [
            {
              "prior_node": "user_review",
              "threshold": 0,
              "forwards": [
                {
                  "name": "rider_review",
                  "namedOperator": "rider_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "merchant_review",
          "pairs": [
            {
              "prior_node": "user_review",
              "threshold": 0,
              "forwards": [
                {
                  "name": "merchant_review",
                  "namedOperator": "merchant_operator",
                  "weight": 1,
                }
              ]
            }
          ]
        },
        {
          "name": "reputation_record",
          "pairs": [
            { "prior_node": "merchant_review", "threshold": 0, "forwards": [ { "name": "merchant_review_record", "namedOperator": "OrderPayer", "weight": 1, "guard": { "order_ids": [] } } ] },
            { "prior_node": "rider_review", "threshold": 0, "forwards": [ { "name": "rider_review_record", "namedOperator": "OrderPayer", "weight": 1, "guard": { "order_ids": [] } } ] },
            { "prior_node": "confirm_receipt", "threshold": 0, "forwards": [ { "name": "reputation_record", "namedOperator": "OrderPayer", "weight": 1, "guard": { "order_ids": [] } } ] },
            { "prior_node": "user_review", "threshold": 0, "forwards": [ { "name": "usr_review_record", "namedOperator": "OrderPayer", "weight": 1, "guard": { "order_ids": [] } } ] }
          ]
        },
        {
          "name": "completion",
          "pairs": [
            {
              "prior_node": "reputation_record",
              "threshold": 0,
              "forwards": [
                { "name": "time_up_and_abitration_solved", "namedOperator": "OrderPayer", "weight": 1, "guard": { "order_ids": [] } }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### 6.3 Publish (keep paused if needed)

Publishing locks the Machine forever, so only do this once all guard references check out. Keep `bPaused=true` until you're ready to let services spawn new progress instances.

>💡 Agent Prompt: Publish the guarded workflow machine to blockchain. 

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": "{NEW_MACHINE}",
    "bPublished": true,
    "bPaused": true
  }
}
```

For complete Machine object documentation: [Machine Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Machine.md)

## 7. Service (Storefront)

The service brings everything together: it points to the guarded Machine, binds the Treasury, and sets the buy/withdraw guards. Publish only after you verify prices, stock, and required info.

>💡 Agent Prompt: Deploy the delivery service storefront with integrated guards. Creates the main service interface connecting machine workflow, treasury payments, and role-based access controls for customer purchases and withdrawals

```json
{
  "account": "{ADMIN}",
  "data": {
    "object": {
      "name": "delivery_reputation_service",
      "permission": "{PERMISSION_ADDRESS}",
      "type_parameter": "0x2::sui::SUI",
      "onChain": true,
      "tags": ["delivery","service"]
    },
    "description": "Food Menu",
    "location": "New York",
    "machine": "{NEW_MACHINE}",
    "payee_treasury": "{TREASURY_ADDRESS}",
    "buy_guard": "{GUARD_CUSTOMER}",
    "withdraw_guard": {
      "op": "set",
      "guards": [
        { "guard": "{GUARD_WITHDRAW}", "rate": 5000 }
      ]
    },
    "sales": {
      "op": "add",
      "sales": [
        { "item": "Noodles", "price": "5000000", "stock": "100" }
      ]
    },
    "bPublished": false,
    "bPaused": true
  }
}
```

The results may be as below:
<img width="976" height="419" alt="Screenshot 2025-11-14 at 7 01 33 PM" src="https://github.com/user-attachments/assets/ddcfba4d-903b-4e2f-a0e1-a00dffe4322f" />

For complete Service object documentation: [Service Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Service.md)

## What You’ve Built

You now have a fully trustless local delivery platform where orders, payments, and reputation flow through programmable, verifiable logic. Customers, merchants, and couriers interact under transparent rules with automated protection at every step.

But the impact goes far beyond individual deliveries. Merchant behavior, courier performance, and customer preferences all generate on-chain signals that strengthen the ecosystem over time. Each fulfilled order becomes reusable infrastructure: merchants refine offerings, couriers strengthen reputation, and customers receive increasingly accurate, reliable service.

Over many transactions, this creates a marketplace where efficient operators naturally scale, high-quality service is easier to find, and buyers connect with exactly what they need through accumulated, verifiable transaction intelligence. The system doesn’t just deliver food/medicine/flower —- it delivers a self-improving local economy powered by trustless coordination.
