# Schema: local_mark_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN。管理ID名称和标签，仅存储在本地设备，永不发布到区块链。

---

## 顶层结构

```
LocalMarkOperation
├── add?: { op: "add", data: MarkParam[] }
├── remove?: { op: "remove", names: string[] }
└── clear?: { op: "clear" }
```

**约束**：必须且只能指定一个操作（add/remove/clear）。

---

## MarkParam（添加/更新标记）

```
MarkParam
├── name?: { value: string(max 64), replaceExistName?: boolean }
├── address: string(0x+64hex 或 builtin ID)
└── tags?: string[] (max 50项, 每项max 64字符)
```

**约束**：
- name.value: 最多64个bcs字符。
- tags: 最多50个标签，每个最多64个bcs字符。
- replaceExistName: 为true时，若名称已存在则覆盖；false时抛出错误（默认false）。

---

## MarkData（返回数据结构）

```
MarkData
├── name?: string(max 64)
├── address: string
├── tags?: string[]
├── createdAt?: number (Unix ms)
└── updatedAt?: number (Unix ms)
```

---

## 操作详解

### add — 添加/更新标记
- **输入**：data为MarkParam数组，至少1项。
- **行为**：为指定地址添加名称和标签；若名称已存在且replaceExistName=false则报错。
- **返回**：{ add: MarkData[] }

### remove — 按名称或地址移除
- **输入**：names为string数组，每项可以是mark名称或地址。
- **返回**：{ remove: MarkData[] }

### clear — 清空所有标记
- **输入**：无额外参数。
- **返回**：{ clear: boolean }

---

## 输出结构

```
LocalMarkOperationOutputWrapped
└── result: LocalMarkOperationOutput (discriminatedUnion by status)
    ├── status: "success" → data: LocalMarkOperationResult
    │   ├── clear?: boolean
    │   ├── add?: MarkData[]
    │   └── remove?: MarkData[]
    └── status: "error" → error: string
```

---

## AI调用规划要点

1. **用户提到"给地址起个名字"或"标记这个对象"** → 使用local_mark_operation (add)。
2. **名称冲突处理**：若用户未明确，默认replaceExistName=false，遇到重名需询问是否覆盖。
3. **与on-chain personal的区别**：local_mark是纯本地私有数据；personal是链上公开数据。提醒用户区分。
4. **批量操作**：支持一次add多个mark，适合初始化地址簿场景。
