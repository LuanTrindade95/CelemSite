import { Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { CommandCatalogComponent } from './features/command-catalog/command-catalog.component';
import { HomeComponent } from './features/home/home.component';
import { InterfaceComponent } from './features/interface/interface.component';
import { LauncherComponent } from './features/launcher/launcher.component';
import { DiscordAuthCallbackComponent } from './features/site-auth/discord-auth-callback.component';
import { UnderConstructionPageComponent } from './features/static-page/under-construction-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'commands',
    component: CommandCatalogComponent,
  },
  {
    path: 'launcher',
    component: LauncherComponent,
  },
  {
    path: 'interface',
    component: InterfaceComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'news',
    component: UnderConstructionPageComponent,
    data: {
      titleKey: 'navNews',
    },
  },
  {
    path: 'auth/callback',
    component: DiscordAuthCallbackComponent,
  },
];
