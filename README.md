# Vocab Universe

红宝书考研词汇星空是一个本地优先的考研英语背单词系统。它把单词组织成可交互的星空：单元或主题是星系，单词是星球、星云或恒星；同时提供每日学习、复习队列、拼写检查、词义辨析和读音辨词等卡片模式。

## Features

- 星空词库浏览：按 `Unit` 或固定主题聚类，点击星系聚焦，点击单词打开词卡。
- 红宝书词汇导入：支持 CSV 增量导入，按单词唯一键新增或更新。
- SQLite 后端：轻量级本地数据库保存词库、已学状态和复习进度。
- 学习模式 2.0：支持每日新词目标、复习上限和基于记忆曲线的复习调度。
- 独立题型模式：翻卡、词辨意、意辨词、拼写检查、读音辨词可以单独选择。
- 完整释义：保留简短释义 `meaning`，同时使用 `meaning_full` 覆盖多词性和常用义项。
- 美式单词发音：优先使用 Google/Oxford 默认发音并缓存到本地。
- 例句 TTS：支持 Qwen3-TTS 和 OpenAI TTS，首次生成后缓存到本地，后续不重复调用接口。
- TTS 调参页：保留 `tts-lab.html`，方便试听不同模型、音色和风格指令。
- 文件同步：数据库会同步到 `all-words.csv` 和 `all-words-data.js`，便于备份和静态回退。

## Project Layout

```text
.
├── app.js                         # Frontend interaction, star map, study cards
├── index.html                     # Main app
├── styles.css                     # UI and star-map styling
├── server.cjs                     # Local HTTP server, SQLite APIs, TTS/audio APIs
├── all-words.csv                  # Synced word-bank CSV
├── all-words-data.js              # Static fallback word data
├── redbook-vocab-template.csv     # CSV import template
├── tts-lab.html                   # Qwen/OpenAI TTS test page
├── download-audio.cjs             # Batch word-audio downloader
├── enrich-meanings.cjs            # Fill meaning_full with Qwen
├── retag-themes.cjs               # Rebuild fixed theme categories
└── start-vocab-universe.bat       # Windows start helper
```

Runtime folders are ignored by Git:

```text
data/                              # SQLite database
audio/default/                     # Google/Oxford word audio cache
audio/us/                          # Legacy/fallback word audio cache
audio/tts/                         # Generated word TTS cache
audio/sentences/                   # Generated example sentence audio
audio/preview/                     # TTS lab preview audio
```

## Requirements

- Windows, macOS, or Linux
- Node.js 22+ recommended
- No npm install is required for the current implementation

The server uses Node built-ins, including `node:sqlite`, so use a modern Node version. The project was developed with Node 24.

## Quick Start

```powershell
cd D:\vocab-universe
node server.cjs
```

Open:

```text
http://localhost:5173/
```

On Windows, you can also run:

```powershell
.\start-vocab-universe.bat
```

## TTS Configuration

Example sentence audio defaults to Qwen3-TTS. Set your API key before starting the server:

```powershell
$env:DASHSCOPE_API_KEY="your_dashscope_api_key"
node server.cjs
```

Current recommended Qwen sentence settings:

```powershell
$env:QWEN_TTS_MODEL="qwen3-tts-instruct-flash"
$env:QWEN_TTS_VOICE="Maia"
$env:DASHSCOPE_BASE_URL="https://dashscope.aliyuncs.com"
```

The app sends an instruction similar to:

```text
Deliver the text in General Canadian English with perfect native pronunciation.
Maintain a professional yet warm tone with authentic Canadian rhythm and intonation.
Avoid any unnatural robotic shifts. Pause slightly after commas.
Put gentle stress on the key vocabulary word.
```

OpenAI TTS is still available if configured:

```powershell
$env:OPENAI_API_KEY="your_openai_api_key"
$env:OPENAI_TTS_MODEL="gpt-4o-mini-tts"
$env:OPENAI_TTS_VOICE="alloy"
```

Use the test page to compare voices and speed:

```text
http://localhost:5173/tts-lab.html
```

## Word Audio Strategy

Single-word pronunciation does not use Qwen by default. The app follows this order:

1. Local cached default audio in `audio/default/`
2. Google/Oxford dictionary audio
3. Local fallback audio in `audio/us/`
4. Browser/system speech synthesis as the last fallback

When Google/Oxford audio is found, it is cached locally, so later playback is fast and offline-friendly.

## CSV Import

Import uses CSV and merges incrementally by normalized word key. Re-importing the same word updates that word instead of duplicating it.

Recommended columns:

```csv
word,phonetic,meaning,meaning_full,unit,theme,root,parts,memory,related,example_en,example_zh,pronunciation_text
```

Column notes:

- `word`: required; used as the unique key after normalization.
- `phonetic`: American phonetic symbol preferred.
- `meaning`: short meaning for compact list usage.
- `meaning_full`: full common meanings with parts of speech; used by study cards.
- `unit`: such as `Unit 01 必考词`.
- `theme`: one of the fixed theme categories, or your custom category before retagging.
- `root`: word root shown in the left list.
- `parts`: split morphemes with `|`, for example `radi 光线|-ate 动词后缀`.
- `memory`: memory story or note.
- `related`: related words separated by `|`.
- `example_en`: English example sentence.
- `example_zh`: Chinese translation.
- `pronunciation_text`: optional lookup text for unusual word forms.

## Data Flow

The app is local-first:

1. Server reads SQLite from `data/vocab.sqlite`.
2. On startup, `all-words.csv` is merged into SQLite if present.
3. SQLite is the runtime source of truth.
4. After imports or server sync, data is written back to:
   - `all-words.csv`
   - `all-words-data.js`

This lets you keep a portable CSV backup while still using a fast local database.

## Study Modes

The learning panel supports separate modes:

- `翻卡`: see the word, recall the meaning, reveal answer, then self-rate.
- `词辨意`: choose the correct meaning for a word.
- `意辨词`: choose the correct word for a meaning.
- `拼写检查`: type the word from a meaning prompt.
- `读音辨词`: hear pronunciation and choose the word.

Only one question mode is active at a time. This keeps review sessions focused instead of mixing tasks unexpectedly.

## Review Scheduling

The backend stores review state in `word_progress` and `review_logs`.

The scheduler is a lightweight SM-2/FSRS-inspired system:

- New words enter the daily queue according to `daily_new`.
- Due review words are prioritized before new words.
- Ratings update difficulty, stability, streak, review count, and next due time.
- Higher ratings push the next review farther into the future.
- Failed answers return sooner.

The goal is practical local study behavior without adding a heavy dependency.

## Maintenance Scripts

Fill full meanings for words missing `meaning_full`:

```powershell
$env:DASHSCOPE_API_KEY="your_dashscope_api_key"
node enrich-meanings.cjs
```

Rebuild fixed theme categories:

```powershell
node retag-themes.cjs
```

Batch download word audio:

```powershell
node download-audio.cjs
```

## Reset And Cache Cleanup

The UI has a clear-cache button. It is designed to remove generated local files and cached frontend state while keeping the database logic separate.

Generated files and folders you may remove manually if needed:

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

If you delete SQLite but keep CSV files, the server can rebuild the database from `all-words.csv`.

## Git Notes

The repository intentionally tracks source code, templates, and the synced CSV/JS word bank. It ignores:

- SQLite runtime database
- Generated audio
- Local API keys
- Editor and OS files

Do not commit `.env` files or API keys.

## Troubleshooting

If the browser reports CORS errors for `file://` URLs, run the local server and open `http://localhost:5173/`. Modern browsers block `fetch()` from local files.

If TTS fails, check that `DASHSCOPE_API_KEY` or `OPENAI_API_KEY` is set in the same terminal session used to start `server.cjs`.

If imported Chinese text becomes garbled, save CSV as UTF-8 with BOM or UTF-8. The server also attempts GB18030 decoding for older spreadsheet exports.

If repeated imports create unexpected data, check that the `word` column is stable. Incremental merge is based on normalized `word`.
