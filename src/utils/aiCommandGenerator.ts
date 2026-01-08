/**
 * AI応答からSlackリマインドコマンドを生成するユーティリティ
 */

import type { AIRequest, AIResponse } from "../types/ai";
import { parseNaturalLanguageToCommands } from "../services/openai";

/**
 * メッセージをエスケープする
 */
function escapeMessage(message: string): string {
	if (!message) return '""';

	// エスケープが必要な文字を含むかチェック
	const needsEscape =
		message.includes(" ") || message.includes("\n") || message.includes('"');

	// 日本語を含むかチェック
	const containsJapanese =
		/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(
			message,
		);

	// エスケープが必要、または日本語を含む場合は引用符で囲む
	if (needsEscape || containsJapanese) {
		const escaped = message.replace(/"/g, '\\"');
		return `"${escaped}"`;
	}

	return message;
}

/**
 * AI応答をSlackリマインドコマンドの配列に変換
 */
export function convertAIResponseToCommands(aiResponse: AIResponse): string[] {
	return aiResponse.commands.map((command) => {
		const who = command.who;
		const what = escapeMessage(command.what);
		const when = command.when;

		return `/remind ${who} ${what} ${when}`;
	});
}

/**
 * 自然言語からリマインドコマンドを生成
 */
export async function generateRemindCommands(
	request: AIRequest,
): Promise<AIResponse> {
	return await parseNaturalLanguageToCommands(
		request.naturalLanguageInput,
		request.apiKey,
	);
}
