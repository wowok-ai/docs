# Schema: query_toolkit

> 🔍 WOWOK数据查询统一入口。支持本地命名信息查询和链上对象、数据表、事件、余额、用户资料等查询。

---

## 顶层结构（Discriminated Union by query_type）

```
WatchQueryOperations
├── query_type: "local_mark_list" → filter?: LocalMarkFilter
├── query_type: "account_list" → filter?: AccountFilter
├── query_type: "local_info_list" → filter?: LocalInfoFilter
├── query_type: "token_list" → filter?: TokenDataFilter
├── query_type: "account_balance" → account?: NameOrAddress
├── query_type: "onchain_personal_profile" → account?: NameOrAddress
├── query_type: "onchain_objects" → objects: ObjectsQuery
├── query_type: "onchain_table" → parent, cursor?, limit?
├── query_type: "onchain_table_item_repository_data" → parent, name, entity, no_cache?, network?
├── query_type: "onchain_table_item_permission_perm" → parent, address, no_cache?, network?
├── query_type: "onchain_table_item_reward_record" → parent, address, no_cache?, network?
├── query_type: "onchain_table_item_demand_presenter" → parent, address, no_cache?, network?
├── query_type: "onchain_table_item_treasury_history" → parent, address, no_cache?, network?
├── query_type: "onchain_table_item_machine_node" → parent, key, no_cache?, network?
├── query_type: "onchain_table_item_progress_history" → parent, u64, no_cache?, network?
├── query_type: "onchain_table_item_address_mark" → parent, address, no_cache?, network?
├── query_type: "onchain_table_item_entity_registrar" → address, no_cache?, network?
├── query_type: "onchain_table_item_entity_linker" → address, no_cache?, network?
└── query_type: "onchain_received" → object, all_type?, cursor?, limit?
```

---

## 本地查询

### local_mark_list — 查询本地标记列表
- **filter**: { name?, tags?, address?, createdAt?: {gte?, lte?}, updatedAt?: {gte?, lte?} }
- **返回**: { result: MarkData[] }

### account_list — 查询本地账户列表
- **filter**: { name?, address?, suspended?, hasMessenger?, m?, createdAt?: {gte?, lte?}, updatedAt?: {gte?, lte?} }
- **返回**: { result: AccountData[] }

### local_info_list — 查询本地信息列表
- **filter**: { name?, default?, contents?, createdAt?: {gte?, lte?}, updatedAt?: {gte?, lte?} }
- **返回**: { result: InfoData[] }

### token_list — 查询本地Token列表
- **filter**: { alias_or_name?, symbol?, type? }
- **返回**: { result: TokenTypeInfo[] }

### account_balance — 查询账户余额
- **account**: NameOrAddress（空为默认账户）
- **返回**: { result: CoinBalance[] }

---

## 链上查询

### onchain_personal_profile — 查询链上公开个人资料
- **account**: NameOrAddress（空为默认账户）
- **返回**: { result: ObjectPersonal \| null }

### onchain_objects — 批量查询链上对象
- **objects**: { names: NameOrAddress[], no_cache?, network? }
- **返回**: { objects: ObjectUnion[] }（ObjectUnion包含所有对象类型的并集）

### onchain_table — 查询对象数据表
- **parent**: 父对象ID
- **cursor**: 分页游标（null为首页）
- **limit**: 每页数量
- **返回**: { items: TableAnswerItem[], nextCursor, hasNextPage, cache_expire? }

### onchain_table_item_* — 查询数据表单项

各子类型的key字段不同：

| query_type | 关键字段 | key类型说明 |
|------------|----------|-------------|
| repository_data | parent, name, entity | name+entity(address/number) |
| permission_perm | parent, address | address |
| reward_record | parent, address | address（领取者） |
| demand_presenter | parent, address | address（展示者） |
| treasury_history | parent, address | address（支付ID） |
| machine_node | parent, key | string（节点名） |
| progress_history | parent, u64 | u64（历史索引） |
| address_mark | parent, address | address |
| entity_registrar | address | address（全局表，无parent） |
| entity_linker | address | address（全局表，无parent） |

### onchain_received — 查询对象收到的资产/对象
- **object**: 对象ID
- **all_type**: 是否查询所有类型
- **cursor/limit**: 分页
- **返回**: { result: ReceivedBalance \| ReceivedNormal[] }

---

## 核心数据类型速查

### TokenTypeInfo
```
{ type, alias?, name, symbol, decimals, description, iconUrl?, id? }
```

### ObjectBase（所有链上对象基类）
```
{ object, type?, type_raw?, owner?, version?, previousTransaction?, cache_expire?, query_name? }
```

### ObjectUnion包含的对象类型
- ObjectPermission, ObjectRepository, ObjectArb, ObjectArbitration, ObjectService, ObjectMachine, ObjectOrder, ObjectProgress, ObjectPayment, ObjectTreasury, ObjectGuard, ObjectDemand, ObjectPassport, ObjectAllocation, ObjectResource, ObjectReward, ObjectDiscount, ObjectEntityRegistrar, ObjectEntityLinker, ObjectContact, ObjectPersonal, ObjectProof, ObjectBase

---

## AI调用规划要点

1. **批量查询对象**：onchain_objects支持一次查询多个对象，用names数组传入ID或名称列表。
2. **数据表分页**：onchain_table返回hasNextPage和nextCursor，需循环获取完整数据。
3. **table_item的parent**：必须是该数据表所属对象的ID（如查询MachineNode需传入Machine对象ID）。
4. **entity_registrar/entity_linker无parent**：这两个是全局表，直接传address即可。
5. **no_cache**：对实时性要求高的查询设为true，强制从链上获取最新数据。

## 从示例中提取的查询实践

### 构建过程中的状态查询
在复杂系统构建过程中，需要频繁查询对象状态以确认前一步是否成功：

1. **查询刚创建的对象**：
   ```json
   {
     "query_type": "onchain_objects",
     "objects": {
       "names": ["myshop_permission_v2", "three_body_signature_service_v2"],
       "no_cache": true
     }
   }
   ```
   - **必须设置no_cache**：刚创建的对象可能还未进入缓存，不设置可能查不到。

2. **查询对象数据表（如Machine节点）**：
   ```json
   {
     "query_type": "onchain_table_item_machine_node",
     "parent": "myshop_advanced_machine_v2",
     "key": "Order Confirmed"
   }
   ```

3. **查询Permission权限表**：
   ```json
   {
     "query_type": "onchain_table_item_permission_perm",
     "parent": "myshop_permission_v2",
     "address": "myshop_merchant"
   }
   ```

### 查询驱动的构建流程
在复杂系统构建中，建议采用"查询-确认-下一步"的循环模式：
```
1. 创建对象A → 2. 查询对象A确认成功 → 3. 创建依赖A的对象B → 4. 查询对象B确认成功 → ...
```
这种模式虽然增加了查询次数，但能有效避免因对象未就绪导致的后续操作失败。
