# Celem Shared Components

Shared foundation reference for `CelemSite`. The site atmosphere belongs to the global `body`; pages and layout primitives stay transparent.

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

## Background Rule

Atmosfera no body, paginas transparentes.

Do not duplicate mist, fog, particles, or page atmosphere inside feature pages or shared section primitives. New pages should compose transparent sections over the existing global background.
