/**
 * AI機能のエラークラス
 */

import type { AIErrorCode } from "../types/ai";

/**
 * AIサービスの基本エラークラス
 */
export class AIServiceError extends Error {
	code: AIErrorCode;
	details?: string;

	constructor(message: string, code: AIErrorCode, details?: string) {
		super(message);
		this.name = "AIServiceError";
		this.code = code;
		this.details = details;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AIServiceError);
		}
	}
}

/**
 * APIキー関連のエラー
 */
export class APIKeyError extends AIServiceError {
	constructor(
		message = "APIキーが設定されていません",
		details?: string,
	) {
		super(message, "API_KEY_MISSING", details);
		this.name = "APIKeyError";

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, APIKeyError);
		}
	}
}

/**
 * OpenAI API呼び出しエラー
 */
export class OpenAIAPIError extends AIServiceError {
	statusCode: number;

	constructor(message: string, statusCode: number, details?: string) {
		super(message, "API_ERROR", details);
		this.name = "OpenAIAPIError";
		this.statusCode = statusCode;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, OpenAIAPIError);
		}
	}
}
