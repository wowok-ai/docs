# Getting Started

Wowok is an AI-Driven Web3 collaboration protocol that enables programmable agreements through composable smart contract objects and natural language interaction.

Wowok provides a unified framework for transforming collaborative ideas and resources into self-executing contracts that handle workflows, payments, and dispute resolution. Using WoWok, you can deploy complex systems, establish transparent collaborations, and create customized solutions that adapt to specific requirements in just minutes.

Configure Wowok through MCP-supported AI assistants using the setup guide below.

## Quick setup

### Kiro Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the bottom left corner to open Settings or use the shortcut "Ctrl+,"
   <img width="536" height="411" alt="kiro1" src="https://github.com/user-attachments/assets/1e9e4f58-cc14-4e59-ac4a-88944c0b999f" />

2. Search for "MCP" in the search bar
   <img width="1280" height="604" alt="image" src="https://github.com/user-attachments/assets/b836e77e-b384-44d5-8e26-a75abe050d1a" />

3. Open either of the two JSON files (User MCP Config recommended)
   <img width="1280" height="312" alt="image" src="https://github.com/user-attachments/assets/44f49d53-73ef-413c-939e-af71368eb5c5" />

4. Copy and paste the following content, it includes all tools preseted in Wowok:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

5. Use the shortcut Ctrl+L to enter the chat interface and start using
   <img width="1280" height="963" alt="image" src="https://github.com/user-attachments/assets/8002e40f-859a-4a63-afdb-bda5107fe334" />

</details>

### Cursor Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the top right corner to open Settings
   <img width="645" height="288" alt="image" src="https://github.com/user-attachments/assets/201dfe14-548f-4186-a448-cdf7e8b5bc64" />

2. Find the Tools & Integrations section in the left sidebar, click New MCP Server
   <img width="1280" height="850" alt="image" src="https://github.com/user-attachments/assets/f9f3c458-f8be-49da-bab7-3475e535311d" />

3. Copy and paste the following content into the expanded JSON file:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

4. Turn on the wowok mcp servers to use by clicking the button.(Recommand to turn them on all at once)
   <img width="1259" height="594" alt="image" src="https://github.com/user-attachments/assets/923dfbeb-59b7-4ddc-ae6a-0444dbdc7f57" />

5. Use the shortcut Ctrl+L to enter the chat interface and start using
   <img width="1280" height="858" alt="image" src="https://github.com/user-attachments/assets/3d5227eb-7ff2-476f-9562-7445c4f80e9b" />

</details>

### Trae Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the top right corner to open "Settings" (if there is no chat interface, you can press Ctrl+U to open it)
   <img width="902" height="211" alt="image" src="https://github.com/user-attachments/assets/c11a1918-e6be-47f2-a39c-de7588e96650" />

2. At the top of the chat box, find the "MCP" section, click "Add", then select "Manual Add"
   <img width="808" height="308" alt="image" src="https://github.com/user-attachments/assets/ea439a7a-6ac7-4fa8-9f46-afa7f3606cd1" />
   <img width="793" height="393" alt="image" src="https://github.com/user-attachments/assets/31462ba5-2974-47f4-b36d-c32248e186ef" />

3. Copy and paste the following content into the expanded JSON file:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

4. At the top of the chat box, find the "Agent" label and click "+Create"
   <img width="820" height="421" alt="image" src="https://github.com/user-attachments/assets/a36a57a2-9119-4e54-bb55-2100b1c9b197" />
5. Select all MCP tools with "wowok" in their names, as well as any additional MCP tools you need (if any). You can also configure system prompts as needed for better results.
   <img width="827" height="1366" alt="image" src="https://github.com/user-attachments/assets/99269d65-e792-4b47-b17c-53ba8ee21bad" />
6. Return to the conversation, select the agent you just created to start chatting. It is recommended to use the most advanced model.
   <img width="820" height="1057" alt="image" src="https://github.com/user-attachments/assets/33cc6e4c-d72d-45b7-bb79-9a49f3da8558" />

</details>

# About WoWok

## The Challenge

Traditional business collaboration faces significant barriers:

- High trust-building costs
- Inefficient multi-party coordination
- Expensive contract enforcement
- Data silos limiting innovation

## The WoWok Solution

To address these challenges, WoWok aims to empower trust and collaboration among agents (including humans) through true data ownership and an open‑source digital collaboration framework, bringing more effective supply‑demand matching and transaction efficiency, so that everyone’s personalized needs can be better fulfilled.

## What is WoWok?

Wowok is an AI-Driven Web3 collaboration protocol that enables programmable agreements through composable smart contract objects and natural language interaction.

Wowok provides a unified framework for transforming collaborative ideas and resources into self-executing contracts that handle workflows, payments, and dispute resolution. Using WoWok, you can rapidly deploy complex systems, establish transparent collaborations, and create customized solutions that adapt to specific requirements.

Composed of on‑chain protocols and data, real‑world oracles, open‑source SDKs, and local agents, WoWok is designed to:

- Ensure data ownership, immutable consensus, and transparent interactions.
- Ensure rich dimensions and accessibility of real‑world data.
- Ensure seamless integration of large language models and low‑cost participation for agents.
- Ensure privacy and security of sensitive information.

## What can I use WoWok for?

### Creation

WoWok Protocol fosters innovation by supporting novel business models and collaborative services. Through its core modules, users can:

- Express personalized demands paired with conditional incentives to stimulate precise market responses ([Demand](#demand)).
- Publish supply offerings with a single click, embedding immutable commitments for service milestones and transaction terms ([Service](#service)).
- Execute transactions at designated milestones through verifiable proof of existing and anticipated on-chain data ([Guard](#guard)).
- Seamlessly combine multiple available services, unlocking endless possibilities for composability and innovation.

### Collaboration

WoWok Protocol empowers collaboration across an ecosystem of super individuals—whether human or AI-driven—to achieve their collective objectives.

- Super individuals can define and publish data to open-chain repositories, enabling cross-organizational referencing, resource sharing, and significantly reduced collaboration friction ([Repository](#repository)).
- Service progress can be dynamically orchestrated to meet evolving market demands, ensuring controlled collaboration pacing, consistent quality, and sustainable supply satisfaction ([Machine](#machine)).
- Suppliers can seamlessly integrate their offerings into interconnected service networks via dynamic linking mechanisms, rapidly adapting to diverse and shifting customer requirements ([Service](#service)).
- The completion of one progress milestone can automatically trigger subsequent milestones, facilitating fluid, cross-organizational, and cross-service workflows to fulfill comprehensive customer needs ([Progress](#progress)).
- Treasury management supports flexible allocation and governance of funds within complex collaborative workflows, enabling rapid adaptation to changing business conditions ([Treasury](#treasury)).
- WoWok Protocol leverages AI-tagged data, designed for efficient recognition and interpretation by intelligent agents, enhancing precision in personalized demand-supply matching.

## WoWok Object

WoWok abstracts collaboration into composable on-chain objects. Each object clearly defines its role, functionalities, and interactions, enabling secure, verifiable, and efficient decentralized collaboration.

- ([Demand](#demand)) — Personalized demand expressions with optional incentives.

- ([Service](#service)) — Supply definitions with immutable commitments and terms.

- ([Guard](#guard)) — Data verification for current/future states and conditional settlements.

- ([Repository](#repository)) — Referenceable, cross-organizational data registries.

- ([Machine](#machine)) — Orchestration of progress pacing and quality toward market fit.

- ([Progress](#progress)) — Event/milestone objects; can trigger chained workflows.

- ([Treasury](#treasury)) — Funds custody, allocation, and programmable payouts.

- ([Permission](#permission)) — Fine-grained access/ownership control over entities and objects.

- ([Personal](#personal)) — User/agent profile and preferences for personalization.

- ([Arbitration](#arbitration)) — Dispute handling and resolution pathways.

### Demand

#### Definition:

Personalized demand fulfillment through reward-based bounty, attracting services that meet specific requirements.

#### Functionality:

Enables users to post specific demands with bounty rewards, allowing service providers to present qualifying services, with automated bounty distribution upon service selection and Guard-based eligibility verification. Bounty-based service presentation system where service providers can present qualifying services for specific demands.

#### Use Cases:

Traditional travel planning projects involve multiple communications and comparisons, which is time-consuming and labor-intensive. By publishing requirements, travelers can put forward all their requirements at once, which greatly improves efficiency. The interaction between travelers and service providers becomes more direct and efficient, while providing a more fair and transparent trading environment for both parties.

Traveler's needs launch:

Tom wanted to experience the Great Migration in Africa and was looking for a relaxing safari with accommodation close to nature and a guide who could provide knowledge of the wildlife and natural environment.

#### Key Features:

- Bounty-based reward system
- Service presentation and selection
- Time-limited claim windows
- Guard-based presenter qualification

### Service

#### Definition

Structured supply offerings with programmable terms, integrated payment and refund logic, and real-time progress tracking.

#### Functionality

Enables providers to publish services with customizable pricing, dynamic inventory, Guard-based purchase eligibility, and Machine-powered workflow management. Withdrawal and refund actions are executed automatically when predefined completion or exception conditions are met.

#### Use Case — Customized Kenya Wildlife Safari

Tom submits a personalized safari request on WoWok, outlining his preferences for travel dates, wildlife focus, accommodation style, and physical comfort level.
The platform matches his request with multiple providers and automatically recommends **Natural Explorer Tours**, whose service metadata meets Tom’s criteria via on-chain Repository and Guard references.

The selected provider publishes a `Service` composed of:

- **Professional guides**, licensed and verified via a credential Repository
- **Eco-lodge accommodations**, with real-time availability from an external data oracle
- **Milestone-based payouts**, tracked through a dedicated `Machine` (e.g., booking confirmed → check-in → guided tour complete)
- **Emergency cancellation Guard**, which defines refund logic for unexpected returns

During the trip:

- Tom becomes ill and needs to cut the trip short.
- He initiates an early return request through the WoWok interface.
- The platform evaluates Tom’s emergency condition using a Guard referencing a trusted medical Repository.
- Upon successful verification, the system refunds Tom for the unused portions (lodging and activities) while releasing milestone-completed funds to the provider.

Throughout the process:

- **Buyers can view the full terms of the service**, including refund thresholds and breach compensation conditions.
- **Service progress is tracked in real-time** via the associated `Progress` object, offering full transparency from pre-departure to completion.
- **All fund flows, status changes, and contract conditions are recorded on-chain**, ensuring auditability and minimizing dispute risk.
- With Tom’s consent, **his service behavior is recorded in his Personal profile**, training a private AI agent to help match future services more precisely to his preferences.

This use case demonstrates how WoWok enables composable, automated, and trustworthy service delivery—far beyond the static rules of Web2 platforms.

#### Key Features

- Flexible pricing and inventory controls
- Guard-based purchase eligibility
- Conditional withdrawal and refund guards
- Machine-driven progress tracking
- Automatic Order generation and management
- Built-in support for discounts and promotions

### Guard

#### Definition

Immutable on-chain condition scripts that gate operations until a verifiable Passport proves all predefined rules are satisfied.

**Functionality**
Guards encode logical rules—time windows, reputation scores, balances, external oracle data, even future events—into bytecode plus a constant table. Once published, a Guard’s address becomes a permanent reference that can be attached to Services, Orders, Machines, Treasuries, or any other WoWok object. Operators must submit a Passport (signed Q\&A proof bundle); if every “sense” evaluates to true, the guarded action succeeds, otherwise it reverts.

**Use Cases**

| Scenario                  | Guard Logic (illustrative)                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Reward Guard**          | _Admin incentive_ — “If address 0x538d… is listed as `admin` in Permission 0x64f3…, allow a 50 USDT claim from Treasury Z.” |
| **Refund Guard**          | _Tiered return policy_ — “Full refund if the Order is < 7 days old; 80 % refund if < 15 days.”                              |
| **Service Timeout Guard** | “If a Service milestone is not reached within 72 h, consumer may claim 30 % compensation.”                                  |
| **Emergency Guard**       | “Allow instant itinerary cancellation and proportional refund when a certified emergency Proof is uploaded.”                |
| **Loyal-Customer Guard**  | “Apply an extra 5 % discount when booking history ≥ 3 trips in the last 12 months.”                                         |

_Examples show common patterns; adapt to your specific business logic._

**Key Features**

- **Deterministic bytecode logic** — executes the same on every node
- **Constant table parameterization** — inject static or future data sources
- **Passport-based proof flow** — single or batched verification saves gas
- **Cross-object querying** — reference any WoWok object or external oracle
- **Immutable & reusable** — once deployed, the Guard cannot be altered, enabling full composability and auditability

### Repository

#### Definition

Policy-driven, on-chain data libraries that store structured key–value records under explicit write rules and type consensus.

**Functionality**
A Repository groups data by _policy name_. For each policy, it specifies who can write, what data type is allowed, and whether entries outside the policy are accepted (`Free` mode) or rejected (`Strict` mode).
Any WoWok object—or external contract—can reference a Repository’s address to fetch trusted values, enabling composable, cross-organizational workflows.

**Use Case — Trusted Medical Certificate**
During a Kenyan safari, Tom contracts severe malaria and must end the trip early.

1. A WoWok-approved clinic diagnoses Tom and issues a digital certificate.
2. The guide uploads the certificate to a “Trusted-Clinics” Repository whose policy admits writes only from whitelisted clinic addresses.
3. An Emergency Refund Guard queries that Repository; once the issuer address is confirmed, the Guard releases a proportional refund for the unused part of the itinerary.

This flow ensures refunds rely on verifiable, consensus-backed medical data rather than off-chain claims.

**Key Features**

- **Policy-based field control** — granular rules for _who_ may write _what_
- **Type-enforced entries** — bool, string, number… validated on-chain
- **Free vs. Strict modes** — choose open data capture or full consensus integrity
- **Referenceable by any object** — Guards, Services, Machines can read trusted values
- **Permission-indexed operations** — integrate with WoWok Permission for fine-grained governance

---

### Machine

#### Definition

A **Machine** is a modular, on-chain process blueprint composed of interconnected nodes, defining business logic, operator roles, state transitions, and verification conditions. It serves as the programmable engine behind service delivery, enabling autonomous, verifiable collaboration across parties. Once published, a Machine becomes immutable and can generate executable **Progress instances** per buyer.

Machines enable **borderless collaboration**: multiple entities can interact, commit, and validate state transitions without needing centralized control—each according to preset roles, guards, and permissions.

#### **Functionality**

A Machine defines its workflow through a **State Diagram**:

- **Nodes**: represent stages in a service (e.g., Booking, Check-in, Safari Completion)
- **Node Pairs**: define transitions between nodes
- **Forwards**: paths between nodes, executable by specific **Operators**
- **Guards**: programmable logic conditions (e.g., payment received, file uploaded)
- **Threshold & Weight**: control group transitions (e.g., "2 of 3 reviewers must approve")
- **Operators**: defined roles such as `"Order Payer"` or `"Travel Agent"`, bound by `Permission Index`
- **Lifecycle States**:

  - **Editable**: when unpublished
  - **Immutable & Executable**: once published and not paused

Each instantiated `Progress` follows the state logic of the Machine, generating real-time records, state validation, and evidence for dispute resolution.

#### **Key Components**

| Component                | Functionality                                                                    |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Nodes & Forwards**     | Define progress stages and conditional transitions                               |
| **Thresholds & Weights** | Allow multi-party approvals and flexible collaboration logic                     |
| **Named Operators**      | Assign role-specific execution power (e.g., only the "Guide" can trigger Node 3) |
| **Guard Contracts**      | Enforce data-bound conditions on each transition                                 |
| **Permissions**          | Control edit and execution rights using on-chain permission indices              |
| **Consensus Repository** | Store canonical records used during transitions for validation and automation    |
| **Custom Endpoints**     | Define front-end consoles per node to simplify UX for each role                  |

#### **Use Case — Safari Trip Coordination**

In Tom’s Kenya wildlife safari:

1. **Machine Setup**
   Natural Explorer Tours defines a `SafariMachine` with the following nodes:

   - `Order Created`
   - `Deposit Paid`
   - `Trip Started`
   - `Activity Completed`
   - `Trip Ended`
   - `Final Payment Released`

   Each node is connected via a `Forward` path with a named operator like `"Order Payer"` or `"Safari Guide"`, and each transition is gated by a **Guard**.

2. **Thresholds & Guards**

   - A `50-50` weighted approval between `"Trip Manager"` and `"On-Site Guide"` ensures the safari activity is completed before payout.
   - A `Guard` verifies that a trip photo is uploaded and GPS tag matches the safari zone before allowing the node transition.

3. **Unexpected Event Handling**

   - Midway, Tom falls ill and initiates cancellation.
   - The `Emergency Cancel` node becomes accessible only if a **medical certificate** is uploaded and passes Guard verification (e.g., timestamp, issuer credibility).
   - The Machine uses the `Repository` to fetch the credential and determine eligibility.

4. **Outcome**

   - The Machine allows partial fund withdrawal to the provider based on completed stages, and initiates a refund for unused segments.
   - The entire process is verifiable, immutable, and transparent to all parties.

---

#### **Key Features**

- **Composable Node-Based Architecture**
  Model flexible, modular service logic through re-usable nodes and directional transitions.

- **Fine-Grained Role Control**
  Bind each path to an operator role with Permission Index, ensuring only the right party can act.

- **Programmable & Auditable Logic**
  Each step is enforced by Guards and stored in on-chain repositories for post-factum validation.

- **Cross-Organizational Coordination**
  Machines enable independent entities (guides, transporters, agents) to collaborate under a shared service logic without requiring central arbitration.

- **User-Defined Interfaces (Endpoints)**
  Every node can expose a specific console view tailored to the actor’s current state, improving usability and clarity.

### Progress

#### Definition

Execution instance of a `Machine`, representing the real-time state, operator actions, and node transitions of a workflow.

#### **Functionality**

Tracks the workflow state and operator actions at each node. Supports session-based progression, audit logging, deliverable submission, task binding, and interaction with collaborative consensus repositories. Enables parent-child progress hierarchies for composable workflows.

#### **Use Case**

Tracking the individual execution flow of a service order within a multi-step supply chain agreement.

#### **Key Features**

- **Stateful Node Execution & Audit Trail**
  Records each node transition and operator action through sessions and history, ensuring traceability and transparency in execution.

- **Dynamic Role Assignment**
  Allows runtime assignment and update of named operators per transition path, aligned with machine-level permission governance.

- **Composable Hierarchies & Deliverables Binding**
  Supports parent-child relationships between progresses and attaches deliverables or sub-progresses to specific transitions.

- **Integrated Collaborative Context**
  Connects with external `context_repositories` for data sharing, validation, and coordination during multi-party execution.

### Treasury

#### **Definition**

Programmable on-chain cashbox for multi-party fund management, supporting condition-based deposits and withdrawals, with full transaction history and auditability.

#### **Functionality**

Treasury securely manages the inflow and outflow of assets for individuals, organizations, or communities. It integrates Guards to control who can deposit or withdraw, under what conditions, and to what extent. All financial interactions—including reward distribution, staking, deposits, and conditional refunds—are recorded immutably on-chain.

Treasury supports three operational modes:

1. **Internal mode** — withdrawals based on permissions; flexible but high-risk.
2. **External mode** — deposits are open, withdrawals must satisfy Guard conditions.
3. **Hybrid mode** — both internal and external withdrawals are allowed, with individual Guard rules for each address.

#### **Use Cases**

- **Internal Treasury (Example: Employee Bonus)**
  A travel company allocates yearly bonuses through Treasury to guides based on internal policy. No fixed withdrawal limit is set—permissive but risk-prone.

- **External Treasury (Example: Peer Recognition Reward)**
  During a Kenya wildlife trip, Tom rewards fellow travelers using a Treasury. He sets Guard-based conditions (e.g., Alice helped spot a rare bird) and adds her address to the withdrawal list. Upon verification, the system releases funds to Alice automatically and records it immutably.

- **Hybrid Treasury (Example: Service Deposit Escrow)**
  Tour operators or hotels deposit a service guarantee.

  - If the traveler confirms satisfaction, the deposit is released.
  - If not, a portion may be withheld for compensation.
    This model builds trust and ensures service quality through automatic, rule-based enforcement.

#### **Key Features**

- **Guard-controlled deposits & withdrawals** — customizable access rules for each participant
- **Full transaction history** — all inflows/outflows are verifiable and queryable
- **Support for multiple currencies** — flexible asset management in multi-token environments
- **Programmable payout conditions** — automate rewards, refunds, or penalties
- **Transparent & auditable operations** — ideal for DAOs, communities, and high-trust systems
- **Three operating modes** — internal, external, or hybrid fund governance

Treasury is essential infrastructure for any project or organization requiring automated, transparent, and decentralized financial coordination.

### Arbitration

#### **Definition**

Transparent and programmable on-chain dispute resolution mechanism governed by weighted voting Guards and optional usage controls.

#### **Functionality**

Arbitration enables any third-party group (e.g., a DAO, community, or certified organization) to act as a jury for resolving disputes between participants in a transaction. Jurors are defined by a `voting_guard` mapping addresses to vote weights. Dispute initiators may be filtered via `usage_guard` conditions. All submitted evidence, votes, and outcomes are recorded immutably on-chain, and compensation or remediation is executed automatically based on the final verdict.

#### **Use Case — Non-delivered Order Resolution**

Tom places an order for a souvenir from Nature Explorer Travel. The item is not delivered by the agreed date.

- Tom files a dispute via the order’s arbitration link.
- The seller and logistics provider upload delivery proof (e.g., tracking data, signed receipt).
- A jury is selected (randomly or by agreement).
- Jury members review all submitted data and vote via the platform’s arbitration module.
- With a majority vote in Tom’s favor, the system triggers automatic compensation to Tom or mandates re-delivery.
  This entire process is verifiable, auditable, and governed by pre-agreed logic.

#### **Key Features**

- **Weighted voting via `voting_guard`** — enables flexible governance (e.g., 1 address = 1 vote, or reputation-weighted)
- **Transparent, immutable dispute records** — every step is visible and on-chain
- **Automatic compensation execution** — reduces manual error or delay
- **Permissioned & guarded access** — control who can trigger arbitration or participate
- **Linked to Orders and Services** — deeply integrated with the fulfillment and agreement layer
- **Customizable endpoints** — allow juries to link off-chain evidence or identities via URLs

Arbitration in WoWok empowers communities to define their own fair and open resolution systems while ensuring enforcement is both transparent and automatic.

### Permission

#### Definition

Granular access control framework for assigning and managing operational rights via permission indexes. Each object is bound to a Permission entity at creation, enabling modular, scalable, and auditable authority management.

#### **Functionality**

Provides fine-grained permission allocation for objects and roles through index-based access control. Supports hierarchical delegation (`Builder` / `Admin`), dynamic permission updates, Guard-enforced conditional execution, and centralized multi-object governance.

#### **Use Case**

A travel agency maintains a shared repository of Kenya safari services. Multiple staff members interact with this repository through indexed permissions:

- **Trip Planner** (`index: 10001`):
  Can view and customize client itineraries.

- **Finance Officer** (`index: 10002`):
  Can execute and refund payments tied to service orders.

- **Customer Support** (`index: 10003`):
  Can view booking details and provide assistance during travel.

Tom, the traveler, interacts with the system through a permission index allowing him to confirm itineraries, trigger emergency support, and submit post-trip feedback — all without exposing sensitive operations outside his access scope.

This model ensures security, operational efficiency, and regulatory compliance in multi-role collaborative environments.

#### **Key Features**

- **Index-based Role Assignment**
  Assigns discrete permissions via integer indexes to any address, supporting modular access patterns across roles and systems.

- **Hierarchical Management**
  `Builder` can transfer control; `Admins` can assign, update, or revoke permissions without redeploying objects.

- **Guard-enabled Conditional Access**
  Enforce business logic via on-chain `Guard` contracts, gating permissions by external state (e.g., identity, membership, status).

- **Multi-object Management**
  A single `Permission` entity can govern access rights for multiple smart objects, simplifying cross-system permission orchestration.

### Order

#### **Definition**

A transactional object generated when a Service is purchased, capturing payment records, fulfillment progress, discounts, and both parties’ rights and obligations under programmable Guards.

#### **Functionality**

Orders manage the full lifecycle of a transaction—from initial payment and discount application to service fulfillment, dispute resolution, refunds, and withdrawal settlements.
They bind directly to the `Service` and spawn a `Progress` to track real-time delivery. Optional fields like contact info are stored encrypted to preserve user privacy.
Guards govern the logic of how much each party may withdraw or be refunded based on delivery status, contract breaches, or emergencies.

#### **Use Case — Traveler Purchase & Dispute Handling**

- Tom books a \$5,000 USDT safari via Nature Explorers Travel and enjoys a 10% early bird discount, paying \$4,500 USDT.
- The Order tracks his trip from preparation to execution through a linked `Progress`.
- Prior to departure, the provider cancels the trip. The `Refund Guard` ensures Tom automatically receives a full refund.
- During the trip, Tom realizes the accommodation differs from the agreed “luxury tent.” A `Breach Reward Guard` triggers, and Tom receives a 5% compensation.
- When Tom becomes ill mid-trip, an `Emergency Refund Guard` is activated. Based on his verified medical certificate, the system grants a proportional refund.

#### **Key Features**

- **Bound Progress instance** — Real-time tracking of service delivery stages
- **Guard-based refund & withdrawal logic** — Enforce who can claim what portion, under what conditions
- **Discount & pricing transparency** — Discounts, adjustments, and final prices are recorded immutably
- **Encrypted buyer information** — Optional data like delivery details or ID proof is securely stored
- **Integrated with Arbitration** — Supports seamless dispute resolution when paired with Arbitration and Service objects
- **Full audit trail** — Payment, refund, and settlement actions are permanently recorded on-chain

Orders act as the atomic unit of economic consensus within WoWok, linking intent, commitment, and accountability into one programmable structure.

---

### Discount

#### **Definition**

Transferable, programmable discount assets created by Service administrators, offering either fixed or percentage-based reductions under defined conditions. Once issued, discounts are immutable and verifiable on-chain.

#### **Functionality**

Discounts can be attached to Services to incentivize engagement, reward loyalty, or gamify user behavior. Administrators configure conditions such as minimum purchase amount, usage period, and issuance limits.
Eligibility for claiming or applying a discount can be controlled via Guards—e.g., based on user history, task completion, or external verifications.

#### **Use Case — Loyalty Discount for Travel Enthusiast**

Tom, an experienced traveler, has booked two Kenya safaris and one Tanzania climb via Nature Explorer Travel.

- His participation history is stored in a Repository.
- A Loyalty Discount requires three prior bookings.
- A Guard verifies his travel record when he logs in.
- Tom qualifies and receives an additional 15% off, stacking with the early bird offer.

In another example, Tom shares the service with two friends and invites one to sign up—completing a two-part Guard task. As a result, he unlocks a 20% discount for a future trip.

#### **Key Features**

- **Fixed or percentage types** — Supports both flat-rate and relative reductions
- **Time-limited validity** — Start/end periods define when discounts are usable
- **Guard-based eligibility** — Discount access can be earned or gated through verifiable conditions
- **Asset-like transferability** — Discounts are claimable, assignable, and persist on-chain
- **Stackable with other conditions** — Can combine with early bird rewards, milestone triggers, etc.
- **Integration with Services** — Discount application logic is embedded in Order generation

Discounts in WoWok are not just promotional tags—they are programmable value units that can be governed, verified, and distributed with the same precision as payments or permissions.
