// Generated from src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { DocumentContext } from "./RequirementParser.js";
import { AutonomousActivityContext } from "./RequirementParser.js";
import { UserInteractionContext } from "./RequirementParser.js";
import { PhraseContext } from "./RequirementParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `RequirementParser`.
 */
export class RequirementListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `RequirementParser.document`.
     * @param ctx the parse tree
     */
    enterDocument?: (ctx: DocumentContext) => void;
    /**
     * Exit a parse tree produced by `RequirementParser.document`.
     * @param ctx the parse tree
     */
    exitDocument?: (ctx: DocumentContext) => void;
    /**
     * Enter a parse tree produced by the `autonomousActivity`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     */
    enterAutonomousActivity?: (ctx: AutonomousActivityContext) => void;
    /**
     * Exit a parse tree produced by the `autonomousActivity`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     */
    exitAutonomousActivity?: (ctx: AutonomousActivityContext) => void;
    /**
     * Enter a parse tree produced by the `userInteraction`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     */
    enterUserInteraction?: (ctx: UserInteractionContext) => void;
    /**
     * Exit a parse tree produced by the `userInteraction`
     * labeled alternative in `RequirementParser.requirement`.
     * @param ctx the parse tree
     */
    exitUserInteraction?: (ctx: UserInteractionContext) => void;
    /**
     * Enter a parse tree produced by `RequirementParser.phrase`.
     * @param ctx the parse tree
     */
    enterPhrase?: (ctx: PhraseContext) => void;
    /**
     * Exit a parse tree produced by `RequirementParser.phrase`.
     * @param ctx the parse tree
     */
    exitPhrase?: (ctx: PhraseContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

