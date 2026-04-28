# Schema: onchain_operations

> ⛓️ 最核心的链上操作工具，通过 `operation_type` 字段区分16种子操作。每笔操作都可能产生区块链交易并消耗gas。

---

## 顶层结构（Discriminated Union by operation_type）

```
OnchainOperations
├── operation_type: "service" → data: CallService_Data, env?, submission?
├── operation_type: "machine" → data: CallMachine_Data, env?, submission?
├── operation_type: "progress" → data: CallProgress_Data, env?, submission?
├── operation_type: "repository" → data: CallRepository_Data, env?, submission?
├── operation_type: "arbitration" → data: CallArbitration_Data, env?, submission?
├── operation_type: "contact" → data: CallContact_Data, env?, submission?
├── operation_type: "treasury" → data: CallTreasury_Data, env?, submission?
├── operation_type: "reward" → data: CallReward_Data, env?, submission?
├── operation_type: "allocation" → data: CallAllocation_Data, env?, submission?
├── operation_type: "permission" → data: CallPermission_Data, env?
├── operation_type: "guard" → data: CallGuard_Data, env?
├── operation_type: "personal" → data: CallPersonal_Data, env?
├── operation_type: "payment" → data: CallPayment_Data, env?
├── operation_type: "demand" → data: CallDemand_Data, env?, submission?
├── operation_type: "order" → data: CallOrder_Data, env?, submission?
└── operation_type: "gen_passport" → guard: string, info?, env?
```

---

## 通用字段说明

### CallEnv（可选环境配置）
```
├── account?: string — 操作账户（空为默认）
├── permission_guard?: string[] — 权限Guard ID列表
├── no_cache?: boolean — 是否禁用缓存
├── network?: "localnet" | "testnet" — 网络
└── referrer?: string — 推荐人ID
```

### SubmissionCall（Guard提交数据，可选）
```
├── type: "submission"
├── guard: { object: string, impack: boolean }[] — Guard验证列表
└── submission: GuardSubmissionToFill[] — 提交数据
    └── { guard: string, submission: GuardSubmission[] }
        └── { identifier: number(0-255), value_type: ValueType, value: SupportedValue }
```

---

## 各对象操作详解

### service — 服务市场
**核心能力**：创建/管理服务列表、定价、库存、绑定Machine工作流、设置仲裁和补偿。

**CallService_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? } — 已有对象ID（修改时）或创建新对象
├── order_new?: OrderNew — 客户下单（创建订单）
│   └── { buy: BuySchema, agents?, order_required_info?, transfer?, namedNewOrder?, namedNewAllocation?, namedNewProgress? }
│       └── BuySchema: { items: ServiceBuyItem[], total_pay: CoinParam, discount?, payment_remark?, payment_index? }
│           └── ServiceBuyItem: { name, stock, wip_hash }
├── description?: string — 服务描述
├── location?: string — 服务位置
├── sales?: SalesOp — 售卖项操作（discriminated union by op）
│   ├── { op: "add", sales: ServiceSale[], bReplace? } — 添加售卖项
│   ├── { op: "set", sales: ServiceSale[], bReplace? } — 设置售卖项
│   ├── { op: "remove", sales_name: string[] } — 移除售卖项
│   └── { op: "clear" } — 清空所有售卖项
│       └── ServiceSale: { name, price, stock, suspension, wip, wip_hash }
├── repositories?: ObjectsOp — 仓库操作（discriminated union by op）
│   ├── { op: "add"|"set", objects: string[] } — 添加/设置仓库
│   ├── { op: "remove", objects: string[] } — 移除仓库
│   └── { op: "clear" } — 清空所有仓库
├── rewards?: ObjectsOp — 奖励对象操作（同repositories结构）
├── arbitrations?: ObjectsOp — 仲裁对象操作（同repositories结构）
├── machine?: string | null — 绑定Machine（null=移除）
├── discount?: Discount — 发行折扣券
│   └── { name, discount_type, discount_value, benchmark?, time_ms_start?, time_ms_end?, count?, recipient, transferable? }
├── discount_destroy?: string[] — 销毁折扣对象ID列表
├── customer_required?: string[] — 客户必填信息（如phone, email等）
├── order_allocators?: Allocators | null — 订单资金分配器
│   └── { description, threshold, allocators: Allocator[] }
│       └── Allocator: { guard, sharing: AllocationSharing[], fix?, max? }
│           └── AllocationSharing: { who: Recipient, sharing: string|number, mode: "Amount"|"Rate"|"Surplus" }
├── buy_guard?: string | null — 购买Guard（null=移除）
├── compensation_fund_add?: CoinParam — 补偿基金金额
├── compensation_locked_time_add?: number — 补偿金锁定时长（毫秒）
├── compensation_fund_receive?: ReceivedBalanceOrRecently — 接收订单补偿资金
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
├── um?: string | null — 联系对象
└── pause?: boolean — 暂停接受新订单
└── publish?: boolean — 发布状态（true=正式发布，false=草稿）
```

**关键约束**：
- 服务发布后（publish=true），Machine、arbitrations、order_allocators等变为不可变。
- 发布前需确保Machine已处于published状态。

**Service构建与发布流程（从示例中提取）**：
1. **先创建空Service（publish=false）**：获取Service地址，供后续Guard引用验证。
   ```json
   { "operation_type": "service", "data": { "object": { "name": "xxx_service" }, "publish": false } }
   ```
2. **创建引用Service的Guard**：如验证订单归属、验证当前节点等Guard，需在Service创建后、发布前完成。
3. **创建Machine并绑定到Service**：Machine创建完成后，在Service未发布前绑定。
   ```json
   { "operation_type": "service", "data": { "object": "xxx_service", "machine": "xxx_machine" } }
   ```
4. **配置完整Service并发布**：添加sales、order_allocators、arbitrations、customer_required等，最后设置 `publish: true`。
   - **注意**：order_allocators中的sharing.mode为"Rate"时，sharing值是万分比（10000=100%）。
   - customer_required可要求客户提供phone、email、shipping_address等信息。
5. **创建Reward Pool（最后）**：Reward Pool依赖Service和Guard，应在Service发布完成后创建。

**Service下单操作（order_new）**：
客户通过service操作直接下单，同时创建Order、Allocation、Progress：
```json
{
  "operation_type": "service",
  "data": {
    "object": "service名称",
    "order_new": {
      "buy": {
        "items": [{ "name": "商品名", "stock": 1, "wip_hash": "sha256:..." }],
        "total_pay": { "balance": "金额" },
        "order_info": "订单备注"
      },
      "namedNewOrder": { "name": "订单名称" },
      "namedNewAllocation": { "name": "分配器名称" },
      "namedNewProgress": { "name": "进度名称" }
    }
  }
}
```

---

### machine — 工作流模板
**核心能力**：定义订单处理的状态机，每个节点（node）代表一个状态，包含可执行的操作（forward）。

**CallMachine_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? } — 已有对象ID或创建新对象
├── progress_new?: ProgressNew — 生成新Progress对象
│   └── { task?, repository?, progress_namedOperator?, namedNew? }
│       └── progress_namedOperator: { op: "add"|"set"|"remove", name: string, operators: ManyAccountOrMark_Address }
├── description?: string — 描述
├── repository?: ObjectsOp — 共识仓库操作（discriminated union by op）
│   ├── { op: "add"|"set", objects: string[] }
│   ├── { op: "remove", objects: string[] }
│   └── { op: "clear" }
├── node?: NodeField — 节点操作（两种互斥模式）
│   **模式1: NodeSchema（增量操作）**
│   └── { op: "add"|"set", nodes: MachineNode[], bReplace? }
│       └── MachineNode: { name, pairs: NodePair[] }
│           └── NodePair: { prior_node, forwards: Forward[], threshold? }
│               └── Forward: { name, namedOperator?, permissionIndex?, weight }
│   或 { op: "remove", nodes: string[] }
│   或 { op: "clear" }
│   或 { op: "exchange", node_one, node_other }
│   或 { op: "rename", node_name_old, node_name_new }
│   或 { op: "remove prior node", pairs: NodeRemovePriorNodeData[] }
│   或 { op: "add forward", data: NodeAddForwardData[] }
│   或 { op: "remove forward", data: NodeRemoveForwardData[] }
│   **模式2: NodeJsonOrMarkdownFileSchema（完整替换）**
│   └── { json_or_markdown_file: string } — 从JSON/Markdown文件加载完整节点定义
├── pause?: boolean — 暂停生成新Progress
├── publish?: boolean — 发布对象（发布后节点不可修改）
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

**关键约束**：
- Machine发布（publish=true）后不可修改节点结构。
- 发布前需充分测试工作流逻辑。

**Machine设计经验（从示例中提取）**：
1. **节点命名与语义**：节点名称应清晰表达业务状态（如"Order Confirmed"、"Shipping"、"Delivery Complete"）。
2. **forward命名**：forward名称应描述操作动作（如"Submit Messenger Merkle Root"、"Confirm Receipt"）。
3. **threshold配置**：
   - 单签操作（如商家确认发货）：`threshold: 1`
   - 双签操作（如双方确认丢失）：`threshold: 2`，需要两个不同操作者各自提交forward。
4. **permissionIndex映射**：
   - 建议将Permission索引与节点/forward语义绑定（如1000=商家操作，1001=客户操作）。
   - 在Permission对象中通过remark记录每个索引的用途，便于管理。
5. **多路径设计**：同一节点可有多个prev_node指向它（如"Order Complete"可从"Shipping"或"Delivery Complete"到达）。
6. **时间Guard**：使用time Guard实现自动超时推进（如10天自动完成、2天自动完成）。
7. **Machine创建JSON结构**：
   ```json
   {
     "node": {
       "op": "add",
       "nodes": [
         {
           "name": "节点名称",
           "pairs": [
             {
               "prior_node": "上一节点名称（空字符串表示起始节点）",
               "threshold": 1,
               "forwards": [
                 {
                   "name": "forward名称",
                   "permissionIndex": 1000,
                   "weight": 1,
                   "guard": { "guard": "guard名称" }
                 }
               ]
             }
           ]
         }
       ]
     }
   }
   ```

---

### progress — 工作流实例
**核心能力**：驱动Machine定义的流程向前推进，管理会话（session）和操作（forward）。

**CallProgress_Data关键字段**：
```
├── object: string — Progress对象ID或名称（必填，Progress只能修改不能新建）
├── task?: string | null — 目标任务ID（设置后不可更改）
├── repository?: ObjectsOp — 共识仓库操作（discriminated union by op）
│   ├── { op: "add"|"set", objects: string[] }
│   ├── { op: "remove", objects: string[] }
│   └── { op: "clear" }
├── progress_namedOperator?: ProgressNamedOperator — 管理Progress权限命名空间操作者
│   └── { op: "add"|"set"|"remove", name: string, operators: ManyAccountOrMark_Address }
├── operate?: Operate — 推进操作（核心字段）
│   └── { operation: { next_node_name, forward }, hold?, adminUnhold?, message? }
└── permission?: string | null — 权限对象
```

**关键约束**：
- Progress的当前节点和可用forward由所属Machine定义。
- operate中的who、submit等需满足Machine节点配置的Guard和权限要求。

**Progress操作经验（从示例中提取）**：
1. **operate结构**：
   ```json
   {
     "operate": {
       "operation": {
         "next_node_name": "目标节点名称",
         "forward": "要执行的forward名称"
       },
       "hold": false,
       "message": "操作说明"
     }
   }
   ```
2. **submission结构（当forward需要Guard验证时）**：
   ```json
   {
     "submission": {
       "type": "submission",
       "guard": [{ "object": "guard名称", "impack": true }],
       "submission": [
         {
           "guard": "guard名称",
           "submission": [
             {
               "identifier": 0,
               "value_type": "String|Address|U64|...",
               "value": "提交的值"
             }
           ]
         }
       ]
     }
   }
   ```
3. **常见提交值类型**：
   - Merkle Root字符串：`value_type: "String"`，value为64位十六进制字符串。
   - 订单/服务地址：`value_type: "Address"`，value为对象名称或地址。
   - Progress地址（时间Guard）：`value_type: "Address"`，value为Progress对象名称。
4. **无Guard的forward**：如简单确认操作，无需submission字段。
5. **env.no_cache**：Progress操作常涉及状态变更后的下一步操作，建议设置 `no_cache: true`。

---

### repository — 链上数据库
**核心能力**：以共识字段+地址为key，存储强类型数据。

**CallRepository_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? } — 已有对象ID或创建新对象
├── description?: string — 描述
├── policies?: PoliciesOp — 策略规则操作（discriminated union by op）
│   ├── { op: "add"|"set", policy: PolicyRule[] } — 添加/设置策略
│   ├── { op: "remove", policy: string[] } — 移除策略（按名称）
│   └── { op: "clear" } — 清空所有策略
│       └── PolicyRule: { name, type_guard?, read_guard?, consensus?, write_guard? }
├── data_add?: DataAdd — 添加数据项
│   **模式1: SignerOrClock**
│   └── { name, write_guard?, data: SupportedValue }
│   **模式2: DataAddWithItems**
│   └── { name, items: RepDataItem[] }
│       └── RepDataItem: { data: KeyData[], write_guard? }
│           └── KeyData: { id: string|number, data: SupportedValue }
├── data_remove?: DataRemove — 删除数据项
│   **模式1: SignerOrClockBase**
│   └── { name, write_guard? }
│   **模式2: 按名称和ID列表删除**
│   └── { name, items: DataRemoveItem[] }
│       └── DataRemoveItem: { id: (string|number)[], write_guard? }
├── rewards?: ObjectsOp — 奖励对象操作（同machine中的repository结构）
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

---

### arbitration — 仲裁系统
**核心能力**：创建仲裁机构，处理订单纠纷，定义仲裁员、投票规则等。

**CallArbitration_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? } — 已有对象ID或创建新对象
├── dispute?: Dispute — 为订单创建新Arb对象
│   └── { order, description?, proposition: string[], fee: CoinParam, namedArb? }
├── description?: string — 仲裁机构描述
├── location?: string — 仲裁地点
├── fee?: string|number — 仲裁费
├── pause?: boolean — 暂停仲裁
├── confirm?: Confirm — 确认用户提交的仲裁材料
│   └── { arb, voting_deadline: number|null }
├── voting_deadline_change?: VotingDeadlineChange — 修改投票截止期限
│   └── { arb, voting_deadline: number|null }
├── vote?: Vote — 对命题投票
│   └── { arb, votes: number[], voting_guard? }
├── feedback?: Feedback — 仲裁反馈
│   └── { arb, feedback: string }
├── arbitration?: ArbitrationAction — 提供最终仲裁结果
│   └── { arb, feedback: string, indemnity: number }
├── reset?: Reset — 用户申请重新提交材料
│   └── { arb, feedback: string }
├── arb_withdraw?: ArbWithdraw — 从Arb对象提取仲裁费
│   └── { arb }
├── fees_transfer?: FeesTransfer — 分配提取的仲裁费
│   └── { to: { allocation } | { treasury }, payment_remark, payment_index, newPayment? }
├── usage_guard?: string | null — 设置用户申请仲裁时的Guard验证
├── voting_guard?: VotingGuardAction — 设置投票时的Guard验证
│   └── { op: "add"|"set", guards: VotingGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

---

### contact — 联系人管理
**核心能力**：管理链上即时通信联系人档案。

**CallContact_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? } — 已有对象ID或创建新对象
├── my_status?: string — 设置自己在联系人列表中的状态消息
├── description?: string — 联系人对象描述
├── location?: string — 位置信息
├── ims?: ImsOperation — IM联系人列表操作（discriminated union by op）
│   ├── { op: "add", im: ImEntry[] } — 添加联系人
│   ├── { op: "set", im: ImEntry[] } — 设置/替换所有联系人
│   ├── { op: "remove", im: string[] } — 移除联系人（按地址/名称）
│   └── { op: "clear" } — 清空所有联系人
│       └── ImEntry: { at: string, description? }
├── owner_receive?: ReceivedObjectsOrRecently — 接收对象并解包给Permission所有者
└── um?: string | null — 联系对象
```

---

### treasury — 团队资金库
**核心能力**：创建团队资金池，设置存取规则。

**CallTreasury_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? } — 已有对象ID或创建新对象
├── description?: string — 描述
├── receive?: ReceivedBalanceOrRecently — 接收CoinWrapper并存入余额
├── deposit?: Deposit — 存入资金
│   └── { coin: CoinParam, by_external_deposit_guard?, payment_info, namedNewPayment? }
├── withdraw?: Withdraw — 提取资金
│   └── { amount: { fixed: string|number } | { by_external_withdraw_guard: string }, recipient, payment_info, namedNewPayment? }
├── external_deposit_guard?: ExternalDepositGuardOp — 外部存入Guard操作
│   └── { op: "add"|"set", guards: AmountFromDepositGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── external_withdraw_guard?: ExternalWithdrawGuardOp — 外部提取Guard操作
│   └── { op: "add"|"set", guards: AmountFromWithdrawGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

---

### reward — 奖励池
**核心能力**：创建奖励池，设置Guard验证的领取条件。

**CallReward_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? } — 已有对象ID或创建新对象
├── claim?: string — Guard对象ID，验证通过后启动对应奖励分配
├── description?: string — 描述
├── coin_add?: CoinParam — 向Reward对象添加金额
├── receive?: ReceivedBalanceOrRecently — 解包CoinWrapper并存入待处理余额
├── guard_add?: RewardGuard[] — 添加奖励Guard条件
│   └── { guard, recipient, amount, expiration_time?, store_from_id? }
│       └── recipient: { GuardIdentifier: number } | { Entity: string } | { Signer: boolean }
│       └── amount: { type: "GuardU64Identifier", value: number } | { type: "Fixed", value: string|number }
├── guard_remove_expired?: boolean — 是否移除过期Guard
├── guard_expiration_time?: number | null — 新增Guard的过期时间（毫秒），null表示永不过期
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

**Reward Pool构建经验（从示例中提取）**：
1. **分阶段创建**：
   - 阶段1：创建Reward对象并充值（coin_add）。
   - 阶段2：创建奖励验证Guard（如验证Progress节点为Wonderful）。
   - 阶段3：将Guard添加到Reward对象（guard_add）。
2. **guard_add配置**：
   ```json
   {
     "guard_add": [
       {
         "guard": "reward_wonderful_v2",
         "recipient": {"Signer": true},
         "amount": {"type": "Fixed", "value": 10000}
       }
     ]
   }
   ```
3. **领取奖励**：用户通过reward操作claim，提交满足Guard条件的submission。
   ```json
   {
     "data": {
       "object": "myshop_reward_v2",
       "claim": "reward_wonderful_v2"
     },
     "submission": { /* Guard验证提交 */ }
   }
   ```
4. **奖励用途**：可用于优质服务奖励、丢失补偿、超时补偿等场景。

---

### allocation — 资金分配
**核心能力**：创建分配计划，自动按策略分发资金给多个接收方。

**CallAllocation_Data关键字段（Discriminated Union）**：

**创建新Allocation对象**：
```
├── object: { name, type_parameter? } — 创建新对象（必须传对象格式）
├── allocators: Allocators — 分配器配置
│   └── { description, threshold, allocators: Allocator[] }
│       └── Allocator: { guard, sharing: AllocationSharing[], fix?, max? }
├── coin: CoinParam — 初始资金
└── payment_info: PaymentInfo — 支付信息
```

**操作已有Allocation对象**：
```
├── object: string — 已有对象ID或名称
├── received_coins?: ReceivedBalanceOrRecently — 解包CoinWrapper并存入待分配余额
└── alloc_by_guard?: string — 验证指定Guard并执行对应资金分配
```

---

### permission — 权限控制
**核心能力**：定义谁可以对哪些对象执行哪些操作。

**CallPermission_Data关键字段**：
```
├── object?: string | { name?, tags?, onChain?, replaceExistName? } — 已有对象ID或创建新对象
├── description?: string — 描述
├── remark?: RemarkOp — 权限备注操作（discriminated union by op）
│   ├── { op: "set", index: number, remark: string } — 设置备注
│   ├── { op: "remove", index: number } — 移除备注
│   └── { op: "clear" } — 清空所有备注
├── table?: TableOp — 权限分配操作（discriminated union by op）
│   **按权限索引操作（Permission-centric）**：
│   ├── { op: "add perm by index", index: number, entity: ManyAccountOrMark_Address } — 为指定权限添加实体
│   ├── { op: "set perm by index", index: number, entity: ManyAccountOrMark_Address } — 设置指定权限的实体列表
│   ├── { op: "remove perm by index", index: number, entity: ManyAccountOrMark_Address } — 移除指定权限的实体
│   **按实体操作（Entity-centric）**：
│   ├── { op: "add perm by entity", entity: AccountOrMark_Address, index: number[] } — 为指定实体添加权限
│   ├── { op: "set perm by entity", entity: AccountOrMark_Address, index: number[] } — 设置指定实体的权限列表
│   └── { op: "remove perm by entity", entity: AccountOrMark_Address, index: number[] } — 移除指定实体的权限
├── entity?: EntityOp — 高级实体权限操作（discriminated union by op）
│   ├── { op: "swap", entity1, entity2 } — 交换两个实体的所有权限
│   ├── { op: "replace", entity1, entity2 } — 将entity1的权限转移给entity2
│   ├── { op: "copy", entity1, entity2 } — 将entity1的权限复制给entity2
│   └── { op: "del", entity } — 删除实体的所有权限
├── admin?: AdminOp — 管理员操作
│   └── { op: "add"|"remove"|"set", addresses: ManyAccountOrMark_Address }
├── apply?: string[] — 将Permission对象应用到指定对象列表
├── builder?: AccountOrMark_Address — 设置/转移Permission对象所有权
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给builder(owner)
└── um?: string | null — 联系对象
```

**关键约束**：
- 创建Permission前，必须先通过wowok_buildin_info查询built-in permissions了解可用索引。
- 用户自定义权限索引范围：1000-65535。

**Permission设计经验（从示例中提取）**：
1. **索引规划**：为不同角色/操作分配固定索引区间：
   - 1000：商家操作（如确认订单、发货）
   - 1001：客户操作（如确认收货、评价）
   - 1015-1017：特殊操作（如退货、退款确认）
2. **remark记录**：为每个索引添加remark说明用途，便于后续维护。
   ```json
   {
     "remark": { "op": "set", "index": 1000, "remark": "Merchant operations" },
     "table": { "op": "add perm by index", "index": 1000, "entity": { "entities": [{"name_or_address": "merchant_account"}] } }
   }
   ```
3. **entity配置**：支持多个实体共享同一权限，也支持用Guard进一步约束。

---

### guard — 可编程验证规则
**核心能力**：创建不可变的验证规则树，返回boolean结果。

**CallGuard_Data关键字段**：
```
├── namedNew?: { name: string, tags?: string[], onChain?: boolean, replaceExistName?: boolean } — 新对象命名
├── description?: string — Guard描述
├── table?: GuardTableItem[] — 数据表定义
│   └── { identifier(0-255), b_submission: boolean, value_type: ValueType, value?, name? }
├── root: GuardRoot — 规则树根节点（必填）
│   ├── type: "node" → node: GuardNode（直接定义节点树）
│   └── type: "file" → file_path: string, format?: "json"|"markdown"（从文件加载）
│       └── GuardNode: { logic?: "and"|"or"|"not", instructions?, queries?, children?: GuardNode[] }
│           └── instructions: { name, id, parameters?: SupportedValue[], returnType? }
│           └── queries: { id, name, objectType, parameters, return, description, parameters_description }
└── rely?: { guards: string[], logic_or?: boolean } — 依赖的其他Guard对象
```

**关键约束**：
- 创建Guard前，必须先通过wowok_buildin_info查询guard instructions了解所有可用操作。
- Guard一旦创建不可修改（immutable），设计需谨慎。
- 复杂Guard建议先用guard2file导出模板编辑。

**Guard设计经验（从示例中提取）**：
1. **常见Guard类型**：
   - **Merkle Root验证**：验证提交的字符串是否为64位十六进制（Merkle Root格式）。
   - **Service-Order关联验证**：验证订单是否属于指定Service，且当前节点是否为预期节点。
   - **时间Guard**：验证从指定节点进入后是否已超过指定时间（如10天=864000000ms）。
   - **资金分配Guard**：验证当前Progress节点是否在指定集合中（如[Order Complete, Wonderful, Return Fail]）。
2. **Guard依赖链**：
   - Guard可查询Service名称、Progress状态、节点名称等链上数据。
   - 创建Guard前需确保被查询的对象已存在（如Service已创建）。
3. **table字段**：定义Guard的数据表结构，identifier范围0-255，用于submission中按索引提交数据。
4. **Guard创建后不可修改**：设计时需充分考虑所有边界情况，建议先用guard2file导出已有类似Guard做参考。

---

### personal — 公开身份档案
**核心能力**：建立链上公开身份。

**⚠️ 关键警告**：所有数据永久公开上链！

**CallPersonal_Data关键字段**：
```
├── description?: string — 个人描述
├── referrer?: string | null — 推荐人ID（加入链上网络）
├── information?: InformationOp — 个人信息操作（discriminated union by op）
│   ├── { op: "add", data: RecordsInEntity[] } — 添加信息记录
│   ├── { op: "remove", name: string[] } — 移除记录（按名称）
│   └── { op: "clear" } — 清空所有信息
│       └── RecordsInEntity: { name, value_type: ValueType, value: SupportedValue }
└── mark?: MarkOp — 链上身份标记操作（discriminated union by op）
    ├── { op: "add", data: { address, name?, tags? }[] } — 添加标记
    ├── { op: "remove", data: { address, tags? }[] } — 移除标记
    ├── { op: "clear", address: ManyAccountOrMark_Address } — 清空指定地址标记
    ├── { op: "transfer", to: AccountOrMark_Address } — 转移标记所有权
    ├── { op: "replace", new_mark_object: string } — 替换为新标记对象
    └── { op: "destroy" } — 永久销毁标记
```

---

### payment — 直接转账
**核心能力**：创建不可变的支付对象，向多个接收方转账。

**CallPayment_Data关键字段**：
```
├── object: { name, type_parameter? } — 创建新Payment对象（必填，Payment不可修改）
├── revenue: Revenue[] — 收款人列表（必填）
│   └── { recipient: AccountOrMark_Address, amount: CoinParam }
└── info: PaymentInfo — 支付信息（必填）
```

---

### demand — 需求发布
**核心能力**：发布服务需求并设置奖励池激励推荐人。

**CallDemand_Data关键字段**：
```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? } — 已有对象ID或创建新对象
├── present?: DemandPresent — 推荐服务到Demand对象
│   └── { recommend: string, by_guard?, service? }
├── description?: string — 描述
├── location?: string — 服务位置
├── rewards?: ObjectsOp — 奖励对象操作（discriminated union by op）
├── feedback?: FeedbackInfo[] — 用户反馈信息
│   └── { who: AccountOrMark_Address, acceptance_score?, feedback? }
├── guards?: GuardsOp — 验证Guard列表操作（discriminated union by op）
│   ├── { op: "add"|"set", guard: ServiceGuard[] }
│   ├── { op: "remove", guard: string[] }
│   └── { op: "clear" }
│       └── ServiceGuard: { guard, service_identifier? }
├── owner_receive?: ReceivedObjectsOrRecently — 解包CoinWrapper并发送给Permission所有者
└── um?: string | null — 联系对象
```

---

### order — 订单管理
**核心能力**：管理订单全生命周期，包括仲裁、进度推进、退款、设置代理等。

**CallOrder_Data关键字段**：
```
├── object: string — 订单ID或名称（必填）
├── agents?: ManyAccountOrMark_Address — 订单代理（可操作订单但不能收款）
├── required_info?: string | null — 联系对象ID或WTS Proof对象（通过Messenger交付信息的证明）
├── progress?: Operate — 推进订单流程（同Progress的operate结构）
│   └── { operation: { next_node_name, forward }, hold?, adminUnhold?, message? }
├── arb_confirm?: ArbConfirm — 提交赔偿请求并申请仲裁
│   └── { arb, confirm, description?, proposition? }
├── arb_objection?: ArbObjection — 反对仲裁结果并上诉
│   └── { arb, objection: string }
├── arb_claim_compensation?: ArbClaimCompensation — 指定已裁决Arb对象获取赔偿
│   └── { arb }
├── receive?: QueryReceivedResult — 解包CoinWrapper并转移给订单所有者
└── transfer_to?: AccountOrMark_Address — 设置订单新所有者
```

**Order创建经验（从示例中提取）**：
1. **通过Service下单（推荐）**：客户通过service操作的order_new字段下单，同时创建Order、Allocation、Progress。
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "service名称",
       "order_new": {
         "buy": { "items": [...], "total_pay": { "balance": "金额" } },
         "namedNewOrder": { "name": "myshop_order_v2" },
         "namedNewAllocation": { "name": "myshop_allocation_v2" },
         "namedNewProgress": { "name": "myshop_progress_v2" }
       }
     }
   }
   ```
2. **WIP验证**：购买时可提供wip_hash进行产品真伪验证，确保购买的商品与承诺一致。
3. **订单信息**：order_info字段可填写订单备注（如祝福语、特殊要求等）。

**Order资金提取经验**：
1. **提取条件**：提取资金需满足Service中order_allocators配置的Guard条件。
2. **提取结构**：
   ```json
   {
     "data": {
       "object": "订单名称",
       "receive": "提取Guard名称"
     },
     "submission": {
       "type": "submission",
       "guard": [{ "object": "提取Guard名称", "impack": true }],
       "submission": [{
         "guard": "提取Guard名称",
         "submission": [{ "identifier": 0, "value_type": "Address", "value": "Progress名称" }]
       }]
     }
   }
   ```
3. **谁可以提取**：由order_allocators中的sharing配置决定（如Signer=当前签名者，GuardIdentifier=从Guard表取地址）。

---

### gen_passport — 生成验证护照
**核心能力**：Guard验证通过后生成不可变的验证凭证。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| guard | string | **是** | Guard对象ID |
| info | SubmissionCall | 否 | 提交数据（不提供则尝试从Guard获取已有提交） |
| env | CallEnv | 否 | 环境配置 |

---

## 输出结构

```
CallOutput
└── result: CallResult (discriminated union by type)
    ├── type: "submission" → guard, submission — 需要用户提交Guard验证数据
    ├── type: "transaction" → WowTransactionBlockResponse — 交易成功回执
    ├── type: "error" → error: string — 错误信息
    ├── type: "data" → data: ResponseData[] — 对象变更数据
    └── type: "null" — 无返回值
```

---

## AI调用规划要点

1. **对象创建 vs 修改**：
   - 创建：object字段传 `{ name: string, tags?: string[], onChain?: boolean, replaceExistName?: boolean, type_parameter?: string, permission?: string|object }`。
   - 修改：object字段传已有对象ID或名称。

2. **Guard/Permission是基础设施**：
   - 设计复杂业务对象前，先确认Guard和Permission是否已准备就绪。
   - 创建Guard前必须查询wowok_buildin_info(guard instructions)。
   - 创建Permission前必须查询wowok_buildin_info(built-in permissions)。

3. **金额参数统一处理**：
   - 所有金额字段支持带单位字符串（如"2WOW"）或纯数字。
   - 使用非WOW代币时，必须同时指定token_type。

4. **Machine发布前检查清单**：
   - 所有节点定义是否正确？
   - forward的Guard和权限是否配置？
   - 是否已用machineNode2file导出检查？

5. **Service发布前检查清单**：
   - Machine是否已创建并绑定？
   - sales定价和库存是否正确？
   - order_allocators的sharing总和是否为10000（Rate模式）？
   - 仲裁和补偿设置是否合理？
   - **关键**：一旦publish=true，Machine、arbitrations、order_allocators等不可再修改。
