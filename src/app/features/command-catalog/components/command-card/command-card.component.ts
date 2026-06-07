import { Component, Input, inject, signal } from '@angular/core';
import {
  CommandCatalogItem,
  ViewMode,
  normalizeCommandAudience,
  resolveCommandAudience,
} from '../../models/command-catalog.models';
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
  @Input() public viewMode: ViewMode = 'grid';

  public readonly copied = signal(false);
  public readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  public displayLanguage(languageCode: string): string {
    return this.language.getDisplayName(languageCode);
  }

  public displayPermission(): string {
    const audience = resolveCommandAudience(this.command);
    const explicitAudience = normalizeCommandAudience(this.command.audience);
    const variantAudience = normalizeCommandAudience(this.command.variantLabel);

    if (!explicitAudience && !variantAudience && this.command.variantLabel?.trim()) {
      return this.command.variantLabel;
    }

    if (audience === 'admin') {
      return this.text('adminCategory');
    }

    return this.text('playerCategory');
  }

  public isAdminVariant(): boolean {
    return resolveCommandAudience(this.command) === 'admin';
  }

  public metadataCountLabel(): string | null {
    if (this.command.aliases.length > 0) {
      return `${this.command.aliases.length} ${this.text('aliasesCount')}`;
    }

    if (this.command.examples.length > 0) {
      return `${this.command.examples.length} ${this.text('examplesCount')}`;
    }

    return null;
  }

  public async copyPrimaryUsage(): Promise<void> {
    const textToCopy = this.command.usage || this.command.command;
    if (!globalThis.navigator?.clipboard?.writeText) {
      return;
    }

    await globalThis.navigator.clipboard.writeText(textToCopy);
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1400);
  }
}
