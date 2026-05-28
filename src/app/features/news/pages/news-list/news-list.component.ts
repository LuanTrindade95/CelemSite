import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NewsCategory, NewsItem } from '../../models/news-item.model';
import { NewsService } from '../../services/news.service';
import { CelemBadgeComponent } from '../../../../shared/components/celem-badge/celem-badge.component';
import { CelemButtonComponent } from '../../../../shared/components/celem-button/celem-button.component';
import { CelemCardComponent } from '../../../../shared/components/celem-card/celem-card.component';
import { CelemMediaPlaceholderComponent } from '../../../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../../../shared/components/celem-section/celem-section.component';
import { CelemSectionHeaderComponent } from '../../../../shared/components/celem-section-header/celem-section-header.component';

type NewsFilter = NewsCategory | 'all' | string;

@Component({
  selector: 'celem-news-list',
  standalone: true,
  imports: [
    RouterLink,
    CelemBadgeComponent,
    CelemButtonComponent,
    CelemCardComponent,
    CelemMediaPlaceholderComponent,
    CelemSectionComponent,
    CelemSectionHeaderComponent,
  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly newsService = inject(NewsService);

  protected readonly featured = signal<NewsItem | null>(null);
  protected readonly items = signal<NewsItem[]>([]);
  protected readonly categories = signal<NewsCategory[]>([]);
  protected readonly selectedCategory = signal<NewsFilter>('all');
  protected readonly loading = signal(true);

  protected readonly gridItems = computed(() => {
    const featuredSlug = this.featured()?.slug;
    return this.items().filter((item) => item.slug !== featuredSlug);
  });

  protected readonly isEmpty = computed(() => !this.loading() && this.items().length === 0);

  public ngOnInit(): void {
    this.newsService
      .getFeatured()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => this.featured.set(items[0] ?? null));

    this.newsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.categories.set(this.extractCategories(items));
      });

    this.selectCategory('all');
  }

  protected selectCategory(category: NewsFilter): void {
    this.selectedCategory.set(category);
    this.loading.set(true);

    this.newsService
      .list(category === 'all' ? undefined : { category })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.items.set(items);
        this.loading.set(false);
      });
  }

  protected categoryLabel(category: NewsCategory | string): string {
    const labels: Record<NewsCategory, string> = {
      update: 'Update',
      evento: 'Evento',
      changelog: 'Changelog',
      vrising: 'V Rising',
      servidor: 'Servidor',
    };

    return labels[category as NewsCategory] ?? category;
  }

  protected categoryTone(category: NewsCategory | string): 'neutral' | 'gold' | 'success' | 'warning' | 'danger' {
    const tones: Record<NewsCategory, 'neutral' | 'gold' | 'success' | 'warning' | 'danger'> = {
      update: 'gold',
      evento: 'success',
      changelog: 'neutral',
      vrising: 'danger',
      servidor: 'warning',
    };

    return tones[category as NewsCategory] ?? 'neutral';
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(value));
  }

  private extractCategories(items: NewsItem[]): NewsCategory[] {
    return Array.from(new Set(items.map((item) => item.category)));
  }
}
