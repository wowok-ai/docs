# Schema: guard2file

> 📄 将链上Guard对象的定义导出到本地JSON或Markdown文件，便于查看、编辑和创建新Guard。

---

## 顶层结构

```
Guard2File_Input
├── guard: string — Guard对象ID或名称（必填）
├── file_path: string — 输出文件路径（必填）
├── format?: "json" \| "markdown" — 输出格式（默认"json"）
└── env?: { no_cache?: boolean, network?: "localnet" \| "testnet", account?: string }
```

---

## 输出结构

```
Guard2File_OutputWrapped
└── result: Guard2File_Output (discriminatedUnion by status)
    ├── status: "success" → data: { file_path, format, guard_object }
    └── status: "error" → error: string
```

---

## AI调用规划要点

1. **用途定位**：该工具是**只读导出**，不修改链上状态。用于：
   - 查看已有Guard的完整定义结构。
   - 基于已有Guard做模板修改后创建新Guard。
2. **与query_toolkit的区别**：
   - query_toolkit查询Guard返回的是运行时对象状态（ObjectGuard）。
   - guard2file导出的是Guard的定义结构（节点树、table等），可直接用于创建新Guard。
3. **工作流程**：
   ```
   guard2file(已有GuardID) → 本地编辑文件 → onchain_operations(guard, root.type="file", root.file=编辑后的文件)
   ```
4. **format选择**：
   - json：机器友好，适合程序化编辑。
   - markdown：人类友好，适合手动编辑和阅读。
