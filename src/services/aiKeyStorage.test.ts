import { describe, it, expect, beforeEach } from "vitest";
import { saveApiKey, getApiKey, clearApiKey } from "./aiKeyStorage";

describe("AIKeyStorage", () => {
	// localStorageのモック
	const localStorageMock = (() => {
		let store: Record<string, string> = {};

		return {
			getItem: (key: string) => store[key] || null,
			setItem: (key: string, value: string) => {
				store[key] = value.toString();
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				store = {};
			},
		};
	})();

	beforeEach(() => {
		// 各テストの前にlocalStorageをクリア
		localStorageMock.clear();
		// グローバルのlocalStorageをモックで置き換え
		global.localStorage = localStorageMock as unknown as Storage;
	});

	describe("saveApiKey", () => {
		it("should save API key to localStorage", () => {
			const testKey = "sk-test-key-12345";
			saveApiKey(testKey);

			expect(localStorage.getItem("openai_api_key")).toBe(testKey);
		});

		it("should overwrite existing API key", () => {
			const firstKey = "sk-first-key";
			const secondKey = "sk-second-key";

			saveApiKey(firstKey);
			expect(localStorage.getItem("openai_api_key")).toBe(firstKey);

			saveApiKey(secondKey);
			expect(localStorage.getItem("openai_api_key")).toBe(secondKey);
		});
	});

	describe("getApiKey", () => {
		it("should return API key from localStorage", () => {
			const testKey = "sk-test-key-67890";
			localStorage.setItem("openai_api_key", testKey);

			const result = getApiKey();
			expect(result).toBe(testKey);
		});

		it("should return null when no API key is stored", () => {
			const result = getApiKey();
			expect(result).toBeNull();
		});
	});

	describe("clearApiKey", () => {
		it("should remove API key from localStorage", () => {
			const testKey = "sk-test-key-clear";
			localStorage.setItem("openai_api_key", testKey);

			expect(localStorage.getItem("openai_api_key")).toBe(testKey);

			clearApiKey();

			expect(localStorage.getItem("openai_api_key")).toBeNull();
		});

		it("should not throw error when clearing non-existent key", () => {
			expect(() => clearApiKey()).not.toThrow();
		});
	});
});
