const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const db = new DatabaseSync(path.join(root, "data", "vocab.sqlite"));

const header = [
  "word",
  "phonetic",
  "meaning",
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

const themes = [
  "自然科学",
  "社会法律",
  "商业经济",
  "工作管理",
  "教育学术",
  "交流表达",
  "心理认知",
  "情感品质",
  "行为关系",
  "状态变化",
];

const rules = [
  ["自然科学", 4, ["科学", "物理", "化学", "生物", "基因", "细胞", "粒子", "颗粒", "元素", "物质", "质量", "辐射", "放射", "光线", "自然", "天气", "阵雨", "风景", "景色", "栖息地", "环境", "发电机", "机器", "杠杆", "技术", "医学", "疾病", "治疗", "生病", "瘫痪", "麻痹", "身体", "肩膀", "健康", "容量", "容积"]],
  ["社会法律", 4, ["法律", "法规", "法庭", "法官", "司法", "判决", "陪审", "管辖", "诉讼", "官司", "公平", "公正", "正义", "合法", "立法", "授权", "命令", "禁止", "禁令", "取缔", "废除", "义务", "责任", "职责", "规定", "税", "征收", "政治", "社会", "首都", "国家", "国外", "海外", "群众", "俘虏", "囚禁", "占领"]],
  ["商业经济", 4, ["资本", "资金", "储蓄", "存款", "节省", "节约", "收益", "利润", "交易", "便宜", "协议", "讨价还价", "谈判", "出价", "报价", "供应", "提供", "货物", "市场", "生产能力", "合伙人", "酒吧"]],
  ["工作管理", 4, ["职业", "事业", "生涯", "专业", "主修", "资格", "学历", "资历", "管理", "管理层", "领导", "领导力", "领先", "主要", "安排", "日程", "计划", "方案", "项目", "任务", "专家", "小组", "轮班", "承担", "维护", "维修", "保养", "保持", "维持", "设法做到", "占据", "忙碌"]],
  ["教育学术", 4, ["理论", "学说", "原理", "学术", "研究", "证明", "证实", "显示出", "概括", "归纳", "问卷", "调查", "段落", "阅读", "课程", "学校", "初级", "基础", "基本", "小学", "学习", "说明", "举例", "插图", "例证", "摘要", "定性", "客观", "假设"]],
  ["交流表达", 4, ["媒体", "媒介", "新闻", "传媒", "传播", "表达", "表明", "展示", "显示", "表演", "图像", "形象", "主题", "题目", "主旋律", "标签", "标记", "称号", "引用", "语言", "说", "话", "声音", "交流", "沟通", "插图", "说明", "画", "拍摄", "记录", "姿态", "态度"]],
  ["心理认知", 4, ["观察", "注意", "识别", "确认", "认出", "认同", "身份", "本体", "同一性", "判断", "判断力", "看法", "理解", "全神贯注", "思想", "意识形态", "观念", "理想", "想象", "猜想", "想象力", "虚构", "幻觉", "错觉", "无知", "忽视", "认知", "心理", "客观", "明显", "显而易见", "记忆", "注意到", "知道"]],
  ["情感品质", 4, ["感激", "热情", "激情", "魅力", "吸引", "迷住", "优雅", "高雅", "精美", "慷慨", "大方", "天才", "天赋", "品质", "才能", "性格", "自信", "容光焕发", "野蛮", "凶残", "严厉", "恶劣", "冒犯", "得罪", "和谐", "融洽", "消极", "被动", "小心", "谨慎", "礼貌", "豪华", "花俏"]],
  ["行为关系", 4, ["做", "制造", "使", "让", "获得", "得到", "给", "参加", "参与", "参与者", "伙伴", "关系", "合伙", "保护", "保卫", "维护", "承担", "肩负", "模仿", "仿效", "操纵", "控制", "阻碍", "妨碍", "伤害", "损害", "冒险", "赌博", "投", "扔", "掷", "抛", "攀登", "横跨", "分离", "捕获", "俘获", "提供", "供应", "给予", "调解", "调停", "斡旋", "居中促成", "协商", "谈判"]],
  ["状态变化", 3, ["抽象", "状态", "程度", "规模", "范围", "等级", "刻度", "水平", "级别", "大小", "量级", "巨大", "大量", "大部分", "主要地", "部分", "部分地", "特定", "绝对", "完全", "无条件", "缺乏", "缺席", "没有", "空的", "仅有", "勉强", "几乎不", "落后", "滞后", "延迟", "改变", "转移", "消除", "排除", "淘汰", "发生", "出现", "抵消", "补偿", "边缘", "微小", "平行", "跨度", "持续时间", "缺口", "差距", "裸露", "暴露", "复杂", "详尽", "适中", "中等", "普遍", "总的", "快", "迅速", "放弃", "停止"]],
];

const wordOverrides = new Map([
  ["radiat", "自然科学"], ["radiate", "自然科学"], ["radiation", "自然科学"], ["radiant", "情感品质"],
  ["law", "社会法律"], ["lawsuit", "社会法律"], ["judge", "社会法律"], ["judgement", "社会法律"], ["judicial", "社会法律"], ["jury", "社会法律"], ["jurisdiction", "社会法律"], ["justice", "社会法律"], ["justify", "社会法律"], ["legal", "社会法律"], ["legislation", "社会法律"], ["legitimate", "社会法律"], ["mandate", "社会法律"], ["oblige", "社会法律"], ["obligation", "社会法律"],
  ["capital", "商业经济"], ["saving", "商业经济"], ["bargain", "商业经济"], ["levy", "商业经济"], ["margin", "商业经济"], ["offer", "商业经济"], ["quote", "商业经济"],
  ["career", "工作管理"], ["manage", "工作管理"], ["management", "工作管理"], ["lead", "工作管理"], ["leadership", "工作管理"], ["leading", "工作管理"], ["schedule", "工作管理"], ["scheme", "工作管理"], ["occupation", "工作管理"], ["occupy", "工作管理"], ["qualification", "工作管理"], ["maintain", "工作管理"], ["maintenance", "工作管理"], ["panel", "工作管理"],
  ["theory", "教育学术"], ["theoretical", "教育学术"], ["science", "教育学术"], ["scientific", "教育学术"], ["scientist", "教育学术"], ["questionnaire", "教育学术"], ["paragraph", "教育学术"], ["abstract", "教育学术"], ["elementary", "教育学术"], ["prove", "教育学术"], ["generalize", "教育学术"], ["quality", "教育学术"], ["qualitative", "教育学术"],
  ["media", "交流表达"], ["medium", "交流表达"], ["theme", "交流表达"], ["label", "交流表达"], ["show", "交流表达"], ["illustrate", "交流表达"], ["illustration", "交流表达"], ["image", "交流表达"], ["genre", "交流表达"],
  ["observe", "心理认知"], ["observation", "心理认知"], ["identity", "心理认知"], ["identify", "心理认知"], ["identification", "心理认知"], ["identical", "心理认知"], ["ideal", "心理认知"], ["ideology", "心理认知"], ["imagine", "心理认知"], ["imaginary", "心理认知"], ["imagination", "心理认知"], ["ignorance", "心理认知"], ["ignorant", "心理认知"], ["ignore", "心理认知"], ["illusion", "心理认知"], ["obvious", "心理认知"],
  ["elegant", "情感品质"], ["generous", "情感品质"], ["genius", "情感品质"], ["glamour", "情感品质"], ["passion", "情感品质"], ["harsh", "情感品质"], ["harmony", "情感品质"], ["careful", "情感品质"], ["fascinate", "情感品质"], ["fancy", "情感品质"], ["confident", "情感品质"], ["humble", "情感品质"],
  ["participate", "行为关系"], ["participant", "行为关系"], ["partner", "行为关系"], ["imitate", "行为关系"], ["imitation", "行为关系"], ["manipulate", "行为关系"], ["manner", "行为关系"], ["shield", "行为关系"], ["safeguard", "行为关系"], ["harm", "行为关系"], ["gamble", "行为关系"], ["give", "行为关系"], ["provide", "行为关系"], ["mediate", "行为关系"], ["mediation", "行为关系"],
]);

function classify(row) {
  if (wordOverrides.has(row.word_key)) return wordOverrides.get(row.word_key);
  const text = `${row.word || ""} ${row.meaning || ""} ${row.root || ""} ${row.unit || ""}`.toLowerCase();
  const scores = Object.fromEntries(themes.map((theme) => [theme, 0]));
  for (const [theme, weight, keywords] of rules) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) scores[theme] += weight;
    }
  }
  if (/(tion|sion|ment|ity|ness|ance|ence)$/.test(row.word || "")) scores["教育学术"] += 1;
  if (/(ate|ize|ise|fy)$/.test(row.word || "")) scores["行为关系"] += 1;
  if (/(adj\\.|adv\\.)/.test(row.meaning || "")) scores["状态变化"] += 1;
  let best = "状态变化";
  for (const theme of themes) {
    if (scores[theme] > scores[best]) best = theme;
  }
  return best;
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function safeJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function csvRow(row) {
  return [
    row.word,
    row.phonetic,
    row.meaning,
    row.unit,
    row.theme,
    row.root,
    safeJsonArray(row.parts_json).join("|"),
    row.memory,
    safeJsonArray(row.related_json).join("|"),
    row.example_en,
    row.example_zh,
    row.pronunciation_text,
  ].map(csvEscape).join(",");
}

const rows = db.prepare("select word_key, word, meaning, unit, root from words order by sort_order asc, word asc").all();
const update = db.prepare("update words set theme = ?, updated_at = datetime('now') where word_key = ?");

db.exec("begin");
try {
  for (const row of rows) update.run(classify(row), row.word_key);
  db.exec("commit");
} catch (error) {
  db.exec("rollback");
  throw error;
}

const fullRows = db.prepare(`
  select word_key, word, phonetic, meaning, unit, theme, root, parts_json, memory, related_json, example_en, example_zh, pronunciation_text, style, learned, sort_order
  from words
  order by sort_order asc, word asc
`).all();
const csv = `${header.join(",")}\n${fullRows.map(csvRow).join("\n")}\n`;
fs.writeFileSync(path.join(root, "all-words.csv"), csv, "utf8");
fs.writeFileSync(path.join(root, "all-words-data.js"), `window.ALL_WORDS_CSV = ${JSON.stringify(csv)};\n`, "utf8");

const counts = db.prepare("select theme, count(*) as count from words group by theme order by theme").all();
console.log(JSON.stringify({ total: fullRows.length, counts }, null, 2));
db.close();
