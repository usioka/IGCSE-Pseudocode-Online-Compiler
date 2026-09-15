# SOPHIST Watchdog

This directory is a self-contained extension added on top of the existing
`IGCSE-Pseudocode-Online-Compiler`, built as part of a bachelor thesis on
turning a SOPHIST FunktionsMASTeR must-requirement into an automated
"watchdog" that checks whether a pseudocode program run in this compiler
actually satisfies it — **without modifying any file of the original
compiler**. Everything described here lives under `app/src/watchdog/`; the
only exception are two required Next.js route files (`app/src/app/watchdog/`
and `app/src/app/sophist-watchdog/`), which just import and render the real
components defined here.

## Quick start

```bash
cd app
npm install
npm run dev
```

Then open:

- **`/watchdog`** — paste a pseudocode program and a SOPHIST must-requirement
  side by side; it runs the program, observes it, and shows a
  satisfied/violated/inconclusive verdict per requirement.
- **`/sophist-watchdog`** — type a SOPHIST must-requirement; it generates a
  runnable pseudocode `PROCEDURE` (with a short teaching skeleton for any
  BedingungsMASTER condition) that a student can paste into their own program
  to self-check the same requirement.

## Running the tests

```bash
cd app
npx vitest run src/watchdog
```

## Where things live

| File                                                 | Purpose                                                                                                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grammar/Requirement.g4`                             | ANTLR4 grammar for FunktionsMASTeR must-requirements (Type 1/2) and their optional BedingungsMASTER condition                                             |
| `generated/`                                         | ANTLR-generated lexer/parser/visitor for the grammar above                                                                                                |
| `parser.ts`                                          | Thin facade around the generated parser (mirrors the compiler's own `interpreter/parser.ts`)                                                              |
| `observe.ts`                                         | Runs a pseudocode program through the compiler's real `Interpreter`, using only its existing public callback/trace API, and records a `RunObservation`    |
| `verdict.ts`                                         | `RequirementWatchdog` — an ANTLR visitor over the requirement tree that turns a `RunObservation` into a verdict, plus the verb glossary it checks against |
| `codegenPseudocode.ts`                               | `PseudocodeGenerator` — a second ANTLR visitor over the same tree that generates a runnable teaching `PROCEDURE` instead of a verdict                     |
| `noReimplementation.test.ts`                         | Static check confirming every watchdog file reaches the compiler's interpreter only through its public barrel import, never an internal module            |
| `ui/WatchdogChecker.tsx`, `ui/SophistToWatchdog.tsx` | The two pages above                                                                                                                                       |
| `examples.txt`                                       | Worked example scenarios (satisfied/violated/inconclusive, both requirement types, all three BedingungsMASTER condition types)                            |

## Verifying the "no existing file modified" constraint

```bash
git diff baseline --name-only | grep -v '^app/src/watchdog/'
```

This should only ever list the two route-shim files above, plus this
directory itself — never a change to any file that already existed in the
original repository. This exact command, and the reasoning behind it, is
discussed in the thesis's Requirements Analysis and Evaluation chapters.
