# TSDW Sports — v0 Context

## 1. Purpose

This document provides compressed product context for AI-assisted UI prototyping.

It is NOT the complete project specification.

Detailed requirements remain in the main project documentation.

---

## 2. Product

**TSDW Sports** is the sports platform for the Thakur Students Development & Welfare (TSDW) Sports Committee at TCET.

The platform manages and presents college sports events including:
- TSpark
- National Sports Day
- Reflex

It includes:
1. A public sports website
2. An administrative sports-management interface

---

## 3. Product Goal

The platform should provide one long-term system for:
- Events
- Competitions
- Fixtures
- Schedules
- Live scores
- Tournament brackets
- Results
- Winners
- Department standings
- TCET sports-team achievements
- Committee history
- Future participant services such as E-Certificates

Historical records must remain available across years.

---

## 4. Core Domain Hierarchy

Use this mental model:

```text
Event
└── Event Edition
    └── Competition
        ├── Entrants
        ├── Fixtures
        ├── Tournament Structure
        ├── Results
        └── Placements
```

Example:

```text
TSpark
└── TSpark 2027
    └── Men's Football
        ├── CMPN
        ├── IT
        ├── AIML
        └── MECH
```

Do not flatten these concepts into one generic "event".

---

## 5. Events and Editions

`TSpark` is a recurring Event.

`TSpark 2027` is an Event Edition.

Historical editions must remain independent.

The latest/current edition receives visual priority. Older editions remain accessible.

---

## 6. Competitions

An Event Edition contains multiple Competitions.

Example:

```text
TSpark 2027

Outdoor
├── Men's Football
├── Women's Football
├── Cricket
└── Volleyball

Indoor
├── Chess
├── Carrom
└── Table Tennis
```

Competition groups are configurable.

Do not hardcode Indoor and Outdoor as the only possible groups.

---

## 7. Fixtures

Fixtures represent competitive encounters.

Common states:

```text
SCHEDULED
LIVE
COMPLETED
POSTPONED
CANCELLED
WALKOVER
```

Multiple Fixtures may be LIVE simultaneously.

Scheduled Fixtures should display:

```text
CMPN
vs
IT
```

not:

```text
CMPN 0–0 IT
```

Walkovers must not use fake scores.

---

## 8. Results

Live score and official Result are separate concepts.

A Fixture may have a changing live score while LIVE.

Official Result exists after finalisation.

Public UI must consume official state rather than independently determining winners.

---

## 9. Knockout Competitions

Knockout competitions may contain:

```text
Quarter Finals
Semi Finals
Final
```

Future participants may initially be unresolved.

Example:

```text
Semi Final

Winner of QF1
vs
Winner of QF2
```

Later:

```text
CMPN
vs
IT
```

BYEs are bracket structure, not fake teams.

---

## 10. Public Website

The public website is a live sports platform, not a static college information site.

During active events, homepage priority is:

```text
1. Active Event
2. Live Fixtures
3. Today's / Upcoming Fixtures
4. Recent Results
5. Event navigation
6. Achievements
7. General content
```

Public sports information does not require login.

---

## 11. Public Core Pages

The eventual public experience includes:

```text
Home
Events
Event Edition
Competition
Fixtures / Schedule
Fixture Detail
Results
Achievements
Sports / Teams
Committee / About
```

The first prototype does not need every page.

---

## 12. Event Pages

Event Edition pages should support:

```text
Overview
Live
Schedule
Competitions
Results
Standings
```

depending on available data and Event state.

Completed editions prioritise:

```text
Winners
Results
Standings
Historical Fixtures
```

---

## 13. Competition Pages

Competition pages may include:

```text
Competition identity
Entrants
Bracket
Fixtures
Results
Winner
Rules
```

The UI must adapt to Competition format.

---

## 14. Live Experience

Live information must be immediately readable.

Example:

```text
LIVE

MEN'S FOOTBALL
Quarter Final

CMPN     2
IT       1

Football Ground
```

Scores should receive stronger visual priority than metadata.

---

## 15. Historical Pattern

Across the platform:

```text
Current / Latest
→ highlighted

Previous years
→ visually secondary / collapsible
```

This applies to:
- Event Editions
- Achievements
- Committee history

Historical data must not disappear.

---

## 16. Achievements

The platform presents achievements of official TCET sports teams.

Official college teams are conceptually different from department/team entrants in an Event Competition.

Prototype achievement data must be clearly fictional/sample data unless verified.

---

## 17. Committee

The platform presents current and historical TSDW Sports organising teams.

Committee positions are NOT equivalent to software permissions.

Do not expose internal access roles publicly.

---

## 18. Admin Interface

The Admin Dashboard is an operational sports-management interface.

Core workflow:

```text
Create Event Edition
→ Configure Competitions
→ Add Entrants
→ Create Tournament Structure
→ Schedule Fixtures
→ Publish
→ Operate Event
→ Update Scores
→ Finalise Results
→ Complete Competition
→ Complete Event
```

---

## 19. Admin Roles

Conceptual operational roles include:

```text
System Administrator
Sports Administrator
Event Manager
Scorekeeper
```

UI visibility should reflect permissions.

Backend security is outside the UI prototype.

---

## 20. Scorekeeper Experience

Scorekeepers need a focused mobile-friendly workflow:

```text
My Fixtures
→ Open Fixture
→ Start Match
→ Update Score
→ Complete Match
→ Review Result
```

Avoid exposing unrelated administration.

---

## 21. Design System

Read:

```text
docs/ui/design-system.md
```

before generating interface code.

Important principles:
- Dark-first
- Monochrome permanent shell
- Event Edition theming
- Information-first
- Sports/broadcast visual language
- Mobile-first live experience
- Moderate radii
- Border-driven cards
- Minimal gradients
- No generic SaaS aesthetic
- No neon gaming aesthetic

---

## 22. Event Themes

Do NOT invent a permanent TSpark, Reflex, or National Sports Day colour palette.

Event themes may change by Event Edition.

The core application must remain neutral enough to support changing Event identities.

For prototype purposes, use a restrained temporary Event accent only where necessary.

Do not allow the temporary accent to redefine the permanent platform design.

---

## 23. Prototype Data

Representative mock data may use:

```text
TSpark 2027
```

with sample departments such as:

```text
CMPN
IT
AIML
MECH
EXTC
```

and representative sports.

Mock data exists only to demonstrate interface states.

Do not present invented achievements, participant names, or institutional claims as factual.

---

## 24. Prototype Architecture

For UI prototypes:
- Use mock/local data
- Build reusable components
- Keep data separate from presentation
- Do not build a production backend
- Do not invent API architecture
- Do not implement authentication
- Do not implement realtime infrastructure
- Do not implement certificate generation

The production architecture is defined elsewhere.

---

## 25. Reusable UI Concepts

Prefer reusable components such as:

```text
StatusBadge
FixtureCard
Scoreboard
EventCard
CompetitionCard
ResultCard
AchievementCard
BracketView
ScheduleList
SectionHeader
EmptyState
```

Admin may additionally use:

```text
DataTable
FilterBar
EntityHeader
ConfirmDialog
ActivityTimeline
ScoreControl
```

Do not create duplicate page-specific implementations of the same domain concept.

---

## 26. Responsive Requirements

Design intentionally for:

```text
Mobile
Tablet
Desktop
```

Pay particular attention to:
- Navigation
- Fixture cards
- Live scores
- Schedule
- Brackets
- Results

Do not simply shrink desktop layouts.

---

## 27. Source of Truth

This file is compressed context only.

For detailed requirements consult:

```text
docs/00-overview.md
docs/01-requirements.md
docs/02-system-architecture.md
docs/03-data-model.md
docs/04-auth-and-rbac.md
docs/05-events-and-seasons.md
docs/06-sports-and-competitions.md
docs/07-fixtures-and-tournaments.md
docs/18-admin-dashboard.md
docs/19-public-website.md
docs/26-roadmap.md
docs/27-decisions.md
```

Only read detailed documents when relevant to the task being implemented.

Do not reinterpret or override documented domain rules from incomplete UI assumptions.

---

## 28. Current Prototype Strategy

AI-assisted UI generation should happen incrementally.

Do not attempt to generate the entire production platform in one pass.

Each generation should:

1. Read this context.
2. Read the design system.
3. Read only task-relevant detailed documentation if necessary.
4. Preserve existing project architecture and components.
5. Implement the requested scope only.
6. Avoid unrelated feature generation.
