import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIResultCard } from "./AIResultCard";
import type { RemindCommand } from "../../types/ai";

describe("AIResultCard", () => {
	const mockCommand: RemindCommand = {
		who: "me",
		what: "ミーティング",
		when: "tomorrow at 10am",
	};

	describe("表示テスト", () => {
		it("RemindCommand 1件が表示される", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.95}
					onCopy={() => {}}
				/>,
			);

			expect(
				screen.getByText(/remind me "ミーティング" tomorrow at 10am/),
			).toBeInTheDocument();
		});

		it("confidence scoreがbadgeで表示される", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.85}
					onCopy={() => {}}
				/>,
			);

			expect(screen.getByText("85%")).toBeInTheDocument();
		});

		it("コピーボタンが表示される", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.95}
					onCopy={() => {}}
				/>,
			);

			expect(
				screen.getByRole("button", { name: /コピー/i }),
			).toBeInTheDocument();
		});

		it("低信頼度時warning表示がある", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.6}
					onCopy={() => {}}
				/>,
			);

			expect(screen.getByText(/信頼度が低いため/)).toBeInTheDocument();
		});

		it("高信頼度時warning表示がない", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.9}
					onCopy={() => {}}
				/>,
			);

			expect(screen.queryByText(/信頼度が低いため/)).not.toBeInTheDocument();
		});
	});

	describe("confidence badge表示", () => {
		it("高信頼度(>=0.8)は緑色", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.9}
					onCopy={() => {}}
				/>,
			);

			const badge = screen.getByText("90%");
			expect(badge).toHaveClass("bg-green-100");
		});

		it("中信頼度(>=0.6)は黄色", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.7}
					onCopy={() => {}}
				/>,
			);

			const badge = screen.getByText("70%");
			expect(badge).toHaveClass("bg-yellow-100");
		});

		it("低信頼度(<0.6)は赤色", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.5}
					onCopy={() => {}}
				/>,
			);

			const badge = screen.getByText("50%");
			expect(badge).toHaveClass("bg-red-100");
		});
	});

	describe("インタラクション", () => {
		it("コピーボタンクリックでonCopyが呼ばれる", async () => {
			const user = userEvent.setup();
			const handleCopy = vi.fn();

			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.95}
					onCopy={handleCopy}
				/>,
			);

			const button = screen.getByRole("button", { name: /コピー/i });
			await user.click(button);

			expect(handleCopy).toHaveBeenCalledWith(
				'remind me "ミーティング" tomorrow at 10am',
			);
		});
	});

	describe("アクセシビリティ", () => {
		it("data-testid属性が付与されている", () => {
			render(
				<AIResultCard
					command={mockCommand}
					confidence={0.95}
					onCopy={() => {}}
				/>,
			);

			expect(screen.getByTestId("ai-result-card")).toBeInTheDocument();
		});
	});
});
