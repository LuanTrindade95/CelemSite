import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiscordLoginModalComponent } from '../discord-login-modal/discord-login-modal.component';
import { SiteAuthService, SiteSessionPayload } from '../../services/site-auth.service';
import { SiteI18nService } from '../../services/site-i18n.service';
import { SiteLanguageService } from '../../services/site-language.service';

@Component({
  selector: 'celem-site-shell',
  standalone: true,
  imports: [FormsModule, DiscordLoginModalComponent],
  templateUrl: './site-shell.component.html',
  styleUrl: './site-shell.component.scss',
})
export class SiteShellComponent {
  private readonly auth = inject(SiteAuthService);
  private readonly i18n = inject(SiteI18nService);
  private readonly language = inject(SiteLanguageService);

  protected readonly session = this.auth.session;
  protected readonly isLoadingSession = this.auth.isLoading;
  protected readonly currentLanguage = this.language.currentLanguage;
  protected readonly languageOptions = this.language.options;
  protected readonly isLoginModalOpen = signal(false);
  protected readonly rememberSession = signal(true);
  protected readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);
  protected readonly headerProfile = (): { displayName: string; avatarUrl: string } | null => {
    const session = this.session();
    if (!session.user) {
      return null;
    }

    const primaryMembership = this.resolvePrimaryMembership(session);
    return primaryMembership
      ? {
          displayName: primaryMembership.displayName,
          avatarUrl: primaryMembership.avatarUrl,
        }
      : {
          displayName: session.user.displayName,
          avatarUrl: session.user.avatarUrl,
        };
  };

  protected async changeLanguage(languageCode: string): Promise<void> {
    await this.language.setLanguage(languageCode, this.session().isAuthenticated);
  }

  protected openLoginModal(): void {
    if (this.isLoadingSession()) {
      return;
    }

    this.isLoginModalOpen.set(true);
  }

  protected closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  protected updateRememberSession(rememberSession: boolean): void {
    this.rememberSession.set(rememberSession);
  }

  protected confirmLogin(): void {
    this.closeLoginModal();
    this.auth.beginDiscordLogin(this.rememberSession());
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
  }

  private resolvePrimaryMembership(session: SiteSessionPayload) {
    return session.memberships.find((membership) => membership.isMember) ?? null;
  }
}
