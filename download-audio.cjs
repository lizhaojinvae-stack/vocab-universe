const fs = require("node:fs/promises");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const dbPath = path.join(root, "data", "vocab.sqlite");
const defaultDir = path.join(root, "audio", "default");
const usDir = path.join(root, "audio", "us");
const reportPath = path.join(root, "audio", "download-report.json");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeWord(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

async function existsGood(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.size > 800;
  } catch {
    return false;
  }
}

async function downloadBinary(url, targetPath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 vocab-universe-audio-cache",
      Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.1",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "";
  if (bytes.length < 800 || !/audio|mpeg|octet-stream/i.test(contentType)) {
    throw new Error(`Invalid audio ${bytes.length} ${contentType}`);
  }
  await fs.writeFile(targetPath, bytes);
  return bytes.length;
}

async function dictionaryAudioUrl(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
  if (!response.ok) throw new Error(`Dictionary HTTP ${response.status}`);
  const entries = await response.json();
  const phonetics = Array.isArray(entries) ? entries.flatMap((entry) => entry.phonetics || []) : [];
  const audio = phonetics.find((item) => item.audio)?.audio || "";
  return audio.startsWith("//") ? `https:${audio}` : audio;
}

async function downloadWord(word) {
  const defaultTarget = path.join(defaultDir, `${word}.mp3`);
  const usTarget = path.join(usDir, `${word}.mp3`);
  const result = { word, default: "skip", us: "skip" };

  if (await existsGood(defaultTarget)) {
    result.default = "exists";
  } else {
    try {
      const url = await dictionaryAudioUrl(word);
      if (!url) throw new Error("No dictionary audio");
      const bytes = await downloadBinary(url, defaultTarget);
      result.default = `downloaded:${bytes}`;
    } catch (error) {
      result.default = `miss:${error.cause?.code || error.message}`;
    }
  }

  if (await existsGood(usTarget)) {
    result.us = "exists";
  } else {
    try {
      const bytes = await downloadBinary(`https://media.shanbay.com/audio/us/${encodeURIComponent(word)}.mp3`, usTarget);
      result.us = `downloaded:${bytes}`;
    } catch (error) {
      result.us = `miss:${error.cause?.code || error.message}`;
    }
  }

  return result;
}

async function main() {
  await fs.mkdir(defaultDir, { recursive: true });
  await fs.mkdir(usDir, { recursive: true });

  const db = new DatabaseSync(dbPath);
  const words = db
    .prepare("select word_key from words order by sort_order asc, word asc")
    .all()
    .map((row) => normalizeWord(row.word_key))
    .filter(Boolean);
  db.close();

  const results = [];
  for (const word of words) {
    const result = await downloadWord(word);
    results.push(result);
    console.log(`${word} default=${result.default} us=${result.us}`);
    await wait(150);
  }

  const summary = results.reduce(
    (acc, item) => {
      acc.default[item.default.split(":")[0]] = (acc.default[item.default.split(":")[0]] || 0) + 1;
      acc.us[item.us.split(":")[0]] = (acc.us[item.us.split(":")[0]] || 0) + 1;
      return acc;
    },
    { default: {}, us: {} },
  );
  await fs.writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2), "utf8");
  console.log(JSON.stringify({ total: words.length, summary }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
