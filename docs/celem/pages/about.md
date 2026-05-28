# Celem About

Branch: `feat/celem-about`

Route: `/about`

Decision: the `/about` route now points to `AboutComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Intro | ✓ história placeholder |
| 2 | Missão/Visão/Objetivos | ✓ cards institucionais |
| 3 | Comunidade & Contato | ✓ links placeholder |
| 4 | CTA final | ✓ Launcher |

Status: Sobre concluída em A4, com placeholders pendentes registrados abaixo.

## Composition Rule

The About root stays transparent. Site atmosphere continues to come from the global `body` background.

## Intro A2

- Section uses `CelemSectionHeader` with eyebrow `SOBRE` and title `Reino de Celem`.
- Copy is institutional placeholder and must be replaced with final project history later.
- Right-side media uses `CelemMediaPlaceholder ratio="4:3"` for future identity imagery.

## Missão/Visão/Objetivos A2

- Section uses `CelemSectionHeader` with eyebrow `Direção`.
- Header title: `Direção do Celem`.
- Three `CelemCard` items:
  - Missão.
  - Visão.
  - Objetivos.
- Grid behavior: three columns on desktop, one column on mobile.

## Comunidade & Contato A3

- Section uses `CelemSectionHeader` with eyebrow `Comunidade`.
- Discord is the highlighted social link.
- Social links use placeholder `href="#"` values:
  - Discord.
  - YouTube.
  - GitHub.
- Contact block is visual/informational only; no functional form or send integration exists in this phase.

## CTA Final A3

- CTA choice: `Baixar Launcher`, to keep the institutional page aligned with the main conversion funnel.
- CTA target: `routerLink="/launcher"`.

## Polish A4

- Semantic hierarchy: Intro uses one `h1`; the following sections keep `h2` headings.
- Responsive behavior checked for desktop, tablet, and mobile.
- Social links and final CTA use shared button focus/hover states.
- Reduced motion preference is respected locally for About page transitions.
- Residual `::ng-deep` selector removed; About keeps overflow protection through local section containers.

## Pendências

- Replace placeholder social URLs with real channels.
- Replace placeholder institutional copy with final project text.
- Decide whether a future contact form is needed; no form integration was added in A3.
