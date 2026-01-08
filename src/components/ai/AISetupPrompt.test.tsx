import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AISetupPrompt } from "./AISetupPrompt";

describe("AISetupPrompt", () => {
	describe("表示テスト", () => {
		it("APIキー未設定時のメッセージが表示される", () => {
			render(<AISetupPrompt onOpenSettings={() => {}} />);

			expect(screen.getByText(/AI機能を使用するには/)).toBeInTheDocument();
		});

		it("設定ボタンが表示される", () => {
			render(<AISetupPrompt onOpenSettings={() => {}} />);

			expect(screen.getByRole("button", { name: /設定/i })).toBeInTheDocument();
		});

		it("data-testid属性が付与されている", () => {
			render(<AISetupPrompt onOpenSettings={() => {}} />);

			expect(screen.getByTestId("ai-setup-prompt")).toBeInTheDocument();
		});
	});

	describe("アクセシビリティ", () => {
		it("適切なARIA属性が設定されている", () => {
			render(<AISetupPrompt onOpenSettings={() => {}} />);

			const prompt = screen.getByTestId("ai-setup-prompt");
			expect(prompt).toHaveAttribute("role", "alert");
		});
	});

	describe("インタラクション", () => {
		it("設定ボタンクリックでonOpenSettingsが呼ばれる", async () => {
			let called = false;
			const handleOpenSettings = () => {
				called = true;
			};

			render(<AISetupPrompt onOpenSettings={handleOpenSettings} />);

			const button = screen.getByRole("button", { name: /設定/i });
			button.click();

			expect(called).toBe(true);
		});
	});
});
