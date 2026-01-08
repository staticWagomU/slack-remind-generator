/**
 * AI機能の型定義
 * OpenAI APIとの連携に使用する型を定義
 */

/**
 * AIへのリクエスト
 */
export interface AIRequest {
  naturalLanguageInput: string;
  apiKey: string;
}

/**
 * Slackのリマインドコマンドを表す型
 */
export interface RemindCommand {
  who: string;
  what: string;
  when: string;
}

/**
 * AIの解釈の信頼度スコア (0.0 - 1.0)
 */
export type ConfidenceScore = number;

/**
 * AIからのレスポンス
 */
export interface AIResponse {
  commands: RemindCommand[];
  confidence: ConfidenceScore;
  rawResponse: string;
}

/**
 * AIエラーコード
 */
export type AIErrorCode =
  | "API_KEY_MISSING"
  | "API_ERROR"
  | "PARSE_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_INPUT";

/**
 * AIエラー
 */
export interface AIError {
  code: AIErrorCode;
  message: string;
  details?: string;
}
