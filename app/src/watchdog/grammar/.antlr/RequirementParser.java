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
		MUST=1, IF=2, OFFER=3, POSSIBILITY=4, TO=5, AS_SOON_AS=6, AS_LONG_AS=7, 
		COMMA=8, PERIOD=9, WORD=10, NEWLINE=11, WS=12, LINE_COMMENT=13;
	public static final int
		RULE_document = 0, RULE_requirement = 1, RULE_condition = 2, RULE_phrase = 3;
	private static String[] makeRuleNames() {
		return new String[] {
			"document", "requirement", "condition", "phrase"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, "','", "'.'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "MUST", "IF", "OFFER", "POSSIBILITY", "TO", "AS_SOON_AS", "AS_LONG_AS", 
			"COMMA", "PERIOD", "WORD", "NEWLINE", "WS", "LINE_COMMENT"
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterDocument(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitDocument(this);
		}
	}

	public final DocumentContext document() throws RecognitionException {
		DocumentContext _localctx = new DocumentContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_document);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(11);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(8);
					match(NEWLINE);
					}
					} 
				}
				setState(13);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(27);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 1220L) != 0)) {
				{
				setState(14);
				requirement();
				setState(24);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(18);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(15);
							match(NEWLINE);
							}
							}
							setState(20);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(21);
						requirement();
						}
						} 
					}
					setState(26);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(32);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(29);
				match(NEWLINE);
				}
				}
				setState(34);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(35);
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
		public PhraseContext subject;
		public Token verb;
		public Token object;
		public TerminalNode MUST() { return getToken(RequirementParser.MUST, 0); }
		public TerminalNode PERIOD() { return getToken(RequirementParser.PERIOD, 0); }
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public List<TerminalNode> WORD() { return getTokens(RequirementParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(RequirementParser.WORD, i);
		}
		public ConditionContext condition() {
			return getRuleContext(ConditionContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(RequirementParser.COMMA, 0); }
		public AutonomousActivityContext(RequirementContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterAutonomousActivity(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitAutonomousActivity(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class UserInteractionContext extends RequirementContext {
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
		public ConditionContext condition() {
			return getRuleContext(ConditionContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(RequirementParser.COMMA, 0); }
		public UserInteractionContext(RequirementContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterUserInteraction(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitUserInteraction(this);
		}
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
				setState(40);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 196L) != 0)) {
					{
					setState(37);
					condition();
					setState(38);
					match(COMMA);
					}
				}

				setState(42);
				((AutonomousActivityContext)_localctx).subject = phrase();
				setState(43);
				match(MUST);
				setState(44);
				((AutonomousActivityContext)_localctx).verb = match(WORD);
				setState(45);
				((AutonomousActivityContext)_localctx).object = match(WORD);
				setState(46);
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
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 196L) != 0)) {
					{
					setState(48);
					condition();
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
	public static class ConditionContext extends ParserRuleContext {
		public ConditionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_condition; }
	 
		public ConditionContext() { }
		public void copyFrom(ConditionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class EventConditionContext extends ConditionContext {
		public PhraseContext text;
		public TerminalNode AS_SOON_AS() { return getToken(RequirementParser.AS_SOON_AS, 0); }
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public EventConditionContext(ConditionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterEventCondition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitEventCondition(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class DurationConditionContext extends ConditionContext {
		public PhraseContext text;
		public TerminalNode AS_LONG_AS() { return getToken(RequirementParser.AS_LONG_AS, 0); }
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public DurationConditionContext(ConditionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterDurationCondition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitDurationCondition(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class LogicalConditionContext extends ConditionContext {
		public PhraseContext text;
		public TerminalNode IF() { return getToken(RequirementParser.IF, 0); }
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public LogicalConditionContext(ConditionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterLogicalCondition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitLogicalCondition(this);
		}
	}

	public final ConditionContext condition() throws RecognitionException {
		ConditionContext _localctx = new ConditionContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_condition);
		try {
			setState(71);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IF:
				_localctx = new LogicalConditionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(65);
				match(IF);
				setState(66);
				((LogicalConditionContext)_localctx).text = phrase();
				}
				break;
			case AS_SOON_AS:
				_localctx = new EventConditionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(67);
				match(AS_SOON_AS);
				setState(68);
				((EventConditionContext)_localctx).text = phrase();
				}
				break;
			case AS_LONG_AS:
				_localctx = new DurationConditionContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(69);
				match(AS_LONG_AS);
				setState(70);
				((DurationConditionContext)_localctx).text = phrase();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).enterPhrase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof RequirementListener ) ((RequirementListener)listener).exitPhrase(this);
		}
	}

	public final PhraseContext phrase() throws RecognitionException {
		PhraseContext _localctx = new PhraseContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_phrase);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(74); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(73);
				match(WORD);
				}
				}
				setState(76); 
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
		"\u0004\u0001\rO\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0001\u0000\u0005\u0000\n\b"+
		"\u0000\n\u0000\f\u0000\r\t\u0000\u0001\u0000\u0001\u0000\u0005\u0000\u0011"+
		"\b\u0000\n\u0000\f\u0000\u0014\t\u0000\u0001\u0000\u0005\u0000\u0017\b"+
		"\u0000\n\u0000\f\u0000\u001a\t\u0000\u0003\u0000\u001c\b\u0000\u0001\u0000"+
		"\u0005\u0000\u001f\b\u0000\n\u0000\f\u0000\"\t\u0000\u0001\u0000\u0001"+
		"\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001)\b\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0003\u00014\b\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0003\u0001@\b\u0001\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0003\u0002H\b"+
		"\u0002\u0001\u0003\u0004\u0003K\b\u0003\u000b\u0003\f\u0003L\u0001\u0003"+
		"\u0000\u0000\u0004\u0000\u0002\u0004\u0006\u0000\u0000U\u0000\u000b\u0001"+
		"\u0000\u0000\u0000\u0002?\u0001\u0000\u0000\u0000\u0004G\u0001\u0000\u0000"+
		"\u0000\u0006J\u0001\u0000\u0000\u0000\b\n\u0005\u000b\u0000\u0000\t\b"+
		"\u0001\u0000\u0000\u0000\n\r\u0001\u0000\u0000\u0000\u000b\t\u0001\u0000"+
		"\u0000\u0000\u000b\f\u0001\u0000\u0000\u0000\f\u001b\u0001\u0000\u0000"+
		"\u0000\r\u000b\u0001\u0000\u0000\u0000\u000e\u0018\u0003\u0002\u0001\u0000"+
		"\u000f\u0011\u0005\u000b\u0000\u0000\u0010\u000f\u0001\u0000\u0000\u0000"+
		"\u0011\u0014\u0001\u0000\u0000\u0000\u0012\u0010\u0001\u0000\u0000\u0000"+
		"\u0012\u0013\u0001\u0000\u0000\u0000\u0013\u0015\u0001\u0000\u0000\u0000"+
		"\u0014\u0012\u0001\u0000\u0000\u0000\u0015\u0017\u0003\u0002\u0001\u0000"+
		"\u0016\u0012\u0001\u0000\u0000\u0000\u0017\u001a\u0001\u0000\u0000\u0000"+
		"\u0018\u0016\u0001\u0000\u0000\u0000\u0018\u0019\u0001\u0000\u0000\u0000"+
		"\u0019\u001c\u0001\u0000\u0000\u0000\u001a\u0018\u0001\u0000\u0000\u0000"+
		"\u001b\u000e\u0001\u0000\u0000\u0000\u001b\u001c\u0001\u0000\u0000\u0000"+
		"\u001c \u0001\u0000\u0000\u0000\u001d\u001f\u0005\u000b\u0000\u0000\u001e"+
		"\u001d\u0001\u0000\u0000\u0000\u001f\"\u0001\u0000\u0000\u0000 \u001e"+
		"\u0001\u0000\u0000\u0000 !\u0001\u0000\u0000\u0000!#\u0001\u0000\u0000"+
		"\u0000\" \u0001\u0000\u0000\u0000#$\u0005\u0000\u0000\u0001$\u0001\u0001"+
		"\u0000\u0000\u0000%&\u0003\u0004\u0002\u0000&\'\u0005\b\u0000\u0000\'"+
		")\u0001\u0000\u0000\u0000(%\u0001\u0000\u0000\u0000()\u0001\u0000\u0000"+
		"\u0000)*\u0001\u0000\u0000\u0000*+\u0003\u0006\u0003\u0000+,\u0005\u0001"+
		"\u0000\u0000,-\u0005\n\u0000\u0000-.\u0005\n\u0000\u0000./\u0005\t\u0000"+
		"\u0000/@\u0001\u0000\u0000\u000001\u0003\u0004\u0002\u000012\u0005\b\u0000"+
		"\u000024\u0001\u0000\u0000\u000030\u0001\u0000\u0000\u000034\u0001\u0000"+
		"\u0000\u000045\u0001\u0000\u0000\u000056\u0003\u0006\u0003\u000067\u0005"+
		"\u0001\u0000\u000078\u0005\u0003\u0000\u000089\u0003\u0006\u0003\u0000"+
		"9:\u0005\u0004\u0000\u0000:;\u0005\u0005\u0000\u0000;<\u0005\n\u0000\u0000"+
		"<=\u0005\n\u0000\u0000=>\u0005\t\u0000\u0000>@\u0001\u0000\u0000\u0000"+
		"?(\u0001\u0000\u0000\u0000?3\u0001\u0000\u0000\u0000@\u0003\u0001\u0000"+
		"\u0000\u0000AB\u0005\u0002\u0000\u0000BH\u0003\u0006\u0003\u0000CD\u0005"+
		"\u0006\u0000\u0000DH\u0003\u0006\u0003\u0000EF\u0005\u0007\u0000\u0000"+
		"FH\u0003\u0006\u0003\u0000GA\u0001\u0000\u0000\u0000GC\u0001\u0000\u0000"+
		"\u0000GE\u0001\u0000\u0000\u0000H\u0005\u0001\u0000\u0000\u0000IK\u0005"+
		"\n\u0000\u0000JI\u0001\u0000\u0000\u0000KL\u0001\u0000\u0000\u0000LJ\u0001"+
		"\u0000\u0000\u0000LM\u0001\u0000\u0000\u0000M\u0007\u0001\u0000\u0000"+
		"\u0000\n\u000b\u0012\u0018\u001b (3?GL";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}