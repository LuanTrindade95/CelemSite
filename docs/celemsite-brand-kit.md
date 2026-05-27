# CelemSite Brand Kit

Brand reference for the current `CelemSite` experience. Use this file as the source of truth for mockups, prototypes, landing pages, decks, social assets, and future UI explorations that need to stay aligned with the site.

## Brand Core

### Positioning

`CelemSite` should feel like a living platform from the Celem ecosystem, not a traditional documentation portal.

The current tone is:

- premium
- dark
- fantasy
- cinematic
- minimal
- structured

The closest references are:

- V Rising
- Diablo IV menus
- Steam Deck UI restraint
- premium developer platforms with strong hierarchy

### Emotional Direction

The visual language should communicate:

- authority
- mystical atmosphere
- elegance
- clarity
- discoverability

Avoid:

- cyberpunk neon
- playful SaaS styling
- loud gradients
- high saturation
- generic “gaming UI” excess

## Logo and Lockup

### Primary Asset

- Logo file: `src/assets/images/celem-logo.png`
- Current production usage: emblem at the left of the sticky header

### Header Lockup

Current textual lockup:

- top line: `Reino Sagrado de`
- main line: `Celem`

Current presentation:

- gold emblem
- muted micro-label above
- bold uppercase `Celem`
- tight vertical spacing
- compact horizontal footprint

### Usage Rules

Use the emblem with the two-line lockup when:

- building headers
- hero lockups
- splash screens
- product cards
- official ecosystem presentations

Use the emblem alone when:

- space is constrained
- avatar-like product references are needed
- favicon/app-icon style treatments are being mocked

Do not:

- recolor the emblem arbitrarily
- stretch the logo
- add outlines or glow effects on top of it
- pair it with decorative fantasy fonts unrelated to the current UI

## Color System

### Core Tokens

Extracted from `src/styles.scss`.

| Token | Hex | Primary use |
|---|---|---|
| `--celem-bg` | `#0B0B0B` | deepest page background |
| `--celem-bg-2` | `#111111` | lower-depth background transition |
| `--celem-panel` | `#0A0C11` | dark panel base |
| `--celem-panel-2` | `#10141B` | elevated fields and controls |
| `--celem-border` | `#515B68` | neutral borders |
| `--celem-gold` | `#C6A84A` | premium highlight |
| `--celem-text` | `#E5E7EB` | primary foreground text |
| `--celem-muted` | `#A6ADBA` | secondary text |
| `--celem-success` | `#4E9B6D` | positive/player state |
| `--celem-warning` | `#D38A32` | admin/warning state |
| `--celem-danger` | `#8D2E35` | destructive/error accents |
| `--celem-focus` | `#F2D28A` | focus ring |

### Atmosphere Colors

These colors drive the ambient identity:

- deep red mist: `rgba(94, 15, 23, 0.20)`
- royal gold mist: `rgba(198, 168, 74, 0.18)`
- graphite fog: `rgba(43, 43, 43, 0.22)`

### Accent Rules

Gold is the primary prestige accent.

Use gold for:

- active navigation
- subtle emphasis
- focus states
- highlighted metadata
- premium atmospheric lighting

Use red with restraint:

- low-opacity background mist
- destructive states
- rare dramatic accents

Do not let red dominate the interface.

## Background Language

The page background is not flat black. It uses layered atmosphere:

- black base
- soft red mist on the left
- soft gold mist on the right
- graphite depth near the bottom
- low-contrast floating particles
- blurred cinematic haze

This should feel alive but almost invisible at first glance.

### Background Recipe

```css
background:
  radial-gradient(circle at left 40%, rgba(94, 15, 23, 0.2) 0%, transparent 35%),
  radial-gradient(circle at right 32%, rgba(198, 168, 74, 0.18) 0%, transparent 40%),
  radial-gradient(circle at 50% 120%, rgba(43, 43, 43, 0.22) 0%, transparent 44%),
  linear-gradient(180deg, #0b0b0b 0%, #0d0d0e 48%, #111111 100%);
```

## Typography

### Primary Typeface

Current UI font stack:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

This is the default for:

- navigation
- titles
- body text
- buttons
- labels
- account UI

### Secondary Typeface

Current monospace stack:

```css
"Cascadia Code", "SFMono-Regular", Consolas, monospace
```

Use it for:

- commands
- aliases
- examples
- keyboard hints
- technical snippets

### Typography Behavior

The site relies on contrast through:

- uppercase micro-labels
- bold high-contrast titles
- restrained body copy
- compact metadata text

Avoid ornamental serif replacements in the UI body. The current site voice is modern and restrained.

## Layout and Spacing

### General Density

The current site is compact-premium, not airy-editorial.

Typical spacing cadence:

- `4px`
- `6px`
- `8px`
- `10px`
- `12px`
- `14px`
- `16px`
- `18px`

### Header

Current header characteristics:

- sticky
- translucent black
- bottom border only
- subtle blur
- compact height
- centered navigation
- controls packed to the right

### Hero

The hero is intentionally short and functional:

- title on the left
- search module on the right
- no oversized billboard treatment

## Shape Language

### Current Corner System

The current live styling still uses rounded corners in a restrained way:

- global form controls: `6px`
- most controls/panels: `12px`
- search/empty cards: `16px`
- premium surfaces: `20px`
- pills: `999px`

This means the site is not fully sharp-cornered and not fully soft either. It sits in a controlled premium middle ground.

### Practical Usage

Use:

- `12px` for cards, inputs, compact panels
- `16px` for larger utility surfaces
- `20px` for hero/search containers
- `999px` for pills, account capsules, micro-toggle shells

If prototyping outside the current app, keep the same hierarchy instead of inventing new radius sizes.

## Surface Styles

### Panels and Cards

The dominant card language is:

- dark layered gradient
- subtle radial highlight near the top-right
- cold border
- soft but present shadow

Canonical card example from the command catalog:

```css
.command-card {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 13px;
  padding: 16px;
  border: 1px solid rgba(67, 76, 91, 0.58);
  border-radius: 12px;
  background:
    linear-gradient(180deg, #0b1020f2, #070a12eb),
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.06), transparent 38%);
  box-shadow: 0 18px 48px #0000002e;
}
```

### Inputs

Input surfaces should feel:

- dense
- dark
- readable
- softly elevated

Base characteristics:

- dark fill
- muted border
- no glossy effect
- premium focus ring in warm gold

## Component Signatures

### Navigation

Current nav style:

- horizontal
- no icons
- muted by default
- gold on hover/active
- 1px underline reveal on active state

### Language Picker

Characteristics:

- dark filled select
- subtle border
- compact height
- label-free in the current shell

### Discord Login

Characteristics:

- compact pill button
- Discord blue family, but desaturated into the site tone
- icon-only button in the current anonymous state
- never oversized

### Authenticated Discord Block

Characteristics:

- compact capsule
- avatar on the right
- display name on the left
- small `DISCORD` micro-label
- understated background

### Search Module

Characteristics:

- hero-anchored
- biggest interaction target on the page
- keyboard-hint `Ctrl + K`
- dark fill with gold focus response

### Filter Toolbar

Current desktop behavior:

- two-column baseline
- three-column variant for admins
- very wide desktop gap between the two main controls

Reference:

```css
.toolbar__desktop {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 64px;
  width: 100%;
}
```

### Command Cards

Characteristics:

- stable height in desktop grid mode
- compact metadata
- low-noise footer
- command-first hierarchy
- permission badge separated from command title

## Motion

Motion should stay subtle and fast.

Use:

- `160ms` transitions
- hover lifts of about `1px`
- border-color shifts
- soft background tint changes

Avoid:

- springy motion
- large transforms
- heavy scale animations
- decorative particles in foreground UI

## Copy Tone

Written tone should feel:

- direct
- premium
- clean
- technical when necessary
- never playful or meme-like

Microcopy should avoid:

- too much lore text
- excessive adjectives
- generic marketing fluff

## Imagery and Illustration Guidance

When extending the brand visually:

- prefer dark matte imagery
- use gold as reflected light, not flat paint
- use red only as atmospheric depth
- favor silhouettes, fog, stone, steel, parchment-black surfaces

Avoid:

- colorful fantasy rainbow palettes
- glossy sci-fi assets
- cartoon iconography

## Prototype Starter Tokens

Use this block when mocking `CelemSite` elsewhere:

```css
:root {
  --celem-bg: #0b0b0b;
  --celem-bg-2: #111111;
  --celem-panel: #0a0c11;
  --celem-panel-2: #10141b;
  --celem-border: #515b68;
  --celem-gold: #c6a84a;
  --celem-text: #e5e7eb;
  --celem-muted: #a6adba;
  --celem-success: #4e9b6d;
  --celem-warning: #d38a32;
  --celem-danger: #8d2e35;
  --celem-focus: #f2d28a;
  --celem-font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --celem-font-mono: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
}
```

## Do / Don't

### Do

- keep the interface dark and disciplined
- let gold carry premium emphasis
- use layered blacks instead of flat monochrome
- preserve compact, intentional spacing
- keep fantasy atmosphere in the background, not in the usability

### Don’t

- turn the brand into neon fantasy
- oversaturate red or gold
- add big glowing outlines
- use oversized rounded “mobile app” capsules everywhere
- make the UI feel noisy or ornamental

## File Reference

This brand kit was extracted from the current implementation in:

- `src/styles.scss`
- `src/app/shared/components/site-shell/site-shell.component.scss`
- `src/app/shared/components/site-shell/site-shell.component.html`
- `src/app/features/command-catalog/command-catalog.component.scss`
- `src/app/features/command-catalog/components/command-card/command-card.component.scss`
- `src/app/features/command-catalog/components/command-toolbar/command-toolbar.component.scss`

When the live UI changes, update this file so prototypes stay synchronized with the real product.
