import {
  AutonomousActivityContext,
  UserInteractionContext,
} from "./generated/RequirementParser";
import { VERB_GLOSSARY, VerbCategory } from "./verdict";

type RequirementCtx = AutonomousActivityContext | UserInteractionContext;

export interface PseudocodeWatchdog {
  code: string;
  example: string;
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

export function generatePseudocodeWatchdog(
  ctx: RequirementCtx,
  sourceText: string,
): PseudocodeWatchdog {
  const verb = ctx._verb!.text!;
  const object = ctx._object!.text!;
  const category = VERB_GLOSSARY[verb.toLowerCase()];

  if (!category) return inconclusiveStub(verb, sourceText);

  const d = CATEGORY_PSEUDOCODE[category];
  const isType2 = ctx instanceof UserInteractionContext;

  const exampleLines = [
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
  const requirementLine = `The System ${isType2 ? "must offer the user the possibility to " : "must "}${verb} ${object}.`;
  const example = `// Requirement: ${requirementLine}\n${exampleLines.join("\n")}\n`;

  if (!isType2) {
    return {
      code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 1 — autonomous system activity
//
${d.wiring(object, verb)}

${d.procedure(object)}`,
      example,
    };
  }

  return {
    code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 2 — user interaction
//
// 1) Declare this flag near the top of your program:
// DECLARE Watchdog_InputTaken : STRING
// Watchdog_InputTaken <- "FALSE"
//
// 2) Right after any INPUT statement, add:
// Watchdog_InputTaken <- "TRUE"
//
${d.wiring(object, verb).replace(/\/\/ (\d)\)/g, (_m, n) => `// ${Number(n) + 2})`)}
//
${d.type2Procedure(object)}`,
    example,
  };
}
