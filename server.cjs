const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "vocab.sqlite");
const allWordsPath = path.join(root, "all-words.csv");
const dataJsPath = path.join(root, "all-words-data.js");
const sentenceAudioDir = path.join(root, "audio", "sentences");
const wordTtsDir = path.join(root, "audio", "tts");
const previewAudioDir = path.join(root, "audio", "preview");
const header = [
  "word",
  "phonetic",
  "meaning",
  "meaning_full",
  "unit",
  "theme",
  "root",
  "parts",
  "memory",
  "related",
  "example_en",
  "example_zh",
  "pronunciation_text",
];

const mimeTypes = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".csv": "text/csv;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".png": "image/png",
};

let db;
let lastCsvMtimeMs = 0;
const allowedQuestionModes = ["flip", "word_to_meaning", "meaning_to_word", "spelling", "audio_to_word"];
const defaultQuestionModes = ["flip"];

function normalizeWordKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeList(items) {
  return (Array.isArray(items) ? items : String(items || "").split(/[;|]/))
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function normalizeRow(row, index = 0) {
  const word = String(row.word || "").trim().replace(/^\uFEFF/, "");
  const key = normalizeWordKey(word);
  if (!key) return null;
  return {
    wordKey: key,
    word,
    phonetic: String(row.phonetic || "").trim(),
    meaning: String(row.meaning || "").trim(),
    meaningFull: String(row.meaning_full || row.meaningFull || row.full_meaning || row.fullMeaning || "").trim(),
    unit: String(row.unit || `Unit ${String(Math.floor(index / 20) + 1).padStart(2, "0")}`).trim(),
    theme: String(row.theme || "红宝书导入").trim(),
    root: String(row.root || key.slice(0, 5)).trim(),
    parts: normalizeList(row.parts),
    memory: String(row.memory || "导入后可在 CSV 的 memory 列补充个人记忆故事。").trim(),
    related: normalizeList(row.related).map(normalizeWordKey).filter(Boolean),
    exampleEn: String(row.example_en || row.exampleEn || "").trim(),
    exampleZh: String(row.example_zh || row.exampleZh || "").trim(),
    pronunciationText: String(row.pronunciation_text || row.pronunciationText || "").trim(),
  };
}

function decodeCsv(buffer) {
  const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(bytes);
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("gb18030").decode(bytes);
  }
}

function parseLine(line) {
  const cols = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cols.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cols.push(current);
  return cols;
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let quoted = false;
  const normalized = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < normalized.length; index++) {
    const char = normalized[index];
    const next = normalized[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '""';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
      current += char;
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (current.trim()) rows.push(parseLine(current));
      current = "";
      if (char === "\r" && next === "\n") index += 1;
    } else {
      current += char;
    }
  }
  if (current.trim()) rows.push(parseLine(current));
  if (!rows.length) return [];

  const cols = rows.shift().map((item) => item.trim().toLowerCase());
  return rows
    .map((values, index) => {
      const row = {};
      for (const name of header) {
        const colIndex = cols.indexOf(name);
        row[name] = colIndex >= 0 ? values[colIndex] || "" : "";
      }
      return normalizeRow(row, index);
    })
    .filter(Boolean);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function wordToCsvRow(word) {
  return [
    word.word,
    word.phonetic,
    word.meaning,
    word.meaning_full || word.meaningFull || "",
    word.unit,
    word.theme,
    word.root,
    word.parts.join("|"),
    word.memory,
    word.related.join("|"),
    word.example_en || "",
    word.example_zh || "",
    word.pronunciation_text || "",
  ]
    .map(escapeCsv)
    .join(",");
}

function dbRowToWord(row) {
  return {
    id: row.word_key,
    word: row.word,
    phonetic: row.phonetic || "",
    meaning: row.meaning || "",
    meaning_full: row.meaning_full || "",
    unit: row.unit || "",
    theme: row.theme || "",
    root: row.root || "",
    parts: JSON.parse(row.parts_json || "[]"),
    memory: row.memory || "",
    related: JSON.parse(row.related_json || "[]"),
    example_en: row.example_en || "",
    example_zh: row.example_zh || "",
    pronunciation_text: row.pronunciation_text || "",
    style: row.style || "planet",
    learned: Boolean(row.learned),
  };
}

function allWords() {
  return db
    .prepare(
      `select word_key, word, phonetic, meaning, meaning_full, unit, theme, root, parts_json, memory, related_json, example_en, example_zh, pronunciation_text, style, learned, sort_order
       from words
       order by sort_order asc, word asc`,
    )
    .all()
    .map(dbRowToWord);
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function daysFromNow(days) {
  return minutesFromNow(days * 24 * 60);
}

function studySettings() {
  let row = db.prepare("select * from study_settings where id = 1").get();
  if (!row) {
    db.prepare(
      `insert into study_settings (id, daily_new, daily_review_limit, scope_mode, scope_value, question_modes_json, updated_at)
       values (1, 30, 200, 'all', '', ?, datetime('now'))`,
    ).run(JSON.stringify(defaultQuestionModes));
    row = db.prepare("select * from study_settings where id = 1").get();
  }
  return {
    dailyNew: Number(row.daily_new || 30),
    dailyReviewLimit: Number(row.daily_review_limit || 200),
    scopeMode: row.scope_mode || "all",
    scopeValue: row.scope_value || "",
    questionModes: (() => {
      const modes = JSON.parse(row.question_modes_json || "[]").filter((mode) => allowedQuestionModes.includes(mode));
      return modes.length ? [modes[0]] : defaultQuestionModes;
    })(),
  };
}

function updateStudySettings(input) {
  const current = studySettings();
  const dailyNew = Math.max(1, Math.min(300, Number(input.dailyNew ?? current.dailyNew) || current.dailyNew));
  const dailyReviewLimit = Math.max(0, Math.min(1000, Number(input.dailyReviewLimit ?? current.dailyReviewLimit) || current.dailyReviewLimit));
  const scopeMode = ["all", "unit", "theme"].includes(input.scopeMode) ? input.scopeMode : current.scopeMode;
  const scopeValue = String(input.scopeValue ?? current.scopeValue ?? "").trim();
  const requestedModes = Array.isArray(input.questionModes) ? input.questionModes.filter((mode) => allowedQuestionModes.includes(mode)) : [];
  const questionModes = requestedModes.length ? [requestedModes[0]] : current.questionModes;
  db.prepare(
    `insert into study_settings (id, daily_new, daily_review_limit, scope_mode, scope_value, question_modes_json, updated_at)
     values (1, ?, ?, ?, ?, ?, datetime('now'))
     on conflict(id) do update set
       daily_new = excluded.daily_new,
       daily_review_limit = excluded.daily_review_limit,
       scope_mode = excluded.scope_mode,
       scope_value = excluded.scope_value,
       question_modes_json = excluded.question_modes_json,
       updated_at = datetime('now')`,
  ).run(dailyNew, dailyReviewLimit, scopeMode, scopeValue, JSON.stringify(questionModes));
  return studySettings();
}

function scopedWords(settings) {
  const words = allWords();
  if (settings.scopeMode === "unit" && settings.scopeValue) {
    return words.filter((word) => word.unit === settings.scopeValue || word.unit?.replace(/\s+/g, " ") === settings.scopeValue);
  }
  if (settings.scopeMode === "theme" && settings.scopeValue) {
    return words.filter((word) => word.theme === settings.scopeValue);
  }
  return words;
}

function studyProgressMap() {
  return new Map(db.prepare("select * from word_progress").all().map((row) => [row.word_key, row]));
}

function dueReviewRows(limit) {
  if (limit <= 0) return [];
  return db
    .prepare(
      `select word_key, state, due_at, review_count, correct_count, wrong_count, streak, difficulty, stability
       from word_progress
       where state in ('learning', 'review', 'mastered') and due_at <= ?
       order by due_at asc, wrong_count desc, difficulty desc
       limit ?`,
    )
    .all(new Date().toISOString(), limit);
}

function chooseQuestionMode(word, index, settings) {
  const modes = settings.questionModes?.length ? settings.questionModes : defaultQuestionModes;
  return modes[index % modes.length];
}

function attachStudyCard(word, mode, source, progress = null, index = 0) {
  return {
    ...word,
    study: {
      mode,
      source,
      state: progress?.state || "new",
      dueAt: progress?.due_at || "",
      reviewCount: Number(progress?.review_count || 0),
      wrongCount: Number(progress?.wrong_count || 0),
      queueIndex: index,
    },
  };
}

function todayStudyPlan() {
  const settings = studySettings();
  const scoped = scopedWords(settings);
  const byKey = new Map(scoped.map((word) => [word.id, word]));
  const progress = studyProgressMap();
  const today = todayKey();
  const learnedToday = db.prepare("select count(distinct word_key) as count from review_logs where day_key = ? and source = 'new'").get(today).count;
  const reviewRows = dueReviewRows(settings.dailyReviewLimit).filter((row) => byKey.has(row.word_key));
  const newLimit = Math.max(0, settings.dailyNew - learnedToday);
  const newWords = scoped.filter((word) => !progress.has(word.id)).slice(0, newLimit);
  const reviewCards = reviewRows.map((row, index) => attachStudyCard(byKey.get(row.word_key), chooseQuestionMode(byKey.get(row.word_key), index, settings), "review", row, index));
  const newCards = newWords.map((word, index) => attachStudyCard(word, chooseQuestionMode(word, reviewCards.length + index, settings), "new", null, reviewCards.length + index));
  return {
    date: today,
    settings,
    stats: {
      totalInScope: scoped.length,
      dueReview: reviewRows.length,
      newAvailable: scoped.filter((word) => !progress.has(word.id)).length,
      learnedToday,
      dailyNewLeft: newLimit,
    },
    queue: [...reviewCards, ...newCards],
  };
}

function scheduleReview(wordKey, rating, mode = "flip", source = "review", responseMs = 0) {
  const key = normalizeWordKey(wordKey);
  if (!key) {
    const error = new Error("单词为空");
    error.statusCode = 400;
    throw error;
  }
  const word = db.prepare("select word_key from words where word_key = ?").get(key);
  if (!word) {
    const error = new Error("单词不存在");
    error.statusCode = 404;
    throw error;
  }

  const previous = db.prepare("select * from word_progress where word_key = ?").get(key);
  const score = Math.max(0, Math.min(3, Number(rating) || 0));
  const reviewCount = Number(previous?.review_count || 0) + 1;
  const correct = score >= 2 ? 1 : 0;
  const correctCount = Number(previous?.correct_count || 0) + correct;
  const wrongCount = Number(previous?.wrong_count || 0) + (correct ? 0 : 1);
  const streak = correct ? Number(previous?.streak || 0) + 1 : 0;
  const oldDifficulty = Number(previous?.difficulty || 2.5);
  const oldStability = Number(previous?.stability || 0);
  const difficulty = Math.max(1.3, Math.min(4.9, oldDifficulty + (score <= 1 ? 0.28 : score === 2 ? -0.05 : -0.16)));
  const baseStability = oldStability || (score >= 3 ? 4 : score === 2 ? 2 : score === 1 ? 0.7 : 0.15);
  let state = "learning";
  let nextDue = minutesFromNow(5);
  let stability = baseStability;

  if (score === 0) {
    stability = Math.max(0.12, baseStability * 0.45);
    nextDue = minutesFromNow(5);
  } else if (score === 1) {
    stability = Math.max(0.5, baseStability * 0.9);
    nextDue = minutesFromNow(reviewCount <= 2 ? 30 : 12 * 60);
  } else if (score === 2) {
    stability = Math.max(1.5, baseStability * (reviewCount <= 1 ? 1.6 : 2.1));
    state = streak >= 2 ? "review" : "learning";
    nextDue = daysFromNow(Math.max(1, Math.round(stability)));
  } else {
    stability = Math.max(3, baseStability * (reviewCount <= 1 ? 2.2 : 3.0));
    state = streak >= 4 ? "mastered" : "review";
    nextDue = daysFromNow(Math.max(2, Math.round(stability)));
  }

  db.prepare(
    `insert into word_progress
      (word_key, state, first_seen_at, last_review_at, due_at, review_count, correct_count, wrong_count, streak, difficulty, stability, retrievability, updated_at)
     values (?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     on conflict(word_key) do update set
      state = excluded.state,
      last_review_at = excluded.last_review_at,
      due_at = excluded.due_at,
      review_count = excluded.review_count,
      correct_count = excluded.correct_count,
      wrong_count = excluded.wrong_count,
      streak = excluded.streak,
      difficulty = excluded.difficulty,
      stability = excluded.stability,
      retrievability = excluded.retrievability,
      updated_at = excluded.updated_at`,
  ).run(key, state, nextDue, reviewCount, correctCount, wrongCount, streak, difficulty, stability, score / 3);
  db.prepare(
    `insert into review_logs (word_key, mode, source, rating, correct, response_ms, day_key, answered_at)
     values (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
  ).run(key, mode, source, score, correct, Number(responseMs) || 0, todayKey());
  db.prepare("update words set learned = ?, updated_at = datetime('now') where word_key = ?").run(state === "review" || state === "mastered" ? 1 : 0, key);
  return { ok: true, word: key, state, dueAt: nextDue, reviewCount, correctCount, wrongCount, streak, difficulty, stability };
}

function exportCsvFromDb() {
  const csv = `${[header.join(","), ...allWords().map(wordToCsvRow)].join("\n")}\n`;
  return csv;
}

async function syncFlatFiles() {
  const csv = exportCsvFromDb();
  await fs.writeFile(allWordsPath, csv, "utf8");
  await fs.writeFile(dataJsPath, `window.ALL_WORDS_CSV = ${JSON.stringify(csv)};\n`, "utf8");
  try {
    lastCsvMtimeMs = (await fs.stat(allWordsPath)).mtimeMs;
  } catch {}
}

async function clearFlatFiles() {
  const csv = `${header.join(",")}\n`;
  await fs.writeFile(allWordsPath, csv, "utf8");
  await fs.writeFile(dataJsPath, `window.ALL_WORDS_CSV = ${JSON.stringify(csv)};\n`, "utf8");
  try {
    lastCsvMtimeMs = (await fs.stat(allWordsPath)).mtimeMs;
  } catch {}
  return { ok: true, files: [allWordsPath, dataJsPath] };
}

function sentenceHash(text, provider, voice) {
  return crypto
    .createHash("sha256")
    .update(`${provider}:${voice}:${String(text).trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 24);
}

async function downloadAudioFile(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`下载音频失败：${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 800) throw new Error("下载到的音频为空");
  await fs.writeFile(filePath, bytes);
  return bytes.length;
}

async function createOpenAiSpeech(sentence) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("缺少 OPENAI_API_KEY，无法首次生成 OpenAI 例句音频");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "alloy",
      input: sentence,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    const error = new Error(`OpenAI TTS 生成失败：${response.status} ${message.slice(0, 180)}`);
    error.statusCode = 502;
    throw error;
  }

  return { bytes: Buffer.from(await response.arrayBuffer()), ext: "mp3" };
}

async function createQwenSpeech(sentence, options = {}) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    const error = new Error("缺少 DASHSCOPE_API_KEY，无法首次生成 Qwen3-TTS 例句音频");
    error.statusCode = 503;
    throw error;
  }

  const model = options.model || process.env.QWEN_TTS_MODEL || "qwen3-tts-flash";
  const voice = options.voice || process.env.QWEN_TTS_VOICE || "Cherry";
  const baseUrl = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com";
  const input = {
    text: sentence,
    voice,
    language_type: "English",
  };
  if (options.instructions) {
    input.instructions = options.instructions;
    input.optimize_instructions = options.optimizeInstructions ?? true;
  }

  const response = await fetch(`${baseUrl}/api/v1/services/aigc/multimodal-generation/generation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });

  const payloadText = await response.text();
  let payload;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    payload = {};
  }
  if (!response.ok) {
    const error = new Error(`Qwen3-TTS 生成失败：${response.status} ${payloadText.slice(0, 180)}`);
    error.statusCode = 502;
    throw error;
  }

  const audioUrl =
    payload.output?.audio?.url ||
    payload.output?.audio_url ||
    payload.output?.url ||
    payload.output?.choices?.[0]?.message?.audio?.url ||
    payload.output?.choices?.[0]?.message?.content?.find?.((item) => item.audio)?.audio;
  if (!audioUrl) {
    const error = new Error(`Qwen3-TTS 没有返回音频地址：${payloadText.slice(0, 180)}`);
    error.statusCode = 502;
    throw error;
  }

  const ext = /\.wav(\?|$)/i.test(audioUrl) ? "wav" : "mp3";
  return { audioUrl, ext };
}

function naturalizeEnglishSentence(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/([,;:])\s*/g, "$1 ")
    .replace(/([.!?])\s+/g, "$1  ")
    .replace(/\b(however|therefore|moreover|for example|in contrast|as a result)\b/gi, "$1,");
}

function qwenStyleInstruction(kind) {
  if (kind === "word") {
    return "Read this as a single American English vocabulary item, clearly and naturally, with no extra words.";
  }
  return [
    "Deliver the text in General Canadian English with perfect native pronunciation.",
    "Maintain a professional yet warm tone with authentic Canadian rhythm and intonation.",
    "Avoid any unnatural robotic shifts.",
    "Pause slightly after commas.",
    "Put gentle stress on the key vocabulary word.",
  ].join(" ");
}

function qwenSentenceOptions(voice) {
  const model = process.env.QWEN_SENTENCE_TTS_MODEL || "qwen3-tts-instruct-flash";
  const options = { model, voice };
  if (model.includes("instruct")) {
    options.instructions = qwenStyleInstruction("sentence");
    options.optimizeInstructions = true;
  }
  return options;
}

function previewHash(input) {
  return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 24);
}

async function ensureTtsPreview(input) {
  const text = String(input.text || "").trim();
  if (!text) {
    const error = new Error("试听文本为空");
    error.statusCode = 400;
    throw error;
  }
  const voice = String(input.voice || "Serena").trim();
  const model = String(input.model || "qwen3-tts-instruct-flash").trim();
  const speed = String(input.speed || "slow").trim();
  const style = String(input.style || "").trim();
  const speedInstruction =
    speed === "very-slow"
      ? "Read slowly, about 0.78x normal speed, with clear pauses between clauses."
      : speed === "slow"
        ? "Read at a relaxed learning pace, about 0.88x normal speed, with natural pauses."
        : speed === "normal"
          ? "Read at a natural conversational speed with clear articulation."
          : "Read a little briskly but keep pronunciation clear.";
  const instructions = [
    speedInstruction,
    "Use natural American English rhythm. Avoid theatrical or exaggerated intonation.",
    "Keep the voice warm, clear, and suitable for vocabulary example sentences.",
    style,
  ]
    .filter(Boolean)
    .join(" ");
  const options = { model, voice };
  if (model.includes("instruct")) {
    options.instructions = instructions;
    options.optimizeInstructions = true;
  }
  const hash = previewHash({ text, voice, model, speed, style, instructions: options.instructions || "" });
  await fs.mkdir(previewAudioDir, { recursive: true });
  for (const ext of ["mp3", "wav"]) {
    const cachedPath = path.join(previewAudioDir, `${hash}.${ext}`);
    try {
      const stat = await fs.stat(cachedPath);
      if (stat.size > 800) return { url: `/audio/preview/${hash}.${ext}`, cached: true, hash, voice, model, speed, instructions: options.instructions || "" };
    } catch {}
  }
  const result = await createQwenSpeech(naturalizeEnglishSentence(text), options);
  const filename = `${hash}.${result.ext}`;
  const bytes = await downloadAudioFile(result.audioUrl, path.join(previewAudioDir, filename));
  if (bytes < 800) {
    const error = new Error("TTS 试听音频为空");
    error.statusCode = 502;
    throw error;
  }
  return { url: `/audio/preview/${filename}`, cached: false, hash, voice, model, speed, instructions: options.instructions || "", bytes };
}

async function ensureSentenceAudio(text, providerInput = "qwen") {
  const sentence = String(text || "").trim();
  const provider = providerInput === "openai" ? "openai" : "qwen";
  const preferredVoice = provider === "openai" ? process.env.OPENAI_TTS_VOICE || "alloy" : process.env.QWEN_SENTENCE_TTS_VOICE || "Maia";
  if (!sentence) {
    const error = new Error("例句为空");
    error.statusCode = 400;
    throw error;
  }
  if (sentence.length > 600) {
    const error = new Error("例句太长，建议控制在 600 个字符以内");
    error.statusCode = 400;
    throw error;
  }

  await fs.mkdir(sentenceAudioDir, { recursive: true });
  const hash = sentenceHash(sentence, provider, preferredVoice);
  for (const ext of ["mp3", "wav"]) {
    const cachedPath = path.join(sentenceAudioDir, `${hash}.${ext}`);
    try {
      const stat = await fs.stat(cachedPath);
      if (stat.size > 800) return { url: `/audio/sentences/${hash}.${ext}`, cached: true, hash, provider, voice: preferredVoice };
    } catch {}
  }

  if (provider === "openai") {
    const result = await createOpenAiSpeech(sentence);
    if (result.bytes.length < 800) {
      const error = new Error("OpenAI TTS 返回的音频为空");
      error.statusCode = 502;
      throw error;
    }
    const filename = `${hash}.${result.ext}`;
    await fs.writeFile(path.join(sentenceAudioDir, filename), result.bytes);
    return { url: `/audio/sentences/${filename}`, cached: false, hash, provider, voice: preferredVoice, bytes: result.bytes.length };
  }

  const result = await createQwenSpeech(naturalizeEnglishSentence(sentence), qwenSentenceOptions(preferredVoice));
  const filename = `${hash}.${result.ext}`;
  const filePath = path.join(sentenceAudioDir, filename);
  const bytes = await downloadAudioFile(result.audioUrl, filePath);
  if (bytes < 800) {
    const error = new Error("TTS 返回的音频为空");
    error.statusCode = 502;
    throw error;
  }
  return { url: `/audio/sentences/${filename}`, cached: false, hash, provider, voice: preferredVoice, bytes };
}

async function ensureWordAudio(wordInput, providerInput = "qwen") {
  const word = String(wordInput || "").trim();
  const wordKey = normalizeWordKey(word);
  if (!wordKey) {
    const error = new Error("单词为空");
    error.statusCode = 400;
    throw error;
  }
  const provider = providerInput === "openai" ? "openai" : "qwen";
  const voice = provider === "openai" ? process.env.OPENAI_TTS_VOICE || "alloy" : process.env.QWEN_TTS_VOICE || "en-US-Jenny";
  await fs.mkdir(wordTtsDir, { recursive: true });

  for (const ext of ["mp3", "wav"]) {
    const cachedPath = path.join(wordTtsDir, `${wordKey}.${ext}`);
    try {
      const stat = await fs.stat(cachedPath);
      if (stat.size > 800) return { url: `/audio/tts/${wordKey}.${ext}`, cached: true, word: wordKey, provider, voice };
    } catch {}
  }

  const row = db.prepare("select pronunciation_text from words where word_key = ?").get(wordKey);
  const spokenText = String(row?.pronunciation_text || word).trim();

  if (provider === "openai") {
    const result = await createOpenAiSpeech(spokenText);
    const filename = `${wordKey}.${result.ext}`;
    await fs.writeFile(path.join(wordTtsDir, filename), result.bytes);
    return { url: `/audio/tts/${filename}`, cached: false, word: wordKey, provider, voice, bytes: result.bytes.length };
  }

  const result = await createQwenSpeech(spokenText, qwenStyleInstruction("word"));
  const filename = `${wordKey}.${result.ext}`;
  const bytes = await downloadAudioFile(result.audioUrl, path.join(wordTtsDir, filename));
  return { url: `/audio/tts/${filename}`, cached: false, word: wordKey, provider, voice, bytes };
}

function googleOxfordUrls(word) {
  const safeWord = normalizeWordKey(word);
  if (!safeWord) return [];
  return [
    `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${encodeURIComponent(safeWord)}--_us_1.mp3`,
    `https://ssl.gstatic.com/dictionary/static/sounds/20200429/${encodeURIComponent(safeWord)}--_us_1.mp3`,
  ];
}

async function ensureDefaultWordAudio(wordInput) {
  const word = String(wordInput || "").trim();
  const wordKey = normalizeWordKey(word);
  if (!wordKey) {
    const error = new Error("单词为空");
    error.statusCode = 400;
    throw error;
  }

  const defaultDir = path.join(root, "audio", "default");
  await fs.mkdir(defaultDir, { recursive: true });
  const targetPath = path.join(defaultDir, `${wordKey}.mp3`);
  try {
    const stat = await fs.stat(targetPath);
    if (stat.size > 800) return { url: `/audio/default/${wordKey}.mp3`, cached: true, word: wordKey, source: "local-default" };
  } catch {}

  const row = db.prepare("select pronunciation_text from words where word_key = ?").get(wordKey);
  const lookupText = String(row?.pronunciation_text || word).trim();
  const candidates = [...new Set([word, lookupText].map(normalizeWordKey).filter(Boolean))];
  const errors = [];
  for (const candidate of candidates) {
    for (const url of googleOxfordUrls(candidate)) {
      try {
        const bytes = await downloadAudioFile(url, targetPath);
        return { url: `/audio/default/${wordKey}.mp3`, cached: false, word: wordKey, lookup: candidate, source: "google-oxford", bytes };
      } catch (error) {
        errors.push(`${candidate}: ${error.message}`);
      }
    }
  }

  const error = new Error(`Google/Oxford 未找到音频：${errors.slice(0, 2).join("; ")}`);
  error.statusCode = 404;
  throw error;
}

function upsertWords(rows) {
  const existingCount = db.prepare("select count(*) as count from words").get().count;
  const maxOrder = db.prepare("select coalesce(max(sort_order), -1) as value from words").get().value;
  let nextOrder = Number(maxOrder) + 1;

  const select = db.prepare("select word_key, sort_order, pronunciation_text, meaning_full from words where word_key = ?");
  const insert = db.prepare(
    `insert into words
      (word_key, word, phonetic, meaning, meaning_full, unit, theme, root, parts_json, memory, related_json, example_en, example_zh, pronunciation_text, style, sort_order, updated_at)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
  );
  const update = db.prepare(
    `update words
     set word = ?, phonetic = ?, meaning = ?, meaning_full = ?, unit = ?, theme = ?, root = ?, parts_json = ?, memory = ?, related_json = ?, example_en = ?, example_zh = ?, pronunciation_text = ?, updated_at = datetime('now')
     where word_key = ?`,
  );

  db.exec("begin");
  try {
    for (const row of rows) {
      const previous = select.get(row.wordKey);
      const style = previous ? undefined : ["planet", "ring", "star", "nebula", "core"][nextOrder % 5];
      if (previous) {
        update.run(
          row.word,
          row.phonetic,
          row.meaning,
          row.meaningFull || previous.meaning_full || "",
          row.unit,
          row.theme,
          row.root,
          JSON.stringify(row.parts),
          row.memory,
          JSON.stringify(row.related),
          row.exampleEn,
          row.exampleZh,
          row.pronunciationText || previous.pronunciation_text || "",
          row.wordKey,
        );
      } else {
        insert.run(
          row.wordKey,
          row.word,
          row.phonetic,
          row.meaning,
          row.meaningFull,
          row.unit,
          row.theme,
          row.root,
          JSON.stringify(row.parts),
          row.memory,
          JSON.stringify(row.related),
          row.exampleEn,
          row.exampleZh,
          row.pronunciationText,
          style,
          nextOrder,
        );
        nextOrder += 1;
      }
    }
    db.exec("commit");
  } catch (error) {
    db.exec("rollback");
    throw error;
  }

  const total = db.prepare("select count(*) as count from words").get().count;
  return { existing: existingCount, incoming: rows.length, total };
}

async function readCsvIfExists(filePath) {
  try {
    return parseCsv(decodeCsv(await fs.readFile(filePath)));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function mergeCsvFileIfChanged() {
  try {
    const stat = await fs.stat(allWordsPath);
    if (stat.mtimeMs <= lastCsvMtimeMs + 1) return false;
    const rows = await readCsvIfExists(allWordsPath);
    if (!rows.length) return false;
    upsertWords(rows);
    await syncFlatFiles();
    return true;
  } catch {
    return false;
  }
}

async function initDatabase() {
  await fs.mkdir(dataDir, { recursive: true });
  db = new DatabaseSync(dbPath);
  db.exec(`
    pragma journal_mode = wal;
    create table if not exists words (
      word_key text primary key,
      word text not null,
      phonetic text,
      meaning text,
      meaning_full text not null default '',
      unit text,
      theme text,
      root text,
      parts_json text not null default '[]',
      memory text,
      related_json text not null default '[]',
      example_en text not null default '',
      example_zh text not null default '',
      pronunciation_text text not null default '',
      style text not null default 'planet',
      learned integer not null default 0,
      sort_order integer not null default 0,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now'))
    );
    create index if not exists idx_words_unit on words(unit);
    create index if not exists idx_words_theme on words(theme);
    create table if not exists study_settings (
      id integer primary key check (id = 1),
      daily_new integer not null default 30,
      daily_review_limit integer not null default 200,
      scope_mode text not null default 'all',
      scope_value text not null default '',
      question_modes_json text not null default '["flip","word_to_meaning"]',
      updated_at text not null default (datetime('now'))
    );
    create table if not exists word_progress (
      word_key text primary key references words(word_key) on delete cascade,
      state text not null default 'new',
      first_seen_at text,
      last_review_at text,
      due_at text not null default (datetime('now')),
      review_count integer not null default 0,
      correct_count integer not null default 0,
      wrong_count integer not null default 0,
      streak integer not null default 0,
      difficulty real not null default 2.5,
      stability real not null default 0,
      retrievability real not null default 0,
      updated_at text not null default (datetime('now'))
    );
    create table if not exists review_logs (
      id integer primary key autoincrement,
      word_key text not null references words(word_key) on delete cascade,
      mode text not null,
      source text not null default 'review',
      rating integer not null,
      correct integer not null,
      response_ms integer not null default 0,
      day_key text not null,
      answered_at text not null default (datetime('now'))
    );
    create index if not exists idx_word_progress_due on word_progress(due_at, state);
    create index if not exists idx_review_logs_day on review_logs(day_key);
  `);
  const columns = db.prepare("pragma table_info(words)").all().map((column) => column.name);
  if (!columns.includes("meaning_full")) db.exec("alter table words add column meaning_full text not null default ''");
  if (!columns.includes("example_en")) db.exec("alter table words add column example_en text not null default ''");
  if (!columns.includes("example_zh")) db.exec("alter table words add column example_zh text not null default ''");
  if (!columns.includes("pronunciation_text")) db.exec("alter table words add column pronunciation_text text not null default ''");

  const count = db.prepare("select count(*) as count from words").get().count;
  const seedRows = await readCsvIfExists(allWordsPath);
  if (seedRows.length) {
    upsertWords(seedRows);
  }
  await syncFlatFiles();
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function send(res, status, body, type = "text/plain;charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendJson(res, value, status = 200) {
  send(res, status, JSON.stringify(value), "application/json;charset=utf-8");
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/words") {
    await mergeCsvFileIfChanged();
    const words = allWords();
    sendJson(res, { words, total: words.length });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/export-csv") {
    send(res, 200, exportCsvFromDb(), "text/csv;charset=utf-8");
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/merge-csv") {
    const body = await readRequestBody(req);
    const result = upsertWords(parseCsv(decodeCsv(body)));
    await syncFlatFiles();
    sendJson(res, result);
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/progress") {
    const learned = allWords()
      .filter((word) => word.learned)
      .map((word) => word.id);
    sendJson(res, { learned });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/learned") {
    const body = JSON.parse(String(await readRequestBody(req)) || "{}");
    const key = normalizeWordKey(body.word || body.id);
    db.prepare("update words set learned = ?, updated_at = datetime('now') where word_key = ?").run(body.learned ? 1 : 0, key);
    sendJson(res, { ok: true, word: key, learned: Boolean(body.learned) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/study/settings") {
    sendJson(res, studySettings());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/study/settings") {
    const body = JSON.parse(String(await readRequestBody(req)) || "{}");
    sendJson(res, updateStudySettings(body));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/study/today") {
    await mergeCsvFileIfChanged();
    sendJson(res, todayStudyPlan());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/study/review") {
    const body = JSON.parse(String(await readRequestBody(req)) || "{}");
    sendJson(res, scheduleReview(body.word || body.id, body.rating, body.mode, body.source, body.responseMs));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/sentence-audio") {
    try {
      const body = JSON.parse(String(await readRequestBody(req)) || "{}");
      sendJson(res, await ensureSentenceAudio(body.text, body.provider));
    } catch (error) {
      sendJson(res, { error: error.message || "生成例句音频失败" }, error.statusCode || 500);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/tts-preview") {
    try {
      const body = JSON.parse(String(await readRequestBody(req)) || "{}");
      sendJson(res, await ensureTtsPreview(body));
    } catch (error) {
      sendJson(res, { error: error.message || "TTS 试听生成失败" }, error.statusCode || 500);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/word-audio") {
    try {
      const body = JSON.parse(String(await readRequestBody(req)) || "{}");
      sendJson(res, await ensureWordAudio(body.word, body.provider));
    } catch (error) {
      sendJson(res, { error: error.message || "生成单词音频失败" }, error.statusCode || 500);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/default-word-audio") {
    try {
      const body = JSON.parse(String(await readRequestBody(req)) || "{}");
      sendJson(res, await ensureDefaultWordAudio(body.word));
    } catch (error) {
      sendJson(res, { error: error.message || "获取默认单词音频失败" }, error.statusCode || 500);
    }
    return true;
  }

  if (req.method === "DELETE" && url.pathname === "/api/progress") {
    db.exec("update words set learned = 0, updated_at = datetime('now')");
    sendJson(res, { ok: true });
    return true;
  }

  if (req.method === "DELETE" && url.pathname === "/api/file-cache") {
    sendJson(res, await clearFlatFiles());
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname.startsWith("/api/") && (await handleApi(req, res, url))) return;

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, "Method not allowed");
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const filePath = path.resolve(root, `.${requested}`);
    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    const data = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    if (req.method === "HEAD") res.end();
    else res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") send(res, 404, "Not found");
    else {
      console.error(error);
      send(res, 500, "Internal server error");
    }
  }
});

initDatabase().then(() => {
  server.listen(port, () => {
    console.log(`Vocabulary universe running at http://localhost:${port}/`);
    console.log(`SQLite database: ${dbPath}`);
  });
});
