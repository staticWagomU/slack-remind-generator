import { describe, it, expect } from "vitest";
import { convertAIResponseToCommands } from "./aiCommandGenerator";
import type { AIResponse } from "../types/ai";

describe("AICommandGenerator", () => {
	describe("convertAIResponseToCommands", () => {
		it("should convert single AI response to Slack command", () => {
			const aiResponse: AIResponse = {
				commands: [
					{
						who: "me",
						what: "ミーティング",
						when: "tomorrow at 10am",
					},
				],
				confidence: 0.95,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe('/remind me "ミーティング" tomorrow at 10am');
		});

		it("should convert multiple AI responses to Slack commands", () => {
			const aiResponse: AIResponse = {
				commands: [
					{
						who: "me",
						what: "朝のミーティング",
						when: "tomorrow at 9am",
					},
					{
						who: "#general",
						what: "定例会",
						when: "every monday at 10am",
					},
				],
				confidence: 0.9,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result).toHaveLength(2);
			expect(result[0]).toBe('/remind me "朝のミーティング" tomorrow at 9am');
			expect(result[1]).toBe('/remind #general "定例会" every monday at 10am');
		});

		it("should handle empty commands array", () => {
			const aiResponse: AIResponse = {
				commands: [],
				confidence: 0.0,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result).toEqual([]);
		});

		it("should properly escape special characters in what field", () => {
			const aiResponse: AIResponse = {
				commands: [
					{
						who: "me",
						what: 'Test with "quotes"',
						when: "in 1 hour",
					},
				],
				confidence: 0.95,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result[0]).toBe('/remind me "Test with \\"quotes\\"" in 1 hour');
		});

		it("should handle channel names", () => {
			const aiResponse: AIResponse = {
				commands: [
					{
						who: "#engineering",
						what: "スタンドアップ",
						when: "every weekday at 9am",
					},
				],
				confidence: 0.95,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result[0]).toBe(
				'/remind #engineering "スタンドアップ" every weekday at 9am',
			);
		});

		it("should handle user mentions", () => {
			const aiResponse: AIResponse = {
				commands: [
					{
						who: "@john",
						what: "レビュー依頼",
						when: "in 30 minutes",
					},
				],
				confidence: 0.95,
				rawResponse: "{}",
			};

			const result = convertAIResponseToCommands(aiResponse);

			expect(result[0]).toBe('/remind @john "レビュー依頼" in 30 minutes');
		});
	});
});
