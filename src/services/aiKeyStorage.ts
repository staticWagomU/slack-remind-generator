/**
 * OpenAI APIキーのlocalStorage管理
 */

const STORAGE_KEY = "openai_api_key";

/**
 * APIキーをlocalStorageに保存
 */
export function saveApiKey(apiKey: string): void {
	localStorage.setItem(STORAGE_KEY, apiKey);
}

/**
 * localStorageからAPIキーを取得
 */
export function getApiKey(): string | null {
	return localStorage.getItem(STORAGE_KEY);
}

/**
 * localStorageからAPIキーを削除
 */
export function clearApiKey(): void {
	localStorage.removeItem(STORAGE_KEY);
}

// Aliases for consistency
export const setAIApiKey = saveApiKey;
export const getAIApiKey = getApiKey;
export const clearAIApiKey = clearApiKey;
