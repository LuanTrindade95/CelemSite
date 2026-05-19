import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, switchMap } from 'rxjs';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { CommandToolbarComponent } from './components/command-toolbar/command-toolbar.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
import { CommandCatalogFilters, CommandCatalogItem } from './models/command-catalog.models';
import { SiteAuthService, SiteSessionPayload } from '../../shared/services/site-auth.service';
import { SiteI18nService } from '../../shared/services/site-i18n.service';
import { SiteLanguageService } from '../../shared/services/site-language.service';

const INITIAL_FILTERS: CommandCatalogFilters = {
  query: '',
  project: '',
  permission: '',
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
  private readonly auth = inject(SiteAuthService);
  private readonly i18n = inject(SiteI18nService);
  private readonly language = inject(SiteLanguageService);

  protected readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);
  protected readonly commands = toSignal(
    toObservable(computed(() => ({
      languageCode: this.language.currentLanguage(),
      sessionKey: buildCatalogSessionKey(this.auth.session()),
    }))).pipe(
      distinctUntilChanged((left, right) =>
        left.languageCode === right.languageCode
        && left.sessionKey === right.sessionKey
      ),
      switchMap(({ languageCode }) => this.api.loadCommands(languageCode)),
    ),
    { initialValue: [] },
  );
  protected readonly filters = signal<CommandCatalogFilters>(INITIAL_FILTERS);
  protected readonly projects = computed(() => unique(this.commands().map((command) => command.projectName)));
  protected readonly permissions = computed(() => unique(this.commands().map((command) => command.category)));
  protected readonly filteredCommands = computed(() => filterAndSort(this.commands(), this.filters()));
  protected readonly visibleCount = computed(() => this.filteredCommands().length);
  protected readonly totalCount = computed(() => this.commands().length);
  protected readonly displayCategory = (category: string) =>
    normalizeCategory(category) === 'admin' ? this.text('adminCategory') : this.text('playerCategory');

  protected updateFilters(filters: CommandCatalogFilters): void {
    this.filters.set(filters);
  }
}

function filterAndSort(commands: CommandCatalogItem[], filters: CommandCatalogFilters): CommandCatalogItem[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return commands
    .filter((command) => !filters.project || command.projectName === filters.project)
    .filter((command) => !filters.permission || normalizeCategory(command.category) === normalizeCategory(filters.permission))
    .filter((command) => !query || searchableText(command).includes(query))
    .sort((left, right) => compareCommands(left, right, filters.sortMode));
}

function searchableText(command: CommandCatalogItem): string {
  return [
    command.projectName,
    normalizeCategory(command.category),
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
      return normalizeCategory(left.category).localeCompare(normalizeCategory(right.category)) || left.projectName.localeCompare(right.projectName);
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

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase();
}

function buildCatalogSessionKey(session: SiteSessionPayload): string {
  return JSON.stringify({
    isAuthenticated: session.isAuthenticated,
    userId: session.user?.id ?? '',
    isAdmin: session.isAdmin,
    memberships: session.memberships.map((membership) => ({
      guildId: membership.guildId,
      isMember: membership.isMember,
      roleIds: [...membership.roleIds].sort(),
    })),
  });
}
