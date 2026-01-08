/**
 * AI-Agentic Scrum Dashboard
 * Single Source of Truth for all Scrum artifacts
 *
 * Run: deno run scrum.ts | jq
 */

type PBIStatus = "draft" | "ready" | "in_progress" | "done";

interface ProductBacklogItem {
	id: string;
	title: string;
	description: string;
	status: PBIStatus;
	story_points?: number;
	technical_notes?: string[];
	acceptance_criteria: string[];
	dependencies?: string[];
	risks?: string[];
}

const dashboard = {
	// ─────────────────────────────────────────────────────────────
	// Product Information
	// ─────────────────────────────────────────────────────────────
	product: {
		name: "Slack Remind Generator",
		goal: "AIで複数リマインダーを一括生成し、日本語入力からSlackの/remindコマンドを簡単に作成できるようにする",
	},

	// ─────────────────────────────────────────────────────────────
	// Tech Stack & Commands
	// ─────────────────────────────────────────────────────────────
	tech: {
		language: "TypeScript",
		framework: "Astro + React",
		styling: "Tailwind CSS v4",
		test_command: "pnpm vitest run",
		lint_command: "pnpm lint",
		format_command: "pnpm format:check",
		build_command: "pnpm build",
	},

	// ─────────────────────────────────────────────────────────────
	// Definition of Done
	// ─────────────────────────────────────────────────────────────
	definition_of_done: [
		"All acceptance criteria met",
		"Tests pass: pnpm vitest run",
		"Lint pass: pnpm lint",
		"Format check: pnpm format:check",
		"Build succeeds: pnpm build",
		"No TypeScript errors",
		"Code reviewed (self-review for AI)",
	],

	// ─────────────────────────────────────────────────────────────
	// Product Backlog (ordered by priority)
	// ─────────────────────────────────────────────────────────────
	product_backlog: [
		// ✅ PBI-001: Phase 1: AI機能の基盤構築 (5pts, Sprint 1) - DONE
		// Implemented: src/types/ai.ts, src/services/{errors,openai,aiKeyStorage}.ts, src/utils/aiCommandGenerator.ts
		// Tests: 31 tests passing (5 test files)
		{
			id: "PBI-002",
			title: "Phase 2: AI入力UI実装",
			description:
				"自然言語入力、設定ダイアログ、結果表示などのUIコンポーネントを実装する",
			status: "draft" as const,
			acceptance_criteria: [
				"AISetupPrompt（未設定時案内）が実装されている",
				"AISettingsDialog（設定ダイアログ）が実装されている",
				"AITextInput（入力エリア）が実装されている",
				"AIResultCard（結果カード）が実装されている",
				"AIResultList（結果リスト）が実装されている",
				"AIInputPanel（メインパネル）が実装されている",
				"既存のデザインシステム（shadcn/ui）と一貫性がある",
			],
		},
		{
			id: "PBI-003",
			title: "Phase 3: App統合とレイアウト調整",
			description: "AIInputPanelをApp.tsxに組み込み、レスポンシブ対応を行う",
			status: "draft" as const,
			acceptance_criteria: [
				"App.tsxにAIInputPanelが組み込まれている",
				"既存のフォームと共存するレイアウトになっている",
				"モバイルでも使いやすいレスポンシブデザイン",
				"ローディング状態とエラー状態が適切に表示される",
			],
		},
		{
			id: "PBI-004",
			title: "Phase 4: 品質向上とテスト",
			description: "エラーハンドリング強化、テスト作成、ドキュメント整備を行う",
			status: "draft" as const,
			acceptance_criteria: [
				"主要なロジックにユニットテストがある",
				"エラーケースが適切にハンドリングされている",
				"信頼度が低い場合の警告が表示される",
				"入力のデバウンス処理が実装されている",
			],
		},
	],

	// ─────────────────────────────────────────────────────────────
	// Current Sprint (empty until Sprint Planning)
	// ─────────────────────────────────────────────────────────────
	sprint: null,

	// ─────────────────────────────────────────────────────────────
	// Metrics
	// ─────────────────────────────────────────────────────────────
	metrics: {
		sprints_completed: 1,
		pbis_completed: 1,
		velocity: [5],
	},

	// ─────────────────────────────────────────────────────────────
	// Impediments
	// ─────────────────────────────────────────────────────────────
	impediments: [] as Array<{
		id: string;
		description: string;
		status: "open" | "resolved";
	}>,

	// ─────────────────────────────────────────────────────────────
	// Retrospective Notes
	// ─────────────────────────────────────────────────────────────
	retrospective_notes: [
		// Sprint 1 Retrospective (PBI-001: AI機能の基盤構築, 5 points)
		"[良かった点] TDDアプローチが効果的: 31個のテストを先に作成し、型定義から実装まで段階的に進められた。品質基準(lint/format/build/test)を全てクリアして完了",
		"[良かった点] サブタスク分割が適切: 5ストーリーポイントを18個のサブタスクに分解。依存関係の順序(依存追加→型定義→サービス層→テスト)が明確だった",
		"[良かった点] Definition of Doneの遵守: 全ての受け入れ基準を満たし、品質ゲートを通過。技術的負債を残さず完了",
		"[良かった点] 既存パターンの踏襲: reminder.ts, commandGenerator.ts の設計パターンを活用し、一貫性のあるコードベースを維持",
		"[改善点] ストーリーポイント見積もりの精度向上: 5ポイントで18サブタスク+31テストは適切だったが、次回は類似の複雑度を参考に見積もり精度を上げる",
		"[改善点] テストカバレッジの可視化: vitestの設定はあるがカバレッジレポート未設定。次スプリントでcoverage設定を追加検討",
		"[改善点] リスク管理の追跡: 識別したリスク(localStorage平文保存、API仕様変更)への対応策を次フェーズで検討",
		"[アクション] 次スプリント計画時: UI実装(PBI-002)の見積もりでは、コンポーネント数×複雑度でサブタスク数を算出",
		"[アクション] 技術的負債管理: セキュリティリスク(APIキー管理)の改善をPBI-004または別バックログアイテムとして検討",
		"[アクション] プロセス改善: retrospective_notesのフォーマットを[カテゴリ]形式で統一し、アクションアイテムを追跡可能にする",
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
