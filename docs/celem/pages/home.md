# Celem Home

Branch: `feat/celem-home`

Route: `/`

Decision: the root route now points to `HomeComponent`; the command catalog remains available at `/commands`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ scaffold com CTA de launcher |
| 2 | Interface | ✓ destaque principal |
| 3 | Launcher | ⏳ vazia |
| 4 | Comandos | ⏳ vazia |
| 5 | Notícias | ⏳ vazia |
| 6 | Sobre | ⏳ vazia |

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
