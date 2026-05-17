import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SITE_API_ENDPOINTS } from '../config/site-api.config';
import { SITE_LANGUAGE_OPTIONS, SiteLanguageCode } from '../i18n/site-language';
import { ApiEnvelope } from '../../features/command-catalog/models/command-catalog.models';

export interface SiteSessionUser {
  id: string;
  discordId: string;
  displayName: string;
  avatarUrl: string;
}

export interface SiteSessionMembership {
  guildId: string;
  displayName: string;
  avatarUrl: string;
  isMember: boolean;
  roleIds: string[];
}

export interface SiteSessionPayload {
  isAuthenticated: boolean;
  user: SiteSessionUser | null;
  memberships: SiteSessionMembership[];
  isAdmin: boolean;
  preferredLanguageCode: SiteLanguageCode;
  languageOptions: ReadonlyArray<{ code: SiteLanguageCode; displayName: string }>;
}

const ANONYMOUS_SESSION: SiteSessionPayload = {
  isAuthenticated: false,
  user: null,
  memberships: [],
  isAdmin: false,
  preferredLanguageCode: 'english',
  languageOptions: SITE_LANGUAGE_OPTIONS,
};

@Injectable({ providedIn: 'root' })
export class SiteAuthService {
  private readonly http = inject(HttpClient);
  private initialized = false;

  public readonly session = signal<SiteSessionPayload>(ANONYMOUS_SESSION);
  public readonly isLoading = signal(true);

  public async initializeSession(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(this.http.get<ApiEnvelope<SiteSessionPayload>>(SITE_API_ENDPOINTS.siteSession, {
        withCredentials: true,
      }));
      this.session.set(response.success ? response.data : ANONYMOUS_SESSION);
    } catch {
      this.session.set(ANONYMOUS_SESSION);
    } finally {
      this.isLoading.set(false);
    }
  }

  public beginDiscordLogin(): void {
    const redirectTo = new URL('auth/callback', document.baseURI).toString();
    const target = `${SITE_API_ENDPOINTS.siteAuthLogin}?redirectTo=${encodeURIComponent(redirectTo)}`;
    window.location.assign(target);
  }

  public async exchangeDiscordCallback(code: string, state: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<ApiEnvelope<SiteSessionPayload>>(
        SITE_API_ENDPOINTS.siteAuthExchange,
        { code, state },
        { withCredentials: true },
      ));
      if (!response.success) {
        this.session.set(ANONYMOUS_SESSION);
        return false;
      }

      this.session.set(response.data);
      return true;
    } catch {
      this.session.set(ANONYMOUS_SESSION);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  public async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<ApiEnvelope<{ ok: boolean }>>(SITE_API_ENDPOINTS.siteLogout, {}, {
        withCredentials: true,
      }));
    } catch {
      // Intentionally ignore logout transport failures and clear local state.
    } finally {
      this.session.set(ANONYMOUS_SESSION);
    }
  }
}
