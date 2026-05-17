import { Component, Input, inject } from '@angular/core';
import { CommandCatalogItem } from '../../models/command-catalog.models';
import { HighlightSearchDirective } from '../../directives/highlight-search.directive';
import { SiteI18nService } from '../../../../shared/services/site-i18n.service';
import { SiteLanguageService } from '../../../../shared/services/site-language.service';

@Component({
  selector: 'celem-command-card',
  standalone: true,
  imports: [HighlightSearchDirective],
  templateUrl: './command-card.component.html',
  styleUrl: './command-card.component.scss',
})
export class CommandCardComponent {
  private readonly i18n = inject(SiteI18nService);
  private readonly language = inject(SiteLanguageService);

  @Input({ required: true }) public command!: CommandCatalogItem;
  @Input() public searchTerm = '';

  public readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  public displayLanguage(languageCode: string): string {
    return this.language.getDisplayName(languageCode);
  }
}
