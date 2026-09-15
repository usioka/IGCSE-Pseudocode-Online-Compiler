import type { DebugVariable } from "../interpreter";
import { RequirementVisitor } from "./generated/RequirementVisitor";
import {
  AutonomousActivityContext,
  DocumentContext,
  UserInteractionContext,
} from "./generated/RequirementParser";
import { ObservedStep, RunObservation } from "./observe";

export type VerdictStatus = "satisfied" | "violated" | "inconclusive";

export interface Verdict {
  status: VerdictStatus;
  reason: string;
}

function satisfied(reason: string): Verdict {
  return { status: "satisfied", reason };
}
function violated(reason: string): Verdict {
  return { status: "violated", reason };
}
function inconclusive(reason: string): Verdict {
  return { status: "inconclusive", reason };
}

function objectSteps(
  object: string,
  observation: RunObservation,
): { step: ObservedStep; variable: DebugVariable }[] {
  return observation.steps
    .map((step) => ({
      step,
      variable: step.variables.find((v) => v.name === object),
    }))
    .filter(
      (entry): entry is { step: ObservedStep; variable: DebugVariable } =>
        entry.variable !== undefined,
    );
}

function checkMutation(object: string, observation: RunObservation): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(
      `"${object}" never appeared in the program's variable state during the run.`,
    );
  }
  const first = steps[0].variable.value;
  const last = steps[steps.length - 1].variable.value;
  return first !== last
    ? satisfied(
        `"${object}" changed from "${first}" to "${last}" during the run.`,
      )
    : violated(
        `"${object}" was declared but its value never changed during the run (stayed "${first}").`,
      );
}

function checkOutput(object: string, observation: RunObservation): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(
      `"${object}" never appeared in the program's variable state during the run.`,
    );
  }
  const wasPrinted = steps.some(({ step, variable }) =>
    step.output.some((line) => line.includes(variable.value)),
  );
  return wasPrinted
    ? satisfied(`"${object}"'s value was printed via OUTPUT during the run.`)
    : violated(`"${object}" was never printed via OUTPUT during the run.`);
}

function checkDirectional(
  object: string,
  observation: RunObservation,
  direction: "increase" | "decrease",
): Verdict {
  const article = direction === "increase" ? "an" : "a";
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(
      `"${object}" never appeared in the program's variable state during the run.`,
    );
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
  const moved = direction === "increase" ? last > first : last < first;
  return moved
    ? satisfied(
        `"${object}" ${direction}d from ${first} to ${last} during the run.`,
      )
    : violated(
        `"${object}" went from ${first} to ${last} during the run, which is not ${article} ${direction}.`,
      );
}

function checkTargetValue(
  object: string,
  observation: RunObservation,
  target = "TRUE",
): Verdict {
  const steps = objectSteps(object, observation);
  if (steps.length === 0) {
    return violated(
      `"${object}" never appeared in the program's variable state during the run.`,
    );
  }
  const reached = steps.some(
    ({ variable }) => variable.value.toUpperCase() === target,
  );
  const lastSeen = steps[steps.length - 1].variable.value;
  return reached
    ? satisfied(`"${object}" reached the value "${target}" during the run.`)
    : violated(
        `"${object}" never became "${target}" during the run (last seen as "${lastSeen}").`,
      );
}

const CATEGORY_CHECKS = {
  mutation: checkMutation,
  output: checkOutput,
  increase: (object: string, observation: RunObservation) =>
    checkDirectional(object, observation, "increase"),
  decrease: (object: string, observation: RunObservation) =>
    checkDirectional(object, observation, "decrease"),
  targetValue: (object: string, observation: RunObservation) =>
    checkTargetValue(object, observation),
} satisfies Record<
  string,
  (object: string, observation: RunObservation) => Verdict
>;

export type VerbCategory = keyof typeof CATEGORY_CHECKS;

export const VERB_GLOSSARY: Record<string, VerbCategory> = {
  output: "output",
  display: "output",
  print: "output",
  show: "output",
  report: "output",
  log: "output",

  calculate: "mutation",
  compute: "mutation",
  update: "mutation",
  set: "mutation",
  determine: "mutation",
  generate: "mutation",
  assign: "mutation",
  modify: "mutation",
  open: "mutation",

  increment: "increase",
  increase: "increase",
  grow: "increase",
  raise: "increase",

  decrement: "decrease",
  decrease: "decrease",
  reduce: "decrease",
  shrink: "decrease",
  lower: "decrease",

  confirm: "targetValue",
  validate: "targetValue",
  flag: "targetValue",
  mark: "targetValue",
};

function combine(verdicts: Verdict[]): Verdict {
  if (verdicts.length === 0)
    return inconclusive("Document contained no must-requirements.");
  const violation = verdicts.find((v) => v.status === "violated");
  if (violation) return violation;
  const unknown = verdicts.find((v) => v.status === "inconclusive");
  if (unknown) return unknown;
  return satisfied(verdicts.map((v) => v.reason).join(" "));
}

/** The verb + object check shared by Type 1 and Type 2. */
function checkVerbObject(
  verbText: string,
  object: string,
  observation: RunObservation,
): Verdict {
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
    return inconclusive("Nothing to check.");
  }

  override visitDocument = (ctx: DocumentContext): Verdict => {
    return combine(
      ctx.requirement().map((req) => this.visit(req) ?? this.defaultResult()),
    );
  };

  override visitAutonomousActivity = (
    ctx: AutonomousActivityContext,
  ): Verdict => {
    if (!this.observation.completed && this.observation.error) {
      return violated(
        `The run did not complete: ${this.observation.error.message}`,
      );
    }
    return checkVerbObject(
      ctx._verb!.text!,
      ctx._object!.text!,
      this.observation,
    );
  };

  override visitUserInteraction = (ctx: UserInteractionContext): Verdict => {
    if (!this.observation.completed && this.observation.error) {
      return violated(
        `The run did not complete: ${this.observation.error.message}`,
      );
    }
    if (this.observation.inputRequests.length === 0) {
      return violated(
        "The run never requested any input, so no interaction was offered.",
      );
    }
    return checkVerbObject(
      ctx._verb!.text!,
      ctx._object!.text!,
      this.observation,
    );
  };
}

export function checkRequirementDocument(
  tree: DocumentContext,
  observation: RunObservation,
): Verdict {
  return new RequirementWatchdog(observation).visitDocument(tree);
}
