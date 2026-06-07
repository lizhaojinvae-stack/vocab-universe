const fs = require("node:fs");

const csvPath = "D:/vocab-universe/all-words.csv";
const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
const lines = text.split(/\r?\n/).filter(Boolean);
const header = lines.shift().split(",");
let pronunciationIndex = header.indexOf("pronunciation_text");
if (pronunciationIndex < 0) {
  header.push("pronunciation_text");
  pronunciationIndex = header.length - 1;
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

function escapeCsv(value) {
  const textValue = String(value ?? "");
  return /[",\n\r]/.test(textValue) ? `"${textValue.replaceAll('"', '""')}"` : textValue;
}

const output = [header.join(",")];
for (const line of lines) {
  const cols = parseLine(line);
  while (cols.length < header.length) cols.push("");
  if ((cols[0] || "").trim().toLowerCase() === "radiat") {
    cols[pronunciationIndex] = "radiate";
  }
  output.push(cols.map(escapeCsv).join(","));
}

const csv = `${output.join("\n")}\n`;
fs.writeFileSync(csvPath, csv, "utf8");
fs.writeFileSync("D:/vocab-universe/all-words-data.js", `window.ALL_WORDS_CSV = ${JSON.stringify(csv)};\n`, "utf8");
