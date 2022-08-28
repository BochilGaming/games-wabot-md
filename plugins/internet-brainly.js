import { Brainly } from "brainly-scraper-v2";
const brainly = new Brainly("id");

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Example use ${usedPrefix}${command} apa itu javascript`;
  let res = await brainly.search(text, "id");
  let answer = res
    .map(
      ({ question, answers }, i) => `
_*PERTANYAAN KE ${i + 1}*_
${formatTags(question.content)}${question.closed ? " *(Terjawab)*" : ""}\n${
        "```" + question.education
      }•${question.grade + "```"}\nbrainly.co.id/tugas/${
        question.id
      }\n\n${answers.map(
        (v, i) => `
*JAWABAN KE ${i + 1}*${v.confirmed ? " *(Verified)*" : ""}${
          v.isBest ? " (Terpilih)" : ""
        }
${formatTags(v.content)}
*Terima kasih ${v.thanksCount}* (${v.ratesCount} pilih)\n`
      ).join``}`
    )
    .join(`\n\n\n`);
  m.reply(answer);
};
handler.help = ["brainly <soal>"];
handler.tags = ["internet"];
handler.command = /^brainly$/i;

export default handler;

function formatTags(str) {
  let tagRegex = /<(.+?)>((?:.|\n)*?)<\/\1>/gi;
  let replacer = (_, tag, inner) => {
    let a = inner.replace(tagRegex, replacer);
    let b = "";
    switch (tag) {
      case "p":
        a += "\n";
        break;
      case "i":
        b = "_";
      case "strikethrough":
        b = "~";
      case "strong":
        b = "*";
        a = a
          .split("\n")
          .map((a) => (a ? b + a + b : a))
          .join("\n");
        break;
    }
    return a;
  };

  return str
    .replace(/<br *?\/?>/gi, "\n")
    .replace(tagRegex, replacer)
    .trim();
}
