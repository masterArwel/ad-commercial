---
inclusion: manual
---

# 配置预检（preflight）

> 本模块承载所有开发环境与工具配置的自动检测职责，与 `workflow.md` 解耦，支持独立插拔。

---

## AI 行为规范

- **强制**：检测到配置缺失时，必须**主动执行安装/修复命令**，禁止仅输出指导让用户自行操作
- **强制**：每次启动均完整执行所有检测项，漏检任一项视为检测未完成
- **强制**：安装完成后必须执行验证命令确认成功
- **强制**：禁止使用 Homebrew 安装 Node.js（与 NVM 冲突）
- **强制**：MCP 检测失败时，记录失败项并继续，不阻塞整体流程，在汇总报告中说明降级方案

---

## 检测项一览

| # | 检测项 | 类型 | 失败策略 |
|---|--------|------|---------|
| 1 | Node.js >= 18.0 | 必检 | AI 自动安装 |
| 2 | MCP 服务启动状态 | 必检 | 记录失败项，降级为人工输入 |
| 3 | Arch规则完整性 | 必检 | AI 自动生成 |

---

## 检测一：Node.js

```bash
node -v
npm -v
```

- 命令不存在 → 执行【安装 Node.js】流程
- Node 版本 < 18.0 → 执行【安装 Node.js】升级
- npm 不可用 → 重新安装 Node
- node >= 18.0 且 npm 可用 → **通过** ✓

---

## 检测二：MCP 服务启动状态（AI 自动执行）

**执行方式**：仅检测各 MCP 服务器是否已成功启动，不验证具体工具的连通性。

**MCP 服务清单**：

| MCP 名称 | 用途 | 失败降级 |
|----------|------|---------|
| `user-doc-mcp-server` | 获取产品需求文档 | 需求信息改为人工输入 |
| `user-yapi-mcp-server` | 获取接口文档 | 接口信息改为人工输入 |
| `user-figma-developer-mcp` | 获取 UI 设计 | UI 信息改为人工输入 |
| `user-target-mcp-server` | 获取埋点需求 | 埋点信息改为人工输入 |
| `user-sunflower-mcp-server` | 项目部署打包（可选） | 跳过自动部署，改为手动 |

**检测步骤**：

1. 对每个 MCP 服务器，调用其任意一个工具（参数可最小化或占位）
2. 能收到响应（含业务错误、参数错误等）→ 标记为 **已启动 ✓**
3. 调用超时、连接失败、无响应 → 标记为 **未启动 ✗**，记录降级方案

**处理原则**：
- 检测失败不阻塞整体流程
- 在汇总报告中明确列出哪些 MCP 未启动及其降级方案
- 进入对应阶段时，主动告知开发者该资源需人工提供

---

## 检测三：Arch 规则完整性（AI 自动执行）

**执行方式**：AI 检查 `.kiro/steering/arch/` 目录是否存在且包含 4 个架构规范文档。

```bash
ls .kiro/steering/arch/
```

**判断逻辑**：

- 目录不存在 → 执行【生成 arch】流程
- 目录存在但文件不足 4 个 → 执行【生成 arch】补全缺失文件
- 4 个文件均存在 → **通过** ✓

**生成 arch**：

按照 `architect.md` 的定义执行生成流程，文件名称和职责以 `architect.md` 为唯一准。

生成完成后重新执行验证命令确认 4 个文件均存在。

---

## 检测汇总报告

所有检测完成后，向开发者输出汇总报告，格式如下：

```
配置检测结果：
✅ Node.js v18.20.8 — 通过
✅ MCP user-doc-mcp-server — 已启动
✅ MCP user-yapi-mcp-server — 已启动
✅ MCP user-figma-developer-mcp — 已启动
✅ MCP user-target-mcp-server — 已启动
✅ MCP user-sunflower-mcp-server — 已启动（可选）
✅ Rules arch — 4 个文件均存在

降级说明：（如有未启动项，在此列出降级方案）
```

若存在未启动的 MCP，使用 `AskQuestion` 模式 E 让开发者确认降级方案：

```
AskQuestion:
  问题: "以下 MCP 服务器未启动，请确认处理方式：\n[列出未启动项及其降级方案]"
  选项:
    confirm → ✅ 确认以降级方案继续
    fix     → 🔧 我来手动修复，修复后重新检测
```

若所有检测均通过，直接进入下一步，无需用户确认。

---

## 安装流程

### 安装 Node.js（通过 NVM）

**步骤一：检测/安装 NVM**

```bash
source ~/.nvm/nvm.sh && nvm --version
```

- NVM 已安装 → 跳转步骤二
- NVM 未安装 → 执行安装：

```bash
export NVM_SOURCE=https://gitee.com/mirrors/nvm.git
curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
source ~/.nvm/nvm.sh
```

> curl 失败时改用 wget：`wget -qO- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash`

如果 `nvm` 命令仍不可用，将环境变量写入 shell 配置文件：

```bash
SHELL_RC="$HOME/.zshrc"
[[ "$SHELL" == */bash ]] && SHELL_RC="$HOME/.bashrc"

grep -q "NVM_DIR" "$SHELL_RC" 2>/dev/null
if [ $? -ne 0 ]; then
  cat >> "$SHELL_RC" << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
  source "$SHELL_RC"
fi
```

**步骤二：通过 NVM 安装 Node.js**

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm install 18.20.8
nvm use 18.20.8
nvm alias default 18.20.8
```

**步骤三：验证安装**

```bash
node --version  # 预期: v18.20.8
npm --version   # 预期: >= 10
```

验证通过后清理缓存：

```bash
rm -rf ~/.npm/_npx
```

**步骤四：处理版本冲突（仅存在 Homebrew Node 时执行）**

```bash
brew uninstall node 2>/dev/null || true
brew uninstall --ignore-dependencies node 2>/dev/null || true
nvm install 18.20.8
nvm alias default 18.20.8
nvm use 18.20.8
```

**步骤五：配置 npm 镜像（可选）**

```bash
npm config set registry https://registry.npmmirror.com
```

**重要**：Node.js 安装完成后需提示用户重启 IDE 以使 MCP Servers 生效。