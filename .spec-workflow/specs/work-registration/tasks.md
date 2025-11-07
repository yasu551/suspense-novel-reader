# タスク定義書：作品登録機能

## フェーズ1: データベースとスキーマのセットアップ

- [x] 1.1 Prismaのセットアップとデータベース接続設定
  - ファイル: `prisma/schema.prisma`（新規作成）、`package.json`（修正）
  - Prismaをプロジェクトに追加し、PostgreSQLデータベースへの接続を設定
  - 目的: データベースORM環境の構築
  - _Leverage: なし（新規セットアップ）_
  - _Requirements: 非機能要件 - コードアーキテクチャ_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: DevOps エンジニア / データベーススペシャリスト\n\nTask: Prismaをプロジェクトに追加し、PostgreSQLデータベース接続を設定してください（要件: 非機能要件 - コードアーキテクチャ）。以下の手順を実行してください：\n1. `npm install prisma @prisma/client` でPrismaをインストール\n2. `npx prisma init` でPrismaプロジェクトを初期化\n3. `.env` ファイルに `DATABASE_URL` を設定（例: `postgresql://user:password@localhost:5432/suspense_novel_reader`）\n4. `prisma/schema.prisma` のdatasource設定を確認\n\nRestrictions:\n- 既存のデータベースがない場合はローカルPostgreSQLまたはVercel Postgresを使用\n- 環境変数は `.env` ファイルで管理（`.env.example` も作成）\n- Prisma Clientの型生成を有効化\n\nSuccess:\n- Prismaが正常にインストールされている\n- データベース接続が確立できる\n- `prisma/schema.prisma` が存在し、基本設定が完了している\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 1.2 Prismaスキーマの定義（Work、Chapter、Paragraphモデル）
  - ファイル: `prisma/schema.prisma`（修正）
  - Work、Chapter、Paragraphモデルをスキーマに定義
  - 目的: 作品・章・段落のデータ構造を定義
  - _Leverage: design.md のデータモデル定義_
  - _Requirements: 要件1（作品登録）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: データベースアーキテクト\n\nTask: Prismaスキーマに Work、Chapter、Paragraph モデルを定義してください（要件1: 作品登録）。design.md のデータモデルセクションを参照し、以下のモデルを実装してください：\n\n1. **Work モデル**:\n   - id, title, author, publicationYear, isPublicDomain\n   - language, genre, tags, wordCount, difficulty\n   - coverUrl, sourceUrl, sourceId, license\n   - popularityScore, translationStatus, translationProgress\n   - createdAt, updatedAt\n   - リレーション: chapters (1対多)\n\n2. **Chapter モデル**:\n   - id, workId, chapterNumber, title, order\n   - createdAt, updatedAt\n   - リレーション: work (多対1), paragraphs (1対多)\n   - ユニーク制約: [workId, chapterNumber]\n\n3. **Paragraph モデル**:\n   - id (カスタムID: \"work-{workId}/chapter-{index}/paragraph-{index}\")\n   - chapterId, originalText, translationNormal, translationEasy\n   - order, glossaryTags\n   - createdAt, updatedAt\n   - リレーション: chapter (多対1)\n\nRestrictions:\n- design.md のスキーマ定義に厳密に従う\n- インデックスを適切に設定（translationStatus, language, difficulty等）\n- カスケード削除（onDelete: Cascade）を設定\n- @db.Text デコレータを長文フィールドに使用\n\nSuccess:\n- すべてのモデルが正しく定義されている\n- リレーションとインデックスが適切に設定されている\n- `npx prisma format` でエラーが出ない\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 1.3 Prismaスキーマの定義（TranslationJob、その他のモデル）
  - ファイル: `prisma/schema.prisma`（修正）
  - TranslationJob、GlossaryTerm、UserProfile、ReadingProgress、ChatLogモデルをスキーマに定義
  - 目的: 翻訳ジョブとサポート機能のデータ構造を定義
  - _Leverage: design.md のデータモデル定義_
  - _Requirements: 要件2（自動翻訳ジョブ）、将来的な機能_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: データベースアーキテクト\n\nTask: Prismaスキーマに TranslationJob、GlossaryTerm、UserProfile、ReadingProgress、ChatLog モデルを定義してください（要件2: 自動翻訳ジョブ、将来的な機能）。design.md のデータモデルセクションを参照してください。\n\n1. **TranslationJob モデル**:\n   - id, workId, status, translationType\n   - totalCount, completedCount, errorLog\n   - startedAt, completedAt, createdAt, updatedAt\n   - リレーション: work (多対1)\n\n2. **GlossaryTerm モデル**（将来的な用語辞書機能用）\n3. **UserProfile モデル**（将来的な認証機能用）\n4. **ReadingProgress モデル**（将来的な読書進捗機能用）\n5. **ChatLog モデル**（将来的なAIチャット機能用）\n\nRestrictions:\n- design.md のスキーマ定義に厳密に従う\n- インデックスを適切に設定\n- カスケード削除を設定\n\nSuccess:\n- すべてのモデルが正しく定義されている\n- `npx prisma format` でエラーが出ない\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 1.4 マイグレーションの実行とPrisma Clientの生成
  - ファイル: `prisma/migrations/`（新規作成）
  - マイグレーションを実行し、データベースにテーブルを作成
  - 目的: データベーススキーマの適用とクライアントコード生成
  - _Leverage: prisma/schema.prisma_
  - _Requirements: すべて（データベース基盤）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: データベース管理者\n\nTask: Prismaマイグレーションを実行し、データベースにテーブルを作成してください（すべての要件に必要なデータベース基盤）。\n\n手順:\n1. `npx prisma migrate dev --name init_work_registration` を実行\n2. マイグレーションが成功することを確認\n3. `npx prisma generate` でPrisma Clientを生成\n4. `npx prisma studio` でデータベースを確認（オプション）\n\nRestrictions:\n- 本番環境では `prisma migrate deploy` を使用（開発環境では `migrate dev`）\n- マイグレーション失敗時は `prisma migrate reset` でリセット可能\n\nSuccess:\n- マイグレーションが成功し、すべてのテーブルが作成されている\n- Prisma Clientが生成され、型定義が利用可能\n- `node_modules/.prisma/client` が存在する\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

## フェーズ2: 型定義とユーティリティ

- [ ] 2.1 作品関連の型定義
  - ファイル: `lib/types/work.ts`（新規作成）
  - ScrapedWork、ParsedWork、WorkMetadata、ValidationResult等の型を定義
  - 目的: スクレイパー/パーサーで使用する型の定義
  - _Leverage: design.md のコンポーネントとインターフェース定義_
  - _Requirements: 要件1（作品登録）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: TypeScript開発者（型システムとインターフェース専門）\n\nTask: スクレイパー/パーサーで使用する作品関連の型定義を作成してください（要件1: 作品登録）。design.md の「コンポーネントとインターフェース」セクションを参照し、以下の型を定義してください：\n\n1. **ScrapedWork**: スクレイピング結果の型\n   - sourceUrl, sourceId, title, author, language, rawHtml, publicationYear?\n\n2. **ParsedWork**: パース結果の型\n   - chapters: ParsedChapter[], totalParagraphs: number\n\n3. **ParsedChapter**: 章の型\n   - chapterNumber, title, order, paragraphs: ParsedParagraph[]\n\n4. **ParsedParagraph**: 段落の型\n   - id, originalText, order\n\n5. **WorkMetadata**: メタデータの型\n   - title, author, language, publicationYear?\n\n6. **ValidationResult**: URL検証結果の型\n   - isValid, error?, normalizedUrl?\n\n7. **WorkRegistrationRequest**: API リクエストの型\n   - url, genre?, difficulty?\n\n8. **WorkRegistrationResponse**: API レスポンスの型\n   - id, title, author, status, translationJobId?\n\nRestrictions:\n- すべての型をexportする\n- オプショナルプロパティは `?` を使用\n- design.md の定義に厳密に従う\n\nSuccess:\n- すべての型が正しく定義されている\n- TypeScriptコンパイルエラーがない\n- 他のファイルから型をインポートして使用できる\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 2.2 URL検証ユーティリティ
  - ファイル: `lib/scraper/url-validator.ts`（新規作成）
  - validateGutenbergUrl関数を実装（URL形式検証、SSRF対策）
  - 目的: URL検証とセキュリティ対策
  - _Leverage: lib/types/work.ts_
  - _Requirements: 要件3（URL検証とエラーハンドリング）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: セキュリティエンジニア / バックエンド開発者\n\nTask: URL検証ユーティリティを実装してください（要件3: URL検証とエラーハンドリング）。以下の機能を実装してください：\n\n1. **validateGutenbergUrl(url: string): ValidationResult**\n   - Project Gutenberg URLの形式を検証（正規表現: `https://www.gutenberg.org/cache/epub/\\d+/pg\\d+-images.html`）\n   - プライベートIPアドレスへのアクセスを拒否（127.0.0.1、192.168.x.x、10.x.x.x、172.16-31.x.x）\n   - URLを正規化（例: http → https）\n   - エラーメッセージを返す\n\n実装例:\n```typescript\nexport function validateGutenbergUrl(url: string): ValidationResult {\n  try {\n    const parsedUrl = new URL(url);\n    \n    // ドメイン検証\n    if (!parsedUrl.hostname.endsWith('gutenberg.org')) {\n      return { isValid: false, error: '許可されたドメインではありません' };\n    }\n    \n    // SSRF対策: プライベートIPチェック\n    // ...\n    \n    // 正規化\n    const normalizedUrl = parsedUrl.toString().replace('http://', 'https://');\n    return { isValid: true, normalizedUrl };\n  } catch (error) {\n    return { isValid: false, error: 'URLが無効です' };\n  }\n}\n```\n\nRestrictions:\n- すべてのセキュリティチェックを実装する\n- エラーメッセージはユーザーフレンドリーに\n- プライベートIPチェックを確実に実装\n\nSuccess:\n- 有効なGutenberg URLを正しく検証できる\n- 無効なURLやプライベートIPを拒否できる\n- エラーメッセージが明確\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 2.3 ID生成ユーティリティ
  - ファイル: `lib/scraper/id-generator.ts`（新規作成）
  - generateParagraphId関数を実装
  - 目的: 章・段落のユニークID生成
  - _Leverage: なし_
  - _Requirements: 要件1（作品登録）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: バックエンド開発者\n\nTask: 章・段落のユニークID生成ユーティリティを実装してください（要件1: 作品登録）。以下の関数を実装してください：\n\n1. **generateParagraphId(workId: string, chapterIndex: number, paragraphIndex: number): string**\n   - 形式: `work-{workId}/chapter-{chapterIndex}/paragraph-{paragraphIndex}`\n   - 例: `work-clx123abc/chapter-1/paragraph-5`\n\n実装例:\n```typescript\nexport function generateParagraphId(\n  workId: string,\n  chapterIndex: number,\n  paragraphIndex: number\n): string {\n  return `work-${workId}/chapter-${chapterIndex}/paragraph-${paragraphIndex}`;\n}\n```\n\nRestrictions:\n- IDの形式を厳密に守る\n- インデックスは0始まりではなく1始まりにする\n\nSuccess:\n- ID生成関数が正しく動作する\n- 生成されたIDが一意である\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

## フェーズ3: スクレイパー/パーサーの実装

- [ ] 3.1 メタデータ抽出ユーティリティ
  - ファイル: `lib/scraper/metadata-extractor.ts`（新規作成）
  - extractMetadata関数を実装（Cheerioを使用してタイトル、著者、言語を抽出）
  - 目的: HTMLからメタデータを抽出
  - _Leverage: cheerio、lib/types/work.ts_
  - _Requirements: 要件1（作品登録）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: スクレイピング専門開発者\n\nTask: HTMLからメタデータを抽出するユーティリティを実装してください（要件1: 作品登録）。以下の関数を実装してください：\n\n1. **extractMetadata($: CheerioAPI): WorkMetadata**\n   - タイトル: `<h1>` または `<title>` タグから抽出\n   - 著者: `<h2>` または `rel=\"dcterms:creator\"` 属性から抽出\n   - 言語: `<html lang=\"...\">` またはメタタグから抽出\n   - 出版年: メタデータから抽出（オプション）\n\n実装例:\n```typescript\nimport * as cheerio from 'cheerio';\nimport { WorkMetadata } from '../types/work';\n\nexport function extractMetadata($: cheerio.CheerioAPI): WorkMetadata {\n  const title = $('h1').first().text().trim() || $('title').text().trim();\n  const author = $('h2').first().text().trim() || \n                 $('[rel=\"dcterms:creator\"]').text().trim();\n  const language = $('html').attr('lang') || 'en';\n  \n  if (!title || !author) {\n    throw new Error('タイトルまたは著者が見つかりません');\n  }\n  \n  return { title, author, language };\n}\n```\n\nRestrictions:\n- Cheerioを使用してDOM解析\n- タイトルと著者が見つからない場合はエラーをthrow\n- テキストをtrim()してクリーンアップ\n\nSuccess:\n- 正常なHTMLから正しくメタデータを抽出できる\n- タイトル/著者がない場合にエラーをthrowする\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 3.2 HTMLパーサー（章・段落の検出）
  - ファイル: `lib/scraper/parser.ts`（新規作成）
  - parseWorkStructure関数を実装（章と段落を検出し、IDを生成）
  - 目的: HTMLから構造化データを生成
  - _Leverage: cheerio、lib/scraper/id-generator.ts、lib/types/work.ts_
  - _Requirements: 要件1（作品登録）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: スクレイピング専門開発者 / データ構造設計者\n\nTask: HTMLから章・段落を検出し構造化データを生成するパーサーを実装してください（要件1: 作品登録）。以下の関数を実装してください：\n\n1. **parseWorkStructure(html: string, workId: string): Promise<ParsedWork>**\n   - 章の検出: `<h2>`, `<h3>` タグで\"CHAPTER\"を含むものを章として識別\n   - 段落の検出: `<p>` タグを段落として識別\n   - 空の段落・ナビゲーション要素を除外\n   - 各段落にID付与（generateParagraphIdを使用）\n\n実装例:\n```typescript\nimport * as cheerio from 'cheerio';\nimport { generateParagraphId } from './id-generator';\nimport { ParsedWork, ParsedChapter, ParsedParagraph } from '../types/work';\n\nexport async function parseWorkStructure(\n  html: string,\n  workId: string\n): Promise<ParsedWork> {\n  const $ = cheerio.load(html);\n  const chapters: ParsedChapter[] = [];\n  let totalParagraphs = 0;\n  \n  // 章の検出\n  $('h2, h3').each((chapterIndex, element) => {\n    const chapterTitle = $(element).text().trim();\n    if (!chapterTitle.toUpperCase().includes('CHAPTER')) return;\n    \n    const paragraphs: ParsedParagraph[] = [];\n    \n    // 章の次の要素から次の章まで段落を収集\n    $(element).nextUntil('h2, h3', 'p').each((paraIndex, pElement) => {\n      const text = $(pElement).text().trim();\n      if (text.length === 0) return; // 空の段落を除外\n      \n      const id = generateParagraphId(workId, chapterIndex + 1, paraIndex + 1);\n      paragraphs.push({\n        id,\n        originalText: text,\n        order: paraIndex + 1\n      });\n    });\n    \n    if (paragraphs.length > 0) {\n      chapters.push({\n        chapterNumber: chapterIndex + 1,\n        title: chapterTitle,\n        order: chapterIndex + 1,\n        paragraphs\n      });\n      totalParagraphs += paragraphs.length;\n    }\n  });\n  \n  return { chapters, totalParagraphs };\n}\n```\n\nRestrictions:\n- Cheerioを使用してDOM解析\n- 空の段落とナビゲーション要素を除外\n- ID生成は generateParagraphId を使用\n\nSuccess:\n- 正常なHTMLから章と段落を正しく検出できる\n- IDが正しい形式で生成されている\n- 空の段落が除外されている\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 3.3 Project Gutenbergスクレイパー
  - ファイル: `lib/scraper/gutenberg.ts`（新規作成）
  - scrapeGutenbergWork関数を実装（URLからHTMLをフェッチし、メタデータを抽出）
  - 目的: Project GutenbergからHTMLとメタデータを取得
  - _Leverage: lib/scraper/url-validator.ts、lib/scraper/metadata-extractor.ts、lib/types/work.ts_
  - _Requirements: 要件1（作品登録）、要件3（URL検証）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: スクレイピング専門開発者 / ネットワーク処理専門家\n\nTask: Project GutenbergからHTMLをフェッチしメタデータを抽出するスクレイパーを実装してください（要件1: 作品登録、要件3: URL検証）。以下の関数を実装してください：\n\n1. **scrapeGutenbergWork(url: string): Promise<ScrapedWork>**\n   - URL検証（validateGutenbergUrlを使用）\n   - HTMLフェッチ（fetch API使用、3回までリトライ）\n   - メタデータ抽出（extractMetadataを使用）\n   - 出典IDをURLから抽出\n\n実装例:\n```typescript\nimport * as cheerio from 'cheerio';\nimport { validateGutenbergUrl } from './url-validator';\nimport { extractMetadata } from './metadata-extractor';\nimport { ScrapedWork } from '../types/work';\n\nexport async function scrapeGutenbergWork(url: string): Promise<ScrapedWork> {\n  // URL検証\n  const validation = validateGutenbergUrl(url);\n  if (!validation.isValid) {\n    throw new Error(validation.error || 'URLが無効です');\n  }\n  \n  const normalizedUrl = validation.normalizedUrl || url;\n  \n  // HTMLフェッチ（リトライ機能付き）\n  let html: string;\n  let lastError: Error | null = null;\n  \n  for (let i = 0; i < 3; i++) {\n    try {\n      const response = await fetch(normalizedUrl);\n      if (!response.ok) {\n        throw new Error(`HTTPエラー: ${response.status}`);\n      }\n      html = await response.text();\n      break;\n    } catch (error) {\n      lastError = error as Error;\n      if (i < 2) {\n        // 指数バックオフ: 1秒、2秒、4秒\n        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));\n      }\n    }\n  }\n  \n  if (!html!) {\n    throw new Error(`ページの取得に失敗しました: ${lastError?.message}`);\n  }\n  \n  // メタデータ抽出\n  const $ = cheerio.load(html);\n  const metadata = extractMetadata($);\n  \n  // 出典ID抽出（例: https://www.gutenberg.org/cache/epub/84/pg84-images.html → \"84\"）\n  const sourceIdMatch = normalizedUrl.match(/\\/epub\\/(\\d+)\\//);  const sourceId = sourceIdMatch ? sourceIdMatch[1] : '';\n  \n  return {\n    sourceUrl: normalizedUrl,\n    sourceId,\n    title: metadata.title,\n    author: metadata.author,\n    language: metadata.language,\n    rawHtml: html,\n    publicationYear: metadata.publicationYear\n  };\n}\n```\n\nRestrictions:\n- URL検証を必ず実行\n- フェッチ失敗時は3回までリトライ（指数バックオフ）\n- エラーメッセージはユーザーフレンドリーに\n\nSuccess:\n- 有効なGutenberg URLから正常にHTMLとメタデータを取得できる\n- リトライ機能が正しく動作する\n- エラーハンドリングが適切\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

## フェーズ4: APIエンドポイントの実装

- [ ] 4.1 作品登録API（POST /api/works）
  - ファイル: `app/api/works/route.ts`（新規作成）
  - POST メソッドを実装（スクレイピング → パース → DB保存 → 翻訳ジョブ作成）
  - 目的: 作品登録のメインAPIエンドポイント
  - _Leverage: lib/scraper/gutenberg.ts、lib/scraper/parser.ts、@prisma/client_
  - _Requirements: 要件1（作品登録）、要件2（自動翻訳ジョブ）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: フルスタック開発者 / API設計者\n\nTask: 作品登録APIエンドポイント（POST /api/works）を実装してください（要件1: 作品登録、要件2: 自動翻訳ジョブ）。以下の処理フローを実装してください：\n\n1. リクエストボディの検証（url, genre?, difficulty?）\n2. スクレイピング（scrapeGutenbergWorkを使用）\n3. パース（parseWorkStructureを使用）\n4. データベース保存（Prisma トランザクション）:\n   - Workレコード作成\n   - Chapterレコード一括作成\n   - Paragraphレコード一括作成\n   - TranslationJobレコード作成\n5. 成功レスポンスを返す\n\n実装例:\n```typescript\nimport { NextRequest, NextResponse } from 'next/server';\nimport { PrismaClient } from '@prisma/client';\nimport { scrapeGutenbergWork } from '@/lib/scraper/gutenberg';\nimport { parseWorkStructure } from '@/lib/scraper/parser';\nimport { WorkRegistrationRequest, WorkRegistrationResponse } from '@/lib/types/work';\n\nconst prisma = new PrismaClient();\n\nexport async function POST(request: NextRequest) {\n  try {\n    const body: WorkRegistrationRequest = await request.json();\n    const { url, genre, difficulty } = body;\n    \n    if (!url) {\n      return NextResponse.json(\n        { error: 'URLが必要です' },\n        { status: 400 }\n      );\n    }\n    \n    // 1. スクレイピング\n    const scrapedWork = await scrapeGutenbergWork(url);\n    \n    // 2. 重複チェック\n    const existingWork = await prisma.work.findUnique({\n      where: { sourceUrl: scrapedWork.sourceUrl }\n    });\n    \n    if (existingWork) {\n      return NextResponse.json(\n        { error: 'この作品は既に登録されています' },\n        { status: 409 }\n      );\n    }\n    \n    // 3. Workレコード作成（IDを取得）\n    const work = await prisma.work.create({\n      data: {\n        title: scrapedWork.title,\n        author: scrapedWork.author,\n        language: scrapedWork.language,\n        publicationYear: scrapedWork.publicationYear,\n        sourceUrl: scrapedWork.sourceUrl,\n        sourceId: scrapedWork.sourceId,\n        genre: genre || [],\n        difficulty: difficulty || 'normal',\n        translationStatus: 'pending'\n      }\n    });\n    \n    // 4. パース\n    const parsedWork = await parseWorkStructure(scrapedWork.rawHtml, work.id);\n    \n    // 5. トランザクションでChapter + Paragraph + TranslationJobを作成\n    await prisma.$transaction(async (tx) => {\n      // Chapter作成\n      for (const chapter of parsedWork.chapters) {\n        const createdChapter = await tx.chapter.create({\n          data: {\n            workId: work.id,\n            chapterNumber: chapter.chapterNumber,\n            title: chapter.title,\n            order: chapter.order\n          }\n        });\n        \n        // Paragraph一括作成\n        await tx.paragraph.createMany({\n          data: chapter.paragraphs.map(p => ({\n            id: p.id,\n            chapterId: createdChapter.id,\n            originalText: p.originalText,\n            order: p.order\n          }))\n        });\n      }\n      \n      // TranslationJob作成\n      await tx.translationJob.create({\n        data: {\n          workId: work.id,\n          status: 'pending',\n          translationType: 'both',\n          totalCount: parsedWork.totalParagraphs,\n          completedCount: 0\n        }\n      });\n      \n      // Workの翻訳ステータスを更新\n      await tx.work.update({\n        where: { id: work.id },\n        data: {\n          wordCount: parsedWork.totalParagraphs,\n          translationStatus: 'pending'\n        }\n      });\n    });\n    \n    const response: WorkRegistrationResponse = {\n      id: work.id,\n      title: work.title,\n      author: work.author,\n      status: 'completed'\n    };\n    \n    return NextResponse.json(response, { status: 201 });\n    \n  } catch (error: any) {\n    console.error('作品登録エラー:', error);\n    \n    if (error.message.includes('許可されたドメイン')) {\n      return NextResponse.json({ error: error.message }, { status: 400 });\n    }\n    \n    if (error.message.includes('取得に失敗')) {\n      return NextResponse.json({ error: error.message }, { status: 502 });\n    }\n    \n    if (error.message.includes('タイトル') || error.message.includes('著者')) {\n      return NextResponse.json(\n        { error: 'ページの解析に失敗しました' },\n        { status: 422 }\n      );\n    }\n    \n    return NextResponse.json(\n      { error: '作品の登録に失敗しました' },\n      { status: 500 }\n    );\n  }\n}\n```\n\nRestrictions:\n- トランザクションを使用してデータ整合性を保証\n- エラーハンドリングを適切に実装（400, 409, 422, 502, 500）\n- エラーメッセージはユーザーフレンドリーに\n\nSuccess:\n- 有効なURLで作品を正常に登録できる\n- データベースに正しくレコードが作成される\n- エラー時に適切なステータスコードとメッセージを返す\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 4.2 作品一覧取得API（GET /api/works）
  - ファイル: `app/api/works/route.ts`（修正）
  - GET メソッドを実装（作品一覧の取得、検索・絞込・並び替え）
  - 目的: 作品一覧の取得API
  - _Leverage: @prisma/client_
  - _Requirements: 将来的な作品一覧画面での使用_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: バックエンド開発者 / API設計者\n\nTask: 作品一覧取得APIエンドポイント（GET /api/works）を実装してください（将来的な作品一覧画面での使用）。以下の機能を実装してください：\n\n1. クエリパラメータの処理:\n   - page（ページ番号、デフォルト1）\n   - pageSize（1ページあたりの件数、デフォルト20）\n   - search（検索キーワード）\n   - genre（ジャンルフィルター）\n   - difficulty（難易度フィルター）\n   - status（翻訳ステータスフィルター）\n\n2. Prismaでデータ取得（検索・絞込・ページング）\n\n3. レスポンス形式:\n```typescript\n{\n  works: WorkSummary[],\n  total: number,\n  page: number,\n  pageSize: number\n}\n```\n\nRestrictions:\n- ページングを実装（skip/take）\n- 検索はタイトル、著者、タグに対して実行\n- チャプターや段落は含めない（軽量化）\n\nSuccess:\n- 作品一覧を正常に取得できる\n- 検索・絞込が正しく動作する\n- ページングが正しく動作する\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 4.3 作品削除API（DELETE /api/works/[id]）
  - ファイル: `app/api/works/[id]/route.ts`（新規作成）
  - DELETE メソッドを実装（関連データの連鎖削除）
  - 目的: 作品削除のAPIエンドポイント
  - _Leverage: @prisma/client_
  - _Requirements: 要件4（作品削除）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: バックエンド開発者 / データベース専門家\n\nTask: 作品削除APIエンドポイント（DELETE /api/works/[id]）を実装してください（要件4: 作品削除）。以下の処理フローを実装してください：\n\n1. 作品の存在確認\n2. トランザクションで連鎖削除:\n   - TranslationJob\n   - ChatLog（将来的に）\n   - ReadingProgress（将来的に）\n   - Paragraph（Chapterのカスケード削除で自動）\n   - Chapter（Workのカスケード削除で自動）\n   - Work\n3. 成功レスポンスを返す\n\n実装例:\n```typescript\nimport { NextRequest, NextResponse } from 'next/server';\nimport { PrismaClient } from '@prisma/client';\n\nconst prisma = new PrismaClient();\n\nexport async function DELETE(\n  request: NextRequest,\n  { params }: { params: { id: string } }\n) {\n  try {\n    const { id } = params;\n    \n    // 作品の存在確認\n    const work = await prisma.work.findUnique({\n      where: { id }\n    });\n    \n    if (!work) {\n      return NextResponse.json(\n        { error: '指定された作品が見つかりません' },\n        { status: 404 }\n      );\n    }\n    \n    // トランザクションで削除\n    await prisma.$transaction(async (tx) => {\n      // TranslationJobを削除\n      await tx.translationJob.deleteMany({\n        where: { workId: id }\n      });\n      \n      // Workを削除（Cascade設定でChapter、Paragraphも自動削除）\n      await tx.work.delete({\n        where: { id }\n      });\n    });\n    \n    return NextResponse.json({\n      success: true,\n      message: '作品を削除しました',\n      deletedWorkId: id\n    });\n    \n  } catch (error) {\n    console.error('作品削除エラー:', error);\n    return NextResponse.json(\n      { error: '作品の削除に失敗しました' },\n      { status: 500 }\n    );\n  }\n}\n```\n\nRestrictions:\n- トランザクションを使用してデータ整合性を保証\n- Prismaスキーマのカスケード削除設定を活用\n- エラーハンドリングを適切に実装\n\nSuccess:\n- 作品を正常に削除できる\n- 関連データも連鎖削除される\n- 存在しない作品IDで404エラーを返す\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 4.4 作品詳細取得API（GET /api/works/[id]）
  - ファイル: `app/api/works/[id]/route.ts`（修正）
  - GET メソッドを実装（作品詳細、章メタデータを取得）
  - 目的: 作品詳細取得API
  - _Leverage: @prisma/client_
  - _Requirements: 将来的な作品詳細画面での使用_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: バックエンド開発者\n\nTask: 作品詳細取得APIエンドポイント（GET /api/works/[id]）を実装してください（将来的な作品詳細画面での使用）。以下の情報を返してください：\n\n1. 作品の詳細情報\n2. 章のメタデータ（タイトル、段落数）\n3. 翻訳ジョブのステータス\n\nRestrictions:\n- 段落の本文は含めない（軽量化）\n- 章の段落数をカウント\n\nSuccess:\n- 作品詳細を正常に取得できる\n- 章のメタデータが正しく取得できる\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

## フェーズ5: 管理画面UIの実装

- [ ] 5.1 管理画面レイアウト
  - ファイル: `app/admin/page.tsx`（新規作成）
  - 管理画面の基本レイアウトを作成
  - 目的: 管理画面のエントリーポイント
  - _Leverage: components/ui/*（shadcn UI）_
  - _Requirements: 要件1、要件4（管理機能）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: フロントエンド開発者 / UIデザイナー\n\nTask: 管理画面の基本レイアウトを作成してください（要件1、要件4: 管理機能）。以下の構造を実装してください：\n\n1. ページタイトル「作品管理」\n2. 2カラムレイアウト:\n   - 左側: WorkImportForm（作品登録フォーム）\n   - 右側: WorkList（作品リスト）\n\n実装例:\n```typescript\nimport { WorkImportForm } from '@/components/admin/WorkImportForm';\nimport { WorkList } from '@/components/admin/WorkList';\n\nexport default function AdminPage() {\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">作品管理</h1>\n      \n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">\n        <div>\n          <h2 className=\"text-2xl font-semibold mb-4\">作品登録</h2>\n          <WorkImportForm />\n        </div>\n        \n        <div>\n          <h2 className=\"text-2xl font-semibold mb-4\">登録済み作品</h2>\n          <WorkList />\n        </div>\n      </div>\n    </div>\n  );\n}\n```\n\nRestrictions:\n- Tailwind CSSを使用\n- レスポンシブデザイン（モバイル対応）\n- shadcn UIコンポーネントを活用\n\nSuccess:\n- 管理画面が正しく表示される\n- レスポンシブデザインが動作する\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 5.2 作品登録フォームコンポーネント
  - ファイル: `components/admin/WorkImportForm.tsx`（新規作成）
  - URL入力、ジャンル・難易度選択、登録ボタンを実装
  - 目的: 作品登録UIの提供
  - _Leverage: components/ui/*、React Hook Form、Zod_
  - _Requirements: 要件1（作品登録）、要件6（ジャンル・難易度設定）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: フロントエンド開発者（React専門）\n\nTask: 作品登録フォームコンポーネントを実装してください（要件1: 作品登録、要件6: ジャンル・難易度設定）。以下の機能を実装してください：\n\n1. フォームフィールド:\n   - URL入力（必須）\n   - ジャンル選択（複数選択可能: ゴシック、SF、冒険、恋愛、ミステリー、ホラー）\n   - 難易度選択（やさしい、ふつう、むずかしい）\n\n2. バリデーション（Zodスキーマ）:\n   - URLは必須\n   - URL形式チェック\n\n3. フォーム送信:\n   - POST /api/works にリクエスト送信\n   - ローディング状態の表示\n   - 成功/エラーメッセージの表示\n\n実装例:\n```typescript\n'use client';\n\nimport { useState } from 'react';\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport * as z from 'zod';\nimport { Button } from '@/components/ui/button';\nimport { Input } from '@/components/ui/input';\nimport { Label } from '@/components/ui/label';\nimport { Select } from '@/components/ui/select';\nimport { Checkbox } from '@/components/ui/checkbox';\n\nconst formSchema = z.object({\n  url: z.string().url('有効なURLを入力してください'),\n  genre: z.array(z.string()).optional(),\n  difficulty: z.enum(['easy', 'normal', 'hard']).optional()\n});\n\nexport function WorkImportForm() {\n  const [isLoading, setIsLoading] = useState(false);\n  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);\n  \n  const { register, handleSubmit, formState: { errors }, reset } = useForm({\n    resolver: zodResolver(formSchema)\n  });\n  \n  const onSubmit = async (data: any) => {\n    setIsLoading(true);\n    setMessage(null);\n    \n    try {\n      const response = await fetch('/api/works', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(data)\n      });\n      \n      if (!response.ok) {\n        const error = await response.json();\n        throw new Error(error.error || '登録に失敗しました');\n      }\n      \n      const result = await response.json();\n      setMessage({ type: 'success', text: `「${result.title}」を登録しました` });\n      reset();\n      \n    } catch (error: any) {\n      setMessage({ type: 'error', text: error.message });\n    } finally {\n      setIsLoading(false);\n    }\n  };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)} className=\"space-y-4\">\n      <div>\n        <Label htmlFor=\"url\">Project Gutenberg URL</Label>\n        <Input\n          id=\"url\"\n          {...register('url')}\n          placeholder=\"https://www.gutenberg.org/cache/epub/.../pg...-images.html\"\n        />\n        {errors.url && <p className=\"text-red-500 text-sm\">{errors.url.message}</p>}\n      </div>\n      \n      {/* ジャンル選択 */}\n      <div>\n        <Label>ジャンル（複数選択可）</Label>\n        {/* Checkbox実装 */}\n      </div>\n      \n      {/* 難易度選択 */}\n      <div>\n        <Label htmlFor=\"difficulty\">難易度</Label>\n        <Select {...register('difficulty')}>\n          <option value=\"easy\">やさしい</option>\n          <option value=\"normal\">ふつう</option>\n          <option value=\"hard\">むずかしい</option>\n        </Select>\n      </div>\n      \n      <Button type=\"submit\" disabled={isLoading}>\n        {isLoading ? '登録中...' : '作品を登録'}\n      </Button>\n      \n      {message && (\n        <div className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>\n          {message.text}\n        </div>\n      )}\n    </form>\n  );\n}\n```\n\nRestrictions:\n- 'use client' ディレクティブを使用（クライアントコンポーネント）\n- React Hook Formでフォーム管理\n- Zodでバリデーション\n- shadcn UIコンポーネントを使用\n\nSuccess:\n- フォームが正しく表示される\n- バリデーションが動作する\n- API呼び出しが正常に動作する\n- ローディング状態とメッセージが表示される\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 5.3 作品リストコンポーネント
  - ファイル: `components/admin/WorkList.tsx`（新規作成）
  - 作品一覧の表示と削除ボタンを実装
  - 目的: 登録済み作品の管理UI
  - _Leverage: components/ui/*、GET /api/works、DELETE /api/works/:id_
  - _Requirements: 要件4（作品削除）_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: フロントエンド開発者（React専門）\n\nTask: 作品リストコンポーネントを実装してください（要件4: 作品削除）。以下の機能を実装してください：\n\n1. 作品一覧の取得（GET /api/works）\n2. 作品カードの表示:\n   - タイトル、著者\n   - 翻訳ステータス\n   - 削除ボタン\n3. 削除機能:\n   - 削除確認ダイアログ\n   - DELETE /api/works/:id 呼び出し\n   - リストの再取得\n\n実装例:\n```typescript\n'use client';\n\nimport { useEffect, useState } from 'react';\nimport { Button } from '@/components/ui/button';\nimport { Card } from '@/components/ui/card';\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n} from '@/components/ui/alert-dialog';\n\nexport function WorkList() {\n  const [works, setWorks] = useState([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [deleteTarget, setDeleteTarget] = useState<any>(null);\n  \n  const fetchWorks = async () => {\n    try {\n      const response = await fetch('/api/works');\n      const data = await response.json();\n      setWorks(data.works);\n    } catch (error) {\n      console.error('作品一覧の取得に失敗:', error);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n  \n  useEffect(() => {\n    fetchWorks();\n  }, []);\n  \n  const handleDelete = async () => {\n    if (!deleteTarget) return;\n    \n    try {\n      const response = await fetch(`/api/works/${deleteTarget.id}`, {\n        method: 'DELETE'\n      });\n      \n      if (!response.ok) throw new Error('削除に失敗しました');\n      \n      await fetchWorks(); // リストを再取得\n      setDeleteTarget(null);\n    } catch (error) {\n      console.error('削除エラー:', error);\n    }\n  };\n  \n  if (isLoading) return <div>読み込み中...</div>;\n  \n  return (\n    <>\n      <div className=\"space-y-4\">\n        {works.map((work: any) => (\n          <Card key={work.id} className=\"p-4\">\n            <h3 className=\"font-semibold\">{work.title}</h3>\n            <p className=\"text-sm text-gray-600\">{work.author}</p>\n            <p className=\"text-xs text-gray-500\">翻訳: {work.translationStatus}</p>\n            <Button\n              variant=\"destructive\"\n              size=\"sm\"\n              onClick={() => setDeleteTarget(work)}\n              className=\"mt-2\"\n            >\n              削除\n            </Button>\n          </Card>\n        ))}\n      </div>\n      \n      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>\n        <AlertDialogContent>\n          <AlertDialogHeader>\n            <AlertDialogTitle>作品を削除しますか？</AlertDialogTitle>\n            <AlertDialogDescription>\n              「{deleteTarget?.title}」を削除します。この操作は取り消せません。\n            </AlertDialogDescription>\n          </AlertDialogHeader>\n          <AlertDialogFooter>\n            <AlertDialogCancel>キャンセル</AlertDialogCancel>\n            <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>\n          </AlertDialogFooter>\n        </AlertDialogContent>\n      </AlertDialog>\n    </>\n  );\n}\n```\n\nRestrictions:\n- 'use client' ディレクティブを使用\n- shadcn UIコンポーネントを使用\n- 削除確認ダイアログを必ず表示\n\nSuccess:\n- 作品一覧が正しく表示される\n- 削除確認ダイアログが表示される\n- 削除後にリストが更新される\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

## フェーズ6: テストとドキュメント

- [ ] 6.1 ユニットテスト（スクレイパー/パーサー）
  - ファイル: `__tests__/lib/scraper/*.test.ts`（新規作成）
  - url-validator、metadata-extractor、parser、gutenbergのテストを作成
  - 目的: スクレイパー/パーサーの信頼性確保
  - _Leverage: Jest、@testing-library_
  - _Requirements: すべて_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: QAエンジニア / テスト自動化専門家\n\nTask: スクレイパー/パーサーのユニットテストを作成してください（すべての要件）。以下のテストを実装してください：\n\n1. **url-validator.test.ts**:\n   - 有効なGutenberg URLを正しく検証\n   - 無効なドメインを拒否\n   - プライベートIPを拒否\n\n2. **metadata-extractor.test.ts**:\n   - 正常なHTMLから正しくメタデータを抽出\n   - タイトルがない場合にエラー\n   - 著者がない場合にエラー\n\n3. **parser.test.ts**:\n   - 章と段落を正しく検出\n   - 空の段落を除外\n   - IDが正しい形式で生成される\n\n4. **gutenberg.test.ts**:\n   - 正常なURLでスクレイピング成功\n   - 無効なURLでエラー\n   - リトライ機能のテスト\n\nRestrictions:\n- Jestを使用\n- モックHTMLデータを用意\n- fetch APIはモック化\n\nSuccess:\n- すべてのテストがパスする\n- エッジケースがカバーされている\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 6.2 統合テスト（APIエンドポイント）
  - ファイル: `__tests__/api/works/*.test.ts`（新規作成）
  - POST /api/works、DELETE /api/works/:id のテストを作成
  - 目的: APIエンドポイントの信頼性確保
  - _Leverage: Jest、Supertest、Prismaテストデータベース_
  - _Requirements: すべて_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: QAエンジニア / API テスト専門家\n\nTask: APIエンドポイントの統合テストを作成してください（すべての要件）。以下のテストを実装してください：\n\n1. **POST /api/works**:\n   - 正常な登録フロー\n   - 無効なURL → 400エラー\n   - 重複URL → 409エラー\n   - フェッチ失敗 → 502エラー\n   - パース失敗 → 422エラー\n\n2. **DELETE /api/works/:id**:\n   - 正常な削除\n   - 関連データの連鎖削除確認\n   - 存在しない作品 → 404エラー\n\nRestrictions:\n- テストデータベースを使用\n- 各テスト後にデータベースをクリーンアップ\n- fetch APIはモック化\n\nSuccess:\n- すべてのテストがパスする\n- エラーケースがカバーされている\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 6.3 E2Eテスト（管理画面）
  - ファイル: `e2e/admin.spec.ts`（新規作成）
  - 作品登録と削除のE2Eテストを作成
  - 目的: ユーザーシナリオの検証
  - _Leverage: Playwright または Cypress_
  - _Requirements: すべて_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: QAエンジニア / E2Eテスト専門家\n\nTask: 管理画面のE2Eテストを作成してください（すべての要件）。以下のシナリオをテストしてください：\n\n1. **作品登録シナリオ**:\n   - 管理画面にアクセス\n   - URLを入力\n   - ジャンルと難易度を選択\n   - 登録ボタンをクリック\n   - 成功メッセージが表示される\n   - 作品リストに新しい作品が表示される\n\n2. **作品削除シナリオ**:\n   - 作品リストで削除ボタンをクリック\n   - 確認ダイアログが表示される\n   - 確認ボタンをクリック\n   - 作品リストから削除される\n\nRestrictions:\n- Playwright または Cypressを使用\n- テストデータベースを使用\n- モックAPIを使用（実際のGutenbergサイトにアクセスしない）\n\nSuccess:\n- すべてのシナリオがパスする\n- ユーザー体験が検証されている\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_

- [ ] 6.4 README更新とドキュメント作成
  - ファイル: `README.md`（修正）、`docs/work-registration.md`（新規作成、オプション）
  - 作品登録機能のドキュメントを作成
  - 目的: 開発者向けドキュメントの整備
  - _Leverage: なし_
  - _Requirements: すべて_
  - _Prompt: spec work-registrationのタスク実装を開始します。まず spec-workflow-guide を実行してワークフローガイドを取得してから実装を進めてください。\n\nRole: テクニカルライター / ドキュメント担当者\n\nTask: 作品登録機能のドキュメントを作成してください（すべての要件）。以下の情報を記載してください：\n\n1. **README.md に追加**:\n   - 作品登録機能の概要\n   - セットアップ手順（Prismaマイグレーション）\n   - 環境変数の設定\n\n2. **docs/work-registration.md（オプション）**:\n   - 詳細なアーキテクチャ説明\n   - APIエンドポイントの仕様\n   - データモデルの説明\n   - トラブルシューティング\n\nRestrictions:\n- マークダウン形式\n- コードサンプルを含める\n- スクリーンショットを追加（オプション）\n\nSuccess:\n- ドキュメントが完成している\n- 他の開発者が理解できる内容\n\n実装完了後、tasks.mdでこのタスクを [-] から [x] に更新し、log-implementation ツールで実装詳細を記録してください。_
