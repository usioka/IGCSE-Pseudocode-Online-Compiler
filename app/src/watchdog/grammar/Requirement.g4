grammar Requirement;

// Grammar for SOPHIST must-requirements, built with the FunktionsMASTeR
// sentence template (Rupp & die SOPHISTen, "Requirements-Engineering und
// -Management", 2021). This file is new, independent code — it is not part
// of, and does not modify, Pseudocode.g4; see app/src/watchdog/ for why.
//
// SOPHIST defines three restriction types per requirement: must / should /
// will. Only "must" is in scope here — SOPHIST itself defines must as the
// sole mandatory, non-optional type, and this thesis only builds watchdogs
// for must-requirements. should/will requirements are rejected by this
// grammar (MUST is the only modal keyword it recognizes).
//
// Of FunktionsMASTeR's three functionality types, this grammar covers
// Type 1 ("autonomous system activity") and Type 2 ("user interaction").
// Type 3 ("interface requirement") is out of scope — see app/src/watchdog/
// for why (this compiler has no model of an external system triggering
// anything, so it isn't yet established that it's checkable at all).
//
// Type 1 skeleton: <subject> must <verb> <object>, with an optional leading
// condition clause: "If <condition>, <subject> must <verb> <object>."
// e.g. "If the sensor detects motion, the System must LogEvent Motion."
//
// Type 2 skeleton: <subject> must offer <recipient> the possibility to
// <verb> <object>, with the same optional leading condition clause.
// e.g. "The Smart-Home-System must offer the authorized person the
// possibility to open Door."
// "offer" is a fixed keyword, not the requirement's verb — it's part of the
// template itself (SOPHIST's German original: "bietet ... die Möglichkeit",
// "offers ... the possibility"), confirmed against the worked example in
// foundation_sophist.txt (the chapter's own paraphrased skeleton bullet
// drops the word, but the worked example directly below it includes it).
//
// verb and object are each a single WORD token so they can bind directly to
// an identifier (a variable, procedure, or function name) in the pseudocode
// program the watchdog checks against — not a free multi-word noun phrase.
// "the door" is not a legal object here; write the identifier it refers to,
// e.g. "Door". subject, recipient, and the condition clause stay free
// natural-language text, since they describe the system/person under test
// rather than a program element the watchdog binds to.
//
// Deliberate parse edge: POSSIBILITY, OFFER and TO are reserved keywords (see
// below), so — like MUST/IF already were — those exact words can't appear as
// ordinary prose inside subject/condition/recipient. "the" stays unreserved
// (reserving it too would break starting every subject with "The ..."), so a
// recipient phrase greedily swallows the connector's leading "the" as
// trailing text (e.g. recipient ends up as "the authorized person the", not
// "the authorized person") — harmless, since recipient is descriptive only
// and the watchdog never binds to it.

// ─── Parser Rules ───────────────────────────────────────────────────────────

document
    : NEWLINE* (requirement (NEWLINE* requirement)*)? NEWLINE* EOF
    ;

requirement
    : (IF condition=phrase COMMA)? subject=phrase MUST verb=WORD object=WORD PERIOD                                                        # autonomousActivity
    | (IF condition=phrase COMMA)? subject=phrase MUST OFFER recipient=phrase POSSIBILITY TO verb=WORD object=WORD PERIOD                  # userInteraction
    ;

phrase
    : WORD+
    ;

// ─── Lexer Rules ────────────────────────────────────────────────────────────

MUST       : M U S T ;
IF         : I F ;
OFFER      : O F F E R ;
POSSIBILITY: P O S S I B I L I T Y ;
TO         : T O ;

COMMA  : ',' ;
PERIOD : '.' ;

// Same character class as Pseudocode.g4's IDENTIFIER (LETTER (LETTER|DIGIT|'_')*),
// plus '-' so compound subject names like "Smart-Home-System" lex as one WORD.
WORD : LETTER (LETTER | DIGIT | '_' | '-')* ;

NEWLINE      : '\r'? '\n' ;
WS           : [ \t]+ -> skip ;
LINE_COMMENT : '//' ~[\r\n]* -> skip ;

// ─── Fragments ──────────────────────────────────────────────────────────────

fragment DIGIT  : [0-9] ;
fragment LETTER : [a-zA-Z] ;
fragment B : [bB] ; fragment E : [eE] ; fragment F : [fF] ; fragment I : [iI] ;
fragment L : [lL] ; fragment M : [mM] ; fragment O : [oO] ; fragment P : [pP] ;
fragment R : [rR] ; fragment S : [sS] ; fragment T : [tT] ; fragment U : [uU] ;
fragment Y : [yY] ;
