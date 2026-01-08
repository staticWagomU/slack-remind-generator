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
			status: "ready" as const,
			story_points: 8,
			technical_notes: [
				"shadcn/ui パターンを使用: Radix UI primitives + Tailwind CSS v4",
				"既存コンポーネント構造に従う: src/components/{ui,forms,layout}/",
				"スタイリング: cn() utility, class-variance-authority (cva) for variants",
				"状態管理: React useState hooks, props drilling pattern",
				"フォームパターン: MainForm.tsx の validation/error handling を参考",
				"Radix UI コンポーネント: Dialog (@radix-ui/react-dialog) for modal",
				"アクセシビリティ: ARIA attributes, keyboard navigation, focus management",
				"レスポンシブ: grid/flex layouts, lg: breakpoints (MainForm.tsx参考)",
			],
			acceptance_criteria: [
				"AISetupPrompt: API未設定時に表示、設定を促すCTA付き、dismissable=false",
				"AISettingsDialog: Radix Dialog使用、APIキー入力(type=password)、保存/キャンセルボタン、validation付き",
				"AITextInput: Textarea base、placeholder/helperText対応、文字数カウンタ(max 500)、debounce処理なし(Phase 4で実装)",
				"AIResultCard: RemindCommand 1件表示、confidence score badge、コピーボタン、低信頼度時warning表示",
				"AIResultList: 複数ResultCard表示、空状態メッセージ、loading skeleton、error boundary",
				"AIInputPanel: 上記全て統合、ローディング/エラー状態UI、既存MainFormと独立したレイアウト",
				"デザインシステム一貫性: Button/Input/Textareaの既存variant使用、color palette統一(slate/sky/red)",
				"TypeScript型安全性: AIRequest/AIResponse/AIError型使用、prop types定義、no implicit any",
				"テスト可能性: data-testid属性付与、pure components優先、side effects分離",
			],
			dependencies: ["PBI-001"],
			risks: [
				"Radix UIライブラリの学習コスト: 既存popover.tsxを参考にすることで軽減",
				"複雑なstate管理: 6コンポーネント間の状態共有が必要、props drilling増加の可能性",
				"アクセシビリティ要件: 既存shadcn/uiパターンに従うことでカバー",
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
	// Current Sprint
	// ─────────────────────────────────────────────────────────────
	sprint: {
		number: 2,
		goal: "自然言語入力でSlackリマインダーを生成できるAI入力UIを実装し、shadcn/uiパターンに従った6つのコンポーネントをTDDで完成させる",
		pbi_id: "PBI-002",
		story_points: 8,
		subtasks: [
			// ──────────────────────────────────────────────────────────
			// Component 1: AISetupPrompt (API未設定時の案内)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.1",
				title: "AISetupPrompt型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.2",
				title: "AISetupPromptコンポーネント実装 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.3",
				title: "AISetupPromptリファクタリングとアクセシビリティ対応 (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Component 2: AISettingsDialog (APIキー設定ダイアログ)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.4",
				title: "Dialog UIコンポーネント追加 (@radix-ui/react-dialog)",
				status: "done" as const,
			},
			{
				id: "TASK-2.5",
				title: "AISettingsDialog型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.6",
				title: "AISettingsDialogコンポーネント実装 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.7",
				title:
					"AISettingsDialogリファクタリング: validation/focus management (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Component 3: AITextInput (自然言語入力エリア)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.8",
				title: "AITextInput型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.9",
				title: "AITextInputコンポーネント実装 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.10",
				title:
					"AITextInputリファクタリング: 文字数カウンタとhelperText (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Component 4: AIResultCard (結果カード1件表示)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.11",
				title: "AIResultCard型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.12",
				title: "AIResultCardコンポーネント実装 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.13",
				title:
					"AIResultCardリファクタリング: confidence badge/copy button (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Component 5: AIResultList (結果リスト)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.14",
				title: "AIResultList型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.15",
				title: "AIResultListコンポーネント実装 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.16",
				title:
					"AIResultListリファクタリング: loading skeleton/error boundary (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Component 6: AIInputPanel (メインパネル統合)
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.17",
				title: "AIInputPanel型定義とテスト作成 (Red)",
				status: "done" as const,
			},
			{
				id: "TASK-2.18",
				title: "AIInputPanelコンポーネント実装: 全コンポーネント統合 (Green)",
				status: "done" as const,
			},
			{
				id: "TASK-2.19",
				title:
					"AIInputPanelリファクタリング: state管理とエラーハンドリング (Refactor)",
				status: "done" as const,
			},

			// ──────────────────────────────────────────────────────────
			// Integration & Quality
			// ──────────────────────────────────────────────────────────
			{
				id: "TASK-2.20",
				title: "全UIコンポーネントの統合テスト追加",
				status: "todo" as const,
			},
			{
				id: "TASK-2.21",
				title: "デザインシステム一貫性チェック: color/spacing/typography",
				status: "todo" as const,
			},
			{
				id: "TASK-2.22",
				title: "TypeScript型安全性チェック: no implicit any, strict mode",
				status: "todo" as const,
			},
			{
				id: "TASK-2.23",
				title: "Definition of Done確認: test/lint/format/build全通過",
				status: "todo" as const,
			},
		],
	},

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
