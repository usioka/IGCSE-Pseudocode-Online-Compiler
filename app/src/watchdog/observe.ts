import { Interpreter, parse } from "../interpreter";
import type { DebugVariable, PseudocodeError } from "../interpreter";

export interface ObservedStep {
  line: number;
  variables: DebugVariable[];
  output: string[];
}

export interface RunObservation {
  steps: ObservedStep[];
  fullOutput: string;
  inputRequests: string[];
  completed: boolean;
  error?: PseudocodeError;
}

export interface ObserveOptions {
  inputs?: string[];
  timeoutMs?: number;
}

export async function observeRun(
  source: string,
  options: ObserveOptions = {},
): Promise<RunObservation> {
  const { tree, errors } = parse(source);
  if (!tree || errors.length > 0) {
    return {
      steps: [],
      fullOutput: "",
      inputRequests: [],
      completed: false,
      error: errors[0],
    };
  }

  const inputs = [...(options.inputs ?? [])];
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 5000,
  );

  const steps: ObservedStep[] = [];
  const outputChunks: string[] = [];
  const inputRequests: string[] = [];
  let pendingOutput: string[] = [];

  const interpreter = new Interpreter(
    {
      onOutput(text: string) {
        outputChunks.push(text);
        pendingOutput.push(text);
      },
      onInputRequest(variableName: string) {
        inputRequests.push(variableName);
        queueMicrotask(() => interpreter.provideInput(inputs.shift() ?? ""));
      },
      onInputComplete() {},
      onComplete() {},
      onError() {},
      onTrace(line: number, variables: DebugVariable[]) {
        steps.push({ line, variables, output: pendingOutput });
        pendingOutput = [];
      },
    },
    controller.signal,
  );
  interpreter.setTraceMode(true);

  let error: PseudocodeError | undefined;
  let completed = true;
  try {
    await interpreter.execute(tree);
  } catch (e) {
    completed = false;
    error = e instanceof Error ? (e as PseudocodeError) : undefined;
  } finally {
    clearTimeout(timeout);
  }

  return {
    steps,
    fullOutput: outputChunks.join(""),
    inputRequests,
    completed,
    error,
  };
}
