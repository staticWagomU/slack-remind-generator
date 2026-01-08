/**
 * AI-Agentic Scrum Dashboard
 * Single Source of Truth for all Scrum artifacts
 *
 * Run: deno run scrum.ts | jq
 */

type PBIStatus = "draft" | "ready" | "in_progress" | "done";

interface _ProductBacklogItem {
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
		status: "completed" as const,
		delivery_date: "2026-01-08",
		summary:
			"4 Sprint (23pts) でプロダクション品質達成。119テスト全pass、カバレッジ閾値設定、全DoD満たしリリース準備完了。",
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

		// ✅ PBI-004: Phase 4: 品質向上とテスト (5pts, Sprint 4) - DONE
		// Implemented: useDebounce (300ms), retry logic (max 3, 1s/2s/4s), Toast notifications, coverage (80%/80%/75%/80%)
		// Tests: +11 tests, Total: 119 tests. All DoD verified.
	],

	// ─────────────────────────────────────────────────────────────
	// Current Sprint (ALL SPRINTS COMPLETED ✅)
	// ─────────────────────────────────────────────────────────────
	sprint: null,

	// ─────────────────────────────────────────────────────────────
	// Metrics
	// ─────────────────────────────────────────────────────────────
	metrics: {
		sprints_completed: 4,
		pbis_completed: 4,
		velocity: [5, 8, 5, 5],
		total_tests: 119,
		test_coverage_configured: true,
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
		// === Product Delivery Complete (2026-01-08) ===
		// Sprint 1-4: TDD徹底(119テスト)、AI-Agentic Scrum有効、段階的実装成功
		// 成果: 4 Sprint, 23pts, velocity [5,8,5,5], 全DoD達成, プロダクション品質
		// 学び: scrum.ts一元管理, TDDで設計品質向上, 段階的デリバリーでリスク最小化
		"✅ Slack Remind Generator: 全4 PBI完了, 119テスト全pass, リリース準備完了",
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
