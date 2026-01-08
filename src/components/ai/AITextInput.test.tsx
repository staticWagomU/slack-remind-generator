import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
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

	describe("デバウンス機能 (ST-4.1.3: RED)", () => {
		it("onDebouncedChangeが提供された場合、300ms後に呼ばれる", async () => {
			vi.useFakeTimers();
			const handleChange = vi.fn();
			const handleDebouncedChange = vi.fn();

			const { rerender } = render(
				<AITextInput
					value=""
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);

			// Initial render calls with empty string
			expect(handleDebouncedChange).toHaveBeenCalledWith("");
			handleDebouncedChange.mockClear();

			// Value change
			rerender(
				<AITextInput
					value="test"
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);

			// Should not be called immediately after value change
			expect(handleDebouncedChange).not.toHaveBeenCalled();

			// Advance time by 299ms - should still not be called
			act(() => {
				vi.advanceTimersByTime(299);
			});
			expect(handleDebouncedChange).not.toHaveBeenCalled();

			// Advance time by 1ms more (total 300ms) - should be called
			act(() => {
				vi.advanceTimersByTime(1);
			});
			expect(handleDebouncedChange).toHaveBeenCalledWith("test");

			vi.useRealTimers();
		});

		it("連続入力時、最後の値のみがデバウンス後に通知される", async () => {
			vi.useFakeTimers();
			const handleChange = vi.fn();
			const handleDebouncedChange = vi.fn();

			const { rerender } = render(
				<AITextInput
					value=""
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);

			// Clear initial call
			handleDebouncedChange.mockClear();

			// Rapid changes
			rerender(
				<AITextInput
					value="t"
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);
			act(() => {
				vi.advanceTimersByTime(100);
			});

			rerender(
				<AITextInput
					value="te"
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);
			act(() => {
				vi.advanceTimersByTime(100);
			});

			rerender(
				<AITextInput
					value="tes"
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);
			act(() => {
				vi.advanceTimersByTime(100);
			});

			rerender(
				<AITextInput
					value="test"
					onChange={handleChange}
					onDebouncedChange={handleDebouncedChange}
				/>,
			);

			// Should not be called yet
			expect(handleDebouncedChange).not.toHaveBeenCalled();

			// Wait for debounce
			act(() => {
				vi.advanceTimersByTime(300);
			});

			// Should be called only once with final value
			expect(handleDebouncedChange).toHaveBeenCalledTimes(1);
			expect(handleDebouncedChange).toHaveBeenCalledWith("test");

			vi.useRealTimers();
		});

		it("onDebouncedChangeが未指定の場合でも正常動作する", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<AITextInput value="" onChange={handleChange} />);

			const textarea = screen.getByRole("textbox");
			await user.type(textarea, "test");

			// Should not throw error and onChange should be called
			expect(handleChange).toHaveBeenCalled();
		});
	});
});
