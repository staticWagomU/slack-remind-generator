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
		{
			id: "PBI-003",
			title: "Phase 3: App統合とレイアウト調整",
			description:
				"AIInputPanelをApp.tsxに組み込み、手動入力とAI入力の両方を提供する統合UI/UXを実装する",
			status: "done" as const,
			story_points: 5,
			dependencies: ["PBI-001", "PBI-002"],
			acceptance_criteria: [
				"App.tsxまたはMainForm.tsxにAIInputPanelが統合され、手動/AI両方の入力方法が利用可能",
				"既存MainFormとAIInputPanelが視覚的に分離され、どちらも操作可能な状態で共存している",
				"モバイル(sm)、タブレット(md)、デスクトップ(lg)すべてで適切にレイアウトされ、横スクロールが発生しない",
				"AIInputPanelのローディング/エラー状態が既存のMainFormに影響を与えず独立して表示される",
				"統合後もpnpm vitest run、pnpm lint、pnpm buildがすべて成功する",
			],
			technical_notes: [
				"統合方法の選択肢: (A) MainForm内に新セクションとして追加 OR (B) App.tsxでタブ/アコーディオン形式で切替",
				"推奨アプローチ: MainForm上部にAIInputPanelを追加し、境界線で視覚的分離を明確化",
				"既存レスポンシブパターンを踏襲: grid-cols-1 lg:grid-cols-2、lg:sticky lg:top-6 lg:h-fit",
				"AIInputPanelは幅100%で表示し、内部の2カラムレイアウトは既存パターンに合わせる",
				"App.test.tsxまたはMainForm.test.tsxに統合後の状態検証テストを追加(render test、両コンポーネント存在確認)",
				"既存92テストを破壊しないことを確認後、統合テストを追加",
			],
			risks: [
				"既存MainFormのレイアウトロジック変更により、意図しないUI崩れが発生する可能性",
				"モバイルでAIInputPanelとMainFormが縦に並んだ際の画面スクロール量増加によるUX低下",
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
	// Current Sprint
	// ─────────────────────────────────────────────────────────────
	sprint: {
		number: 3,
		goal: "AI入力と手動入力を統合した完全なユーザー体験を提供する",
		pbi_id: "PBI-003",
		subtasks: [
			{
				id: "PBI-003-01",
				title: "統合テストの準備: MainFormの統合前ベースラインテストを作成",
				status: "done" as const,
			},
			{
				id: "PBI-003-02",
				title:
					"AIInputPanelの統合: MainForm.tsxにAIInputPanelコンポーネントを追加",
				status: "done" as const,
			},
			{
				id: "PBI-003-03",
				title:
					"レスポンシブレイアウト実装: sm/md/lgでの適切な表示とスクロール制御",
				status: "done" as const,
			},
			{
				id: "PBI-003-04",
				title:
					"独立した状態管理の検証: AIとMainFormのローディング/エラー状態が干渉しないことを確認",
				status: "done" as const,
			},
			{
				id: "PBI-003-05",
				title: "統合テスト実装: 両コンポーネントの共存と独立性をテストで保証",
				status: "done" as const,
			},
			{
				id: "PBI-003-06",
				title:
					"Definition of Done確認: vitest/lint/build/TypeScriptエラーチェック",
				status: "done" as const,
			},
		],
	},

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
		// 改善: テストカバレッジ可視化、コミット粒度、エラーハンドリング強化
		"[アクション] PBI-003: App.tsx統合時のレイアウト調整、MainFormとの共存パターン確立",
		"[アクション] PBI-004: retry logic, debounce処理, clipboard fallback, toast通知",
	] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
