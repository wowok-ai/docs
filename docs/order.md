# Order 组件（📦 订单管理）

---

## 组件概述

Order 组件用于管理订单全生命周期。通常通过 Service 自动创建，也可以直接操作。Order 支持设置代理、管理订单信息、推进工作流、处理仲裁、接收资金和转移所有权等操作。

---

## 完整工具调用结构

Order 操作使用以下顶层结构：

```json
{
  "operation_type": "order",
  "data": { ... },    // Order 数据定义
  "env": { ... },      // 执行环境（可选）
  "submission": { ... } // Guard 提交数据（可选）
}
```

---

## 功能树

```
order (Order Object)
├── operation_type: "order" (固定值)
├── data (Order 数据定义)
│   ├── object (必填，Order 对象)
│   │   ├── name/id (Order 对象名称或 ID)
│   ├── agents (可选，订单代理)
│   │   └── 代理地址数组
│   ├── required_info (可选，必要信息)
│   │   └── Contact 对象 ID 或 WTS Proof 对象
│   ├── progress (可选，推进订单流程)
│   │   ├── operation (操作定义)
│   │   │   ├── next_node_name (下一节点名称)
│   │   │   └── forward (前进方向)
│   │   ├── hold (是否锁定)
│   │   ├── adminUnhold (管理员解锁，hold=true时可选)
│   │   └── message (操作结果消息，可选)
│   ├── arb_confirm (可选，提交仲裁请求)
│   │   ├── arb (Arb 对象 ID 或名称)
│   │   ├── confirm (确认仲裁材料是否有效)
│   │   ├── description (补偿申请描述)
│   │   └── proposition (补偿主张)
│   ├── arb_objection (可选，反对仲裁结果)
│   │   ├── arb (Arb 对象 ID 或名称)
│   │   └── objection (异议描述)
│   ├── arb_claim_compensation (可选，申请仲裁赔偿)
│   │   └── arb (Arb 对象 ID 或名称)
│   ├── receive (可选，接收资金)
│   │   └── result (接收结果)
│   │       └── balance (余额信息) 或 objects (对象数组)
│   └── transfer_to (可选，转移所有权)
│       └── 新所有者地址
├── env (可选，执行环境)
│   ├── account (可选，使用指定账户)
│   ├── permission_guard (可选，权限 Guard 列表)
│   ├── no_cache (可选，是否禁用缓存)
│   ├── network (可选，网络选择)
│   └── referrer (可选，推荐人 ID)
└── submission (可选，Guard 提交数据)
    └── items (提交项数组)
        ├── index (索引)
        └── data (数据)
```

---

## 子功能 1：管理订单代理 (agents)

### 功能描述

设置订单代理。代理可以操作订单（如取消订单、修改订单状态等），但不能接收订单收到的资金。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.agents` | array | 是 | 代理地址数组 | 账户名称或地址数组 |
| `env.account` | string | 否 | 使用指定账户 | 空字符串 '' 使用默认账户 |
| `env.permission_guard` | array | 否 | 权限 Guard 列表 | Guard ID 数组 |
| `env.no_cache` | boolean | 否 | 是否禁用缓存 | true=禁用; false=启用 |
| `env.network` | enum | 否 | 网络选择 | "localnet" 或 "testnet" |
| `env.referrer` | string | 否 | 推荐人 ID | 账户名称或地址 |

### 重要注意事项

⚠️ **代理可以操作订单，但不能接收资金！** 确保代理的权限范围符合预期。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 1.1：设置单个代理

**Prompt**: 为订单 "my_order" 设置代理 "agent_address"。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "agents": ["agent_address"]
  }
}
```

---

#### 示例 1.2：设置多个代理

**Prompt**: 为订单 "my_order" 设置多个代理。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "agents": ["agent_1", "agent_2", "agent_3"]
  }
}
```

---

#### 示例 1.3：清空代理列表

**Prompt**: 清空订单 "my_order" 的所有代理。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "agents": []
  }
}
```

---

## 子功能 2：设置订单必要信息 (required_info)

### 功能描述

设置订单的必要信息，如收件人 Contact 对象或通过 Wowok Messenger 传递信息的 WTS Proof 对象。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.required_info` | string/null | 是 | 必要信息对象 | Contact 对象 ID、WTS Proof 对象或 null |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **required_info 可以是 Contact 对象或 WTS Proof 对象！** 确保提供正确的对象类型。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 2.1：设置 Contact 对象作为必要信息

**Prompt**: 为订单 "my_order" 设置 Contact 对象 "contact_object" 作为必要信息。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "required_info": "contact_object"
  }
}
```

---

#### 示例 2.2：设置 WTS Proof 对象

**Prompt**: 为订单 "my_order" 设置 WTS Proof 对象作为信息传递证明。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "required_info": "wts_proof_object"
  }
}
```

---

#### 示例 2.3：清空必要信息

**Prompt**: 清空订单 "my_order" 的必要信息。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "required_info": null
  }
}
```

---

## 子功能 3：推进订单流程 (progress)

### 功能描述

推进订单的 Progress 工作流，将 Progress 从当前节点移动到下一个节点。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.progress.operation` | object | 是 | 操作定义 | 包含 next_node_name 和 forward |
| `data.progress.operation.next_node_name` | string | 是 | 下一节点名称 | Machine 中定义的节点名称 |
| `data.progress.operation.forward` | string | 是 | 前进方向 | Machine 中定义的转移名称 |
| `data.progress.hold` | boolean | 是 | 是否锁定 | true=锁定操作权限；false=提交操作结果 |
| `data.progress.adminUnhold` | boolean | 否 | 允许管理员强制解锁 | hold=true 时可选 |
| `data.progress.message` | string | 否 | 操作结果消息 | 操作结果描述 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **hold 字段决定操作类型！**
- **`hold: true`**: 锁定操作权限，避免同一权限的竞争
- **`hold: false`**: 提交操作结果，推进到下一节点

⚠️ **next_node_name 和 forward 必须是 Machine 中定义的有效值！** 确保节点和转移名称正确。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 3.1：提交操作结果推进

**Prompt**: 推进订单 "my_order" 的 Progress 到下一节点 "next_node"，通过 "forward_1" 路径，不锁定。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "progress": {
      "operation": {
        "next_node_name": "next_node",
        "forward": "forward_1"
      },
      "hold": false,
      "message": "Operation completed successfully"
    }
  }
}
```

---

#### 示例 3.2：锁定操作权限

**Prompt**: 锁定订单 "my_order" 的 Progress 操作权限，避免竞争。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "progress": {
      "operation": {
        "next_node_name": "next_node",
        "forward": "forward_1"
      },
      "hold": true,
      "adminUnhold": true,
      "message": "Locking operation for processing"
    }
  }
}
```

---

#### 示例 3.3：最小化推进

**Prompt**: 最小化推进订单 "my_order" 的 Progress，仅指定必要参数。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "progress": {
      "operation": {
        "next_node_name": "next_node",
        "forward": "forward_1"
      },
      "hold": false
    }
  }
}
```

---

## 子功能 4：提交仲裁请求 (arb_confirm)

### 功能描述

提交仲裁请求，申请仲裁赔偿。确认提交的仲裁材料对仲裁有效。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.arb_confirm.arb` | string | 是 | Arb 对象 ID 或名称 | 必须是已存在的 Arb 对象 |
| `data.arb_confirm.confirm` | boolean | 是 | 确认仲裁材料是否有效 | true=确认有效; false=不确认 |
| `data.arb_confirm.description` | string | 否 | 补偿申请描述 | 最多 4000 个字符 |
| `data.arb_confirm.proposition` | array | 否 | 补偿主张 | 主张内容数组 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **仲裁材料必须先在 Arb 对象中准备好！** 确保 Arb 对象已正确配置。

⚠️ **confirm 必须设置为 true 才能进行仲裁！**

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 4.1：提交仲裁请求

**Prompt**: 为订单 "my_order" 提交仲裁请求，使用 Arb 对象 "my_arb"，确认仲裁材料有效，添加描述和主张。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "arb_confirm": {
      "arb": "my_arb",
      "confirm": true,
      "description": "申请仲裁赔偿，因为商品未按时交付",
      "proposition": ["赔偿全额货款", "赔偿违约金"]
    }
  }
}
```

---

#### 示例 4.2：最小仲裁请求

**Prompt**: 为订单 "my_order" 提交最小仲裁请求，仅确认仲裁材料有效。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "arb_confirm": {
      "arb": "my_arb",
      "confirm": true
    }
  }
}
```

---

## 子功能 5：反对仲裁结果 (arb_objection)

### 功能描述

反对仲裁结果，提出上诉，请求重新仲裁。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.arb_objection.arb` | string | 是 | Arb 对象 ID 或名称 | 必须是已存在的 Arb 对象 |
| `data.arb_objection.objection` | string | 是 | 异议描述 | 最多 4000 个字符，说明反对理由 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **异议必须在仲裁结果公布后的有效期内提出！** 确保在时限内操作。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 5.1：提出仲裁异议

**Prompt**: 为订单 "my_order" 对仲裁结果提出异议，说明反对理由。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "arb_objection": {
      "arb": "my_arb",
      "objection": "仲裁结果不公平，我有新的证据证明商品存在质量问题，请求重新仲裁"
    }
  }
}
```

---

## 子功能 6：申请仲裁赔偿 (arb_claim_compensation)

### 功能描述

指定已裁决的 Arb 对象来获取订单赔偿。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.arb_claim_compensation.arb` | string | 是 | Arb 对象 ID 或名称 | 必须是已裁决的 Arb 对象 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **Arb 对象必须已经裁决！** 只有裁决后的 Arb 对象才能申请赔偿。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 6.1：申请仲裁赔偿

**Prompt**: 为订单 "my_order" 申请仲裁赔偿，使用已裁决的 Arb 对象 "my_arb"。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "arb_claim_compensation": {
      "arb": "my_arb"
    }
  }
}
```

---

## 子功能 7：接收资金 (receive)

### 功能描述

解包订单收到的 CoinWrapper 对象和其他对象，并将它们转移给订单所有者。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.receive.result` | object/array | 是 | 接收结果 | ReceivedBalance 对象或 ReceivedNormal 数组 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **资金将转移给订单所有者！** 确保你是订单所有者。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 7.1：接收代币余额

**Prompt**: 为订单 "my_order" 接收代币余额。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "receive": {
      "result": {
        "balance": "1000000000",
        "token_type": "0x2::wow::WOW",
        "received": [
          {
            "id": "0x1234...",
            "balance": "1000000000",
            "payment": "0xabcd..."
          }
        ]
      }
    }
  }
}
```

---

#### 示例 7.2：接收指定对象

**Prompt**: 为订单 "my_order" 接收指定的对象列表。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "receive": {
      "result": [
        {
          "id": "0x1234...",
          "type": "0x2::object::Object"
        },
        {
          "id": "0x5678...",
          "type": "0x2::object::Object"
        }
      ]
    }
  }
}
```

---

## 子功能 8：转移所有权 (transfer_to)

### 功能描述

设置订单的新所有者。需要订单所有者权限才能设置。

### 参数说明

| 参数路径 | 类型 | 必填 | 描述 | 约束 |
|----------|------|------|------|------|
| `operation_type` | string | 是 | 操作类型 | 固定值 "order" |
| `data.object` | string | 是 | Order 对象名称或 ID | 必须是已存在的 Order |
| `data.transfer_to` | string | 是 | 新所有者地址 | 账户名称或地址 |
| `env` | object | 否 | 执行环境 | 同上 |

### 重要注意事项

⚠️ **需要订单所有者权限！** 只有当前所有者才能转移所有权。

⚠️ **所有权转移后，新所有者将拥有订单的所有权限！** 确认目标地址正确。

### 返回结果

返回交易块信息 (WowTransactionBlockSchema)。

---

### 示例

#### 示例 8.1：转移订单所有权

**Prompt**: 将订单 "my_order" 的所有权转移给 "new_owner_address"。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "transfer_to": "new_owner_address"
  }
}
```

---

## 子功能 9：组合操作

### 功能描述

在一个交易中执行多个 Order 操作，例如同时设置代理和推进 Progress。

### 重要注意事项

⚠️ **组合操作在同一个交易中执行！** 所有操作原子化，要么全部成功，要么全部失败。

### 示例

#### 示例 9.1：设置代理 + 推进 Progress

**Prompt**: 为订单 "my_order" 设置代理并推进 Progress。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "agents": ["agent_address"],
    "progress": {
      "operation": {
        "next_node_name": "next_node",
        "forward": "forward_1"
      },
      "hold": false
    }
  }
}
```

---

#### 示例 9.2：设置必要信息 + 接收资金

**Prompt**: 为订单 "my_order" 设置必要信息并接收资金。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "required_info": "contact_object",
    "receive": {
      "result": [
        {
          "id": "0x1234...",
          "type": "0x2::object::Object"
        }
      ]
    }
  }
}
```

---

#### 示例 9.3：完整参数示例

**Prompt**: 在 testnet 网络上，为订单 "my_order" 设置代理、设置必要信息、推进 Progress、接收资金，使用默认账户。

```json
{
  "operation_type": "order",
  "data": {
    "object": "my_order",
    "agents": ["agent_1", "agent_2"],
    "required_info": "contact_object",
    "progress": {
      "operation": {
        "next_node_name": "next_node",
        "forward": "forward_1"
      },
      "hold": false,
      "message": "Progress completed"
    },
    "receive": {
      "result": {
        "balance": "1000000000",
        "token_type": "0x2::wow::WOW",
        "received": [
          {
            "id": "0x1234...",
            "balance": "1000000000",
            "payment": "0xabcd..."
          }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

## 重要提示

⚠️ **代理可以操作订单，但不能接收资金！**

⚠️ **progress 字段使用 OperateSchema 结构！**
- `operation`: 包含 `next_node_name` 和 `forward`，指定下一节点和前进方向
- `hold`: true 表示锁定操作权限，false 表示提交操作结果
- `adminUnhold`: hold=true 时可选，允许管理员强制解锁
- `message`: 可选的操作结果消息

⚠️ **next_node_name 和 forward 必须是 Machine 中定义的有效值！**

⚠️ **仲裁材料必须先在 Arb 对象中准备好！**

⚠️ **所有权转移需要订单所有者权限！**

⚠️ **资金将转移给订单所有者！**

⚠️ **请通过 Wowok Messenger 传递信息，隐私、安全且可维权！**
---

## 相关组件

- **Service**: 服务市场（通常通过 Service 自动创建订单）
- **Progress**: 订单进度
- **Machine**: 工作流模板
- **Arbitration**: 仲裁系统
- **Contact**: 通信中心
