import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One sentence, at most 200 characters: a small moment of wonder
// in everyday life. The mirror shows a stranger, then remembers.
const LINE =
  "The hallway mirror showed me a stranger for half a second before it remembered my face.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// The brief asks for one sentence: exactly one sentence terminator,
// and it must close the line.
const terminators = (LINE.match(/[.!?]/g) ?? []).length;
if (terminators !== 1 || !/[.!?]$/.test(LINE)) {
  throw new Error("entry must be exactly one sentence");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what we wrote back must match exactly.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip mismatch");
}
console.log(`wrote ${outPath} (${LINE.length} characters)`);
