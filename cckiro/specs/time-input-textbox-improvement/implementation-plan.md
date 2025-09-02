# 時刻入力テキストボックス改善 - 実装計画

## 実装手順

### フェーズ1: ユーティリティ関数の作成
1. **バリデーション関数** (`src/utils/timeValidation.ts`)
   - `validateTimeInput()`: 4桁数値の時刻バリデーション
   - 時間・分の範囲チェック
   - エラーメッセージの生成

2. **フォーマット関数** (`src/utils/timeValidation.ts`)
   - `formatHHMMToDisplay()`: "hhmm" → "hh:mm" 変換
   - `formatDisplayToHHMM()`: "hh:mm" → "hhmm" 変換
   - 桁数補完機能

### フェーズ2: TimeInput コンポーネントの作成
3. **基本コンポーネント** (`src/components/forms/TimeInput.tsx`)
   - React Hook による状態管理
   - フォーカス状態の切り替え
   - 基本的な入力・表示機能

4. **バリデーション統合**
   - リアルタイムバリデーション
   - エラーメッセージ表示
   - debounce処理

### フェーズ3: UI/UX の実装
5. **視覚的フィードバック**
   - フォーカス状態のスタイル
   - エラー状態のスタイル
   - プレースホルダーの動的切り替え

6. **アクセシビリティ対応**
   - ARIA属性の設定
   - キーボードナビゲーション
   - スクリーンリーダー対応

### フェーズ4: 既存コードとの統合
7. **TimeDropdown の更新** (`src/components/forms/TimeDropdown.tsx`)
   - TimeInput コンポーネントを使用するよう変更
   - 既存インターフェースの維持

8. **動作確認**
   - 各利用箇所での動作テスト
   - エッジケースの確認

## 詳細実装内容

### 1. バリデーション関数 (`src/utils/timeValidation.ts`)

```typescript
export interface TimeValidationResult {
  isValid: boolean;
  errorMessage: string;
  formattedTime?: string;
}

export function validateTimeInput(input: string): TimeValidationResult
export function formatHHMMToDisplay(hhmm: string): string
export function formatDisplayToHHMM(display: string): string
```

### 2. TimeInput コンポーネント (`src/components/forms/TimeInput.tsx`)

```typescript
interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

// 内部状態
const [internalValue, setInternalValue] = useState<string>('');
const [isFocused, setIsFocused] = useState<boolean>(false);
const [isValid, setIsValid] = useState<boolean>(true);
const [errorMessage, setErrorMessage] = useState<string>('');
```

### 3. イベントハンドラー

```typescript
const handleFocus = () => {
  // hh:mm → hhmm 変換
  // フォーカス状態更新
};

const handleBlur = () => {
  // hhmm → hh:mm 変換
  // バリデーション実行
  // onChange コールバック実行
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // 数値のみ入力制限
  // リアルタイムバリデーション (debounced)
};
```

## 実装順序とマイルストーン

### マイルストーン1: ユーティリティ関数 (30分)
- [ ] `timeValidation.ts` ファイル作成
- [ ] バリデーション関数実装
- [ ] フォーマット関数実装
- [ ] 単体テスト（手動確認）

### マイルストーン2: 基本コンポーネント (60分)
- [ ] `TimeInput.tsx` ファイル作成
- [ ] 基本的なReact Hook実装
- [ ] フォーカス切り替え機能
- [ ] 入力・表示の基本動作

### マイルストーン3: 高度な機能 (45分)
- [ ] バリデーション統合
- [ ] エラーメッセージ表示
- [ ] 視覚的フィードバック
- [ ] アクセシビリティ対応

### マイルストーン4: 統合・テスト (30分)
- [ ] TimeDropdown の更新
- [ ] 既存利用箇所での動作確認
- [ ] エッジケースのテスト
- [ ] 最終的な動作確認

## リスクと対策

### リスク1: 既存機能への影響
- **対策**: 段階的な移行、既存インターフェースの完全維持

### リスク2: アクセシビリティの不備
- **対策**: 各実装段階でのキーボードナビゲーション確認

### リスク3: パフォーマンス問題
- **対策**: debounce処理、React.memo適用

## 完了条件
1. 4桁数値入力での時刻設定が可能
2. フォーカス状態での表示切り替えが正常動作
3. 無効入力時のエラーメッセージ表示
4. 既存利用箇所での正常動作
5. キーボードのみでの操作が可能
6. 型チェックエラーがない