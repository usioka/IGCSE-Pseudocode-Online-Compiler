import {
  AutonomousActivityContext,
  ConditionContext,
  DurationConditionContext,
  EventConditionContext,
  LogicalConditionContext,
  UserInteractionContext,
} from "./generated/RequirementParser";
import { RequirementVisitor } from "./generated/RequirementVisitor";
import { VERB_GLOSSARY, VerbCategory } from "./verdict";

type RequirementCtx = AutonomousActivityContext | UserInteractionContext;

export interface PseudocodeWatchdog {
  code: string;
  example: string;
}

type BedingungsPath = "falls" | "sobald" | "solange";

// logic
function classifyCondition(condition: ConditionContext): BedingungsPath {
  if (condition instanceof EventConditionContext) return "sobald";
  if (condition instanceof DurationConditionContext) return "solange";
  return "falls";
}

function conditionPhraseText(
  condition: ConditionContext,
  sourceText: string,
): string {
  const phrase =
    condition instanceof EventConditionContext ||
    condition instanceof DurationConditionContext ||
    condition instanceof LogicalConditionContext
      ? condition._text
      : undefined;
  if (!phrase) return "";
  return sourceText.slice(phrase.start!.start, phrase.stop!.stop + 1);
}

// Skeletons only, not required to run: the condition's free text is embedded
// directly in the control-structure header ("IF the sensor detects motion
// THEN") instead of standing in for it with a hardcoded flag variable — that
// reads a real boolean/logical expression, which "the sensor detects
// motion" (a SOPHIST phrase, not a pseudocode expression) generally isn't,
// so this will usually fail to parse or run as written. That's fine here:
// the point is showing the shape a condition maps to, not a working demo.
function wrapWithCondition(
  path: BedingungsPath,
  conditionText: string,
  innerLines: string[],
): string[] {
  // as soon as
  if (path === "sobald") {
    return [
      `// 1. as soon as`,
      `// NOT runnable as written: EventOccurred is never declared, since`,
      `// pseudocode has no real event/callback mechanism to set it from.`,
      `WHILE NOT EventOccurred DO`,
      `    // wait for the event: ${conditionText}`,
      `ENDWHILE`,
      `// 2. procedure`,
      ...innerLines,
    ];
  }

  // as long as
  if (path === "solange") {
    return [
      `// 1. as long as`,
      `WHILE ${conditionText} DO`,
      `// 2. procedure`,
      ...innerLines,
      `ENDWHILE`,
    ];
  }

  // if
  return [
    `// 1. if`,
    `IF ${conditionText} THEN`,
    `// 2. procedure`,
    ...innerLines,
    `ENDIF`,
  ];
}

const PATH_DESCRIPTION: Record<BedingungsPath, string> = {
  falls: "a logical condition (if) — a plain logical statement",
  sobald:
    "an event condition (as soon as) — NOT runnable as written: EventOccurred is never declared, since pseudocode has no real event/callback mechanism to set it from",
  solange: "a duration condition (as long as)",
};

/**
 * The step-1 condition skeleton for the reusable `.code` snippet: one
 * numbered comment introducing it, then the actual IF/WHILE/ENDIF/ENDWHILE
 * as real, uncommented pseudocode — not buried in comments like the rest of
 * the wiring notes, since this is the one part meant to be copied verbatim.
 * A placeholder line stands in for the real call, which lives in the
 * student's own program and gets wired up in the numbered steps after this.
 */
function conditionCodeStep(
  path: BedingungsPath,
  conditionText: string,
): string {
  const placeholder = "<the CALL from step 2, and whatever it depends on>";
  const skeleton =
    path === "sobald"
      ? [
          `WHILE NOT EventOccurred DO`,
          `    // wait for the event: ${conditionText}`,
          `ENDWHILE`,
          placeholder,
        ]
      : path === "solange"
        ? [`WHILE ${conditionText} DO`, `    ${placeholder}`, `ENDWHILE`]
        : [`IF ${conditionText} THEN`, `    ${placeholder}`, `ENDIF`];
  return `// 1) This is ${PATH_DESCRIPTION[path]}:\n${skeleton.join("\n")}`;
}

/** Renumbers "// N)" step comments by a fixed amount — used to make room for the condition step ahead of them. */
function shiftSteps(text: string, by: number): string {
  if (by === 0) return text;
  return text.replace(/\/\/ (\d+)\)/g, (_m, n) => `// ${Number(n) + by})`);
}

interface CategoryDescriptor {
  procedure(object: string): string;
  wiring(object: string, verb: string): string;
  type2Procedure(object: string): string;
  exampleSetup(object: string, isType2: boolean): string[];
  callArgs(object: string): string;
  type2CallArgs(object: string): string;
}

function procName(object: string): string {
  return `Watchdog_${object}`;
}

// mutation / increase / decrease
const mutationLike = (
  comparison: "<>" | ">" | "<",
  verbForm: string,
  article: "a" | "an",
  nounForm: string,
): CategoryDescriptor => ({
  procedure: (
    object,
  ) => `PROCEDURE ${procName(object)}(InitialValue : STRING, FinalValue : STRING)
    IF FinalValue ${comparison} InitialValue THEN
        OUTPUT "SATISFIED: ${object} ${verbForm} from ", InitialValue, " to ", FinalValue
    ELSE
        OUTPUT "VIOLATED: ${object} went from ", InitialValue, " to ", FinalValue, ", which is not ${article} ${nounForm}"
    ENDIF
ENDPROCEDURE`,
  wiring: (
    object,
    verb,
  ) => `// 1) Snapshot ${object} before the logic that's meant to satisfy "${verb}" runs:
// DECLARE Watchdog_${object}_Initial : STRING
// Watchdog_${object}_Initial <- ${object}
//
// 2) After that logic runs, call:
// CALL ${procName(object)}(Watchdog_${object}_Initial, ${object})`,
  type2Procedure: (
    object,
  ) => `PROCEDURE ${procName(object)}(InputTaken : STRING, InitialValue : STRING, FinalValue : STRING)
    IF InputTaken <> "TRUE" THEN
        OUTPUT "VIOLATED: no input was ever requested, so no interaction was offered"
    ELSEIF FinalValue ${comparison} InitialValue THEN
        OUTPUT "SATISFIED: input was requested and ${object} ${verbForm} from ", InitialValue, " to ", FinalValue
    ELSE
        OUTPUT "VIOLATED: input was requested, but ${object} went from ", InitialValue, " to ", FinalValue, ", which is not ${article} ${nounForm}"
    ENDIF
ENDPROCEDURE`,
  exampleSetup: (object, isType2) => {
    const startValue = comparison === "<" ? "20" : "0";
    const step = comparison === "<" ? `${object} - i` : `${object} + i`;
    const lines = [
      `DECLARE ${object} : INTEGER`,
      `${object} <- ${startValue}`,
      `DECLARE Watchdog_${object}_Initial : STRING`,
      `Watchdog_${object}_Initial <- ${object}`,
    ];
    if (isType2)
      lines.push(
        `DECLARE Choice : STRING`,
        `INPUT Choice`,
        `Watchdog_InputTaken <- "TRUE"`,
      );
    lines.push(`FOR i <- 1 TO 5`, `    ${object} <- ${step}`, `NEXT i`);
    return lines;
  },
  callArgs: (object) => `Watchdog_${object}_Initial, ${object}`,
  type2CallArgs: (object) =>
    `Watchdog_InputTaken, Watchdog_${object}_Initial, ${object}`,
});

// output
const outputDescriptor: CategoryDescriptor = {
  procedure: (object) => `PROCEDURE ${procName(object)}(WasOutput : STRING)
    IF WasOutput = "TRUE" THEN
        OUTPUT "SATISFIED: ${object}'s value was printed via OUTPUT"
    ELSE
        OUTPUT "VIOLATED: ${object} was never printed via OUTPUT"
    ENDIF
ENDPROCEDURE`,
  wiring: (object) => `// 1) Declare this flag near the top of your program:
// DECLARE Watchdog_${object}_WasOutput : STRING
// Watchdog_${object}_WasOutput <- "FALSE"
//
// 2) Right after every place you OUTPUT ${object}, add:
// Watchdog_${object}_WasOutput <- "TRUE"
//
// 3) At the very end of your program, call:
// CALL ${procName(object)}(Watchdog_${object}_WasOutput)`,
  type2Procedure: (
    object,
  ) => `PROCEDURE ${procName(object)}(InputTaken : STRING, WasOutput : STRING)
    IF InputTaken <> "TRUE" THEN
        OUTPUT "VIOLATED: no input was ever requested, so no interaction was offered"
    ELSEIF WasOutput = "TRUE" THEN
        OUTPUT "SATISFIED: input was requested and ${object}'s value was printed via OUTPUT"
    ELSE
        OUTPUT "VIOLATED: input was requested, but ${object} was never printed via OUTPUT"
    ENDIF
ENDPROCEDURE`,
  exampleSetup: (object, isType2) => {
    const flag = `Watchdog_${object}_WasOutput`;
    const lines = [
      `DECLARE ${object} : STRING`,
      `${object} <- "Hello"`,
      `DECLARE ${flag} : STRING`,
      `${flag} <- "FALSE"`,
    ];
    if (isType2)
      lines.push(
        `DECLARE Choice : STRING`,
        `INPUT Choice`,
        `Watchdog_InputTaken <- "TRUE"`,
      );
    lines.push(`OUTPUT ${object}`, `${flag} <- "TRUE"`);
    return lines;
  },
  callArgs: (object) => `Watchdog_${object}_WasOutput`,
  type2CallArgs: (object) =>
    `Watchdog_InputTaken, Watchdog_${object}_WasOutput`,
};

// target value
const targetValueDescriptor: CategoryDescriptor = {
  procedure: (object) => `PROCEDURE ${procName(object)}(CurrentValue : STRING)
    IF CurrentValue = "TRUE" THEN
        OUTPUT "SATISFIED: ${object} reached the value TRUE"
    ELSE
        OUTPUT "VIOLATED: ${object} never became TRUE (last seen as ", CurrentValue, ")"
    ENDIF
ENDPROCEDURE`,
  wiring: (
    object,
    verb,
  ) => `// Call this wherever your program should have made ${object} true to satisfy
// "${verb}" — typically right after the logic that's meant to set it, or at
// the end of your program:
// CALL ${procName(object)}(${object})`,
  type2Procedure: (
    object,
  ) => `PROCEDURE ${procName(object)}(InputTaken : STRING, CurrentValue : STRING)
    IF InputTaken <> "TRUE" THEN
        OUTPUT "VIOLATED: no input was ever requested, so no interaction was offered"
    ELSEIF CurrentValue = "TRUE" THEN
        OUTPUT "SATISFIED: input was requested and ${object} reached the value TRUE"
    ELSE
        OUTPUT "VIOLATED: input was requested, but ${object} never became TRUE (last seen as ", CurrentValue, ")"
    ENDIF
ENDPROCEDURE`,
  exampleSetup: (object, isType2) => {
    const lines = [`DECLARE ${object} : STRING`, `${object} <- "FALSE"`];
    if (isType2)
      lines.push(
        `DECLARE Choice : STRING`,
        `INPUT Choice`,
        `Watchdog_InputTaken <- "TRUE"`,
      );
    lines.push(`${object} <- "TRUE"`);
    return lines;
  },
  callArgs: (object) => object,
  type2CallArgs: (object) => `Watchdog_InputTaken, ${object}`,
};

const CATEGORY_PSEUDOCODE: Record<VerbCategory, CategoryDescriptor> = {
  mutation: mutationLike("<>", "changed", "a", "change"),
  increase: mutationLike(">", "increased", "an", "increase"),
  decrease: mutationLike("<", "decreased", "a", "decrease"),
  output: outputDescriptor,
  targetValue: targetValueDescriptor,
};

// unknown verb
function inconclusiveStub(
  verb: string,
  sourceText: string,
): PseudocodeWatchdog {
  const comment = `// Requirement: ${sourceText.trim()}
//
// "${verb}" is not in the watchdog's verb glossary (VERB_GLOSSARY in
// verdict.ts), so there is nothing to generate a check for — this comes
// back inconclusive, not violated: the requirement may still be met, this
// compiler just can't observe it (e.g. verbs implying a procedure CALL —
// there's no way to detect that a procedure ran, in generated pseudocode or
// otherwise, since this interpreter exposes no CALL hook at all).`;
  return { code: comment, example: comment };
}

// req
export function generatePseudocodeWatchdog(
  ctx: RequirementCtx,
  sourceText: string,
): PseudocodeWatchdog {
  return new PseudocodeGenerator(sourceText).visit(ctx)!;
}

// A real ANTLR visitor (unlike the original project's Python/flowchart
// converters, which never subclass their generated Visitor base at all):
// dispatch to visitAutonomousActivity/visitUserInteraction happens via
// double dispatch (ctx.accept(this)), not an instanceof check from outside.
class PseudocodeGenerator extends RequirementVisitor<PseudocodeWatchdog> {
  constructor(private sourceText: string) {
    super();
  }

  protected override defaultResult(): PseudocodeWatchdog {
    return { code: "", example: "" };
  }

  override visitAutonomousActivity = (
    ctx: AutonomousActivityContext,
  ): PseudocodeWatchdog => this.generate(ctx);

  override visitUserInteraction = (
    ctx: UserInteractionContext,
  ): PseudocodeWatchdog => this.generate(ctx);

  private generate(ctx: RequirementCtx): PseudocodeWatchdog {
    const sourceText = this.sourceText;
    const verb = ctx._verb!.text!;
    const object = ctx._object!.text!;
    const category = VERB_GLOSSARY[verb.toLowerCase()];

    if (!category) return inconclusiveStub(verb, sourceText);

    const d = CATEGORY_PSEUDOCODE[category];
    const isType2 = ctx instanceof UserInteractionContext;

    let exampleLines = [
      isType2 ? d.type2Procedure(object) : d.procedure(object),
      "",
      ...(isType2
        ? [
            `DECLARE Watchdog_InputTaken : STRING`,
            `Watchdog_InputTaken <- "FALSE"`,
          ]
        : []),
      ...d.exampleSetup(object, isType2),
      `CALL ${procName(object)}(${isType2 ? d.type2CallArgs(object) : d.callArgs(object)})`,
    ];

    const conditionCtx = ctx.condition();
    const conditionText = conditionCtx
      ? conditionPhraseText(conditionCtx, sourceText)
      : null;
    const bedingungsPath = conditionCtx
      ? classifyCondition(conditionCtx)
      : null;
    if (conditionText && bedingungsPath) {
      exampleLines = wrapWithCondition(
        bedingungsPath,
        conditionText,
        exampleLines,
      );
    }

    const requirementLine = `The System ${isType2 ? "must offer the user the possibility to " : "must "}${verb} ${object}.`;
    const example = `// Requirement: ${requirementLine}\n${exampleLines.join("\n")}\n`;

    // Everything below is one continuous numbered sequence, condition included
    // as step 1 when there is one — not two separate, overlapping "1./2." and
    // "1)/2)" lists.
    const hasCondition = Boolean(bedingungsPath && conditionText);
    const conditionStep = hasCondition
      ? `${conditionCodeStep(bedingungsPath!, conditionText!)}\n\n`
      : "";
    const shift = hasCondition ? 1 : 0;

    if (!isType2) {
      return {
        code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 1 — autonomous system activity
//
${conditionStep}${shiftSteps(d.wiring(object, verb), shift)}

${d.procedure(object)}`,
        example,
      };
    }

    const type2FixedSteps = shiftSteps(
      `// 1) Declare this flag near the top of your program:
// DECLARE Watchdog_InputTaken : STRING
// Watchdog_InputTaken <- "FALSE"
//
// 2) Right after any INPUT statement, add:
// Watchdog_InputTaken <- "TRUE"`,
      shift,
    );

    return {
      code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 2 — user interaction
//
${conditionStep}${type2FixedSteps}
//
${shiftSteps(d.wiring(object, verb), shift + 2)}
//
${d.type2Procedure(object)}`,
      example,
    };
  }
}
