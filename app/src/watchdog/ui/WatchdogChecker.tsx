"use client";

import { useState } from "react";
import { parseRequirement } from "../parser";
import { observeRun, RunObservation } from "../observe";
import {
  RequirementWatchdog,
  Verdict,
  checkRequirementDocument,
} from "../verdict";

const DEFAULT_PSEUDOCODE = `DECLARE Total : INTEGER
Total <- 0
FOR i <- 1 TO 5
  Total <- Total + i
NEXT i
OUTPUT Total
`;

const DEFAULT_REQUIREMENT = "The System must calculate Total.";

interface PerRequirementResult {
  text: string;
  verdict: Verdict;
}

interface CheckResult {
  requirementErrors: string[];
  perRequirement: PerRequirementResult[];
  combined: Verdict | null;
  observation: RunObservation;
}

const STATUS_STYLES: Record<Verdict["status"], string> = {
  satisfied: "text-success border-success",
  violated: "text-error border-error",
  inconclusive: "text-warning border-warning",
};

export default function WatchdogChecker() {
  const [pseudocode, setPseudocode] = useState(DEFAULT_PSEUDOCODE);
  const [requirement, setRequirement] = useState(DEFAULT_REQUIREMENT);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    try {
      const { tree, errors } = parseRequirement(requirement);
      const observation = await observeRun(pseudocode);

      if (errors.length > 0) {
        setResult({
          requirementErrors: errors.map(
            (e) => `Line ${e.line}, col ${e.column}: ${e.message}`,
          ),
          perRequirement: [],
          combined: null,
          observation,
        });
        return;
      }

      const watchdog = new RequirementWatchdog(observation);
      const perRequirement = tree.requirement().map((req) => ({
        text: requirement.slice(req.start!.start, req.stop!.stop + 1),
        verdict: watchdog.visit(req) ?? {
          status: "inconclusive" as const,
          reason: "Nothing to check.",
        },
      }));
      const combined = checkRequirementDocument(tree, observation);

      setResult({
        requirementErrors: [],
        perRequirement,
        combined,
        observation,
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="h-full overflow-y-auto bg-background text-light-text px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Watchdog Checker
          </h1>
          <p className="text-dark-text text-sm mt-1">
            Pseudocode on the left, a SOPHIST must-requirement (FunktionsMASTeR
            Type 1 — autonomous system activity) on the right. Run checks
            whether the program run satisfies it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-dark-text">
              Pseudocode
            </label>
            <textarea
              className="w-full h-64 bg-code-bg border border-border rounded p-3 font-mono text-sm text-code-text"
              value={pseudocode}
              onChange={(e) => setPseudocode(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-dark-text">
              SOPHIST requirement
            </label>
            <textarea
              className="w-full h-64 bg-code-bg border border-border rounded p-3 font-mono text-sm text-code-text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              spellCheck={false}
            />
            <p className="text-xs text-dark-text mt-1">
              Type 1: [If &lt;condition&gt;,] &lt;subject&gt; must &lt;verb&gt;
              &lt;object&gt;.
              <br />
              Type 2: [If &lt;condition&gt;,] &lt;subject&gt; must offer
              &lt;recipient&gt; the possibility to &lt;verb&gt; &lt;object&gt;.
              <br />
              One per line for multiple requirements. verb/object must each be a
              single identifier (no spaces) — e.g. &quot;output Total&quot;, not
              &quot;output the total&quot;.
            </p>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={checking}
          className="bg-primary text-on-primary px-4 py-2 rounded font-medium disabled:opacity-50 cursor-pointer"
        >
          {checking ? "Checking…" : "Run watchdog"}
        </button>

        {result && (
          <div className="space-y-4 border-t border-border pt-4">
            {result.requirementErrors.length > 0 && (
              <div className="border border-error rounded p-3 text-error text-sm">
                <p className="font-medium mb-1">Requirement failed to parse:</p>
                <ul className="list-disc list-inside">
                  {result.requirementErrors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {!result.observation.completed && result.observation.error && (
              <div className="border border-error rounded p-3 text-error text-sm">
                Program did not complete: {result.observation.error.message}
                {result.observation.error.line != null
                  ? ` (line ${result.observation.error.line})`
                  : ""}
              </div>
            )}

            {result.perRequirement.map((r, i) => (
              <div
                key={i}
                className={`border rounded p-3 ${STATUS_STYLES[r.verdict.status]}`}
              >
                <p className="font-mono text-sm text-light-text">{r.text}</p>
                <p className="text-sm mt-1 uppercase tracking-wide font-semibold">
                  {r.verdict.status}
                </p>
                <p className="text-sm mt-1">{r.verdict.reason}</p>
              </div>
            ))}

            {result.combined && (
              <div
                className={`border-2 rounded p-3 ${STATUS_STYLES[result.combined.status]}`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Overall: {result.combined.status}
                </p>
              </div>
            )}

            {result.observation.fullOutput && (
              <div>
                <p className="text-sm text-dark-text mb-1">Program output:</p>
                <pre className="bg-code-bg border border-border rounded p-3 text-sm text-code-text whitespace-pre-wrap">
                  {result.observation.fullOutput}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
