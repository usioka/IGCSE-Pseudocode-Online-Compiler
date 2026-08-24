// The watchdog itself: a visitor over the Requirement.g4 parse tree that
// decides whether a RunObservation (see observe.ts) satisfies a FunktionsMASTeR
// must-requirement — Type 1 ("autonomous system activity") or Type 2 ("user
// interaction").
//
// What's checkable, and why: the interpreter's public surface (see the
// header comment in observe.ts) exposes no CALL hook and no assignment hook —
// only per-statement variable snapshots (DebugVariable[]), OUTPUT text, and
// (as of Type 2) which variables were the target of an INPUT request. So this
// watchdog can only verify two kinds of verb, not arbitrary ones:
//
//   - "mutation" verbs (calculate, update, set, ...): satisfied if the
//     object's value differs between its first and last appearance in the
//     trace — i.e. something in the run actually wrote to it.
//   - "output" verbs (output, display, print, ...): satisfied if the
//     object's current value shows up in an OUTPUT at the same step.
//
// A verb outside VERB_GLOSSARY (below), most obviously anything implying a
// procedure/function CALL (invoke, call, run, execute, trigger), cannot be
// checked at all with this interpreter's current public surface and comes
// back 'inconclusive', not 'violated' — the requirement may well be met, the
// watchdog just has no way to observe it. This is a real, documented finding
// for RQ3, not a placeholder to fix later: verifying call-based requirements
// would need a hook the interpreter doesn't expose, and adding one means
// editing core/interpreter.ts, which the thesis's constraint (see
// CLAUDE.local.md) rules out.
//
// Type 2 ("user interaction") reuses the exact same verb/object check as
// Type 1, plus one extra condition: the run must contain at least one INPUT
// request, evidence the program actually offered *some* interaction. This is
// a coarse check, not tied to the specific recipient or object — the
// interpreter has no model of *who* is providing input, so "did the
// authorized person specifically get offered this" isn't something a
// watchdog built on this public surface can verify, only "was an
// opportunity to interact offered at all." Ordering (did the input happen
// before the object changed) isn't checked either, for the same reason
// Type 1 doesn't check *which* statement caused a mutation — this watchdog
// works off run-wide evidence, not fine-grained causality.
//
// The leading `If <condition>,` clause is parsed by the grammar but not
// evaluated here — a free-text natural-language condition can't be checked
// automatically without deeper semantic binding than this pass attempts;
// per SOPHIST itself, "the template only fixes the syntax, not the
// semantics." A conditioned requirement is checked as if unconditional.

import type { DebugVariable } from '../interpreter';
import { RequirementVisitor } from './generated/RequirementVisitor';
import { AutonomousActivityContext, DocumentContext, UserInteractionContext } from './generated/RequirementParser';
import { ObservedStep, RunObservation } from './observe';

export type VerdictStatus = 'satisfied' | 'violated' | 'inconclusive';

export interface Verdict {
  status: VerdictStatus;
  reason: string;
}

type VerbCategory = 'output' | 'mutation';

/**
 * Small, deliberately explicit glossary (SOPHIST itself recommends collecting
 * requirement verbs in a glossary with a defined meaning — see
 * foundation_sophist.txt). Lower-case; lookup is case-insensitive.
 */
export const VERB_GLOSSARY: Record<string, VerbCategory> = {
  output: 'output',
  display: 'output',
  print: 'output',
  show: 'output',
  report: 'output',
  log: 'output',

  calculate: 'mutation',
  compute: 'mutation',
  update: 'mutation',
  set: 'mutation',
  determine: 'mutation',
  generate: 'mutation',
  assign: 'mutation',
  increment: 'mutation',
  modify: 'mutation',
  open: 'mutation',
};

function satisfied(reason: string): Verdict {
  return { status: 'satisfied', reason };
}
function violated(reason: string): Verdict {
  return { status: 'violated', reason };
}
function inconclusive(reason: string): Verdict {
  return { status: 'inconclusive', reason };
}

/** Combines per-requirement verdicts for a document: worst status wins. */
function combine(verdicts: Verdict[]): Verdict {
  if (verdicts.length === 0) return inconclusive('Document contained no must-requirements.');
  const violation = verdicts.find((v) => v.status === 'violated');
  if (violation) return violation;
  const unknown = verdicts.find((v) => v.status === 'inconclusive');
  if (unknown) return unknown;
  return satisfied(verdicts.map((v) => v.reason).join(' '));
}

/** The verb/object check shared by Type 1 and Type 2. */
function checkVerbObject(verbText: string, object: string, observation: RunObservation): Verdict {
  const category = VERB_GLOSSARY[verbText.toLowerCase()];
  if (!category) {
    return inconclusive(
      `Verb "${verbText}" is not in the watchdog's glossary, so it's unknown what to check for "${object}".`,
    );
  }

  const objectSteps = observation.steps
    .map((step) => ({ step, variable: step.variables.find((v) => v.name === object) }))
    .filter((entry): entry is { step: ObservedStep; variable: DebugVariable } => entry.variable !== undefined);

  if (objectSteps.length === 0) {
    return violated(`"${object}" never appeared in the program's variable state during the run.`);
  }

  if (category === 'mutation') {
    const first = objectSteps[0].variable.value;
    const last = objectSteps[objectSteps.length - 1].variable.value;
    return first !== last
      ? satisfied(`"${object}" changed from "${first}" to "${last}" during the run, consistent with "${verbText}".`)
      : violated(`"${object}" was declared but its value never changed during the run (stayed "${first}").`);
  }

  // category === 'output'
  const wasPrinted = objectSteps.some(({ step, variable }) => step.output.some((line) => line.includes(variable.value)));
  return wasPrinted
    ? satisfied(`"${object}"'s value was printed via OUTPUT during the run, consistent with "${verbText}".`)
    : violated(`"${object}" was never printed via OUTPUT during the run.`);
}

export class RequirementWatchdog extends RequirementVisitor<Verdict> {
  constructor(private observation: RunObservation) {
    super();
  }

  protected override defaultResult(): Verdict {
    return inconclusive('Nothing to check.');
  }

  override visitDocument = (ctx: DocumentContext): Verdict => {
    return combine(ctx.requirement().map((req) => this.visit(req) ?? this.defaultResult()));
  };

  override visitAutonomousActivity = (ctx: AutonomousActivityContext): Verdict => {
    if (!this.observation.completed && this.observation.error) {
      return violated(`The run did not complete: ${this.observation.error.message}`);
    }
    return checkVerbObject(ctx._verb!.text!, ctx._object!.text!, this.observation);
  };

  override visitUserInteraction = (ctx: UserInteractionContext): Verdict => {
    if (!this.observation.completed && this.observation.error) {
      return violated(`The run did not complete: ${this.observation.error.message}`);
    }
    if (this.observation.inputRequests.length === 0) {
      return violated('The run never requested any input, so no interaction was offered.');
    }
    return checkVerbObject(ctx._verb!.text!, ctx._object!.text!, this.observation);
  };
}

export function checkRequirementDocument(tree: DocumentContext, observation: RunObservation): Verdict {
  return new RequirementWatchdog(observation).visitDocument(tree);
}
