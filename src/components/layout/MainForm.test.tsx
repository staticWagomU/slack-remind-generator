import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainForm } from "./MainForm";
import { ToastProvider } from "../../hooks/useToast";

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
	return <ToastProvider>{children}</ToastProvider>;
}

describe("MainForm", () => {
	describe("統合前ベースライン", () => {
		it("MainFormが正常にレンダリングされる", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			expect(
				screen.getByText("Slackリマインドコマンド生成"),
			).toBeInTheDocument();
		});

		it("3つの入力セクション(Who, What, When)が表示される", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
			expect(screen.getByText("日時指定")).toBeInTheDocument();
		});

		it("コマンドプレビューセクションが表示される", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			expect(screen.getByText("コマンドプレビュー")).toBeInTheDocument();
		});

		it("レスポンシブなレイアウトクラスが適用されている", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const gridElement = container.querySelector(
				".grid.grid-cols-1.lg\\:grid-cols-2",
			);
			expect(gridElement).toBeInTheDocument();
		});
	});

	describe("AI統合", () => {
		it("AIInputPanelが表示される", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
		});

		it("AIInputPanelとMainFormが視覚的に分離されている", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const aiSection = container.querySelector(
				'[data-testid="ai-input-panel"]',
			);
			expect(aiSection).toBeInTheDocument();
		});

		it("手動入力セクションとAIセクションの両方が表示される", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			// AI section
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
			// Manual section
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
		});
	});

	describe("レスポンシブレイアウト", () => {
		it("AIセクションに適切なレスポンシブクラスが適用されている", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const aiSection = container.querySelector(
				'[data-testid="ai-input-panel"]',
			)?.parentElement;
			expect(aiSection).toHaveClass("mb-8");
		});

		it("手動入力セクションのグリッドレイアウトが維持されている", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const gridElement = container.querySelector(
				".grid.grid-cols-1.lg\\:grid-cols-2",
			);
			expect(gridElement).toBeInTheDocument();
		});

		it("AIセクションが全幅で表示される", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const aiSection = container.querySelector(
				'[data-testid="ai-input-panel"]',
			)?.parentElement;
			expect(aiSection).toBeInTheDocument();
			// Check that it's not inside the 2-column grid
			expect(aiSection?.parentElement?.classList.contains("grid")).toBe(false);
		});
	});

	describe("独立した状態管理", () => {
		it("AIセクションとMainFormセクションが独立して存在する", () => {
			render(<MainForm />, { wrapper: TestWrapper });
			// AI section exists
			const aiSection = screen.getByTestId("ai-input-panel");
			expect(aiSection).toBeInTheDocument();
			// Manual form sections exist
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
		});

		it("手動入力フォームの操作がAIセクションに影響しない", async () => {
			const user = userEvent.setup();
			render(<MainForm />, { wrapper: TestWrapper });

			// Interact with manual form
			const textarea = screen.getByPlaceholderText(
				"リマインダーの内容を入力してください...",
			);
			await user.type(textarea, "test message");

			// AI section should still be intact and independent
			const aiSection = screen.getByTestId("ai-input-panel");
			expect(aiSection).toBeInTheDocument();
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
		});

		it("AIセクションとMainFormセクションが別々のDOM階層に存在する", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });
			const aiSection = container.querySelector(
				'[data-testid="ai-input-panel"]',
			);
			const manualSection = container.querySelector(
				".grid.grid-cols-1.lg\\:grid-cols-2",
			);

			expect(aiSection).toBeInTheDocument();
			expect(manualSection).toBeInTheDocument();
			// Verify they are not nested
			expect(manualSection?.contains(aiSection as Node)).toBe(false);
			expect(aiSection?.contains(manualSection as Node)).toBe(false);
		});
	});

	describe("統合テスト: 共存と独立性", () => {
		it("完全な統合: すべての要素が正しく表示される", () => {
			render(<MainForm />, { wrapper: TestWrapper });

			// Header
			expect(
				screen.getByText("Slackリマインドコマンド生成"),
			).toBeInTheDocument();

			// AI Section
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
			expect(screen.getByTestId("ai-input-panel")).toBeInTheDocument();

			// Divider
			expect(screen.getByText("または手動で入力")).toBeInTheDocument();

			// Manual Form Sections
			expect(screen.getByText("通知先")).toBeInTheDocument();
			expect(screen.getByText("リマインダーメッセージ")).toBeInTheDocument();
			expect(screen.getByText("日時指定")).toBeInTheDocument();

			// Command Preview
			expect(screen.getByText("コマンドプレビュー")).toBeInTheDocument();

			// Footer Info
			expect(screen.getByText("Slackリマインダーについて")).toBeInTheDocument();
		});

		it("統合後も既存のレスポンシブレイアウトが機能する", () => {
			const { container } = render(<MainForm />, { wrapper: TestWrapper });

			// AI section is full width
			const aiSection = container.querySelector(
				'[data-testid="ai-input-panel"]',
			)?.parentElement;
			expect(aiSection).toBeInTheDocument();

			// Manual form uses responsive grid
			const gridElement = container.querySelector(
				".grid.grid-cols-1.lg\\:grid-cols-2",
			);
			expect(gridElement).toBeInTheDocument();

			// Sticky preview on large screens
			const stickyPreview = container.querySelector(".lg\\:sticky");
			expect(stickyPreview).toBeInTheDocument();
		});

		it("すべてのテストセクションが独立して動作する", async () => {
			const user = userEvent.setup();
			render(<MainForm />, { wrapper: TestWrapper });

			// Verify all sections are present
			const aiSection = screen.getByTestId("ai-input-panel");
			const manualTextarea = screen.getByPlaceholderText(
				"リマインダーの内容を入力してください...",
			);

			expect(aiSection).toBeInTheDocument();
			expect(manualTextarea).toBeInTheDocument();

			// Interact with manual form
			await user.type(manualTextarea, "Manual input test");

			// AI section should remain intact
			expect(screen.getByText("AI リマインダー生成")).toBeInTheDocument();
			expect(aiSection).toBeInTheDocument();
		});
	});
});
