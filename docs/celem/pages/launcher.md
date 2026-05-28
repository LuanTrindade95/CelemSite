# Celem Launcher

Branch: `feat/celem-launcher`

Route: `/launcher`

Decision: the `/launcher` route now points to `LauncherComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ CTA de download e preview |
| 2 | Como funciona | ✓ passos numerados |
| 3 | Screenshots | ✓ grid de placeholders |
| 4 | Requisitos | ✓ placeholder |
| 5 | FAQ | ✓ accordion acessível |
| 6 | CTA final | ✓ faixa de fechamento |

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
- Replace placeholder requirements with validated Launcher requirements before publishing the download.

## Como funciona L3

- Section uses `CelemSectionHeader` with eyebrow `Como funciona`.
- Four numbered steps:
  - Baixar o launcher.
  - Instalar.
  - Ativar a Interface.
  - Jogar.
- Layout: four cards in desktop, two columns in tablet, one column in mobile.

## Screenshots L3

- Section uses `CelemSectionHeader` with eyebrow `Screenshots`.
- Six `CelemMediaPlaceholder ratio="16:9"` items reserve space for future Launcher imagery.
- Grid behavior:
  - Desktop: 3 columns.
  - Tablet: 2 columns.
  - Mobile: 1 column.
- Debt: lightbox/interactive gallery remains pending for a future phase.

## Requisitos L4

- Section uses `CelemSectionHeader` with explicit placeholder copy.
- Requirement cards:
  - Sistema operacional.
  - Espaço em disco.
  - Dependências.
  - Versão do jogo.
- Content is illustrative and must not be treated as final technical requirements.

## FAQ L4

- Section uses native `<details>/<summary>` accordion items for accessible keyboard behavior without custom JavaScript.
- Five placeholder questions:
  - O Launcher instala a Interface automaticamente?
  - Preciso configurar algo manualmente?
  - O Launcher atualiza sozinho?
  - Posso continuar usando comandos?
  - Onde encontro o download real?

## CTA Final L4

- Closing band reinforces `Baixar Launcher` as the primary action.
- CTA uses the same placeholder destination as the Hero: `href="#launcher-download-placeholder"`.
