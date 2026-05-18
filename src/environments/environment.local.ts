import { SiteEnvironment } from './environment.model';

export const environment: SiteEnvironment = {
  name: 'local',
  siteFunctionsBaseUrl: '/functions/v1',
  siteAuthRedirectBaseUrl: 'http://127.0.0.1:4201/',
  siteAuthCallbackPath: 'auth/callback',
};
