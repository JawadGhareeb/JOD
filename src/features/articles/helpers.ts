import type { MobileArticle } from "./types";

export function getArticleImageUrl(article: MobileArticle): string | null {
  const directImage = article.images?.find((url) => Boolean(url?.trim()));
  if (directImage) return directImage;

  const mediaImage = [...(article.media ?? [])]
    .filter((item) => !item.prop || item.prop === "images")
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .find((item) => Boolean(item.url?.trim()))?.url;
  if (mediaImage) return mediaImage;

  const htmlImage = article.content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (htmlImage) return htmlImage;

  const markdownImage = article.content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/i)?.[1];
  return markdownImage ?? null;
}

export function getArticlePreviewText(article: MobileArticle): string {
  const source = article.excerpt?.trim() || article.description?.trim() || article.content;
  return source
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
