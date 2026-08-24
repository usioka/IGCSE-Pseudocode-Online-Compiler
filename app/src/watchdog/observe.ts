// Headless run observer for the watchdog.
//
// The interpreter (app/src/interpreter/core/interpreter.ts) exposes no
// call/assignment hook and no queryable "give me the current variables" API —
// its only observation points are the InterpreterCallbacks (onOutput,
// onTrace, ...). app/src/interpreter/useInterpreter.ts turns those into React
// state; this module does the non-React equivalent, turning them into one
// RunObservation the watchdog visitor can inspect after the run finishes.
// New, independent file — does not import from or modify anything under
// app/src/interpreter/ beyond its published public surface (index.ts,
// core/types.ts).

import { Interpreter, parse } from '../interpreter';
import type { DebugVariable, PseudocodeError } from '../interpreter';

export interface ObservedStep {
  /** Source line of the statement that executed. */
  line: number;
  /** Variable state immediately after the statement executed. */
  variables: DebugVariable[];
  /** Output emitted by this statement, if any (may span multiple OUTPUT calls). */
  output: string[];
}

export interface RunObservation {
  /** One entry per executed statement, in execution order. */
  steps: ObservedStep[];
  /** Every OUTPUT call's text, concatenated in execution order. */
  fullOutput: string;
  /** Every INPUT request's target variable name, in execution order. */
  inputRequests: string[];
  /** True if the run finished (including cancellation) without an uncaught error. */
  completed: boolean;
  /** The error that ended the run, if execution threw one. */
  error?: PseudocodeError;
}

export interface ObserveOptions {
  /** Values fed to INPUT requests in order. Missing requests get ''. */
  inputs?: string[];
  /** Aborts the run after this many ms, so a runaway/infinite-loop program can't hang the watchdog. Default 5000. */
  timeoutMs?: number;
}

export async function observeRun(source: string, options: ObserveOptions = {}): Promise<RunObservation> {
  const { tree, errors } = parse(source);
  if (!tree || errors.length > 0) {
    return {
      steps: [],
      fullOutput: '',
      inputRequests: [],
      completed: false,
      error: errors[0],
    };
  }

  const inputs = [...(options.inputs ?? [])];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);

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
        // Interpreter.requestInput() fires this callback *before* it wires up
        // the resolver that provideInput() needs (it calls onInputRequest,
        // then constructs the Promise that assigns inputResolver) — so
        // providing the value must be deferred to the next microtask.
        queueMicrotask(() => interpreter.provideInput(inputs.shift() ?? ''));
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

  return { steps, fullOutput: outputChunks.join(''), inputRequests, completed, error };
}
