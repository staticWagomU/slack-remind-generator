import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseNaturalLanguageToCommands } from "./openai";
import { APIKeyError, OpenAIAPIError } from "./errors";

// OpenAI SDKのモック
const mockCreate = vi.fn();

vi.mock("openai", () => {
	return {
		default: class {
			chat = {
				completions: {
					create: mockCreate,
				},
			};
		},
	};
});

describe("OpenAI Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("parseNaturalLanguageToCommands", () => {
		it("should throw APIKeyError when API key is empty", async () => {
			await expect(
				parseNaturalLanguageToCommands("", "明日の10時にミーティング"),
			).rejects.toThrow(APIKeyError);
		});

		it("should parse natural language to remind commands", async () => {
			const mockResponse = {
				choices: [
					{
						message: {
							content: JSON.stringify({
								commands: [
									{
										who: "me",
										what: "ミーティング",
										when: "tomorrow at 10am",
									},
								],
								confidence: 0.95,
							}),
						},
					},
				],
			};

			mockCreate.mockResolvedValueOnce(mockResponse);

			const result = await parseNaturalLanguageToCommands(
				"sk-test-key",
				"明日の10時にミーティングをリマインド",
			);

			expect(result.commands).toHaveLength(1);
			expect(result.commands[0].who).toBe("me");
			expect(result.commands[0].what).toBe("ミーティング");
			expect(result.commands[0].when).toBe("tomorrow at 10am");
			expect(result.confidence).toBe(0.95);
		});

		it("should handle multiple commands from natural language", async () => {
			const mockResponse = {
				choices: [
					{
						message: {
							content: JSON.stringify({
								commands: [
									{
										who: "me",
										what: "朝のミーティング",
										when: "tomorrow at 9am",
									},
									{
										who: "me",
										what: "夕方の報告",
										when: "tomorrow at 5pm",
									},
								],
								confidence: 0.9,
							}),
						},
					},
				],
			};

			mockCreate.mockResolvedValueOnce(mockResponse);

			const result = await parseNaturalLanguageToCommands(
				"sk-test-key",
				"明日の9時に朝のミーティング、17時に夕方の報告をリマインド",
			);

			expect(result.commands).toHaveLength(2);
			expect(result.confidence).toBe(0.9);
		});

		it("should throw OpenAIAPIError on API error after retries", async () => {
			// Mock 3 failures (will retry 500 errors)
			mockCreate
				.mockRejectedValueOnce({
					status: 500,
					message: "Internal Server Error",
				})
				.mockRejectedValueOnce({
					status: 500,
					message: "Internal Server Error",
				})
				.mockRejectedValueOnce({
					status: 500,
					message: "Internal Server Error",
				});

			await expect(
				parseNaturalLanguageToCommands("sk-test-key", "テスト"),
			).rejects.toThrow(OpenAIAPIError);
		});

		describe("Retry Logic (ST-4.2.1, ST-4.2.3: RED)", () => {
			it("should retry up to 3 times with exponential backoff on rate limit error", async () => {
				// Mock failures then success
				mockCreate
					.mockRejectedValueOnce({ status: 429, message: "Rate limit exceeded" })
					.mockRejectedValueOnce({ status: 429, message: "Rate limit exceeded" })
					.mockResolvedValueOnce({
						choices: [
							{
								message: {
									content: JSON.stringify({
										commands: [{ who: "me", what: "test", when: "now" }],
										confidence: 0.9,
									}),
								},
							},
						],
					});

				const startTime = Date.now();
				const result = await parseNaturalLanguageToCommands(
					"sk-test-key",
					"test",
				);
				const elapsed = Date.now() - startTime;

				// Should have called 3 times (2 failures + 1 success)
				expect(mockCreate).toHaveBeenCalledTimes(3);
				expect(result.commands).toHaveLength(1);

				// Should have waited ~3000ms (1000ms + 2000ms backoff)
				expect(elapsed).toBeGreaterThanOrEqual(2900);
			});

			it("should throw error after 3 failed retries", async () => {
				// Mock all failures
				mockCreate
					.mockRejectedValueOnce({ status: 429, message: "Rate limit exceeded" })
					.mockRejectedValueOnce({ status: 429, message: "Rate limit exceeded" })
					.mockRejectedValueOnce({ status: 429, message: "Rate limit exceeded" });

				await expect(
					parseNaturalLanguageToCommands("sk-test-key", "test"),
				).rejects.toThrow(OpenAIAPIError);

				// Should have attempted 3 times
				expect(mockCreate).toHaveBeenCalledTimes(3);
			});

			it("should use exponential backoff (1s, 2s, 4s) between retries", async () => {
				const delays: number[] = [];
				let lastTime = Date.now();

				mockCreate
					.mockRejectedValueOnce({ status: 503, message: "Service unavailable" })
					.mockImplementationOnce(() => {
						const now = Date.now();
						delays.push(now - lastTime);
						lastTime = now;
						return Promise.reject({
							status: 503,
							message: "Service unavailable",
						});
					})
					.mockImplementationOnce(() => {
						const now = Date.now();
						delays.push(now - lastTime);
						lastTime = now;
						return Promise.reject({
							status: 503,
							message: "Service unavailable",
						});
					});

				await expect(
					parseNaturalLanguageToCommands("sk-test-key", "test"),
				).rejects.toThrow();

				// Verify exponential backoff: ~1000ms, ~2000ms
				expect(delays[0]).toBeGreaterThanOrEqual(900);
				expect(delays[0]).toBeLessThan(1200);
				expect(delays[1]).toBeGreaterThanOrEqual(1900);
				expect(delays[1]).toBeLessThan(2200);
			});

			it("should not retry on non-retryable errors (400, 401, 403)", async () => {
				mockCreate.mockRejectedValueOnce({
					status: 401,
					message: "Unauthorized",
				});

				await expect(
					parseNaturalLanguageToCommands("sk-test-key", "test"),
				).rejects.toThrow(OpenAIAPIError);

				// Should only attempt once (no retry)
				expect(mockCreate).toHaveBeenCalledTimes(1);
			});
		});
	});
});
