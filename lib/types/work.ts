/**
 * 作品関連の型定義
 *
 * スクレイピング、パース、API通信で使用する型を定義
 */

// ===========================
// スクレイピング結果の型
// ===========================

/**
 * スクレイピングした作品データ
 * HTMLから抽出した生のデータ
 */
export interface ScrapedWork {
  /** 作品タイトル */
  title: string;
  /** 著者名 */
  author: string;
  /** 出版年（不明な場合はnull） */
  publicationYear: number | null;
  /** 言語コード（例: "en", "ja"） */
  language: string;
  /** ライセンス情報 */
  license: string | null;
  /** 出典URL */
  sourceUrl: string;
  /** 出典サイトの作品ID */
  sourceId: string;
  /** カバー画像URL */
  coverUrl: string | null;
  /** 生のHTML文字列 */
  rawHtml: string;
}

/**
 * パースした章データ
 */
export interface ParsedChapter {
  /** 章番号 */
  chapterNumber: number;
  /** 章タイトル（ない場合はnull） */
  title: string | null;
  /** 表示順序 */
  order: number;
  /** 段落リスト */
  paragraphs: ParsedParagraph[];
}

/**
 * パースした段落データ
 */
export interface ParsedParagraph {
  /** 段落の表示順序 */
  order: number;
  /** 原文テキスト */
  originalText: string;
}

/**
 * パース済み作品データ
 * 章と段落に分割された構造化データ
 */
export interface ParsedWork {
  /** 作品メタデータ */
  metadata: ScrapedWork;
  /** 章リスト */
  chapters: ParsedChapter[];
  /** 総単語数 */
  wordCount: number;
}

// ===========================
// メタデータ抽出の型
// ===========================

/**
 * 作品メタデータ
 * 難易度推定やジャンル分類の結果
 */
export interface WorkMetadata {
  /** ジャンルタグ（例: ["gothic", "horror", "classic"]） */
  genre: string[];
  /** タグ（例: ["science-fiction", "romance"]） */
  tags: string[];
  /** 難易度（"easy" | "normal" | "hard"） */
  difficulty: "easy" | "normal" | "hard" | null;
  /** 語彙レベル（1-10、推定値） */
  vocabularyLevel?: number;
}

// ===========================
// URL検証の型
// ===========================

/**
 * URL検証結果
 */
export interface ValidationResult {
  /** 検証が成功したかどうか */
  isValid: boolean;
  /** エラーメッセージ（検証失敗時） */
  error?: string;
  /** 検証されたURL（正規化後） */
  normalizedUrl?: string;
  /** 検出されたサイトタイプ（例: "gutenberg"） */
  siteType?: "gutenberg";
  /** 抽出された作品ID */
  workId?: string;
}

// ===========================
// API リクエスト/レスポンスの型
// ===========================

/**
 * 作品登録APIリクエスト
 * POST /api/works
 */
export interface WorkRegistrationRequest {
  /** 作品のURL（Project Gutenberg等） */
  url: string;
  /** ジャンル（オプション、手動設定） */
  genre?: string[];
  /** 難易度（オプション、手動設定） */
  difficulty?: "easy" | "normal" | "hard";
  /** 自動翻訳を開始するかどうか */
  autoStartTranslation?: boolean;
}

/**
 * 作品登録APIレスポンス
 * POST /api/works
 */
export interface WorkRegistrationResponse {
  /** 登録された作品のID */
  id: string;
  /** 作品タイトル */
  title: string;
  /** 著者名 */
  author: string;
  /** 処理ステータス */
  status: "processing" | "completed" | "failed";
  /** 総章数 */
  chapterCount?: number;
  /** 総段落数 */
  paragraphCount?: number;
  /** エラーメッセージ（失敗時） */
  error?: string;
}

/**
 * 作品削除APIレスポンス
 * DELETE /api/works/:id
 */
export interface WorkDeletionResponse {
  /** 削除が成功したかどうか */
  success: boolean;
  /** 削除された作品のID */
  id: string;
  /** エラーメッセージ（失敗時） */
  error?: string;
}

/**
 * 作品一覧取得のクエリパラメータ
 * GET /api/works
 */
export interface WorkListQuery {
  /** 検索キーワード */
  search?: string;
  /** ジャンルフィルター */
  genre?: string[];
  /** 難易度フィルター */
  difficulty?: "easy" | "normal" | "hard";
  /** 翻訳ステータスフィルター */
  translationStatus?: "pending" | "in_progress" | "completed" | "failed";
  /** 並び替え順 */
  sortBy?: "title" | "author" | "createdAt" | "popularityScore";
  /** 昇順/降順 */
  sortOrder?: "asc" | "desc";
  /** ページ番号 */
  page?: number;
  /** ページあたりの件数 */
  limit?: number;
}

/**
 * 作品一覧APIレスポンス
 * GET /api/works
 */
export interface WorkListResponse {
  /** 作品リスト */
  works: WorkSummary[];
  /** 総件数 */
  total: number;
  /** 現在のページ */
  page: number;
  /** ページあたりの件数 */
  limit: number;
  /** 総ページ数 */
  totalPages: number;
}

/**
 * 作品サマリー（一覧表示用）
 */
export interface WorkSummary {
  /** 作品ID */
  id: string;
  /** タイトル */
  title: string;
  /** 著者 */
  author: string;
  /** 出版年 */
  publicationYear: number | null;
  /** ジャンル */
  genre: string[];
  /** 難易度 */
  difficulty: string | null;
  /** カバー画像URL */
  coverUrl: string | null;
  /** 翻訳ステータス */
  translationStatus: string;
  /** 翻訳進捗（0-100） */
  translationProgress: number;
  /** 作成日時 */
  createdAt: Date;
}

/**
 * 作品詳細APIレスポンス
 * GET /api/works/:id
 */
export interface WorkDetailResponse {
  /** 作品ID */
  id: string;
  /** タイトル */
  title: string;
  /** 著者 */
  author: string;
  /** 出版年 */
  publicationYear: number | null;
  /** パブリックドメインか */
  isPublicDomain: boolean;
  /** 言語 */
  language: string;
  /** ジャンル */
  genre: string[];
  /** タグ */
  tags: string[];
  /** 総単語数 */
  wordCount: number | null;
  /** 難易度 */
  difficulty: string | null;
  /** カバー画像URL */
  coverUrl: string | null;
  /** 出典URL */
  sourceUrl: string;
  /** ライセンス */
  license: string | null;
  /** 翻訳ステータス */
  translationStatus: string;
  /** 翻訳進捗 */
  translationProgress: number;
  /** 章リスト */
  chapters: ChapterSummary[];
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * 章サマリー（作品詳細内の章リスト用）
 */
export interface ChapterSummary {
  /** 章ID */
  id: string;
  /** 章番号 */
  chapterNumber: number;
  /** 章タイトル */
  title: string | null;
  /** 表示順序 */
  order: number;
  /** 段落数 */
  paragraphCount?: number;
}

// ===========================
// エラー型
// ===========================

/**
 * スクレイピングエラー
 */
export class ScrapingError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "ScrapingError";
  }
}

/**
 * パースエラー
 */
export class ParsingError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ParsingError";
  }
}

/**
 * 検証エラー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
