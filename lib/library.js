// Stan's library (admin → Stan → Library): the agency's own documents. Each one
// is markdown in docs/ (or built from data, like the attack history) and is
// rendered to PDF when opened, so a PDF always matches the code it describes.
// Only documents kept in this repository are listed: the wallet, the Bitcoin
// manuals, the talks and the rebuild guide live with the main site.
// docs/ is never served as files (docs/.htaccess); only the admin API reads it.
import fs from "node:fs";
import path from "node:path";
import { markdownToPdf } from "./pdf.js";
import { BITCOIN_ATTACKS } from "../data/bitcoin-attacks.js";

const DOCS = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "docs");

export const LIBRARY = [
  { id: "overview", group: "Recreate the system", title: "System overview", file: "system-overview.md", summary: "What Altradits is, every part of it, and how a request flows through the system." },
  { id: "payments", group: "Recreate the system", title: "Payments, receipts and the books", file: "payments.md", summary: "Orders, Lightning and on-chain payments, confirmations, held payments, receipts and statements." },
  { id: "agents", group: "Recreate the system", title: "AI departments, Stan and the marketing team", file: "agents.md", summary: "How work is routed, done, checked by Stan's QA panel and delivered; marketing, learning and the inboxes." },
  { id: "faq", group: "Recreate the system", title: "Quick answers", file: "faq.md", summary: "Short answers to the questions that come up about the system, with where to look." },
  { id: "security", group: "Security", title: "Security handbook", file: "security-handbook.md", summary: "Every defence, the build gates, the audits, the Security watch and what to do in an incident." },
  { id: "attacks", group: "Security", title: "Bitcoin's attack history and our guards", build: attackHistory, summary: "Each major attack in Bitcoin's history, its lesson, and how this system guards against it." },
  { id: "contributing", group: "Contributing and review", title: "How to contribute (the Bitcoin Core way)", file: "../CONTRIBUTING.md", summary: "Roles, one topic per PR, commit messages, tests, review terms (Concept ACK, tested ACK, NACK), when to merge, signing and trust." },
  { id: "review-guide", group: "Contributing and review", title: "How to review a change", file: "review-guide.md", summary: "The seven review passes, commands, the security checklist, reviewing your own work, and case studies from this project." },
  { id: "security-policy", group: "Contributing and review", title: "Security policy", file: "../SECURITY.md", summary: "How to report a vulnerability privately, what happens next, scope and testing rules." },
];

const letterhead = (title) => ({ lines: ["Altradits Library", "altradits.com"], footer: `${title} · generated ${new Date().toISOString().slice(0, 10)}`, url: "https://altradits.com" });

export const libraryList = () => LIBRARY.map(({ id, group, title, summary, pdf }) => ({ id, group, title, summary, original: Boolean(pdf) }));

// The markdown behind a document (null for the original whitepaper).
export function docMarkdown(id) {
  const d = LIBRARY.find((x) => x.id === id);
  if (!d || d.pdf) return null;
  return d.build ? d.build() : fs.readFileSync(path.join(DOCS, d.file), "utf8");
}

// { name, body } of the PDF, or null for an unknown id.
export function docPdf(id) {
  const d = LIBRARY.find((x) => x.id === id);
  if (!d) return null;
  const name = `altradits-${d.id}.pdf`;
  if (d.pdf) return { name, body: fs.readFileSync(path.join(DOCS, d.pdf)) };
  return { name, body: markdownToPdf(docMarkdown(id), d.title, { letterhead: letterhead(d.title) }) };
}

function attackHistory() {
  const label = { guarded: "Guarded", watch: "Guarded, keep current", action: "Needs action" };
  const lines = [
    "# Bitcoin's attack history and our guards",
    "Every major attack in Bitcoin's history taught a lesson. This is each one, what it means for Altradits, and the guard in place. Status: Guarded (in the code and tested), Guarded, keep current (depends on updates), Needs action (see Your node today).",
    "",
    `> ${BITCOIN_ATTACKS.filter((a) => a.status === "action").length} need action, ${BITCOIN_ATTACKS.filter((a) => a.status === "watch").length} need keeping current, ${BITCOIN_ATTACKS.filter((a) => a.status === "guarded").length} are guarded.`,
  ];
  for (const a of [...BITCOIN_ATTACKS].sort((x, y) => x.year - y.year)) {
    lines.push("", `## ${a.year}: ${a.name}`, `**${label[a.status]}**`, "", a.what, "", `- Lesson: ${a.lesson}`, `- Our guard: ${a.guard}`);
  }
  return lines.join("\n");
}
