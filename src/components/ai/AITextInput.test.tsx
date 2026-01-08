import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AITextInput } from "./AITextInput";

describe("AITextInput", () => {
	describe("表示テスト", () => {
		it("テキストエリアが表示される", () => {
			render(<AITextInput value="" onChange={() => {}} />);

			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("placeholder属性が設定される", () => {
			render(
				<AITextInput
					value=""
					onChange={() => {}}
					placeholder="例: 明日の10時にミーティングをリマインド"
				/>,
			);

			const textarea = screen.getByRole("textbox");
			expect(textarea).toHaveAttribute(
				"placeholder",
				"例: 明日の10時にミーティングをリマインド",
			);
		});

		it("helperTextが表示される", () => {
			render(
				<AITextInput
					value=""
					onChange={() => {}}
					helperText="自然な日本語で入力してください"
				/>,
			);

			expect(
				screen.getByText("自然な日本語で入力してください"),
			).toBeInTheDocument();
		});

		it("labelが表示される", () => {
			render(
				<AITextInput value="" onChange={() => {}} label="リマインダー内容" />,
			);

			expect(screen.getByText("リマインダー内容")).toBeInTheDocument();
		});

		it("入力された値が表示される", () => {
			render(<AITextInput value="テスト入力" onChange={() => {}} />);

			const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
			expect(textarea.value).toBe("テスト入力");
		});
	});

	describe("文字数カウンタ", () => {
		it("文字数が表示される", () => {
			render(
				<AITextInput value="こんにちは" onChange={() => {}} maxLength={500} />,
			);

			expect(screen.getByText("5 / 500")).toBeInTheDocument();
		});

		it("最大文字数が設定されている場合、制限を超えた文字は入力できない", () => {
			const handleChange = vi.fn();
			render(<AITextInput value="" onChange={handleChange} maxLength={10} />);

			const textarea = screen.getByRole("textbox");
			expect(textarea).toHaveAttribute("maxLength", "10");
		});

		it("最大文字数に近づくと警告色で表示される", () => {
			render(
				<AITextInput
					value={"あ".repeat(495)}
					onChange={() => {}}
					maxLength={500}
				/>,
			);

			const counter = screen.getByText("495 / 500");
			expect(counter).toHaveClass("text-amber-600");
		});

		it("最大文字数を超えるとエラー色で表示される", () => {
			render(
				<AITextInput
					value={"あ".repeat(500)}
					onChange={() => {}}
					maxLength={500}
				/>,
			);

			const counter = screen.getByText("500 / 500");
			expect(counter).toHaveClass("text-red-600");
		});
	});

	describe("インタラクション", () => {
		it("入力するとonChangeが呼ばれる", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<AITextInput value="" onChange={handleChange} />);

			const textarea = screen.getByRole("textbox");
			await user.type(textarea, "テスト");

			expect(handleChange).toHaveBeenCalled();
		});

		it("disabledの場合、入力できない", () => {
			render(<AITextInput value="" onChange={() => {}} disabled={true} />);

			const textarea = screen.getByRole("textbox");
			expect(textarea).toBeDisabled();
		});
	});

	describe("アクセシビリティ", () => {
		it("data-testid属性が付与されている", () => {
			render(<AITextInput value="" onChange={() => {}} />);

			expect(screen.getByTestId("ai-text-input")).toBeInTheDocument();
		});

		it("labelとテキストエリアが関連付けられている", () => {
			render(
				<AITextInput value="" onChange={() => {}} label="リマインダー内容" />,
			);

			const textarea = screen.getByRole("textbox");
			expect(textarea).toHaveAccessibleName("リマインダー内容");
		});
	});
});
