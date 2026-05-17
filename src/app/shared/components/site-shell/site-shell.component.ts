import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteAuthService } from '../../services/site-auth.service';
import { SiteI18nService } from '../../services/site-i18n.service';
import { SiteLanguageService } from '../../services/site-language.service';

@Component({
  selector: 'celem-site-shell',
  standalone: true,
  imports: [FormsModule],
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
  protected readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  protected async changeLanguage(languageCode: string): Promise<void> {
    await this.language.setLanguage(languageCode, this.session().isAuthenticated);
  }

  protected login(): void {
    this.auth.beginDiscordLogin();
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
  }
}
