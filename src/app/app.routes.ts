import { Routes } from '@angular/router';
import { CommandCatalogComponent } from './features/command-catalog/command-catalog.component';
import { DiscordAuthCallbackComponent } from './features/site-auth/discord-auth-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: CommandCatalogComponent,
  },
  {
    path: 'auth/callback',
    component: DiscordAuthCallbackComponent,
  },
];
