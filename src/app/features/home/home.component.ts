import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NewsCategory, NewsItem } from '../news/models/news-item.model';
import { NewsService } from '../news/services/news.service';
import { CelemBadgeComponent } from '../../shared/components/celem-badge/celem-badge.component';
import { CelemButtonComponent } from '../../shared/components/celem-button/celem-button.component';
import { CelemCardComponent } from '../../shared/components/celem-card/celem-card.component';
import { CelemMediaPlaceholderComponent } from '../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';
import { CelemSectionHeaderComponent } from '../../shared/components/celem-section-header/celem-section-header.component';

@Component({
  selector: 'celem-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly newsService = inject(NewsService);

  protected readonly recentNews = signal<NewsItem[]>([]);

  public ngOnInit(): void {
    this.newsService
      .getRecent(3)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => this.recentNews.set(items));
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
}
