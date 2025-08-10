# Order Object: Your Transaction Coordinator

> "When customers purchase services, Orders record everything and coordinate the entire transaction lifecycle."

## What You'll Build (30 seconds)

By the end, you will understand Order basics:

- **Basic Order** — purchase service and see Order creation
- **Order Management** — handle funds and refunds through Service operations

**Prereqs**: You already created Service objects with published offerings. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Order objects are automatically created when you purchase services. They handle payments and refunds through Service operations. If you get stuck, ask your AI assistant: "Help me purchase a service to create an Order" or "How do I manage Order refunds?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and SUI balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (purchase and see order)

**Scenario**: You want to buy a service and see how Order objects work.

**Your Mission**: Purchase a service and see the Order that gets created.

**Try This**:

```
"Purchase a consulting service for 0.2 SUI from my existing Service object on sui testnet. Show me the Order object that gets created automatically. Return: Order address + on-chain link."
```

**Success Looks Like**:

- ✅ You see Order address + on-chain link
- ✅ Order contains transaction details: buyer, seller, service, amount
- ✅ **Order created**: You understand how Orders are created from purchases

**Why This Matters**: Orders record your purchases and handle the money.

---

## 🎯 Level 2 — Advanced (manage order funds)

**Scenario**: You want to manage Order funds and handle refunds.

**Your Mission**: Use Service operations to manage your Order.

**Try This**:

```
"Use Service operations to manage my Order: demonstrate order_withdrawl to extract funds to the service provider, and show order_refund to handle refunds through refund guards. Return: updated Order balance."
```

**Success Looks Like**:

- ✅ You can withdraw funds from Order to service provider
- ✅ You can process refunds through Service operations
- ✅ **Order management working**: You understand how to handle Order finances

**Why This Matters**: Orders handle payments and refunds through Service operations.

---

## 💡 Mini Challenge — Order with Refund

**Goal**: Create an Order and practice refund handling.

**Try This**:

```
"Purchase a service for 0.3 SUI on sui testnet, then practice refund handling. Use Service operations to process a refund through refund guards. Show how Order balance changes during the refund process."
```

**Success Looks Like**:

- ✅ Order created with purchase
- ✅ Refund processed successfully
- ✅ **Refund handling**: You understand Order refund mechanics

---

## ✅ Ready for More?

**You've Unlocked**:

- 📋 **Order Creation**: You understand how Orders are created from purchases
- � **Ftund Management**: You can manage Order funds through Service operations
- 🔄 **Refund Handling**: You can process refunds through Service operations

**Next Up**: **Arbitration Objects** — learn how to handle disputes when orders go wrong!

**Quick Check**: Can you create an Order and manage its funds? If yes, you're ready for dispute resolution!

---

## 🌟 What Makes Order Objects Special?

Unlike traditional e-commerce orders, Wowok Order objects are:

1. **Auto-Created**: Created automatically when you purchase services
2. **Service-Managed**: Managed through Service operations, not independently
3. **Financial Focus**: Handle payments, withdrawals, and refunds
4. **Progress-Connected**: Create Progress instances for workflow tracking

Order objects handle the money side of transactions while Services handle the business logic!
