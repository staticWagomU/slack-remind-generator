# 時刻入力テキストボックス改善 - 設計書

## アーキテクチャ概要

### コンポーネント構成
現在の `TimeDropdown` コンポーネントを `TimeInput` コンポーネントに改修し、後方互換性を維持する。

## 詳細設計

### 1. TimeInput コンポーネント

#### インターフェース
```typescript
interface TimeInputProps {
  value: string;           // "hh:mm" 形式 (例: "14:30")
  onChange: (value: string) => void;  // "hh:mm" 形式を返す
  label?: string;
  placeholder?: string;
}
```

#### 内部状態管理
```typescript
interface TimeInputState {
  internalValue: string;   // フォーカス中は "hhmm", 非フォーカス時は "hh:mm"
  isFocused: boolean;      // フォーカス状態
  isValid: boolean;        // バリデーション結果
  errorMessage: string;    // エラーメッセージ
}
```

### 2. 主要機能の実装方針

#### 2.1 入力形式の切り替え
- **onFocus**: `hh:mm` → `hhmm` 変換（コロンを除去）
- **onBlur**: `hhmm` → `hh:mm` 変換（バリデーション後）

#### 2.2 バリデーション機能
```typescript
function validateTimeInput(input: string): {
  isValid: boolean;
  errorMessage: string;
  formattedTime?: string;
} {
  // 4桁数値チェック
  // 時間範囲チェック (00-23)
  // 分範囲チェック (00-59)
  // フォーマット変換
}
```

#### 2.3 自動フォーマット
```typescript
function formatTimeInput(hhmm: string): string {
  // "1430" → "14:30"
  // "930" → "09:30" (3桁の場合は先頭に0を補完)
  // "30" → "00:30" (2桁の場合は時間部分を00で補完)
}
```

### 3. UI/UX 設計

#### 3.1 視覚的フィードバック
- **通常状態**: 標準的なテキストインput スタイル
- **フォーカス状態**: ボーダーの色変更、プレースホルダー表示
- **エラー状態**: 赤いボーダー、エラーメッセージ表示
- **成功状態**: 緑のボーダー（一瞬表示）

#### 3.2 プレースホルダー
- **フォーカス外**: "時刻を入力 (例: 14:30)"
- **フォーカス中**: "4桁で入力 (例: 1430)"

### 4. アクセシビリティ対応

#### 4.1 ARIA 属性
```typescript
<input
  aria-label="時刻入力"
  aria-describedby="time-input-help time-input-error"
  aria-invalid={!isValid}
  role="textbox"
/>
```

#### 4.2 キーボードナビゲーション
- Tab: 次の要素へ移動
- Shift+Tab: 前の要素へ移動
- Enter: 入力確定（onBlur トリガー）

### 5. パフォーマンス最適化

#### 5.1 debounce処理
リアルタイムバリデーションに debounce (300ms) を適用し、過度な再計算を防止

#### 5.2 React.memo 適用
不要な再レンダリングを防ぐためにコンポーネントをメモ化

### 6. エラーハンドリング

#### 6.1 エラーメッセージ一覧
- 空入力: "時刻を入力してください"
- 桁数不正: "4桁で入力してください (例: 1430)"
- 時間範囲外: "時間は00-23の範囲で入力してください"
- 分範囲外: "分は00-59の範囲で入力してください"
- 数値以外: "数値のみ入力してください"

### 7. 既存コードとの統合

#### 7.1 段階的移行
1. `TimeInput` コンポーネントを新規作成
2. `TimeDropdown` から `TimeInput` を参照するよう変更
3. 既存の利用箇所での動作確認

#### 7.2 後方互換性
- プロパティインターフェースは完全に維持
- 出力形式（"hh:mm"）は変更なし
- エラーハンドリングを追加するが、既存動作に影響なし

### 8. テスト戦略

#### 8.1 単体テスト対象
- バリデーション関数
- フォーマット変換関数
- フォーカス状態の切り替え
- エラー状態の表示

#### 8.2 統合テスト対象
- 既存コンポーネントとの結合
- フォーム送信時の動作
- キーボードナビゲーション