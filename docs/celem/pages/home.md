# Celem Home

Branch: `feat/celem-home`

Route: `/`

Decision: the root route now points to `HomeComponent`; the command catalog remains available at `/commands`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ scaffold com CTA de launcher |
| 2 | Interface | ⏳ vazia |
| 3 | Launcher | ⏳ vazia |
| 4 | Comandos | ⏳ vazia |
| 5 | Notícias | ⏳ vazia |
| 6 | Sobre | ⏳ vazia |

## Composition Rule

The Home root stays transparent. Site atmosphere continues to come from the global `body` background.

## Hero H2

- Primary CTA: `Baixar Launcher`.
- Secondary CTA: `Conhecer a Interface`, linked to `#interface`.
- Right-side media: `CelemMediaPlaceholder ratio="16:9"` for the future interface mockup screenshot.
