// Generated from src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { DocumentContext } from "./RequirementParser.js";
import { AutonomousActivityContext } from "./RequirementParser.js";
import { UserInteractionContext } from "./RequirementParser.js";
import { PhraseContext } from "./RequirementParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `RequirementParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class RequirementVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `RequirementParser.document`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDocument?: (ctx: DocumentContext) => Result;
    /**
     * Visit a parse tree produced by the `autonomousActivity`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAutonomousActivity?: (ctx: AutonomousActivityContext) => Result;
    /**
     * Visit a parse tree produced by the `userInteraction`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUserInteraction?: (ctx: UserInteractionContext) => Result;
    /**
     * Visit a parse tree produced by `RequirementParser.phrase`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPhrase?: (ctx: PhraseContext) => Result;
}

