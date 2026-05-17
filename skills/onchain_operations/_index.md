# onchain_operations / Index

16 discriminated operation types. Each links to its schema file. Common types (CallEnv, SubmissionCall, Recipient, NamedObject, CoinParam, ValueTypes, etc.) are in [_common.md](./_common.md).

| operation_type | File | Description |
|---|---|---|
| `service` | [service.md](./service.md) | Create/manage product listings, pricing, discounts, bind workflows, customer purchases via order_new |
| `machine` | [machine.md](./machine.md) | Design/deploy workflow templates with node/forward structures |
| `progress` | [progress.md](./progress.md) | Track active workflows, advance through nodes |
| `repository` | [repository.md](./repository.md) | Consensus database with typed policies and data read/write |
| `arbitration` | [arbitration.md](./arbitration.md) | Transparent on-chain arbitration, dispute/vote/resolve lifecycle |
| `contact` | [contact.md](./contact.md) | On-chain IM contact profiles |
| `treasury` | [treasury.md](./treasury.md) | Team fund management with deposit/withdraw Guard rules |
| `reward` | [reward.md](./reward.md) | Reward pools with Guard-verified claiming |
| `allocation` | [allocation.md](./allocation.md) | Auto-distribution plans to multiple recipients |
| `permission` | [permission.md](./permission.md) | Access control indices for object operations |
| `guard` | [guard.md](./guard.md) | Programmable boolean validation rules (recursive GuardNode tree) |
| `personal` | [personal.md](./personal.md) | PUBLIC on-chain identity — everything permanently visible |
| `payment` | [payment.md](./payment.md) | Irreversible coin transfers to wallets |
| `demand` | [demand.md](./demand.md) | Service request postings with reward pools |
| `order` | [order.md](./order.md) | Order lifecycle: progress, arbitration, refunds, ownership |
| `gen_passport` | [gen_passport.md](./gen_passport.md) | Immutable verified credentials after Guard validation |