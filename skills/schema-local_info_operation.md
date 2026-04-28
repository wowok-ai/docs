# Schema: local_info_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN。管理敏感个人信息（如收货地址、电话号码），仅存储在本地设备。

---

## 顶层结构

```
LocalInfoOperation
├── add?: { op: "add", data: InfoData[] }
├── remove?: { op: "remove", data: string[] }
├── reset?: { op: "reset", name: string, contents: string[] }
└── clear?: { op: "clear" }
```

**约束**：必须且只能指定一个操作（add/remove/reset/clear）。

---

## InfoData（信息条目结构）

```
InfoData
├── name: string(max 64 bcs字符) — 唯一标识
├── default: string(max 300 bcs字符) — 主值
├── contents?: string[] (max 50项, 每项max 300字符) — 附加内容
├── createdAt?: number (Unix ms)
└── updatedAt?: number (Unix ms)
```

**约束**：
- name: 唯一标识，最多64个bcs字符。
- default: 必填，最多300个bcs字符。
- contents: 可选，最多50项，每项最多300个bcs字符。

---

## 操作详解

### add — 添加信息条目
- **输入**：data为InfoData数组，至少1项。
- **行为**：添加新的本地信息条目。
- **返回**：{ success: boolean }

### remove — 按名称移除
- **输入**：data为name字符串数组，至少1项。
- **返回**：{ success: boolean }

### reset — 重置已有条目的内容
- **输入**：name为要修改的条目名；contents为新的内容列表。
- **注意**：此操作替换contents，不影响default字段。如需修改default，建议remove后重新add。
- **返回**：{ success: boolean }

### clear — 清空所有信息
- **输入**：无额外参数。
- **返回**：{ success: boolean }

---

## 输出结构

```
LocalInfoOperationOutputWrapped
└── result: LocalInfoOperationOutput (discriminatedUnion by status)
    ├── status: "success" → data: LocalInfoOperationResult
    │   └── success: boolean
    └── status: "error" → error: string
```

---

## AI调用规划要点

1. **用户要求保存隐私信息**（地址、电话等）→ 使用local_info_operation (add)。
2. **与local_mark的区别**：mark是给地址起别名；info是存储任意结构化隐私文本。
3. **default vs contents**：default是主值（如常用地址），contents是附加值列表（如备用地址）。
4. **修改策略**：reset只能改contents；改default需remove+add或告知用户限制。
