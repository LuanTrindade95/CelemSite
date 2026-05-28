import { Routes } from '@angular/router';
import { CommandCatalogComponent } from './features/command-catalog/command-catalog.component';
import { NewsDetailComponent } from './features/news/pages/news-detail/news-detail.component';
import { NewsListComponent } from './features/news/pages/news-list/news-list.component';
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
    path: 'news',
    component: NewsListComponent,
  },
  {
    path: 'news/:slug',
    component: NewsDetailComponent,
  },
  {
    path: 'auth/callback',
    component: DiscordAuthCallbackComponent,
  },
];
