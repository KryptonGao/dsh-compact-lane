<h1 align="center">DSH Compact Lane</h1>

<p align="center">
  为 DeepSeek Harness 带来紧凑的对话视图。<br>
  专注回答，需要时再展开背后的思考与工具过程。
</p>

<p align="center">
  <a href="https://github.com/KryptonGao/dsh-compact-lane/blob/main/README.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#接入已有-dsh-环境">接入 DSH</a> ·
  <a href="#开发">开发</a> ·
  <a href="#兼容性与限制">兼容性</a>
</p>

<p align="center">
  <sub>DSH 0.2.1-rc.2 · React 18 · Cordis 4 · Apache-2.0</sub>
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/KryptonGao/dsh-compact-lane/main/artifacts/compact-lane.png"><img src="https://raw.githubusercontent.com/KryptonGao/dsh-compact-lane/main/artifacts/compact-lane.png" width="100%" alt="运行在 DeepSeek Harness 中的紧凑对话视图：收起的过程行、最终回答、文件变更统计，以及原版 DSH 输入框。"></a>
</p>

<p align="center">
  <sub>真实 DSH 宿主中的本地回放画面，点击查看原图。</sub>
</p>

DSH Compact Lane 是一个独立的 [Cordis 插件](https://github.com/deepseek-ai/deepseek-harness)，将 Vela 的紧凑对话布局接入 DeepSeek Harness。启用后直接接管现有的「**对话**」视图，停用后恢复宿主界面。截图中的对话和测试结果来自回放示例数据。

## 带来哪些变化

- **让回答更突出。** 思考与工具活动收进过程行，工具调用按助理消息分组；需要时展开查看命令、结果、清单和子代理条目。
- **折叠或不折叠。** 在「设置 → 紧凑对话」中切换工具调用的展示方式：「折叠」（默认）时过程行和工具组默认收起，「不折叠」时默认展开，仍可手动收起。修改会立即作用于已打开的对话。
- **文件变化有据可查。** diff 卡片与文件统计只采用成功工具结果中的真实记录。同一文件的多个片段合并呈现，缺少行号时保持留空。
- **流式输出跟随阅读节奏。** 位于底部时自动跟随新内容，向上滚动后暂停跟随；支持回到最新、加载早期回合并保留阅读位置。
- **保留熟悉的宿主操作。** 继续使用 DSH 原版输入框、Markdown 渲染、代码块控件、文件预览、回复复制和对话分支。

## 快速开始

需要 **Node.js `^22.19.0` 或 `>=24.0.0`**、**pnpm**，以及已安装的 **DeepSeek Harness `0.2.1-rc.2`**，并确保 `dsh` 在 `PATH` 中可用。React 18 与 Cordis 4 由宿主提供。宿主安装方式见 [DSH 快速开始](https://github.com/deepseek-ai/deepseek-harness#quick-start)；本插件通过本地构建加载，尚未发布到 npm。

```sh
git clone https://github.com/KryptonGao/dsh-compact-lane.git
cd dsh-compact-lane
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` 会构建插件，并使用仓库内隔离的 **`.dev-home/`** 在 **3081 端口**启动 DSH。打开终端打印的本地认证地址，进入会话的「**对话**」视图即可。正常对话使用该开发环境自己的模型配置。

若只想查看固定示例，改为运行 `pnpm preview`，在会话中选择「**紧凑预览**」。无需模型 API 密钥的真实流式管线见[无密钥回放](#无密钥回放)。

## 接入已有 DSH 环境

先构建，再通过 overlay 启动 DSH。以下命令均在插件仓库根目录执行：

```sh
pnpm build
dsh web --patch "$PWD/dev/overlay.yml" --no-open
```

此方式读取当前 DSH 环境的配置和会话。overlay 通过相对于 `dev/overlay.yml` 的 `../lib/index.js` 加载插件，因此需保留仓库与构建产物。现有「**对话**」视图会直接变为紧凑布局，不增加额外的紧凑视图标签。

「紧凑对话」设置页会把选择保存到 DSH 配置档，而宿主只允许写入已安装到配置档中的插件（`dsh plugin --profile web add <本仓库路径>`）。通过 `--patch` 加载的插件固定使用默认的「折叠」，设置页会提示无法保存。

<details>
<summary>停用插件，恢复宿主界面</summary>

先停止当前服务，再把停用配置放在最后重新启动：

```sh
dsh web --patch "$PWD/dev/overlay.yml" --patch "$PWD/dev/disabled.yml" --no-open
```

若使用隔离的开发环境，执行：

```sh
DSH_HOME="$PWD/.dev-home" dsh web --patch ./dev/overlay.yml --patch ./dev/disabled.yml --no-open --port 3081
```

去掉停用配置并重启，即可恢复紧凑视图。通过 overlay 加载的插件目前不会作为开关出现在宿主插件管理页中。

</details>

## 开发

三个启动入口均使用 3081 端口，切换前请停止上一个服务。开发环境没有热更新，修改源码后需重新构建并刷新浏览器。

- **`pnpm dev`**：在隔离的 DSH 环境中加载正式插件，使用真实宿主会话。
- **`pnpm preview`**：在「**紧凑预览**」中展示固定组件示例，覆盖思考、工具组、diff、终端、清单、子代理及失败状态。
- **`pnpm replay`**：使用官方 DSH 回放供应商驱动正式视图，无需模型 API 密钥。

### 无密钥回放

首次创建录制会话，再启动回放环境：

```sh
pnpm seed
pnpm replay
```

打开「**紧凑界面测试录制**」，发送任意测试消息。第一轮会流式输出思考，通过宿主工具管线执行 `printf`，再输出长回复；第二轮保持运行，供停止、刷新重连和滚动检查。回放配置会关闭实际模型供应商与标题模型，不调用模型 API。

`pnpm seed -- --long` 可另建 100 回合分页会话。种子 ID 固定，重复运行会报告会话已存在，不会替换历史。种子脚本还会写入 `dev/workspace/src/` 下的三个演示文件，请勿在这些文件中存放个人代码。

### 验证

根据实际改动选择检查：

```sh
pnpm typecheck
pnpm test -- tests/adapter.test.ts
pnpm build
```

将测试路径替换为受影响的适配、集成、生命周期或滚动测试。`pnpm test` 可运行本插件的全部测试。已记录的浏览器检查与未验证场景见 [VALIDATION.md](https://github.com/KryptonGao/dsh-compact-lane/blob/main/VALIDATION.md)。

<details>
<summary>架构与样式维护</summary>

数据路径为**宿主 Chat 节点 → 按回合适配的快照 → React 对话视图**。插件订阅宿主状态，不更改宿主事件或持久化格式。

```text
src/
├── client.tsx       宿主 hooks、视图注册、交互与样式
├── integration.ts  对话插槽覆盖及 rc.2 标签兼容
├── adapter/        宿主快照、工具映射、分组与 diff
├── ui/             回合、工具、保留挂载的折叠与滚动
└── styles/         作用域化 Vela 样式与宿主适配
dev/                预览、回放、种子工作区与 overlay 配置
tests/              适配、集成、生命周期与滚动测试
```

工具结果通过 `callId` 归属到助理消息。文件统计仅取成功结果的 `meta.diffs`；空 diff 不从调用参数补造，失败结果不计入已应用变化。子代理 ID 经宿主父会话目录确认后才提供导航，启动成功不会被当成执行完成。

Vela 样式已纳入仓库，作用域限定为 `[data-dsh-compact-lane]`，正常构建无需外部参考目录。重新提取样式时，显式传入 Vela HTML 参考文件：

```sh
node scripts/extract-styles.mjs /path/to/compact-chat-ui.html
pnpm build
```

参考文件需包含 `vela-extracted` 与 `demo-chrome` 样式块。提取脚本读取参考文件并重写 `src/styles/vela-compact.css`，不修改参考文件。原始提取保留了 1,654 条 CSS 声明的顺序和值，点阵规则另行提取并限定作用域。

</details>

## 兼容性与限制

- **宿主版本**：基于 DSH `0.2.1-rc.2` 开发和检查，其他版本尚未验证；对话标签兼容规则针对 rc.2。
- **浏览器**：依赖 `:has()`、`color-mix()`、容器查询与 `inert`，没有降级实现。已检查桌面窄内容栏，完整手机视口、触屏与其他浏览器尚未验证。
- **界面**：当前使用 Vela 浅色主题与中文界面文案。深色或多主题、卡片模式、折叠位置设置、步数、单工具耗时及折叠记忆尚未实现。回合耗时仅在存在真实时间戳时显示。
- **集成覆盖**：本地回放已检查流式、停止、刷新重连与滚动；真实模型网络、附件发送、真实子代理导航及整个插件的热卸载尚未完成端到端浏览器验证。详细范围见 [VALIDATION.md](https://github.com/KryptonGao/dsh-compact-lane/blob/main/VALIDATION.md)。

## 许可证

[Apache License 2.0](https://github.com/KryptonGao/dsh-compact-lane/blob/main/LICENSE)。
