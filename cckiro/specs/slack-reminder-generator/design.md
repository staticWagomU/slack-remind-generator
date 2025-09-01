# Slackリマインダーコマンド生成アプリ 設計書

## 1. アーキテクチャ設計

### 1.1 技術スタック
- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useReducer)
- **ローカルストレージ**: Web Storage API
- **コピー機能**: Clipboard API

### 1.2 プロジェクト構成
```
src/
├── components/          # UIコンポーネント
│   ├── forms/          # フォーム関連コンポーネント
│   ├── ui/             # 共通UIコンポーネント
│   └── layout/         # レイアウトコンポーネント
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ関数
├── types/              # TypeScript型定義
├── constants/          # 定数定義
└── styles/             # グローバルスタイル
```

## 2. データ設計

### 2.1 型定義

#### 2.1.1 リマインダー設定型
```typescript
interface ReminderConfig {
  id: string;
  who: WhoType;
  what: string;
  when: string;
  createdAt: Date;
}

type WhoType = 'me' | { type: 'user'; username: string } | { type: 'channel'; channelName: string };

interface TimeInput {
  type: 'relative' | 'absolute' | 'natural' | 'recurring';
  value: string;
  originalInput: string; // 日本語入力の保持
}
```

#### 2.1.2 日時変換マッピング型
```typescript
interface TimeConversionRule {
  pattern: RegExp;
  convert: (match: RegExpMatchArray) => string;
  category: 'relative' | 'absolute' | 'natural' | 'recurring';
}
```

### 2.2 状態管理設計

#### 2.2.1 メインアプリケーション状態
```typescript
interface AppState {
  currentReminder: Partial<ReminderConfig>;
  history: ReminderConfig[];
  validationErrors: ValidationError[];
  isLoading: boolean;
}

interface ValidationError {
  field: keyof ReminderConfig;
  message: string;
  severity: 'error' | 'warning';
}
```

## 3. UI設計

### 3.1 コンポーネント構成

#### 3.1.1 アプリケーション全体構成
```
App
├── Header
├── MainForm
│   ├── WhoSection
│   ├── WhatSection  
│   ├── WhenSection
│   └── ValidationMessages
├── CommandPreview
├── HistoryPanel
└── Footer
```

#### 3.1.2 各セクションの詳細設計

**WhoSection (通知先選択)**
- ラジオボタンでの選択UI
- ユーザー名/チャンネル名の入力フィールド
- チャンネル選択時の警告表示

**WhatSection (メッセージ入力)**
- テキストエリアでの複数行入力
- 文字数カウンター
- メンション入力支援

**WhenSection (日時入力)**
- 日本語での自然言語入力
- リアルタイム変換結果表示
- 繰り返し設定のチェックボックス
- 日時入力支援（カレンダーピッカーとの併用）

### 3.2 レスポンシブデザイン

#### 3.2.1 ブレークポイント
- Mobile: ~768px
- Tablet: 768px~1024px  
- Desktop: 1024px~

#### 3.2.2 レイアウト適応
- Mobile: 縦並び単一カラム
- Tablet: 縦並びで幅調整
- Desktop: 左側フォーム、右側プレビューの2カラム

## 4. ロジック設計

### 4.1 日時変換エンジン

#### 4.1.1 変換ルール設計
```typescript
const conversionRules: TimeConversionRule[] = [
  // 相対時間
  { pattern: /(\d+)分後/, convert: (m) => `in ${m[1]} minutes`, category: 'relative' },
  { pattern: /(\d+)時間後/, convert: (m) => `in ${m[1]} hours`, category: 'relative' },
  
  // 絶対時刻
  { pattern: /(\d{1,2}):(\d{2})/, convert: (m) => `at ${m[1]}:${m[2]}`, category: 'absolute' },
  
  // 自然言語
  { pattern: /明日/, convert: () => 'tomorrow', category: 'natural' },
  { pattern: /月曜日/, convert: () => 'Monday', category: 'natural' },
  
  // 繰り返し
  { pattern: /毎日/, convert: () => 'every day', category: 'recurring' },
  { pattern: /平日/, convert: () => 'every weekday', category: 'recurring' },
];
```

#### 4.1.2 変換処理フロー
1. 入力テキストの正規化
2. 複数ルールの適用と優先度判定
3. 組み合わせ処理（日付+時刻など）
4. バリデーションと警告生成

### 4.2 コマンド生成ロジック

#### 4.2.1 コマンド構築
```typescript
function generateCommand(config: ReminderConfig): string {
  const who = formatWhoParameter(config.who);
  const what = escapeMessage(config.what);
  const when = config.when;
  
  return `/remind ${who} ${what} ${when}`;
}
```

#### 4.2.2 バリデーションルール
```typescript
const validationRules = [
  // 他ユーザーへの繰り返し禁止
  (config) => {
    if (config.who.type === 'user' && config.when.includes('every')) {
      return { severity: 'error', message: '他ユーザーに繰り返しリマインダーは設定できません' };
    }
  },
  
  // チャンネル通知時の警告
  (config) => {
    if (config.who.type === 'channel') {
      return { severity: 'warning', message: 'チャンネル通知時は設定時に公開メッセージが投稿されます' };
    }
  },
];
```

### 4.3 履歴管理

#### 4.3.1 永続化設計
```typescript
class HistoryManager {
  private readonly storageKey = 'slack-reminder-history';
  private readonly maxHistorySize = 50;
  
  save(reminder: ReminderConfig): void;
  load(): ReminderConfig[];
  delete(id: string): void;
  clear(): void;
}
```

## 5. パフォーマンス設計

### 5.1 最適化戦略
- React.memo によるコンポーネントメモ化
- useMemo/useCallback による計算結果キャッシュ
- デバウンス処理による不要な変換処理の削減
- 遅延ロードによる初期表示速度向上

### 5.2 バンドルサイズ最適化
- Tree shaking による不要コード除去
- Code splitting による必要時ロード
- 軽量なライブラリの選択

## 6. アクセシビリティ設計

### 6.1 ARIA属性設計
- form要素への適切なラベリング
- エラーメッセージとフィールドの関連付け
- ライブリージョンでのリアルタイム更新通知

### 6.2 キーボード操作
- Tab順序の最適化
- Enter/Space キーでの操作
- Escape キーでのモーダル閉じる処理

## 7. エラーハンドリング設計

### 7.1 エラー分類
- **入力エラー**: バリデーション違反
- **変換エラー**: 日時変換失敗  
- **システムエラー**: クリップボードアクセス失敗など

### 7.2 エラー表示戦略
- インライン表示: フィールド単位のエラー
- トースト通知: システムレベルのエラー
- 警告バナー: 重要な仕様上の注意点

## 8. セキュリティ設計

### 8.1 入力サニタイゼーション
- XSS対策のためのHTMLエスケープ
- コマンドインジェクション対策

### 8.2 データ保護
- ローカルストレージのみ使用（外部送信なし）
- 機密情報を含む可能性があるメッセージの適切な扱い

## 9. 今後の拡張性設計

### 9.1 プラグインアーキテクチャ
- 変換ルールの動的追加
- カスタムバリデーター

### 9.2 国際化対応
- i18n ライブラリの組み込み準備
- 日付フォーマットの地域対応