// Generated from /home/usio0/Documents/TUD/Bachelor/IGCSE-Pseudocode-Online-Compiler/app/src/watchdog/grammar/Requirement.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link RequirementParser}.
 */
public interface RequirementListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link RequirementParser#document}.
	 * @param ctx the parse tree
	 */
	void enterDocument(RequirementParser.DocumentContext ctx);
	/**
	 * Exit a parse tree produced by {@link RequirementParser#document}.
	 * @param ctx the parse tree
	 */
	void exitDocument(RequirementParser.DocumentContext ctx);
	/**
	 * Enter a parse tree produced by the {@code autonomousActivity}
	 * labeled alternative in {@link RequirementParser#requirement}.
	 * @param ctx the parse tree
	 */
	void enterAutonomousActivity(RequirementParser.AutonomousActivityContext ctx);
	/**
	 * Exit a parse tree produced by the {@code autonomousActivity}
	 * labeled alternative in {@link RequirementParser#requirement}.
	 * @param ctx the parse tree
	 */
	void exitAutonomousActivity(RequirementParser.AutonomousActivityContext ctx);
	/**
	 * Enter a parse tree produced by the {@code userInteraction}
	 * labeled alternative in {@link RequirementParser#requirement}.
	 * @param ctx the parse tree
	 */
	void enterUserInteraction(RequirementParser.UserInteractionContext ctx);
	/**
	 * Exit a parse tree produced by the {@code userInteraction}
	 * labeled alternative in {@link RequirementParser#requirement}.
	 * @param ctx the parse tree
	 */
	void exitUserInteraction(RequirementParser.UserInteractionContext ctx);
	/**
	 * Enter a parse tree produced by the {@code logicalCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void enterLogicalCondition(RequirementParser.LogicalConditionContext ctx);
	/**
	 * Exit a parse tree produced by the {@code logicalCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void exitLogicalCondition(RequirementParser.LogicalConditionContext ctx);
	/**
	 * Enter a parse tree produced by the {@code eventCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void enterEventCondition(RequirementParser.EventConditionContext ctx);
	/**
	 * Exit a parse tree produced by the {@code eventCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void exitEventCondition(RequirementParser.EventConditionContext ctx);
	/**
	 * Enter a parse tree produced by the {@code durationCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void enterDurationCondition(RequirementParser.DurationConditionContext ctx);
	/**
	 * Exit a parse tree produced by the {@code durationCondition}
	 * labeled alternative in {@link RequirementParser#condition}.
	 * @param ctx the parse tree
	 */
	void exitDurationCondition(RequirementParser.DurationConditionContext ctx);
	/**
	 * Enter a parse tree produced by {@link RequirementParser#phrase}.
	 * @param ctx the parse tree
	 */
	void enterPhrase(RequirementParser.PhraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link RequirementParser#phrase}.
	 * @param ctx the parse tree
	 */
	void exitPhrase(RequirementParser.PhraseContext ctx);
}