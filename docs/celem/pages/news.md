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
| `getRecent(limit: number)` | `Observable<NewsItem[]>` | Lists the most recent news by `publishedAt`, limited to the requested count |
| `getBySlug(slug: string)` | `Observable<NewsItem \| undefined>` | Finds one placeholder item by slug |

Implementation note: current data is an in-memory array with symbolic `delay(150)`. Future Supabase integration should preserve the public service signature.

## Phase State

| Phase | State |
|---|---|
| N1 model/service/routes/shells | ✓ scaffold |
| N2 listagem | ✓ destaque, filtro, grid e estados |
| N3 detalhe | ✓ cabeçalho, cover, corpo, voltar e not-found |
| N4 integração Home | ✓ NewsService + checklist Supabase |
| N5 polish final | ✓ responsividade, motion e a11y |

## Listagem N2

- Header uses `CelemSectionHeader` with eyebrow `NOVIDADES` and title `Notícias`.
- Featured block consumes `NewsService.getFeatured()` and links to `/news/:slug`.
- Category filters are generated from categories present in `NewsService.list()` data.
- Filter calls `NewsService.list({ category })` and updates the list asynchronously.
- Grid uses `CelemCard`, `CelemBadge`, and `CelemMediaPlaceholder`, with 3 columns on desktop, 2 on tablet, and 1 on mobile.
- Loading state renders skeleton placeholders while the service delay resolves.
- Empty state renders when a selected category has no items.
- Pagination and "carregar mais" remain out of scope for N2.

## Detalhe N3

- Detail route reads `slug` from `ActivatedRoute` and calls `NewsService.getBySlug(slug)`.
- Article header renders `CelemBadge`, `h1`, formatted date, and optional reading time.
- Cover uses `CelemMediaPlaceholder ratio="16:9"` with placeholder label when `coverImage` is empty.
- Body renders the `body: string[]` array as plain text paragraphs, with controlled reading measure.
- Navigation uses `CelemButton variant="ghost"` back to `/news`.
- Not-found state handles unknown slugs without breaking the app and includes a CTA back to `/news`.
- "Leia também" remains out of scope for N3.

## Integração Home N4

- Home news preview consumes `NewsService.getRecent(3)`.
- Home cards link to `/news/:slug`.
- Home CTA `Ver todas as notícias` remains linked to `/news`.
- All current News UI reads through `NewsService`; components do not import placeholder data directly.

## Polish N5

- Notícias concluída para a fundação atual, com dados e mídia placeholder.
- Listagem validada em mobile, tablet e desktop: destaque, filtros e grid colapsam sem overflow.
- Detalhe validado em mobile, tablet e desktop: largura de leitura controlada, cover proporcional e ordem de leitura preservada.
- Filtros usam botões com `aria-pressed`, foco dourado visível e rótulos de categoria.
- Cards da listagem são links navegáveis por teclado com foco dourado visível e `aria-label` descritivo.
- Detalhe mantém um único `h1` no artigo ou no estado not-found, com CTA de retorno para `/news`.
- Badges de categoria e datas seguem o mesmo mapeamento visual e formatação entre Home, listagem e detalhe.
- Motion permanece no orçamento do kit: transições de 160ms, hover lift sutil e fallback para `prefers-reduced-motion`.

## Pendências

- Substituir títulos, resumos e corpos placeholder por conteúdo editorial real.
- Substituir covers/placeholders por imagens reais otimizadas.
- Executar o swap interno do `NewsService` para Supabase mantendo a assinatura pública.
- Implementar estado de erro de API junto ao swap Supabase.
- Avaliar paginação ou "carregar mais" quando o volume real de notícias justificar.

## Supabase Swap Checklist

Service placeholder, swap-ready para Supabase.

1. Create a `news` table with columns that map to `NewsItem`: `id`, `slug`, `title`, `category`, `published_at`, `excerpt`, `cover_image`, `reading_time_min`, `featured`, and `body`.
2. Keep the public `NewsService` methods unchanged: `list`, `getFeatured`, `getRecent`, and `getBySlug`.
3. Replace the in-memory `PLACEHOLDER_NEWS` reads inside `NewsService` with Supabase queries.
4. Map Supabase snake_case columns to the `NewsItem` camelCase model at the service boundary.
5. Preserve async return types as `Observable<...>` so Home, list, and detail components need no changes.
6. Keep category values aligned with `NewsCategory`: `update`, `evento`, `changelog`, `vrising`, `servidor`.
