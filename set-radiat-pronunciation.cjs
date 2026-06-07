const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("D:/vocab-universe/data/vocab.sqlite");
const columns = db.prepare("pragma table_info(words)").all().map((column) => column.name);
if (!columns.includes("pronunciation_text")) {
  db.exec("alter table words add column pronunciation_text text not null default ''");
}
db.prepare("update words set pronunciation_text = ? where word_key = ?").run("radiate", "radiat");
console.log(db.prepare("select word_key, word, phonetic, pronunciation_text from words where word_key = ?").get("radiat"));
db.close();
