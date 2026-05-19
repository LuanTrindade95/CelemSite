import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CommandCatalogComponent } from './command-catalog.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
import { CommandCatalogItem } from './models/command-catalog.models';
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

  it('reloads the catalog when the auth session changes during logout', async () => {
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

    expect(fixture.nativeElement.textContent).toContain('.admin command 1');

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

    expect(loadCommands).toHaveBeenCalledTimes(3);
    expect(fixture.nativeElement.textContent).toContain('.player command 1');
    expect(fixture.nativeElement.textContent).not.toContain('.admin command 1');
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
