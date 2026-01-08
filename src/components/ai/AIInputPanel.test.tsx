import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIInputPanel } from "./AIInputPanel";
import * as aiKeyStorage from "../../services/aiKeyStorage";

vi.mock("../../services/aiKeyStorage");
vi.mock("../../utils/aiCommandGenerator", () => ({
	generateRemindCommands: vi.fn(),
}));

describe("AIInputPanel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(aiKeyStorage.getAIApiKey).mockReturnValue(null);
	});

	describe("APIキー未設定時", () => {
		it("AISetupPromptが表示される", () => {
			render(<AIInputPanel />);
			
			expect(screen.getByTestId("ai-setup-prompt")).toBeInTheDocument();
		});

		it("AITextInputが表示されない", () => {
			render(<AIInputPanel />);
			
			expect(screen.queryByTestId("ai-text-input")).not.toBeInTheDocument();
		});

		it("設定ボタンクリックでAISettingsDialogが開く", async () => {
			const user = userEvent.setup();
			render(<AIInputPanel />);
			
			const button = screen.getByRole("button", { name: /設定/i });
			await user.click(button);
			
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});
	});

	describe("APIキー設定済み時", () => {
		beforeEach(() => {
			vi.mocked(aiKeyStorage.getAIApiKey).mockReturnValue("sk-test-key");
		});

		it("AISetupPromptが表示されない", () => {
			render(<AIInputPanel />);
			
			expect(screen.queryByTestId("ai-setup-prompt")).not.toBeInTheDocument();
		});

		it("AITextInputが表示される", () => {
			render(<AIInputPanel />);
			
			expect(screen.getByTestId("ai-text-input")).toBeInTheDocument();
		});

		it("生成ボタンが表示される", () => {
			render(<AIInputPanel />);
			
			expect(screen.getByRole("button", { name: "生成" })).toBeInTheDocument();
		});

		it("入力が空の場合、生成ボタンが無効", () => {
			render(<AIInputPanel />);
			
			const button = screen.getByRole("button", { name: "生成" });
			expect(button).toBeDisabled();
		});

		it("入力がある場合、生成ボタンが有効", async () => {
			const user = userEvent.setup();
			render(<AIInputPanel />);
			
			const textarea = screen.getByRole("textbox");
			await user.type(textarea, "明日の10時にミーティング");
			
			const button = screen.getByRole("button", { name: "生成" });
			expect(button).not.toBeDisabled();
		});

		it("AIResultListが表示される", () => {
			render(<AIInputPanel />);
			
			// Empty state
			expect(screen.getByTestId("ai-result-list-empty")).toBeInTheDocument();
		});
	});

	describe("アクセシビリティ", () => {
		it("data-testid属性が付与されている", () => {
			render(<AIInputPanel />);
			
			expect(screen.getByTestId("ai-input-panel")).toBeInTheDocument();
		});
	});
});
