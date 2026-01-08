/**
 * OpenAI APIとの連携サービス
 */

import OpenAI from "openai";
import type { AIResponse } from "../types/ai";
import { APIKeyError, OpenAIAPIError, AIServiceError } from "./errors";

/**
 * リトライ対象となるHTTPステータスコード
 */
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

/**
 * 最大リトライ回数
 */
const MAX_RETRIES = 3;

/**
 * エクスポネンシャルバックオフでの待機時間を計算
 * @param retryCount リトライ回数 (0-indexed)
 * @returns 待機時間（ミリ秒）
 */
function getBackoffDelay(retryCount: number): number {
	// 1s, 2s, 4s のエクスポネンシャルバックオフ
	return Math.pow(2, retryCount) * 1000;
}

/**
 * 指定時間待機するPromise
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ステータスコードがリトライ可能かチェック
 */
function isRetryableError(status: number): boolean {
	return RETRYABLE_STATUS_CODES.includes(status);
}

/**
 * 自然言語をSlackリマインドコマンドに変換
 */
export async function parseNaturalLanguageToCommands(
	apiKey: string,
	naturalLanguageInput: string,
): Promise<AIResponse> {
	// APIキーのバリデーション
	if (!apiKey || apiKey.trim() === "") {
		throw new APIKeyError();
	}

	// OpenAIクライアントの初期化
	const client = new OpenAI({
		apiKey: apiKey,
		dangerouslyAllowBrowser: true, // ブラウザ環境での実行を許可
	});

	// リトライロジック付きでAPI呼び出し
	let lastError: unknown;
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			// OpenAI APIを呼び出し
			const completion = await client.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content: `あなたはSlackのリマインドコマンド生成アシスタントです。
ユーザーの自然言語入力を、Slackの/remindコマンドに変換してください。

出力形式:
{
  "commands": [
    {
      "who": "me" | "@username" | "#channel",
      "what": "リマインド内容",
      "when": "Slack形式の時刻指定 (例: tomorrow at 10am, every monday at 9am, in 2 hours)"
    }
  ],
  "confidence": 0.0-1.0の信頼度スコア
}

注意事項:
- whoは基本的に"me"、チャンネルやユーザーが指定されている場合のみ変更
- whenはSlackの自然言語形式で出力 (英語)
- 複数のリマインドが含まれる場合は配列に複数含める
- 曖昧な場合は信頼度を下げる`,
					},
					{
						role: "user",
						content: naturalLanguageInput,
					},
				],
				response_format: { type: "json_object" },
				temperature: 0.3,
			});

			// レスポンスのパース
			const content = completion.choices[0]?.message?.content;
			if (!content) {
				throw new AIServiceError(
					"OpenAI APIからのレスポンスが空です",
					"PARSE_ERROR",
				);
			}

			const parsed = JSON.parse(content);
			const rawResponse = content;

			// AIResponseの構築
			const response: AIResponse = {
				commands: parsed.commands || [],
				confidence: parsed.confidence || 0,
				rawResponse,
			};

			return response;
		} catch (error) {
			lastError = error;

			// エラーハンドリング
			if (error instanceof AIServiceError) {
				throw error;
			}

			// OpenAI APIエラー - リトライ可能かチェック
			if (error && typeof error === "object" && "status" in error) {
				const statusCode = (error as { status?: number }).status || 500;

				// リトライ可能なエラーで、まだリトライ回数が残っている場合
				if (isRetryableError(statusCode) && attempt < MAX_RETRIES - 1) {
					const delay = getBackoffDelay(attempt);
					await sleep(delay);
					continue; // 次のリトライへ
				}

				// リトライ不可能、または最終リトライ後はエラーを投げる
				const message =
					(error as { message?: string }).message ||
					"API呼び出しに失敗しました";
				throw new OpenAIAPIError(message, statusCode);
			}

			// その他のエラー
			throw new AIServiceError(
				error instanceof Error ? error.message : "予期しないエラーが発生しました",
				"API_ERROR",
			);
		}
	}

	// すべてのリトライが失敗した場合
	throw new AIServiceError(
		"最大リトライ回数を超えました",
		"MAX_RETRIES_EXCEEDED",
	);
}
