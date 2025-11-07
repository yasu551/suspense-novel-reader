/**
 * ID生成ユーティリティ
 *
 * 章・段落のユニークIDを生成
 */

/**
 * 段落IDを生成
 *
 * 形式: work-{workId}/chapter-{chapterIndex}/paragraph-{paragraphIndex}
 *
 * @param workId - 作品ID
 * @param chapterIndex - 章のインデックス（1始まり）
 * @param paragraphIndex - 段落のインデックス（1始まり）
 * @returns 段落ID
 *
 * @example
 * ```typescript
 * const id = generateParagraphId("clx123abc", 1, 5);
 * console.log(id); // "work-clx123abc/chapter-1/paragraph-5"
 * ```
 */
export function generateParagraphId(
  workId: string,
  chapterIndex: number,
  paragraphIndex: number
): string {
  if (!workId || workId.trim().length === 0) {
    throw new Error("workIdが指定されていません");
  }

  if (chapterIndex < 1) {
    throw new Error("chapterIndexは1以上である必要があります");
  }

  if (paragraphIndex < 1) {
    throw new Error("paragraphIndexは1以上である必要があります");
  }

  return `work-${workId}/chapter-${chapterIndex}/paragraph-${paragraphIndex}`;
}

/**
 * 段落IDをパース
 *
 * @param paragraphId - 段落ID
 * @returns パースされた段落ID情報、無効な場合はnull
 *
 * @example
 * ```typescript
 * const parsed = parseParagraphId("work-clx123abc/chapter-1/paragraph-5");
 * if (parsed) {
 *   console.log(parsed.workId);         // "clx123abc"
 *   console.log(parsed.chapterIndex);   // 1
 *   console.log(parsed.paragraphIndex); // 5
 * }
 * ```
 */
export function parseParagraphId(paragraphId: string): {
  workId: string;
  chapterIndex: number;
  paragraphIndex: number;
} | null {
  const pattern = /^work-([^/]+)\/chapter-(\d+)\/paragraph-(\d+)$/;
  const match = paragraphId.match(pattern);

  if (!match) {
    return null;
  }

  return {
    workId: match[1],
    chapterIndex: parseInt(match[2], 10),
    paragraphIndex: parseInt(match[3], 10),
  };
}

/**
 * 章IDプレフィックスを生成
 *
 * 特定の章に属する段落をフィルタリングする際に使用
 *
 * @param workId - 作品ID
 * @param chapterIndex - 章のインデックス（1始まり）
 * @returns 章IDプレフィックス
 *
 * @example
 * ```typescript
 * const prefix = generateChapterPrefix("clx123abc", 1);
 * console.log(prefix); // "work-clx123abc/chapter-1/"
 *
 * // 使用例: Prismaでの段落フィルタリング
 * const paragraphs = await prisma.paragraph.findMany({
 *   where: {
 *     id: {
 *       startsWith: prefix
 *     }
 *   }
 * });
 * ```
 */
export function generateChapterPrefix(
  workId: string,
  chapterIndex: number
): string {
  if (!workId || workId.trim().length === 0) {
    throw new Error("workIdが指定されていません");
  }

  if (chapterIndex < 1) {
    throw new Error("chapterIndexは1以上である必要があります");
  }

  return `work-${workId}/chapter-${chapterIndex}/`;
}

/**
 * 作品IDプレフィックスを生成
 *
 * 特定の作品に属する段落をフィルタリングする際に使用
 *
 * @param workId - 作品ID
 * @returns 作品IDプレフィックス
 *
 * @example
 * ```typescript
 * const prefix = generateWorkPrefix("clx123abc");
 * console.log(prefix); // "work-clx123abc/"
 *
 * // 使用例: Prismaでの段落フィルタリング
 * const paragraphs = await prisma.paragraph.findMany({
 *   where: {
 *     id: {
 *       startsWith: prefix
 *     }
 *   }
 * });
 * ```
 */
export function generateWorkPrefix(workId: string): string {
  if (!workId || workId.trim().length === 0) {
    throw new Error("workIdが指定されていません");
  }

  return `work-${workId}/`;
}

/**
 * 段落IDが有効な形式かどうかをチェック
 *
 * @param paragraphId - チェックする段落ID
 * @returns 有効な形式の場合はtrue
 *
 * @example
 * ```typescript
 * console.log(isValidParagraphId("work-clx123abc/chapter-1/paragraph-5")); // true
 * console.log(isValidParagraphId("invalid-id"));                           // false
 * ```
 */
export function isValidParagraphId(paragraphId: string): boolean {
  return parseParagraphId(paragraphId) !== null;
}

/**
 * 段落IDのバッチ生成
 *
 * 複数の段落IDを一度に生成
 *
 * @param workId - 作品ID
 * @param chapterIndex - 章のインデックス（1始まり）
 * @param paragraphCount - 生成する段落ID数
 * @returns 段落IDの配列
 *
 * @example
 * ```typescript
 * const ids = generateParagraphIdBatch("clx123abc", 1, 3);
 * console.log(ids);
 * // [
 * //   "work-clx123abc/chapter-1/paragraph-1",
 * //   "work-clx123abc/chapter-1/paragraph-2",
 * //   "work-clx123abc/chapter-1/paragraph-3"
 * // ]
 * ```
 */
export function generateParagraphIdBatch(
  workId: string,
  chapterIndex: number,
  paragraphCount: number
): string[] {
  if (paragraphCount < 0) {
    throw new Error("paragraphCountは0以上である必要があります");
  }

  const ids: string[] = [];
  for (let i = 1; i <= paragraphCount; i++) {
    ids.push(generateParagraphId(workId, chapterIndex, i));
  }

  return ids;
}
