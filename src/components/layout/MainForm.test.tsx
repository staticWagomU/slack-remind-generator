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
});
