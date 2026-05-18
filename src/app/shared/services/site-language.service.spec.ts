import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SITE_API_ENDPOINTS } from '../config/site-api.config';
import { SiteAuthService, SiteSessionPayload } from './site-auth.service';
import { SiteI18nService } from './site-i18n.service';
import { SiteLanguageService } from './site-language.service';

describe('SiteLanguageService', () => {
  let service: SiteLanguageService;
  let i18n: SiteI18nService;
  let http: HttpTestingController;
  const session = signal<SiteSessionPayload>({
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

  beforeEach(() => {
    session.set({
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

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SiteAuthService,
          useValue: {
            session,
            updatePreferredLanguage: (languageCode: SiteSessionPayload['preferredLanguageCode']) => {
              session.update((current) => ({
                ...current,
                preferredLanguageCode: languageCode,
              }));
            },
          },
        },
      ],
    });

    service = TestBed.inject(SiteLanguageService);
    i18n = TestBed.inject(SiteI18nService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('applies the selected language immediately for authenticated users before the backend request completes', async () => {
    const pendingChange = service.setLanguage('brazilian', true);

    expect(service.currentLanguage()).toBe('brazilian');
    expect(session().preferredLanguageCode).toBe('brazilian');
    expect(i18n.text('language')).toBe('Idioma');

    const request = http.expectOne(SITE_API_ENDPOINTS.siteLanguage);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ languageCode: 'brazilian' });

    request.flush({
      success: true,
      data: { preferredLanguageCode: 'brazilian' },
      errors: [],
    });

    await pendingChange;
  });
});
