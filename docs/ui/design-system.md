# TSDW Sports — Design System

## 1. Purpose

This document defines the visual and interaction foundation of the TSDW Sports platform.

It applies to:
- Public website
- Admin dashboard
- Live scoring interfaces
- Future participant-facing interfaces

The system should remain visually consistent across the platform while allowing individual Event Editions to introduce their own themes.

This document is the primary UI design reference for implementation and AI-assisted UI generation.

---

## 2. Design Direction

TSDW Sports should feel:
- Modern
- Competitive
- Athletic
- Fast
- Information-focused
- Institutionally credible
- Premium without being decorative

The visual direction is:

> Modern sports broadcast × live data platform × editorial sports design

It should NOT resemble:
- A generic college website
- A college ERP
- A generic SaaS dashboard
- A neon gaming interface
- A cyberpunk interface
- A template-heavy event landing page
- A glassmorphism showcase

The interface should prioritise sports information over decoration.

---

## 3. Brand Architecture

TSDW Sports uses two visual layers:

```text
TSDW SPORTS PLATFORM
│
│  Permanent
│  Monochrome
│  Consistent
│
└── EVENT EDITION
    │
    │  Themeable
    │  Changes independently
    │
    ├── TSpark 2027
    ├── Reflex 2027
    └── National Sports Day 2027
```

The permanent platform UI should remain predominantly monochrome.

Individual Event Editions may introduce colours, artwork, patterns, typography accents, and graphic motifs without redesigning the underlying platform.

---

## 4. Core Colour System

The platform is dark-first and monochrome.

### Background

| Token | Value |
|---|---|
| Canvas | `#090909` |
| Surface | `#111111` |
| Surface Elevated | `#181818` |
| Surface Hover | `#202020` |

### Borders

| Token | Value |
|---|---|
| Border | `#292929` |
| Border Strong | `#3A3A3A` |

### Text

| Token | Value |
|---|---|
| Text Primary | `#F5F5F5` |
| Text Secondary | `#A3A3A3` |
| Text Muted | `#737373` |
| Text Disabled | `#525252` |

### Absolute Colours

| Token | Value |
|---|---|
| White | `#FFFFFF` |
| Black | `#000000` |

Pure black and pure white should not be the default page background/text pair. Near-black and off-white reduce visual harshness.

---

## 5. Semantic Colours

Colour outside Event themes should primarily communicate meaning.

| Meaning | Value |
|---|---|
| Live / Error | `#EF4444` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Info | `#3B82F6` |

Examples:
- Red → LIVE, destructive operation, error
- Green → success, confirmed
- Amber → warning, attention required
- Blue → informational state

Status must never depend on colour alone. Pair colour with text, icons, labels, or shape where appropriate.

---

## 6. TSDW Identity

Official TSDW branding may retain its existing blue/orange identity in assets such as:
- TSDW logo
- Institutional branding areas
- About pages
- Footer attribution

The entire platform UI should NOT derive its palette from the logo.

The monochrome interface acts as a neutral environment around both institutional branding and changing Event themes.

---

## 7. Event Theme Tokens

Event Editions may define optional theme tokens.

```css
--event-primary
--event-secondary
--event-accent
--event-background
--event-foreground
```

These tokens must not replace core semantic colours.

For example, if `--event-accent` is purple, LIVE still uses the platform's semantic live state rather than purple.

---

## 8. Event Theme Scope

Event theming may affect:
- Event hero
- Event title
- Decorative graphics
- Event badges
- Section accents
- Selected Event navigation
- Bracket accents
- Event-specific promotional surfaces

Event theming should NOT arbitrarily recolour:
- Error states
- Success states
- Warning states
- Admin destructive actions
- Core accessibility states

---

## 9. Theme Evolution

Themes belong to Event Editions, not necessarily recurring Events.

Therefore, TSpark 2027 may look different from TSpark 2028 while both remain inside the same TSDW Sports interface.

This supports annual creative themes without requiring application redesign.

---

## 10. Typography

The interface uses two typographic roles.

### Display

Used for:
- Event names
- Major page titles
- Scores
- Competition titles
- Large statistics

Characteristics:
- Strong
- Athletic
- Compact where appropriate
- High visual impact

### Interface

Used for:
- Navigation
- Body text
- Tables
- Forms
- Metadata
- Buttons
- Administrative interfaces

Characteristics:
- Highly readable
- Neutral
- Clear at small sizes

Do not use novelty sports fonts throughout the interface.

---

## 11. Initial Font Strategy

Until final branding typography is selected, prefer modern open-source fonts available through standard web delivery.

Potential direction:
- Display: Barlow Condensed, Archivo, or similar
- Interface: Inter, Geist, or similar

The implementation should centralise font configuration so typography can be replaced later.

Do not hardcode font families throughout individual components.

---

## 12. Type Hierarchy

Approximate hierarchy:

| Role | Size |
|---|---|
| Display / Hero | 48–72px desktop, 36–48px mobile |
| Page Title | 32–48px |
| Section Title | 24–32px |
| Card Title | 16–20px |
| Body | 14–16px |
| Metadata | 12–14px |

Exact values should use a consistent responsive type scale.

Scores may exceed normal heading sizes where appropriate.

---

## 13. Scores

Scores are among the most important information on the platform.

They should be:
- Large
- High contrast
- Immediately scannable
- Visually separated from metadata

Prefer:

```text
CMPN       2
IT         1
```

over prose when presenting match state.

---

## 14. Spacing

Use a consistent 4px-based spacing system.

Common increments:

```text
4
8
12
16
20
24
32
40
48
64
80
```

Avoid arbitrary spacing values unless required by a specific layout.

---

## 15. Content Width

Public editorial/sports pages should use a constrained content width on large screens.

Very wide screens should not cause fixture information to stretch excessively.

Admin interfaces may use more horizontal space for tables, brackets, scheduling, and operational dashboards.

---

## 16. Border Radius

Use moderate radii.

| Size | Value |
|---|---|
| Small | 6px |
| Default | 8px |
| Large | 12px |

Avoid excessive 20px+ rounded cards across the interface.

Pills remain appropriate for status badges, compact filters, and tags.

---

## 17. Borders

Borders should provide most surface separation.

Default:

```text
1px solid #292929
```

Stronger boundaries may use `#3A3A3A`.

Avoid excessive card shadows.

---

## 18. Shadows

Dark surfaces should rely primarily on contrast, borders, spacing, and hierarchy rather than large shadows.

Subtle shadows may be used for:
- Menus
- Dialogs
- Floating elements

Do not make every card appear to float.

---

## 19. Cards

Cards should be:
- Structured
- Compact
- Information-first
- Border-driven
- Low-decoration

Default concept:

```text
Background: #111111
Border:     #292929
Radius:     8–12px
```

Hover states may use `#181818` or `#202020` depending on interaction importance.

---

## 20. Fixture Cards

Fixture cards should prioritise:

```text
Status
Competition
Entrants
Score / Time
Venue
```

### Scheduled

Show:

```text
CMPN
vs
IT
```

Do NOT display `0–0` before play begins.

### Live

Show:

```text
LIVE

CMPN  2
IT    1
```

### Completed

Show:

```text
FINAL

CMPN  2
IT    1
```

Identify the winner without relying solely on colour.

### Walkover

Show the official outcome without inventing a score.

---

## 21. Buttons

Buttons should be visually simple.

### Primary
- High contrast
- Strong label
- Reserved for the primary action

### Secondary
- Dark surface
- Visible border

### Ghost
- Minimal background
- Lower-priority actions

### Destructive
- Semantic red treatment
- Explicit action wording

Avoid gradients on standard buttons.

---

## 22. Button Language

Prefer explicit labels such as:
- View Match
- Create Competition
- Start Match
- Complete Match
- Cancel Fixture
- Correct Result

Avoid vague labels such as Continue, Proceed, Submit, or OK when a more specific action is possible.

---

## 23. Navigation

Public navigation should be:
- Compact
- Clear
- Stable
- Secondary to Event/live content

Desktop may use a horizontal navigation bar.

Mobile should use an appropriate compact navigation pattern.

Navigation should not consume excessive vertical space.

---

## 24. Admin Navigation

Admin interfaces may use a sidebar on desktop.

Navigation should be:
- Role-aware
- Context-aware
- Operationally organised

Do not expose every database entity as an equal menu item.

---

## 25. Icons

Use a consistent outline icon family.

Suitable uses include:
- Calendar
- Venue
- Trophy
- Clock
- Chevron
- Search
- Filters
- Navigation
- Status actions

Icons should support comprehension rather than decoration.

---

## 26. Imagery

Images may support:
- Event branding
- Achievements
- Teams
- Committee
- Historical highlights

Operational content should not depend on imagery.

Live scores, schedules, and results must remain useful without images.

---

## 27. Gradients

Core platform UI should use little or no gradient styling.

Event themes may use controlled gradients where their visual identity requires them.

Avoid generic colourful gradient backgrounds.

---

## 28. Glassmorphism

Do not use glassmorphism as the core visual language.

Backdrop blur may be used selectively for overlays/navigation where functionally useful.

Cards should not become translucent floating glass panels by default.

---

## 29. Motion

Motion should communicate:
- State change
- Navigation
- Expansion
- Reordering
- Live updates

Motion should be subtle and fast.

Avoid decorative animation that delays access to scores or schedules.

---

## 30. Live Updates

When a score changes, a subtle transition may help users notice the update.

Avoid:
- Flashing interfaces
- Large bouncing score animations
- Constant glowing elements

Live state itself should remain visible through a clear status indicator.

---

## 31. Responsive Design

The platform must intentionally support:
- Mobile
- Tablet
- Desktop

Mobile is a first-class target for:
- Public fixtures
- Live scores
- Schedules
- Results
- Scorekeeper interface

Desktop is especially important for:
- Administration
- Brackets
- Scheduling
- Data management

---

## 32. Mobile Principles

Prioritise:
- Large touch targets
- Compact navigation
- Readable scores
- Minimal horizontal overflow
- Short interaction paths
- Efficient filters

Do not simply scale desktop interfaces down.

---

## 33. Brackets

Desktop may use traditional horizontal tournament brackets.

Mobile should use horizontally navigable rounds, stacked rounds, or another readable adaptive representation.

Do not shrink an entire desktop bracket to fit the screen.

---

## 34. Tables

Tables are appropriate for:
- Standings
- Admin data
- Historical results
- Users
- Fixtures where density matters

On mobile, use responsive tables, horizontal scrolling where justified, or card/list transformation depending on information density.

---

## 35. Status Badges

Statuses should use consistent components.

Examples:

```text
LIVE
UPCOMING
FINAL
POSTPONED
CANCELLED
DRAFT
PUBLISHED
```

Use text plus visual styling.

Do not communicate status through colour alone.

---

## 36. Empty States

Empty states should explain context.

Prefer:

```text
No fixtures are live right now.

Next match starts at 11:30.
```

over:

```text
No data.
```

---

## 37. Loading States

Loading must be visually distinct from empty state.

Use skeletons, compact loaders, or appropriate placeholders.

Do not temporarily show zero scores or "No fixtures" while data is loading.

---

## 38. Accessibility

Minimum requirements:
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper form labels
- Accessible dialogs
- Sufficient contrast
- Text status labels
- Reduced-motion support where appropriate

Accessibility should be built into reusable components.

---

## 39. Public vs Admin Visual Relationship

Public and Admin interfaces share:
- Typography
- Core colours
- Components
- Status language
- Spacing
- Interaction principles

But they optimise for different goals.

### Public
More editorial, Event-driven, visual, and sports-oriented.

### Admin
More dense, operational, functional, and data-oriented.

They should still clearly belong to the same product.

---

## 40. Implementation Tokens

Prefer semantic variables:

```css
--background
--surface
--surface-elevated
--surface-hover

--border
--border-strong

--foreground
--foreground-secondary
--foreground-muted

--live
--success
--warning
--info

--event-primary
--event-secondary
--event-accent
```

Components should consume semantic tokens rather than hardcoded colours wherever practical.

---

## 41. Light Theme

A light theme is not required for V1.

The token architecture should avoid making a future light theme unnecessarily difficult.

Do not spend initial implementation effort designing parallel dark/light experiences.

---

## 42. Design Invariants

### DS-001
The permanent platform is dark-first and predominantly monochrome.

### DS-002
Event Edition themes are visually independent from the permanent platform palette.

### DS-003
Semantic state colours must not be overridden by Event themes.

### DS-004
Scores receive strong visual priority.

### DS-005
Scheduled Fixtures must not visually imply a 0–0 score.

### DS-006
Cards should be information-first rather than decorative.

### DS-007
Mobile is a first-class target.

### DS-008
Event theming must not require redesigning core components.

### DS-009
The UI should avoid generic SaaS aesthetics.

### DS-010
Accessibility is part of the component system.

---

## 43. Current Status

**Status: Initial Baseline**

The permanent monochrome visual system, Event-theme architecture, typography direction, spacing, surfaces, components, responsive principles, and interaction direction are established.

Specific Event Edition themes will be defined independently.
