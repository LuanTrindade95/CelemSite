# Celem Home

Branch: `feat/celem-home`

Route: `/`

Decision: the root route now points to `HomeComponent`; the command catalog remains available at `/commands`.

Status: Home concluída para a fase atual, com placeholders documentados abaixo.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ scaffold com CTA de launcher |
| 2 | Interface | ✓ destaque principal |
| 3 | Launcher | ✓ seção com CTA de download |
| 4 | Comandos | ✓ seção com exemplos estáticos |
| 5 | Notícias | ✓ prévia com cards |
| 6 | Sobre/Comunidade | ✓ bloco institucional |
| 7 | CTA final | ✓ faixa de fechamento |

## Composition Rule

The Home root stays transparent. Site atmosphere continues to come from the global `body` background.

## Hero H2

- Primary CTA: `Baixar Launcher`, linked to `routerLink="/launcher"`.
- Secondary CTA: `Conhecer a Interface`, linked to `#interface`.
- Right-side media: `CelemMediaPlaceholder ratio="16:9"` for the future interface mockup screenshot.

## Launcher CTA Pattern

Every Home CTA labeled `Baixar Launcher` points to `routerLink="/launcher"` while the launcher route is still a local stub. An external download URL will replace this route in a future session. This pattern applies to the Hero, the Launcher section (H4), and the final CTA (H5).

## Interface H3

- Section anchor: `#interface`.
- Primary CTA: `Explorar a Interface`, linked to `routerLink="/interface"`.
- Primary media: `CelemMediaPlaceholder ratio="16:9"` for the future interface screenshot.
- Cards:
  - Usabilidade direta.
  - Configuração fácil.
  - Melhor visualização.
  - Qualidade de vida.

## Launcher H4

- Section header explains that the launcher installs the Interface.
- Two-column desktop layout: short explanatory copy plus `CelemMediaPlaceholder ratio="16:9"`.
- CTAs:
  - `Baixar Launcher`, linked to `routerLink="/launcher"`.
  - `Saber mais`, linked to `routerLink="/launcher"`.

## Comandos H4

- Section header acknowledges full command support while positioning the Interface as the preferred path for most flows.
- Static command examples built with `CelemCard` and `CelemBadge`; no command-catalog styles or feature code are imported.
- Cards:
  - `.celem config` with `Administração` badge.
  - `.celem status` with `Consulta` badge.
  - `.celem sync` with `Operação` badge.
- CTA: `Ver todos os comandos`, linked to `routerLink="/commands"`.

## Notícias H5

- Home news preview consumes `NewsService.getRecent(3)`.
- Cards are rendered from the same placeholder data source used by `/news`.
- Each card links to `/news/:slug`.
- CTA: `Ver todas as notícias`, linked to `routerLink="/news"`.

## Sobre/Comunidade H5

- Section header introduces the project and community with placeholder copy.
- CTA: `Conhecer o projeto`, linked to `routerLink="/about"`.
- Social/Discord area is a non-interactive placeholder for future links.

## CTA Final H5

- Closing band reinforces `Baixar Launcher` as the primary action.
- CTA: `Baixar Launcher`, linked to `routerLink="/launcher"` following the Home launcher CTA pattern.

## Polish H6

- Breakpoints verified:
  - Mobile `<768px`: single-column content, media keeps `16:9`, no horizontal overflow.
  - Tablet `768-1024px`: cards collapse to two columns where applicable, launcher/about/final CTA stack cleanly.
  - Desktop `>1024px`: hero, launcher, about, card grids and final CTA use their intended multi-column layouts.
- Motion verified: shared buttons/cards use 160ms transitions, border/tint shifts, and approximately 1px hover/focus lift.
- Accessibility verified:
  - One `h1` in the Hero.
  - Section headings use `h2` through `CelemSectionHeader`; card titles use `h3`.
  - Keyboard focus is visible with the gold focus ring on CTAs.
  - Router CTA hosts are removed from the tab order so each CTA has one keyboard stop on the internal control.
- Route consistency verified:
  - All `Baixar Launcher` CTAs point to `/launcher`.
  - Future/stub routes continue to use the same `UnderConstructionPageComponent` behavior.

## Pendências

- Replace placeholder copy with final product/community copy.
- Replace `CelemMediaPlaceholder` blocks with real interface, launcher and news imagery.
- Replace `/launcher`, `/interface` and `/about` stubs with dedicated pages when each phase starts.
- Keep Notícias outside the site-shell nav until a dedicated nav decision is made.
