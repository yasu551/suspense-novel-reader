# Suspense Novel Reader - Project Overview

## プロジェクト概要

英語原文の小説（特にパブリックドメインの古典）を日本語で"やさしく"読めるようにし、読書中の疑問をAIに即座に質問できるWebアプリケーション。

### 対象作品
- 初期作品: 
  - Mary Wollstonecraft Shelley『Frankenstein; Or, The Modern Prometheus』
  - Bram Stoker 『Dracula』
- 将来的に他の英語古典にも拡張可能

---

## 技術スタック

### フレームワーク & ランタイム
- **Next.js 15** (App Router、React Server Components)
- **TypeScript**
- **デプロイ**: Vercel (Edge Runtime対応)

### AI/LLM
- **Vercel AI SDK** (`ai`)
  - `streamText` / `generateText` によるストリーミング回答
  - `@ai-sdk/openai` 等のモデルプロバイダ（環境変数で切替可能）
  - Function Tool Calling（用語検索・段落取得などのサーバ関数連携）

### UI/スタイリング
- **React**
- **状態管理**: Zustand または Recoil
- **UI**: Tailwind CSS + Radix/Shadcn UI

### スクレイピング/パース
- **Cheerio**: HTML パース（軽量、サーバーサイド専用）
- **JSDOM**: DOM操作が必要な場合（重い処理）
- カスタムパーサー: 章・段落分割ロジック

### サーバサイド
- Next.js Route Handlers (`app/api/*`)
- Edge/Node Runtime（軽量処理はEdge優先）

### データストレージ
- 作品テキスト・訳文: DB/オブジェクトストレージ
- 進捗データ: DB

### 監視/運用
- レート制御 (IP + ユーザーID)
- エラートレース (Sentry等)
- 監査ログ

---

## ディレクトリ構造

```
app/
  layout.tsx
  works/page.tsx                 # 作品一覧画面
  works/[id]/page.tsx            # 作品詳細
  read/[id]/[chapter]/page.tsx   # 読書ビュー
  admin/page.tsx                 # 管理画面（作品登録・削除）
  api/
    chat/route.ts                # AIチャット (streamText)
    translate/route.ts           # 段落翻訳 (generateText)
    glossary/route.ts            # 用語抽出/置換
    works/route.ts               # 作品一覧API・登録API
    works/[id]/route.ts          # 作品削除API
    works/[id]/translate/route.ts        # 翻訳ジョブ開始API
    works/[id]/translate/status/route.ts # 翻訳進捗API
    works/[id]/translate/retry/route.ts  # 翻訳再試行API
lib/
  ai/model.ts                    # モデル選択・共通設定
  parsing/align.ts               # 原文↔訳文アラインメント
  glossary/extract.ts            # 用語抽出
  scraper/
    gutenberg.ts                 # Project Gutenberg スクレイパー
    parser.ts                    # HTML/テキストパーサー
  translation/
    batch.ts                     # バッチ翻訳処理
    queue.ts                     # 翻訳ジョブキュー管理
    worker.ts                    # 翻訳ワーカー
components/
  ReaderPane.tsx                 # 読書ペイン
  ChatPane.tsx                   # AIチャットペイン
  ModeToggle.tsx                 # 表示モード切替
  WorkCard.tsx                   # 作品カード
  admin/
    WorkImportForm.tsx           # 作品登録フォーム
    WorkList.tsx                 # 作品管理リスト
    TranslationProgress.tsx      # 翻訳進捗表示
```

---

## 主要機能

### 1. 作品一覧画面（カタログ）
- **検索**: タイトル、著者、あらすじ、タグ、用語
- **フィルター**:
  - ステータス（PD、翻訳済み、注釈あり）
  - ジャンル（ゴシック、SF、冒険、恋愛）
  - 難易度（やさしい/ふつう/むずかしい）
  - 長さ（短編/中編/長編）
- **並び替え**: おすすめ/人気/新着/読了率/タイトル順
- **進捗表示**: 読みかけ作品の「続きから読む」ボタン

### 2. 読書ビュー
- **言語モード**:
  - 原文（英語）
  - 日本語（通常訳）
  - 並列表示（英語｜日本語）
- **専門用語モード**:
  - **あり**: 原義に忠実な訳語 + ツールチップで定義表示
  - **なし**: 平易な日本語に置換 + 脚注リンク
- **補助表示**: ふりがな、重要語ハイライト、段落番号
- **ナビゲーション**: 章選択、全文検索、しおり機能

### 3. AIチャット（右ペイン）
- 現在の章・段落コンテキストを自動付与
- テキスト選択 → 「AIに聞く」
- 段落の要約、登場人物・用語の解説、時代背景の説明
- 回答に参照段落IDを併記

### 4. 翻訳パイプライン
- 前処理: 章→段落分割・ID付与、用語抽出
- 推論: Vercel AI SDK経由で通常訳/やさしい訳を生成（キャッシュ）
- 後処理: 用語置換・脚注生成、対訳アラインメント

### 5. 作品管理機能（管理画面）
- **作品登録（URLベース）**:
  - Project Gutenberg等のURLを入力
  - 自動スクレイピング・パース
  - メタデータ抽出（タイトル、著者、初版年、言語）
  - 章・段落の自動分割とID付与
  - ジャンル・難易度の手動設定または自動推定
  - 登録前のプレビュー機能
  - **登録後に自動翻訳ジョブを開始**
- **作品削除**:
  - 作品リストから選択して削除
  - 関連する章・段落・進捗データも連鎖削除
  - 削除確認ダイアログ
- **対応サイト**:
  - Project Gutenberg (HTML形式)
  - 将来的に他のパブリックドメインサイトに対応

### 6. 自動翻訳機能
- **バックグラウンド翻訳**:
  - 作品登録後、自動的に翻訳ジョブがキューに追加される
  - 通常訳とやさしい訳の両方を生成（設定可能）
  - バッチ処理（10-50段落ずつ、レート制限考慮）
- **進捗管理**:
  - リアルタイムの翻訳進捗表示（WebSocket or Polling）
  - 管理画面で翻訳状況の確認
  - 失敗した段落の再試行機能
- **エラーハンドリング**:
  - API制限エラー時は自動リトライ（指数バックオフ）
  - 段落単位での部分失敗に対応
  - エラーログの保存と通知
- **キャッシング**:
  - 翻訳結果をDBに永続化
  - 同一段落の再翻訳を避ける

---

## データモデル

### Work (作品)
- タイトル、著者、初版年
- PDフラグ、言語、ジャンル/タグ
- 語数、難易度、カバーURL
- 出典（例: Project Gutenberg）、ライセンス
- 人気度スコア
- 翻訳ステータス (`translation_status`): `pending` | `in_progress` | `completed` | `failed`
- 翻訳進捗 (`translation_progress`): 翻訳済み段落数/全段落数

### Chapter (章)
- 章番号、タイトル、順序

### Paragraph (段落)
- 段落ID（例: `book/chap-01/para-003`）
- 原文、訳文（通常/やさしい）
- 用語タグ

### GlossaryTerm (用語辞書)
- 原語、訳語、難易度
- 定義、同義語、置換候補

### UserProfile
- 設定（フォント、テーマ、既定モード）

### ReadingProgress
- ユーザー、段落ID、更新時刻

### ChatLog
- 質問、回答、参照段落IDs、モード情報

### TranslationJob (翻訳ジョブ)
- 作品ID、開始日時、完了日時
- ステータス: `pending` | `in_progress` | `completed` | `failed`
- 翻訳タイプ: `normal` | `easy` | `both`
- 進捗: 処理済み段落数/全段落数
- エラーログ（失敗時）

---

## API エンドポイント

### 作品一覧関連
- `GET /api/works` - 検索・絞込・並び替え・ページング
- `GET /api/works/:id` - 作品詳細（章メタ）
- `POST /api/works` - 作品登録（URLベース）
  - リクエスト: `{ url: string, genre?: string[], difficulty?: string }`
  - レスポンス: `{ id: string, title: string, author: string, status: 'processing' | 'completed' }`
- `DELETE /api/works/:id` - 作品削除（関連データの連鎖削除）
- `GET /api/reading/progress` - ユーザー進捗のバルク取得

### 読書関連
- `POST /api/chat` - AIチャット（SSEストリーム）
  - リクエスト: `{ paragraphIds, question, mode }`
  - Vercel AI SDK の `streamText` を使用
- `POST /api/translate` - 段落翻訳（個別翻訳用）
  - リクエスト: `{ paragraphId, level: 'normal' | 'easy' }`
- `POST /api/glossary` - 用語抽出と平易語置換候補
  - リクエスト: `{ text }`

### 翻訳ジョブ関連
- `POST /api/works/:id/translate` - 作品全体の翻訳ジョブを開始
  - リクエスト: `{ type: 'normal' | 'easy' | 'both', batchSize?: number }`
  - レスポンス: `{ jobId: string, status: 'started', estimatedTime: number }`
- `GET /api/works/:id/translate/status` - 翻訳ジョブの進捗状況
  - レスポンス: `{ status, progress: { completed, total }, errors: [] }`
- `POST /api/works/:id/translate/retry` - 失敗した段落の再翻訳

---

## 環境変数

```env
# AI Provider
OPENAI_API_KEY=
AI_MODEL_CHAT=gpt-4o-mini
AI_MODEL_TRANSLATE=gpt-4o

# Translation Settings
TRANSLATION_BATCH_SIZE=20           # 一度に翻訳する段落数
TRANSLATION_DELAY_MS=1000           # バッチ間の待機時間（レート制限対策）
TRANSLATION_MAX_RETRIES=3           # 失敗時の最大リトライ回数
TRANSLATION_AUTO_START=true         # 作品登録後に自動翻訳を開始

# Application
APP_BASE_URL=

# Rate Limiting
RATELIMIT_REDIS_URL=

# Database
DATABASE_URL=

# Job Queue (オプション: Redis等を使用する場合)
QUEUE_REDIS_URL=
```

---

## 非機能要件

### パフォーマンス
- 初回章ロード < 1.5秒
- チャット応答 < 5秒

### アクセシビリティ
- WCAG 2.1 AA準拠目標
- キーボード操作対応
- スクリーンリーダー対応

### セキュリティ
- API認証（OAuth or Token）
- レート制御
- コンテンツモデレーション

### 対応ブラウザ
- 最新版 Chrome/Safari/Firefox/Edge
- モバイル対応（レスポンシブ）

---

## MVPスコープ

0. **小説一覧画面** - 検索・絞り込み・並び替え・「続きから読む」導線
1. **管理画面** - URLベースでの作品登録・削除機能
2. **自動翻訳機能** - 作品登録後の自動翻訳とDB保存
3. Frankenstein全文の章・段落表示
4. 言語モード: 原文/日本語（通常訳）/並列
5. 専門用語モード: あり/なし（辞書で置換とツールチップ）
6. 右側AIチャット: 選択テキスト送信、段落参照付き回答
7. しおり（最後に読んだ段落）
8. 検索（章内）

---

## 受け入れ基準

- モード切替は200ms以内に反映（既訳キャッシュ時）
- 並列表示で同じ段落が常に可視範囲に同期
- 専門用語なしモードで難語の60%以上が平易語に自動置換
- チャット回答は常に少なくとも1つの段落IDを引用
- 初回訪問後、ページ再訪で最後の段落から再開可能
- 検索キーワードに対し1秒以内に結果が返る
- 進捗がある作品カードに「続きから読む」ボタンが表示され、クリックで該当段落に遷移
- URLから作品を登録すると、30秒以内にメタデータと章・段落が抽出される
- 作品削除時に関連する全てのデータ（章、段落、翻訳ジョブ、進捗）が連鎖削除される
- 作品登録完了後、自動的に翻訳ジョブが開始される
- 翻訳進捗が管理画面でリアルタイムに確認できる（5秒以内に更新）
- 翻訳失敗した段落は個別に再試行が可能
- バッチサイズ20段落の翻訳処理が1分以内に完了する（API制限考慮）

---

## 将来拡張（Nice to have）

- 読解クイズ生成、要約カード
- 音声読み上げ（日本語/英語）
- 共同読書（コメント共有）
- 単語帳のエクスポート（CSV/Anki）
- 作品横断の推薦（テーマ・難易度ベース）

---

## 開発メモ

### Edge Runtime の使用
```ts
export const runtime = 'edge';
```
を Route Handler に付与して高速応答を実現。大きな前処理やDB書き込みはNodeランタイムのAPIへ委譲。

### レート制御
- 1ユーザー/分あたりの `/api/chat` 回数を制限（429応答）
- Bot/クローラ排除のミドルウェア

### ロギング/監査
- 入出力トークン数、推定コスト
- 参照段落ID、レスポンス時間を記録

---

## 作品登録の実装詳細

### Project Gutenberg URLパース処理

1. **URL検証**:
   - Project Gutenberg の HTML形式URLかを確認
   - 例: `https://www.gutenberg.org/cache/epub/{id}/pg{id}-images.html`

2. **HTMLフェッチ・パース**:
   - Cheerioで HTML を読み込み
   - メタデータ抽出:
     - タイトル: `<h1>` または `<title>` タグ
     - 著者: `<h2>` または `rel="dcterms:creator"` 属性
     - 言語: `<html lang="...">` または メタタグ
     - 出典ID: URLから抽出

3. **章・段落の分割**:
   - 章の検出: `<h2>`, `<h3>` タグでCHAPTERを含むもの
   - 段落の検出: `<p>` タグ
   - ID付与: `work-{workId}/chapter-{index}/paragraph-{index}`
   - 空の段落・ナビゲーション要素を除外

4. **データベース保存**:
   - Work レコード作成（`translation_status: 'pending'`）
   - Chapter レコード一括作成
   - Paragraph レコード一括作成（バッチ処理）
   - TranslationJob レコード作成

5. **翻訳ジョブの自動開始**:
   - 作品登録完了後、翻訳ジョブを自動的にキューに追加
   - バックグラウンドで翻訳処理を開始

6. **エラーハンドリング**:
   - URL不正: 400エラー
   - フェッチ失敗: 502エラー
   - パース失敗: 422エラー（詳細エラーメッセージ）

### 削除処理

1. **連鎖削除順序**:
   - TranslationJob（該当作品の翻訳ジョブ）
   - ChatLog（該当作品の段落を参照するもの）
   - ReadingProgress（該当作品の段落）
   - Paragraph（該当作品の章）
   - Chapter（該当作品）
   - Work

2. **トランザクション**:
   - すべての削除を単一トランザクション内で実行
   - 失敗時はロールバック
   - 進行中の翻訳ジョブがあればキャンセル

### 自動翻訳処理の実装詳細

1. **翻訳ジョブの開始**:
   - 作品の全段落を取得
   - バッチサイズ（デフォルト20段落）に分割
   - TranslationJob ステータスを `in_progress` に更新
   - Work の `translation_status` を `in_progress` に更新

2. **バッチ翻訳処理**:
   ```typescript
   for (const batch of paragraphBatches) {
     // 各段落を並列翻訳（Promise.all）
     const translations = await Promise.all(
       batch.map(p => translateParagraph(p, type))
     );

     // DB更新（バッチ）
     await updateParagraphTranslations(translations);

     // 進捗更新
     await updateJobProgress(jobId, completedCount);

     // レート制限対策の待機
     await sleep(TRANSLATION_DELAY_MS);
   }
   ```

3. **翻訳API呼び出し**:
   - Vercel AI SDK の `generateText` を使用
   - プロンプト:
     - 通常訳: 原文に忠実、専門用語を保持
     - やさしい訳: 平易な日本語、短文化、文脈補完
   - タイムアウト: 30秒/段落
   - リトライ: 指数バックオフ（1秒 → 2秒 → 4秒）

4. **進捗管理**:
   - DB の TranslationJob レコードを定期更新
   - `completed_count` / `total_count` で進捗率を計算
   - 失敗した段落は `errors` 配列に記録

5. **完了処理**:
   - すべての段落が翻訳完了したら:
     - TranslationJob ステータスを `completed` に更新
     - Work の `translation_status` を `completed` に更新
     - 完了通知（ログ or WebSocket）
   - 部分失敗の場合:
     - ステータスを `completed` にするが、エラー情報を保持
     - 失敗段落の再試行オプションを提供

6. **エラーハンドリング**:
   - API制限エラー (429): 待機時間を倍増してリトライ
   - タイムアウト: リトライカウントを増やして再試行
   - その他のエラー: エラーログに記録、次の段落へ進む
   - 致命的エラー（DB接続失敗等）: ジョブを `failed` に更新

### セキュリティ考慮

- レート制限: 作品登録は1ユーザー/10分あたり5件まで
- URL検証: 許可されたドメイン（gutenberg.org）のみ
- SSRF対策: プライベートIPへのアクセス禁止
- 管理画面へのアクセス制御（将来的に認証必須）
- 翻訳ジョブの同時実行制限: 1作品につき1ジョブまで
