# Wowok Protocol Business Case: NYC Decentralized Errand Service (Complete Edition)

## Overview

This document demonstrates how to build a decentralized errand service ecosystem based on the Wowok protocol, using actual New York market cases to illustrate the technical advantages and business value of the protocol in solving traditional platform pain points. This version includes complete technical configuration details and accurate prompts.

### Market Scale

According to iiMedia Research, the Chinese errand economy market size was approximately $2.0 billion USD in 2021, with projections to reach $10.2 billion USD by 2025, demonstrating tremendous market potential and growth opportunities. This rapidly expanding market, representing a 5x growth trajectory, provides vast application prospects for decentralized errand services globally.

## 1. Business Scenario Analysis

### 1.1 Errand Service Market Overview

**Service Definition**: Errand services refer to on-demand services that handle daily tasks on behalf of others, including but not limited to:

- **Delivery Services**: Restaurant pickup, food delivery, merchandise delivery
- **Shopping Services**: Grocery shopping, pharmacy purchases, specialty item procurement
- **Document Services**: Contract delivery, file transfer, certificate pickup
- **Composite Services**: Multi-point pickup, combined tasks, customized requirements

For example, Sarah, a financial district professional in Manhattan, needs someone to help her purchase 2 large Margherita pizzas from Joe's Pizza (Times Square), stop by CVS pharmacy to buy a bottle of Tylenol, and deliver everything to her office on the 34th floor of the Empire State Building, all before 1:30 PM. This type of composite, personalized demand is difficult to fulfill on traditional platforms.

### 1.2 Traditional Platform Pain Points

| Pain Point                                   | Specific Manifestation                                                   | Root Cause                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Unable to Customize Personalized Demands** | Cannot handle composite demands like "Point A pickup + Point B shopping" | Platform preset service framework limitations                   |
| **High Platform Fees**                       | Charge 20%-30% commission                                                | IT systems, databases, operational costs need to be distributed |
| **Lack of Transparency**                     | Dynamic pricing algorithms not public, reputation mechanisms opaque      | Centralized platform black box operations                       |

### 1.3 Wowok Protocol Solutions

The Wowok protocol fundamentally solves the structural problems of traditional platforms through decentralized architecture:

- **Ultimate Flexibility**: Supports any personalized demand definition, only requires AI conversation to operate
- **Zero Platform Fees**: Peer-to-peer transactions, no intermediary commissions, eliminates IT system and database costs
- **Transparent Guarantee**: Smart contracts execute automatically, code guarantees transaction security, on-chain records are publicly transparent

## 2. Technical Architecture Design

### 2.1 Core Object System

Wowok protocol-based errand services require the following core objects:

- **Personal Object**: Runner's personal profile and identity information
- **Permission Object**: Access control, managing who can operate which functions
- **Treasury Object**: Decentralized fund custody, smart contract control
- **Guard Object**: Automated business rules, no human intervention required
- **Machine Object**: Defines standard workflow templates for errand services
- **Service Object**: Runner's professional service profile, referencing personal information
- **Repository Object**: On-chain reputation system, publicly transparent records
- **Demand Object**: Customer-published personalized demands, fully customizable
- **Order Object**: Specific order instances, connecting customer demands with service providers
- **Progress Object**: Workflow instances tracking order execution progress

## 3. Complete Implementation Process

### 3.1 Runner Onboarding (One-time Operation)

Runners need to create complete service infrastructure in sequence.

**Step 1: Establish Personal Profile**

**Prompt Template**:

```
I want to become a Wowok errand runner, please help me establish my personal profile first.

Personal Information:
- Name: [Real name or service name]
- Contact Information: [Phone number]
- Service Area: [Areas you're familiar with]
- Transportation: [Primary transportation method]
- Working Hours: [Usual order-taking hours]
- Language Skills: [Language abilities]
- Load Capacity: [Maximum load capacity]
- Professional Skills: [Special skills or experience]
- Service Commitment: [Service commitments, such as on-time rate]

Please use the Personal tool to create my personal profile and upload this information.
```

**Step 2: Create Permission Management Object**

**Prompt Template**:

```
Please create a Permission object for my errand service, configuring complete access management.

Permission Configuration Requirements:
- Object Name: [Service Name] Permission Management
- Administrator: My default account
- Business Permission Settings:
  * Permission 1001: Runner operation permission (for Machine workflow operations)
  * Permission 1002: Customer confirmation permission (for order confirmation and evaluation)
  * Permission 1003: Service management permission (for Service object management)
  * Permission 1004: Fund management permission (for Treasury operations)

Please create the Permission object and assign all management permissions to my account.
```

**Step 3: Create Fund Custody Account**

**Prompt Template**:

```
Please create a Treasury object for my errand service, configuring fund custody and withdrawal rules.

Treasury Configuration:
- Object Name: [Service Name] Payment Account
- Token Type: 0x2::sui::SUI
- Permission Object: Use the just-created Permission object
- Withdrawal Mode: Mode 2 (supports all withdrawal methods)

Withdrawal Guard Configuration:
Please create a simple Guard object that allows me to withdraw income after completing services:
- Guard Condition: Verify service completion status
- Maximum Withdrawal Amount: Up to 100 SUI per transaction
- Verification Logic: Based on Progress object completion status

Please create the Treasury object and related Guard object.
```

**Step 4: Create Workflow Template**

**Prompt Template**:

```
Please create a Machine object for my errand service, defining standardized workflow.

Machine Configuration:
- Object Name: [Service Name] Workflow
- Permission Object: Use the created Permission object
- Workflow Node Design:
  1. "Order Confirmation" (initial node)
  2. "Departure for Pickup"
  3. "Pickup Complete"
  4. "In Delivery"
  5. "Delivery Complete" (final node)

Node Transition Rules:
- Order Confirmation → Departure for Pickup: Runner operation (permission 1001), weight 1, threshold 1
- Departure for Pickup → Pickup Complete: Runner operation (permission 1001), weight 1, threshold 1
- Pickup Complete → In Delivery: Runner operation (permission 1001), weight 1, threshold 1
- In Delivery → Delivery Complete: Customer confirmation (permission 1002), weight 1, threshold 1

Please create the Machine object and set it to published status (bPublished: true, bPaused: false).
```

**Step 5: Create Complete Service Profile**

**Prompt Template**:

```
Please create a Service object for me, establishing a complete errand runner service profile system.

Part 1: Personal Basic Information
- My Service Name: [Give yourself a catchy name, like "Lightning Lee" or "Manhattan Express"]
- Real Name: [Your real name, for building trust]
- Service Area: [Detailed service areas, like "All of Manhattan, Williamsburg Brooklyn, DUMBO, Brooklyn Heights"]
- Transportation: [Detailed description, like "Electric bike + subway combination (subway for bad weather or long distances)"]
- Working Hours: [Detailed working hours, like "Monday-Friday 8AM-10PM, weekends 9AM-9PM, holidays normal operation"]
- Contact Information: [Multiple contact methods, like "phone, WeChat, email"]

Part 2: Professional Service Capabilities
- Service Types: Restaurant pickup delivery, shopping assistance, document courier, pharmacy delivery, fresh food delivery, pet supply delivery, business document handling
- Professional Skills: [Detailed description of professional skills and experience]
- Language Abilities: [Like "English (fluent), Chinese (native), Spanish (basic)"]
- Load Capacity: [Like "Maximum 40 lbs or 2 cubic feet, equipped with thermal boxes, waterproof packaging, fragile item specialized packaging"]
- Special Qualifications: [Like "Carrying $1M commercial insurance, passed background check and identity verification"]

Part 3: Service Commitments and Pricing
- Service Commitments: [Like "95% on-time rate, full SMS progress updates, phone confirmation at key points, 24-hour customer inquiry response"]
- Basic Pricing: [Like "City basic fee starts at $12, $3 per mile over 2 miles, shopping assistance 8% service fee (minimum $10)"]
- Service Guarantee: [Like "Carrying $1M commercial insurance, full compensation for lost or damaged items, receipts and delivery confirmation provided"]
- Special Services: [Like "Emergency service 50% surcharge, night service (10PM-6AM) $10 surcharge, bad weather $8 surcharge, holiday 25% surcharge, airport service (JFK/LGA) additional $20"]

Service Technical Configuration:
- Permission Object: Use the created Permission object
- Associated Machine: Use the just-created Machine object
- Payment Treasury: Use the created Treasury object

Sales Item Setup (Universal Errand Service):
- Item Name: [Service Name] Universal Errand Service
- Base Price: 0.01 SUI (symbolic price, actual price determined by customer Demand)
- Inventory: 999 (indicates always available for orders)
- Item Description: Complete description including personal information, service capabilities, commitments, pricing strategy, and contact information

Withdrawal Guard Configuration:
- Use the Guard object configured in Treasury
- Allow income withdrawal after service completion

Please create the Service object and set it to published status (bPublished: true, bPaused: false).
```

**Usage Examples**:

**Step 1 Example**:

```
I want to become a Wowok errand runner, please help me establish my personal profile first.

Personal Information:
- Name: Mike Wang (Manhattan Express)
- Contact Information: (212) 555-0199
- Service Area: All of Manhattan, Williamsburg Brooklyn
- Transportation: Electric bike + subway combination
- Working Hours: Monday-Friday 8AM-10PM, weekends 9AM-9PM
- Language Skills: English (fluent), Chinese (native)
- Load Capacity: Maximum 40 lbs or 2 cubic feet
- Professional Skills: Familiar with Manhattan landmarks and shortcuts, cold chain delivery experience
- Service Commitment: 95% on-time rate, full progress updates

Please use the Personal tool to create my personal profile and upload this information.
```

**Step 2 Example**:

```
Please create a Permission object for my errand service, configuring complete access management.

Permission Configuration Requirements:
- Object Name: Manhattan Express Permission Management
- Administrator: My default account
- Business Permission Settings:
  * Permission 1001: Runner operation permission (for Machine workflow operations)
  * Permission 1002: Customer confirmation permission (for order confirmation and evaluation)
  * Permission 1003: Service management permission (for Service object management)
  * Permission 1004: Fund management permission (for Treasury operations)

Please create the Permission object and assign all management permissions to my account.
```

**Step 3 Example**:

```
Please create a Treasury object for my errand service, configuring fund custody and withdrawal rules.

Treasury Configuration:
- Object Name: Manhattan Express Payment Account
- Token Type: 0x2::sui::SUI
- Permission Object: Use the just-created Permission object
- Withdrawal Mode: Mode 2 (supports all withdrawal methods)

Withdrawal Guard Configuration:
Please create a simple Guard object that allows me to withdraw income after completing services:
- Guard Condition: Verify service completion status
- Maximum Withdrawal Amount: Up to 100 SUI per transaction
- Verification Logic: Based on Progress object completion status

Please create the Treasury object and related Guard object.
```

**Step 4 Example**:

```
Please create a Machine object for my errand service, defining standardized workflow.

Machine Configuration:
- Object Name: Manhattan Express Workflow
- Permission Object: Use the created Permission object
- Workflow Node Design:
  1. "Order Confirmation" (initial node)
  2. "Departure for Pickup"
  3. "Pickup Complete"
  4. "In Delivery"
  5. "Delivery Complete" (final node)

Node Transition Rules:
- Order Confirmation → Departure for Pickup: Runner operation (permission 1001), weight 1, threshold 1
- Departure for Pickup → Pickup Complete: Runner operation (permission 1001), weight 1, threshold 1
- Pickup Complete → In Delivery: Runner operation (permission 1001), weight 1, threshold 1
- In Delivery → Delivery Complete: Customer confirmation (permission 1002), weight 1, threshold 1

Please create the Machine object and set it to published status (bPublished: true, bPaused: false).
```

**Step 5 Example**:

```
Please create a Service object for me, establishing a complete errand runner service profile system.

Part 1: Personal Basic Information
- My Service Name: Manhattan Express Mike Professional Errand Service
- Real Name: Mike Wang
- Service Area: All of Manhattan, Williamsburg Brooklyn, DUMBO, Brooklyn Heights, 5-mile radius from Union Square
- Transportation: Electric bike + subway combination (subway for bad weather or long distances)
- Working Hours: Monday-Friday 8AM-10PM, weekends 9AM-9PM, holidays normal operation
- Contact Information: (212) 555-0199, WeChat: NYC_Runner_Wang, Email: wang@nycrunner.com

Part 2: Professional Service Capabilities
- Service Types: Restaurant pickup delivery, shopping assistance, document courier, pharmacy delivery, fresh food delivery, pet supply delivery, business document handling
- Professional Skills: Familiar with all Manhattan landmarks and shortcuts, cold chain food delivery experience, can handle business documents, understand pharmacy and medical supply procurement processes, familiar with SOHO area trendy stores, experienced with fragile item handling
- Language Abilities: English (fluent), Chinese (native)
- Load Capacity: Maximum 40 lbs or 2 cubic feet, equipped with thermal boxes, waterproof packaging, fragile item specialized packaging
- Special Qualifications: Carrying $1M commercial insurance, passed NYC background check and identity verification, holds food safety training certificate

Part 3: Service Commitments and Pricing
- Service Commitments: 95% on-time rate, full SMS progress updates, phone confirmation at key points, 24-hour customer inquiry response
- Basic Pricing: City basic fee starts at $12, $3 per mile over 2 miles, shopping assistance 8% service fee (minimum $10)
- Service Guarantee: Carrying $1M commercial insurance, full compensation for lost or damaged items, receipts and delivery confirmation provided
- Special Services: Emergency service 50% surcharge, night service (10PM-6AM) $10 surcharge, bad weather $8 surcharge, holiday 25% surcharge, airport service (JFK/LGA) additional $20

Service Technical Configuration:
- Permission Object: Use the created Permission object
- Associated Machine: Use the just-created Machine object
- Payment Treasury: Use the created Treasury object

Sales Item Setup (Universal Errand Service):
- Item Name: Manhattan Express Mike Universal Errand Service
- Base Price: 0.01 SUI (symbolic price, actual price determined by customer Demand)
- Inventory: 999 (indicates always available for orders)
- Item Description: Professional errand runner Mike Wang provides comprehensive errand services, covering Manhattan and main Brooklyn areas, 95% on-time rate, $1M insurance guarantee, supports restaurant delivery, shopping assistance, document courier, pharmacy delivery and various other needs. Contact: (212) 555-0199. Basic pricing starts at $12, specific prices negotiated based on distance, complexity, and time requirements.

Withdrawal Guard Configuration:
- Use the Guard object configured in Treasury
- Allow income withdrawal after service completion

Please create the Service object and set it to published status (bPublished: true, bPaused: false).
```

**Expected Response**:

```
✅ Errand runner service system created successfully!

Complete service infrastructure has been created:

Step 1 - Personal Profile:
- Personal object address: 0x1a2b3c4d...
- Personal information uploaded: Mike Wang (Manhattan Express) complete profile

Step 2 - Permission Management:
- Permission object address: 0x2b3c4d5e...
- Permission configuration: 1001(runner operations), 1002(customer confirmation), 1003(service management), 1004(fund management)

Step 3 - Fund Custody:
- Treasury object address: 0x3c4d5e6f...
- Guard object address: 0x4d5e6f7a...
- Withdrawal mode: Supports all withdrawal methods, maximum 100 SUI per transaction

Step 4 - Workflow:
- Machine object address: 0x5e6f7a8b...
- Workflow nodes: Order Confirmation → Departure for Pickup → Pickup Complete → In Delivery → Delivery Complete
- Status: Published (bPublished: true)

Step 5 - Service Profile:
- Service object address: 0x6f7a8b9c...
- Sales item: Universal Errand Service (0.01 SUI, inventory 999)
- Status: Published, ready to accept orders

Your errand service is now fully online! Customers can directly purchase services, and the system will automatically create Order and Progress objects to track each order's execution progress.
```

### 3.2 Customer Publishing Demands

**Prompt Template**:

```
I need to publish an errand request.

Task Details:
- Task Description: [One sentence describing what needs to be done]
- Pickup Address: [Detailed address]
- Delivery Address: [Detailed address]
- Time Requirement: [When you want it completed]
- Special Requirements: [Any important details to note]

Fee Setup:
- Errand Fee: $[amount]
- Item Prepayment: $[amount] (if needed)
- Tip Incentive: [conditions and amount]

Contact Information:
- Phone: [contact information]
- Notification Preference: [notification method]

Please create a Demand object and publish it to the market.
```

### 3.3 Order Execution and Progress Management

**Runner Taking Orders**:

```
I see an errand request "[request description]", and I want to use my service "[service name]" to take this order.

Execution Plan:
- Expected departure time: [time]
- Expected pickup time: [time]
- Expected delivery time: [time]
- Route planning: [specific route]

Please create Order and Progress objects for me to start executing this task.
```

**Advancing Workflow**:

```
I have completed the current work step and need to advance Progress to the next node.

Current Status:
- Progress object address: [Progress address]
- Current node: [current node name]
- Target node: [next node name]

Submission Information (including my personal profile information):
- Runner: [name and service name]
- Contact Information: [contact information]
- Completion Status: [detailed description of current completed work]
- Next Step Plan: [what to do next]
- Expected Time: [expected completion time]
- Service Quality: [service commitment fulfillment status]

Please use the Machine's progress_next operation to advance Progress from "[current node]" to "[target node]", and record the above information in the deliverable's msg.
```

**Customer Confirming Receipt**:

```
I have received all items delivered by runner "[runner name]" and am very satisfied with the service.

Items Received:
- [Detailed list of received items]
- Delivery Time: [actual delivery time]
- Service Quality: [service evaluation]

Runner Service Evaluation:
- Professionalism: [evaluation]
- Communication Quality: [evaluation]
- Service Commitment: [whether commitments were met]

Please confirm order completion, advance Progress to final "Delivery Complete" status, and process fund settlement. Use the Machine's progress_next operation to complete the final node transition.
```

**Expected Response**:

```
✅ Order completed, automatic settlement successful!

Progress object has been advanced to "Delivery Complete" status:
- Order ID: [order number]
- Progress address: [Progress object address]
- Execution duration: [total time]
- Completion status: [completion status]
- Service record: All progress advances included runner's personal profile information

Runner "[runner name]" has received payment:
- Basic service fee: [amount]
- Bonus tip: [amount] (if any)
- Total income: [total amount]

Transaction records have been updated to both parties' Repository reputation profiles:
- Runner: +[points] ([completion status], order #[N])
- Customer: +[points] (timely receipt confirmation)

Personal profile information has been recorded throughout the entire service process, providing complete data foundation for future AI matching and reputation building.

Thank you for using Wowok errand service!
```

## 4. Business Value Analysis

### 4.1 Cost Advantages

Compared to traditional platforms, the Wowok protocol can significantly reduce transaction costs:

- **Eliminate Platform Commissions**: Traditional platform 20%-30% commissions completely eliminated
- **Reduce Transaction Fees**: Only need to pay minimal blockchain gas fees
- **Improve Transparency**: All fee structures are publicly transparent, no hidden costs

### 4.2 User Experience Enhancement

**Customer Advantages**:

- Personalized demands via AI conversations; not limited by platform presets
- Transparent pricing with smart‑contract‑guaranteed fund security
- Real‑time Progress tracking for execution status
- Full service‑provider profiles for trust and better decisions

**Service Provider Advantages**:

- Zero commissions → higher income; flexible order‑taking time and service areas
- Transparent reputation system and autonomous pricing rights
- Standardized Machine workflows improve quality and reliability
- Complete personal‑profile recording to build trust and visibility

### 4.3 Social Value

| Dimension | Highlights |
| --- | --- |
| Employment opportunities | Lower entry barriers; more gig jobs; personalized demand unlocks new roles |
| Economic efficiency | Peer‑to‑peer reduces intermediaries; market pricing allocates resources better; transparent reputation lowers transaction costs |

## 5. Conclusion

The decentralized errand service based on the Wowok protocol demonstrates the practical application value of blockchain technology in the real economy. By eliminating intermediaries, reducing costs, and improving transparency, this model not only solves the structural problems of traditional platforms but also provides a new paradigm for the future development of the gig economy.

**Core Advantages Summary**:

1. **Simple Operation**: Complete everything via AI conversations
2. **Lower Costs**: Zero platform fees and minimal IT overhead
3. **Flexible & Transparent**: Personalized demands with smart‑contract guarantees
4. **Standardized Execution**: Machine workflows with real‑time progress tracking
5. **Trusted & Secure**: Transparent profiles, precise permissions, and safeguarded funds
6. **Full Audit & Impact**: Complete service records and positive social value

As more participants join, the service ecosystem based on the Wowok protocol will demonstrate greater business potential and social value.

---

_This document is written based on the Wowok protocol, showcasing practical application cases of decentralized service platforms. Includes complete technical configuration details and accurate operation prompts._
