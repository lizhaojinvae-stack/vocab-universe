# 红宝书词汇星空

红宝书词汇星空是一个本地优先的考研英语背单词系统。它把单词组织成可交互的星空：单元或主题是星系，单词是星球、星云或恒星；同时提供每日学习、复习队列、拼写检查、词义辨析和读音辨词等卡片模式。

## ✨ 功能概览

- 星空词库浏览：按 `Unit` 或固定主题聚类，点击星系聚焦，点击单词打开词卡。
- 红宝书词汇导入：支持 CSV 增量导入，按单词唯一键新增或更新。
- SQLite 本地后端：用轻量级数据库保存词库、已学状态和复习进度。
- 学习模式 2.0：支持每日新词目标、复习上限和基于记忆曲线的复习调度。
- 独立题型模式：翻卡、词辨意、意辨词、拼写检查、读音辨词可以单独选择。
- 完整释义：保留简短释义 `meaning`，同时使用 `meaning_full` 覆盖多词性和常用义项。
- 美式单词发音：优先使用 Google/Oxford 默认发音并缓存到本地。
- 例句 TTS：支持 Qwen3-TTS 和 OpenAI TTS，首次生成后缓存到本地，后续不重复调用接口。
- TTS 调参页：保留 `tts-lab.html`，方便试听不同模型、音色和风格指令。
- 文件同步：数据库会同步到 `all-words.csv` 和 `all-words-data.js`，便于备份和静态回退。

## 🧭 项目结构

```text
.
├── app.js                         # 前端交互、星空绘制、学习卡片
├── index.html                     # 主页面
├── styles.css                     # 页面样式和星空视觉
├── server.cjs                     # 本地 HTTP 服务、SQLite 接口、TTS/音频接口
├── all-words.csv                  # 同步出来的总词库 CSV
├── all-words-data.js              # 静态回退词库数据
├── redbook-vocab-template.csv     # CSV 导入模板
├── tts-lab.html                   # Qwen/OpenAI TTS 试听调参页
├── download-audio.cjs             # 批量下载单词发音脚本
├── enrich-meanings.cjs            # 使用 Qwen 补全 meaning_full 的脚本
├── retag-themes.cjs               # 重新生成固定主题分类的脚本
└── start-vocab-universe.bat       # Windows 启动脚本
```

运行时目录不会提交到 Git：

```text
data/                              # SQLite 数据库
audio/default/                     # Google/Oxford 单词音频缓存
audio/us/                          # 旧版或备用美音缓存
audio/tts/                         # 单词 TTS 缓存
audio/sentences/                   # 例句 TTS 缓存
audio/preview/                     # TTS 调参页试听缓存
```

## 🛠️ 运行环境

- Windows、macOS 或 Linux
- 推荐 Node.js 22 及以上
- 当前版本不需要执行 `npm install`

项目使用了 Node 内置能力，包括 `node:sqlite`，所以建议使用较新的 Node 版本。开发时使用的是 Node 24。

## 🚀 快速启动

进入项目目录：

```powershell
cd D:\vocab-universe
```

启动本地服务：

```powershell
node server.cjs
```

然后打开：

```text
http://localhost:5173/
```

Windows 下也可以直接运行：

```powershell
.\start-vocab-universe.bat
```

## 🔊 TTS 配置

例句音频默认使用 Qwen3-TTS。启动服务前需要设置环境变量：

```powershell
$env:DASHSCOPE_API_KEY="你的 DashScope API Key"
node server.cjs
```

当前推荐的 Qwen 例句配置：

```powershell
$env:QWEN_TTS_MODEL="qwen3-tts-instruct-flash"
$env:QWEN_TTS_VOICE="Maia"
$env:DASHSCOPE_BASE_URL="https://dashscope.aliyuncs.com"
```

当前例句 TTS 的风格指令大致是：

```text
使用标准加拿大英语朗读，发音准确自然。
保持专业但温暖的语气，节奏自然，不要机械或夸张。
逗号后稍作停顿，并对关键词给出轻微重音。
```

如果想继续测试不同音色，可以打开：

```text
http://localhost:5173/tts-lab.html
```

OpenAI TTS 也保留了入口。如果需要使用，需要设置：

```powershell
$env:OPENAI_API_KEY="你的 OpenAI API Key"
$env:OPENAI_TTS_MODEL="gpt-4o-mini-tts"
$env:OPENAI_TTS_VOICE="alloy"
```

## 🎧 单词发音策略

单词发音默认不使用 Qwen TTS。当前顺序是：

1. 优先读取 `audio/default/` 中已经缓存的默认发音。
2. 如果没有缓存，尝试获取 Google/Oxford 词典发音。
3. 如果仍然没有，读取 `audio/us/` 中的备用发音。
4. 最后再退回浏览器或系统自带发音。

只要 Google/Oxford 发音获取成功，就会缓存到本地，后续播放会更快，也能减少重复请求。

## 📥 CSV 导入

导入使用 CSV，并且按单词唯一键做增量合并。重复导入同一个单词时，会更新这个单词，不会重复追加。

推荐字段：

```csv
word,phonetic,meaning,meaning_full,unit,theme,root,parts,memory,related,example_en,example_zh,pronunciation_text
```

字段说明：

- `word`：必填，单词本身，归一化后作为唯一键。
- `phonetic`：音标，优先填写美式音标。
- `meaning`：简短释义，用于列表等紧凑展示。
- `meaning_full`：完整释义，用于学习卡片和复习题型，建议覆盖常见词性和高频义项。
- `unit`：单元，例如 `Unit 01 必考词`。
- `theme`：主题分类，可以先自定义，之后再用脚本统一重分类。
- `root`：词根或左侧列表中展示的短标签。
- `parts`：词源拆解，用 `|` 分隔，例如 `radi 光线|-ate 动词后缀`。
- `memory`：记忆故事或助记说明。
- `related`：关联词，用 `|` 分隔。
- `example_en`：英文例句。
- `example_zh`：例句中文翻译。
- `pronunciation_text`：可选，用于特殊词形的发音查找。

## 🗃️ 数据流

这个项目是本地优先的：

1. 服务端读取 `data/vocab.sqlite`。
2. 如果存在 `all-words.csv`，启动或访问接口时会尝试合并进 SQLite。
3. 运行时以 SQLite 作为主要数据源。
4. 导入或同步后，会重新写出：
   - `all-words.csv`
   - `all-words-data.js`

这样既能使用数据库带来的稳定性，也保留了 CSV 的可迁移和可备份能力。

## 🧠 学习模式

学习面板目前支持五种独立题型：

- `翻卡`：看到单词后先回忆释义，再显示答案并自评。
- `词辨意`：根据单词选择正确释义。
- `意辨词`：根据释义选择正确单词。
- `拼写检查`：根据释义输入英文单词。
- `读音辨词`：听发音并选择对应单词。

一次只启用一种题型。这样复习时不会把几种任务混在一起，学习目标会更清晰。

## 🔁 复习调度

后端通过 `word_progress` 和 `review_logs` 保存学习状态。

当前调度逻辑是一个轻量级的 SM-2/FSRS 风格算法：

- 新词按照每日新词目标进入学习队列。
- 到期复习词优先于新词。
- 每次答题会更新难度、稳定度、连续正确次数、复习次数和下次复习时间。
- 答得越稳，下次复习间隔越长。
- 答错或模糊的单词会更快回到复习队列。

这个实现的目标是保持实用和轻量，不引入复杂依赖。

## 🧩 维护脚本

补全缺失的完整释义：

```powershell
$env:DASHSCOPE_API_KEY="你的 DashScope API Key"
node enrich-meanings.cjs
```

重新整理固定主题：

```powershell
node retag-themes.cjs
```

批量下载单词发音：

```powershell
node download-audio.cjs
```

## 🧹 缓存与重置

页面中提供了清除缓存按钮。它用于清理生成文件和前端缓存，数据库逻辑单独处理。

如果需要手动清理，可以删除这些内容：

```text
data/
audio/default/
audio/us/
audio/tts/
audio/sentences/
audio/preview/
all-words.csv
all-words-data.js
```

注意：如果删除 SQLite 但保留 `all-words.csv`，服务端可以从 CSV 重新构建数据库。

## 🔐 Git 与安全

仓库会提交源码、导入模板和同步词库文件，但不会提交：

- SQLite 运行时数据库
- 生成的音频缓存
- `.env` 或本地 API Key
- 编辑器和系统临时文件

请不要把 API Key、私人令牌或 `.env` 文件提交到仓库。

## ❓ 常见问题

如果浏览器在 `file://` 页面下报 CORS 错误，请启动本地服务并打开：

```text
http://localhost:5173/
```

现代浏览器会限制本地文件直接 `fetch()`，所以正式使用时建议始终通过本地服务访问。

如果 TTS 失败，请确认 `DASHSCOPE_API_KEY` 或 `OPENAI_API_KEY` 是在启动 `server.cjs` 的同一个终端会话里设置的。

如果导入后中文乱码，请把 CSV 保存为 UTF-8 或 UTF-8 with BOM。服务端也会尝试兼容 GB18030 编码的旧表格导出。

如果重复导入后数据异常，请检查 `word` 列是否稳定。增量合并是按归一化后的 `word` 作为唯一键。
