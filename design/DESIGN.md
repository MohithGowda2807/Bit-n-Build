# OceanSentinel — Design System

> Satellite console at midnight. The map is the only light source; everything else is layered darkness, one signal blue, and a small set of risk colors that mean exactly one thing.

**Base:** Mapbox style reference (dark, layered surfaces, single accent, pill buttons vs sharp badges).
**Borrowed from Checkly:** JetBrains Mono for data, hairline structure on dense panels, the status pill.
**Theme:** dark only.

## 1. Principles

1. **The map is the light source.** Panels float over a dark basemap as surfaces, never as bordered boxes. The brightest things on screen are the observed track, the estimated dark segment, and zone outlines.
2. **Blue means "you can act on this".** Signal Blue (`#007afc`) is reserved for primary actions, active tabs, selection rings, and links. It is never decoration and never a status.
3. **Risk colors mean "how worried to be".** Five semantic steps plus one green. They appear only on risk numbers, level badges, evidence weights, zone outlines, and map markers. Nothing else may use them.
4. **Depth by surface, not shadow.** Four dark steps stack panels. The only shadow is the Mapbox inset vignette that dissolves media into the page.
5. **Numbers are data.** Every figure a human compares (scores, timestamps, distances, coordinates, MMSI) is set in JetBrains Mono with tabular figures.
6. **Suspicion, not verdict.** Copy says "risk", "indicator", "suspected", "possible". Never "illegal", "guilty", "confirmed".

## 2. Color

### Surfaces (Mapbox)

| Level | Name | Value | Use |
|------:|------|-------|-----|
| 0 | Void | `#0e1012` | Page, top bar, map frame |
| 1 | Deep Panel | `#15171b` | Floating panels, cards |
| 2 | Raised | `#1c1f24` | Nested rows, inputs, hover on panels, subtle panel edge |
| 3 | Overlay | `#23262d` | Menus, tooltips, pressed states |

### Text (Mapbox)

| Name | Value | Use |
|------|-------|-----|
| White | `#ffffff` | Headings, vessel names, button labels, and data set in mono (scores, times, distances) so it stands out from Fog body |
| Fog | `#a0aaba` | Body copy, evidence text |
| Ash | `#8b96aa` | Captions, secondary metadata |
| Slate | `#566171` | Eyebrow labels, disabled, tertiary |
| Steel | `#333943` | Inactive icons, muted strokes |
| Pewter | `#444d5a` | Outlined chip borders, rule lines |

### Interactive (Mapbox)

| Name | Value | Use |
|------|-------|-----|
| Signal Blue | `#007afc` | Primary pill button, active tab, selected vessel ring, links (hover `#3d9bff`) |
| Deep Signal | `#0062ca` | Pressed primary, info badge |

### Semantic: risk (OceanSentinel addition)

Same lightness band, hue steps only. Used for the risk score, level badge, evidence weight, event-type badge, map marker, zone outline and the map label of the object they describe, and nothing else. Inline in prose, a level is always a badge, never colored text.

| Level | Name | Value | On-dark tint (12%) |
|-------|------|-------|--------------------|
| LOW | Fog | `#a0aaba` | `rgba(160,170,186,0.12)` |
| MODERATE | Amber | `#e2a33a` | `rgba(226,163,58,0.12)` |
| ELEVATED | Tangerine | `#f0873a` | `rgba(240,135,58,0.12)` |
| HIGH | Coral | `#f2643e` | `rgba(242,100,62,0.12)` |
| CRITICAL | Alarm | `#f0483e` | `rgba(240,72,62,0.12)` |
| Clear / authorized | Map Green | `#2fae6e` | `rgba(47,174,110,0.12)` |

Map encodings: observed track `#ffffff` at 1.5px; estimated (no AIS) segment Amber `#e2a33a` dashed 4/6; prohibited zone outline Alarm at 1px with 8% fill; restricted zone outline Amber; authorized ground outline Map Green; other vessels Fog dots with a Void stroke; selected vessel Signal Blue ring.

## 3. Typography

Cera Pro is proprietary. Its documented substitute is Plus Jakarta Sans, which the app already loads; use it everywhere Mapbox uses Cera Pro. Data uses JetBrains Mono (Checkly).

| Role | Face | Size / line | Weight | Tracking | Use |
|------|------|-------------|--------|----------|-----|
| display | Plus Jakarta Sans | 44 / 1.14 | 700 | -0.88px | Risk score on a case, replay clock |
| heading | Plus Jakarta Sans | 24 / 1.33 | 700 | -0.01em | Vessel name in a panel |
| subheading | Plus Jakarta Sans | 18 / 1.4 | 500 | 0 | Panel titles |
| body | Plus Jakarta Sans | 15 / 1.6 | 400 | 0 | Evidence lines, explanations |
| label | Plus Jakarta Sans | 14 / 1.43 | 500 | 0 | Buttons, tabs, list names |
| eyebrow | Plus Jakarta Sans | 10 / 1.6 | 700 | +1px, uppercase | Section labels, badge text |
| data | JetBrains Mono | 13 / 1.5 | 400 | 0 | Scores in lists, timestamps, MMSI, coordinates, distances |
| data-lg | JetBrains Mono | 20 / 1.2 | 500 | 0 | Watchlist risk numbers |

Body is never pure white. Headings and interactive labels are.

## 4. Shape and space

| Element | Value |
|---------|-------|
| Floating panels, cards | 24px radius, surface 1, optional 1px edge in surface 2 |
| Inputs, icon-frame buttons | 6px radius, 1px `#444d5a` border |
| Chips, filter pills, buttons | 100px radius |
| Badges (LIVE, level tags) | 4px radius, eyebrow type |
| Base unit | 4px. Panel padding 20px, element gap 12px, panel gap 16px |
| Map frame | Full bleed. Panels inset 16px from frame edges |

No radius between 6px and 12px on controls. No decorative dividers between sections: use spacing and surface change. Inside dense lists a 1px `#1c1f24` row separator is allowed (Checkly hairline).

## 5. Components

- **Primary pill.** `#007afc` fill, white label 14/500, 10px 20px padding, 100px radius. One per panel.
- **Outlined pill.** Transparent, 1px `#bbc2ce` border, white label. Hover border white.
- **Ghost link.** Signal Blue text, trailing arrow, no frame.
- **Icon frame.** 32px square, 6px radius, 1px `#444d5a`, Fog icon. Layer toggles, zoom, close.
- **Filter pill.** Inactive: transparent, 1px `#444d5a`, Fog label. Active: Signal Blue fill, white label.
- **Badge.** 4px radius, 10px eyebrow, 4px 7px padding. LIVE uses Map Green fill; info uses Deep Signal.
- **Risk badge.** 4px radius, level color at 12% tint, level color text, eyebrow type: `CRITICAL`.
- **Risk number.** data-lg or display, colored by level.
- **Factor bar.** 4px tall, segments in the factor's level color, 2px gaps, proportional to the factor weights. Weights can total more than 100 (the engine caps the score), so the bar shows shares, not a sum.
- **Evidence row.** Weight in data (`+35`) colored by its factor level, 32px column, then body text in Fog.
- **Watchlist row.** 56px, risk number left, name in white label, top factor in Ash caption, level badge right. Selected row: surface 2 with a 2px Signal Blue left inset.
- **Event row.** Timestamp in data Slate, event type badge, one line of Fog text.
- **Vessel panel.** Eyebrow identity line, heading name, risk number and badge, factor bar, evidence list, footer actions: primary pill, outlined pill, ghost link.
- **Replay bar.** 56px floating pill-cornered panel: play icon frame, mono start time, 2px track with white progress and amber dark-window marker, mono end time, speed chip.
- **Analyst panel.** Question input (surface 2, 6px). Operator questions in a surface-3 bubble, 12px radius with a 4px tail corner, Fog at weight 500. Answers in body Fog with data in white mono, provider badge (`GROQ`, Deep Signal) and the tools used under each answer.

## 6. Icons

Stroke icons on a 20px grid, 1.5px stroke, Fog by default, white when active. No emoji, no filled glyphs.

## 7. Motion

One reveal: panels fade and rise 8px over 240ms when they appear. Replay markers move with 200ms linear tweens. Nothing else animates except the LIVE dot's 2s pulse.

## 8. Deviations from Mapbox, and why

1. Risk semantic scale and Map Green as a status color. A surveillance console cannot express "how worried to be" in one hue.
2. JetBrains Mono for data. Mapbox is single-face; a console compares numbers constantly.
3. Hairline row separators inside dense lists. Mapbox has no lists this dense.
