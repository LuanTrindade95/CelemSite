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
- Session recovery and refresh through backend-owned HTTPOnly cookies.
- Role-aware command visibility enforced in Supabase Edge Functions before the payload leaves the backend.
- Global UI language selection using the V Rising language set.
- Command translation selection sourced from plugin `Localization/Commands.json` and completed by localized command attributes when the JSON is incomplete.

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
- `environment.production.ts` sends Discord callbacks to `https://luantrindade95.github.io/CelemSite/`.

Use these scripts when switching targets:

```powershell
npm run start:local
npm run build:local
npm run build:pages
```

## Verification

```powershell
npm test -- --browsers=ChromeHeadless
npm run build
npm run build:pages
```

## GitHub Pages

Deployment uses GitHub Actions and the official Pages artifact flow. This is preferred over a `gh-pages` branch because Angular builds and tests stay reproducible on every push to `main`.

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
