import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteTranslationKey } from '../../shared/i18n/site-translations';
import { SiteI18nService } from '../../shared/services/site-i18n.service';

@Component({
  selector: 'celem-under-construction-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './under-construction-page.component.html',
  styleUrl: './under-construction-page.component.scss',
})
export class UnderConstructionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(SiteI18nService);

  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  protected readonly text = (key: SiteTranslationKey) => this.i18n.text(key);
  protected readonly title = computed(() => this.text((this.routeData()['titleKey'] ?? 'navHome') as SiteTranslationKey));
}
