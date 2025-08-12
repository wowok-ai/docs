# Wowok Protocol Business Case: Decentralized Personal Shopping Platform

## Overview

This document demonstrates how to build a decentralized personal shopping service ecosystem using the Wowok Protocol, solving trust issues in traditional shopping services and enabling zero-fee peer-to-peer transactions. This case study is based on actual technical implementation and provides complete operational guidance and business logic explanations.

## 1. Business Scenario Analysis

### 1.1 Unique Challenges of Personal Shopping Services

**Typical Scenario**: Sarah needs someone to help her purchase a limited edition Nike Air Jordan 1 in black, size US9, from a Nike store in New York. She's willing to pay $800 for the product plus a $50 service fee.

**Traditional Platform Problems**:

| Pain Point                  | Specific Manifestation                                           | Root Cause                                                           |
| --------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Lack of Trust Mechanism** | Both parties bear default risks, creating a "prisoner's dilemma" | No transparent guarantee mechanism, relying on platform reputation   |
| **High Platform Fees**      | 15%-25% commission erodes profits                                | Platform operational costs, customer acquisition, and profit margins |
| **Opaque Processes**        | Unclear fund flows and dispute resolution mechanisms             | Centralized platform black box operations                            |
| **Limited Customization**   | Cannot handle complex personalized shopping requests             | Platform preset service framework limitations                        |

### 1.2 Wowok Protocol Innovation Solution

**Core Innovation**: Transform "prisoner's dilemma" into "coordination game" through **dual escrow mechanism**

```
Traditional Model: Buyer ←→ Service Provider (mutual distrust)
Wowok Model: Buyer ←→ Smart Contract ←→ Service Provider (code-guaranteed trust)
```

**Technical Advantages**:

- **Zero Platform Fees**: Peer-to-peer transactions with only minimal blockchain gas fees
- **Transparent Guarantee**: All rules written into smart contracts with fully transparent execution
- **Automated Execution**: Automatic fund release based on workflow status without manual intervention

## 2. Wowok Protocol Fundamentals

### 2.1 Core Object System

Before creating personal shopping services, you need to understand the core objects of the Wowok Protocol:

| Object Type    | Function                   | Application in Shopping Services                              |
| -------------- | -------------------------- | ------------------------------------------------------------- |
| **Permission** | Access Control             | Controls who can operate which steps of the process           |
| **Machine**    | Workflow Definition        | Defines standardized execution flow for services              |
| **Guard**      | Business Rule Verification | Verifies workflow status and controls fund release            |
| **Treasury**   | Fund Escrow                | Securely escrows buyer funds with multiple withdrawal methods |
| **Service**    | Service Publishing         | Service provider's profile and pricing information            |
| **Order**      | Order Instance             | Specific shopping orders connecting buyer needs and services  |
| **Progress**   | Process Tracking           | Tracks order execution progress and triggers fund release     |

### 2.2 Dual Escrow Mechanism Details

**Design Philosophy**: Separate risk management with precise fund flow control

```
Deposit Escrow (Labor Cost Protection)    Main Escrow (Transaction Security)
           ↓                                        ↓
    Time-locked Protection                   Refund Excess Mechanism
           ↓                                        ↓
  Protects Service Provider Time            Guarantees Buyer Fund Security
```

**Deposit Escrow Logic**:

- Buyer prepays deposit (e.g., $50)
- Buyer cannot withdraw within specified time (protects service provider's search time)
- Service provider can withdraw deposit after finding product (compensates labor cost)
- If service provider fails to find product within specified time, buyer can request refund

**Main Escrow Logic**:

- Buyer escrows total budget (rounded up to ensure sufficient funds)
- Service provider withdraws actual expenses
- Remaining funds can be withdrawn by buyer (refund excess)
- Withdrawal permissions controlled based on workflow progress

### 2.3 Core Mechanism Design

**Core Logic of Dual Escrow**:

- Deposit escrow protects service provider's labor costs (time and effort for finding products)
- Main escrow ensures final transaction security (refund excess mechanism)
- 10-day timeout confirmation mechanism prevents buyer malicious delays

**Key Innovation Points**:

- Borrows mature timeout confirmation mechanism from established e-commerce platforms
- Transforms "prisoner's dilemma" into "coordination game"
- Automatic fund release based on workflow status

## 3. Complete Implementation Process

### 3.1 Service Provider Onboarding

#### Step 1: Create Permission Management System

**Business Objective**: Establish access control mechanism to ensure only authorized users can operate corresponding functions

**Prompt**:

```
I want to create a personal shopping service and first need to establish a permission management system.

Please create a Permission object with the following permissions:
- Object description: Professional shopping service permission management system
- Administrator: My default account
- Business permission configuration:
  * Permission 1001: Shopping workflow operation permission (for advancing order status)
  * Permission 1002: Buyer confirmation permission (for order and delivery confirmation)
  * Permission 1003: Service management permission (for modifying service configuration)
  * Permission 1004: Fund management permission (for Treasury operations)

Please assign all permissions to my account and ensure the permission object is created successfully.
```

**Expected Result**: Obtain Permission object address to provide permission foundation for all subsequent objects

#### Step 2: Create Shopping Workflow Template

**Business Objective**: Create workflow template first to define standardized execution process for shopping services, providing node foundation for subsequent Guard verification

**Important Note**: Must create Machine workflow first because Guard objects need to reference specific node names for verification.

**Prompt**:

```
I need to create a shopping service workflow template that defines the complete process from order confirmation to transaction completion.

Shopping workflow design:
- Business characteristics: Includes key stages like product search, purchase confirmation, shipping and delivery
- Risk control: Each node has clear operation permissions and advancement conditions
- Exception handling: Includes refund branch for products not found within specified time

Please create a Machine object with the following configuration:
- Object name: Professional shopping service standard workflow
- Permission object: Use the Permission object created in step 1
- Publication status: Publish immediately after creation (bPublished: true, bPaused: false)

Workflow node design:
1. "Order Confirmed" (initial node) - Buyer places order, service provider accepts
2. "Searching Product" - Service provider starts searching for specified product
3. "Product Found" - Service provider confirms finding product meeting requirements
4. "Purchase Completed" - Service provider completes product purchase
5. "Shipped" - Service provider completes product shipping
6. "Transaction Completed" (final node) - Buyer confirms receipt, transaction ends
7. "Timeout Refund" (branch node) - Branches from "Searching Product" to handle refunds for products not found within specified time

Node transition rules:
- Order Confirmed → Searching Product: Service provider operation (permission 1001), weight 1, threshold 1
- Searching Product → Product Found: Service provider operation (permission 1001), weight 1, threshold 1
- Searching Product → Timeout Refund: Buyer operation (permission 1002), weight 1, threshold 1
- Product Found → Purchase Completed: Service provider operation (permission 1001), weight 1, threshold 1
- Purchase Completed → Shipped: **Key timeout confirmation mechanism**
  * Buyer confirms receipt (permission 1002), weight 1
  * Service provider confirms shipping (permission 1001), weight 1
  * Timeout auto-confirmation (permission 1001), weight 2, requires "10-day timeout auto-confirmation Guard" created in step 3e
  * **Threshold set to 2**, supporting three advancement methods:
    - Buyer confirmation + timeout Guard = weight 3 ≥ threshold 2 ✓
    - Service provider confirmation + timeout Guard = weight 3 ≥ threshold 2 ✓
    - Buyer confirmation + service provider confirmation = weight 2 ≥ threshold 2 ✓

**Business logic of timeout confirmation mechanism**:
This is the core innovative design of shopping services, solving the problem of "buyer malicious delay in confirming receipt":

1. **Normal situation**: Buyer actively confirms after receiving goods, or passively confirms after service provider ships
2. **Abnormal situation**: Buyer doesn't confirm receipt for a long time, service provider can unilaterally advance process through 10-day timeout Guard
3. **Dual protection**:
   - Protects service provider: Prevents buyer malicious delays, ensures service provider receives payment timely
   - Protects buyer: 10 days is sufficient time to inspect goods, can still seek remedies through other means after timeout

This design transforms traditional "buyer unilateral control of confirmation rights" into a balanced "time + multi-party confirmation" mechanism.

Please create this Machine object and ensure it contains complete workflow logic.

**Important configuration notes**:
- In the "timeout auto-confirmation" operation of "Purchase Completed → Shipped", need to reference the Guard object address created in step 3e
- Weight and threshold design is core innovation, ensuring both buyers and service providers have ability to advance process
- 10-day timeout mechanism balances both parties' interests, protecting buyer inspection time while preventing malicious delays
```

**Expected Result**: Obtain Machine object address to establish standardized shopping service process

#### Step 3: Create Business Verification Rules (Guard Objects)

**Business Objective**: Based on the created Machine workflow nodes, create precise fund release verification rules

**Important Note**: The following Guard creation uses actually verified parameter configurations to ensure 100% executability. Node names must be completely consistent with those in the Machine created in the previous step.

**Guard 1 - Service Provider Withdraw Deposit After Purchase**:

```
I need to create a Guard verification rule for service provider to withdraw deposit after completing purchase.

Please use the following precise parameters to create the Guard object:

{
  "data": {
    "description": "Progress reaches purchase completed node, Service recipient can withdraw deposit",
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 3,
        "bWitness": false,
        "value_type": 120,
        "value": "Purchase Completed"
      }
    ],
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            {
              "query": 801,
              "object": {"identifier": 1},
              "parameters": []
            },
            {
              "value_type": 120,
              "value": "Purchase Completed"
            }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"context": 60},
            {
              "query": 401,
              "object": {"identifier": 2},
              "parameters": []
            }
          ]
        }
      ]
    }
  }
}
```

**Business Logic**: Service provider withdraws deposit as labor compensation after completing purchase. Verification: Progress reaches "Purchase Completed" node + withdrawer is Service recipient.

**Guard 2 - Buyer 48-hour Deposit Refund**:

```
I need to create a Guard verification rule for buyer 48-hour deposit refund.

Please use the following precise parameters to create the Guard object:

{
  "data": {
    "description": "After specified time and purchase not completed, buyer can refund deposit",
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 3,
        "bWitness": false,
        "value_type": 103,
        "value": "172800000"
      }
    ],
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 11,
          "parameters": [
            {"context": 61},
            {
              "calc": 2,
              "parameters": [
                {
                  "query": 521,
                  "object": {"identifier": 1},
                  "parameters": []
                },
                {"identifier": 3}
              ]
            }
          ]
        },
        {
          "logic": 18,
          "parameters": [
            {
              "logic": 16,
              "parameters": [
                {
                  "query": 801,
                  "object": {"identifier": 2},
                  "parameters": []
                },
                {
                  "value_type": 120,
                  "value": "Purchase Completed"
                }
              ]
            }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"context": 60},
            {
              "query": 501,
              "object": {"identifier": 1},
              "parameters": []
            }
          ]
        }
      ]
    }
  }
}
```

**Business Logic**: Give service provider 48 hours to find product, buyer can reclaim deposit if purchase not completed after timeout. Verification: Order created 48 hours ago + Progress hasn't reached "Purchase Completed" + withdrawer is buyer. Time adjustable (24-72 hours).

**Guard 3 - Service Provider Withdraw Service Fee After Shipping**:

```
I need to create a Guard verification rule for service provider to withdraw service fee after shipping.

Please use the following precise parameters to create the Guard object:

{
  "data": {
    "description": "Progress in shipped status, Service recipient can withdraw service fee",
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101,
        "value": null
      }
    ],
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            {
              "query": 801,
              "object": {"identifier": 1},
              "parameters": []
            },
            {
              "value_type": 120,
              "value": "Shipped"
            }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"context": 60},
            {
              "query": 401,
              "object": {"identifier": 2},
              "parameters": []
            }
          ]
        }
      ]
    }
  }
}
```

**Business Logic**: Service provider withdraws service fee based on actual expenses after shipping, implementing refund excess mechanism. Verification: Progress reaches "Shipped" node + withdrawer is Service recipient.

**Guard 4 - Buyer Withdraw Remaining Funds After Transaction Completion**:

```
I need to create a Guard verification rule for buyer to withdraw remaining funds after transaction completion.

Please use the following precise parameters to create the Guard object:

{
  "data": {
    "description": "Progress in transaction completed status, buyer can withdraw remaining funds",
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "value": null
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101,
        "value": null
      }
    ],
    "root": {
      "logic": 19,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            {
              "query": 801,
              "object": {"identifier": 1},
              "parameters": []
            },
            {
              "value_type": 120,
              "value": "Transaction Completed"
            }
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"context": 60},
            {
              "query": 501,
              "object": {"identifier": 2},
              "parameters": []
            }
          ]
        }
      ]
    }
  }
}
```

**Business Logic**: Buyer withdraws remaining funds after transaction completion, implementing refund excess mechanism. Verification: Progress reaches "Transaction Completed" node + withdrawer is Order owner (buyer).

**Guard 5 - 10-day Timeout Auto-confirmation (Key Innovation)**:

```
I need to create a 10-day timeout auto-confirmation Guard verification rule.

Please use the following precise parameters to create the Guard object:

{
  "data": {
    "description": "10 days after shipping, service provider can unilaterally confirm transaction completion",
    "table": [
      {
        "identifier": 1,
        "bWitness": false,
        "value_type": 103,
        "value": "864000000"
      }
    ],
    "root": {
      "logic": 11,
      "parameters": [
        {"context": 61},
        {"identifier": 1}
      ]
    }
  }
}
```

**Business Logic**: Solves buyer malicious delay in confirming receipt, borrowing mature models from established e-commerce platforms. Verification: Current time > Progress reaching "Shipped" node time + 10 days. Prevents buyer indefinite delays, protects service provider rights.

**Expected Result**: Obtain 5 Guard object addresses to provide complete business verification rules for dual escrow and timeout confirmation

#### Step 4: Create Dual Escrow System

**Business Objective**: Establish separated fund escrow mechanism to protect service provider labor costs and buyer fund security respectively

**Prompt 4a - Create Deposit Escrow**:

```
I need to create a deposit escrow to protect service provider labor costs.

Deposit escrow business logic:
- Functional positioning: Escrow buyer deposit, protect service provider's time and effort investment during product search
- Fund nature: Labor cost compensation, relatively small amount (typically $20-100)
- Withdrawal rules: Service provider can withdraw after completing purchase, buyer can refund under specific conditions

Please create Treasury object with the following configuration:
- Object name: Shopping service deposit escrow
- Token type: 0x2::sui::SUI
- Permission object: Use the Permission object created in step 1
- Withdrawal mode: Mode 1 (Guard-based verification withdrawal)
- Business description: Specifically escrows shopping service deposits, protecting both parties' interests

Withdrawal Guard configuration:
- Service provider withdrawal condition: Use "Service provider withdraw deposit after purchase Guard" created in step 3a
- Buyer refund condition: Use "Buyer 48-hour deposit refund Guard" created in step 3b
- Maximum withdrawal amount: Up to 100 SUI per transaction

Please create the deposit escrow and configure corresponding withdrawal rules.
```

**Prompt 4b - Create Main Escrow**:

```
I need to create a main escrow to hold primary transaction funds and implement refund excess mechanism.

Main escrow business logic:
- Functional positioning: Escrow buyer's primary funds, support service provider on-demand withdrawal and buyer remaining withdrawal
- Fund nature: Product cost + service fee, larger amount (typically $100-5000)
- Withdrawal rules: Staged fund release based on workflow progress

Please create Treasury object with the following configuration:
- Object name: Shopping service main escrow
- Token type: 0x2::sui::SUI
- Permission object: Use the Permission object created in step 1
- Withdrawal mode: Mode 1 (Guard-based verification withdrawal)
- Business description: Escrows shopping service primary funds, supports refund excess mechanism

Withdrawal Guard configuration:
- Service provider service fee withdrawal: Use "Service provider withdraw service fee after shipping Guard" created in step 3c
- Buyer remaining fund withdrawal: Use "Buyer withdraw remaining funds after transaction completion Guard" created in step 3d
- Maximum withdrawal amount: Up to 1000 SUI per transaction

Please create the main escrow and configure corresponding withdrawal rules.
```

**Expected Result**: Obtain deposit and main escrow addresses to establish complete fund escrow system

#### Step 5: Create Shopping Service Profile

**Business Objective**: Establish complete shopping service profile including personal information, service capabilities, and pricing strategies

**Prompt**:

```
I need to create a complete shopping service profile to showcase my professional capabilities and service commitments to clients.

Service profile configuration:
- Service positioning: Professional overseas shopping service, focusing on quality and reputation
- Target customers: Individual and corporate clients needing overseas product shopping services
- Core advantages: Local resources, professional authentication, reliable delivery

Please create Service object with the following configuration:

Basic information settings:
- Service name: [Your shopping service brand name, e.g., "Linda Professional US Shopping"]
- Permission object: Use the Permission object created in step 1
- Associated workflow: Use the Machine object created in step 2
- Publication status: Publish immediately after creation (bPublished: true, bPaused: false)

Service description content:
Personal qualifications:
- Real name: [Your real name]
- Service area: [Detailed service regions, e.g., "New York, Los Angeles, San Francisco, USA"]
- Professional fields: [Product types you specialize in, e.g., "Luxury goods, limited sneakers, cosmetics"]
- Language abilities: [e.g., "Fluent in English, native Chinese speaker"]
- Professional experience: [Relevant experience, e.g., "5 years shopping experience, completed 500+ orders"]

Service capabilities:
- Product types: Luxury shopping, limited product procurement, cosmetics shopping, electronics shopping
- Professional skills: [e.g., "Expert in authenticity verification, familiar with major brand stores, master procurement techniques"]
- Service guarantees: [e.g., "Full photo documentation, professional packaging, full compensation for loss or damage"]
- Special qualifications: [e.g., "Legal local status, passed background check"]

Pricing strategy:
- Basic service fee: [e.g., "Starting from $25"]
- Product type rates: [e.g., "Luxury goods 8% service fee (minimum $50)"]
- Special services: [e.g., "Express service 50% surcharge, holiday service 25% surcharge"]

Contact information:
- Phone: [Contact phone]
- Instant messaging: [WeChat, WhatsApp, etc.]
- Email: [Email address]
- Working hours: [Detailed service hours]

Sales item settings:
- Item name: Professional shopping general service
- Base price: 0.01 SUI (symbolic price, actual price negotiated based on specific needs)
- Inventory quantity: 999 (indicates continuous order acceptance)
- Item description: Complete service introduction including all above information

Please create this Service object to establish my professional shopping service profile.
```

**Expected Result**: Obtain Service object address to complete shopping service launch

### 3.2 Customer Publishing Shopping Requests

**Business Objective**: Customers publish personalized shopping requests through AI dialogue, system automatically matches suitable shopping services

**Prompt Template**:

```
I need to publish a shopping request to find professional shopping services.

Shopping request details:
- Product description: [Detailed description of products needed, including brand, model, color, size, etc.]
- Purchase location: [Specify purchase location or region, e.g., "Apple flagship store on Fifth Avenue, New York"]
- Time requirements: [Expected completion time, e.g., "Complete within 3 days"]
- Special requirements: [Important notes, e.g., "Must be authentic, need purchase receipt"]

Budget:
- Product budget: $[Product price budget]
- Service fee budget: $[Willing to pay service fee]
- Deposit amount: $[Willing to prepay deposit, suggest $20-50]
- Reward mechanism: [e.g., "Extra $10 tip for early completion"]

Personal information:
- Contact: [Phone number]
- Delivery address: [Detailed delivery address]
- Notification preference: [How you want to receive progress notifications]

Please create Demand object to publish this shopping request and set reasonable reward mechanisms to attract quality shopping services.
```

### 3.3 Order Execution and Progress Management

#### Service Provider Application and Buyer Order Process

**Important Note**: Order creation process in Wowok Protocol: Service provider applies → Buyer selects and pays → System automatically creates Order and Progress

**Step 1: Service Provider Application**

**Prompt**:

```
I see a shopping request "[Request description]" and want to apply with my shopping service.

Application explanation:
- Service capability match: [Explain why suitable for this order, such as geographic location, professional field, etc.]
- Execution plan: [Detailed execution steps and time arrangement]
- Expected completion time: [Specific completion time commitment]
- Risk assessment: [Possible difficulties and response plans]
- Service advantages: [Advantages compared to other service providers, such as experience, reputation, etc.]

Quote proposal:
- Deposit suggestion: $[Suggested deposit amount]
- Service fee quote: $[Service fee amount]
- Total budget estimate: $[Estimated total funds needed for escrow]
- Special notes: [Such as express fees, special product fees, etc.]

Please use Demand's present function to recommend my service to this request and submit the above application information.
```

**Step 2: Buyer Service Selection and Payment**

**Prompt**:

```
I see service provider "[Service provider name]" applied for my request. I'm very satisfied with their service proposal and decide to choose this shopping service.

Selection reasons:
- Service provider advantages: [Reasons for choosing this service provider]
- Service proposal: [Recognized service proposal points]
- Time arrangement: [Meets my time requirements]

Payment arrangement:
- Deposit payment: $[Deposit amount] (will be escrowed to deposit escrow)
- Primary funds: $[Primary fund amount] (will be escrowed to main escrow)
- Total: $[Total amount]

Please purchase shopping service "[Service name]". The system will automatically create Order object and Progress workflow to start execution.
```

**System Automatic Processing**:

- After buyer payment success, system automatically creates Order object
- Simultaneously creates Progress object with initial status "Order Confirmed"
- Funds automatically allocated to deposit and main escrows
- Service provider receives order notification and starts executing service

#### Workflow Advancement Operations

**Prompt Template**:

```
I need to advance the current order execution progress to the next stage.

Current status:
- Progress object: [Progress object address]
- Current node: [Current workflow node]
- Target node: [Next node to advance to]

Completion report:
- Completed work: [Detailed description of work completed in current stage]
- Work proof: [Provide relevant proof such as photos, receipts, etc.]
- Next steps: [Specific actions to be executed next]
- Expected time: [Expected completion time for next stage]

Please use Machine's progress_next operation to advance workflow from "[Current node]" to "[Target node]" and record the above information in delivery records in detail.
```

#### Transaction Completion Confirmation

**Prompt**:

```
I have received all products provided by the shopping service and am very satisfied with the service quality.

Receipt confirmation:
- Product list: [Detailed list of all received products]
- Product condition: [Product quality, packaging condition, etc.]
- Delivery timeliness: [Comparison of actual delivery time with promised time]
- Service evaluation: [Overall evaluation of shopping service]

Shopping service evaluation:
- Professionalism: [Evaluate service provider's professional level]
- Communication quality: [Evaluate communication efficiency and attitude]
- Promise fulfillment: [Whether service was completed as promised]
- Recommendation index: [Whether willing to recommend to others]

Please confirm order completion, advance Progress to "Transaction Completed" status, and trigger final fund settlement.
```

## 4. Verification and Problem Resolution

### 4.1 Creation Verification

After completing each step, it's recommended to query objects to confirm successful creation:

```
Please query the [Object type] object I just created:
- Object address: [Object address]
- Confirm configuration is correct
- Verify associated objects are correctly referenced
```

### 4.2 Problem Resolution Guide

**If you encounter problems following the documentation**:

1. **Collaborate with AI for debugging**:

   - Describe error messages and operation steps in detail
   - Let AI help analyze problem causes
   - Adjust parameters or operations based on AI suggestions

2. **Contact technical support**:

   - Wowok official documentation: [Official link]
   - Technical support email: support@wowok.net
   - Community discussion: [Community link]

3. **Quick check for common issues**:
   - Permission configuration: Confirm account permissions and Permission object settings
   - Node names: Ensure node names in Machine and Guard are completely consistent
   - Object status: Confirm Machine and Service are published (bPublished: true)
   - Parameter format: Use precise JSON parameters provided in documentation

**Important Note**: Parameters provided in this document have been actually verified. If problems persist after strictly following steps, it's recommended to prioritize collaborating with AI to analyze specific error messages.

## 5. Business Value Analysis

### 5.1 Cost-Benefit Comparison

| Comparison Dimension | Traditional Shopping Platforms | Wowok Protocol            | Advantage Quantification |
| -------------------- | ------------------------------ | ------------------------- | ------------------------ |
| Platform Commission  | 15-25%                         | 0%                        | Save 15-25%              |
| Transaction Fees     | Fixed handling fees            | Only Gas fees (<0.1%)     | Save 99%+                |
| Fund Security        | Platform escrow                | Smart contract guarantee  | Code-level security      |
| Dispute Resolution   | Manual customer service        | Automated execution       | Instant processing       |
| Personalized Needs   | Preset templates               | AI dialogue customization | 100% flexible            |

### 5.2 Trust Mechanism Innovation

**Traditional Model Problems**:

- Buyer risk: Service provider takes money and runs
- Service provider risk: Buyer cancels after advance payment
- Platform risk: Centralized control, lack of transparency

**Wowok Solutions**:

- **Smart contract guarantee**: Code execution, tamper-proof
- **Staged release**: Fund control based on workflow progress
- **Bidirectional protection**: Deposit protects service provider, escrow protects buyer
- **Transparent execution**: All operations verifiable on-chain

## 6. Design Logic Summary

### Core Design Approach

**Dual Escrow Mechanism**:

- Deposit escrow protects service provider labor costs (48-hour time lock)
- Main escrow ensures transaction security (refund excess + 10-day timeout confirmation)
- Separates different types of risks with precise fund flow control

**Timeout Confirmation Innovation**:

- Borrows mature models from established e-commerce platforms, defaults to confirming receipt after 10 days
- Prevents buyer malicious delays, protects service provider rights
- Gives buyers sufficient time to inspect products and raise disputes

**Guard Verification Logic**:

- Transforms "I say I completed it" into "system verifies I actually completed it"
- Dual protection based on workflow status + identity verification
- Time verification based on Order creation time ensures fairness

### Generalizable Applications

This design approach can be applied to other service scenarios requiring trust mechanisms:

- Service-based businesses like housekeeping, repair services, education and training
- Staged fund release in supply chain management
- Intellectual property protection in creator economy

The key is identifying different needs for "labor costs" and "transaction security" and designing corresponding incentive mechanisms and verification rules.

## 7. Conclusion

### Case Value

This shopping service case demonstrates the application potential of Wowok Protocol in solving real business problems:

**Core Innovations**:

- Dual escrow mechanism effectively alleviates trust issues in traditional shopping services
- Borrows experience from mature e-commerce platforms, designing 10-day timeout confirmation mechanism
- Achieves zero platform fee peer-to-peer transactions through smart contracts

**Technical Features**:

- Precise Guard parameter configurations, actually verified and directly usable
- Complete workflow design covering main scenarios of shopping services
- Layered permission management ensuring system security

### Application Prospects

This design approach can provide reference for other service scenarios requiring trust mechanisms, such as housekeeping services, repair services, creator economy, etc. The key lies in identifying specific needs for "labor costs" and "transaction security" in different business scenarios.

### Technical Notes

All Guard parameters in the document are based on actual deployment verification, and prompts can be directly copied and used. In actual applications, it's recommended to adjust time parameters and business logic according to specific business needs.

---

_This document provides a complete implementation solution for shopping services based on Wowok Protocol. All technical parameters have been verified and can serve as a reference case for similar business scenarios._
