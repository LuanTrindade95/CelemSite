# CHANGELOG

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
