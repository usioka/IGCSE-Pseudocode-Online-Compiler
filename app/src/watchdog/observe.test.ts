import { describe, it, expect } from "vitest";
import { observeRun } from "./observe";

describe("observeRun", () => {
  it("records one step per executed statement, with output attached to the right step", async () => {
    const obs = await observeRun(
      "DECLARE Total : INTEGER\nTotal <- 0\nOUTPUT Total\n",
    );
    expect(obs.completed).toBe(true);
    expect(obs.fullOutput).toBe("0");

    const outputStep = obs.steps.find((s) => s.output.length > 0);
    expect(outputStep?.output).toEqual(["0"]);
  });

  it("tracks a variable changing value across steps", async () => {
    const obs = await observeRun(
      "DECLARE Total : INTEGER\nTotal <- 0\nTotal <- Total + 5\nOUTPUT Total\n",
    );
    const totalValues = obs.steps
      .map((s) => s.variables.find((v) => v.name === "Total")?.value)
      .filter(Boolean);
    // Total appears from DECLARE onward: '0' at DECLARE, '0' after the explicit
    // Total <- 0, '5' after Total <- Total + 5, and '5' still at OUTPUT.
    expect(totalValues).toEqual(["0", "0", "5", "5"]);
  });

  it("feeds queued inputs to INPUT requests in order", async () => {
    const obs = await observeRun(
      "DECLARE Name : STRING\nINPUT Name\nOUTPUT Name\n",
      { inputs: ["Ada"] },
    );
    expect(obs.completed).toBe(true);
    expect(obs.fullOutput).toBe("Ada");
  });

  it("records each INPUT request target, in order", async () => {
    const obs = await observeRun(
      "DECLARE First : STRING\nDECLARE Second : STRING\nINPUT First\nINPUT Second\n",
      { inputs: ["A", "B"] },
    );
    expect(obs.inputRequests).toEqual(["First", "Second"]);
  });

  it("records no input requests for a program with no INPUT statements", async () => {
    const obs = await observeRun("DECLARE X : INTEGER\nX <- 1\nOUTPUT X\n");
    expect(obs.inputRequests).toEqual([]);
  });

  it("reports a runtime error instead of throwing", async () => {
    const obs = await observeRun("DECLARE X : INTEGER\nX <- 1 / 0\n");
    expect(obs.completed).toBe(false);
    expect(obs.error).toBeDefined();
  });

  it("reports a parse error without running anything", async () => {
    const obs = await observeRun("DECLARE X INTEGER\n");
    expect(obs.completed).toBe(false);
    expect(obs.steps).toEqual([]);
  });
});
