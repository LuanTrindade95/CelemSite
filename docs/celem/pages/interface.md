# Celem Interface

Branch: `feat/celem-interface`

Route: `/interface`

Decision: the `/interface` route now points to `InterfaceComponent` instead of `UnderConstructionPageComponent`.

## Sections

| Order | Section | State |
|---|---|---|
| 1 | Hero | ✓ CTA de launcher e mockup |
| 2 | Funcionalidades | ✓ blocos alternados |
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
