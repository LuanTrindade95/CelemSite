import { Routes } from '@angular/router';
import { CommandCatalogComponent } from './features/command-catalog/command-catalog.component';
import { DiscordAuthCallbackComponent } from './features/site-auth/discord-auth-callback.component';
import { UnderConstructionPageComponent } from './features/static-page/under-construction-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CommandCatalogComponent,
  },
  {
    path: 'commands',
    component: CommandCatalogComponent,
  },
  {
    path: 'launcher',
    component: UnderConstructionPageComponent,
    data: {
      titleKey: 'navLauncher',
    },
  },
  {
    path: 'interface',
    component: UnderConstructionPageComponent,
    data: {
      titleKey: 'navInterface',
    },
  },
  {
    path: 'about',
    component: UnderConstructionPageComponent,
    data: {
      titleKey: 'navAbout',
    },
  },
  {
    path: 'auth/callback',
    component: DiscordAuthCallbackComponent,
  },
];
