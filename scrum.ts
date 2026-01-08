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
		// Implemented: useDebounce hook (300ms), OpenAI retry logic (max 3, 1s/2s/4s backoff)
		// Toast notifications (Toast component + useToast hook), Coverage thresholds (80%/80%/75%/80%)
		// Tests: +11 tests (useDebounce: 4, openai retry: 4, toast integration via existing tests), Total: 119 tests
		// All DoD items verified: 119 tests pass, lint pass, format pass, build succeeds, no TS errors
		{
			id: "PBI-004",
			title: "Phase 4: 品質向上とテスト",
			description:
				"AI機能のUXと信頼性を向上させるため、デバウンス処理・リトライロジック・Toast通知・テストカバレッジ閾値を実装する",
			status: "done" as const,
			story_points: 5,
			dependencies: ["PBI-001", "PBI-002", "PBI-003"],
			technical_notes: [
				"[Debounce] AITextInputにuseDebounceフックを追加 (300ms推奨)、API呼び出し削減とUX向上",
				"[Retry Logic] openai.tsにexponential backoff付きretryロジック実装 (max 3回, 1s/2s/4s)",
				"[Toast通知] shadcn/ui toast componentを導入、コピー成功/失敗・API error時に通知表示",
				"[Coverage閾値] vitest.config.tsに thresholds 設定追加 (lines: 80%, functions: 80%, branches: 75%, statements: 80%)",
				"[Existing] 低信頼度警告は既にAIResultCard.tsxで実装済み (confidence < 0.7)",
			],
			acceptance_criteria: [
				"AITextInputで300ms debounce動作し、連続入力時のAPI呼び出しが削減されることをテストで検証できる",
				"OpenAI API失敗時にexponential backoffで最大3回リトライし、全失敗後にエラーが投げられることをテストで検証できる",
				"コピー成功/失敗・API error発生時にToast通知が表示され、ユーザーに状態がフィードバックされる",
				"pnpm vitest run --coverage実行時、設定した閾値(80%/80%/75%/80%)を満たさない場合はビルドが失敗する",
				"既存の108テストが全てpassし、DoD(lint/format/build)も満たしている",
			],
		},
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
		// Sprint 1-3 Summary: TDD効果的(108テスト)、shadcn/ui統合、MainForm統合成功、a11y/レスポンシブ対応
		// 継続改善: テストカバレッジ可視化、コミット粒度、エラーハンドリング強化

		// ✅ Sprint 4 Complete: プロダクト完成
		"[成果] PBI-004完了: useDebounce hook, OpenAI retry logic (exponential backoff), Toast notifications実装",
		"[成果] 119テスト全pass, coverage thresholds設定 (80%/80%/75%/80%), 全DoD達成",
		"[良かった] TDD厳密に実施 (RED→GREEN→REFACTOR), 既存テスト全て維持, 段階的コミット",
		"[良かった] Toast実装でカスタムコンポーネント採用 (shadcn/ui依存削減), テスト容易性向上",
		"[学び] リトライロジックのテストは時間ベース検証が必要, モックの工夫が重要",
		"[学び] ToastProviderのContext設計でテスト環境とproduction環境の統一が重要",
		"[完了] 全4 Sprint完了, 23 subtasks完了, プロダクション品質達成",

		// 🎉 Product Delivery Complete - Final Retrospective
		"[総括] 4 Sprint (合計23pts) で Slack Remind Generator を完成・リリース",
		"[品質] 119テスト, カバレッジ閾値達成, lint/format/build全pass, TypeScriptエラー0",
		"[成功要因] TDD徹底 (全機能でRED→GREEN→REFACTOR), AI-Agentic Scrumでの計画的開発",
		"[成功要因] 段階的実装 (Phase 1-4), 独立した状態管理, 既存機能の破壊なし",
		"[技術選択] Astro+React, Tailwind CSS v4, OpenAI GPT-4o-mini, カスタムToast (依存削減)",
		"[UX品質] デバウンス(300ms), リトライ(exponential backoff), Toast通知, 信頼度表示",
		"[学び] 単一scrum.tsでの一元管理が効果的, コミット粒度の重要性, テスト容易性の設計",
		"[今後] プロダクション運用, ユーザーフィードバック収集, 継続的改善",
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
