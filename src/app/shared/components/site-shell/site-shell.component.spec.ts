import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteShellComponent } from './site-shell.component';
import { SiteAuthService } from '../../services/site-auth.service';

describe('SiteShellComponent', () => {
  let fixture: ComponentFixture<SiteShellComponent>;
  let authService: SiteAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteShellComponent],
    }).compileComponents();

    authService = TestBed.inject(SiteAuthService);
    fixture = TestBed.createComponent(SiteShellComponent);
    fixture.detectChanges();
  });

  it('renders the Reino Sagrado de Celem brand', () => {
    expect(fixture.nativeElement.textContent).toContain('Reino Sagrado de Celem');
  });

  it('renders the framed anonymous discord account state', () => {
    const anonymousAccount = fixture.nativeElement.querySelector('.discord-account--anonymous') as HTMLButtonElement | null;
    expect(anonymousAccount).not.toBeNull();
    expect(anonymousAccount?.textContent).toContain('DISCORD');

    const compactLoginButton = fixture.nativeElement.querySelector('.discord-button--compact') as HTMLButtonElement | null;
    expect(compactLoginButton).not.toBeNull();
    expect(compactLoginButton?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('opens the Discord confirmation modal before starting the login flow', () => {
    const beginDiscordLoginSpy = spyOn(authService, 'beginDiscordLogin').and.stub();
    authService.isLoading.set(false);
    fixture.detectChanges();

    const anonymousAccount = fixture.nativeElement.querySelector('.discord-account--anonymous') as HTMLButtonElement;
    anonymousAccount.click();
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('celem-discord-login-modal');
    const confirmButton = fixture.nativeElement.querySelector('.primary-button') as HTMLButtonElement;

    expect(modal).not.toBeNull();
    fixture.componentInstance['rememberSession'].set(false);
    fixture.detectChanges();
    confirmButton.click();

    expect(beginDiscordLoginSpy).toHaveBeenCalledOnceWith(false);
  });

  it('keeps the anonymous discord account state when the session has no guild membership', () => {
    authService.session.set({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        discordId: 'discord-1',
        displayName: 'Luan',
        avatarUrl: 'https://cdn.example/avatar.png',
      },
      memberships: [],
      isAdmin: false,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('DISCORD');
    expect(text).not.toContain('Luan');

    const authenticatedAccount = fixture.nativeElement.querySelector('.discord-account--authenticated');
    expect(authenticatedAccount).toBeNull();

    const anonymousAccount = fixture.nativeElement.querySelector('.discord-account--anonymous');
    expect(anonymousAccount).not.toBeNull();
  });

  it('renders the launcher-style discord account block for authenticated guild members', () => {
    authService.session.set({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        discordId: 'discord-1',
        displayName: 'Global User',
        avatarUrl: 'https://cdn.example/global-avatar.png',
      },
      memberships: [
        {
          guildId: 'guild-1',
          displayName: 'Luan',
          avatarUrl: 'https://cdn.example/guild-avatar.png',
          isMember: true,
          roleIds: [],
        },
      ],
      isAdmin: false,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Luan');
    expect(text).toContain('DISCORD');

    const authenticatedAccount = fixture.nativeElement.querySelector('.discord-account--authenticated');
    expect(authenticatedAccount).not.toBeNull();

    const logoutButton = fixture.nativeElement.querySelector('.ghost-inline') as HTMLButtonElement | null;
    expect(logoutButton).not.toBeNull();
    expect(logoutButton?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('prefers the guild membership display name and avatar for the authenticated header', () => {
    authService.session.set({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        discordId: 'discord-1',
        displayName: 'Global User',
        avatarUrl: 'https://cdn.example/global-avatar.png',
      },
      memberships: [
        {
          guildId: 'guild-1',
          displayName: 'Guild Nickname',
          avatarUrl: 'https://cdn.example/guild-avatar.png',
          isMember: true,
          roleIds: [],
        },
      ],
      isAdmin: false,
      preferredLanguageCode: 'english',
      languageOptions: [],
    });

    fixture.detectChanges();

    const authenticatedAccount = fixture.nativeElement.querySelector('.discord-account--authenticated') as HTMLElement | null;
    const avatar = fixture.nativeElement.querySelector('.discord-account-avatar img') as HTMLImageElement | null;

    expect(authenticatedAccount?.textContent).toContain('Guild Nickname');
    expect(authenticatedAccount?.textContent).not.toContain('Global User');
    expect(avatar?.getAttribute('src')).toBe('https://cdn.example/guild-avatar.png');
  });
});
