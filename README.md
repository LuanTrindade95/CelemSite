# CelemSite

Angular single-page command catalog for the Celem plugin ecosystem.

## Runtime

- Angular `21.2.12`
- Node.js `24.x`
- Public command API: `https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog`

The catalog is structured as a feature component so it can become one page inside a larger modular site later.

## Development

```powershell
npm install
npm start
```

## Verification

```powershell
npm test -- --browsers=ChromeHeadless
npm run build:pages
```

## GitHub Pages

Deployment uses GitHub Actions and the official Pages artifact flow. This is preferred over a `gh-pages` branch because Angular builds and tests stay reproducible on every push to `main`.

## Data Source

Initial catalog rows are seeded in `CelemBackend` from `docs/*/commands.md` files and served through the public Supabase Edge Function `command-catalog`.
