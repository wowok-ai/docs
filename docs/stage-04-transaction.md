# Stage 4: Transaction Execution 💼

---

**[← Stage 3: Open Collaboration](stage-03-collaboration.md) | [Stage 5: Business Components →](stage-05-business.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn the transaction mechanisms in WoWok, including:

- How to use Allocation for automatic fund distribution
- How to use WIP to describe products and services
- How to use Service and Order for service sales and order management
- How to use Arbitration for dispute resolution

---

## 📚 Learning Content

### 4.1 WIP for Product and Service Description (📄 WIP)

**Why use WIP for Products and Services?**

WIP (Witness Immutable Promise) provides immutable, verifiable product and service descriptions. By deploying WIP files to the network and using their URLs and hashes as product details, both sellers and buyers can establish deterministic commitments.

**Core Concepts:**
- 📄 **Immutable Content** - Product descriptions cannot be altered after creation
- 🔗 **URL + Hash Verification** - Combines network accessibility with cryptographic integrity
- ✍️ **Multi-signature Support** - Sellers can sign to establish authenticity
- ✅ **Verifiable** - Anyone can verify the content matches the promised hash

**How WIP Integrates with Service:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Service Object                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ Product URL │───▶│  WIP File   │───▶│ Hash + Signers  │  │
│  │ (Network)   │    │  (Immutable)│    │ (Verified)      │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│         │                                    │              │
│         ▼                                    ▼              │
│  User views via URL               User verifies integrity   │
│  and trusted content             and signers                │
└─────────────────────────────────────────────────────────────┘
```

**Core Workflow:**

1. **Generate WIP** - Create a WIP file describing the product/service with detailed specifications
2. **Sign WIP** - Sign with the seller's account to establish authenticity
3. **Deploy to Network** - Upload the signed WIP file to a network location
4. **Create Service** - Use the WIP URL and hash as the product details in the Service object
5. **Buyer Verification** - Buyers can view the content via URL and verify hash and signers

**Core Features:**
- ✅ Generate WIP with Markdown text and images
- ✅ Sign WIP to establish seller identity
- ✅ Verify hash integrity and signature authenticity
- ✅ Convert to HTML for display

**Important Notes:**
- ⚠️ **Hash Immutability** - Once a WIP is deployed and its hash is recorded on-chain, the content cannot be changed without changing the hash
- ⚠️ **Signature Trust** - Only signatures from trusted accounts should be considered valid
- ⚠️ **URL Accessibility** - The WIP file must remain accessible at the specified URL

**→ [View WIP Detailed Documentation →](wip.md)**

---

### 4.2 Allocation (Automatic Fund Distribution ⚖️)

**Why do we need Allocation?**

Transactions require profit sharing. Allocation allows you to preset fund distribution rules and automatically distribute to multiple recipients.

**Core Concepts:**
- 👥 **Multiple Recipients** - Support distribution to multiple addresses
- 📊 **Ratio or Fixed Amount** - Distribute by ratio or fixed amount
- 🎯 **Auto-execution** - Automatically distribute when triggered

**Core Features:**
- ✅ Add/remove recipients
- ✅ Set ratio or amount
- ✅ Set Guard verification
- ✅ Bind to Service or other objects

**→ [View Allocation Detailed Documentation →](allocation.md)**

---

### 4.3 Service + Order (Service Sales and Orders 🛒📋)

**Why do we need Service and Order?**

These are the core transaction components in WoWok! Service is what is sold, and Order is the purchase order.

**Core Concepts:**
- 🛒 **Service** - Service marketplace, publish products or services
- 📋 **Order** - Order management, handle purchase process
- 💰 **Price** - Pricing for services
- 🔗 **Binding Components** - Can bind Machine, Progress, Allocation, Guard, and more

**Core Features:**
- ✅ Create Service (publish product)
- ✅ Create Order (purchase product)
- ✅ Manage order status
- ✅ Bind various components

**Important Notes:**
- ⚠️ Service can bind components such as Machine, Guard, Allocation, Contact, Treasury, Reward, and **WIP**!

**Integration with WIP:**
- The Service object can store the WIP URL and hash as product details
- Buyers can verify the WIP file to ensure the product matches the promised description

**→ [View Service Detailed Documentation →](service.md)**
**→ [View Order Detailed Documentation →](order.md)**

---

### 4.4 Arbitration (Dispute Resolution ⚖️)

**Why do we need Arbitration?**

Transactions may have disputes. Arbitration provides a fair dispute resolution mechanism.

**Core Concepts:**
- 👨‍⚖️ **Arbitrator** - Neutral third party
- 💵 **Compensation Ratio** - Compensation ratio for buyer and seller
- ⚖️ **Fair Ruling** - Arbitrators can adjust compensation ratio

**Core Features:**
- ✅ Create arbitration object
- ✅ Add/remove arbitrators
- ✅ Set compensation ratio
- ✅ Submit and rule on disputes

**→ [View Arbitration Detailed Documentation →](arbitration.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Create a WIP for Product Description

Create a WIP file describing a product and sign it with your account

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Premium Software License\n\n## Product Details\n\n- License Type: Annual Subscription\n- Features: Full access to all modules\n- Support: 24/7 technical support\n- Duration: 12 months\n\n## Terms of Service\n\n1. Non-transferable license\n2. Single user account\n3. Auto-renewal unless cancelled",
    "account": "my_seller_account"
  },
  "outputPath": "./software_license.wip"
}
```

After generating, deploy to network and use the URL and hash when creating Service.

---

### Exercise 2: Create a Service with WIP Product Details

Create a Service with sales products that include WIP URL and hash as product details. Each product in the sales list can have its own WIP file for detailed description.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "new": true
    },
    "namedNew": {
      "name": "software_license_service"
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Premium Software License",
          "price": "1000000000",
          "stock": "100",
          "suspension": false,
          "wip": "https://example.com/products/software_license.wip",
          "wip_hash": "sha256:abcdef1234567890..."
        }
      ]
    }
  }
}
```

**Note:** The `wip` and `wip_hash` fields are part of each product in the `sales` array, allowing each product to have its own immutable description file.

---

### Exercise 3: Create an Allocation with Profit Sharing

Create a distribution rule that splits profits between two recipients

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "new": true
    },
    "namedNew": {
      "name": "profit_sharing"
    },
    "receiver_add": [
      {
        "to": "partner1_address",
        "ratio": "500000000"
      },
      {
        "to": "partner2_address",
        "ratio": "500000000"
      }
    ]
  }
}
```

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood the relationship between WIP and Service
- [ ] Created a WIP file for product/service description
- [ ] Signed a WIP file to establish authenticity
- [ ] Understood how to use WIP URL and hash as product details
- [ ] Understood the relationship between Service and Order
- [ ] Created at least one Service
- [ ] Created at least one Order
- [ ] Understood Allocation's profit-sharing mechanism
- [ ] Created at least one Allocation
- [ ] Understood the role of Arbitration
- [ ] Know how to combine these components

---

## 🎉 Congratulations!

You have completed Stage 4! Now you have mastered WoWok's transaction mechanisms and are ready to move on to the next stage to learn about business components!

**[→ Go to Stage 5: Business Components 🏪 →](stage-05-business.md)**

---

**[← Return to Main Directory](../README.md)**
