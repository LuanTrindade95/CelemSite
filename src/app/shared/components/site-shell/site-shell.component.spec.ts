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

  it('renders the launcher-style discord account block for authenticated users', () => {
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
    expect(text).toContain('Luan');
    expect(text).toContain('DISCORD');

    const logoutButton = fixture.nativeElement.querySelector('.ghost-inline') as HTMLButtonElement | null;
    expect(logoutButton).not.toBeNull();
    expect(logoutButton?.textContent?.trim().length).toBeGreaterThan(0);
  });
});
