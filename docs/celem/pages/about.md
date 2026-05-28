# Celem About

Branch: `feat/celem-about`

Route: `/about`

Decision: the `/about` route now points to `AboutComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Intro | ✓ história placeholder |
| 2 | Missão/Visão/Objetivos | ✓ cards institucionais |
| 3 | Comunidade & Contato | ⏳ vazia |
| 4 | CTA final | ⏳ vazia |

## Composition Rule

The About root stays transparent. Site atmosphere continues to come from the global `body` background.

## Intro A2

- Section uses `CelemSectionHeader` with eyebrow `SOBRE` and title `Reino de Celem`.
- Copy is institutional placeholder and must be replaced with final project history later.
- Right-side media uses `CelemMediaPlaceholder ratio="4:3"` for future identity imagery.

## Missão/Visão/Objetivos A2

- Section uses `CelemSectionHeader` with eyebrow `Direção`.
- Three `CelemCard` items:
  - Missão.
  - Visão.
  - Objetivos.
- Grid behavior: three columns on desktop, one column on mobile.
