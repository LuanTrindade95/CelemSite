import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommandCatalogFilters, SortMode } from '../../models/command-catalog.models';
import { SiteI18nService } from '../../../../shared/services/site-i18n.service';

@Component({
  selector: 'celem-command-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './command-toolbar.component.html',
  styleUrl: './command-toolbar.component.scss',
})
export class CommandToolbarComponent {
  private readonly i18n = inject(SiteI18nService);

  @Input({ required: true }) public filters!: CommandCatalogFilters;
  @Input({ required: true }) public projects: string[] = [];
  @Input({ required: true }) public permissions: string[] = [];
  @Input({ required: true }) public languages: string[] = [];
  @Input({ required: true }) public displayLanguage!: (languageCode: string) => string;
  @Input({ required: true }) public displayCategory!: (category: string) => string;
  @Output() public filtersChange = new EventEmitter<CommandCatalogFilters>();

  public readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  public update(partial: Partial<CommandCatalogFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...partial });
  }

  public updateSortMode(sortMode: string): void {
    this.update({ sortMode: sortMode as SortMode });
  }
}
