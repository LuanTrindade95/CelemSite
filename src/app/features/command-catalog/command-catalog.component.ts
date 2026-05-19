import { Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, switchMap } from 'rxjs';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { CommandToolbarComponent } from './components/command-toolbar/command-toolbar.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
import { CommandCatalogFilters, CommandCatalogItem, ViewMode } from './models/command-catalog.models';
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
  imports: [FormsModule, CommandToolbarComponent, CommandCardComponent],
  templateUrl: './command-catalog.component.html',
  styleUrl: './command-catalog.component.scss',
})
export class CommandCatalogComponent {
  private readonly api = inject(CommandCatalogApiService);
  private readonly auth = inject(SiteAuthService);
  private readonly i18n = inject(SiteI18nService);
  private readonly language = inject(SiteLanguageService);
  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

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
  protected readonly viewMode = signal<ViewMode>('grid');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 6;
  protected readonly popularFilters: ReadonlyArray<
    | { labelKey: 'popularBank' | 'popularEconomy' | 'popularTeleports'; kind: 'query' }
    | { labelKey: 'popularAdmin' | 'popularPlayer'; kind: 'permission'; permission: 'admin' | 'player' }
  > = [
    { labelKey: 'popularBank', kind: 'query' },
    { labelKey: 'popularAdmin', kind: 'permission', permission: 'admin' },
    { labelKey: 'popularEconomy', kind: 'query' },
    { labelKey: 'popularTeleports', kind: 'query' },
    { labelKey: 'popularPlayer', kind: 'permission', permission: 'player' },
  ];
  protected readonly projects = computed(() => unique(this.commands().map((command) => command.projectName)));
  protected readonly permissions = computed(() => unique(this.commands().map((command) => command.category)));
  protected readonly filteredCommands = computed(() => filterAndSort(this.commands(), this.filters()));
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filteredCommands().length / this.pageSize)));
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index + 1),
  );
  protected readonly paginatedCommands = computed(() => {
    const page = Math.min(this.currentPage(), this.pageCount());
    const start = (page - 1) * this.pageSize;
    return this.filteredCommands().slice(start, start + this.pageSize);
  });
  protected readonly displayCategory = (category: string) =>
    normalizeCategory(category) === 'admin' ? this.text('adminCategory') : this.text('playerCategory');

  public constructor() {
    effect(() => {
      const pageCount = this.pageCount();
      if (this.currentPage() > pageCount) {
        this.currentPage.set(pageCount);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected handleSearchShortcut(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.key.toLowerCase() !== 'k' || (!event.ctrlKey && !event.metaKey)) {
      return;
    }

    if (isEditableTarget(event.target)) {
      return;
    }

    event.preventDefault();
    this.focusSearch();
  }

  protected updateQuery(query: string): void {
    this.updateFilters({
      ...this.filters(),
      query,
    });
  }

  protected updateFilters(filters: CommandCatalogFilters): void {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  protected applyPopularFilter(filter: typeof this.popularFilters[number]): void {
    if (filter.kind === 'permission') {
      this.updateFilters({
        ...this.filters(),
        permission: filter.permission,
      });
      return;
    }

    this.updateQuery(this.text(filter.labelKey));
  }

  protected isPopularFilterActive(filter: typeof this.popularFilters[number]): boolean {
    if (filter.kind === 'permission') {
      return normalizeCategory(this.filters().permission) === filter.permission;
    }

    return this.filters().query.trim().toLocaleLowerCase() === this.text(filter.labelKey).trim().toLocaleLowerCase();
  }

  protected updateViewMode(viewMode: ViewMode): void {
    this.viewMode.set(viewMode);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.pageCount() || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
  }

  protected resultsText(): string {
    return `${this.filteredCommands().length} ${this.text('resultsFound')}`;
  }

  private focusSearch(): void {
    queueMicrotask(() => this.searchInput?.nativeElement.focus());
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

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable;
}
