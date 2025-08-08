# Service Object: Your Digital Business Engine

> "Transform any service into a purchasable, transparent business with automated workflows and built-in customer protection"

## What You'll Build (30 seconds)

You'll create **Service objects** that turn your skills, products, or services into purchasable digital offerings with transparent pricing, automated workflows, and built-in customer protection. Think of them as smart contracts that handle everything from payment processing to service delivery - your complete business-in-a-box on the blockchain.

---

## 🎯 Level 1: Basic Service Offering with Pricing

**The Challenge**: You want to offer a simple service - like tutoring, consulting, or freelance work - with clear pricing and basic customer interaction.

**Your Mission**: Create your first Service object that customers can discover, purchase, and interact with.

**Try This A** (as service provider):

```
"Create my first Service object for freelance writing services with three offerings: 'Blog Post Writing' (50 SUI, 10 stock), 'Website Copy' (100 SUI, 5 stock), 'Technical Documentation' (150 SUI, 3 stock). Set up Permission and Treasury if needed, then publish the Service. Return all addresses and on-chain links."
```

**Try This B** (as buyer):

```
"Now test the Service by placing an order for 'Blog Post Writing'. Show the order process, Treasury balance changes, and what happens when I try to order more than available stock."
```

**Success Looks Like**:

- ✅ You see Service address, Permission address, Treasury address, and on-chain links
- ✅ Order object is created with address and transaction hash when buyer purchases
- ✅ Treasury balance increases by exact purchase amount (50 SUI for blog post)
- ✅ Stock decreases correctly (Blog Post Writing: 10→9 after purchase)
- ✅ **Stock management works**: When stock reaches 0, new orders show "inventory insufficient"
- ✅ **Instant monetization**: Skills turned into purchasable offerings immediately
- ✅ **Transparent pricing**: Customers see exact costs upfront
- ✅ **Automated payments**: No manual invoicing needed

---

## 🎯 Level 2: Professional Service with Policies and Portfolio

**The Challenge**: Create a more sophisticated service that includes customer requirements, service policies, and integration with your Repository data for credibility.

**Your Mission**: Build a professional-grade Service that demonstrates advanced features like customer information collection and credential verification.

**Try This A** (as service provider):

```
"Create professional 'Business Strategy Consulting' Service with three tiers: Basic (200 SUI, 20 slots), Premium (500 SUI, 10 slots), Full Audit (1000 SUI, 5 slots). Include customer info requirements and link to my credentials Repository. Return all addresses and links."
```

**Try This B** (as buyer):

```
"Test ordering the Premium package, providing required company information. Show Order creation, Treasury balance change, and how customer requirements are captured."
```

**Success Looks Like**:

- ✅ You see Service address, Repository address, Order address, and on-chain links
- ✅ Treasury balance increases by 500 SUI (Premium package purchase)
- ✅ Order object contains customer company information as required
- ✅ Service references Repository credentials for enhanced credibility
- ✅ **Customer requirements work**: Orders capture required company details
- ✅ **Credential verification**: Repository data enhances service trustworthiness
- ✅ **Professional pricing**: Higher-value services command appropriate pricing

**Pro Tip**: Professional Services that reference credential Repositories and collect customer requirements convert better and command higher prices!

---

## 🎯 Level 3: Dynamic Service with Automated Workflows

**The Challenge**: Create a sophisticated Service that integrates with Machine objects for automated workflow management, conditional pricing, and complex service delivery.

**Your Mission**: Build a Service that demonstrates the full power of Wowok's automated business logic and workflow integration.

**Try This A** (as service provider):

```
"Create 'Custom Software Development' Service with Machine workflow and Guard protection. Three tiers: Basic (2000 SUI), Complex (5000 SUI), Enterprise (10000 SUI), 3 slots each. Include Refund Guards (7-day full refund) and Breach Guards. Return all addresses and links."
```

**Try This B** (as buyer):

```
"Order the Complex Project (5000 SUI) and show Order creation, Treasury balance change, and Progress object address."
```

**Try This C** (test Guard failures):

```
"Demonstrate Guard failures: try to refund after 7 days (should fail with 'time exceeded'), try to breach claim without valid conditions (should fail with specific Guard field error). Show exact failure messages."
```

**Success Looks Like**:

- ✅ You see Service, Machine, Order, Progress addresses and on-chain links
- ✅ Treasury balance increases by 5000 SUI (Complex Project purchase)
- ✅ Progress object tracks workflow stages with timestamps
- ✅ **Refund Guards work**: 7-day refund succeeds, 8-day refund fails with "time exceeded"
- ✅ **Breach Guards work**: Invalid breach claims fail with specific Guard field errors
- ✅ **Guard failure paths**: You see exact error messages when conditions aren't met
- ✅ **Workflow integration**: Machine coordinates multi-stage automated processes

**Level Up**: You now understand how Services can orchestrate complex, multi-stage business processes with automated verification and customer protection!

---

## 💡 Mini Challenge: Multi-Service Photography Package

**Creative Exercise**: Design a comprehensive photography service ecosystem that demonstrates Service composition and cross-service integration.

**Try This** (as service provider):

```
"Create photography ecosystem with four Services: Portrait (100 SUI, 50 slots), Wedding (2000 SUI, 10 slots), Editing (50 SUI, 100 slots), Equipment Rental (30 SUI/day, 20 items). Show cross-service integration and return all Service addresses, Treasury addresses, and on-chain links."
```

**Share Your Creation**: Post about your photography business ecosystem and how you're using Service objects to create comprehensive offerings!

---

## 🔧 Troubleshooting

**Common Issues**:

**If Service creation fails**:

- Ensure you created the Permission object first with proper service management rights
- Check that you have a Treasury object set up for receiving payments
- Verify your token type is correct (usually '0x2::sui::SUI' for SUI payments)
- Make sure your account has the necessary permissions in the Permission object

**If Service publishing fails**:

- Check that all required fields are properly configured (sales items, pricing, etc.)
- Verify that any referenced objects (Treasury, Machine, Guard) actually exist
- Ensure withdraw_guard is either properly configured or cleared with removeall
- Make sure you have publishing permissions in the Permission object

**If customers can't order from your Service**:

- Confirm the Service is published and active
- Check that the Service isn't paused
- Verify that items have stock available (stock > 0) - sold out items should show clear "inventory insufficient" messages
- Ensure pricing is set correctly and customers have sufficient funds

**Price precision issues**:

- Remember SUI uses 9 decimal places on-chain - display prices in human-readable format (e.g., "50 SUI") but be aware of precision in calculations
- If you see unexpected pricing behavior, check that price calculations account for SUI's decimal precision

**If payment processing doesn't work**:

- Verify the Treasury object is properly linked to your Service
- Check that the Treasury has the correct token type configuration
- Ensure withdraw guards are properly configured for payment processing
- Confirm that the Service has proper permission to use the Treasury

**Service Management Operations**:

- **Pause/Resume**: "Pause my Service temporarily, then resume it. Show how this affects new orders."
- **Update Stock**: "Add 5 more units to 'Blog Post Writing' stock. Show stock level changes."
- **Alternative Approaches**: "Create a Service that only offers one item with fixed pricing"

**Need help?**: The community has great examples of Service patterns for different industries!

---

## ✅ Ready for More?

**You've Unlocked**:

- 💰 **Monetization Engine**: You can turn any skill or service into purchasable offerings
- 🔄 **Workflow Integration**: Your Services can orchestrate complex business processes
- 🛡️ **Customer Protection**: Built-in guarantees and transparent service delivery
- 🏢 **Professional Credibility**: Services that reference credentials and collect requirements

**Next Up**: **Demand Objects** - Learn how to create service requests that automatically match with qualified Service providers, enabling marketplace dynamics and smart service discovery!

**Quick Check**: Can you create a Service with multiple offerings and publish it? Can you explain how Services integrate with other Wowok objects? If yes, you're ready to explore the demand side of the marketplace!

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
