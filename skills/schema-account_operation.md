# Schema: account_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN（除faucet/transfer/get外）。管理WoWok账户本地生命周期。

---

## 顶层结构

```
AccountOperation
├── gen?: { name?, m?, replaceExistName? }
├── faucet?: { name_or_address?, network }
├── suspend?: { name_or_address? }
├── resume?: { address, name? }
├── rename?: { name_or_address?, new_name }
├── swap_name?: { name1?, name2? }
├── transfer?: { name_or_address_from?, name_or_address_to?, amount, token_type?, network? }
├── get?: { name_or_address?, balance_required, token_type?, network? }
├── signData?: { name_or_address?, data, data_encoding? }
└── messenger?: { name_or_account?, m }
```

**约束**：至少指定一个操作字段；各操作互斥（一次调用只执行一种）。

---

## 操作详解

### gen — 生成新账户
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string(max 64) | 否 | 账户名称，空则为默认账户 |
| m | string(max 64) \| null | 否 | 启用messenger的名称；null表示不启用 |
| replaceExistName | boolean | 否 | 是否覆盖同名账户（默认false） |

**返回**：{ address, name?, m? }

### faucet — 领取测试币
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address | string | 否 | 目标账户，空为默认账户 |
| network | "localnet" \| "testnet" | **是** | 网络 |

**返回**：{ name_or_address?, result: FaucetCoinInfo[], network }

### suspend — 暂停账户
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address | string | 否 | 空为默认账户 |

**返回**：{ name_or_address?, success }

### resume — 恢复账户
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| address | string(0x+64hex) | **是** | 账户地址 |
| name | string(max 64) | 否 | 恢复后赋予的新名称 |

**返回**：{ address, name?, success }

### rename — 重命名账户
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address | string | 否 | 源账户 |
| new_name | string(max 64) | **是** | 新名称（不能是地址格式） |

**返回**：{ name_or_address?, new_name, success }

### swap_name — 交换两个账户名称
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name1 | string | 否 | 第一个账户名称 |
| name2 | string | 否 | 第二个账户名称 |

**返回**：{ name1?, name2?, success }

### transfer — 转账（⚠️ 链上交易）
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address_from | string | 否 | 发送方，空为默认账户 |
| name_or_address_to | string | 否 | 接收方，空为默认账户 |
| amount | number \| string | **是** | 金额（带单位如"2WOW"或纯数字） |
| token_type | string | 否 | 默认"0x2::wow::WOW" |
| network | "localnet" \| "testnet" | 否 | 网络 |

**返回**：WowTransactionBlockResponse（完整交易回执）

### get — 按金额获取Coin对象（⚠️ 链上交易）
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address | string | 否 | 账户，空为默认 |
| balance_required | number \| string | **是** | 所需余额 |
| token_type | string | 否 | 默认WOW |
| network | "localnet" \| "testnet" | 否 | 网络 |

**返回**：{ coin_address?, name_or_address?, balance_required, token_type?, network? }

### signData — 数据签名
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_address | string | 否 | 签名账户 |
| data | string | **是** | 待签数据 |
| data_encoding | "utf8" \| "base64" \| "hex" | 否 | 数据编码，默认utf8 |

**返回**：{ name_or_address?, signature, publicKey, address }

### messenger — 启用/禁用messenger
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name_or_account | string | 否 | 目标账户 |
| m | string(max 64) \| null | **是** | messenger名称；null=禁用 |

**返回**：{ name_or_account?, m }

---

## 输出结构

```
AccountOperationOutputWrapped
└── result: AccountOperationOutput (discriminatedUnion by status)
    ├── status: "success" → data: AccountOperationResult
    │   ├── gen?: { address, name?, m? }
    │   ├── faucet?: { name_or_address?, result[], network }
    │   ├── suspend?: { name_or_address?, success }
    │   ├── resume?: { address, name?, success }
    │   ├── rename?: { name_or_address?, new_name, success }
    │   ├── swap_name?: { name1?, name2?, success }
    │   ├── transfer?: WowTransactionBlockResponse
    │   ├── get?: { coin_address?, name_or_address?, balance_required, token_type?, network? }
    │   ├── signData?: { name_or_address?, signature, publicKey, address }
    │   └── messenger?: { name_or_account?, m }
    └── status: "error" → error: string
```

---

## AI调用规划要点

1. **生成账户前**：询问用户是否需要命名，是否启用messenger。
2. **转账前**：必须复述"从X向Y转账Z个TOKEN"，确认token_type和金额格式。
3. **faucet仅限测试网**：mainnet无faucet功能。
4. **suspend后**：该账户无法签名任何链上交易，需resume恢复。
