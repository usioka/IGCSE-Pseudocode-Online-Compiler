import {
  CharStream,
  CommonTokenStream,
  BaseErrorListener,
  RecognitionException,
  Recognizer,
  Token,
  ATNSimulator,
} from "antlr4ng";
import { RequirementLexer } from "./generated/RequirementLexer";
import {
  RequirementParser,
  DocumentContext,
} from "./generated/RequirementParser";

export class RequirementSyntaxError {
  constructor(
    public message: string,
    public line: number,
    public column: number,
  ) {}
}

class CollectingErrorListener extends BaseErrorListener {
  errors: RequirementSyntaxError[] = [];

  override syntaxError<S extends Token, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    _offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push(new RequirementSyntaxError(msg, line, charPositionInLine));
  }
}

export interface RequirementParseResult {
  tree: DocumentContext;
  errors: RequirementSyntaxError[];
}

export function parseRequirement(source: string): RequirementParseResult {
  const input = source.endsWith("\n") ? source : source + "\n";

  const chars = CharStream.fromString(input);
  const lexer = new RequirementLexer(chars);

  const errorListener = new CollectingErrorListener();
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);

  const tokens = new CommonTokenStream(lexer);
  const parser = new RequirementParser(tokens);

  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.document();

  return { tree, errors: errorListener.errors };
}
