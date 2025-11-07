/**
 * URL検証ユーティリティ
 *
 * Project Gutenberg URLの検証とSSRF対策
 */

import { ValidationResult } from "../types/work";

/**
 * プライベートIPアドレスの範囲を定義
 */
const PRIVATE_IP_RANGES = [
  /^127\./, // 127.0.0.0/8 (loopback)
  /^10\./, // 10.0.0.0/8 (private)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 (private)
  /^192\.168\./, // 192.168.0.0/16 (private)
  /^169\.254\./, // 169.254.0.0/16 (link-local)
  /^0\./, // 0.0.0.0/8 (current network)
  /^::1$/, // IPv6 loopback
  /^fe80:/i, // IPv6 link-local
  /^fc00:/i, // IPv6 unique local
  /^fd00:/i, // IPv6 unique local
];

/**
 * Project Gutenberg URLの正規表現パターン
 * 例: https://www.gutenberg.org/cache/epub/84/pg84-images.html
 * 例: https://www.gutenberg.org/files/84/84-h/84-h.htm
 */
const GUTENBERG_URL_PATTERNS = [
  /^https?:\/\/(www\.)?gutenberg\.org\/cache\/epub\/(\d+)\/pg\d+-images\.html?$/i,
  /^https?:\/\/(www\.)?gutenberg\.org\/files\/(\d+)\/\d+-h\/\d+-h\.html?$/i,
  /^https?:\/\/(www\.)?gutenberg\.org\/ebooks\/(\d+)\.html\.images$/i,
];

/**
 * ホスト名がプライベートIPアドレスかどうかをチェック
 */
function isPrivateIP(hostname: string): boolean {
  // IPv4アドレスの場合
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return PRIVATE_IP_RANGES.some((pattern) => pattern.test(hostname));
  }

  // IPv6アドレスの場合
  if (hostname.includes(":")) {
    return PRIVATE_IP_RANGES.some((pattern) => pattern.test(hostname));
  }

  // localhost
  if (hostname === "localhost") {
    return true;
  }

  return false;
}

/**
 * Project Gutenberg URLを検証
 *
 * @param url - 検証するURL
 * @returns 検証結果
 *
 * @example
 * ```typescript
 * const result = validateGutenbergUrl("https://www.gutenberg.org/cache/epub/84/pg84-images.html");
 * if (result.isValid) {
 *   console.log("Valid URL:", result.normalizedUrl);
 * } else {
 *   console.error("Invalid URL:", result.error);
 * }
 * ```
 */
export function validateGutenbergUrl(url: string): ValidationResult {
  // 空文字チェック
  if (!url || url.trim().length === 0) {
    return {
      isValid: false,
      error: "URLが指定されていません",
    };
  }

  // URL形式の検証
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return {
      isValid: false,
      error: "URLの形式が無効です",
    };
  }

  // プロトコルの検証（http or https）
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      isValid: false,
      error: "HTTPまたはHTTPSプロトコルのみ対応しています",
    };
  }

  // ドメインの検証（gutenberg.orgのみ許可）
  const hostname = parsedUrl.hostname.toLowerCase();
  if (!hostname.endsWith("gutenberg.org") && hostname !== "gutenberg.org") {
    return {
      isValid: false,
      error:
        "Project Gutenberg (gutenberg.org) のURLのみ対応しています",
    };
  }

  // SSRF対策: プライベートIPアドレスのチェック
  if (isPrivateIP(hostname)) {
    return {
      isValid: false,
      error: "プライベートIPアドレスへのアクセスは許可されていません",
    };
  }

  // URL パターンの検証
  const urlString = parsedUrl.toString();
  let workId: string | undefined;

  for (const pattern of GUTENBERG_URL_PATTERNS) {
    const match = urlString.match(pattern);
    if (match) {
      // パターンの2番目のキャプチャグループが作品ID
      workId = match[2];
      break;
    }
  }

  if (!workId) {
    return {
      isValid: false,
      error:
        "サポートされているProject Gutenberg URLの形式ではありません。HTML形式のURLを指定してください（例: https://www.gutenberg.org/cache/epub/84/pg84-images.html）",
    };
  }

  // URLの正規化（httpをhttpsに変換）
  const normalizedUrl = urlString.replace(/^http:/, "https:");

  return {
    isValid: true,
    normalizedUrl,
    siteType: "gutenberg",
    workId,
  };
}

/**
 * URLが有効なProject Gutenberg URLかどうかをチェック（簡易版）
 *
 * @param url - チェックするURL
 * @returns 有効な場合はtrue
 */
export function isValidGutenbergUrl(url: string): boolean {
  const result = validateGutenbergUrl(url);
  return result.isValid;
}

/**
 * URLから作品IDを抽出
 *
 * @param url - Project Gutenberg URL
 * @returns 作品ID、抽出できない場合はnull
 *
 * @example
 * ```typescript
 * const workId = extractWorkId("https://www.gutenberg.org/cache/epub/84/pg84-images.html");
 * console.log(workId); // "84"
 * ```
 */
export function extractWorkId(url: string): string | null {
  const result = validateGutenbergUrl(url);
  return result.isValid && result.workId ? result.workId : null;
}
