# Service Object: Your Digital Business Storefront

> "Turn your skills into purchasable offerings with transparent pricing, automated payments, and built-in customer protection."

## Overview

### Definition

Structured supply offerings with programmable terms, integrated payment and refund logic, and real-time progress tracking.

### Functionality

Enables providers to publish services with customizable pricing, dynamic inventory, Guard-based purchase eligibility, and Machine-powered workflow management. Withdrawal and refund actions are executed automatically when predefined completion or exception conditions are met.

### Use Case — Customized Kenya Wildlife Safari

Tom submits a personalized safari request on WoWok, outlining his preferences for travel dates, wildlife focus, accommodation style, and physical comfort level.
The platform matches his request with multiple providers and automatically recommends **Natural Explorer Tours**, whose service metadata meets Tom's criteria via on-chain Repository and Guard references.

The selected provider publishes a `Service` composed of:

- **Professional guides**, licensed and verified via a credential Repository
- **Eco-lodge accommodations**, with real-time availability from an external data oracle
- **Milestone-based payouts**, tracked through a dedicated `Machine` (e.g., booking confirmed → check-in → guided tour complete)
- **Emergency cancellation Guard**, which defines refund logic for unexpected returns

During the trip:

- Tom becomes ill and needs to cut the trip short.
- He initiates an early return request through the WoWok interface.
- The platform evaluates Tom's emergency condition using a Guard referencing a trusted medical Repository.
- Upon successful verification, the system refunds Tom for the unused portions (lodging and activities) while releasing milestone-completed funds to the provider.

Throughout the process:

- **Buyers can view the full terms of the service**, including refund thresholds and breach compensation conditions.
- **Service progress is tracked in real-time** via the associated `Progress` object, offering full transparency from pre-departure to completion.
- **All fund flows, status changes, and contract conditions are recorded on-chain**, ensuring auditability and minimizing dispute risk.
- With Tom's consent, **his service behavior is recorded in his Personal profile**, training a private AI agent to help match future services more precisely to his preferences.

This use case demonstrates how WoWok enables composable, automated, and trustworthy service delivery—far beyond the static rules of Web2 platforms.

### Key Features

- Flexible pricing and inventory controls
- Guard-based purchase eligibility
- Conditional withdrawal and refund guards
- Machine-driven progress tracking
- Automatic Order generation and management
- Built-in support for discounts and promotions

## What You'll Build (30 seconds)

By the end, you will have three business storefronts and understand digital commerce:

- **Basic Service** — simple offerings with pricing and inventory
- **Professional Service** — advanced features with customer requirements
- **Workflow-Integrated Service** — automated processes with payment rules

**Prereqs**: You already created Personal and Permission objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Service objects need Treasury objects to receive payments and Permission objects to manage who can modify them. If you get stuck on setup, ask your AI assistant: "Help me create the required Treasury and Permission objects for Service management" or "What are the built-in permission indexes for Service operations?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (create digital storefront)

**Scenario**: You want to turn your skills into purchasable offerings with clear pricing and automated payments.

**Your Mission**: Create your first Service with multiple offerings that customers can buy directly.

**Prerequisites for Service Creation**:

- Permission object with service management rights must exist first
- Treasury object for receiving payments must be configured
- Both objects should be created before attempting Service creation

**Try This A** (create business storefront):

```
"Create freelance writing Service on sui testnet. First create a Permission object with Service management permissions for my default account, then create a Treasury object for receiving payments, then create the Service with three offerings: 'Blog Post Writing' (0.01 SUI, 10 stock), 'Website Copy' (0.02 SUI, 5 stock), 'Technical Documentation' (0.03 SUI, 3 stock). Configure payment withdrawal rules to allow me to collect earnings, then publish the Service. Return: Service address + on-chain link, Permission address + on-chain link, Treasury address + on-chain link, published status confirmation."
```

**Try This B** (test customer purchase):

```
"Test the Service by placing an order for 'Blog Post Writing' with max price 0.02 SUI (to ensure sufficient funds). Show the order creation process and Treasury balance changes. If order creation fails due to insufficient funds, help me get more test tokens from faucet first. Return: Order address + on-chain link, Treasury balance before/after, order creation confirmation."
```

**Try This C** (verify business operations):

```
"Query the Service object to show its complete configuration: all sales items with current stock levels, Treasury connection, published status, and any payment withdrawal rules configured."
```

**Success Looks Like**:

- ✅ You see Service address + on-chain link, Permission address + on-chain link, Treasury address + on-chain link
- ✅ Service shows published status: true, with payment withdrawal rules configured
- ✅ Sales items created: 3 offerings with test-friendly pricing (0.01-0.03 SUI range)
- ✅ **Payment processing ready**: Treasury connected and withdrawal rules allow earnings collection
- ✅ **Business operational**: Your skills are now purchasable offerings with automated payments
- ✅ **Technical setup complete**: Even if detailed sales queries have limitations, core business functionality works

**Why This Matters**: Service objects provide:

- **Instant monetization**: Turn skills into purchasable offerings immediately
- **Transparent pricing**: Customers see exact costs and terms upfront
- **Automated payments**: No manual invoicing or payment processing needed
- **Inventory control**: Automatic stock management prevents overselling

---

## 🎯 Level 2 — Application (professional service features)

**Scenario**: You want to create a high-value professional service that collects customer information and demonstrates credibility.

**Your Mission**: Build a professional Service with customer requirements and credential integration.

**Try This A** (create professional service):

```
"Create professional Business Strategy Consulting Service on sui testnet. Use existing Permission and Treasury objects, then create the Service with three tiers: 'Basic Analysis' (0.02 SUI, 20 slots), 'Premium Strategy' (0.05 SUI, 10 slots), 'Full Business Audit' (0.07 SUI, 5 slots). Configure customer information requirements to collect company details including phone, address and name. Publish the Service when ready. Return: Service address + on-chain link, customer requirements configuration, sales tiers summary."

```

**Try This B** (test professional purchase):

```
"Test ordering the Premium Strategy package. Provide sample company information as required by the Service. Show Order creation, Treasury balance changes, and how customer information is captured in the Order object. Return: Order address + on-chain link, Treasury balance before/after, customer info captured."
```

**Try This C** (verify professional features):

```
"Query the Service object to show its professional configuration: customer information requirements, sales tiers with pricing, and any credential references configured. Explain how this differs from basic Services."
```

**Success Looks Like**:

- ✅ You see Service address + on-chain link with professional tier structure
- ✅ Customer information requirements are properly configured and enforced
- ✅ Order creation captures required company details as specified
- ✅ **Professional pricing**: Higher-value services (0.02-0.07 SUI) reflect expertise level
- ✅ **Customer data collection**: Orders contain required business information
- ✅ **Service differentiation**: Clear value proposition across different service tiers

**Why This Matters**: Professional Services enable:

- **Higher value positioning**: Command premium pricing for specialized expertise
- **Customer qualification**: Collect necessary information for service delivery
- **Trust building**: Professional presentation increases customer confidence
- **Service customization**: Different tiers serve different customer needs

---

## 🎯 Level 3 — Integration (automated workflow services)

**Scenario**: You want to create a sophisticated Service with automated workflows and customer protection rules.

**Your Mission**: Build a Service that integrates with Machine objects for complex service delivery processes.

**Prerequisites for Level 3**: This level requires Machine objects for workflow automation. The Machine must be:

- Created AND published (ready to generate workflow instances)
- Configured with proper workflow nodes and transitions
- Fully operational before integrating with Service

You'll need to create a workflow Machine first, or ask your AI assistant to help set it up with the complete configuration.

**Try This A** (create workflow-integrated service):

```
"First, help me create a published Machine object for software development workflow with nodes: 'Requirements' → 'Development' → 'Testing' → 'Delivery'. Then create Custom Software Development Service on sui testnet with Machine integration. Use existing Permission and Treasury objects, create three tiers: 'Basic Project' (0.02 SUI), 'Complex Project' (0.05 SUI), 'Enterprise Project' (0.07 SUI), 3 slots each. Configure payment withdrawal rules that allow me to collect earnings after project milestones. Publish the Service when ready. Return: Service address + on-chain link, Machine address + on-chain link, workflow integration summary."
```

**Try This B** (test workflow purchase):

```
"Test ordering the Complex Project (0.05 SUI). Show Order creation, Treasury balance changes, and Progress object generation for workflow tracking. Return: Order address + on-chain link, Progress address + on-chain link, Treasury balance before/after, workflow status."
```

**Try This C** (verify workflow integration):

```
"Query the Service object to show its workflow configuration: Machine integration, payment withdrawal rules, and service tiers. Query the Progress object to show workflow status and current stage. Explain how this Service coordinates automated project delivery."
```

**Success Looks Like**:

- ✅ You have a Machine object created and published (bPublished: true)
- ✅ Service object created with Machine integration showing workflow coordination
- ✅ Order creation generates Progress object for workflow tracking
- ✅ **Workflow automation concept**: You understand how Service coordinates with Machine for automated processes, even if full implementation encounters technical limitations
- ✅ **Payment rules configured**: Service has withdrawal rules for collecting earnings at milestones
- ✅ **Complex service delivery**: One Service manages entire project lifecycle through automated workflows

**Why This Matters**: Workflow-Integrated Services enable:

- **Automated processes**: Services that run complex workflows without manual intervention
- **Milestone payments**: Collect earnings as work progresses through stages
- **Customer transparency**: Buyers can track project progress in real-time
- **Quality assurance**: Built-in workflow stages ensure proper service delivery

---

## 💡 Mini Challenge: Cross-Service Photography Ecosystem

**Creative Exercise**: Design a comprehensive photography service ecosystem that demonstrates true cross-service integration through Machine workflows and supplier dependencies.

**Try This** (as service provider):

```
"Create photography ecosystem with cross-service integration:
1) Four base Services: Portrait (0.1-0.2 SUI, 50+ slots), Wedding (2-5 SUI, 10+ slots), Editing (0.05-0.15 SUI, 100+ slots), Equipment Rental (0.02-0.1 SUI/day, 20+ items)
2) Create Machine workflows showing service dependencies:
   - Wedding workflow: Equipment Preparation (requires Equipment Rental) → Wedding Shooting → Post Processing (requires Editing Service) → Final Delivery
   - Portrait workflow: Preparation (optional Equipment Rental) → Portrait Session → Post Production (optional Editing Service) → Delivery
3) Demonstrate both required and optional supplier integrations
4) Return all Service addresses, Machine addresses, Treasury addresses, and on-chain links with workflow integration summary"
```

**Learning Focus**: This challenge teaches you how to:

- Create **service supply chains** using Machine workflows with `suppliers` configuration
- Configure **required vs optional suppliers** in workflow nodes (`bRequired: true/false`)
- Design **flexible service combinations** for different customer needs and budgets
- Implement **automated cross-service coordination** where one service automatically orders from another
- Build **complex business ecosystems** where services work together seamlessly

**Success Looks Like**:

- ✅ **Base Services**: Four independent services with test-friendly pricing
- ✅ **Machine Integration**: Two workflow machines showing different integration patterns
- ✅ **Required Suppliers**: Wedding workflow automatically orders equipment and editing
- ✅ **Optional Suppliers**: Portrait workflow offers flexible service combinations
- ✅ **Complete Ecosystem**: Services that work together to deliver comprehensive solutions

**Share Your Creation**: Post about your integrated photography business ecosystem and how Machine workflows enable seamless service collaboration!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Service first; add sales items and complexity step by step.

**Service creation fails** → Check that you have Permission and Treasury objects created first with proper management rights for your account.

**Publishing fails** →

- **Most common**: Service needs payment withdrawal rules configured before publishing
- Verify all sales items have proper pricing and stock levels set
- Check that any referenced objects (Treasury, Machine) exist and are properly configured
- Ask your AI to help create a simple Guard object and configure withdraw_guard if needed

**Customer ordering fails** →

- **Most common**: Insufficient account balance - use faucet to get more test tokens first
- Check if Service is published: bPublished should be true and ready to accept orders
- Verify items have stock available: stock > 0, sold out items show "inventory insufficient"
- Ensure Service isn't paused: bPaused should be false for active sales
- Set max_price slightly higher than item price to account for potential price fluctuations

**Payment processing issues** →

- Verify Treasury object is properly linked to your Service
- Check that Treasury has correct token type (usually '0x2::sui::SUI')
- Ensure payment withdrawal rules allow you to collect earnings
- Ask your AI to help with Treasury configuration if payments aren't processing

**Machine integration fails** →

- Check if referenced Machine exists: query Machine by name to verify creation
- Verify Machine is published: bPublished should be true and ready to generate workflows
- Ensure Machine has proper workflow configuration with connected nodes
- Ask your AI to help with complete Machine setup if integration fails

**Need permission indexes?** → Ask your AI to query the built-in permissions for Service modules to get the correct permission numbers.

**Reset, without losing learning**:

- Note the Service address and successful configuration steps
- Create a new Service with simplified structure (single item, basic pricing)
- Test basic purchase flow before adding professional features
- Gradually add complexity as you understand the business patterns

**Common Use Cases**:

- **Freelance services**: Writing, design, consulting with clear deliverables
- **Digital products**: Templates, courses, software with instant delivery
- **Professional services**: Strategy, audits, analysis with customer requirements
- **Project-based work**: Development, marketing campaigns with workflow stages

**Need help?**: The community has great examples of Service patterns for different industries!

---

## ✅ Ready for More?

**You've Unlocked**:

- 💰 **Digital Commerce**: Turn skills into purchasable offerings with automated payments
- 🏪 **Business Operations**: Manage inventory, pricing, and customer requirements
- 🔄 **Workflow Integration**: Services that coordinate complex automated processes
- 🛡️ **Customer Protection**: Built-in payment rules and transparent service delivery

**Next Up**: **Order Objects** — learn how to manage individual customer purchases and track service delivery from the customer's perspective!

**Quick Check**: Can you create a Service with multiple offerings and publish it? Can you explain how Services connect with Treasury and Machine objects? If yes, you're ready to explore the customer side of digital commerce!

---

## 🌟 What Makes Service Objects Special?

Unlike traditional service platforms, Wowok Service objects are:

1. **Transparent On-Chain Fees**: Clear, predictable transaction costs with direct peer-to-peer settlements
2. **Transparent Workflows**: All service processes are visible before purchase
3. **Automated Execution**: Machine integration enables hands-off service delivery
4. **Built-in Guarantees**: Arbitration and refund mechanisms protect customers
5. **Credential Integration**: Repository references build trust and credibility
6. **Global Accessibility**: Available 24/7 to customers worldwide without geographic restrictions

Services become the foundation for building sophisticated, automated businesses that operate transparently and efficiently on the blockchain, creating new possibilities for service delivery and customer relationships!"
