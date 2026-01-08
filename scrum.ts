/**
 * AI-Agentic Scrum Dashboard
 * Single Source of Truth for all Scrum artifacts
 *
 * Run: deno run scrum.ts | jq
 */

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
        "OpenAI APIとの連携に必要な型定義、サービス層、ユーティリティを実装する",
      status: "draft" as const,
      acceptance_criteria: [
        "src/types/ai.ts に型定義が作成されている",
        "src/services/errors.ts にエラー型が定義されている",
        "src/services/openai.ts にOpenAI API呼び出し機能が実装されている",
        "src/services/aiKeyStorage.ts にAPIキー管理機能が実装されている",
        "src/utils/aiCommandGenerator.ts にコマンド生成ユーティリティが実装されている",
        "全てのファイルで型チェックが通る",
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
