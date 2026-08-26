'use client';

// SOPHIST → watchdog page: a requirement goes in on the left; the right side
// shows an actual runnable IGCSE pseudocode PROCEDURE generatePseudocodeWatchdog()
// (codegenPseudocode.ts) derives from it — paste it into any program and CALL
// it once, and it prints SATISFIED/VIOLATED as ordinary OUTPUT. No separate
// verdict harness runs on this page: clicking Run just executes the
// pseudocode program for real (parse + Interpreter, same pipeline the main
// compiler uses) and shows its output, which includes whatever the
// generated procedure itself printed. Distinct from ui/WatchdogChecker.tsx
// (pseudocode-first, checked from outside via observe.ts/verdict.ts).

import { useMemo, useState } from 'react';
import { parseRequirement } from '../parser';
import { parse as parsePseudocode, Interpreter, PseudocodeError } from '../../interpreter';
import { generatePseudocodeWatchdog } from '../codegenPseudocode';
import { AutonomousActivityContext, UserInteractionContext } from '../generated/RequirementParser';

const DEFAULT_REQUIREMENT = 'The System must calculate Total.';

interface GeneratedEntry {
  text: string;
  code: string;
  example: string;
}

function defaultExample(): string {
  const { tree } = parseRequirement(DEFAULT_REQUIREMENT);
  const req = tree.requirement(0) as AutonomousActivityContext;
  return generatePseudocodeWatchdog(req, DEFAULT_REQUIREMENT).example;
}

export default function SophistToWatchdog() {
  const [requirement, setRequirement] = useState(DEFAULT_REQUIREMENT);
  const [pseudocode, setPseudocode] = useState(defaultExample);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string[] | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const generated = useMemo(() => {
    const { tree, errors } = parseRequirement(requirement);
    if (errors.length > 0) {
      return { errors: errors.map((e) => `Line ${e.line}, col ${e.column}: ${e.message}`), entries: [] as GeneratedEntry[] };
    }
    const entries = tree.requirement().map((req) => {
      const { code, example } = generatePseudocodeWatchdog(req as AutonomousActivityContext | UserInteractionContext, requirement);
      return { text: requirement.slice(req.start!.start, req.stop!.stop + 1), code, example };
    });
    return { errors: [] as string[], entries };
  }, [requirement]);

  function useExample() {
    if (generated.entries.length > 0) setPseudocode(generated.entries[0].example);
  }

  async function handleRun() {
    setRunning(true);
    setOutput(null);
    setRunError(null);
    try {
      const { tree, errors } = parsePseudocode(pseudocode);
      if (!tree || errors.length > 0) {
        setRunError(errors[0]?.message ?? 'Failed to parse pseudocode.');
        return;
      }
      const collected: string[] = [];
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const interpreter = new Interpreter(
        {
          onOutput: (text) => collected.push(text),
          onInputRequest: () => queueMicrotask(() => interpreter.provideInput('')),
          onInputComplete: () => {},
          onComplete: () => {},
          onError: () => {},
        },
        controller.signal,
      );
      try {
        await interpreter.execute(tree);
      } catch (e) {
        if (e instanceof PseudocodeError) {
          setRunError(e.line != null ? `Line ${e.line} — ${e.message}` : e.message);
        } else {
          setRunError(e instanceof Error ? e.message : 'The program failed to run.');
        }
      } finally {
        clearTimeout(timeout);
      }
      setOutput(collected);
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="h-full overflow-y-auto bg-background text-light-text px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">SOPHIST → Watchdog</h1>
          <p className="text-dark-text text-sm mt-1">
            Write a SOPHIST must-requirement on the left. The right side shows an actual runnable
            pseudocode PROCEDURE — paste it into a program, wire it up per the comments, and it
            prints SATISFIED/VIOLATED itself when you run the program in the real compiler. No
            external checker: the check <em>is</em> the pseudocode.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-dark-text">SOPHIST requirement</label>
            <textarea
              className="w-full h-40 bg-code-bg border border-border rounded p-3 font-mono text-sm text-code-text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              spellCheck={false}
            />
            <p className="text-xs text-dark-text mt-1">
              Type 1: [If &lt;condition&gt;,] &lt;subject&gt; must &lt;verb&gt; &lt;object&gt;.
              <br />
              Type 2: [If &lt;condition&gt;,] &lt;subject&gt; must offer &lt;recipient&gt; the
              possibility to &lt;verb&gt; &lt;object&gt;.
            </p>

            {generated.errors.length > 0 && (
              <div className="border border-error rounded p-3 text-error text-sm mt-3">
                <p className="font-medium mb-1">Failed to parse:</p>
                <ul className="list-disc list-inside">
                  {generated.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-dark-text">Generated pseudocode watchdog</label>
              {generated.entries.length > 0 && (
                <button onClick={useExample} className="text-xs text-primary hover:underline cursor-pointer">
                  Load runnable example below ↓
                </button>
              )}
            </div>
            <div className="h-40 overflow-y-auto bg-code-bg border border-border rounded p-3">
              {generated.entries.map((entry, i) => (
                <pre key={i} className="font-mono text-xs text-code-text whitespace-pre-wrap mb-4 last:mb-0">
                  {entry.code}
                </pre>
              ))}
              {generated.entries.length === 0 && generated.errors.length === 0 && (
                <p className="text-xs text-dark-text">Nothing to generate yet.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-dark-text">
            Pseudocode (paste your program with the watchdog wired in, or load the example above)
          </label>
          <textarea
            className="w-full h-64 bg-code-bg border border-border rounded p-3 font-mono text-sm text-code-text"
            value={pseudocode}
            onChange={(e) => setPseudocode(e.target.value)}
            spellCheck={false}
          />
        </div>

        <button
          onClick={handleRun}
          disabled={running || !pseudocode.trim()}
          className="bg-primary text-on-primary px-4 py-2 rounded font-medium disabled:opacity-50 cursor-pointer"
        >
          {running ? 'Running…' : 'Run pseudocode'}
        </button>

        {runError && <div className="border border-error rounded p-3 text-error text-sm">{runError}</div>}

        {output && (
          <div>
            <p className="text-sm text-dark-text mb-1">Program output:</p>
            <div className="bg-code-bg border border-border rounded p-3 font-mono text-sm space-y-1">
              {output.length === 0 && <p className="text-dark-text">(no output)</p>}
              {output.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith('SATISFIED:')
                      ? 'text-success'
                      : line.startsWith('VIOLATED:')
                        ? 'text-error'
                        : 'text-code-text'
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
