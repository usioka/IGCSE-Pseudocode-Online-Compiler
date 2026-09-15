import { describe, it, expect } from "vitest";
import { parseRequirement } from "./parser";
import { observeRun } from "./observe";
import { checkRequirementDocument } from "./verdict";

async function check(
  requirement: string,
  pseudocode: string,
  inputs?: string[],
) {
  const { tree, errors } = parseRequirement(requirement);
  expect(errors).toEqual([]);
  const observation = await observeRun(pseudocode, { inputs });
  return checkRequirementDocument(tree, observation);
}

describe("RequirementWatchdog — Type 1 (autonomous system activity)", () => {
  it("satisfies a mutation verb when the object changes value during the run", async () => {
    const verdict = await check(
      "The System must calculate Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nFOR i <- 1 TO 5\nTotal <- Total + i\nNEXT i\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("satisfied");
  });

  it("violates a mutation verb when the object never changes value", async () => {
    const verdict = await check(
      "The System must calculate Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("violated");
  });

  it("satisfies an output verb when the object is printed", async () => {
    const verdict = await check(
      "The System must OUTPUT Message.",
      'DECLARE Message : STRING\nMessage <- "Hello"\nOUTPUT Message\n',
    );
    expect(verdict.status).toBe("satisfied");
  });

  it("violates an output verb when the object is declared but never printed", async () => {
    const verdict = await check(
      "The System must OUTPUT Message.",
      'DECLARE Message : STRING\nMessage <- "Hello"\n',
    );
    expect(verdict.status).toBe("violated");
  });

  it("violates when the object never appears in the program at all", async () => {
    const verdict = await check(
      "The System must calculate Total.",
      "DECLARE X : INTEGER\nX <- 1\nOUTPUT X\n",
    );
    expect(verdict.status).toBe("violated");
  });

  it("is inconclusive for a verb outside the glossary (e.g. a CALL-style verb)", async () => {
    const verdict = await check(
      "The System must invoke Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("inconclusive");
  });

  it("violates when the run itself errored", async () => {
    const verdict = await check(
      "The System must calculate X.",
      "DECLARE X : INTEGER\nX <- 1 / 0\n",
    );
    expect(verdict.status).toBe("violated");
  });

  it("checks each requirement in a multi-requirement document, worst status wins", async () => {
    const { tree, errors } = parseRequirement(
      "The System must calculate Total.\nThe System must invoke Total.\n",
    );
    expect(errors).toEqual([]);
    const observation = await observeRun(
      "DECLARE Total : INTEGER\nTotal <- 0\nOUTPUT Total\n",
    );
    const verdict = checkRequirementDocument(tree, observation);
    // first requirement violated (no mutation), second inconclusive (unknown verb) — violated wins
    expect(verdict.status).toBe("violated");
  });
});

describe("RequirementWatchdog — Type 2 (user interaction)", () => {
  const REQUIREMENT =
    "The System must offer the user the possibility to open Door.";

  it("satisfies when the run took input and the object changed", async () => {
    const verdict = await check(
      REQUIREMENT,
      'DECLARE Choice : STRING\nDECLARE Door : STRING\nDoor <- "Closed"\nINPUT Choice\nDoor <- "Open"\nOUTPUT Door\n',
      ["Y"],
    );
    expect(verdict.status).toBe("satisfied");
  });

  it("violates when the run never took any input, even if the object changed", async () => {
    const verdict = await check(
      REQUIREMENT,
      'DECLARE Door : STRING\nDoor <- "Closed"\nDoor <- "Open"\nOUTPUT Door\n',
    );
    expect(verdict.status).toBe("violated");
  });

  it("violates when input was taken but the object never changed", async () => {
    // Door is declared but never assigned, so it never leaves its DECLARE
    // default — unlike a "Door <- ... then INPUT" ordering, which would
    // register the declare-default-to-first-assignment step as a "change"
    // even though it happened before the interaction (the mutation check
    // doesn't verify ordering — see the header comment in verdict.ts).
    const verdict = await check(
      REQUIREMENT,
      "DECLARE Choice : STRING\nDECLARE Door : STRING\nINPUT Choice\nOUTPUT Door\n",
      ["Y"],
    );
    expect(verdict.status).toBe("violated");
  });

  it("a document can mix a Type 1 and a Type 2 requirement, worst status wins", async () => {
    const { tree, errors } = parseRequirement(
      "The System must calculate Total.\n" + REQUIREMENT + "\n",
    );
    expect(errors).toEqual([]);
    // Total never changes (violates Type 1); Door does, with input (would satisfy Type 2).
    const observation = await observeRun(
      'DECLARE Total : INTEGER\nTotal <- 0\nDECLARE Choice : STRING\nDECLARE Door : STRING\nDoor <- "Closed"\nINPUT Choice\nDoor <- "Open"\nOUTPUT Total\nOUTPUT Door\n',
      { inputs: ["Y"] },
    );
    const verdict = checkRequirementDocument(tree, observation);
    expect(verdict.status).toBe("violated");
  });
});

describe("RequirementWatchdog — directional mutation (increase/decrease)", () => {
  it('satisfies "increment" when the object numerically increases', async () => {
    const verdict = await check(
      "The System must increment Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nTotal <- Total + 5\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("satisfied");
  });

  it('violates "increment" when the object actually decreases', async () => {
    // DECLARE's own default (0 for INTEGER) counts as the first appearance
    // (same documented behavior as the plain mutation check), so the
    // decrease needs to land below that default, not just below an earlier
    // explicit assignment.
    const verdict = await check(
      "The System must increment Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nTotal <- Total - 5\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("violated");
  });

  it('satisfies "reduce" when the object numerically decreases', async () => {
    const verdict = await check(
      "The System must reduce Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nTotal <- Total - 5\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("satisfied");
  });

  it('violates "reduce" when the object actually increases', async () => {
    const verdict = await check(
      "The System must reduce Total.",
      "DECLARE Total : INTEGER\nTotal <- 0\nTotal <- Total + 5\nOUTPUT Total\n",
    );
    expect(verdict.status).toBe("violated");
  });

  it('is inconclusive for "increment" when the object is not numeric', async () => {
    const verdict = await check(
      "The System must increment Message.",
      'DECLARE Message : STRING\nMessage <- "Hello"\nMessage <- "World"\nOUTPUT Message\n',
    );
    expect(verdict.status).toBe("inconclusive");
  });
});

describe("RequirementWatchdog — target value (confirm/validate/flag/mark)", () => {
  it('satisfies "confirm" when the object reaches TRUE at any point in the run', async () => {
    const verdict = await check(
      "The System must confirm Verified.",
      "DECLARE Verified : BOOLEAN\nVerified <- FALSE\nVerified <- TRUE\nOUTPUT Verified\n",
    );
    expect(verdict.status).toBe("satisfied");
  });

  it('violates "confirm" when the object never reaches TRUE', async () => {
    const verdict = await check(
      "The System must confirm Verified.",
      "DECLARE Verified : BOOLEAN\nVerified <- FALSE\nOUTPUT Verified\n",
    );
    expect(verdict.status).toBe("violated");
  });
});
