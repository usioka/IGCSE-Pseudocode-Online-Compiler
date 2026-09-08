grammar Requirement;

// Grammar for SOPHIST must-requirements, Type 1 and 2

document
    : NEWLINE* (requirement (NEWLINE* requirement)*)? NEWLINE* EOF
    ;

requirement
    : (condition COMMA)? subject=phrase MUST verb=WORD object=WORD PERIOD                                                        # autonomousActivity
    | (condition COMMA)? subject=phrase MUST OFFER recipient=phrase POSSIBILITY TO verb=WORD object=WORD PERIOD                  # userInteraction
    ;

// BedingungsMASTER (Rupp & die SOPHISTen, ch. 19): three condition types by
// opening word. The condition's own content stays free text (WORD+), same
// as before -- only which keyword opened it is structured.
condition
    : IF text=phrase                    # logicalCondition
    | AS_SOON_AS text=phrase            # eventCondition
    | (AS_LONG_AS | WHILE) text=phrase  # durationCondition
    ;

phrase
    : WORD+
    ;

MUST       : M U S T ;
IF         : I F ;
OFFER      : O F F E R ;
POSSIBILITY: P O S S I B I L I T Y ;
TO         : T O ;
AS_SOON_AS : A S WS_ S O O N WS_ A S ;
AS_LONG_AS : A S WS_ L O N G WS_ A S ;
WHILE      : W H I L E ;

COMMA  : ',' ;
PERIOD : '.' ;

WORD : LETTER (LETTER | DIGIT | '_' | '-')* ;

NEWLINE      : '\r'? '\n' ;
WS           : [ \t]+ -> skip ;
LINE_COMMENT : '//' ~[\r\n]* -> skip ;

fragment DIGIT  : [0-9] ;
fragment LETTER : [a-zA-Z] ;
fragment WS_ : [ \t]+ ;
fragment A : [aA] ; fragment B : [bB] ; fragment E : [eE] ; fragment F : [fF] ;
fragment G : [gG] ; fragment I : [iI] ; fragment L : [lL] ; fragment M : [mM] ;
fragment N : [nN] ; fragment O : [oO] ; fragment P : [pP] ; fragment R : [rR] ;
fragment S : [sS] ; fragment T : [tT] ; fragment U : [uU] ; fragment Y : [yY] ;
fragment H : [hH] ; fragment W : [wW] ;
