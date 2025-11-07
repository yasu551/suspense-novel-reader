# Suspense Novel Reader

英語原文の小説（特にパブリックドメインの古典）を日本語で"やさしく"読めるようにし、読書中の疑問をAIに即座に質問できるWebアプリケーション。

## 機能

- **作品登録**: Project GutenbergからURLで作品を自動インポート
- **自動翻訳**: 通常訳とやさしい訳の両方を自動生成
- **読書モード**: 原文/日本語/並列表示の切り替え
- **AIチャット**: 選択したテキストについてAIに質問

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=ai-sdk-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai%2Ftree%2Fmain%2Fexamples%2Fnext-openai&env=OPENAI_API_KEY&project-name=ai-sdk-next-openai&repository-name=ai-sdk-next-openai)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/ai/tree/main/examples/next-openai next-openai-app
```

```bash
yarn create next-app --example https://github.com/vercel/ai/tree/main/examples/next-openai next-openai-app
```

```bash
pnpm create next-app --example https://github.com/vercel/ai/tree/main/examples/next-openai next-openai-app
```

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を参考に `.env` ファイルを作成します：

```bash
cp .env.example .env
```

必要な環境変数：

- `DATABASE_URL`: PostgreSQLデータベースの接続文字列
- `OPENAI_API_KEY`: OpenAI APIキー

### 3. データベースのセットアップ

#### ローカルPostgreSQLを使用する場合

1. PostgreSQLをインストール（未インストールの場合）
2. データベースを作成：
   ```bash
   createdb suspense_novel_reader
   ```
3. `.env` ファイルのDATABASE_URLを更新：
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/suspense_novel_reader"
   ```

#### Vercel Postgresを使用する場合

1. [Vercel](https://vercel.com)でプロジェクトを作成
2. Storage → Postgres → Create Database
3. 接続文字列をコピーして `.env` ファイルに設定

### 4. Prismaマイグレーションの実行

データベースにテーブルを作成します：

```bash
npx prisma migrate dev
```

Prisma Clientが自動的に生成されます。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## Prismaコマンド

- **マイグレーション実行**: `npx prisma migrate dev`
- **Prisma Studio起動**: `npx prisma studio`
- **Prisma Client生成**: `npx prisma generate`
- **スキーマフォーマット**: `npx prisma format`

## Learn More

To learn more about OpenAI, Next.js, and the AI SDK take a look at the following resources:

- [AI SDK docs](https://ai-sdk.dev/docs)
- [Vercel AI Playground](https://ai-sdk.dev/playground)
- [OpenAI Documentation](https://platform.openai.com/docs) - learn about OpenAI features and API.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
