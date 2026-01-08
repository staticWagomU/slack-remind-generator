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
	// Current Sprint (COMPLETED ✅)
	// ─────────────────────────────────────────────────────────────
	sprint: {
		number: 4,
		goal: "AI機能のUXと信頼性を向上させ、プロダクション品質を達成する。デバウンス・リトライロジック・Toast通知でユーザー体験を改善し、テストカバレッジ閾値でコード品質を保証する。",
		pbi_id: "PBI-004",
		status: "completed" as const,
		subtasks: [
			// Feature 1: Debounce for AITextInput (TDD Cycle)
			{
				id: "ST-4.1.1",
				title: "[RED] useDebounce hookのテスト実装(300ms遅延検証)",
				status: "done" as const,
			},
			{
				id: "ST-4.1.2",
				title: "[GREEN] useDebounce hookの実装(useEffect + setTimeout)",
				status: "done" as const,
			},
			{
				id: "ST-4.1.3",
				title: "[RED] AITextInputでdebounce適用のテスト実装",
				status: "done" as const,
			},
			{
				id: "ST-4.1.4",
				title: "[GREEN] AITextInputにuseDebounce統合(API呼び出し削減確認)",
				status: "done" as const,
			},
			{
				id: "ST-4.1.5",
				title: "[REFACTOR] debounce処理のコード整理とドキュメント追加",
				status: "done" as const,
			},

			// Feature 2: Retry Logic for OpenAI API (TDD Cycle)
			{
				id: "ST-4.2.1",
				title:
					"[RED] OpenAI API retry logicのテスト実装(exponential backoff検証)",
				status: "done" as const,
			},
			{
				id: "ST-4.2.2",
				title: "[GREEN] openai.tsにretry関数実装(max 3回, 1s/2s/4s backoff)",
				status: "done" as const,
			},
			{
				id: "ST-4.2.3",
				title: "[RED] 全リトライ失敗時のエラーハンドリングテスト実装",
				status: "done" as const,
			},
			{
				id: "ST-4.2.4",
				title: "[GREEN] 全失敗後のエラー投げ処理実装",
				status: "done" as const,
			},
			{
				id: "ST-4.2.5",
				title: "[REFACTOR] retry logicのコード整理とエラーメッセージ改善",
				status: "done" as const,
			},

			// Feature 3: Toast Notifications (TDD Cycle)
			{
				id: "ST-4.3.1",
				title: "[RED] Toast componentのテスト実装(表示・非表示検証)",
				status: "done" as const,
			},
			{
				id: "ST-4.3.2",
				title: "[GREEN] shadcn/ui toast component導入と基本設定",
				status: "done" as const,
			},
			{
				id: "ST-4.3.3",
				title: "[RED] AIResultCardコピー成功/失敗時のToast表示テスト実装",
				status: "done" as const,
			},
			{
				id: "ST-4.3.4",
				title: "[GREEN] AIResultCardにToast通知統合(コピー成功/失敗時)",
				status: "done" as const,
			},
			{
				id: "ST-4.3.5",
				title: "[RED] API error時のToast表示テスト実装",
				status: "done" as const,
			},
			{
				id: "ST-4.3.6",
				title: "[GREEN] AIInputPanelにToast通知統合(API error時)",
				status: "done" as const,
			},
			{
				id: "ST-4.3.7",
				title: "[REFACTOR] Toast通知のメッセージ統一とa11y対応確認",
				status: "done" as const,
			},

			// Feature 4: Vitest Coverage Threshold (TDD Cycle)
			{
				id: "ST-4.4.1",
				title: "[RED] coverage閾値未達時のビルド失敗テスト(CI simulation)",
				status: "done" as const,
			},
			{
				id: "ST-4.4.2",
				title: "[GREEN] vitest.config.tsにthresholds設定追加(80%/80%/75%/80%)",
				status: "done" as const,
			},
			{
				id: "ST-4.4.3",
				title: "[REFACTOR] 不足カバレッジ領域の特定と補完テスト追加",
				status: "done" as const,
			},

			// Integration & DoD Verification
			{
				id: "ST-4.5.1",
				title: "既存108テスト全てpassすることを確認(pnpm vitest run)",
				status: "done" as const,
			},
			{
				id: "ST-4.5.2",
				title: "DoD確認: lint/format/build全て成功することを検証",
				status: "done" as const,
			},
			{
				id: "ST-4.5.3",
				title: "Acceptance Criteria全項目達成確認とSprint 4完了レポート作成",
				status: "done" as const,
			},
		],
	},

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
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
