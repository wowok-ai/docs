# Schema: onchain_events

> 📅 链上WOWOK事件查询工具。支持6种事件类型，带分页和排序。

---

## 顶层结构

```
OnchainEventsInput
├── type: EventType — 事件类型（必填）
├── cursor?: EventCursor \| null — 分页游标（首次传null）
├── limit?: number \| null — 每页数量限制
├── order?: "ascending" \| "descending" \| null — 排序方向
├── no_cache?: boolean — 是否绕过缓存
└── network?: "localnet" \| "testnet" — 网络（默认使用配置网络）
```

---

## EventType枚举

| 值 | 说明 |
|----|------|
| "ArbEvent" | 仲裁事件 |
| "NewOrderEvent" | 新订单事件 |
| "ProgressEvent" | 进度/工作流事件 |
| "DemandPresentEvent" | 需求推荐事件 |
| "DemandFeedbackEvent" | 需求反馈事件 |
| "NewEntityEvent" | 新用户注册事件 |

---

## EventCursor

```
{ eventSeq: string, txDigest: string }
```

---

## 输出结构

```
OnchainEventsResult
└── result: EventAnswer \| null
    ├── data: EventUnion[]
    ├── hasNextPage: boolean
    ├── nextCursor?: EventCursor \| null
    └── cache_expire?: number \| "INFINITE"
```

---

## 各事件类型数据结构

### EventBase（所有事件的基类）
```
{ id: EventCursor, sender: string, type: string, type_raw: string, time: string }
```

### ArbEvent（仲裁事件）
```
EventBase + { arb: string, arbitration: string, order: string, status: ArbStatus }
```

### NewOrderEvent（新订单事件）
```
EventBase + { order: string, service: string, progress?: string, discount?: string, allocation?: string, amount: BalanceType }
```

### ProgressEvent（进度事件）
```
EventBase + { progress: string, machine: string, task?: string, node: string, forward?: string, hold?: boolean }
```

### DemandPresentEvent（需求推荐事件）
```
EventBase + { demand: string, service?: string, recommend: string }
```

### DemandFeedbackEvent（需求反馈事件）
```
EventBase + { demand: string, service?: string, feedback: string, acceptance_score?: number }
```

### NewEntityEvent（新用户注册事件）
```
EventBase + { address: string, resource: string, referrer?: string }
```

---

## AI调用规划要点

1. **首次查询**：cursor必须传null，获取第一页数据。
2. **分页循环**：当hasNextPage为true时，使用返回的nextCursor作为下一次查询的cursor。
3. **排序选择**：
   - "descending"（默认）：最新事件优先，适合实时监控。
   - "ascending"：最旧事件优先，适合历史同步。
4. **事件过滤**：该工具按类型整体查询，如需更细过滤（如只关注某service的订单），在获取结果后客户端过滤。
5. **与query_toolkit的区别**：onchain_events返回的是事件流（时间线），query_toolkit返回的是对象当前状态（快照）。
