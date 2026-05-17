import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SITE_API_ENDPOINTS } from '../config/site-api.config';
import { normalizeSiteLanguageCode, SITE_LANGUAGE_OPTIONS, SiteLanguageCode } from '../i18n/site-language';
import { ApiEnvelope } from '../../features/command-catalog/models/command-catalog.models';

const STORAGE_KEY = 'celem.site.language';
const COOKIE_KEY = 'celem_site_lang';

@Injectable({ providedIn: 'root' })
export class SiteLanguageService {
  private readonly http = inject(HttpClient);

  public readonly options = SITE_LANGUAGE_OPTIONS;
  public readonly currentLanguage = signal<SiteLanguageCode>(this.resolveInitialLanguage());

  public getDisplayName(languageCode: string): string {
    return this.options.find((option) => option.code === languageCode)?.displayName ?? languageCode;
  }

  public applySessionPreference(languageCode: string): void {
    const normalized = normalizeSiteLanguageCode(languageCode, this.currentLanguage());
    this.persistLocal(normalized);
    this.currentLanguage.set(normalized);
  }

  public async setLanguage(languageCode: string, isAuthenticated: boolean): Promise<void> {
    const normalized = normalizeSiteLanguageCode(languageCode, this.currentLanguage());
    this.persistLocal(normalized);
    this.currentLanguage.set(normalized);

    if (!isAuthenticated) {
      return;
    }

    try {
      await firstValueFrom(this.http.post<ApiEnvelope<{ preferredLanguageCode: SiteLanguageCode }>>(
        SITE_API_ENDPOINTS.siteLanguage,
        { languageCode: normalized },
        { withCredentials: true },
      ));
    } catch {
      // Keep local preference even if the remote preference update fails.
    }
  }

  private resolveInitialLanguage(): SiteLanguageCode {
    const storageValue = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const cookieValue = this.readCookie(COOKIE_KEY);
    const browserValue = typeof navigator !== 'undefined' ? navigator.language : null;
    return normalizeSiteLanguageCode(storageValue ?? cookieValue ?? browserValue, 'english');
  }

  private persistLocal(languageCode: SiteLanguageCode): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, languageCode);
    }

    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_KEY}=${encodeURIComponent(languageCode)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  }

  private readCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const prefix = `${name}=`;
    for (const segment of document.cookie.split(';')) {
      const trimmed = segment.trim();
      if (trimmed.startsWith(prefix)) {
        return decodeURIComponent(trimmed.slice(prefix.length));
      }
    }

    return null;
  }
}
