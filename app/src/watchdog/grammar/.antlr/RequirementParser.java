// Generated from /home/usio0/Documents/TUD/Bachelor/IGCSE-Pseudocode-Online-Compiler/app/src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class RequirementParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		MUST=1, IF=2, OFFER=3, POSSIBILITY=4, TO=5, COMMA=6, PERIOD=7, WORD=8, 
		NEWLINE=9, WS=10, LINE_COMMENT=11;
	public static final int
		RULE_document = 0, RULE_requirement = 1, RULE_phrase = 2;
	private static String[] makeRuleNames() {
		return new String[] {
			"document", "requirement", "phrase"
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

	@Override
	public String getGrammarFileName() { return "Requirement.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public RequirementParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DocumentContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(RequirementParser.EOF, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(RequirementParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(RequirementParser.NEWLINE, i);
		}
		public List<RequirementContext> requirement() {
			return getRuleContexts(RequirementContext.class);
		}
		public RequirementContext requirement(int i) {
			return getRuleContext(RequirementContext.class,i);
		}
		public DocumentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_document; }
	}

	public final DocumentContext document() throws RecognitionException {
		DocumentContext _localctx = new DocumentContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_document);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(9);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(6);
					match(NEWLINE);
					}
					} 
				}
				setState(11);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(25);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IF || _la==WORD) {
				{
				setState(12);
				requirement();
				setState(22);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(16);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(13);
							match(NEWLINE);
							}
							}
							setState(18);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(19);
						requirement();
						}
						} 
					}
					setState(24);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(30);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(27);
				match(NEWLINE);
				}
				}
				setState(32);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(33);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RequirementContext extends ParserRuleContext {
		public RequirementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_requirement; }
	 
		public RequirementContext() { }
		public void copyFrom(RequirementContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AutonomousActivityContext extends RequirementContext {
		public PhraseContext condition;
		public PhraseContext subject;
		public Token verb;
		public Token object;
		public TerminalNode MUST() { return getToken(RequirementParser.MUST, 0); }
		public TerminalNode PERIOD() { return getToken(RequirementParser.PERIOD, 0); }
		public List<PhraseContext> phrase() {
			return getRuleContexts(PhraseContext.class);
		}
		public PhraseContext phrase(int i) {
			return getRuleContext(PhraseContext.class,i);
		}
		public List<TerminalNode> WORD() { return getTokens(RequirementParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(RequirementParser.WORD, i);
		}
		public TerminalNode IF() { return getToken(RequirementParser.IF, 0); }
		public TerminalNode COMMA() { return getToken(RequirementParser.COMMA, 0); }
		public AutonomousActivityContext(RequirementContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class UserInteractionContext extends RequirementContext {
		public PhraseContext condition;
		public PhraseContext subject;
		public PhraseContext recipient;
		public Token verb;
		public Token object;
		public TerminalNode MUST() { return getToken(RequirementParser.MUST, 0); }
		public TerminalNode OFFER() { return getToken(RequirementParser.OFFER, 0); }
		public TerminalNode POSSIBILITY() { return getToken(RequirementParser.POSSIBILITY, 0); }
		public TerminalNode TO() { return getToken(RequirementParser.TO, 0); }
		public TerminalNode PERIOD() { return getToken(RequirementParser.PERIOD, 0); }
		public List<PhraseContext> phrase() {
			return getRuleContexts(PhraseContext.class);
		}
		public PhraseContext phrase(int i) {
			return getRuleContext(PhraseContext.class,i);
		}
		public List<TerminalNode> WORD() { return getTokens(RequirementParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(RequirementParser.WORD, i);
		}
		public TerminalNode IF() { return getToken(RequirementParser.IF, 0); }
		public TerminalNode COMMA() { return getToken(RequirementParser.COMMA, 0); }
		public UserInteractionContext(RequirementContext ctx) { copyFrom(ctx); }
	}

	public final RequirementContext requirement() throws RecognitionException {
		RequirementContext _localctx = new RequirementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_requirement);
		int _la;
		try {
			setState(63);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,7,_ctx) ) {
			case 1:
				_localctx = new AutonomousActivityContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(39);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==IF) {
					{
					setState(35);
					match(IF);
					setState(36);
					((AutonomousActivityContext)_localctx).condition = phrase();
					setState(37);
					match(COMMA);
					}
				}

				setState(41);
				((AutonomousActivityContext)_localctx).subject = phrase();
				setState(42);
				match(MUST);
				setState(43);
				((AutonomousActivityContext)_localctx).verb = match(WORD);
				setState(44);
				((AutonomousActivityContext)_localctx).object = match(WORD);
				setState(45);
				match(PERIOD);
				}
				break;
			case 2:
				_localctx = new UserInteractionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(51);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==IF) {
					{
					setState(47);
					match(IF);
					setState(48);
					((UserInteractionContext)_localctx).condition = phrase();
					setState(49);
					match(COMMA);
					}
				}

				setState(53);
				((UserInteractionContext)_localctx).subject = phrase();
				setState(54);
				match(MUST);
				setState(55);
				match(OFFER);
				setState(56);
				((UserInteractionContext)_localctx).recipient = phrase();
				setState(57);
				match(POSSIBILITY);
				setState(58);
				match(TO);
				setState(59);
				((UserInteractionContext)_localctx).verb = match(WORD);
				setState(60);
				((UserInteractionContext)_localctx).object = match(WORD);
				setState(61);
				match(PERIOD);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PhraseContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(RequirementParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(RequirementParser.WORD, i);
		}
		public PhraseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_phrase; }
	}

	public final PhraseContext phrase() throws RecognitionException {
		PhraseContext _localctx = new PhraseContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_phrase);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(66); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(65);
				match(WORD);
				}
				}
				setState(68); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==WORD );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\u0004\u0001\u000bG\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0001\u0000\u0005\u0000\b\b\u0000\n\u0000\f\u0000\u000b"+
		"\t\u0000\u0001\u0000\u0001\u0000\u0005\u0000\u000f\b\u0000\n\u0000\f\u0000"+
		"\u0012\t\u0000\u0001\u0000\u0005\u0000\u0015\b\u0000\n\u0000\f\u0000\u0018"+
		"\t\u0000\u0003\u0000\u001a\b\u0000\u0001\u0000\u0005\u0000\u001d\b\u0000"+
		"\n\u0000\f\u0000 \t\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0003\u0001(\b\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0003\u00014\b\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0003\u0001@\b\u0001\u0001\u0002\u0004\u0002"+
		"C\b\u0002\u000b\u0002\f\u0002D\u0001\u0002\u0000\u0000\u0003\u0000\u0002"+
		"\u0004\u0000\u0000L\u0000\t\u0001\u0000\u0000\u0000\u0002?\u0001\u0000"+
		"\u0000\u0000\u0004B\u0001\u0000\u0000\u0000\u0006\b\u0005\t\u0000\u0000"+
		"\u0007\u0006\u0001\u0000\u0000\u0000\b\u000b\u0001\u0000\u0000\u0000\t"+
		"\u0007\u0001\u0000\u0000\u0000\t\n\u0001\u0000\u0000\u0000\n\u0019\u0001"+
		"\u0000\u0000\u0000\u000b\t\u0001\u0000\u0000\u0000\f\u0016\u0003\u0002"+
		"\u0001\u0000\r\u000f\u0005\t\u0000\u0000\u000e\r\u0001\u0000\u0000\u0000"+
		"\u000f\u0012\u0001\u0000\u0000\u0000\u0010\u000e\u0001\u0000\u0000\u0000"+
		"\u0010\u0011\u0001\u0000\u0000\u0000\u0011\u0013\u0001\u0000\u0000\u0000"+
		"\u0012\u0010\u0001\u0000\u0000\u0000\u0013\u0015\u0003\u0002\u0001\u0000"+
		"\u0014\u0010\u0001\u0000\u0000\u0000\u0015\u0018\u0001\u0000\u0000\u0000"+
		"\u0016\u0014\u0001\u0000\u0000\u0000\u0016\u0017\u0001\u0000\u0000\u0000"+
		"\u0017\u001a\u0001\u0000\u0000\u0000\u0018\u0016\u0001\u0000\u0000\u0000"+
		"\u0019\f\u0001\u0000\u0000\u0000\u0019\u001a\u0001\u0000\u0000\u0000\u001a"+
		"\u001e\u0001\u0000\u0000\u0000\u001b\u001d\u0005\t\u0000\u0000\u001c\u001b"+
		"\u0001\u0000\u0000\u0000\u001d \u0001\u0000\u0000\u0000\u001e\u001c\u0001"+
		"\u0000\u0000\u0000\u001e\u001f\u0001\u0000\u0000\u0000\u001f!\u0001\u0000"+
		"\u0000\u0000 \u001e\u0001\u0000\u0000\u0000!\"\u0005\u0000\u0000\u0001"+
		"\"\u0001\u0001\u0000\u0000\u0000#$\u0005\u0002\u0000\u0000$%\u0003\u0004"+
		"\u0002\u0000%&\u0005\u0006\u0000\u0000&(\u0001\u0000\u0000\u0000\'#\u0001"+
		"\u0000\u0000\u0000\'(\u0001\u0000\u0000\u0000()\u0001\u0000\u0000\u0000"+
		")*\u0003\u0004\u0002\u0000*+\u0005\u0001\u0000\u0000+,\u0005\b\u0000\u0000"+
		",-\u0005\b\u0000\u0000-.\u0005\u0007\u0000\u0000.@\u0001\u0000\u0000\u0000"+
		"/0\u0005\u0002\u0000\u000001\u0003\u0004\u0002\u000012\u0005\u0006\u0000"+
		"\u000024\u0001\u0000\u0000\u00003/\u0001\u0000\u0000\u000034\u0001\u0000"+
		"\u0000\u000045\u0001\u0000\u0000\u000056\u0003\u0004\u0002\u000067\u0005"+
		"\u0001\u0000\u000078\u0005\u0003\u0000\u000089\u0003\u0004\u0002\u0000"+
		"9:\u0005\u0004\u0000\u0000:;\u0005\u0005\u0000\u0000;<\u0005\b\u0000\u0000"+
		"<=\u0005\b\u0000\u0000=>\u0005\u0007\u0000\u0000>@\u0001\u0000\u0000\u0000"+
		"?\'\u0001\u0000\u0000\u0000?3\u0001\u0000\u0000\u0000@\u0003\u0001\u0000"+
		"\u0000\u0000AC\u0005\b\u0000\u0000BA\u0001\u0000\u0000\u0000CD\u0001\u0000"+
		"\u0000\u0000DB\u0001\u0000\u0000\u0000DE\u0001\u0000\u0000\u0000E\u0005"+
		"\u0001\u0000\u0000\u0000\t\t\u0010\u0016\u0019\u001e\'3?D";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}