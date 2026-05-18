import { SITE_API_ENDPOINTS } from '../config/site-api.config';
import { buildSiteAuthCallbackUrl, buildSiteAuthLoginUrl } from './site-auth.service';

describe('SiteAuthService redirect helpers', () => {
  it('normalizes localhost callbacks to the local origin accepted by the backend', () => {
    const callbackUrl = buildSiteAuthCallbackUrl('http://localhost:4200/');

    expect(callbackUrl).toBe('http://127.0.0.1:4200/auth/callback');
  });

  it('uses the canonical local callback origin when the browser runs on a random dev port', () => {
    const callbackUrl = buildSiteAuthCallbackUrl('http://localhost:62418/');

    expect(callbackUrl).toBe('http://127.0.0.1:4201/auth/callback');
  });

  it('preserves the supported local auth port used by the current dev server', () => {
    const callbackUrl = buildSiteAuthCallbackUrl('http://localhost:4201/');

    expect(callbackUrl).toBe('http://127.0.0.1:4201/auth/callback');
  });

  it('keeps existing accepted loopback callback origins unchanged', () => {
    const callbackUrl = buildSiteAuthCallbackUrl('http://127.0.0.1:4200/');

    expect(callbackUrl).toBe('http://127.0.0.1:4200/auth/callback');
  });

  it('keeps production callback origins unchanged', () => {
    const callbackUrl = buildSiteAuthCallbackUrl('https://luantrindade95.github.io/CelemSite/', '', '');

    expect(callbackUrl).toBe('https://luantrindade95.github.io/CelemSite/');
  });

  it('uses an explicit auth redirect base when one is provided', () => {
    const callbackUrl = buildSiteAuthCallbackUrl(
      'https://preview.example/',
      'https://luantrindade95.github.io/CelemSite/',
      '',
    );

    expect(callbackUrl).toBe('https://luantrindade95.github.io/CelemSite/');
  });

  it('keeps local callbacks local even when a hosted redirect base is configured', () => {
    const callbackUrl = buildSiteAuthCallbackUrl(
      'http://localhost:62418/',
      'https://luantrindade95.github.io/CelemSite/',
    );

    expect(callbackUrl).toBe('http://127.0.0.1:4201/auth/callback');
  });

  it('builds the Discord login handoff with the normalized redirect target', () => {
    const loginUrl = buildSiteAuthLoginUrl('http://localhost:4200/');
    const parsed = new URL(loginUrl);

    expect(parsed.origin).toBe('http://127.0.0.1:4200');
    expect(parsed.pathname).toBe('/functions/v1/site-auth-login');
    expect(parsed.searchParams.get('redirectTo')).toBe('http://127.0.0.1:4200/auth/callback');
  });

  it('builds the Discord login handoff on the supported current local port', () => {
    const loginUrl = buildSiteAuthLoginUrl('http://localhost:4201/');
    const parsed = new URL(loginUrl);

    expect(parsed.origin).toBe('http://127.0.0.1:4201');
    expect(parsed.pathname).toBe('/functions/v1/site-auth-login');
    expect(parsed.searchParams.get('redirectTo')).toBe('http://127.0.0.1:4201/auth/callback');
  });

  it('builds the hosted Discord login handoff with the GitHub Pages root callback', () => {
    const loginUrl = buildSiteAuthLoginUrl(
      'https://luantrindade95.github.io/CelemSite/',
      'https://luantrindade95.github.io/CelemSite/',
      '',
    );
    const parsed = new URL(loginUrl);

    expect(parsed.origin).toBe('https://luantrindade95.github.io');
    expect(parsed.pathname).toBe('/functions/v1/site-auth-login');
    expect(parsed.searchParams.get('redirectTo')).toBe('https://luantrindade95.github.io/CelemSite/');
  });
});
