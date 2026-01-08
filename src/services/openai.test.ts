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

		it("should throw OpenAIAPIError on API error", async () => {
			mockCreate.mockRejectedValueOnce({
				status: 500,
				message: "Internal Server Error",
			});

			await expect(
				parseNaturalLanguageToCommands("sk-test-key", "テスト"),
			).rejects.toThrow(OpenAIAPIError);
		});
	});
});
