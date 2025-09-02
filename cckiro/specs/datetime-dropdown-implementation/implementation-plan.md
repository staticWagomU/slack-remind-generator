# 日時指定部分のドロップダウン併用実装 - 実装計画ファイル

## 実装フェーズ概要

全体を5つのフェーズに分けて段階的に実装します。各フェーズでテストを行い、動作確認をしながら進めます。

## フェーズ1: 準備と基盤構築（1-2時間）

### 1.1 必要なshadcn/uiコンポーネントのインストール
```bash
# 必要なコンポーネントをインストール
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add calendar
pnpm dlx shadcn-ui@latest add tabs
pnpm dlx shadcn-ui@latest add checkbox
pnpm dlx shadcn-ui@latest add popover
```

### 1.2 型定義の追加
`src/types/reminder.ts`に以下を追加：
```typescript
export type TimeInputMode = 'quick' | 'calendar' | 'recurring' | 'custom';

export interface QuickTimeOption {
  label: string;
  value: string;
  category: 'relative' | 'tomorrow';
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekday' | 'weekly' | 'biweekly' | 'monthly';
  selectedDays: string[];
  selectedTime: string;
  isEveryOther: boolean; // 隔週フラグ
  dayOfMonth?: number;
}
```

### 1.3 ユーティリティ関数の追加
`src/utils/timeFormatter.ts`を新規作成：
```typescript
// 時刻フォーマット関数
// カレンダー選択結果の変換関数
// 繰り返しパターンの変換関数
```

## フェーズ2: 基本コンポーネントの実装（2-3時間）

### 2.1 TimeDropdown コンポーネントの作成
`src/components/forms/TimeDropdown.tsx`
- 00:00〜23:30の時刻選択
- 30分刻みのオプション生成
- AM/PM形式への変換対応

### 2.2 TimeModeSelector コンポーネントの作成
`src/components/forms/TimeModeSelector.tsx`
- Tabsコンポーネントを使用
- 4つのモード切り替え
- アイコン付きタブ表示

### 2.3 基本的な動作確認
- コンポーネントの表示確認
- 切り替え動作の確認

## フェーズ3: 各モードの実装（3-4時間）

### 3.1 QuickSelectMode の実装
`src/components/forms/QuickSelectMode.tsx`
```typescript
const quickOptions = [
  { category: 'relative', label: '10分後', value: 'in 10 minutes' },
  { category: 'relative', label: '30分後', value: 'in 30 minutes' },
  { category: 'relative', label: '1時間後', value: 'in 1 hour' },
  { category: 'relative', label: '3時間後', value: 'in 3 hours' },
  { category: 'tomorrow', label: '明日の朝9時', value: 'at 9am tomorrow' },
  { category: 'tomorrow', label: '明日の昼12時', value: 'at 12pm tomorrow' },
  { category: 'tomorrow', label: '明日の夕方6時', value: 'at 6pm tomorrow' },
];
```

### 3.2 CalendarMode の実装
`src/components/forms/CalendarMode.tsx`
- Calendarコンポーネントで日付選択
- TimeDropdownで時刻選択
- 選択結果の組み合わせ処理

### 3.3 RecurringMode の実装
`src/components/forms/RecurringMode.tsx`
- 頻度選択（Select）
  - 毎日、平日、毎週、隔週、毎月
- 曜日選択（Checkbox）
- 隔週チェックボックス
- 時刻選択（TimeDropdown）
- 日付選択（月次の場合）

### 3.4 CustomMode の実装
`src/components/forms/CustomMode.tsx`
- 既存のテキスト入力機能を移植
- 現在のconvertJapaneseToEnglishTimeをそのまま使用

## フェーズ4: WhenSectionの統合（2-3時間）

### 4.1 WhenSection の改修
```typescript
// src/components/forms/WhenSection.tsx

export function WhenSection({ value, onChange, error }: WhenSectionProps) {
  const [mode, setMode] = useState<TimeInputMode>('quick');
  const [convertedTime, setConvertedTime] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleModeChange = (newMode: TimeInputMode) => {
    setMode(newMode);
    // モード切り替え時の処理
  };

  const handleTimeChange = (newValue: string) => {
    setConvertedTime(newValue);
    onChange?.(newValue);
    // バリデーション処理
  };

  return (
    <div className="space-y-4">
      <TimeModeSelector mode={mode} onChange={handleModeChange} />
      
      {mode === 'quick' && (
        <QuickSelectMode onChange={handleTimeChange} />
      )}
      
      {mode === 'calendar' && (
        <CalendarMode onChange={handleTimeChange} />
      )}
      
      {mode === 'recurring' && (
        <RecurringMode onChange={handleTimeChange} />
      )}
      
      {mode === 'custom' && (
        <CustomMode onChange={handleTimeChange} />
      )}
      
      {/* 変換結果の表示 */}
      {/* warningsの表示 */}
    </div>
  );
}
```

### 4.2 スタイリングの調整
- 各モードのレイアウト調整
- レスポンシブ対応
- アニメーション追加

## フェーズ5: テストとバグ修正（1-2時間）

### 5.1 機能テスト
- [ ] クイック選択モードの動作確認
- [ ] カレンダーモードの日付・時刻選択
- [ ] 繰り返しモードの各パターン確認
  - [ ] 毎日・平日パターン
  - [ ] 毎週特定曜日パターン
  - [ ] 隔週パターン（every other [曜日]）
  - [ ] 毎月特定日パターン
- [ ] カスタムモードの既存機能維持確認

### 5.2 統合テスト
- [ ] モード切り替え時の値の保持
- [ ] MainFormとの連携確認
- [ ] CommandPreviewでの表示確認

### 5.3 エッジケーステスト
- [ ] 過去の日付選択の防止
- [ ] 他ユーザー + 繰り返しのエラー表示
- [ ] 無効な入力のハンドリング

### 5.4 パフォーマンステスト
- [ ] 再レンダリング最適化
- [ ] バンドルサイズの確認

## 実装順序の詳細タスクリスト

1. **shadcn/uiコンポーネントのインストール**
2. **型定義の追加**
3. **TimeDropdownコンポーネントの作成**
4. **TimeModeSelectorコンポーネントの作成**
5. **QuickSelectModeの実装**
6. **CalendarModeの実装**
7. **RecurringModeの実装**
8. **CustomModeの実装**
9. **WhenSectionの統合**
10. **スタイリングとアニメーション**
11. **バリデーションロジックの実装**
12. **エラー/警告メッセージの実装**
13. **テストの実施**
14. **バグ修正と最適化**
15. **ドキュメント更新**

## 想定される課題と対策

### 課題1: 状態管理の複雑化
**対策**: 各モードで独立した状態管理を行い、WhenSectionで統合

### 課題2: パフォーマンスの低下
**対策**: React.memo、useMemo、useCallbackを適切に使用

### 課題3: 既存機能との互換性
**対策**: カスタムモードで完全な後方互換性を維持

### 課題4: UIの一貫性
**対策**: 既存のデザインシステムに準拠、shadcn/uiのテーマをカスタマイズ

## 完了条件

- [ ] 全ての入力モードが正常に動作する
- [ ] 変換結果が正しい英語形式になる
- [ ] 既存の機能が全て維持されている
- [ ] エラーハンドリングが適切に実装されている
- [ ] パフォーマンスが許容範囲内である
- [ ] コードレビューで承認を得る