import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AISettingsDialog } from "./AISettingsDialog";

describe("AISettingsDialog", () => {
	describe("表示テスト", () => {
		it("openがtrueの時にダイアログが表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("openがfalseの時にダイアログが表示されない", () => {
			render(
				<AISettingsDialog
					open={false}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		it("タイトルが表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.getByText("AI設定")).toBeInTheDocument();
		});

		it("説明文が表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(
				screen.getByText(/OpenAI APIキーを入力してください/),
			).toBeInTheDocument();
		});

		it("APIキー入力欄が表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.getByLabelText("APIキー")).toBeInTheDocument();
		});

		it("保存ボタンが表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
		});

		it("キャンセルボタンが表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(
				screen.getByRole("button", { name: "キャンセル" }),
			).toBeInTheDocument();
		});

		it("初期値が設定されている場合、入力欄に表示される", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
					initialApiKey="sk-test-key"
				/>,
			);

			const input = screen.getByLabelText("APIキー") as HTMLInputElement;
			expect(input.value).toBe("sk-test-key");
		});
	});

	describe("セキュリティ", () => {
		it("APIキー入力欄がtype=passwordになっている", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			const input = screen.getByLabelText("APIキー");
			expect(input).toHaveAttribute("type", "password");
		});
	});

	describe("バリデーション", () => {
		it("空のAPIキーで保存しようとするとエラーメッセージが表示される", async () => {
			const user = userEvent.setup();
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			const saveButton = screen.getByRole("button", { name: "保存" });
			await user.click(saveButton);

			expect(screen.getByText("APIキーを入力してください")).toBeInTheDocument();
		});

		it("有効なAPIキーの場合、エラーメッセージが表示されない", async () => {
			const user = userEvent.setup();
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			const input = screen.getByLabelText("APIキー");
			await user.type(input, "sk-test-key");

			expect(
				screen.queryByText("APIキーを入力してください"),
			).not.toBeInTheDocument();
		});
	});

	describe("インタラクション", () => {
		it("保存ボタンクリックでonSaveが呼ばれる", async () => {
			const user = userEvent.setup();
			const handleSave = vi.fn();

			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={handleSave}
				/>,
			);

			const input = screen.getByLabelText("APIキー");
			await user.type(input, "sk-test-key");

			const saveButton = screen.getByRole("button", { name: "保存" });
			await user.click(saveButton);

			expect(handleSave).toHaveBeenCalledWith("sk-test-key");
		});

		it("キャンセルボタンクリックでonOpenChangeが呼ばれる", async () => {
			const user = userEvent.setup();
			const handleOpenChange = vi.fn();

			render(
				<AISettingsDialog
					open={true}
					onOpenChange={handleOpenChange}
					onSave={() => {}}
				/>,
			);

			const cancelButton = screen.getByRole("button", { name: "キャンセル" });
			await user.click(cancelButton);

			expect(handleOpenChange).toHaveBeenCalledWith(false);
		});
	});

	describe("アクセシビリティ", () => {
		it("data-testid属性が付与されている", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			expect(screen.getByTestId("ai-settings-dialog")).toBeInTheDocument();
		});

		it("適切なARIA属性が設定されている", () => {
			render(
				<AISettingsDialog
					open={true}
					onOpenChange={() => {}}
					onSave={() => {}}
				/>,
			);

			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAccessibleName("AI設定");
		});
	});
});
