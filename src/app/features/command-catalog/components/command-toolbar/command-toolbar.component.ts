import { Component, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
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
  @Input() public canFilterByPermission = false;
  @Input({ required: true }) public displayCategory!: (category: string) => string;
  @Output() public filtersChange = new EventEmitter<CommandCatalogFilters>();

  public readonly isDrawerOpen = signal(false);
  public readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  @HostListener('document:keydown.escape')
  public closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  public update(partial: Partial<CommandCatalogFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...partial });
    this.closeDrawer();
  }

  public openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  public updateSortMode(sortMode: string): void {
    this.update({ sortMode: sortMode as SortMode });
  }
}
