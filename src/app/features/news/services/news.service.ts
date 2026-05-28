import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { NewsCategory, NewsItem } from '../models/news-item.model';

// Implementacao placeholder; trocar por client Supabase mantendo a mesma assinatura.
const PLACEHOLDER_NEWS: NewsItem[] = [
  {
    id: 'news-001',
    slug: 'interface-preview-reino',
    title: 'Preview placeholder da Interface',
    category: 'update',
    publishedAt: '2026-05-18T12:00:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interface em destaque para o ecossistema.',
    coverImage: null,
    readingTimeMin: 3,
    featured: true,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus mantém o foco em clareza e contexto.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Este conteúdo é placeholder.',
    ],
  },
  {
    id: 'news-002',
    slug: 'evento-comunidade-maio',
    title: 'Evento placeholder da comunidade',
    category: 'evento',
    publishedAt: '2026-05-10T18:30:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Registro visual para eventos futuros.',
    coverImage: null,
    readingTimeMin: 2,
    featured: true,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A estrutura futura deve receber conteúdo editorial real.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    ],
  },
  {
    id: 'news-003',
    slug: 'changelog-launcher-placeholder',
    title: 'Changelog placeholder do Launcher',
    category: 'changelog',
    publishedAt: '2026-04-28T09:00:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Notas futuras entram neste formato.',
    coverImage: null,
    readingTimeMin: 4,
    featured: false,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Changelogs devem manter linguagem objetiva.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ],
  },
  {
    id: 'news-004',
    slug: 'vrising-sistemas-placeholder',
    title: 'Notas placeholder sobre V Rising',
    category: 'vrising',
    publishedAt: '2026-04-12T15:15:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Espaço para notas sobre o jogo.',
    coverImage: null,
    readingTimeMin: 5,
    featured: false,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Este corpo será substituído por notícias reais.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    id: 'news-005',
    slug: 'servidor-operacao-placeholder',
    title: 'Operação placeholder do servidor',
    category: 'servidor',
    publishedAt: '2026-03-30T20:00:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atualizações operacionais entram aqui.',
    coverImage: null,
    readingTimeMin: 3,
    featured: false,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. O status real do servidor não está integrado nesta fase.',
      'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.',
    ],
  },
  {
    id: 'news-006',
    slug: 'update-identidade-placeholder',
    title: 'Update placeholder de identidade',
    category: 'update',
    publishedAt: '2026-03-18T11:45:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Identidade visual e assets entram depois.',
    coverImage: null,
    readingTimeMin: 2,
    featured: false,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A notícia real deve trocar texto e mídia placeholder.',
      'Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.',
    ],
  },
  {
    id: 'news-007',
    slug: 'evento-beta-placeholder',
    title: 'Convite placeholder para beta',
    category: 'evento',
    publishedAt: '2026-02-22T14:20:00.000Z',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Chamadas futuras para testes ficam neste fluxo.',
    coverImage: null,
    readingTimeMin: 3,
    featured: false,
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. O calendário real será definido em fase editorial.',
      'Aenean commodo ligula eget dolor. Aenean massa.',
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public list(filter?: { category?: NewsCategory | string }): Observable<NewsItem[]> {
    return of(PLACEHOLDER_NEWS).pipe(
      delay(150),
      map((items) => {
        if (!filter?.category) {
          return items;
        }

        return items.filter((item) => item.category === filter.category);
      }),
    );
  }

  public getFeatured(): Observable<NewsItem[]> {
    return this.list().pipe(map((items) => items.filter((item) => item.featured)));
  }

  public getRecent(limit: number): Observable<NewsItem[]> {
    return this.list().pipe(
      map((items) =>
        [...items]
          .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
          .slice(0, limit),
      ),
    );
  }

  public getBySlug(slug: string): Observable<NewsItem | undefined> {
    return this.list().pipe(map((items) => items.find((item) => item.slug === slug)));
  }
}
