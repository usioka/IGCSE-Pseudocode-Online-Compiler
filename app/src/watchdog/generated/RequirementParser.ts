// Generated from src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { RequirementListener } from "./RequirementListener.js";
import { RequirementVisitor } from "./RequirementVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
 
type int = number;


export class RequirementParser extends antlr.Parser {
    public static readonly MUST = 1;
    public static readonly IF = 2;
    public static readonly OFFER = 3;
    public static readonly POSSIBILITY = 4;
    public static readonly TO = 5;
    public static readonly COMMA = 6;
    public static readonly PERIOD = 7;
    public static readonly WORD = 8;
    public static readonly NEWLINE = 9;
    public static readonly WS = 10;
    public static readonly LINE_COMMENT = 11;
    public static readonly RULE_document = 0;
    public static readonly RULE_requirement = 1;
    public static readonly RULE_phrase = 2;

    public static readonly literalNames = [
        null, null, null, null, null, null, "','", "'.'"
    ];

    public static readonly symbolicNames = [
        null, "MUST", "IF", "OFFER", "POSSIBILITY", "TO", "COMMA", "PERIOD", 
        "WORD", "NEWLINE", "WS", "LINE_COMMENT"
    ];
    public static readonly ruleNames = [
        "document", "requirement", "phrase",
    ];

    public get grammarFileName(): string { return "Requirement.g4"; }
    public get literalNames(): (string | null)[] { return RequirementParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return RequirementParser.symbolicNames; }
    public get ruleNames(): string[] { return RequirementParser.ruleNames; }
    public get serializedATN(): number[] { return RequirementParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, RequirementParser._ATN, RequirementParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public document(): DocumentContext {
        const localContext = new DocumentContext(this.context, this.state);
        this.enterRule(localContext, 0, RequirementParser.RULE_document);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 9;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 6;
                    this.match(RequirementParser.NEWLINE);
                    }
                    }
                }
                this.state = 11;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            }
            this.state = 25;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 2 || _la === 8) {
                {
                this.state = 12;
                this.requirement();
                this.state = 22;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 16;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        while (_la === 9) {
                            {
                            {
                            this.state = 13;
                            this.match(RequirementParser.NEWLINE);
                            }
                            }
                            this.state = 18;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        }
                        this.state = 19;
                        this.requirement();
                        }
                        }
                    }
                    this.state = 24;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 30;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 9) {
                {
                {
                this.state = 27;
                this.match(RequirementParser.NEWLINE);
                }
                }
                this.state = 32;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 33;
            this.match(RequirementParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public requirement(): RequirementContext {
        let localContext = new RequirementContext(this.context, this.state);
        this.enterRule(localContext, 2, RequirementParser.RULE_requirement);
        let _la: number;
        try {
            this.state = 63;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 7, this.context) ) {
            case 1:
                localContext = new AutonomousActivityContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 39;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 2) {
                    {
                    this.state = 35;
                    this.match(RequirementParser.IF);
                    this.state = 36;
                    (localContext as AutonomousActivityContext)._condition = this.phrase();
                    this.state = 37;
                    this.match(RequirementParser.COMMA);
                    }
                }

                this.state = 41;
                (localContext as AutonomousActivityContext)._subject = this.phrase();
                this.state = 42;
                this.match(RequirementParser.MUST);
                this.state = 43;
                (localContext as AutonomousActivityContext)._verb = this.match(RequirementParser.WORD);
                this.state = 44;
                (localContext as AutonomousActivityContext)._object = this.match(RequirementParser.WORD);
                this.state = 45;
                this.match(RequirementParser.PERIOD);
                }
                break;
            case 2:
                localContext = new UserInteractionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 51;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 2) {
                    {
                    this.state = 47;
                    this.match(RequirementParser.IF);
                    this.state = 48;
                    (localContext as UserInteractionContext)._condition = this.phrase();
                    this.state = 49;
                    this.match(RequirementParser.COMMA);
                    }
                }

                this.state = 53;
                (localContext as UserInteractionContext)._subject = this.phrase();
                this.state = 54;
                this.match(RequirementParser.MUST);
                this.state = 55;
                this.match(RequirementParser.OFFER);
                this.state = 56;
                (localContext as UserInteractionContext)._recipient = this.phrase();
                this.state = 57;
                this.match(RequirementParser.POSSIBILITY);
                this.state = 58;
                this.match(RequirementParser.TO);
                this.state = 59;
                (localContext as UserInteractionContext)._verb = this.match(RequirementParser.WORD);
                this.state = 60;
                (localContext as UserInteractionContext)._object = this.match(RequirementParser.WORD);
                this.state = 61;
                this.match(RequirementParser.PERIOD);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public phrase(): PhraseContext {
        const localContext = new PhraseContext(this.context, this.state);
        this.enterRule(localContext, 4, RequirementParser.RULE_phrase);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 66;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 65;
                this.match(RequirementParser.WORD);
                }
                }
                this.state = 68;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 8);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,11,71,2,0,7,0,2,1,7,1,2,2,7,2,1,0,5,0,8,8,0,10,0,12,0,11,9,0,
        1,0,1,0,5,0,15,8,0,10,0,12,0,18,9,0,1,0,5,0,21,8,0,10,0,12,0,24,
        9,0,3,0,26,8,0,1,0,5,0,29,8,0,10,0,12,0,32,9,0,1,0,1,0,1,1,1,1,1,
        1,1,1,3,1,40,8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,52,
        8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,64,8,1,1,2,4,2,67,
        8,2,11,2,12,2,68,1,2,0,0,3,0,2,4,0,0,76,0,9,1,0,0,0,2,63,1,0,0,0,
        4,66,1,0,0,0,6,8,5,9,0,0,7,6,1,0,0,0,8,11,1,0,0,0,9,7,1,0,0,0,9,
        10,1,0,0,0,10,25,1,0,0,0,11,9,1,0,0,0,12,22,3,2,1,0,13,15,5,9,0,
        0,14,13,1,0,0,0,15,18,1,0,0,0,16,14,1,0,0,0,16,17,1,0,0,0,17,19,
        1,0,0,0,18,16,1,0,0,0,19,21,3,2,1,0,20,16,1,0,0,0,21,24,1,0,0,0,
        22,20,1,0,0,0,22,23,1,0,0,0,23,26,1,0,0,0,24,22,1,0,0,0,25,12,1,
        0,0,0,25,26,1,0,0,0,26,30,1,0,0,0,27,29,5,9,0,0,28,27,1,0,0,0,29,
        32,1,0,0,0,30,28,1,0,0,0,30,31,1,0,0,0,31,33,1,0,0,0,32,30,1,0,0,
        0,33,34,5,0,0,1,34,1,1,0,0,0,35,36,5,2,0,0,36,37,3,4,2,0,37,38,5,
        6,0,0,38,40,1,0,0,0,39,35,1,0,0,0,39,40,1,0,0,0,40,41,1,0,0,0,41,
        42,3,4,2,0,42,43,5,1,0,0,43,44,5,8,0,0,44,45,5,8,0,0,45,46,5,7,0,
        0,46,64,1,0,0,0,47,48,5,2,0,0,48,49,3,4,2,0,49,50,5,6,0,0,50,52,
        1,0,0,0,51,47,1,0,0,0,51,52,1,0,0,0,52,53,1,0,0,0,53,54,3,4,2,0,
        54,55,5,1,0,0,55,56,5,3,0,0,56,57,3,4,2,0,57,58,5,4,0,0,58,59,5,
        5,0,0,59,60,5,8,0,0,60,61,5,8,0,0,61,62,5,7,0,0,62,64,1,0,0,0,63,
        39,1,0,0,0,63,51,1,0,0,0,64,3,1,0,0,0,65,67,5,8,0,0,66,65,1,0,0,
        0,67,68,1,0,0,0,68,66,1,0,0,0,68,69,1,0,0,0,69,5,1,0,0,0,9,9,16,
        22,25,30,39,51,63,68
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!RequirementParser.__ATN) {
            RequirementParser.__ATN = new antlr.ATNDeserializer().deserialize(RequirementParser._serializedATN);
        }

        return RequirementParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(RequirementParser.literalNames, RequirementParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return RequirementParser.vocabulary;
    }

    private static readonly decisionsToDFA = RequirementParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class DocumentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(RequirementParser.EOF, 0)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(RequirementParser.NEWLINE);
    	} else {
    		return this.getToken(RequirementParser.NEWLINE, i);
    	}
    }
    public requirement(): RequirementContext[];
    public requirement(i: number): RequirementContext | null;
    public requirement(i?: number): RequirementContext[] | RequirementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RequirementContext);
        }

        return this.getRuleContext(i, RequirementContext);
    }
    public override get ruleIndex(): number {
        return RequirementParser.RULE_document;
    }
    public override enterRule(listener: RequirementListener): void {
        if(listener.enterDocument) {
             listener.enterDocument(this);
        }
    }
    public override exitRule(listener: RequirementListener): void {
        if(listener.exitDocument) {
             listener.exitDocument(this);
        }
    }
    public override accept<Result>(visitor: RequirementVisitor<Result>): Result | null {
        if (visitor.visitDocument) {
            return visitor.visitDocument(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RequirementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return RequirementParser.RULE_requirement;
    }
    public override copyFrom(ctx: RequirementContext): void {
        super.copyFrom(ctx);
    }
}
export class AutonomousActivityContext extends RequirementContext {
    public _condition?: PhraseContext;
    public _subject?: PhraseContext;
    public _verb?: Token | null;
    public _object?: Token | null;
    public constructor(ctx: RequirementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MUST(): antlr.TerminalNode {
        return this.getToken(RequirementParser.MUST, 0)!;
    }
    public PERIOD(): antlr.TerminalNode {
        return this.getToken(RequirementParser.PERIOD, 0)!;
    }
    public phrase(): PhraseContext[];
    public phrase(i: number): PhraseContext | null;
    public phrase(i?: number): PhraseContext[] | PhraseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PhraseContext);
        }

        return this.getRuleContext(i, PhraseContext);
    }
    public WORD(): antlr.TerminalNode[];
    public WORD(i: number): antlr.TerminalNode | null;
    public WORD(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(RequirementParser.WORD);
    	} else {
    		return this.getToken(RequirementParser.WORD, i);
    	}
    }
    public IF(): antlr.TerminalNode | null {
        return this.getToken(RequirementParser.IF, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(RequirementParser.COMMA, 0);
    }
    public override enterRule(listener: RequirementListener): void {
        if(listener.enterAutonomousActivity) {
             listener.enterAutonomousActivity(this);
        }
    }
    public override exitRule(listener: RequirementListener): void {
        if(listener.exitAutonomousActivity) {
             listener.exitAutonomousActivity(this);
        }
    }
    public override accept<Result>(visitor: RequirementVisitor<Result>): Result | null {
        if (visitor.visitAutonomousActivity) {
            return visitor.visitAutonomousActivity(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class UserInteractionContext extends RequirementContext {
    public _condition?: PhraseContext;
    public _subject?: PhraseContext;
    public _recipient?: PhraseContext;
    public _verb?: Token | null;
    public _object?: Token | null;
    public constructor(ctx: RequirementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MUST(): antlr.TerminalNode {
        return this.getToken(RequirementParser.MUST, 0)!;
    }
    public OFFER(): antlr.TerminalNode {
        return this.getToken(RequirementParser.OFFER, 0)!;
    }
    public POSSIBILITY(): antlr.TerminalNode {
        return this.getToken(RequirementParser.POSSIBILITY, 0)!;
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(RequirementParser.TO, 0)!;
    }
    public PERIOD(): antlr.TerminalNode {
        return this.getToken(RequirementParser.PERIOD, 0)!;
    }
    public phrase(): PhraseContext[];
    public phrase(i: number): PhraseContext | null;
    public phrase(i?: number): PhraseContext[] | PhraseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PhraseContext);
        }

        return this.getRuleContext(i, PhraseContext);
    }
    public WORD(): antlr.TerminalNode[];
    public WORD(i: number): antlr.TerminalNode | null;
    public WORD(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(RequirementParser.WORD);
    	} else {
    		return this.getToken(RequirementParser.WORD, i);
    	}
    }
    public IF(): antlr.TerminalNode | null {
        return this.getToken(RequirementParser.IF, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(RequirementParser.COMMA, 0);
    }
    public override enterRule(listener: RequirementListener): void {
        if(listener.enterUserInteraction) {
             listener.enterUserInteraction(this);
        }
    }
    public override exitRule(listener: RequirementListener): void {
        if(listener.exitUserInteraction) {
             listener.exitUserInteraction(this);
        }
    }
    public override accept<Result>(visitor: RequirementVisitor<Result>): Result | null {
        if (visitor.visitUserInteraction) {
            return visitor.visitUserInteraction(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PhraseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WORD(): antlr.TerminalNode[];
    public WORD(i: number): antlr.TerminalNode | null;
    public WORD(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(RequirementParser.WORD);
    	} else {
    		return this.getToken(RequirementParser.WORD, i);
    	}
    }
    public override get ruleIndex(): number {
        return RequirementParser.RULE_phrase;
    }
    public override enterRule(listener: RequirementListener): void {
        if(listener.enterPhrase) {
             listener.enterPhrase(this);
        }
    }
    public override exitRule(listener: RequirementListener): void {
        if(listener.exitPhrase) {
             listener.exitPhrase(this);
        }
    }
    public override accept<Result>(visitor: RequirementVisitor<Result>): Result | null {
        if (visitor.visitPhrase) {
            return visitor.visitPhrase(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
