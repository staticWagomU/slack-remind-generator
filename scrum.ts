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
    {
      id: "PBI-001",
      title: "Phase 1: AI機能の基盤構築",
      description:
        "OpenAI APIとの連携に必要な型定義、サービス層、ユーティリティを実装する。これには依存関係のセットアップ、型定義、エラーハンドリング、APIキー管理、コマンド生成ロジックが含まれる。",
      status: "ready" as const,
      story_points: 5,
      technical_notes: [
        "OpenAI SDK (openai パッケージ) を依存関係に追加する必要がある",
        "vitest とその設定ファイルを追加してテスト環境を整備する",
        "既存の src/types/reminder.ts と src/utils/commandGenerator.ts のパターンに従う",
        "localStorage を使用してAPIキーを管理する (ブラウザ環境)",
        "エラーハンドリングは既存の ValidationError パターンを参考にする",
      ],
      acceptance_criteria: [
        "package.json に openai パッケージが追加されている",
        "package.json に vitest, @vitest/ui, および関連する型定義が devDependencies に追加されている",
        "vitest.config.ts が作成され、Astro + React 環境に適した設定がされている",
        "src/types/ai.ts が作成され、AIRequest, AIResponse, AIError, RemindCommand, ConfidenceScore 型が定義されている",
        "src/services/errors.ts が作成され、AIServiceError, APIKeyError, OpenAIAPIError のエラークラスが定義されている",
        "src/services/openai.ts が作成され、parseNaturalLanguageToCommands 関数が実装されている",
        "src/services/aiKeyStorage.ts が作成され、saveApiKey, getApiKey, clearApiKey 関数が実装されている",
        "src/utils/aiCommandGenerator.ts が作成され、convertAIResponseToCommands 関数が実装されている",
        "各サービス層とユーティリティに対応するテストファイル (*.test.ts) が作成されている",
        "pnpm install が成功する (依存関係の整合性)",
        "pnpm lint が通る (コード品質)",
        "pnpm format:check が通る (コードフォーマット)",
        "pnpm build が成功する (TypeScript型チェックとビルド)",
        "pnpm vitest run が成功する (全テストがパス)",
      ],
      dependencies: [],
      risks: [
        "OpenAI APIキーの管理方法について、セキュリティ上の懸念がある (localStorageは平文保存)",
        "OpenAI API仕様の変更によりパース処理が影響を受ける可能性がある",
      ],
    },
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
      description:
        "AIInputPanelをApp.tsxに組み込み、レスポンシブ対応を行う",
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
      description:
        "エラーハンドリング強化、テスト作成、ドキュメント整備を行う",
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
  sprint: null as null | {
    goal: string;
    pbi_id: string;
    subtasks: Array<{
      id: string;
      title: string;
      status: "todo" | "red" | "green" | "refactor" | "done";
    }>;
  },

  // ─────────────────────────────────────────────────────────────
  // Metrics
  // ─────────────────────────────────────────────────────────────
  metrics: {
    sprints_completed: 0,
    pbis_completed: 0,
    velocity: [] as number[],
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
  retrospective_notes: [] as string[],
};

// Output as JSON for tooling
console.log(JSON.stringify(dashboard, null, 2));
