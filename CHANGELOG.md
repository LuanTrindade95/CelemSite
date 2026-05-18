# CHANGELOG

## 2026-05-18 17:12:00 -03:00

- Switched the hosted Discord callback target from `/auth/callback` to the GitHub Pages site root, then rerouted the OAuth query to the internal callback component inside Angular so the login flow no longer starts with a Pages `404` response.
- Replaced the GitHub Pages fallback copy with a dedicated SPA `404.html` redirect shim for future deep links.

## 2026-05-18 16:47:00 -03:00

- Removed the site callback dependency on a custom OAuth `state` value so the hosted GitHub Pages Discord login flow stays compatible with the Supabase Auth PKCE state handling.

## 2026-05-18 16:39:00 -03:00

- Fixed the authenticated site header fallback so Discord login now shows the user's display name and avatar even when no guild-specific membership profile is returned.

## 2026-05-18 16:24:39 -03:00

- Added a reusable Discord login confirmation modal before the CelemSite OAuth handoff, with backdrop click and `Esc` close behavior.
- Added the optional "keep me signed in" choice to the site login flow and forwarded that preference through the Discord callback exchange.
- Documented the local and hosted Discord auth setup, callback URLs, and manual QA steps for the new session-persistence behavior.

## 2026-05-18 09:12:00 -03:00

- Canonicalized the full local Discord login handoff to `http://127.0.0.1:4200`, not just the callback target, so PKCE cookies and the OAuth callback stay on the same loopback host.
- Added explicit local and production Angular environments for Supabase function endpoints and Discord callback routing.
- Routed local Supabase Edge Function calls through the Angular dev-server proxy to avoid CORS failures during local testing.
- Fixed local Discord callback generation to always use `http://127.0.0.1:4200/auth/callback`, even if a browser is opened on a `localhost` alias or a random dev-server port.
- Added regression coverage for local, loopback, and production Discord login redirect URL generation.

## 2026-05-17 18:52:00 -03:00

- Added Discord login, callback recovery, logout, and session restoration for `CelemSite` using the shared Supabase Auth PKCE flow already used by the launcher.
- Added global UI language selection using the V Rising language set, with local persistence and backend preference sync for authenticated users.
- Updated the Angular catalog flow to request the protected site catalog first, fall back to the public catalog second, and keep a public-only local fallback last.
- Removed admin-only command leakage from the local fallback catalog and aligned the frontend to the new protected/public payload separation.
- Documented the new site auth, language, and protected catalog runtime behavior.

## 2026-05-12 22:49:39 -03:00

- Added a command metadata platform RFC documenting the target JSON Schema, Supabase, GitHub Actions, API, frontend, migration, and AI-search architecture for the Celem command ecosystem.
- Updated the README to point to the RFC and clarify the long-term `commands.json` plus `commands.schema.json` direction.

## 2026-05-10 09:30:00 -03:00

- Created the initial Angular CelemSite project.
- Added the modular command catalog page with search, filters, language selection, sorting, command cards, and tests.
- Added GitHub Pages deployment through GitHub Actions.
- Added CelemInstall logo usage and Celem palette styling.
