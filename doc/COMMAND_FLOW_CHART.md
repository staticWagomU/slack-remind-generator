# Slackリマインダーコマンド フローチャート

このドキュメントは、[COMMAND_SPEC.md](./doc/COMMAND_SPEC.md)に基づいて、Slackリマインダーコマンド生成アプリの処理フローをMermaidフローチャート形式で整理したものです。

## メインフローチャート

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    A["開始"] --> B["通知先を選択"]
    B --> C{"通知先の種類"}
    C -- 自分 --> D["me"]
    C -- 他ユーザー --> E["username"]
    C -- チャンネル --> F["channel"]
    D --> G["リマインダー内容を入力"]
    E --> G
    F --> F1["⚠️チャンネルに即座に\n設定確認メッセージが\n公開投稿される"]
    F1 --> G
    G --> H{"リマインダーの種類"}
    H -- 単発 --> I["単発リマインダー"]
    H -- 繰り返し --> J["繰り返しリマインダー"]
    I --> K{"日時指定の方法"}
    K -- 相対指定 --> L{"時間の単位"}
    L -- 分後 --> M["in X minutes"]
    L -- 時間後 --> N["in X hours"]
    K -- 絶対指定 --> O{"日時の組み合わせ"}
    O -- 時刻のみ --> P["at HH:MM / at H:MM am/pm"]
    O -- 日付のみ --> Q["on MM/DD/YYYY\n※デフォルト9:00am"]
    O -- 日付+時刻 --> R["at HH:MM am/pm on MM/DD/YYYY"]
    K -- 自然言語 --> S["tomorrow / Monday / on Tuesday"]
    J --> T{"繰り返し対象の確認"}
    T -- username --> U["❌エラー\n他ユーザーには\n繰り返し不可"]
    T -- me または channel --> V{"繰り返しパターン"}
    V -- 毎日 --> W["at HH:MM every day"]
    V -- 平日のみ --> X["at HH:MM every weekday"]
    V -- 特定曜日 --> Y["at HH:MM every 曜日名"]
    V -- 複数曜日 --> Z["at HH:MM every 曜日1 and 曜日2"]
    V -- 隔週 --> AA["at HH:MM every other 曜日名"]
    V -- 毎月特定日 --> BB["on the DDth of every month"]
    V -- 毎月特定週曜日 --> CC["every first/last 曜日名"]
    M --> DD["コマンド生成"]
    N --> DD
    P --> DD
    Q --> DD
    R --> DD
    S --> DD
    W --> DD
    X --> DD
    Y --> DD
    Z --> DD
    AA --> DD
    BB --> DD
    CC --> DD
    U --> EE["エラー表示"]
    DD --> FF["/remind who what when"]
    FF --> GG["完了"]
    EE --> GG
    style F1 fill:#ffcccc
    style U fill:#ffcccc
```

## メッセージ内容の詳細フローチャート

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    MA["リマインダー内容を入力"] --> MB{"入力内容の要素"}
    MB -- テキスト --> MC["日本語・多言語対応"]
    MB -- 改行 --> MD["複数行テキスト対応"]
    MB -- メンション --> ME{"メンションの種類"}
    ME -- 個人 --> MF["@username"]
    ME -- 全員 --> MG["@here / @channel"]
    MC --> MH["what パラメータ生成"]
    MD --> MH
    MF --> MH
    MG --> MH
    MH --> MI["改行を含むテキストは<br/>ダブルクォートで囲む"]
    MI --> MJ["コマンドに組み込み"]
    style MG fill:#ffffcc
```

## 時刻指定の詳細ロジック

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    TA["日時を指定"] --> TB{"指定方法"}
    TB -- 時刻のみ --> TC{"現在時刻との比較"}
    TC -- 過去の時刻 --> TD["⚡ 自動的に翌日に設定"]
    TC -- 未来の時刻 --> TE["当日に設定"]
    TB -- 日付のみ --> TF["デフォルト: 9:00am<br/>※ユーザー設定で変更可能"]
    TB -- 相対指定 --> TG["現在時刻からの計算"]
    TD --> TH["リマインダー設定"]
    TE --> TH
    TF --> TH
    TG --> TH
    style TD fill:#e6f3ff
    style TF fill:#ffffcc
```

## 制約事項と管理フロー

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    CA["リマインダー管理"] --> CB{"操作"}
    CB -- 編集したい --> CC["❌ 編集機能なし"]
    CC --> CD["既存を削除"]
    CD --> CE["新規作成"]
    CB -- 一覧表示 --> CF["/remind list"]
    CF --> CG{"リマインダー数"}
    CG -- 多数 --> CH["⚠️ 管理が煩雑"]
    CH --> CI["アプリ側で<br/>履歴管理機能を検討"]
    CB -- 削除 --> CJ["/remind delete"]
    CJ --> CK["⚠️ 過去のメッセージは<br/>削除されない"]
    style CC fill:#ffcccc
    style CH fill:#ffffcc
    style CK fill:#ffffcc
```

## エラーハンドリングフロー

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    EA["コマンド生成"] --> EB{"バリデーション"}
    EB -- OK --> EC["/remind コマンド完成"]
    EB -- NG --> ED{"エラーの種類"}
    ED -- 繰り返し制限 --> EE["❌ @username への<br/>繰り返し設定不可"]
    ED -- 時間単位繰り返し --> EF["❌ 時間単位の<br/>繰り返し不可"]
    ED -- 日本語when --> EG["❌ when は<br/>英語形式必須"]
    ED -- 無効な形式 --> EH["❌ パラメータ形式エラー"]
    EE --> EI["エラーメッセージ表示<br/>修正を促す"]
    EF --> EI
    EG --> EI
    EH --> EI
    style EE fill:#ffcccc
    style EF fill:#ffcccc
    style EG fill:#ffcccc
    style EH fill:#ffcccc
```

