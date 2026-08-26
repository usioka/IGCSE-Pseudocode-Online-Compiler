// Turns one parsed requirement into a readable, literal code snippet showing
// exactly what the watchdog will check for it — the same logic
// checkVerbObject()/RequirementWatchdog in verdict.ts actually executes,
// rendered as source text instead of run silently. Reads VERB_GLOSSARY
// directly from verdict.ts so the snippet can never drift out of sync with
// what really runs. New, independent file; purely a display/teaching aid —
// the returned string is never eval'd or executed, only shown to the user.

import { AutonomousActivityContext, UserInteractionContext } from './generated/RequirementParser';
import { VERB_GLOSSARY } from './verdict';

type RequirementCtx = AutonomousActivityContext | UserInteractionContext;

function verbObjectCheck(verb: string, object: string): string {
  const category = VERB_GLOSSARY[verb.toLowerCase()];

  if (!category) {
    return `  // "${verb}" is not in the watchdog's verb glossary (VERB_GLOSSARY in verdict.ts),
  // so there's nothing to check it against — this comes back inconclusive,
  // not violated, since the requirement may still be met; the interpreter's
  // public surface just can't observe it (e.g. verbs implying a procedure
  // CALL — no CALL hook exists).
  return inconclusive('Verb "${verb}" is not in the glossary.');`;
  }

  const steps = `  const steps = observation.steps
    .map((s) => ({ step: s, value: s.variables.find((v) => v.name === '${object}')?.value }))
    .filter((s) => s.value !== undefined);

  if (steps.length === 0) {
    return violated('"${object}" never appeared in the program\\'s variable state during the run.');
  }
`;

  if (category === 'mutation') {
    return `${steps}
  // "${verb}" → mutation check: did "${object}"'s value actually change?
  const first = steps[0].value;
  const last = steps[steps.length - 1].value;

  return first !== last
    ? satisfied('"${object}" changed from "' + first + '" to "' + last + '".')
    : violated('"${object}" was declared but its value never changed (stayed "' + first + '").');`;
  }

  // category === 'output'
  return `${steps}
  // "${verb}" → output check: was "${object}"'s value ever printed via OUTPUT?
  const wasPrinted = steps.some(({ step, value }) => step.output.some((line) => line.includes(value)));

  return wasPrinted
    ? satisfied('"${object}"\\'s value was printed via OUTPUT during the run.')
    : violated('"${object}" was never printed via OUTPUT during the run.');`;
}

export function generateCheckCode(ctx: RequirementCtx, sourceText: string): string {
  const verb = ctx._verb!.text!;
  const object = ctx._object!.text!;

  if (ctx instanceof UserInteractionContext) {
    return `// Derived from: "${sourceText.trim()}"
// FunktionsMASTeR Type 2 — user interaction

function checkRequirement(observation: RunObservation): Verdict {
  if (observation.inputRequests.length === 0) {
    return violated('The run never requested any input, so no interaction was offered.');
  }

${verbObjectCheck(verb, object)}
}`;
  }

  return `// Derived from: "${sourceText.trim()}"
// FunktionsMASTeR Type 1 — autonomous system activity

function checkRequirement(observation: RunObservation): Verdict {
${verbObjectCheck(verb, object)}
}`;
}
