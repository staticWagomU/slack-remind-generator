import { describe, it, expect } from "vitest";
import { AIServiceError, APIKeyError, OpenAIAPIError } from "./errors";

describe("Error Classes", () => {
	describe("AIServiceError", () => {
		it("should create error with message and code", () => {
			const error = new AIServiceError("Test error", "API_ERROR");

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(AIServiceError);
			expect(error.message).toBe("Test error");
			expect(error.code).toBe("API_ERROR");
			expect(error.name).toBe("AIServiceError");
		});

		it("should include optional details", () => {
			const error = new AIServiceError(
				"Test error",
				"PARSE_ERROR",
				"Additional context",
			);

			expect(error.details).toBe("Additional context");
		});

		it("should not have details when not provided", () => {
			const error = new AIServiceError("Test error", "NETWORK_ERROR");

			expect(error.details).toBeUndefined();
		});
	});

	describe("APIKeyError", () => {
		it("should create error with default message", () => {
			const error = new APIKeyError();

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(AIServiceError);
			expect(error).toBeInstanceOf(APIKeyError);
			expect(error.message).toBe("APIキーが設定されていません");
			expect(error.code).toBe("API_KEY_MISSING");
			expect(error.name).toBe("APIKeyError");
		});

		it("should create error with custom message", () => {
			const error = new APIKeyError("カスタムメッセージ");

			expect(error.message).toBe("カスタムメッセージ");
			expect(error.code).toBe("API_KEY_MISSING");
		});

		it("should include optional details", () => {
			const error = new APIKeyError("Test", "Please configure");

			expect(error.details).toBe("Please configure");
		});
	});

	describe("OpenAIAPIError", () => {
		it("should create error with status code", () => {
			const error = new OpenAIAPIError("API request failed", 500);

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(AIServiceError);
			expect(error).toBeInstanceOf(OpenAIAPIError);
			expect(error.message).toBe("API request failed");
			expect(error.code).toBe("API_ERROR");
			expect(error.statusCode).toBe(500);
			expect(error.name).toBe("OpenAIAPIError");
		});

		it("should include optional details", () => {
			const error = new OpenAIAPIError(
				"Rate limit exceeded",
				429,
				"Try again later",
			);

			expect(error.statusCode).toBe(429);
			expect(error.details).toBe("Try again later");
		});
	});
});
