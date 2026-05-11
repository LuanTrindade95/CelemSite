import { Component, Input } from '@angular/core';
import { CommandCatalogItem } from '../../models/command-catalog.models';
import { HighlightSearchDirective } from '../../directives/highlight-search.directive';

@Component({
  selector: 'celem-command-card',
  standalone: true,
  imports: [HighlightSearchDirective],
  templateUrl: './command-card.component.html',
  styleUrl: './command-card.component.scss',
})
export class CommandCardComponent {
  @Input({ required: true }) public command!: CommandCatalogItem;
  @Input() public searchTerm = '';
}
