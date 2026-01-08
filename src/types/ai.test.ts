import { describe, it, expect } from "vitest";
import type {
  AIRequest,
  AIResponse,
  AIError,
  RemindCommand,
  ConfidenceScore,
} from "./ai";

describe("AI Types", () => {
  describe("AIRequest", () => {
    it("should accept valid AIRequest object", () => {
      const request: AIRequest = {
        naturalLanguageInput: "明日の10時にミーティングをリマインド",
        apiKey: "sk-test-key",
      };
      
      expect(request.naturalLanguageInput).toBe("明日の10時にミーティングをリマインド");
      expect(request.apiKey).toBe("sk-test-key");
    });
  });

  describe("RemindCommand", () => {
    it("should accept valid RemindCommand object", () => {
      const command: RemindCommand = {
        who: "me",
        what: "ミーティング",
        when: "tomorrow at 10am",
      };
      
      expect(command.who).toBe("me");
      expect(command.what).toBe("ミーティング");
      expect(command.when).toBe("tomorrow at 10am");
    });

    it("should accept optional channel field", () => {
      const command: RemindCommand = {
        who: "#general",
        what: "定例会",
        when: "every monday at 9am",
      };
      
      expect(command.who).toBe("#general");
    });
  });

  describe("ConfidenceScore", () => {
    it("should accept valid confidence score", () => {
      const score: ConfidenceScore = 0.95;
      expect(score).toBe(0.95);
    });
  });

  describe("AIResponse", () => {
    it("should accept valid AIResponse object", () => {
      const response: AIResponse = {
        commands: [
          {
            who: "me",
            what: "ミーティング",
            when: "tomorrow at 10am",
          },
        ],
        confidence: 0.9,
        rawResponse: "API raw response",
      };
      
      expect(response.commands).toHaveLength(1);
      expect(response.confidence).toBe(0.9);
      expect(response.rawResponse).toBe("API raw response");
    });
  });

  describe("AIError", () => {
    it("should accept valid AIError object", () => {
      const error: AIError = {
        code: "API_KEY_MISSING",
        message: "APIキーが設定されていません",
        details: "Please provide a valid OpenAI API key",
      };
      
      expect(error.code).toBe("API_KEY_MISSING");
      expect(error.message).toBe("APIキーが設定されていません");
      expect(error.details).toBe("Please provide a valid OpenAI API key");
    });

    it("should accept AIError without optional details", () => {
      const error: AIError = {
        code: "PARSE_ERROR",
        message: "レスポンスのパースに失敗しました",
      };
      
      expect(error.code).toBe("PARSE_ERROR");
      expect(error.message).toBe("レスポンスのパースに失敗しました");
      expect(error.details).toBeUndefined();
    });
  });
});
