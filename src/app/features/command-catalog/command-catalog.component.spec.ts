import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CommandCatalogComponent } from './command-catalog.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
import { CommandCatalogItem, isAdminAudienceVariant } from './models/command-catalog.models';
import { LOCAL_COMMAND_CATALOG } from './services/local-command-catalog';
import { SiteAuthService, SiteSessionPayload } from '../../shared/services/site-auth.service';
import { SiteLanguageService } from '../../shared/services/site-language.service';
import { SiteI18nService } from '../../shared/services/site-i18n.service';

describe('CommandCatalogComponent', () => {
  let fixture: ComponentFixture<CommandCatalogComponent>;
  const session = signal<SiteSessionPayload>({
    isAuthenticated: false,
    user: null,
    memberships: [],
    isAdmin: false,
    preferredLanguageCode: 'english' as const,
    languageOptions: [],
  });
  const currentLanguage = signal<'english'>('english');
  const loadCommands = jasmine.createSpy('loadCommands').and.callFake(() => of(session().isAuthenticated
    ? buildCommands('admin', 7)
    : buildCommands('player', 7)));

  beforeEach(async () => {
    session.set({
      isAuthenticated: false,
      user: null,
      memberships: [],
      isAdmin: false,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });
    currentLanguage.set('english');
    loadCommands.and.callFake(() => of(session().isAuthenticated
      ? buildCommands('admin', 7)
      : buildCommands('player', 7)));
    loadCommands.calls.reset();

    await TestBed.configureTestingModule({
      imports: [CommandCatalogComponent],
      providers: [
        {
          provide: CommandCatalogApiService,
          useValue: {
            loadCommands,
          },
        },
        {
          provide: SiteAuthService,
          useValue: {
            session,
          },
        },
        {
          provide: SiteLanguageService,
          useValue: {
            currentLanguage,
            getDisplayName: (languageCode: string) => languageCode,
          },
        },
        {
          provide: SiteI18nService,
          useValue: {
            text: (key: string) => key,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandCatalogComponent);
    fixture.detectChanges();
  });

  it('renders loaded commands', () => {
    expect(fixture.nativeElement.textContent).toContain('.player command 1');
  });

  it('hides admin audience variants from anonymous users before search and pagination', async () => {
    loadCommands.and.returnValue(of(buildAudienceVariantCommands()));
    fixture.destroy();
    fixture = TestBed.createComponent(CommandCatalogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('.bank balance');
    expect(text).toContain('Shows the current balance.');
    expect(text).not.toContain('.bank balance Luan');
    expect(text).not.toContain('.bank balance <player>');
    expect(text).not.toContain('Admin-only balance lookup.');
    expect(fixture.nativeElement.querySelectorAll('celem-command-card').length).toBe(1);

    const searchInput = fixture.nativeElement.querySelector('.hero-search__field input') as HTMLInputElement;
    searchInput.value = '.bank balance <player>';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('.bank balance <player>');
    expect(fixture.nativeElement.textContent).not.toContain('Admin-only balance lookup.');
    expect(fixture.nativeElement.querySelectorAll('celem-command-card').length).toBe(0);
  });

  it('renders player and admin audience variants for admins', async () => {
    loadCommands.and.returnValue(of(buildAudienceVariantCommands()));
    session.set({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        discordId: 'discord-1',
        displayName: 'Admin',
        avatarUrl: 'https://cdn.example/avatar.png',
      },
      memberships: [{
        guildId: 'guild-1',
        displayName: 'Admin',
        avatarUrl: 'https://cdn.example/avatar.png',
        isMember: true,
        roleIds: ['admin-role'],
      }],
      isAdmin: true,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });
    fixture.destroy();
    fixture = TestBed.createComponent(CommandCatalogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('.bank balance');
    expect(text).toContain('.bank balance Luan');
    expect(text).toContain('.bank balance <player>');
    expect(text).toContain('Admin-only balance lookup.');
    expect(fixture.nativeElement.querySelectorAll('celem-command-card').length).toBe(2);

    const cards = [...fixture.nativeElement.querySelectorAll('celem-command-card')] as HTMLElement[];
    expect(cards[0].textContent).toContain('.bank balance');
    expect(cards[0].textContent).not.toContain('.bank balance Luan');
    expect(cards[1].textContent).toContain('.bank balance Luan');
  });

  it('keeps local fallback player commands free of admin-only searchable text', () => {
    const fallbackText = LOCAL_COMMAND_CATALOG.filter((command) => !isAdminAudienceVariant(command)).flatMap((command) => [
      command.command,
      command.permission,
      command.description,
      command.usage,
      ...command.aliases,
      ...command.examples,
    ]).join(' ').toLocaleLowerCase();

    expect(fallbackText).not.toContain('[player...]');
    expect(fallbackText).not.toContain('<player>');
    expect(fallbackText).not.toContain('optional target requires admin');
    expect(fallbackText).not.toContain('for admins');
    expect(fallbackText).not.toContain('.bank balance luan');
    expect(fallbackText).not.toContain('admin');
  });

  it('keeps local fallback examples split by audience variant', () => {
    const balancePlayer = LOCAL_COMMAND_CATALOG.find((command) =>
      command.commandKey === 'celem-bank.account.balance' && command.audience === 'player');
    const balanceAdmin = LOCAL_COMMAND_CATALOG.find((command) =>
      command.commandKey === 'celem-bank.account.balance' && command.audience === 'admin');
    const adminOnly = LOCAL_COMMAND_CATALOG.find((command) =>
      command.commandKey === 'celem-bank.admin.reload' && command.audience === 'admin');

    expect(balancePlayer?.usage).toBe('.bank balance');
    expect(balancePlayer?.examples).toEqual(['.bank balance']);
    expect(balancePlayer?.isAdminVariant).toBeFalse();
    expect(balanceAdmin?.usage).toBe('.bank balance <player>');
    expect(balanceAdmin?.examples).toContain('.bank balance Luan');
    expect(balanceAdmin?.isAdminVariant).toBeTrue();
    expect(adminOnly?.command).toBe('.bank reload');
    expect(adminOnly?.isAdminVariant).toBeTrue();
  });

  it('reloads the catalog when the auth session changes during logout', async () => {
    loadCommands.and.returnValue(of(buildAudienceVariantCommands()));
    session.set({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        discordId: 'discord-1',
        displayName: 'Admin',
        avatarUrl: 'https://cdn.example/avatar.png',
      },
      memberships: [{
        guildId: 'guild-1',
        displayName: 'Admin',
        avatarUrl: 'https://cdn.example/avatar.png',
        isMember: true,
        roleIds: ['admin-role'],
      }],
      isAdmin: true,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('.bank balance <player>');
    expect(fixture.nativeElement.textContent).toContain('Admin-only balance lookup.');

    session.set({
      isAuthenticated: false,
      user: null,
      memberships: [],
      isAdmin: false,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('.bank balance');
    expect(fixture.nativeElement.textContent).not.toContain('.bank balance <player>');
    expect(fixture.nativeElement.textContent).not.toContain('Admin-only balance lookup.');
  });

  it('paginates the catalog with six cards per page', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('celem-command-card').length).toBe(6);
    expect(fixture.nativeElement.textContent).not.toContain('.player command 7');

    const pageButtons = [...fixture.nativeElement.querySelectorAll('.pagination button')] as HTMLButtonElement[];
    pageButtons.at(-1)?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('celem-command-card').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('.player command 7');
  });

  it('navigates with previous and next pagination arrows', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const arrowButtons = [...fixture.nativeElement.querySelectorAll('.pagination__arrow')] as HTMLButtonElement[];
    const previousButton = arrowButtons[0];
    const nextButton = arrowButtons[1];

    expect(previousButton.disabled).toBeTrue();
    expect(nextButton.disabled).toBeFalse();

    nextButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('.player command 7');
    expect(previousButton.disabled).toBeFalse();
    expect(nextButton.disabled).toBeTrue();

    previousButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('.player command 1');
    expect(fixture.nativeElement.textContent).not.toContain('.player command 7');
  });

  it('focuses the main search input when Ctrl+K is pressed', async () => {
    const searchInput = fixture.nativeElement.querySelector('.hero-search__field input') as HTMLInputElement;

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(searchInput);
  });
});

function buildCommands(category: 'admin' | 'player', count: number): CommandCatalogItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index + 1}`,
    projectSlug: 'celem-bank',
    projectName: 'CelemBank',
    category,
    command: `.${category} command ${index + 1}`,
    aliases: index % 2 === 0 ? [`.${category} alias ${index + 1}`] : [],
    permission: category === 'admin' ? 'Admin' : 'Player',
    description: `Shows ${category} command ${index + 1}.`,
    usage: `.${category} command ${index + 1}`,
    examples: [`example ${index + 1}`],
    language: 'english',
    sourcePath: `CelemBank/docs/${category}/commands-${index + 1}.md`,
    sortOrder: index + 1,
  }));
}

function buildAudienceVariantCommands(): CommandCatalogItem[] {
  return [
    {
      id: 'bank-balance',
      commandKey: 'bank.balance',
      projectSlug: 'celem-bank',
      projectName: 'CelemBank',
      audience: 'admin',
      variantLabel: 'Admin',
      isAdminVariant: true,
      category: 'Admin',
      command: '.bank balance Luan',
      aliases: [],
      permission: 'Admin',
      description: 'Admin-only balance lookup.',
      usage: '.bank balance <player>',
      examples: ['.bank balance Luan'],
      language: 'english',
      sourcePath: 'CelemBank/docs/admin/commands.md',
      sortOrder: 1,
    },
    {
      id: 'bank-balance',
      commandKey: 'bank.balance',
      projectSlug: 'celem-bank',
      projectName: 'CelemBank',
      audience: 'player',
      variantLabel: 'Player',
      isAdminVariant: false,
      category: 'Player',
      command: '.bank balance',
      aliases: ['.balance'],
      permission: 'Player; optional target requires admin',
      description: 'Shows the current balance.',
      usage: '.bank balance',
      examples: ['.bank balance'],
      language: 'english',
      sourcePath: 'CelemBank/docs/player/commands.md',
      sortOrder: 1,
    },
  ];
}
