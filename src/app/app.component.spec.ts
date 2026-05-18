import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AppComponent } from './app.component';
import { SiteAuthService } from './shared/services/site-auth.service';
import { SiteLanguageService } from './shared/services/site-language.service';

describe('AppComponent', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/context.html');
  });

  it('creates the application shell', async () => {
    const initializeSession = jasmine.createSpy().and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: SiteAuthService,
          useValue: {
            session: signal({
              isAuthenticated: false,
              user: null,
              memberships: [],
              isAdmin: false,
              preferredLanguageCode: 'english',
              languageOptions: [],
            }),
            initializeSession,
          },
        },
        {
          provide: SiteLanguageService,
          useValue: {
            applySessionPreference: () => undefined,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(initializeSession).toHaveBeenCalled();
  });

  it('routes hosted root OAuth callbacks to the callback route before session bootstrap', async () => {
    const initializeSession = jasmine.createSpy().and.returnValue(Promise.resolve());
    window.history.replaceState(null, '', '/context.html?code=test-code');

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: SiteAuthService,
          useValue: {
            session: signal({
              isAuthenticated: false,
              user: null,
              memberships: [],
              isAdmin: false,
              preferredLanguageCode: 'english',
              languageOptions: [],
            }),
            initializeSession,
          },
        },
        {
          provide: SiteLanguageService,
          useValue: {
            applySessionPreference: () => undefined,
          },
        },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalledWith('/auth/callback?code=test-code', { replaceUrl: true });
    expect(initializeSession).not.toHaveBeenCalled();
  });
});
