# Schema: wowok_buildin_info

> ℹ️ 查询WoWok协议内置信息：常量、权限定义、Guard指令集、网络信息、值类型。

---

## 顶层结构

```
ProtocolInfoQuery
└── query: InfoType — 查询类型（必填）
```

---

## InfoType枚举

| 值 | 说明 | 典型用途 |
|----|------|----------|
| "constants" | 协议常量（如MAX_DESCRIPTION_LENGTH等） | 了解系统限制 |
| "built-in permissions" | 内置权限索引列表 | **创建Permission对象前必须查询** |
| "guard instructions" | Guard所有可用操作符和查询指令 | **创建Guard对象前必须查询** |
| "current network" | 当前连接的网络信息 | 确认操作环境 |
| "value types" | 支持的值类型列表 | 了解数据类型映射 |

---

## 输出结构

```
ProtocolInfoResultWrapped
└── result: ProtocolInfoResult
```

各query类型返回不同结构：

### constants
```
{ constants: ConstantItem[] }
ConstantItem: { name, value: string|number, description }
```

### built-in permissions
```
{ permissions: PermissionInfoType[] }
PermissionInfoType: { index, name, description, object_type }
```

### guard instructions
```
{ guard_instructions: GuardItem[] }
GuardItem: { name, id, description, returnType?, objectType?, parameters?, return?, parameters_description? }
```

### current network
```
{ network: string, entrypoint: string }
```

### value types
```
{ value_types: Array<{type: string, value: number, description: string}> }
```

---

## AI调用规划要点

1. **创建Permission前的强制步骤**：
   ```
   wowok_buildin_info(query: "built-in permissions") → 了解可用权限索引 → 设计Permission结构 → onchain_operations(permission)
   ```

2. **创建Guard前的强制步骤**：
   ```
   wowok_buildin_info(query: "guard instructions") → 了解所有操作符和查询指令 → 设计Guard节点树 → onchain_operations(guard)
   ```

3. **GuardItem字段说明**：
   - 对于**指令(instruction)**：关注id（OperatorType/ContextType）、returnType。
   - 对于**查询(query)**：关注objectType、parameters、return、parameters_description。
   - id字段可能是number（指令）或QueryId（查询）。

4. **权限索引范围**：
   - 内置权限：系统预定义值。
   - 用户自定义权限：索引范围1000-65535。

## 从示例中提取的实践经验

### Guard指令使用模式（常见组合）
从电商等复杂业务示例中，Guard常用的查询和指令组合：

1. **验证Merkle Root格式**：
   - 使用字符串长度验证指令，确保提交值为64位十六进制。
   - 常用于Messenger通信后的链上证明提交。

2. **验证Service-Order关联**：
   - 查询Order所属Service的地址/名称。
   - 验证当前Progress节点名称是否在预期集合中。
   - 组合：and逻辑 + 多个查询条件。

3. **时间验证Guard**：
   - 查询Progress从指定节点进入的时间戳。
   - 使用数值比较指令验证是否超过阈值（如864000000ms=10天）。
   - 参数：Progress地址作为identifier 0提交。

4. **节点集合验证**：
   - 验证当前节点是否属于指定集合（如["Order Complete", "Wonderful", "Return Fail"]）。
   - 使用or逻辑 + 多个等于比较。

### Permission索引规划建议
在复杂系统中，建议按以下方式规划Permission索引：
- **1000-1009**：核心角色操作（商家、客户）。
- **1010-1019**：辅助角色操作（仲裁员、代理）。
- **1020-65535**：业务特定操作（按功能模块划分）。

每个索引在Permission中通过remark记录用途，便于长期维护。
