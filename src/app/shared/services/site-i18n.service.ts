import { Injectable, computed, inject } from '@angular/core';
import { SiteTranslationDictionary, SiteTranslationKey, SITE_TRANSLATIONS } from '../i18n/site-translations';
import { SiteLanguageService } from './site-language.service';

@Injectable({ providedIn: 'root' })
export class SiteI18nService {
  private readonly language = inject(SiteLanguageService);

  private readonly dictionary = computed<SiteTranslationDictionary>(() => SITE_TRANSLATIONS[this.language.currentLanguage()]);

  public text(key: SiteTranslationKey): string {
    return this.dictionary()[key] ?? SITE_TRANSLATIONS.english[key] ?? key;
  }
}
