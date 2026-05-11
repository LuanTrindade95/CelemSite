import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { CommandToolbarComponent } from './components/command-toolbar/command-toolbar.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
import { CommandCatalogFilters, CommandCatalogItem } from './models/command-catalog.models';

const INITIAL_FILTERS: CommandCatalogFilters = {
  query: '',
  project: '',
  permission: '',
  language: '',
  sortMode: 'project',
};

@Component({
  selector: 'celem-command-catalog',
  standalone: true,
  imports: [CommandToolbarComponent, CommandCardComponent],
  templateUrl: './command-catalog.component.html',
  styleUrl: './command-catalog.component.scss',
})
export class CommandCatalogComponent {
  private readonly api = inject(CommandCatalogApiService);

  protected readonly commands = toSignal(this.api.loadCommands(), { initialValue: [] });
  protected readonly filters = signal<CommandCatalogFilters>(INITIAL_FILTERS);
  protected readonly projects = computed(() => unique(this.commands().map((command) => command.projectName)));
  protected readonly permissions = computed(() => unique(this.commands().map((command) => command.category)));
  protected readonly languages = computed(() => unique(this.commands().map((command) => command.language)));
  protected readonly filteredCommands = computed(() => filterAndSort(this.commands(), this.filters()));
  protected readonly visibleCount = computed(() => this.filteredCommands().length);
  protected readonly totalCount = computed(() => this.commands().length);

  protected updateFilters(filters: CommandCatalogFilters): void {
    this.filters.set(filters);
  }
}

function filterAndSort(commands: CommandCatalogItem[], filters: CommandCatalogFilters): CommandCatalogItem[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return commands
    .filter((command) => !filters.project || command.projectName === filters.project)
    .filter((command) => !filters.permission || command.category === filters.permission)
    .filter((command) => !filters.language || command.language === filters.language)
    .filter((command) => !query || searchableText(command).includes(query))
    .sort((left, right) => compareCommands(left, right, filters.sortMode));
}

function searchableText(command: CommandCatalogItem): string {
  return [
    command.projectName,
    command.category,
    command.command,
    command.permission,
    command.description,
    command.usage,
    command.language,
    command.sourcePath,
    ...command.aliases,
    ...command.examples,
  ].join(' ').toLocaleLowerCase();
}

function compareCommands(left: CommandCatalogItem, right: CommandCatalogItem, sortMode: CommandCatalogFilters['sortMode']): number {
  switch (sortMode) {
    case 'command':
      return left.command.localeCompare(right.command);
    case 'permission':
      return left.category.localeCompare(right.category) || left.projectName.localeCompare(right.projectName);
    case 'language':
      return left.language.localeCompare(right.language) || left.projectName.localeCompare(right.projectName);
    case 'project':
    default:
      return left.projectName.localeCompare(right.projectName) || left.sortOrder - right.sortOrder || left.command.localeCompare(right.command);
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}
