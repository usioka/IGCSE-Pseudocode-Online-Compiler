// The watchdog itself: a visitor over the Requirement.g4 parse tree that
// decides whether a RunObservation (see observe.ts) satisfies a FunktionsMASTeR
// must-requirement — Type 1 ("autonomous system activity") or Type 2 ("user
// interaction").
//
// What's checkable, and why: the interpreter's public surface (see the
// header comment in observe.ts) exposes no CALL hook and no assignment hook —
// only per-statement variable snapshots (DebugVariable[]), OUTPUT text, and
// (as of Type 2) which variables were the target of an INPUT request. Every
// verb category below is, in the end, some predicate over that same data —
// there's no richer signal to draw on, only different questions to ask of it.
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
// Categories are registered in CATEGORY_CHECKS, each a standalone function
// over (object, observation). Adding a new one never touches the existing
// ones — write the function, add it to CATEGORY_CHECKS, point glossary
// entries at its key. VERB_GLOSSARY's value type is `keyof typeof
// CATEGORY_CHECKS`, so a typo'd or unregistered category name is a compile
// error, not a silent no-op.
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

function satisfied(reason: string): Verdict {
  return { status: 'satisfied', reason };
}
function violated(reason: string): Verdict {
  return { status: 'violated', reason };
}
function inconclusive(reason: string): Verdict {
  return { status: 'inconclusive', reason };
}

/** Every step where `object` appears, paired with its variable snapshot at that step. */
function objectSteps(object: string, observation: RunObservation): { step: ObservedStep; variable: DebugVariable }[] {
  return observation.steps
    .map((step) => ({ step, variable: step.variables.find((v) => v.name === object) }))
    .filter((entry): entry is { step: ObservedStep; variable: DebugVariable } => entry.variable !== undefined);
}

/** mutation: did the object's value differ at all between its first and last appearance. */
function checkMutation(object: string, observation: RunObservation): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(`"${object}" never appeared in the program's variable state during the run.`);
  }
  const first = steps[0].variable.value;
  const last = steps[steps.length - 1].variable.value;
  return first !== last
    ? satisfied(`"${object}" changed from "${first}" to "${last}" during the run.`)
    : violated(`"${object}" was declared but its value never changed during the run (stayed "${first}").`);
}

/** output: did the object's value ever show up in an OUTPUT at the same step. */
function checkOutput(object: string, observation: RunObservation): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(`"${object}" never appeared in the program's variable state during the run.`);
  }
  const wasPrinted = steps.some(({ step, variable }) => step.output.some((line) => line.includes(variable.value)));
  return wasPrinted
    ? satisfied(`"${object}"'s value was printed via OUTPUT during the run.`)
    : violated(`"${object}" was never printed via OUTPUT during the run.`);
}

/**
 * increase/decrease: like mutation, but the first-vs-last comparison is
 * numeric and directional, not just "differs" — increment/grow only count
 * if the value actually went up, decrement/reduce only if it went down.
 * Falls back to inconclusive (not violated) when the value isn't numeric,
 * since direction genuinely can't be judged then — that's a limit of the
 * object's type, not evidence against the requirement.
 */
function checkDirectional(object: string, observation: RunObservation, direction: 'increase' | 'decrease'): Verdict {
  const article = direction === 'increase' ? 'an' : 'a';
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(`"${object}" never appeared in the program's variable state during the run.`);
  }
  const firstText = steps[0].variable.value;
  const lastText = steps[steps.length - 1].variable.value;
  const first = Number(firstText);
  const last = Number(lastText);
  if (Number.isNaN(first) || Number.isNaN(last)) {
    return inconclusive(
      `"${object}"'s value ("${firstText}" → "${lastText}") isn't numeric, so ${article} ${direction} can't be checked.`,
    );
  }
  const moved = direction === 'increase' ? last > first : last < first;
  return moved
    ? satisfied(`"${object}" ${direction}d from ${first} to ${last} during the run.`)
    : violated(`"${object}" went from ${first} to ${last} during the run, which is not ${article} ${direction}.`);
}

/**
 * targetValue: did the object ever reach a specific fixed value (default
 * "TRUE", matching how the interpreter itself stringifies BOOLEAN — see
 * toString() in core/values.ts) at any point in the run, not just at the end.
 * For verbs like confirm/validate/flag/mark, which are naturally about a
 * flag becoming true rather than "changed" or "was printed."
 */
function checkTargetValue(object: string, observation: RunObservation, target = 'TRUE'): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(`"${object}" never appeared in the program's variable state during the run.`);
  }
  const reached = steps.some(({ variable }) => variable.value.toUpperCase() === target);
  const lastSeen = steps[steps.length - 1].variable.value;
  return reached
    ? satisfied(`"${object}" reached the value "${target}" during the run.`)
    : violated(`"${object}" never became "${target}" during the run (last seen as "${lastSeen}").`);
}

const CATEGORY_CHECKS = {
  mutation: checkMutation,
  output: checkOutput,
  increase: (object: string, observation: RunObservation) => checkDirectional(object, observation, 'increase'),
  decrease: (object: string, observation: RunObservation) => checkDirectional(object, observation, 'decrease'),
  targetValue: (object: string, observation: RunObservation) => checkTargetValue(object, observation),
} satisfies Record<string, (object: string, observation: RunObservation) => Verdict>;

export type VerbCategory = keyof typeof CATEGORY_CHECKS;

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
  modify: 'mutation',
  open: 'mutation',

  increment: 'increase',
  increase: 'increase',
  grow: 'increase',
  raise: 'increase',

  decrement: 'decrease',
  decrease: 'decrease',
  reduce: 'decrease',
  shrink: 'decrease',
  lower: 'decrease',

  confirm: 'targetValue',
  validate: 'targetValue',
  flag: 'targetValue',
  mark: 'targetValue',
};

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
  return CATEGORY_CHECKS[category](object, observation);
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
