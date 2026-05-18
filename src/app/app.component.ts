import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SiteShellComponent } from './shared/components/site-shell/site-shell.component';
import { SiteAuthService } from './shared/services/site-auth.service';
import { SiteLanguageService } from './shared/services/site-language.service';

@Component({
  selector: 'celem-root',
  standalone: true,
  imports: [RouterOutlet, SiteShellComponent],
  template: `
    <celem-site-shell>
      <router-outlet />
    </celem-site-shell>
  `,
})
export class AppComponent {
  private readonly auth = inject(SiteAuthService);
  private readonly language = inject(SiteLanguageService);
  private readonly router = inject(Router);

  public constructor() {
    void this.initialize();

    effect(() => {
      const session = this.auth.session();
      if (session.isAuthenticated) {
        this.language.applySessionPreference(session.preferredLanguageCode);
      }
    });
  }

  private async initialize(): Promise<void> {
    if (await this.redirectHostedAuthCallback()) {
      return;
    }

    await this.auth.initializeSession();
  }

  private async redirectHostedAuthCallback(): Promise<boolean> {
    const requestUrl = new URL(window.location.href);
    if (!isHostedRootAuthCallback(requestUrl, document.baseURI)) {
      return false;
    }

    await this.router.navigateByUrl(`/auth/callback${requestUrl.search}`, { replaceUrl: true });
    return true;
  }
}

function isHostedRootAuthCallback(requestUrl: URL, baseUri: string): boolean {
  const requestPath = normalizePath(requestUrl.pathname);
  const basePath = normalizePath(new URL(baseUri).pathname);
  if (requestPath !== basePath) {
    return false;
  }

  return requestUrl.searchParams.has('code') || requestUrl.searchParams.has('error');
}

function normalizePath(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}
