export type NewsCategory = 'update' | 'evento' | 'changelog' | 'vrising' | 'servidor';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  publishedAt: string;
  excerpt: string;
  coverImage: string | null;
  readingTimeMin?: number;
  featured: boolean;
  body: string[];
}
