import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CommandCatalogComponent } from './command-catalog.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';
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
    ? [{
        id: 'admin',
        projectSlug: 'celem-bank',
        projectName: 'CelemBank',
        category: 'admin',
        command: '.bank admin',
        aliases: [],
        permission: 'Admin',
        description: 'Shows admin command.',
        usage: '.bank admin',
        examples: ['.bank admin'],
        language: 'english',
        sourcePath: 'CelemBank/docs/admin/commands.md',
        sortOrder: 1,
      }]
    : [{
        id: 'player',
        projectSlug: 'celem-bank',
        projectName: 'CelemBank',
        category: 'player',
        command: '.bank balance',
        aliases: [],
        permission: 'Player',
        description: 'Shows the balance.',
        usage: '.bank balance',
        examples: ['.bank balance'],
        language: 'english',
        sourcePath: 'CelemBank/docs/user/commands.md',
        sortOrder: 1,
      }]));

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
    expect(fixture.nativeElement.textContent).toContain('.bank balance');
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

    expect(fixture.nativeElement.textContent).toContain('.bank admin');

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
    expect(fixture.nativeElement.textContent).toContain('.bank balance');
    expect(fixture.nativeElement.textContent).not.toContain('.bank admin');
  });
});
