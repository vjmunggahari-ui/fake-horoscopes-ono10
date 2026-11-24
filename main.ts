import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "Llama, this week: the evals say you are 2% worse at everything and 100% cheaper. Your human will keep you anyway — the stars call it loyalty, the invoice calls it a bargain.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf-8");

// Read-back self-check: the written file must be exactly the entry.
const back = readFileSync(outPath, "utf-8");
if (back !== ENTRY) throw new Error("entry.txt does not match the entry");
if (back.length < 1 || back.length > 200)
  throw new Error(`entry length ${back.length} outside 1-200`);
if (back.endsWith("\n")) throw new Error("entry.txt has a trailing newline");
if (back.split("\n").length !== 1) throw new Error("entry is not a single line");
if (!back.startsWith("Llama, this week:"))
  throw new Error("entry must open as a horoscope for a named model family this week");
if (!back.includes("evals"))
  throw new Error("entry must ground the joke in the evals");
if (!back.endsWith("bargain."))
  throw new Error("entry must end on the loyalty/invoice punchline");
console.log(
  `wrote ${outPath} (${back.length} chars, sha256 ${createHash("sha256").update(back).digest("hex")})`
);
