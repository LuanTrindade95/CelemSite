import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AppComponent } from './app.component';
import { SiteAuthService } from './shared/services/site-auth.service';
import { SiteLanguageService } from './shared/services/site-language.service';

describe('AppComponent', () => {
  it('creates the application shell', async () => {
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
            initializeSession: () => Promise.resolve(),
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
    expect(fixture.componentInstance).toBeTruthy();
  });
});
