import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIResultList } from "./AIResultList";
import type { AIResponse } from "../../types/ai";

describe("AIResultList", () => {
	const mockResponse: AIResponse = {
		commands: [
			{ who: "me", what: "ミーティング", when: "tomorrow at 10am" },
			{ who: "me", what: "レビュー", when: "friday at 2pm" },
		],
		confidence: 0.9,
		rawResponse: "test",
	};

	describe("表示テスト", () => {
		it("複数のResultCardが表示される", () => {
			render(<AIResultList results={mockResponse} onCopy={() => {}} />);
			
			expect(screen.getByText(/remind me "ミーティング" tomorrow at 10am/)).toBeInTheDocument();
			expect(screen.getByText(/remind me "レビュー" friday at 2pm/)).toBeInTheDocument();
		});

		it("空状態メッセージが表示される", () => {
			const emptyResponse: AIResponse = {
				commands: [],
				confidence: 0,
				rawResponse: "",
			};
			
			render(<AIResultList results={emptyResponse} onCopy={() => {}} />);
			
			expect(screen.getByText(/リマインダーを生成するには/)).toBeInTheDocument();
		});

		it("nullの場合も空状態メッセージが表示される", () => {
			render(<AIResultList results={null} onCopy={() => {}} />);
			
			expect(screen.getByText(/リマインダーを生成するには/)).toBeInTheDocument();
		});
	});

	describe("loading skeleton", () => {
		it("isLoading=trueでskeletonが表示される", () => {
			render(<AIResultList results={null} onCopy={() => {}} isLoading={true} />);
			
			expect(screen.getByTestId("ai-result-list-loading")).toBeInTheDocument();
		});

		it("loading中はrole=statusが設定される", () => {
			render(<AIResultList results={null} onCopy={() => {}} isLoading={true} />);
			
			const loading = screen.getByTestId("ai-result-list-loading");
			expect(loading).toHaveAttribute("role", "status");
		});
	});

	describe("error boundary", () => {
		it("errorがある場合、エラーメッセージが表示される", () => {
			render(
				<AIResultList 
					results={null} 
					onCopy={() => {}} 
					error="APIエラーが発生しました"
				/>
			);
			
			expect(screen.getByText("APIエラーが発生しました")).toBeInTheDocument();
		});

		it("errorがある場合、role=alertが設定される", () => {
			render(
				<AIResultList 
					results={null} 
					onCopy={() => {}} 
					error="エラー"
				/>
			);
			
			const errorDiv = screen.getByTestId("ai-result-list-error");
			expect(errorDiv).toHaveAttribute("role", "alert");
		});
	});

	describe("アクセシビリティ", () => {
		it("data-testid属性が付与されている", () => {
			render(<AIResultList results={mockResponse} onCopy={() => {}} />);
			
			expect(screen.getByTestId("ai-result-list")).toBeInTheDocument();
		});
	});
});
