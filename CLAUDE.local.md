# Bachelor thesis context (personal, not part of the original project)

This file is personal working context for Claude Code in this repo. It is
intentionally untracked (never `git add`ed) so it never shows up as a diff
against the `baseline` tag. `CLAUDE.md` in this repo is the original author's
own documentation and should stay untouched.

## What this repo is, and why it's here

This is a fork of `Sherlemious/IGCSE-Pseudocode-Online-Compiler`, a browser-based
interpreter for Cambridge IGCSE/A-Level pseudocode built with an ANTLR4 grammar,
a tree-walking interpreter, and a Python/flowchart converter pair, all as
separate visitors over the same parse tree.

It is being extended here as part of a bachelor thesis on turning SOPHIST
must-requirements (a requirements-engineering sentence template, subject +
modal verb + verb + object + optional condition) into automated "watchdogs"
that check whether a running pseudocode program actually satisfies a given
must-requirement.

## The one hard constraint

**Do not modify any existing file in this repository.** Every change must be
a new file. This isn't a style preference, it's the thesis's actual research
question (RQ1: how can a third-party compiler whose source cannot be modified
be extended with watchdog functionality), and the license on this repo
explicitly forbids redistributing a modified copy.

New code should live in its own new top-level directory (e.g.
`app/src/watchdog/`), never inside existing files like `core/interpreter.ts`,
`parser.ts`, or the grammar itself.

Before considering any change done, verify it with:
```bash
git diff baseline -- $(git diff baseline --name-only | grep -v '^app/src/watchdog/')
```
This must always come back empty. If it doesn't, something outside the new
code got touched and needs to be undone.

## What's actually being built

1. A small, dedicated grammar for SOPHIST must-requirements written with the
   FunktionsMASTeR template (subject, modal verb, verb, object, optional
   condition). Only must-requirements are in scope, should/will-requirements
   are explicitly out of scope (SOPHIST itself defines only must as the
   mandatory, non-optional type).
2. A parser for that grammar, producing a parse tree, the same way this
   project's own `Pseudocode.g4` produces one for pseudocode.
3. A watchdog: a visitor over that requirement parse tree that, given a run
   of a pseudocode program in this compiler, decides whether that run
   satisfied the requirement. Prefer reusing this project's existing public
   surface (the parse tree, the execution trace, the breakpoint mechanism)
   over building a separate shadow interpreter.
4. The FunktionsMASTeR template defines three requirement types: autonomous
   system activity, user interaction, and interface. The thesis's RQ3 is
   whether all three can actually be turned into a working watchdog, autonomous
   activity should be the easiest (just confirm a piece of the program ran),
   user interaction needs to watch INPUT/OUTPUT points, interface is the
   hardest since this compiler has no model of an external system triggering
   anything, don't assume it's solvable without checking.

## Where the thesis writing lives

The actual thesis document (LaTeX chapters, literature, diagrams) is a
separate, unrelated project at `~/Documents/TUD/Bachelor/overleaf/`. It is not
part of this repo and shouldn't be treated as such, if something here needs
to match what's written there, ask rather than assuming.
