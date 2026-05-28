# Celem Interface

Branch: `feat/celem-interface`

Route: `/interface`

Decision: the `/interface` route now points to `InterfaceComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ CTA de launcher e mockup |
| 2 | Funcionalidades | ✓ blocos alternados |
| 3 | Galeria | ✓ grid responsivo |
| 4 | Comparação | ✓ Interface x Comandos |
| 5 | Integração | ✓ Launcher |
| 6 | CTA final | ✓ faixa de fechamento |

## Composition Rule

The Interface root stays transparent. Site atmosphere continues to come from the global `body` background.

## Hero I2

- Eyebrow: `A INTERFACE DO REINO`.
- Primary CTA: `Baixar Launcher`, linked to `routerLink="/launcher"`.
- Secondary CTA: `Ver funcionalidades`, linked to `#features`.
- Badges:
  - Instalação via Launcher.
  - Sem decorar comandos.
- Right-side media: `CelemMediaPlaceholder ratio="16:9"` for the future primary interface mockup.

## Funcionalidades I3

- Section anchor: `#features`.
- Layout: alternating text/media blocks on desktop; media above text on mobile.
- Blocks:
  - Visualização do jogo.
  - Configuração fácil.
  - Qualidade de vida.
  - Atalhos para fluxos importantes.
- Media: each block uses `CelemMediaPlaceholder ratio="16:9"` as a temporary preview.
- Copy is illustrative placeholder content and not final product wording.

## Galeria I4

- Section uses `CelemSectionHeader` plus a responsive grid of eight `CelemMediaPlaceholder` previews.
- Grid behavior:
  - Desktop: 3 columns.
  - Tablet: 2 columns.
  - Mobile: 1 column.
- Ratios mix `16:9` and `4:3` to create visual rhythm while preserving stable dimensions.
- Decision: video previews use a local play overlay on top of `CelemMediaPlaceholder`; no new media component was introduced.
- Debt: lightbox/interative gallery remains pending for a future phase.

## Comparação I5

- Message: commands remain available and useful, while the Interface is positioned as the more intuitive path for most users.
- Layout: side-by-side cards on desktop, stacked on mobile.
- Commands column uses static mono text with `--celem-font-mono`; no command-catalog styles or code are imported.
- Interface column uses `CelemMediaPlaceholder ratio="16:9"` plus explanatory placeholder copy.
- CTA: `Ver todos os comandos`, linked to `routerLink="/commands"`.

## Integração I5

- Explains that the Interface is installed through the Launcher.
- Layout: short copy plus `CelemMediaPlaceholder ratio="16:9"`.
- CTA: `Baixar Launcher`, linked to `routerLink="/launcher"`.

## CTA Final I5

- Closing band reinforces `Baixar Launcher` as the primary next action.
- CTA: `Baixar Launcher`, linked to `routerLink="/launcher"`.
