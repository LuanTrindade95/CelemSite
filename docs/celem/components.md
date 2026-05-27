# Celem Shared Components

Shared foundation reference for `CelemSite`. The site atmosphere belongs to the global `body`; pages and layout primitives stay transparent.

Validação por fase: `ng build` + `tsc -p tsconfig.app.json --noEmit` + smoke visual. Target `lint` ausente no `angular.json`; ESLint pendente de decisão arquitetural fora do escopo da fundação.

## New Tokens

| Token | Value | Purpose |
|---|---|---|
| `--celem-font-sans` | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Default interface typography |
| `--celem-font-mono` | `"Cascadia Code", "SFMono-Regular", Consolas, monospace` | Commands, aliases, examples, keyboard hints, and technical snippets |
| `--celem-mist-red` | `rgba(94, 15, 23, 0.2)` | Red atmospheric mist layer on the global background |
| `--celem-mist-gold` | `rgba(198, 168, 74, 0.18)` | Gold atmospheric mist layer on the global background |
| `--celem-fog-graphite` | `rgba(43, 43, 43, 0.22)` | Graphite fog depth layer on the global background |
| `--celem-radius-sm` | `6px` | Native controls and small form defaults |
| `--celem-radius-md` | `12px` | Standard cards, panels, fields, and compact surfaces |
| `--celem-radius-lg` | `16px` | Larger utility surfaces and prominent inputs |
| `--celem-radius-xl` | `20px` | Hero/search containers and mobile drawers |
| `--celem-radius-pill` | `999px` | Pills, capsules, toggles, badges, and rounded action controls |

## Radius Recon

| Value | Locations | Canonical role |
|---|---|---|
| `6px` | `src/styles.scss` global `button`, `select`, `input` | Small control baseline |
| `12px` | Command cards, command toolbar, toolbar fields, usage block, shell language/ghost controls | Default surface/control radius |
| `16px` | Hero search input, command empty state | Larger utility surface radius |
| `18px` | Command hero search mobile override | Responsive transition value, not a canonical token |
| `20px` | Command hero search, mobile toolbar drawer | Prominent surface radius |
| `50%` | Shell Discord avatar | Circular media-specific case, not a layout token |
| `999px` | Shell nav underline, account/login capsules, command pills, toolbar drawer buttons, pagination/toggles | Pill/capsule radius |

## CelemSection

Selector: `celem-section`

| Input | Type | Default | Purpose |
|---|---|---|---|
| `tone` | `'default' \| 'subtle'` | `'default'` | Adjusts vertical density while preserving transparent page background |

Example:

```html
<celem-section>
  <p>Primary section content.</p>
</celem-section>

<celem-section tone="subtle">
  <p>Denser supporting content.</p>
</celem-section>
```

## CelemSectionHeader

Selector: `celem-section-header`

| Input | Type | Required | Purpose |
|---|---|---|---|
| `eyebrow` | `string` | No | Optional uppercase gold context label |
| `title` | `string` | Yes | Main high-contrast section title |
| `subtitle` | `string` | No | Optional muted supporting copy |

Example:

```html
<celem-section-header
  eyebrow="Celem ecosystem"
  title="Operational interface"
  subtitle="Shared primitives keep new pages aligned with the site foundation." />
```

## CelemButton

Selector: `celem-button`

Espelha visualmente `.secondary-button` para `variant="secondary"` e `.ghost` para `variant="ghost"`. `variant="primary"` é o novo botão primário dourado do Brand Kit e não espelha a `.primary-button` vermelha atual.

| Input | Type | Default | Purpose |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual treatment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height and horizontal padding |
| `href` | `string` | `''` | Renders an anchor when present; renders a button when empty |
| `disabled` | `boolean` | `false` | Disables the native button or makes the anchor inert |

| Output | Type | Purpose |
|---|---|---|
| `pressed` | `EventEmitter<MouseEvent>` | Emits when an enabled button or anchor is activated |

Example:

```html
<celem-button variant="primary" (pressed)="save()">Save</celem-button>
<celem-button variant="secondary">Cancel</celem-button>
<celem-button variant="ghost" size="sm" href="/commands">Commands</celem-button>
```

## CelemCard

Selector: `celem-card`

Espelha visualmente `.command-card`: dark layered gradient, subtle top-right gold radial highlight, cold border, soft shadow, `--celem-radius-md`, and 160ms hover/focus-within lift.

Projection slots:

| Slot | Selector | Purpose |
|---|---|---|
| Header | `[celem-card-header]` | Optional header content |
| Body | default `<ng-content>` | Main card content |
| Footer | `[celem-card-footer]` | Optional footer content |

Example:

```html
<celem-card>
  <div celem-card-header>
    <celem-badge tone="gold">Launcher</celem-badge>
  </div>

  <p>Shared card content.</p>

  <div celem-card-footer>
    <celem-button variant="ghost" size="sm">Open</celem-button>
  </div>
</celem-card>
```

## CelemBadge

Selector: `celem-badge`

Espelha visualmente `.meta-pill` and `.permission`: neutral uses the dark `.meta-pill` fill; semantic tones use the compact bordered `.permission` language with token-based colors.

| Input | Type | Default | Purpose |
|---|---|---|---|
| `tone` | `'neutral' \| 'gold' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic color treatment |

Example:

```html
<celem-badge>Neutral</celem-badge>
<celem-badge tone="success">Player</celem-badge>
<celem-badge tone="warning">Admin</celem-badge>
```

## CelemMediaPlaceholder

Selector: `celem-media-placeholder`

Provides a temporary media surface for pages that do not yet have final assets. It uses `--celem-radius-md`, a restrained haze, and the same dark premium surface language as the shared cards. When `src` is present, it renders a real image.

| Input | Type | Default | Purpose |
|---|---|---|---|
| `ratio` | `'16:9' \| '4:3' \| '1:1'` | `'16:9'` | Stable media aspect ratio |
| `src` | `string` | `''` | Optional image source |
| `alt` | `string` | `''` | Image alt text when `src` is present |
| `label` | `string` | `'Media pending'` | Placeholder label when no image source is present |

Example:

```html
<celem-media-placeholder ratio="16:9" label="Launcher preview"></celem-media-placeholder>
<celem-media-placeholder ratio="1:1" src="assets/images/celem-logo.png" alt="Celem"></celem-media-placeholder>
```

## Débitos visuais conhecidos

- `.primary-button` vermelho do shell/modal Discord deve migrar em sessão futura para `CelemButton variant="primary"` dourado, com criação dedicada de `variant="danger"` para preservar ações destrutivas/vermelhas.
- Radius `8px` do modal Discord está fora dos tokens canônicos de F0.2. Não migrar até uma sessão dedicada de alinhamento do modal.

## Background Rule

Atmosfera no body, páginas transparentes.

Do not duplicate mist, fog, particles, or page atmosphere inside feature pages or shared section primitives. New pages should compose transparent sections over the existing global background.
