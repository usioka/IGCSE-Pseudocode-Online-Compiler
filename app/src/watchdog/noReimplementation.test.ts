import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// FR4 / AC4-FR4: every observation the watchdog makes about a running
// pseudocode program must trace back to a call into the IGCSE compiler's own
// exported interpreter API, not an independent reimplementation of
// tokenizing, parsing, or executing pseudocode. This is checked statically
// rather than only "by eye": any watchdog source file that imports from the
// interpreter must do so through its public barrel (`.../interpreter`),
// never by reaching into an internal module such as
// `.../interpreter/core/interpreter` or `.../interpreter/parser`, which
// would be the first sign of a shadow implementation growing outside the
// compiler's own maintained code.

const WATCHDOG_ROOT = join(__dirname);
const INTERPRETER_IMPORT = /from\s+["']([^"']*interpreter[^"']*)["']/g;
const ALLOWED_INTERPRETER_IMPORT = /^(\.\.\/)+interpreter$/;

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "generated" || entry === "grammar" || entry === "node_modules") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) {
      files.push(full);
    }
  }
  return files;
}

describe("AC4-FR4 — no reimplementation of pseudocode tokenizing/parsing/execution", () => {
  it("every watchdog source file imports the interpreter only through its public barrel, never an internal module", () => {
    const offenders: string[] = [];
    for (const file of collectSourceFiles(WATCHDOG_ROOT)) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(INTERPRETER_IMPORT)) {
        const importPath = match[1];
        if (!ALLOWED_INTERPRETER_IMPORT.test(importPath)) {
          offenders.push(`${relative(WATCHDOG_ROOT, file)}: imports "${importPath}"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("sanity check: the allowed-import regex actually matches the real barrel paths in use", () => {
    // Guards against the check above passing only because it never matched
    // anything at all (e.g. after a refactor breaks the regex silently).
    const matchedFiles: string[] = [];
    for (const file of collectSourceFiles(WATCHDOG_ROOT)) {
      const source = readFileSync(file, "utf8");
      if (/from\s+["'](\.\.\/)+interpreter["']/.test(source)) {
        matchedFiles.push(relative(WATCHDOG_ROOT, file));
      }
    }
    expect(matchedFiles.length).toBeGreaterThan(0);
  });
});
