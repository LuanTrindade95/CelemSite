import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SITE_API_ENDPOINTS } from '../config/site-api.config';
import { SITE_LANGUAGE_OPTIONS, SiteLanguageCode } from '../i18n/site-language';
import { ApiEnvelope } from '../../features/command-catalog/models/command-catalog.models';
import { environment } from '../../../environments/environment';

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

const DEFAULT_LOCAL_AUTH_BASE_URL = 'http://127.0.0.1:4201/';
const SUPPORTED_LOCAL_AUTH_PORTS = new Set(['4200', '4201']);

export function buildSiteAuthCallbackUrl(baseUri: string, redirectBaseUrl = environment.siteAuthRedirectBaseUrl): string {
  const currentUrl = new URL(baseUri);
  const callbackBaseUrl = isLocalHostName(currentUrl.hostname)
    ? resolveLocalAuthBaseUrl(currentUrl, redirectBaseUrl)
    : resolveConfiguredCallbackBaseUrl(baseUri, redirectBaseUrl);
  return new URL(environment.siteAuthCallbackPath, callbackBaseUrl).toString();
}

function resolveLocalAuthBaseUrl(currentUrl: URL, redirectBaseUrl: string): string {
  if (isSupportedLocalAuthPort(currentUrl.port)) {
    return buildLoopbackBaseUrl(currentUrl.port);
  }

  if (!redirectBaseUrl.trim().length) {
    return DEFAULT_LOCAL_AUTH_BASE_URL;
  }

  const configuredUrl = new URL(redirectBaseUrl);
  if (isLocalHostName(configuredUrl.hostname) && isSupportedLocalAuthPort(configuredUrl.port)) {
    return buildLoopbackBaseUrl(configuredUrl.port);
  }

  return DEFAULT_LOCAL_AUTH_BASE_URL;
}

function resolveConfiguredCallbackBaseUrl(baseUri: string, redirectBaseUrl: string): string {
  return redirectBaseUrl.trim().length > 0 ? redirectBaseUrl : baseUri;
}

function isLocalHostName(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isSupportedLocalAuthPort(port: string): boolean {
  return SUPPORTED_LOCAL_AUTH_PORTS.has(port);
}

function buildLoopbackBaseUrl(port: string): string {
  return `http://127.0.0.1:${port}/`;
}

export function buildSiteAuthLoginUrl(baseUri: string, redirectBaseUrl = environment.siteAuthRedirectBaseUrl): string {
  const currentUrl = new URL(baseUri);
  const callbackBaseUrl = isLocalHostName(currentUrl.hostname)
    ? resolveLocalAuthBaseUrl(currentUrl, redirectBaseUrl)
    : resolveConfiguredCallbackBaseUrl(baseUri, redirectBaseUrl);
  const redirectTo = new URL(environment.siteAuthCallbackPath, callbackBaseUrl).toString();
  const loginUrl = new URL(SITE_API_ENDPOINTS.siteAuthLogin, isLocalHostName(currentUrl.hostname) ? callbackBaseUrl : baseUri);
  loginUrl.searchParams.set('redirectTo', redirectTo);
  return loginUrl.toString();
}

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
    window.location.assign(buildSiteAuthLoginUrl(document.baseURI));
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
