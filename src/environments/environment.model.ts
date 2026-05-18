export interface SiteEnvironment {
  readonly name: 'local' | 'production';
  readonly siteFunctionsBaseUrl: string;
  readonly siteAuthRedirectBaseUrl: string;
  readonly siteAuthCallbackPath: string;
}
