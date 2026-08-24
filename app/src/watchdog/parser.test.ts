import { describe, it, expect } from 'vitest';
import { parseRequirement } from './parser';
import { AutonomousActivityContext, UserInteractionContext } from './generated/RequirementParser';

function okAutonomous(source: string): AutonomousActivityContext {
  const { tree, errors } = parseRequirement(source);
  expect(errors).toEqual([]);
  expect(tree.requirement().length).toBe(1);
  const req = tree.requirement(0)!;
  expect(req).toBeInstanceOf(AutonomousActivityContext);
  return req as AutonomousActivityContext;
}

function okInteraction(source: string): UserInteractionContext {
  const { tree, errors } = parseRequirement(source);
  expect(errors).toEqual([]);
  expect(tree.requirement().length).toBe(1);
  const req = tree.requirement(0)!;
  expect(req).toBeInstanceOf(UserInteractionContext);
  return req as UserInteractionContext;
}

function rejected(source: string): void {
  const { errors } = parseRequirement(source);
  expect(errors.length).toBeGreaterThan(0);
}

describe('Requirement grammar — Type 1 (autonomous system activity)', () => {
  it('parses the plain skeleton: subject must verb object.', () => {
    const req = okAutonomous('The System must LogEvent Motion.');
    expect(req._subject!.getText()).toBe('TheSystem');
    expect(req._verb!.text).toBe('LogEvent');
    expect(req._object!.text).toBe('Motion');
    expect(req.IF()).toBeNull();
  });

  it('parses a leading condition clause', () => {
    const req = okAutonomous('If the sensor detects motion, the System must LogEvent Motion.');
    expect(req.IF()).not.toBeNull();
    expect(req._condition!.getText()).toBe('thesensordetectsmotion');
    expect(req._subject!.getText()).toBe('theSystem');
  });

  it('allows a hyphenated compound subject name', () => {
    const req = okAutonomous('The Smart-Home-System must OUTPUT Total.');
    expect(req._subject!.getText()).toBe('TheSmart-Home-System');
  });

  it('allows an object with digits and underscores, matching Pseudocode IDENTIFIER', () => {
    const req = okAutonomous('The System must UPDATE Score_2.');
    expect(req._object!.text).toBe('Score_2');
  });

  it('parses a document of multiple requirements, one per line', () => {
    const { tree, errors } = parseRequirement(
      'The System must LogEvent Motion.\nThe System must OUTPUT Total.\n',
    );
    expect(errors).toEqual([]);
    expect(tree.requirement().length).toBe(2);
  });

  it('rejects should-requirements — only must is in scope', () => {
    rejected('The System should LogEvent Motion.');
  });

  it('rejects will-requirements — only must is in scope', () => {
    rejected('The System will LogEvent Motion.');
  });

  it('rejects a multi-word object — object must bind to a single identifier', () => {
    rejected('The System must open the door.');
  });

  it('rejects a missing trailing period', () => {
    rejected('The System must LogEvent Motion');
  });

  it('rejects a missing subject', () => {
    rejected('must LogEvent Motion.');
  });

  it('rejects an empty document with no requirements as unparsed leftover', () => {
    const { tree, errors } = parseRequirement('');
    expect(errors).toEqual([]);
    expect(tree.requirement().length).toBe(0);
  });
});

describe('Requirement grammar — Type 2 (user interaction)', () => {
  it('parses the worked example from foundation_sophist.txt', () => {
    const req = okInteraction(
      'The Smart-Home-System must offer the authorized person the possibility to open Door.',
    );
    expect(req._subject!.getText()).toBe('TheSmart-Home-System');
    // recipient greedily absorbs the connector's leading "the" — documented parse edge.
    expect(req._recipient!.getText()).toBe('theauthorizedpersonthe');
    expect(req._verb!.text).toBe('open');
    expect(req._object!.text).toBe('Door');
  });

  it('parses with a leading condition clause', () => {
    const req = okInteraction(
      'If the sensor recognizes the person as access-permitted, the Smart-Home-System must offer the authorized person the possibility to open Door.',
    );
    expect(req.IF()).not.toBeNull();
    expect(req._verb!.text).toBe('open');
  });

  it('rejects should-requirements — only must is in scope', () => {
    rejected('The System should offer the user the possibility to open Door.');
  });

  it('rejects wrong word order (possibility/offer swapped)', () => {
    rejected('The System must the possibility offer to open Door.');
  });

  it('rejects a missing "to" before the verb', () => {
    rejected('The System must offer the user the possibility open Door.');
  });

  it('rejects a missing "the possibility to" clause entirely', () => {
    rejected('The System must offer the user open Door.');
  });

  it('a document can mix Type 1 and Type 2 requirements', () => {
    const { tree, errors } = parseRequirement(
      'The System must LogEvent Motion.\nThe System must offer the user the possibility to open Door.\n',
    );
    expect(errors).toEqual([]);
    expect(tree.requirement().length).toBe(2);
    expect(tree.requirement(0)).toBeInstanceOf(AutonomousActivityContext);
    expect(tree.requirement(1)).toBeInstanceOf(UserInteractionContext);
  });
});
