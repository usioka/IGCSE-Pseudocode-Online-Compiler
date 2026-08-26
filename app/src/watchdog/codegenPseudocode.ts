// Turns one parsed requirement into an actual runnable IGCSE PSEUDOCODE
// watchdog — a PROCEDURE the student pastes into their own program and CALLs
// once, printing SATISFIED/VIOLATED as ordinary OUTPUT. Unlike codegen.ts
// (which renders the TypeScript logic verdict.ts itself executes, purely as
// a display/teaching aid, never run), this produces code meant to actually
// execute in the real interpreter — no observe.ts/verdict.ts harness needed
// at all, since the check *is* the pseudocode program's own output. Reuses
// VERB_GLOSSARY from verdict.ts so both generators agree on what each verb
// means. New, independent file.
//
// PROCEDURE parameter types are declared STRING throughout. This isn't a
// real type constraint: bindParams() in core/interpreter.ts declares BYVAL
// arguments under the parameter's name using the *argument's own* runtime
// value and type, unchanged — declared parameter types aren't checked or
// coerced. Comparison (`<>`) falls back to string comparison whenever
// operands aren't both numeric/date/enum (interpreter.ts's ComparisonExpr
// handling), so passing an INTEGER, REAL, or STRING argument into a
// STRING-declared parameter both runs and compares correctly regardless of
// the object's real declared type, which the SOPHIST sentence never states.

import { AutonomousActivityContext, UserInteractionContext } from './generated/RequirementParser';
import { VERB_GLOSSARY } from './verdict';

type RequirementCtx = AutonomousActivityContext | UserInteractionContext;

interface PseudocodeWatchdog {
  /** The PROCEDURE itself, plus usage comments — paste into any program. */
  code: string;
  /** A complete, runnable example program demonstrating it (also used to prove this in tests). */
  example: string;
}

function inconclusiveStub(verb: string, sourceText: string): PseudocodeWatchdog {
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

function mutationWatchdog(object: string, verb: string): { procedure: string; wiring: string } {
  const procName = `Watchdog_${object}`;
  return {
    procedure: `PROCEDURE ${procName}(InitialValue : STRING, FinalValue : STRING)
    IF InitialValue <> FinalValue THEN
        OUTPUT "SATISFIED: ${object} changed from ", InitialValue, " to ", FinalValue
    ELSE
        OUTPUT "VIOLATED: ${object} was declared but its value never changed (stayed ", InitialValue, ")"
    ENDIF
ENDPROCEDURE`,
    wiring: `// 1) Snapshot ${object} before the logic that's meant to satisfy "${verb}" runs:
// DECLARE Watchdog_${object}_Initial : STRING
// Watchdog_${object}_Initial <- ${object}
//
// 2) After that logic runs, call:
// CALL ${procName}(Watchdog_${object}_Initial, ${object})`,
  };
}

function outputWatchdog(object: string): { procedure: string; wiring: string } {
  const procName = `Watchdog_${object}`;
  const flag = `Watchdog_${object}_WasOutput`;
  return {
    procedure: `PROCEDURE ${procName}(WasOutput : STRING)
    IF WasOutput = "TRUE" THEN
        OUTPUT "SATISFIED: ${object}'s value was printed via OUTPUT"
    ELSE
        OUTPUT "VIOLATED: ${object} was never printed via OUTPUT"
    ENDIF
ENDPROCEDURE`,
    wiring: `// 1) Declare this flag near the top of your program:
// DECLARE ${flag} : STRING
// ${flag} <- "FALSE"
//
// 2) Right after every place you OUTPUT ${object}, add:
// ${flag} <- "TRUE"
//
// 3) At the very end of your program, call:
// CALL ${procName}(${flag})`,
  };
}

export function generatePseudocodeWatchdog(ctx: RequirementCtx, sourceText: string): PseudocodeWatchdog {
  const verb = ctx._verb!.text!;
  const object = ctx._object!.text!;
  const category = VERB_GLOSSARY[verb.toLowerCase()];

  if (!category) return inconclusiveStub(verb, sourceText);

  const { procedure, wiring } = category === 'mutation' ? mutationWatchdog(object, verb) : outputWatchdog(object);

  if (!(ctx instanceof UserInteractionContext)) {
    return {
      code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 1 — autonomous system activity
//
${wiring}

${procedure}`,
      example: mutationOrOutputExample(object, verb, category, procedure, false),
    };
  }

  // Type 2 also needs evidence *some* interaction was offered — an
  // input-taken flag, checked alongside the same verb/object logic.
  const inputFlag = `Watchdog_InputTaken`;
  const type2ProcName = `Watchdog_${object}`;
  const type2Procedure =
    category === 'mutation'
      ? `PROCEDURE ${type2ProcName}(InputTaken : STRING, InitialValue : STRING, FinalValue : STRING)
    IF InputTaken <> "TRUE" THEN
        OUTPUT "VIOLATED: no input was ever requested, so no interaction was offered"
    ELSEIF InitialValue <> FinalValue THEN
        OUTPUT "SATISFIED: input was requested and ${object} changed from ", InitialValue, " to ", FinalValue
    ELSE
        OUTPUT "VIOLATED: input was requested, but ${object} never changed (stayed ", InitialValue, ")"
    ENDIF
ENDPROCEDURE`
      : `PROCEDURE ${type2ProcName}(InputTaken : STRING, WasOutput : STRING)
    IF InputTaken <> "TRUE" THEN
        OUTPUT "VIOLATED: no input was ever requested, so no interaction was offered"
    ELSEIF WasOutput = "TRUE" THEN
        OUTPUT "SATISFIED: input was requested and ${object}'s value was printed via OUTPUT"
    ELSE
        OUTPUT "VIOLATED: input was requested, but ${object} was never printed via OUTPUT"
    ENDIF
ENDPROCEDURE`;

  return {
    code: `// Requirement: ${sourceText.trim()}
// FunktionsMASTeR Type 2 — user interaction
//
// 1) Declare this flag near the top of your program:
// DECLARE ${inputFlag} : STRING
// ${inputFlag} <- "FALSE"
//
// 2) Right after any INPUT statement, add:
// ${inputFlag} <- "TRUE"
//
${wiring.replace('// 1)', '// 3)').replace('// 2)', '// 4)')}
//
${type2Procedure}`,
    example: mutationOrOutputExample(object, verb, category, type2Procedure, true),
  };
}

function mutationOrOutputExample(
  object: string,
  verb: string,
  category: 'mutation' | 'output',
  procedure: string,
  isType2: boolean,
): string {
  const lines: string[] = [];
  if (isType2) {
    lines.push(`DECLARE Watchdog_InputTaken : STRING`, `Watchdog_InputTaken <- "FALSE"`);
  }
  lines.push(procedure, '');
  if (category === 'mutation') {
    lines.push(
      `DECLARE ${object} : INTEGER`,
      `${object} <- 0`,
      `DECLARE Watchdog_${object}_Initial : STRING`,
      `Watchdog_${object}_Initial <- ${object}`,
    );
    if (isType2) {
      lines.push(`DECLARE Choice : STRING`, `INPUT Choice`, `Watchdog_InputTaken <- "TRUE"`);
    }
    lines.push(`FOR i <- 1 TO 5`, `    ${object} <- ${object} + i`, `NEXT i`);
    lines.push(
      isType2
        ? `CALL Watchdog_${object}(Watchdog_InputTaken, Watchdog_${object}_Initial, ${object})`
        : `CALL Watchdog_${object}(Watchdog_${object}_Initial, ${object})`,
    );
  } else {
    const flag = `Watchdog_${object}_WasOutput`;
    lines.push(`DECLARE ${object} : STRING`, `${object} <- "Hello"`, `DECLARE ${flag} : STRING`, `${flag} <- "FALSE"`);
    if (isType2) {
      lines.push(`DECLARE Choice : STRING`, `INPUT Choice`, `Watchdog_InputTaken <- "TRUE"`);
    }
    lines.push(`OUTPUT ${object}`, `${flag} <- "TRUE"`);
    lines.push(isType2 ? `CALL Watchdog_${object}(Watchdog_InputTaken, ${flag})` : `CALL Watchdog_${object}(${flag})`);
  }
  return `// Requirement: The System ${isType2 ? 'must offer the user the possibility to ' : 'must '}${verb} ${object}.\n${lines.join('\n')}\n`;
}
