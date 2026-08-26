// Generated from /home/usio0/Documents/TUD/Bachelor/IGCSE-Pseudocode-Online-Compiler/app/src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class RequirementLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		MUST=1, IF=2, OFFER=3, POSSIBILITY=4, TO=5, COMMA=6, PERIOD=7, WORD=8, 
		NEWLINE=9, WS=10, LINE_COMMENT=11;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"MUST", "IF", "OFFER", "POSSIBILITY", "TO", "COMMA", "PERIOD", "WORD", 
			"NEWLINE", "WS", "LINE_COMMENT", "DIGIT", "LETTER", "B", "E", "F", "I", 
			"L", "M", "O", "P", "R", "S", "T", "U", "Y"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, "','", "'.'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "MUST", "IF", "OFFER", "POSSIBILITY", "TO", "COMMA", "PERIOD", 
			"WORD", "NEWLINE", "WS", "LINE_COMMENT"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public RequirementLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "Requirement.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u000b\u0094\u0006\uffff\uffff\u0002\u0000\u0007\u0000\u0002"+
		"\u0001\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002"+
		"\u0004\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002"+
		"\u0007\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002"+
		"\u000b\u0007\u000b\u0002\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e"+
		"\u0002\u000f\u0007\u000f\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011"+
		"\u0002\u0012\u0007\u0012\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014"+
		"\u0002\u0015\u0007\u0015\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017"+
		"\u0002\u0018\u0007\u0018\u0002\u0019\u0007\u0019\u0001\u0000\u0001\u0000"+
		"\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0006"+
		"\u0001\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0005\u0007"+
		"[\b\u0007\n\u0007\f\u0007^\t\u0007\u0001\b\u0003\ba\b\b\u0001\b\u0001"+
		"\b\u0001\t\u0004\tf\b\t\u000b\t\f\tg\u0001\t\u0001\t\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0005\np\b\n\n\n\f\ns\t\n\u0001\n\u0001\n\u0001\u000b\u0001"+
		"\u000b\u0001\f\u0001\f\u0001\r\u0001\r\u0001\u000e\u0001\u000e\u0001\u000f"+
		"\u0001\u000f\u0001\u0010\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0012"+
		"\u0001\u0012\u0001\u0013\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0015"+
		"\u0001\u0015\u0001\u0016\u0001\u0016\u0001\u0017\u0001\u0017\u0001\u0018"+
		"\u0001\u0018\u0001\u0019\u0001\u0019\u0000\u0000\u001a\u0001\u0001\u0003"+
		"\u0002\u0005\u0003\u0007\u0004\t\u0005\u000b\u0006\r\u0007\u000f\b\u0011"+
		"\t\u0013\n\u0015\u000b\u0017\u0000\u0019\u0000\u001b\u0000\u001d\u0000"+
		"\u001f\u0000!\u0000#\u0000%\u0000\'\u0000)\u0000+\u0000-\u0000/\u0000"+
		"1\u00003\u0000\u0001\u0000\u0012\u0002\u0000--__\u0002\u0000\t\t  \u0002"+
		"\u0000\n\n\r\r\u0001\u000009\u0002\u0000AZaz\u0002\u0000BBbb\u0002\u0000"+
		"EEee\u0002\u0000FFff\u0002\u0000IIii\u0002\u0000LLll\u0002\u0000MMmm\u0002"+
		"\u0000OOoo\u0002\u0000PPpp\u0002\u0000RRrr\u0002\u0000SSss\u0002\u0000"+
		"TTtt\u0002\u0000UUuu\u0002\u0000YYyy\u008a\u0000\u0001\u0001\u0000\u0000"+
		"\u0000\u0000\u0003\u0001\u0000\u0000\u0000\u0000\u0005\u0001\u0000\u0000"+
		"\u0000\u0000\u0007\u0001\u0000\u0000\u0000\u0000\t\u0001\u0000\u0000\u0000"+
		"\u0000\u000b\u0001\u0000\u0000\u0000\u0000\r\u0001\u0000\u0000\u0000\u0000"+
		"\u000f\u0001\u0000\u0000\u0000\u0000\u0011\u0001\u0000\u0000\u0000\u0000"+
		"\u0013\u0001\u0000\u0000\u0000\u0000\u0015\u0001\u0000\u0000\u0000\u0001"+
		"5\u0001\u0000\u0000\u0000\u0003:\u0001\u0000\u0000\u0000\u0005=\u0001"+
		"\u0000\u0000\u0000\u0007C\u0001\u0000\u0000\u0000\tO\u0001\u0000\u0000"+
		"\u0000\u000bR\u0001\u0000\u0000\u0000\rT\u0001\u0000\u0000\u0000\u000f"+
		"V\u0001\u0000\u0000\u0000\u0011`\u0001\u0000\u0000\u0000\u0013e\u0001"+
		"\u0000\u0000\u0000\u0015k\u0001\u0000\u0000\u0000\u0017v\u0001\u0000\u0000"+
		"\u0000\u0019x\u0001\u0000\u0000\u0000\u001bz\u0001\u0000\u0000\u0000\u001d"+
		"|\u0001\u0000\u0000\u0000\u001f~\u0001\u0000\u0000\u0000!\u0080\u0001"+
		"\u0000\u0000\u0000#\u0082\u0001\u0000\u0000\u0000%\u0084\u0001\u0000\u0000"+
		"\u0000\'\u0086\u0001\u0000\u0000\u0000)\u0088\u0001\u0000\u0000\u0000"+
		"+\u008a\u0001\u0000\u0000\u0000-\u008c\u0001\u0000\u0000\u0000/\u008e"+
		"\u0001\u0000\u0000\u00001\u0090\u0001\u0000\u0000\u00003\u0092\u0001\u0000"+
		"\u0000\u000056\u0003%\u0012\u000067\u00031\u0018\u000078\u0003-\u0016"+
		"\u000089\u0003/\u0017\u00009\u0002\u0001\u0000\u0000\u0000:;\u0003!\u0010"+
		"\u0000;<\u0003\u001f\u000f\u0000<\u0004\u0001\u0000\u0000\u0000=>\u0003"+
		"\'\u0013\u0000>?\u0003\u001f\u000f\u0000?@\u0003\u001f\u000f\u0000@A\u0003"+
		"\u001d\u000e\u0000AB\u0003+\u0015\u0000B\u0006\u0001\u0000\u0000\u0000"+
		"CD\u0003)\u0014\u0000DE\u0003\'\u0013\u0000EF\u0003-\u0016\u0000FG\u0003"+
		"-\u0016\u0000GH\u0003!\u0010\u0000HI\u0003\u001b\r\u0000IJ\u0003!\u0010"+
		"\u0000JK\u0003#\u0011\u0000KL\u0003!\u0010\u0000LM\u0003/\u0017\u0000"+
		"MN\u00033\u0019\u0000N\b\u0001\u0000\u0000\u0000OP\u0003/\u0017\u0000"+
		"PQ\u0003\'\u0013\u0000Q\n\u0001\u0000\u0000\u0000RS\u0005,\u0000\u0000"+
		"S\f\u0001\u0000\u0000\u0000TU\u0005.\u0000\u0000U\u000e\u0001\u0000\u0000"+
		"\u0000V\\\u0003\u0019\f\u0000W[\u0003\u0019\f\u0000X[\u0003\u0017\u000b"+
		"\u0000Y[\u0007\u0000\u0000\u0000ZW\u0001\u0000\u0000\u0000ZX\u0001\u0000"+
		"\u0000\u0000ZY\u0001\u0000\u0000\u0000[^\u0001\u0000\u0000\u0000\\Z\u0001"+
		"\u0000\u0000\u0000\\]\u0001\u0000\u0000\u0000]\u0010\u0001\u0000\u0000"+
		"\u0000^\\\u0001\u0000\u0000\u0000_a\u0005\r\u0000\u0000`_\u0001\u0000"+
		"\u0000\u0000`a\u0001\u0000\u0000\u0000ab\u0001\u0000\u0000\u0000bc\u0005"+
		"\n\u0000\u0000c\u0012\u0001\u0000\u0000\u0000df\u0007\u0001\u0000\u0000"+
		"ed\u0001\u0000\u0000\u0000fg\u0001\u0000\u0000\u0000ge\u0001\u0000\u0000"+
		"\u0000gh\u0001\u0000\u0000\u0000hi\u0001\u0000\u0000\u0000ij\u0006\t\u0000"+
		"\u0000j\u0014\u0001\u0000\u0000\u0000kl\u0005/\u0000\u0000lm\u0005/\u0000"+
		"\u0000mq\u0001\u0000\u0000\u0000np\b\u0002\u0000\u0000on\u0001\u0000\u0000"+
		"\u0000ps\u0001\u0000\u0000\u0000qo\u0001\u0000\u0000\u0000qr\u0001\u0000"+
		"\u0000\u0000rt\u0001\u0000\u0000\u0000sq\u0001\u0000\u0000\u0000tu\u0006"+
		"\n\u0000\u0000u\u0016\u0001\u0000\u0000\u0000vw\u0007\u0003\u0000\u0000"+
		"w\u0018\u0001\u0000\u0000\u0000xy\u0007\u0004\u0000\u0000y\u001a\u0001"+
		"\u0000\u0000\u0000z{\u0007\u0005\u0000\u0000{\u001c\u0001\u0000\u0000"+
		"\u0000|}\u0007\u0006\u0000\u0000}\u001e\u0001\u0000\u0000\u0000~\u007f"+
		"\u0007\u0007\u0000\u0000\u007f \u0001\u0000\u0000\u0000\u0080\u0081\u0007"+
		"\b\u0000\u0000\u0081\"\u0001\u0000\u0000\u0000\u0082\u0083\u0007\t\u0000"+
		"\u0000\u0083$\u0001\u0000\u0000\u0000\u0084\u0085\u0007\n\u0000\u0000"+
		"\u0085&\u0001\u0000\u0000\u0000\u0086\u0087\u0007\u000b\u0000\u0000\u0087"+
		"(\u0001\u0000\u0000\u0000\u0088\u0089\u0007\f\u0000\u0000\u0089*\u0001"+
		"\u0000\u0000\u0000\u008a\u008b\u0007\r\u0000\u0000\u008b,\u0001\u0000"+
		"\u0000\u0000\u008c\u008d\u0007\u000e\u0000\u0000\u008d.\u0001\u0000\u0000"+
		"\u0000\u008e\u008f\u0007\u000f\u0000\u0000\u008f0\u0001\u0000\u0000\u0000"+
		"\u0090\u0091\u0007\u0010\u0000\u0000\u00912\u0001\u0000\u0000\u0000\u0092"+
		"\u0093\u0007\u0011\u0000\u0000\u00934\u0001\u0000\u0000\u0000\u0006\u0000"+
		"Z\\`gq\u0001\u0006\u0000\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}