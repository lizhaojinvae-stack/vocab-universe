const fs = require('node:fs/promises');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = __dirname;
const db = new DatabaseSync(path.join(root, 'data', 'vocab.sqlite'));
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) throw new Error('DASHSCOPE_API_KEY is not set');

const columns = db.prepare('pragma table_info(words)').all().map((column) => column.name);
if (!columns.includes('meaning_full')) db.exec("alter table words add column meaning_full text not null default ''");

const rows = db.prepare(`select word_key, word, meaning, meaning_full, root, unit from words order by sort_order asc, word asc`).all();
const targets = rows.filter((row) => !String(row.meaning_full || '').trim());

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function cleanMeaning(text) {
  return String(text || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[；;]\s*/g, '；')
    .trim();
}
function fallbackMeaning(row) {
  return cleanMeaning(row.meaning);
}
function parseJson(text) {
  const raw = String(text || '').trim();
  try { return JSON.parse(raw); } catch {}
  const match = raw.match(/\[[\s\S]*\]/);
  if (match) return JSON.parse(match[0]);
  throw new Error(`No JSON array in response: ${raw.slice(0, 200)}`);
}
async function enrichBatch(batch) {
  const payload = batch.map((row) => ({ word: row.word, current: row.meaning, root: row.root || '', unit: row.unit || '' }));
  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.MEANING_MODEL || 'qwen-plus',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: '你是考研英语词汇编辑。为每个英文单词补全中文常用释义，覆盖常见词性和考研阅读高频义项，准确、简洁，不要造冷僻义。输出严格 JSON：{"items":[{"word":"...","meaning_full":"..."}]}。meaning_full 格式示例："n. 影响；结果；效果 v. 产生；实现"。只输出 JSON。',
        },
        {
          role: 'user',
          content: `请补全这些词的常用中文释义。已有释义可参考但不要被限制：\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Qwen ${response.status}: ${body.slice(0, 300)}`);
  const json = JSON.parse(body);
  const content = json.choices?.[0]?.message?.content || '';
  const parsed = parseJson(content);
  return Array.isArray(parsed) ? parsed : parsed.items || [];
}

async function main() {
  const update = db.prepare('update words set meaning_full = ?, updated_at = datetime(\'now\') where word_key = ?');
  let done = 0;
  for (let i = 0; i < targets.length; i += 20) {
    const batch = targets.slice(i, i + 20);
    let items = [];
    try {
      items = await enrichBatch(batch);
    } catch (error) {
      console.warn(`Batch ${i + 1}-${i + batch.length} failed: ${error.message}`);
      items = batch.map((row) => ({ word: row.word, meaning_full: fallbackMeaning(row) }));
    }
    const map = new Map(items.map((item) => [String(item.word || '').toLowerCase(), cleanMeaning(item.meaning_full)]));
    db.exec('begin');
    try {
      for (const row of batch) {
        const value = map.get(String(row.word).toLowerCase()) || fallbackMeaning(row);
        update.run(value, row.word_key);
        done += 1;
      }
      db.exec('commit');
    } catch (error) {
      db.exec('rollback');
      throw error;
    }
    console.log(`enriched ${Math.min(i + batch.length, targets.length)}/${targets.length}`);
    await sleep(250);
  }
  console.log(`done: ${done}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
