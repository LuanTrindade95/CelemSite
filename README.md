# CelemSite

Angular single-page command catalog for the Celem plugin ecosystem.

## Runtime

- Angular `21.2.12`
- Node.js `24.x`
- Public command API: `https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog`
- Session-aware command API: `https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/site-command-catalog`
- Discord login handoff: `https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/site-auth-login`

The catalog is structured as a feature component so it can become one page inside a larger modular site later.

The site now includes:

- Discord login aligned with the launcher Supabase Auth PKCE flow.
- Discord login confirmation modal before the OAuth redirect starts.
- Optional "keep me signed in" behavior that controls whether the browser keeps a persistent site session or only a browser-session cookie.
- Session recovery and refresh through backend-owned HTTPOnly cookies.
- Role-aware command visibility enforced in Supabase Edge Functions before the payload leaves the backend.
- Global UI language selection using the V Rising language set.
- Command translation selection sourced from plugin `Localization/Commands.json` and completed by localized command attributes when the JSON is incomplete.
- A compact top navigation that keeps the command catalog as the primary live page while exposing future `Launcher`, `Interface`, and `About` routes as in-progress placeholders.
- A premium catalog hero with primary search, `Ctrl + K` shortcut focus, popular quick filters, responsive view toggle, and client-side pagination with six cards per page.
- A header brand lockup inspired by the Reino Sagrado de Celem visual identity, with the logo paired to a two-line title treatment instead of the older subtitle copy.

## Development

```powershell
npm install
npm start
```

`npm start` uses the local environment and defaults to the canonical loopback origin already used by the local project flow:

```text
http://127.0.0.1:4201/
```

Local API calls use the Angular dev-server proxy in `proxy.conf.json`, so the browser calls `/functions/v1/*` on the same local origin and the dev server forwards the request to Supabase. This avoids local CORS failures without weakening backend origin validation. The Discord login handoff also starts on `127.0.0.1`, so the PKCE cookies created by `site-auth-login` stay on the same host that receives the callback.

For Discord login, the local environment sends the callback to the canonical loopback host while preserving a supported local dev port (`4200` or `4201`). The default is:

```text
http://127.0.0.1:4201/auth/callback
```

Avoid testing from random Angular ports such as `localhost:62418`; Supabase Auth and the PKCE cookies are intentionally pinned to the supported loopback callback ports above.

Environment files live under `src/environments/`:

- `environment.local.ts` keeps Discord callbacks on the fixed local callback origin accepted by Supabase Auth.
- `environment.production.ts` sends Discord callbacks to the GitHub Pages site root `https://luantrindade95.github.io/CelemSite/`, then the Angular app reroutes the hosted OAuth query to the internal callback component without triggering a second Pages deep-link request.

Use these scripts when switching targets:

```powershell
npm run start:local
npm run build:local
npm run build:pages
```

## Discord Auth UX

Current site login behavior:

- logged out users see the Discord login action in the header
- clicking the login action opens a confirmation modal before the OAuth redirect
- the modal explains that the Discord account will be used and exposes the "keep me signed in" option
- when "keep me signed in" is enabled, the backend issues persistent HTTPOnly cookies
- when "keep me signed in" is disabled, the backend issues browser-session cookies that disappear after the browser closes
- the hosted login flow relies on the Supabase Auth PKCE-managed OAuth state and does not inject a second custom site state parameter
- after login, the header shows the guild-aware display name plus avatar when available, otherwise it falls back to the authenticated Discord user profile without requiring a manual refresh
- after logout, the catalog immediately reloads against the anonymous/public command source so admin-only visibility is removed without a browser refresh
- the catalog no longer exposes a second per-page language filter; the global header language applies immediately and is the single language source for both UI text and command payloads
- the main layout keeps the existing dark V Rising-inspired identity while adding a compact premium header, a search-first hero, responsive filter drawer behavior on mobile, smaller command cards, and a minimal footer

## Catalog UX

Current catalog behavior:

- the primary search field lives in the hero section and supports `Ctrl + K` to focus it instantly
- project and sort controls stay inline on desktop with responsive two-column and three-column layouts, then move into a mobile filter drawer on smaller screens
- the permission filter only appears for authenticated administrators
- sort options are intentionally limited to `Project` and `Command`
- the catalog supports both grid and list views
- pagination is client-side, shows six commands per page, and exposes previous/next arrows alongside the page numbers
- the hero is intentionally shorter so the first six cards appear earlier on load without changing the overall structure of the page
- grid cards keep a stable visual height on desktop while preserving responsive stacking on tablet and mobile
- the main command cards now prioritize the command, summary, primary usage, compact metadata, and copy action instead of long example-heavy bodies

## Discord / Supabase Setup

`CelemSite` does not read Discord secrets directly. The Angular app only consumes the callback routing defined in `src/environments/`. Discord secrets stay in the Supabase/Auth + Edge Function side of `CelemBackend`.

### 1. Create the Discord application

In the Discord Developer Portal:

1. Create or open the Discord application used by Celem.
2. Copy the application `Client ID`.
3. Generate or copy the application `Client Secret`.
4. Keep both values out of the frontend.

### 2. Configure the Supabase Auth Discord provider

In the Supabase dashboard for the same project:

1. Enable the Discord provider in Supabase Auth.
2. Paste the Discord `Client ID` and `Client Secret`.
3. Keep the provider scopes aligned with the current site flow: `identify guilds.members.read`.
4. Add the allowed site callback URLs in the Supabase Auth redirect URL list.

Recommended site callback URLs:

```text
http://127.0.0.1:4201/auth/callback
http://127.0.0.1:4200/auth/callback
https://luantrindade95.github.io/CelemSite/
```

### 3. Configure backend-side secrets and allowed origins

These values belong to `CelemBackend` / Supabase Edge Functions, not to Angular:

```env
CELEM_SUPABASE_URL=https://<project-ref>.supabase.co
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=https://<project-ref>.supabase.co/functions/v1/discord-callback
DISCORD_BOT_TOKEN=
SITE_ALLOWED_ORIGINS=http://127.0.0.1:4201,http://127.0.0.1:4200,https://luantrindade95.github.io
```

Notes:

- `DISCORD_REDIRECT_URI` is still used by the backend-owned `discord-*` Edge Function flow and must remain backend-only.
- The site login path itself uses Supabase Auth plus the site callback URLs above.
- `SITE_ALLOWED_ORIGINS` must include every local or hosted origin that is allowed to call `site-auth-login`, `site-auth-exchange`, `site-session`, and `site-logout`.

### 4. Run locally

```powershell
npm install
npm start
```

The canonical local origin is:

```text
http://127.0.0.1:4201/
```

### 5. Test the login flow locally

1. Start the Angular dev server with `npm start`.
2. Open `http://127.0.0.1:4201/`.
3. Click `Discord login`.
4. Confirm the modal and choose whether to keep the session after closing the browser.
5. Complete the Discord OAuth flow.
6. Verify that the header updates with avatar, display name, and logout.
7. If "keep me signed in" was disabled, close the browser completely and confirm that the session is gone on the next open.
8. If "keep me signed in" was enabled, reopen the browser and confirm that the session is restored without logging in again.

## Verification

```powershell
npm test -- --browsers=ChromeHeadless
npm run build
npm run build:pages
```

## GitHub Pages

Deployment uses GitHub Actions and the official Pages artifact flow. This is preferred over a `gh-pages` branch because Angular builds and tests stay reproducible on every push to `main`.

The hosted Discord OAuth callback returns to the GitHub Pages site root instead of a deep route, so the production login flow avoids a Pages callback request that would otherwise start as an HTTP `404`. A dedicated `404.html` SPA redirect shim is still published for any future deep links that may be added later.

## Data Source

`CelemSite` no longer treats Markdown as the catalog source of truth.

Current runtime behavior:

- `command-catalog` returns only the public filtered catalog.
- `site-command-catalog` returns the role-aware catalog for the authenticated site session.
- command translations are generated from plugin localization resources in `Celem2026` and compiled into the backend function bundle.
- the Angular app requests the current site language on every catalog read and falls back to the public endpoint if the protected request is unavailable.

## Metadata Platform Direction

The target command ecosystem architecture is documented in [Command Metadata Platform RFC](docs/command-metadata-platform.md).

The long-term direction is to keep Markdown as human documentation while promoting structured metadata and Supabase-backed normalization for public APIs, search, autocomplete, and future semantic/AI integrations.
