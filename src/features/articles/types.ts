export interface ArticleMedia {
  id?: string;
  prop?: string;
  url: string;
  position?: number | null;
}

export interface MobileArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  description?: string | null;
  status: string;
  publishedAt: string | null;
  authorName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  images?: string[];
  videos?: string[];
  media?: ArticleMedia[];
}

export interface ArticleParams {
  page?: number;
  perPage?: number;
  search?: string;
}
