import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { NewsCategory, NewsItem } from '../../models/news-item.model';
import { NewsService } from '../../services/news.service';
import { CelemBadgeComponent } from '../../../../shared/components/celem-badge/celem-badge.component';
import { CelemButtonComponent } from '../../../../shared/components/celem-button/celem-button.component';
import { CelemMediaPlaceholderComponent } from '../../../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-news-detail',
  standalone: true,
  imports: [RouterLink, CelemBadgeComponent, CelemButtonComponent, CelemMediaPlaceholderComponent, CelemSectionComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly newsService = inject(NewsService);
  private readonly route = inject(ActivatedRoute);

  protected readonly item = signal<NewsItem | null>(null);
  protected readonly loading = signal(true);

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('slug') ?? ''),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.item.set(null);
        }),
        switchMap((slug) => this.newsService.getBySlug(slug)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((item) => {
        this.item.set(item ?? null);
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
}
