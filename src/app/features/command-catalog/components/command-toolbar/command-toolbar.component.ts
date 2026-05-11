import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommandCatalogFilters, SortMode } from '../../models/command-catalog.models';

@Component({
  selector: 'celem-command-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './command-toolbar.component.html',
  styleUrl: './command-toolbar.component.scss',
})
export class CommandToolbarComponent {
  @Input({ required: true }) public filters!: CommandCatalogFilters;
  @Input({ required: true }) public projects: string[] = [];
  @Input({ required: true }) public permissions: string[] = [];
  @Input({ required: true }) public languages: string[] = [];
  @Output() public filtersChange = new EventEmitter<CommandCatalogFilters>();

  public update(partial: Partial<CommandCatalogFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...partial });
  }

  public updateSortMode(sortMode: string): void {
    this.update({ sortMode: sortMode as SortMode });
  }
}
