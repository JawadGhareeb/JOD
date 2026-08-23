export interface MobileArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  publishedAt: string | null;
  authorName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface ArticleParams { page?: number; perPage?: number; search?: string }
