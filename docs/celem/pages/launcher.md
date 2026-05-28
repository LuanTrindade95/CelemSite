# Celem Launcher

Branch: `feat/celem-launcher`

Route: `/launcher`

Decision: the `/launcher` route now points to `LauncherComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ CTA de download e preview |
| 2 | Como funciona | ⏳ vazia |
| 3 | Screenshots | ⏳ vazia |
| 4 | Requisitos | ⏳ vazia |
| 5 | FAQ | ⏳ vazia |
| 6 | CTA final | ⏳ vazia |

## Composition Rule

The Launcher root stays transparent. Site atmosphere continues to come from the global `body` background.

## Hero L2

- Eyebrow: `LAUNCHER DO REINO`.
- Primary CTA: `Baixar Launcher`, using `href="#launcher-download-placeholder"` until the real download URL exists.
- Secondary CTA: `Conhecer a Interface`, linked to `routerLink="/interface"`.
- Badges:
  - Instala a Interface.
  - Atualizações automáticas.
- Right-side media: `CelemMediaPlaceholder ratio="16:9"` for the future Launcher screenshot.

## Ações humanas pendentes

- Replace the placeholder download link with the real Launcher URL.
