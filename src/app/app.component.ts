import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteShellComponent } from './shared/components/site-shell/site-shell.component';

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
export class AppComponent {}
