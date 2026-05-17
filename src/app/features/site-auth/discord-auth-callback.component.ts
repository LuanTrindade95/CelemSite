import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SiteAuthService } from '../../shared/services/site-auth.service';
import { SiteI18nService } from '../../shared/services/site-i18n.service';

@Component({
  selector: 'celem-discord-auth-callback',
  standalone: true,
  templateUrl: './discord-auth-callback.component.html',
  styleUrl: './discord-auth-callback.component.scss',
})
export class DiscordAuthCallbackComponent {
  private readonly auth = inject(SiteAuthService);
  private readonly i18n = inject(SiteI18nService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);
  protected readonly callbackError = computed(() => this.hasError() ? this.text('authErrorDescription') : '');

  public constructor() {
    void this.completeLogin();
  }

  protected goBack(): void {
    void this.router.navigateByUrl('/');
  }

  private async completeLogin(): Promise<void> {
    this.isLoading.set(true);
    const requestUrl = new URL(window.location.href);
    const code = requestUrl.searchParams.get('code')?.trim() ?? '';
    const state = requestUrl.searchParams.get('state')?.trim() ?? '';

    if (!code || !state) {
      this.hasError.set(true);
      this.isLoading.set(false);
      return;
    }

    const success = await this.auth.exchangeDiscordCallback(code, state);
    if (!success) {
      this.hasError.set(true);
      this.isLoading.set(false);
      return;
    }

    void this.router.navigateByUrl('/');
  }
}
