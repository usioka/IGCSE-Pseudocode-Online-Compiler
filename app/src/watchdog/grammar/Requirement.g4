grammar Requirement;

// Grammar for SOPHIST must-requirements, Type 1 and 2

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

MUST       : M U S T ;
IF         : I F ;
OFFER      : O F F E R ;
POSSIBILITY: P O S S I B I L I T Y ;
TO         : T O ;

COMMA  : ',' ;
PERIOD : '.' ;

WORD : LETTER (LETTER | DIGIT | '_' | '-')* ;

NEWLINE      : '\r'? '\n' ;
WS           : [ \t]+ -> skip ;
LINE_COMMENT : '//' ~[\r\n]* -> skip ;

fragment DIGIT  : [0-9] ;
fragment LETTER : [a-zA-Z] ;
fragment B : [bB] ; fragment E : [eE] ; fragment F : [fF] ; fragment I : [iI] ;
fragment L : [lL] ; fragment M : [mM] ; fragment O : [oO] ; fragment P : [pP] ;
fragment R : [rR] ; fragment S : [sS] ; fragment T : [tT] ; fragment U : [uU] ;
fragment Y : [yY] ;
