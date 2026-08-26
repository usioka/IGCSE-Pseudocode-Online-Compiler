import { describe, it, expect } from 'vitest';
import { parseRequirement } from './parser';
import { generatePseudocodeWatchdog } from './codegenPseudocode';
import { AutonomousActivityContext, UserInteractionContext } from './generated/RequirementParser';
import { parse as parsePseudocode, Interpreter } from '../interpreter';

function generate(source: string) {
  const { tree, errors } = parseRequirement(source);
  expect(errors).toEqual([]);
  const req = tree.requirement(0)!;
  return generatePseudocodeWatchdog(req as AutonomousActivityContext | UserInteractionContext, source);
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
      onInputRequest: () => queueMicrotask(() => interpreter.provideInput('')),
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
    },
    controller.signal,
  );
  await interpreter.execute(tree!);
  return output.join('\n');
}

describe('generatePseudocodeWatchdog — generated code is valid, runnable pseudocode', () => {
  it('Type 1 mutation: the example program runs and prints SATISFIED', async () => {
    const { example } = generate('The System must calculate Total.');
    const output = await runPseudocode(example);
    expect(output).toContain('SATISFIED: Total changed from 0 to 15');
  });

  it('Type 1 output: the example program runs and prints SATISFIED', async () => {
    const { example } = generate('The System must OUTPUT Message.');
    const output = await runPseudocode(example);
    expect(output).toContain('SATISFIED: Message');
    expect(output).toContain('was printed via OUTPUT');
  });

  it('Type 2: the example program runs and prints SATISFIED (input taken, object changed)', async () => {
    const { example } = generate('The System must offer the user the possibility to open Total.');
    const output = await runPseudocode(example);
    expect(output).toContain('SATISFIED: input was requested and Total changed from 0 to 15');
  });

  it('a hand-modified copy of the mutation example prints VIOLATED when the object never changes', async () => {
    const { example } = generate('The System must calculate Total.');
    // Remove the FOR loop body's mutation so Total never actually changes.
    const brokenExample = example.replace('    Total <- Total + i\n', '');
    const output = await runPseudocode(brokenExample);
    expect(output).toContain('VIOLATED: Total was declared but its value never changed (stayed 0)');
  });

  it('a hand-modified copy of the Type 2 example prints VIOLATED when no input was taken', async () => {
    const { example } = generate('The System must offer the user the possibility to open Total.');
    const brokenExample = example.replace('INPUT Choice\n', '').replace('Watchdog_InputTaken <- "TRUE"\n', '');
    const output = await runPseudocode(brokenExample);
    expect(output).toContain('VIOLATED: no input was ever requested, so no interaction was offered');
  });

  it('generates an explanatory comment (no procedure) for a verb outside the glossary', () => {
    const { code } = generate('The System must invoke Total.');
    expect(code).toContain('is not in the watchdog\'s verb glossary');
    expect(code).not.toContain('PROCEDURE');
  });

  it('the reusable code block for Type 1 contains a PROCEDURE and wiring instructions', () => {
    const { code } = generate('The System must calculate Total.');
    expect(code).toContain('PROCEDURE Watchdog_Total');
    expect(code).toContain('ENDPROCEDURE');
    expect(code).toContain('CALL Watchdog_Total(');
  });
});
