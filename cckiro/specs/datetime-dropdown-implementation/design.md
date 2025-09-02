# 日時指定部分のドロップダウン併用実装 - 設計ファイル

## 1. アーキテクチャ概要

### 1.1 全体構成
```
WhenSection (拡張版)
├── TimeModeSelector (新規)
├── QuickSelectMode (新規)
│   └── RelativeTimeSelector
├── CalendarMode (新規)
│   ├── DatePicker
│   └── TimeDropdown
├── RecurringMode (新規)
│   ├── RecurringPatternSelector
│   └── TimeDropdown
└── CustomMode (既存のテキスト入力)
    └── 既存のconvertJapaneseToEnglishTime
```

### 1.2 データフロー
1. ユーザーがモードを選択
2. 選択したモードのコンポーネントで入力
3. 入力値を英語形式に変換
4. WhenSectionからMainFormへ値を伝達
5. CommandPreviewで最終的なコマンドを表示

## 2. コンポーネント設計

### 2.1 WhenSection（改修）
```typescript
interface WhenSectionProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

interface WhenSectionState {
  mode: 'quick' | 'calendar' | 'recurring' | 'custom';
  convertedTime: string;
  warnings: string[];
}
```

**責務:**
- モード切り替えの管理
- 各モードからの入力を受け取り、英語形式に変換
- 変換結果とwarningsの表示

### 2.2 TimeModeSelector（新規）
```typescript
interface TimeModeSelectorProps {
  mode: 'quick' | 'calendar' | 'recurring' | 'custom';
  onChange: (mode: 'quick' | 'calendar' | 'recurring' | 'custom') => void;
}
```

**責務:**
- タブUIでモードを切り替え
- 選択中のモードを視覚的に表示

### 2.3 QuickSelectMode（新規）
```typescript
interface QuickSelectModeProps {
  onChange: (value: string) => void;
}

interface QuickOption {
  label: string;
  value: string;
  category: 'relative' | 'tomorrow';
}
```

**責務:**
- よく使う時間パターンをドロップダウンで提供
- 選択した値を英語形式で親コンポーネントに伝達

### 2.4 CalendarMode（新規）
```typescript
interface CalendarModeProps {
  onChange: (value: string) => void;
}

interface CalendarModeState {
  selectedDate: Date | null;
  selectedTime: string;
}
```

**責務:**
- カレンダーで日付選択
- ドロップダウンで時刻選択
- 日付と時刻を組み合わせて英語形式に変換

### 2.5 RecurringMode（新規）
```typescript
interface RecurringModeProps {
  onChange: (value: string) => void;
}

interface RecurringModeState {
  frequency: 'daily' | 'weekday' | 'weekly' | 'biweekly' | 'monthly';
  selectedDays: string[];
  selectedTime: string;
  isEveryOther: boolean; // 隔週フラグ
  dayOfMonth?: number;
}
```

**責務:**
- 繰り返しパターンの選択（隔週を含む）
- 時刻の指定
- 選択内容を英語形式に変換

### 2.6 TimeDropdown（新規）
```typescript
interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}
```

**責務:**
- 00:00〜23:30の時刻を30分刻みで提供
- 選択した時刻を返す

## 3. 状態管理

### 3.1 ローカルステート
各コンポーネントは独自のローカルステートを持つ：
- WhenSection: 選択中のモード、変換結果
- CalendarMode: 選択された日付と時刻
- RecurringMode: 頻度、曜日、時刻

### 3.2 Props による値の伝達
- 各モードコンポーネント → WhenSection → MainForm
- 単方向データフロー

## 4. 変換ロジック

### 4.1 QuickSelectMode
```typescript
const quickOptions = [
  { label: '10分後', value: 'in 10 minutes' },
  { label: '30分後', value: 'in 30 minutes' },
  { label: '1時間後', value: 'in 1 hour' },
  { label: '明日の朝9時', value: 'at 9am tomorrow' },
  // ...
];
```

### 4.2 CalendarMode
```typescript
function formatCalendarSelection(date: Date, time: string): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `at ${time} on ${month}/${day}/${year}`;
}
```

### 4.3 RecurringMode
```typescript
function formatRecurringPattern(
  frequency: string,
  days: string[],
  time: string,
  isEveryOther: boolean,
  dayOfMonth?: number
): string {
  switch (frequency) {
    case 'daily':
      return `at ${time} every day`;
    case 'weekday':
      return `at ${time} every weekday`;
    case 'weekly':
      if (isEveryOther) {
        return `at ${time} every other ${days.join(' and ')}`;
      }
      return `at ${time} every ${days.join(' and ')}`;
    case 'biweekly':
      return `at ${time} every other ${days.join(' and ')}`;
    case 'monthly':
      if (dayOfMonth) {
        return `on the ${dayOfMonth}th of every month`;
      }
      return `every month`;
    // ...
  }
}
```

## 5. UIコンポーネント仕様

### 5.1 shadcn/ui コンポーネントの使用
- **Tabs**: モード切り替え
- **Select**: ドロップダウン選択
- **Calendar**: 日付選択
- **Checkbox**: 複数曜日選択
- **Button**: アクション

### 5.2 スタイリング
- Tailwind CSSを使用
- 既存のデザインシステムに準拠
- レスポンシブ対応

## 6. エラーハンドリング

### 6.1 バリデーション
- 過去の日付選択を防ぐ
- 無効な組み合わせを検出（他ユーザー + 繰り返し）
- 時間単位の繰り返しを防ぐ

### 6.2 エラー表示
- 各モードで適切なエラーメッセージ表示
- warningsとerrorsを区別

## 7. テスト戦略

### 7.1 単体テスト
- 各変換関数のテスト
- コンポーネントの振る舞いテスト

### 7.2 統合テスト
- モード切り替えの動作確認
- 値の伝達確認
- エラーケースの確認

## 8. パフォーマンス考慮事項

### 8.1 コンポーネントの遅延読み込み
- 各モードコンポーネントを必要時にのみロード
- React.lazyとSuspenseの使用を検討

### 8.2 最適化
- メモ化の活用（useMemo、useCallback）
- 不要な再レンダリングの防止

## 9. 移行戦略

### 9.1 段階的な実装
1. 新規コンポーネントの追加
2. WhenSectionの拡張
3. 既存機能の維持確認
4. テストの実施

### 9.2 後方互換性
- カスタムモードで既存の機能を完全に維持
- 既存のAPIとの互換性を保証