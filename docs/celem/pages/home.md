# Celem Home

Branch: `feat/celem-home`

Route: `/`

Decision: the root route now points to `HomeComponent`; the command catalog remains available at `/commands`.

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

- Home contains a placeholder news preview only; no blog or CMS exists in this phase.
- Dedicated route `/news` was created as an `UnderConstructionPageComponent` stub with `data: { titleKey: 'navNews' }`.
- Notícias remains outside the site-shell nav for now.
- Cards:
  - Update, dated `04 jun 2026`.
  - Evento, dated `12 jun 2026`.
  - V Rising, dated `20 jun 2026`.
- CTA: `Ver todas as notícias`, linked to `routerLink="/news"`.

## Sobre/Comunidade H5

- Section header introduces the project and community with placeholder copy.
- CTA: `Conhecer o projeto`, linked to `routerLink="/about"`.
- Social/Discord area is a non-interactive placeholder for future links.

## CTA Final H5

- Closing band reinforces `Baixar Launcher` as the primary action.
- CTA: `Baixar Launcher`, linked to `routerLink="/launcher"` following the Home launcher CTA pattern.
