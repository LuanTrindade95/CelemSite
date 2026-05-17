export const SITE_FUNCTIONS_BASE_URL = 'https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1';

export const SITE_API_ENDPOINTS = {
  publicCommandCatalog: `${SITE_FUNCTIONS_BASE_URL}/command-catalog`,
  siteCommandCatalog: `${SITE_FUNCTIONS_BASE_URL}/site-command-catalog`,
  siteAuthLogin: `${SITE_FUNCTIONS_BASE_URL}/site-auth-login`,
  siteAuthExchange: `${SITE_FUNCTIONS_BASE_URL}/site-auth-exchange`,
  siteSession: `${SITE_FUNCTIONS_BASE_URL}/site-session`,
  siteLogout: `${SITE_FUNCTIONS_BASE_URL}/site-logout`,
  siteLanguage: `${SITE_FUNCTIONS_BASE_URL}/site-language`,
} as const;
