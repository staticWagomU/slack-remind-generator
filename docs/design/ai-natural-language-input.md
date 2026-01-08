# 自然言語リマインダー生成機能 設計書

## 1. 概要

### 1.1 目的
ユーザーが日本語の自然文を入力するだけで、Slackリマインダーの全フィールド（Who/What/When）を自動的に解析・入力する機能を提供する。**1つの入力から複数のリマインダーを生成することも可能。**

### 1.2 ユースケース

#### ユースケース1: 単一リマインダー
```
入力: 「明日の15時に田中さんに進捗報告をリマインド」
         ↓ OpenAI API で解析
出力: 1件のリマインダー
  - Who: @田中  What: 進捗報告  When: tomorrow at 3pm
```

#### ユースケース2: 複数リマインダー（1文から複数生成）
```
入力: 「明日9時にデザインレビュー、午後3時にコードレビュー、17時に日報をリマインド」
         ↓ OpenAI API で解析
出力: 3件のリマインダー
  1. Who: me  What: デザインレビュー  When: tomorrow at 9am
  2. Who: me  What: コードレビュー    When: tomorrow at 3pm
  3. Who: me  What: 日報             When: tomorrow at 5pm
```

#### ユースケース3: 複数リマインダー（異なる宛先）
```
入力: 「月曜に@田中さんに企画書確認、火曜に#devチームで定例、水曜に自分用で資料準備」
         ↓ OpenAI API で解析
出力: 3件のリマインダー
  1. Who: @田中  What: 企画書確認  When: Monday
  2. Who: #dev   What: 定例       When: Tuesday
  3. Who: me     What: 資料準備   When: Wednesday
```

### 1.3 採用技術
- **AI API**: OpenAI API (GPT-4o-mini 推奨)
- **通信方式**: クライアントサイドから直接API呼び出し
- **APIキー管理**: ユーザーがブラウザで入力（localStorage保存）

---

## 2. システムアーキテクチャ

### 2.1 全体構成
```
┌─────────────────────────────────────────────────────────────┐
│                    フロントエンド (React)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  AIInputPanel.tsx                       ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ ││
│  │  │ 自然言語入力   │  │ 解析結果一覧   │  │ 一括コピー  │ ││
│  │  │ (テキストエリア)│  │ (複数カード)   │  │             │ ││
│  │  └───────┬───────┘  └───────────────┘  └─────────────┘ ││
│  └──────────┼──────────────────────────────────────────────┘│
│             │                                                │
│  ┌──────────▼──────────────────────────────────────────────┐│
│  │              OpenAIService.ts                           ││
│  │  - APIキー管理                                          ││
│  │  - プロンプト構築（複数リマインダー対応）                  ││
│  │  - レスポンス解析                                        ││
│  └──────────┬──────────────────────────────────────────────┘│
└─────────────┼───────────────────────────────────────────────┘
              │ HTTPS
              ▼
┌─────────────────────────────────────────────────────────────┐
│              OpenAI API (api.openai.com)                    │
│              Model: gpt-4o-mini                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 データフロー
```
1. ユーザー入力
   「明日9時にデザインレビュー、15時にコードレビュー」
                    │
                    ▼
2. OpenAI API呼び出し
   POST https://api.openai.com/v1/chat/completions
   - model: "gpt-4o-mini"
   - messages: [システムプロンプト + ユーザー入力]
   - response_format: { type: "json_object" }
                    │
                    ▼
3. JSON レスポンス解析（配列形式）
   {
     "reminders": [
       {
         "who": { "type": "me" },
         "what": "デザインレビュー",
         "when": { "japanese": "明日9時", "english": "tomorrow at 9am" }
       },
       {
         "who": { "type": "me" },
         "what": "コードレビュー",
         "when": { "japanese": "明日15時", "english": "tomorrow at 3pm" }
       }
     ],
     "confidence": 0.95
   }
                    │
                    ▼
4. UIに反映 & ユーザー確認
   - 各リマインダーをカード形式で表示
   - 個別コピー or 一括コピー
   - 個別編集 or 削除が可能
```

---

## 3. 型定義

### 3.1 新規型定義 (`src/types/ai.ts`)
```typescript
/**
 * 解析された単一のリマインダー
 */
export interface ParsedReminder {
  id: string;              // フロントエンドで生成するユニークID
  who: ParsedWho;
  what: string;
  when: ParsedWhen;
  command?: string;        // 生成された/remindコマンド
}

export interface ParsedWho {
  type: "me" | "user" | "channel";
  value?: string;          // ユーザー名またはチャンネル名
}

export interface ParsedWhen {
  japanese: string;        // 元の日本語表現
  english: string;         // Slack用英語形式
}

/**
 * OpenAI APIからのレスポンス形式
 */
export interface AIParseResponse {
  reminders: Omit<ParsedReminder, "id" | "command">[];
  confidence: number;      // 0.0 - 1.0
}

/**
 * APIキー設定
 */
export interface AISettings {
  apiKey: string;
  model: AIModel;
  isEnabled: boolean;
}

export type AIModel = "gpt-4o-mini" | "gpt-4o" | "gpt-3.5-turbo";

/**
 * API呼び出し状態
 */
export interface AIRequestState {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  results: ParsedReminder[];
  confidence: number | null;
}
```

### 3.2 既存型への影響
- `TimeInputMode` に `"ai"` を追加
```typescript
// src/types/reminder.ts
export type TimeInputMode = "quick" | "calendar" | "recurring" | "custom" | "lastBusinessDay" | "ai";
```

---

## 4. コンポーネント設計

### 4.1 新規コンポーネント一覧

| コンポーネント | 責務 |
|--------------|------|
| `AIInputPanel.tsx` | AI入力機能全体を管理するメインパネル |
| `AITextInput.tsx` | 自然言語入力エリア |
| `AIResultList.tsx` | 解析結果のリスト表示 |
| `AIResultCard.tsx` | 個別リマインダーのカード表示 |
| `AISettingsDialog.tsx` | APIキー設定ダイアログ |
| `AISetupPrompt.tsx` | APIキー未設定時の案内表示 |

### 4.2 コンポーネント詳細

#### `AIInputPanel.tsx`（メインパネル）
```typescript
// src/components/ai/AIInputPanel.tsx
interface AIInputPanelProps {
  // なし（自己完結型）
}

// 内部状態
// - input: string（入力テキスト）
// - results: ParsedReminder[]（解析結果）
// - requestState: AIRequestState
```

**責務:**
- AI機能全体の状態管理
- APIキー設定状態の確認
- 子コンポーネントの統括

#### `AITextInput.tsx`（入力エリア）
```typescript
// src/components/ai/AITextInput.tsx
interface AITextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}
```

**責務:**
- テキストエリアの表示
- 入力例の提示
- 送信ボタン（解析トリガー）

#### `AIResultList.tsx`（結果リスト）
```typescript
// src/components/ai/AIResultList.tsx
interface AIResultListProps {
  results: ParsedReminder[];
  confidence: number;
  onEdit: (id: string, field: keyof ParsedReminder, value: unknown) => void;
  onDelete: (id: string) => void;
  onCopyAll: () => void;
  onCopySingle: (id: string) => void;
}
```

**責務:**
- 結果リストのレイアウト
- 一括コピーボタン
- 信頼度表示

#### `AIResultCard.tsx`（個別カード）
```typescript
// src/components/ai/AIResultCard.tsx
interface AIResultCardProps {
  reminder: ParsedReminder;
  onEdit: (field: keyof ParsedReminder, value: unknown) => void;
  onDelete: () => void;
  onCopy: () => void;
}
```

**責務:**
- 個別リマインダーの表示
- Who/What/When の編集機能
- コピー・削除ボタン
- 生成コマンドのプレビュー

#### `AISettingsDialog.tsx`（設定ダイアログ）
```typescript
// src/components/ai/AISettingsDialog.tsx
interface AISettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AISettings) => void;
  currentSettings: AISettings | null;
}
```

**責務:**
- APIキーの入力フォーム
- モデル選択
- APIキーの検証
- 保存・削除機能

### 4.3 コンポーネント階層
```
App.tsx
├── MainForm.tsx
│   ├── WhoSection.tsx
│   ├── WhatSection.tsx
│   ├── WhenSection.tsx
│   └── CommandPreview.tsx
│
└── AIInputPanel.tsx              ← 新規（独立したセクション）
    ├── AISetupPrompt.tsx         ← 新規（APIキー未設定時）
    ├── AITextInput.tsx           ← 新規
    ├── AIResultList.tsx          ← 新規
    │   └── AIResultCard.tsx      ← 新規（複数）
    └── AISettingsDialog.tsx      ← 新規
```

---

## 5. サービス層設計

### 5.1 OpenAIService (`src/services/openai.ts`)

```typescript
// src/services/openai.ts

const SYSTEM_PROMPT = `
あなたはSlackリマインダーコマンドの解析アシスタントです。
ユーザーの日本語入力から、1つまたは複数のリマインダーを抽出してください。

## 入力パターン

1. 単一リマインダー:
   「明日9時にMTGをリマインド」→ 1件

2. 複数リマインダー（読点/句点区切り）:
   「明日9時にMTG、15時にレビュー」→ 2件

3. 複数リマインダー（並列表現）:
   「月曜と水曜と金曜に朝会をリマインド」→ 3件

4. 複数リマインダー（異なる宛先）:
   「@田中さんに報告書、#teamに進捗共有」→ 2件

## 抽出ルール

各リマインダーについて以下を抽出:

1. who (誰に):
   - "me" / 自分自身 / 指定なし → { "type": "me" }
   - @ユーザー名 / 人名 → { "type": "user", "value": "ユーザー名" }
   - #チャンネル名 → { "type": "channel", "value": "チャンネル名" }

2. what (何を):
   - リマインダーの内容（「リマインド」「通知」は除外）

3. when (いつ):
   - japanese: 元の日本語表現
   - english: Slackコマンド用の英語形式

## 時間変換ルール
- "10分後" → "in 10 minutes"
- "1時間後" → "in 1 hour"
- "明日" → "tomorrow"
- "明日の9時" → "tomorrow at 9am"
- "来週月曜日" → "Monday"
- "毎日9時" → "at 9am every day"
- "毎週金曜日" → "every Friday"
- "平日18時" → "at 6pm every weekday"
- "2025年1月15日" → "on January 15, 2025"
- "月曜と水曜" → それぞれ別のリマインダーに分割

## 出力形式（必ずこのJSON形式で）
{
  "reminders": [
    {
      "who": { "type": "me" | "user" | "channel", "value": "string (optional)" },
      "what": "string",
      "when": { "japanese": "string", "english": "string" }
    }
  ],
  "confidence": 0.0-1.0
}

## 注意事項
- 入力に複数のタスクが含まれる場合は、必ず分割して配列で返す
- 時間が共通の場合でも、タスクごとに別のリマインダーとして返す
- 曖昧な場合は confidence を下げる
`;

export class OpenAIService {
  private apiKey: string;
  private model: AIModel;

  constructor(settings: AISettings) {
    this.apiKey = settings.apiKey;
    this.model = settings.model;
  }

  async parseNaturalLanguage(input: string): Promise<AIParseResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000, // 複数リマインダー対応で増加
      }),
    });

    if (!response.ok) {
      throw new AIServiceError(response.status, await response.text());
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content) as AIParseResponse;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await fetch("https://api.openai.com/v1/models", {
        headers: { "Authorization": `Bearer ${this.apiKey}` },
      });
      return true;
    } catch {
      return false;
    }
  }
}
```

### 5.2 コマンド生成ユーティリティ

```typescript
// src/utils/aiCommandGenerator.ts
import type { ParsedReminder, ParsedWho } from "../types/ai";
import type { WhoType } from "../types/reminder";

/**
 * ParsedWho を WhoType に変換
 */
export function convertParsedWhoToWhoType(parsed: ParsedWho): WhoType {
  if (parsed.type === "me") {
    return "me";
  }
  if (parsed.type === "user") {
    return { type: "user", username: parsed.value ?? "" };
  }
  return { type: "channel", channelName: parsed.value ?? "" };
}

/**
 * ParsedReminder から /remind コマンドを生成
 */
export function generateCommandFromParsed(reminder: ParsedReminder): string {
  const { who, what, when } = reminder;

  let whoStr: string;
  if (who.type === "me") {
    whoStr = "me";
  } else if (who.type === "user") {
    whoStr = `@${who.value}`;
  } else {
    whoStr = `#${who.value}`;
  }

  // メッセージ内にスペースや特殊文字がある場合は引用符で囲む
  const whatStr = what.includes(" ") || what.includes('"')
    ? `"${what.replace(/"/g, '\\"')}"`
    : `"${what}"`;

  return `/remind ${whoStr} ${whatStr} ${when.english}`;
}

/**
 * 複数のリマインダーコマンドを改行区切りで結合
 */
export function generateAllCommands(reminders: ParsedReminder[]): string {
  return reminders
    .map(r => generateCommandFromParsed(r))
    .join("\n");
}
```

### 5.3 AIキー管理 (`src/services/aiKeyStorage.ts`)

```typescript
// src/services/aiKeyStorage.ts
import type { AISettings } from "../types/ai";

const STORAGE_KEY = "slack-remind-ai-settings";

export function saveAISettings(settings: AISettings): void {
  const encoded = {
    ...settings,
    apiKey: btoa(settings.apiKey), // 簡易難読化
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(encoded));
}

export function loadAISettings(): AISettings | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      apiKey: atob(parsed.apiKey),
    };
  } catch {
    return null;
  }
}

export function clearAISettings(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasAISettings(): boolean {
  return loadAISettings() !== null;
}
```

---

## 6. UI/UX設計

### 6.1 全体レイアウト（AIセクションを独立配置）
```
┌─────────────────────────────────────────────────────────────────────┐
│  Slackリマインドコマンド生成                                         │
│  日本語で入力して、Slackの/remindコマンドを簡単生成                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✨ AIでまとめて作成                              [⚙️ 設定]  │   │
│  │ ─────────────────────────────────────────────────────────── │   │
│  │ 自然な日本語で複数のリマインダーを一度に作成できます         │   │
│  │                                                             │   │
│  │ ┌─────────────────────────────────────────────────────────┐│   │
│  │ │ 明日9時にデザインレビュー、15時にコードレビュー、        ││   │
│  │ │ 17時に#teamで日報共有をリマインド                       ││   │
│  │ │                                                         ││   │
│  │ └─────────────────────────────────────────────────────────┘│   │
│  │                                        [✨ 解析する]        │   │
│  │                                                             │   │
│  │ 💡 入力例: 「明日9時にMTG準備」「毎週金曜に@田中さんに報告」│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📋 解析結果 (3件)                    信頼度: 95% [全てコピー]│   │
│  │ ─────────────────────────────────────────────────────────── │   │
│  │                                                             │   │
│  │ ┌─────────────────────────────────────────────────────────┐│   │
│  │ │ 1. デザインレビュー                          [📋] [🗑️] ││   │
│  │ │    👤 me  🕐 tomorrow at 9am                            ││   │
│  │ │    /remind me "デザインレビュー" tomorrow at 9am        ││   │
│  │ └─────────────────────────────────────────────────────────┘│   │
│  │                                                             │   │
│  │ ┌─────────────────────────────────────────────────────────┐│   │
│  │ │ 2. コードレビュー                            [📋] [🗑️] ││   │
│  │ │    👤 me  🕐 tomorrow at 3pm                            ││   │
│  │ │    /remind me "コードレビュー" tomorrow at 3pm          ││   │
│  │ └─────────────────────────────────────────────────────────┘│   │
│  │                                                             │   │
│  │ ┌─────────────────────────────────────────────────────────┐│   │
│  │ │ 3. 日報共有                                  [📋] [🗑️] ││   │
│  │ │    👤 #team  🕐 tomorrow at 5pm                         ││   │
│  │ │    /remind #team "日報共有" tomorrow at 5pm             ││   │
│  │ └─────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  または、手動で1つずつ作成:                                         │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│  │ [既存のWho/What/When     │  │ [CommandPreview]             │   │
│  │  フォーム]               │  │                              │   │
│  └──────────────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 APIキー未設定時
```
┌─────────────────────────────────────────────────────────────┐
│ ✨ AIでまとめて作成                                         │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│  🔑 AI機能を使用するにはOpenAI APIキーが必要です            │
│                                                             │
│  APIキーはOpenAIのサイトから取得できます:                   │
│  https://platform.openai.com/api-keys                       │
│                                                             │
│  [APIキーを設定する]                                        │
│                                                             │
│  ℹ️ APIキーはブラウザのローカルストレージに保存されます     │
│     入力内容はOpenAIのサーバーに送信されます                │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 ローディング状態
```
┌─────────────────────────────────────────────────────────────┐
│ ✨ AIでまとめて作成                              [⚙️ 設定]  │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 明日9時にデザインレビュー、15時にコードレビュー...      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ⏳ 解析中...                                               │
│  ████████░░░░░░░░░░░░                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 エラー状態
```
┌─────────────────────────────────────────────────────────────┐
│ ❌ 解析に失敗しました                                       │
│                                                             │
│ エラー: APIキーが無効または期限切れです                     │
│                                                             │
│ [設定を確認] [再試行]                                       │
└─────────────────────────────────────────────────────────────┘
```

### 6.5 低信頼度時の警告
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ 解析結果を確認してください                信頼度: 45%    │
│                                                             │
│ 入力内容が曖昧なため、解析結果が正確でない可能性があります。│
│ 各項目を確認・編集してからご利用ください。                  │
└─────────────────────────────────────────────────────────────┘
```

### 6.6 結果カードの編集モード
```
┌─────────────────────────────────────────────────────────────┐
│ 1. デザインレビュー                         [✓ 確定] [🗑️]  │
│ ─────────────────────────────────────────────────────────── │
│ 👤 誰に:  ○ me  ○ @[_______]  ○ #[_______]                │
│ 💬 内容:  [デザインレビュー________________]                │
│ 🕐 日時:  [tomorrow at 9am__________________]               │
│ ─────────────────────────────────────────────────────────── │
│ /remind me "デザインレビュー" tomorrow at 9am               │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. エラーハンドリング

### 7.1 エラー種別と対応

| エラー種別 | 原因 | ユーザー表示 | 対応 |
|-----------|------|-------------|------|
| `401 Unauthorized` | APIキー無効 | 「APIキーが無効です」 | 設定ダイアログを開く |
| `429 Rate Limit` | レート制限 | 「しばらく待ってから再試行」 | 自動リトライ（指数バックオフ） |
| `500 Server Error` | OpenAI障害 | 「サービスが一時的に利用不可」 | リトライボタン表示 |
| `Network Error` | 接続エラー | 「ネットワーク接続を確認」 | リトライボタン表示 |
| `Parse Error` | JSON解析失敗 | 「解析に失敗しました」 | 別の表現で再入力を促す |
| `Low Confidence` | 信頼度 < 0.5 | 「解析結果を確認してください」 | 警告表示、手動編集を促す |
| `Empty Input` | 入力なし | 「リマインダー内容を入力」 | 入力例を表示 |

### 7.2 エラー型定義
```typescript
// src/services/errors.ts
export class AIServiceError extends Error {
  constructor(
    public statusCode: number,
    public details: string
  ) {
    super(`AI Service Error: ${statusCode}`);
    this.name = "AIServiceError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AIServiceError) {
    switch (error.statusCode) {
      case 401: return "APIキーが無効です。設定を確認してください。";
      case 429: return "リクエスト制限に達しました。しばらく待ってから再試行してください。";
      case 500: return "OpenAIサービスが一時的に利用できません。";
      default: return "予期しないエラーが発生しました。";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "不明なエラーが発生しました。";
}
```

---

## 8. セキュリティ考慮事項

### 8.1 APIキーの取り扱い
1. **保存方法**: localStorage + Base64エンコード（難読化のみ）
2. **表示**: マスク表示（`sk-...****`）
3. **送信**: HTTPS経由で直接OpenAI APIへ

### 8.2 プライバシー告知（必須表示）
```
⚠️ AI機能に関する注意事項:
• 入力内容はOpenAI社のサーバーに送信されます
• APIキーはお使いのブラウザに保存されます
• 機密情報を含む内容の入力は避けてください
• 共有PCでの使用は推奨しません
```

### 8.3 データ保持
- 入力履歴: 保存しない
- 解析結果: ページ離脱時に破棄
- APIキー: 明示的に削除するまで保持

---

## 9. コスト見積もり

### 9.1 1回あたりのトークン使用量
- システムプロンプト: 約600トークン
- ユーザー入力: 約50トークン
- レスポンス（3件）: 約300トークン
- **合計**: 約950トークン/回

### 9.2 モデル別料金（gpt-4o-mini）
| 使用頻度 | 月間呼び出し | 月額コスト |
|---------|-------------|-----------|
| ライト | 100回 | 約$0.02 |
| ミディアム | 500回 | 約$0.10 |
| ヘビー | 2000回 | 約$0.40 |

---

## 10. ファイル構成（実装後）

```
src/
├── components/
│   ├── ai/                           ← 新規ディレクトリ
│   │   ├── AIInputPanel.tsx          ← 新規: メインパネル
│   │   ├── AITextInput.tsx           ← 新規: 入力エリア
│   │   ├── AIResultList.tsx          ← 新規: 結果リスト
│   │   ├── AIResultCard.tsx          ← 新規: 結果カード
│   │   ├── AISettingsDialog.tsx      ← 新規: 設定ダイアログ
│   │   ├── AISetupPrompt.tsx         ← 新規: 未設定時案内
│   │   └── index.ts                  ← 新規: エクスポート
│   ├── forms/
│   │   └── (既存のまま)
│   ├── layout/
│   │   └── (既存のまま)
│   └── ui/
│       └── (既存のまま)
├── services/
│   ├── openai.ts                     ← 新規: OpenAI API呼び出し
│   ├── aiKeyStorage.ts               ← 新規: APIキー管理
│   └── errors.ts                     ← 新規: エラーハンドリング
├── types/
│   ├── reminder.ts                   ← 修正: TimeInputModeに"ai"追加
│   └── ai.ts                         ← 新規: AI関連型定義
├── utils/
│   ├── aiCommandGenerator.ts         ← 新規: コマンド生成
│   └── (既存のまま)
├── hooks/
│   └── useAI.ts                      ← 新規: AI状態管理フック
└── constants/
    └── (既存のまま)
```

---

## 11. 実装フェーズ

### Phase 1: 基盤構築（Day 1-2）
1. 型定義の追加 (`src/types/ai.ts`)
2. エラー型定義 (`src/services/errors.ts`)
3. OpenAIサービス実装 (`src/services/openai.ts`)
4. APIキー保存機能 (`src/services/aiKeyStorage.ts`)
5. コマンド生成ユーティリティ (`src/utils/aiCommandGenerator.ts`)

### Phase 2: UI実装（Day 3-4）
6. AISetupPrompt 実装（未設定時案内）
7. AISettingsDialog 実装（設定ダイアログ）
8. AITextInput 実装（入力エリア）
9. AIResultCard 実装（結果カード）
10. AIResultList 実装（結果リスト）
11. AIInputPanel 実装（メインパネル）

### Phase 3: 統合（Day 5）
12. App.tsx への AIInputPanel 組み込み
13. レイアウト調整
14. レスポンシブ対応

### Phase 4: 品質向上（Day 6-7）
15. エラーハンドリング強化
16. ローディング状態の改善
17. 入力のデバウンス処理
18. テスト作成
19. ドキュメント整備

---

## 12. 今後の拡張案

### 短期（v1.1）
- **履歴機能**: 過去の解析結果をローカルに保存
- **テンプレート**: よく使うパターンをプリセット登録

### 中期（v1.2）
- **音声入力**: Web Speech API との連携
- **プロンプトカスタマイズ**: ユーザー独自のルール追加

### 長期（v2.0）
- **Slack連携**: OAuth認証でチャンネル/ユーザー一覧を取得
- **バッチ実行**: 生成したコマンドを直接Slackで実行
- **オフライン対応**: WebLLMによるローカル処理

---

## 13. 依存パッケージ

追加インストールは不要（fetch APIを使用）。

オプション:
```json
{
  "devDependencies": {
    "@types/node": "latest"  // crypto等のNode API型定義（既存で十分）
  }
}
```
