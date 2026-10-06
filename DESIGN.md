# E-Compressor Unit Support Portal: Design System

A static site (HTML, CSS, vanilla JS) on GitHub Pages. Technicians usually open it on a phone by scanning a unit's QR code (`?serial=63KZ-14600`).

**Principle:** when choosing between decorative and functional, choose functional. The portal should read like equipment documentation from an industrial manufacturer, not a marketing page.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and static components (Header, UnitSearch, SectionHeader, SupportPanel, Footer) |
| `style.css` | All styles: tokens → base → layout → components → utilities |
| `js/data.js` | **Edit this to add units**, documents, training videos and product attributes |
| `js/components.js` | `UI.*` template functions for components rendered from data |
| `main.js` | Serial lookup, `?serial=` handling, rendering |

Scripts are plain `<script>` tags (no build step, no modules), so the site works on the custom domain, on `ekmuguti.github.io/e-compressor-qr/`, and when opened from disk. Keep all asset paths **relative** (`manuals/…`, `js/…`), with no leading `/`.

## Colour

| Token | Value | Use |
|---|---|---|
| `--navy-950` | `#061426` | Text on cyan (hover play button) |
| `--navy-900` | `#0A1F3A` | Headings, primary buttons, structural rules |
| `--navy-800` | `#15335A` | Primary button hover |
| `--blue-600` | `#0068B3` | Links, eyebrow labels, actions (AA contrast on white) |
| `--cyan-500` | `#00A9E0` | Air2Work cyan: focus rings, eyebrow marker, small cues only |
| `--surface` | `#FFFFFF` | Default background |
| `--surface-muted` | `#F3F5F8` | Alternate bands, search panel, row hover |
| `--border` / `--border-strong` | `#DCE2E9` / `#B9C3CF` | 1px dividers / input and control borders |
| `--text-primary` / `--text-secondary` | `#0F1B2D` / `#4B5B6E` | Body / supporting text |
| `--status-ok/warn/info/accent/error` | green / amber / blue / cyan / red | Status markers and error notice only |

Rules: never use cyan as a large background or for body text (it fails contrast on white). Don't add new hues. Status colours are for status only.

## Typography

- **Inter** for UI text; **JetBrains Mono** for serial numbers, procedure numbers and file types (`.mono`).
- Page title (`.intro__title`): 30–46px, 700, tight tracking (-0.025em). A serial heading switches to mono (`.is-serial`).
- Section heading (`.section-header__title`): 22–28px, 600.
- Body: 15–17px. Supporting text uses `--text-secondary`.
- Technical labels (eyebrows, metadata labels): 11–12px, 600, uppercase, 0.08–0.1em tracking.
- Keep long product names and serials on one line with `.nowrap`.

## Spacing, shape and elevation

- 4px scale: `--space-1` (4) … `--space-8` (64). Bands use 32px (mobile) or 48px (≥720px) vertical padding.
- Container: `--container` 1200px max, 16px gutters (mobile), 32px (≥720px).
- Radius: `--radius-sm` 2px (buttons, inputs) and `--radius` 4px (video cards, play button). Nothing rounder.
- No drop shadows, gradients or glass effects. Separate content with 1px borders and alternating `--surface` / `--surface-muted` bands.
- Use a 3–4px navy rule (top or left) to mark a key panel (search, support, document tiles).

## Layout

Page rhythm, top to bottom: Header → Intro/lookup → *(Unit documents + support, when a serial is loaded)* → Operator training → Product information → Footer.

Each section is a full-width `.band` (alternate with `.band--muted`) wrapping a `.container`. Don't wrap whole sections in floating cards.

Breakpoints: 720px (video cards switch to three-across, bigger gutters) and 900px (two-column intro and unit layouts). Single-column grids use `grid-template-columns: minmax(0, 1fr)` so content can't force horizontal scroll.

## Components

| Component | Where | Notes |
|---|---|---|
| **Header** | `.site-header` (HTML) | Logo left, uppercase identifier right, 1px bottom border |
| **Eyebrow** | `.eyebrow` | Small blue uppercase label with a cyan 16×2px marker. Use above headings |
| **SectionHeader** | `.section-header` (HTML) | `.eyebrow` + `__title` + optional `__desc` |
| **UnitSearch** | `.unit-search` (HTML) | Visible label, 52px mono input, primary button, hint with example serial. Submitting updates `?serial=` |
| **Metadata** | `UI.metaItem()` in `<dl class="meta">` | Data-plate grid; stacks to label/value rows below 560px |
| **Status** | `UI.status(text)` | Square marker + text. Tone from `STATUS_TONES` in `data.js` (`ok`, `warn`, `info`, `accent`, else neutral) |
| **DocumentRow** | `UI.documentRow(doc)` in `<ul class="doc-list">` | Whole row is the link (≥76px tall). Shows type, optional `revision`/`date`, size (`meta`) and a visible "View" action |
| **SupportPanel** | `.support-panel` (HTML) | Title, short instruction, stacked full-width buttons (primary = incident form) |
| **TrainingVideoCard** | `UI.trainingVideoCard(video)` in `<ol class="video-grid">` | YouTube thumbnail with flat navy tint (navy fallback if it fails), square play control, procedure number, title, description, "Watch video". Becomes a compact row below 720px |
| **Product attributes** | `UI.attribute()` in `<dl class="attrs">` | Label/value with a 2px navy top rule. Not pills |
| **Notice** | `.notice` | Error message, red left rule |
| **Buttons** | `.btn` + `--primary` / `--secondary` (+ `--block`) | 48px minimum height |
| **Footer** | `.site-footer` | One line: copyright + internal-use note |

Component functions escape their input with `UI.esc()`. Use it for any new data-driven markup.

## Accessibility

- Never remove focus outlines: global `:focus-visible` is a 3px cyan outline. The search input uses a navy border plus a cyan ring.
- Touch targets are at least 48px (`--touch`). The search controls are 52px for gloved use.
- Every action is visible without hover ("View", "Watch video", play control).
- One `h1` per page, `h2` per section. Inputs have `<label>`s. Icons are `aria-hidden`. A skip link goes to `#main`.
- Respect `prefers-reduced-motion`. Transitions are limited to colour and border changes.

## Common tasks

- **Add a unit:** add `{ serial: "63KZ-16400", status: "Available" }` to `UNIT_DATA` in `js/data.js`.
- **New status value:** add it to `STATUS_TONES` (lowercase key).
- **Per-unit document:** override `documents` on that unit, e.g. `documents: [DOCUMENTS.operations, { title: "Test certificate", type: "PDF", date: "Sep 2026", href: "manuals/63KZ-16400-cert.pdf" }]`.
- **New training video:** add to `TRAINING_VIDEOS` with its YouTube ID.
- **New page:** copy the Header, Footer and `.band` / `.container` structure, start each section with a `.section-header`, and reuse the existing components before writing new CSS. Add new styles to the Components section of `style.css`, using tokens rather than raw values.
- **Cache busting:** bump the `?v=` query on the CSS/JS links in `index.html` after changing them.
