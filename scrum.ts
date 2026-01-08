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
		// Tests: 31 tests (5 files)

		// ✅ PBI-002: Phase 2: AI入力UI実装 (8pts, Sprint 2) - DONE
		// Implemented: src/components/ai/{AISetupPrompt,AISettingsDialog,AITextInput,AIResultCard,AIResultList,AIInputPanel}.tsx
		// Tests: +61 tests (6 files), Total: 92 tests
		// ✅ PBI-003: Phase 3: App統合とレイアウト調整 (5pts, Sprint 3) - DONE
		// Implemented: AIInputPanel integrated into MainForm.tsx with visual separation
		// Tests: +16 tests in MainForm.test.tsx, Total: 108 tests
		// Layout: Responsive grid (sm/md/lg), independent state management, gradient AI section
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
	// Current Sprint
	// ─────────────────────────────────────────────────────────────
	sprint: null,

	// ─────────────────────────────────────────────────────────────
	// Metrics
	// ─────────────────────────────────────────────────────────────
	metrics: {
		sprints_completed: 3,
		pbis_completed: 3,
		velocity: [5, 8, 5],
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
		// Sprint 1 (5pts): TDD効果的、18サブタスク分解成功、DoD遵守
		// Sprint 2 (8pts): TDD継続(92テスト)、shadcn/ui統合、6コンポーネント分離、a11y対応
		// Sprint 3 (5pts): MainForm統合成功、レスポンシブ対応、独立状態管理、108テスト達成
		// 改善: テストカバレッジ可視化、コミット粒度、エラーハンドリング強化
		"[完了] PBI-003: AIInputPanel統合、gradient背景で視覚分離、sm/md/lg対応、16統合テスト追加",
		"[アクション] PBI-004: retry logic, debounce処理, clipboard fallback, toast通知",
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
