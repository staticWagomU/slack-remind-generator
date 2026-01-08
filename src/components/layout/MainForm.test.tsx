import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainForm } from "./MainForm";

describe("MainForm", () => {
	describe("統合前ベースライン", () => {
		it("MainFormが正常にレンダリングされる", () => {
			render(<MainForm />);
			expect(
				screen.getByText("Slackリマインドコマンド生成"),
			).toBeInTheDocument();
		});

		it("3つの入力セクション(Who, What, When)が表示される", () => {
			render(<MainForm />);
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
			expect(screen.getByText("日時指定")).toBeInTheDocument();
		});

		it("コマンドプレビューセクションが表示される", () => {
			render(<MainForm />);
			expect(screen.getByText("コマンドプレビュー")).toBeInTheDocument();
		});

		it("レスポンシブなレイアウトクラスが適用されている", () => {
			const { container } = render(<MainForm />);
			const gridElement = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-2");
			expect(gridElement).toBeInTheDocument();
		});
	});

	describe("AI統合", () => {
		it("AIInputPanelが表示される", () => {
			render(<MainForm />);
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
		});

		it("AIInputPanelとMainFormが視覚的に分離されている", () => {
			const { container } = render(<MainForm />);
			const aiSection = container.querySelector('[data-testid="ai-input-panel"]');
			expect(aiSection).toBeInTheDocument();
		});

		it("手動入力セクションとAIセクションの両方が表示される", () => {
			render(<MainForm />);
			// AI section
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
			// Manual section
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
		});
	});

	describe("レスポンシブレイアウト", () => {
		it("AIセクションに適切なレスポンシブクラスが適用されている", () => {
			const { container } = render(<MainForm />);
			const aiSection = container.querySelector('[data-testid="ai-input-panel"]')?.parentElement;
			expect(aiSection).toHaveClass("mb-8");
		});

		it("手動入力セクションのグリッドレイアウトが維持されている", () => {
			const { container } = render(<MainForm />);
			const gridElement = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-2");
			expect(gridElement).toBeInTheDocument();
		});

		it("AIセクションが全幅で表示される", () => {
			const { container } = render(<MainForm />);
			const aiSection = container.querySelector('[data-testid="ai-input-panel"]')?.parentElement;
			expect(aiSection).toBeInTheDocument();
			// Check that it's not inside the 2-column grid
			expect(aiSection?.parentElement?.classList.contains("grid")).toBe(false);
		});
	});
});
