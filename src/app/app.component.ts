import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  public constructor() {
    void this.auth.initializeSession();

    effect(() => {
      const session = this.auth.session();
      if (session.isAuthenticated) {
        this.language.applySessionPreference(session.preferredLanguageCode);
      }
    });
  }
}
