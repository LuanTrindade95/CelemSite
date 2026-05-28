# Celem Interface

Branch: `feat/celem-interface`

Route: `/interface`

Decision: the `/interface` route now points to `InterfaceComponent` instead of `UnderConstructionPageComponent`.

Status: Interface concluída para a fase atual, com placeholders e dívidas documentados abaixo.

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

## Polish I6

- Breakpoints verified:
  - Mobile `<768px`: content stacks in one column, feature media stays above text, gallery is one column, comparison stacks, and there is no horizontal overflow.
  - Tablet `768-1024px`: feature blocks stack, gallery uses two columns, comparison/integration/CTA stack cleanly.
  - Desktop `>1024px`: hero, alternating feature blocks, gallery, comparison, launcher integration and final CTA use their intended multi-column layouts.
- Motion verified: shared buttons/cards keep 160ms transitions, border/tint shifts and approximately 1px hover/focus lift. No reveal-on-scroll, parallax or springy motion is present.
- Accessibility verified:
  - One `h1` in the Hero.
  - Section headings use `h2`; feature cards use `h3`.
  - Keyboard focus is visible with the gold focus ring on all CTAs.
  - Media placeholders use visible labels, and video play overlays are decorative with `aria-hidden="true"`.
- Route consistency verified:
  - All `Baixar Launcher` CTAs point to `/launcher`.
  - `Ver funcionalidades` points to `/interface#features`.
  - `Ver todos os comandos` points to `/commands`.

## Pendências

- Replace placeholder copy with final product copy.
- Replace all `CelemMediaPlaceholder` blocks with real Interface, Launcher and feature imagery.
- Replace `/launcher` stub with the real Launcher/download experience when that phase starts.
- Implement lightbox/interactive gallery behavior in a future phase.
