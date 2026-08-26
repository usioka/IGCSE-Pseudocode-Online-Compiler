import { describe, it, expect } from 'vitest';
import { parseRequirement } from './parser';
import { generateCheckCode } from './codegen';
import { AutonomousActivityContext, UserInteractionContext } from './generated/RequirementParser';

function generate(source: string): string {
  const { tree, errors } = parseRequirement(source);
  expect(errors).toEqual([]);
  const req = tree.requirement(0)!;
  return generateCheckCode(req as AutonomousActivityContext | UserInteractionContext, source);
}

describe('generateCheckCode', () => {
  it('generates a mutation check for Type 1', () => {
    const code = generate('The System must calculate Total.');
    expect(code).toContain('Type 1 — autonomous system activity');
    expect(code).toContain("name === 'Total'");
    expect(code).toContain('mutation check');
    expect(code).not.toContain('inputRequests');
  });

  it('generates an output check for Type 1', () => {
    const code = generate('The System must OUTPUT Message.');
    expect(code).toContain('output check');
    expect(code).toContain("name === 'Message'");
  });

  it('generates an inconclusive stub for an unknown verb', () => {
    const code = generate('The System must invoke Total.');
    expect(code).toContain('not in the watchdog\'s verb glossary');
    expect(code).toContain('inconclusive(');
  });

  it('generates an input-gated check for Type 2', () => {
    const code = generate('The System must offer the user the possibility to open Door.');
    expect(code).toContain('Type 2 — user interaction');
    expect(code).toContain('inputRequests.length === 0');
    expect(code).toContain("name === 'Door'");
  });

  it('embeds the original requirement text as a comment', () => {
    const code = generate('The System must calculate Total.');
    expect(code).toContain('// Derived from: "The System must calculate Total."');
  });
});
