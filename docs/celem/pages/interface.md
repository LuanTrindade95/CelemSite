# Celem Interface

Branch: `feat/celem-interface`

Route: `/interface`

Decision: the `/interface` route now points to `InterfaceComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ CTA de launcher e mockup |
| 2 | Funcionalidades | ⏳ vazia |
| 3 | Galeria | ⏳ vazia |
| 4 | Comparação | ⏳ vazia |
| 5 | Integração | ⏳ vazia |
| 6 | CTA final | ⏳ vazia |

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
