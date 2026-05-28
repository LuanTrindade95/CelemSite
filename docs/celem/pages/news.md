# Celem News

Branch: `feat/celem-news`

## Routes

| Route | Component | State |
|---|---|---|
| `/news` | `NewsListComponent` | ⏳ shell |
| `/news/:slug` | `NewsDetailComponent` | ⏳ shell |

Decision: `/news` was not present on the `main` base used for N1, so the static route was added before `news/:slug`.

## NewsItem Model

Path: `src/app/features/news/models/news-item.model.ts`

```ts
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
```

## NewsService

Path: `src/app/features/news/services/news.service.ts`

Service placeholder, swap-ready para Supabase.

| Method | Return | Purpose |
|---|---|---|
| `list(filter?: { category?: NewsCategory | string })` | `Observable<NewsItem[]>` | Lists placeholder news, optionally filtered by category |
| `getFeatured()` | `Observable<NewsItem[]>` | Lists featured placeholder news |
| `getBySlug(slug: string)` | `Observable<NewsItem \| undefined>` | Finds one placeholder item by slug |

Implementation note: current data is an in-memory array with symbolic `delay(150)`. Future Supabase integration should preserve the public service signature.

## Phase State

| Phase | State |
|---|---|
| N1 model/service/routes/shells | ✓ scaffold |
| N2 listagem | ✓ destaque, filtro, grid e estados |

## Listagem N2

- Header uses `CelemSectionHeader` with eyebrow `NOVIDADES` and title `Notícias`.
- Featured block consumes `NewsService.getFeatured()` and links to `/news/:slug`.
- Category filters are generated from categories present in `NewsService.list()` data.
- Filter calls `NewsService.list({ category })` and updates the list asynchronously.
- Grid uses `CelemCard`, `CelemBadge`, and `CelemMediaPlaceholder`, with 3 columns on desktop, 2 on tablet, and 1 on mobile.
- Loading state renders skeleton placeholders while the service delay resolves.
- Empty state renders when a selected category has no items.
- Pagination and "carregar mais" remain out of scope for N2.
