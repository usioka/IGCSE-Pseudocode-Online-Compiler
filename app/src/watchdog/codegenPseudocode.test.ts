import { describe, it, expect } from "vitest";
import { parseRequirement } from "./parser";
import { generatePseudocodeWatchdog } from "./codegenPseudocode";
import {
  AutonomousActivityContext,
  UserInteractionContext,
} from "./generated/RequirementParser";
import { parse as parsePseudocode, Interpreter } from "../interpreter";

function generate(source: string) {
  const { tree, errors } = parseRequirement(source);
  expect(errors).toEqual([]);
  const req = tree.requirement(0)!;
  return generatePseudocodeWatchdog(
    req as AutonomousActivityContext | UserInteractionContext,
    source,
  );
}

// Actually runs the generated example through the real interpreter (not the
// TS observe.ts/verdict.ts harness) — proof that the generated PROCEDURE is
// genuinely valid, runnable pseudocode, not just plausible-looking text.
async function runPseudocode(source: string): Promise<string> {
  const { tree, errors } = parsePseudocode(source);
  expect(errors).toEqual([]);
  const output: string[] = [];
  const controller = new AbortController();
  const interpreter = new Interpreter(
    {
      onOutput: (text) => output.push(text),
      onInputRequest: () => queueMicrotask(() => interpreter.provideInput("")),
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
    },
    controller.signal,
  );
  await interpreter.execute(tree!);
  return output.join("\n");
}

// Confirms a skeleton genuinely doesn't parse, rather than just asserting it
// contains certain text — the same "verify, don't assume" standard applied
// to the runnable paths above.
function parseFails(source: string): boolean {
  const { errors } = parsePseudocode(source);
  return errors.length > 0;
}

describe("generatePseudocodeWatchdog — generated code is valid, runnable pseudocode", () => {
  it("Type 1 mutation: the example program runs and prints SATISFIED", async () => {
    const { example } = generate("The System must calculate Total.");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Total changed from 0 to 15");
  });

  it("Type 1 output: the example program runs and prints SATISFIED", async () => {
    const { example } = generate("The System must OUTPUT Message.");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Message");
    expect(output).toContain("was printed via OUTPUT");
  });

  it("Type 2: the example program runs and prints SATISFIED (input taken, object changed)", async () => {
    const { example } = generate(
      "The System must offer the user the possibility to open Total.",
    );
    const output = await runPseudocode(example);
    expect(output).toContain(
      "SATISFIED: input was requested and Total changed from 0 to 15",
    );
  });

  it("a hand-modified copy of the mutation example prints VIOLATED when the object never changes", async () => {
    const { example } = generate("The System must calculate Total.");
    // Remove the FOR loop body's mutation so Total never actually changes.
    const brokenExample = example.replace("    Total <- Total + i\n", "");
    const output = await runPseudocode(brokenExample);
    expect(output).toContain(
      "VIOLATED: Total went from 0 to 0, which is not a change",
    );
  });

  it("a hand-modified copy of the Type 2 example prints VIOLATED when no input was taken", async () => {
    const { example } = generate(
      "The System must offer the user the possibility to open Total.",
    );
    const brokenExample = example
      .replace("INPUT Choice\n", "")
      .replace('Watchdog_InputTaken <- "TRUE"\n', "");
    const output = await runPseudocode(brokenExample);
    expect(output).toContain(
      "VIOLATED: no input was ever requested, so no interaction was offered",
    );
  });

  it("generates an explanatory comment (no procedure) for a verb outside the glossary", () => {
    const { code } = generate("The System must invoke Total.");
    expect(code).toContain("is not in the watchdog's verb glossary");
    expect(code).not.toContain("PROCEDURE");
  });

  it("the reusable code block for Type 1 contains a PROCEDURE and wiring instructions", () => {
    const { code } = generate("The System must calculate Total.");
    expect(code).toContain("PROCEDURE Watchdog_Total");
    expect(code).toContain("ENDPROCEDURE");
    expect(code).toContain("CALL Watchdog_Total(");
  });

  it("increase: the example program runs and prints SATISFIED", async () => {
    const { example } = generate("The System must increment Total.");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Total increased from 0 to 15");
  });

  it("decrease: the example program runs and prints SATISFIED (a genuine decrease, not just a change)", async () => {
    const { example } = generate("The System must reduce Total.");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Total decreased from 20 to 5");
  });

  it("increase: a hand-modified copy prints VIOLATED when the value actually decreases", async () => {
    const { example } = generate("The System must increment Total.");
    const brokenExample = example.replace(
      "Total <- Total + i",
      "Total <- Total - i",
    );
    const output = await runPseudocode(brokenExample);
    expect(output).toContain(
      "VIOLATED: Total went from 0 to -15, which is not an increase",
    );
  });

  it("target-value: the example program runs and prints SATISFIED", async () => {
    const { example } = generate("The System must confirm Verified.");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Verified reached the value TRUE");
  });

  it("target-value: a hand-modified copy prints VIOLATED when the value never becomes TRUE", async () => {
    const { example } = generate("The System must confirm Verified.");
    const brokenExample = example.replace('Verified <- "TRUE"\n', "");
    const output = await runPseudocode(brokenExample);
    expect(output).toContain(
      "VIOLATED: Verified never became TRUE (last seen as FALSE)",
    );
  });
});

describe("generatePseudocodeWatchdog — BedingungsMASTER condition classification", () => {
  it("an unconditioned requirement is unaffected (no wrapping at all)", async () => {
    const { code, example } = generate("The System must calculate Total.");
    expect(code).not.toContain("BedingungsMASTER");
    expect(example).not.toContain("BedingungsMASTER");
    const output = await runPseudocode(example);
    expect(output).toContain("SATISFIED: Total changed from 0 to 15");
  });

  it("a plain condition classifies as FALLS and is shown as a numbered, honestly-unrunnable skeleton", async () => {
    const { code, example } = generate(
      "If the sensor detects motion, the System must calculate Total.",
    );
    expect(code).toContain("// 1) This is a logical condition (if)");
    expect(code).toContain("IF the sensor detects motion THEN");
    expect(code).not.toContain("// IF the sensor detects motion THEN");
    expect(code).toContain("// 2) Snapshot Total");
    expect(example).toContain("// 1. if");
    expect(example).toContain("IF the sensor detects motion THEN");
    expect(example).toContain("// 2. procedure");
    expect(example).toContain("ENDIF");
    // The condition text is embedded directly as the IF's own expression,
    // which a SOPHIST phrase generally isn't — this is a skeleton showing
    // the shape, not a working demo, so it's expected not to parse.
    expect(parseFails(example)).toBe(true);
  });

  it('an "As soon as" condition classifies as SOBALD and is shown as real, honestly-unrunnable pseudocode', async () => {
    const { code, example } = generate(
      "As soon as the sensor detects motion, the System must calculate Total.",
    );
    expect(code).toContain("// 1) This is an event condition (as soon as)");
    expect(code).toContain("NOT runnable as written");
    expect(code).toContain("// 2) Snapshot Total");
    // The skeleton is real, uncommented pseudocode in the reusable snippet too.
    expect(code).toContain("WHILE NOT EventOccurred DO");
    expect(code).not.toContain("// WHILE NOT EventOccurred DO");
    // In the runnable example, the event-wait is real, uncommented pseudocode
    // syntax — not faked as a comment — so running it fails honestly instead
    // of silently: EventOccurred is never declared (pseudocode has no real
    // event/callback mechanism to set it from).
    expect(example).toContain("WHILE NOT EventOccurred DO");
    expect(example).not.toContain("// WHILE NOT EventOccurred DO");
    await expect(runPseudocode(example)).rejects.toThrow("EventOccurred");
  });

  it('an "As long as" condition classifies as SOLANGE and is shown as a numbered, honestly-unrunnable skeleton', async () => {
    const { code, example } = generate(
      "As long as the door is open, the System must calculate Total.",
    );
    expect(code).toContain("// 1) This is a duration condition (as long as)");
    expect(code).toContain("WHILE the door is open DO");
    expect(code).not.toContain("// WHILE the door is open DO");
    expect(code).toContain("// 2) Snapshot Total");
    expect(example).toContain("// 1. as long as");
    expect(example).toContain("WHILE the door is open DO");
    expect(example).toContain("// 2. procedure");
    expect(example).toContain("ENDWHILE");
    expect(parseFails(example)).toBe(true);
  });

  it('"While ..." is an alternative spelling of "As long as" and generates identical output', () => {
    // Only the "// Requirement: ..." header differs (it echoes the source
    // text verbatim); everything generated from the classified condition
    // itself — the skeleton, the wording, the wiring — must be identical.
    const asLongAs = generate(
      "As long as the door is open, the System must calculate Total.",
    );
    const whileVersion = generate(
      "While the door is open, the System must calculate Total.",
    );
    const dropHeader = (s: string) => s.split("\n").slice(1).join("\n");
    expect(dropHeader(whileVersion.code)).toBe(dropHeader(asLongAs.code));
    expect(dropHeader(whileVersion.example)).toBe(
      dropHeader(asLongAs.example),
    );
  });

  it("a conditioned Type 2 requirement gets the same skeleton treatment", async () => {
    const { example } = generate(
      "If the door is closed, the System must offer the user the possibility to open Total.",
    );
    expect(example).toContain("IF the door is closed THEN");
    expect(parseFails(example)).toBe(true);
  });
});
