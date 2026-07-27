# TSDW Sports Platform — Sports & Competitions

## 1. Purpose

This document defines how the **TSDW Sports Platform** models sports, classifications, competitions, divisions, entrants, formats, eligibility, lifecycle, and competition-level outcomes.

It establishes:

* Sport identity
* Sport classifications
* Competition identity
* Competition divisions/categories
* Entrant models
* Department representation
* Team and individual competitions
* Gender/category handling
* Competition formats
* Competition lifecycle
* Competition configuration
* Competition placements
* Competition-level rules
* Historical behaviour
* Administrative workflows
* Important invariants

Fixture scheduling, brackets, match progression, and detailed match state are defined separately in `07-fixtures-and-tournaments.md`.

---

# 2. Core Hierarchy

The primary competition hierarchy is:

```text
Event
  ↓
EventEdition
  ↓
Competition
  ↓
CompetitionEntry
  ↓
Fixtures / Results / Placements
```

A Competition references a reusable Sport.

Conceptually:

```text
EventEdition
TSpark 2027
    │
    ├── Competition
    │     Men's Football
    │       │
    │       └── Sport
    │           Football
    │
    └── Competition
          Women's Football
              │
              └── Sport
                  Football
```

The Sport and Competition are distinct concepts.

---

# 3. Sport

## Entity

`Sport`

## Purpose

Represents the persistent identity of a sport or supported competitive activity.

Examples:

```text
Football
Cricket
Basketball
Volleyball
Chess
Carrom
Table Tennis
Valorant
```

A Sport can appear across multiple events and years.

---

# 4. Sport Data

Potential Sport information includes:

```text
Sport
├── id
├── name
├── slug
├── description
├── active
└── presentation metadata
```

Competition-specific rules must not be stored directly on the reusable Sport unless they genuinely apply to every use of that Sport.

---

# 5. Sport vs Competition

This distinction is fundamental.

`Football` is a Sport.

These are Competitions:

```text
TSpark 2027 Men's Football
TSpark 2027 Women's Football
TSpark 2028 Men's Football
```

Conceptually:

```text
Sport
Football
   │
   ├── Competition A
   ├── Competition B
   └── Competition C
```

The Sport provides reusable identity.

The Competition represents a specific contest within an Event Edition.

---

# 6. Sport Classification

Sports may be classified for navigation and event organisation.

Known classifications include:

```text
Indoor
Outdoor
Esports
```

Future classifications may include:

```text
Recreational
Fun Games
```

if actual event structures require them.

---

# 7. Classification Model

Classification should not be encoded as permanent boolean fields such as:

```text
isIndoor
isOutdoor
isEsport
```

because those fields do not scale well as categories evolve.

A controlled classification model should instead be used.

Potential concept:

```text
SportClassification
├── Indoor
├── Outdoor
└── Esports
```

The physical implementation may use:

* Enum
* Reference entity
* Many-to-many relationship

depending on actual classification requirements.

---

# 8. Classification Context

Classification may sometimes depend on event context rather than the global Sport.

For example, an activity might be presented under a different event category depending on how organisers structure the event.

Therefore, the system should distinguish between:

```text
Sport classification
```

and:

```text
Competition/event grouping
```

where necessary.

The exact physical model should avoid assuming classification is always an immutable property of the Sport.

---

# 9. Competition

## Entity

`Competition`

## Purpose

Represents a specific competitive category conducted within an Event Edition.

Example:

```text
EventEdition:
TSpark 2027

Sport:
Football

Competition:
Men's Football
```

Another:

```text
EventEdition:
Reflex 2027

Sport:
Valorant

Competition:
Valorant
```

---

# 10. Competition Data

Potential information includes:

```text
Competition
├── id
├── eventEditionId
├── sportId
├── name
├── slug
├── category/division
├── entrantType
├── format
├── status
├── publicationState
├── rules
├── configuration
└── displayOrder
```

The final physical schema may represent some fields through related entities.

---

# 11. Competition Naming

Competition names should be human-readable.

Examples:

```text
Men's Football
Women's Football
Men's Chess
Women's Chess
Valorant
Relay Race
```

The name should not be used as internal identity.

---

# 12. Competition Division

A Competition may represent a division or category.

Known examples include:

```text
Men
Women
```

Other future categories may exist.

The platform must not hardcode the assumption that every Competition has exactly:

```text
MEN
WOMEN
```

Some competitions may be:

* Open
* Mixed
* Team-based without gender division
* Event-specific category
* Individual category

---

# 13. Division Model

Potential conceptual structure:

```text
Competition
├── Sport: Football
├── Division: Men
└── Name: Men's Football
```

Another:

```text
Competition
├── Sport: Valorant
├── Division: Open
└── Name: Valorant
```

Whether division becomes:

* Enum
* Reference data
* Configurable label

will depend on actual requirements.

---

# 14. Display Labels vs Domain Rules

A label such as:

```text
Men's
Women's
Open
Mixed
```

may be useful for display.

Eligibility rules are a separate concern.

The system should not assume that a display label alone is sufficient to enforce participant eligibility.

If automated eligibility validation is introduced, it must use explicit data and rules.

---

# 15. Competition Grouping

Events may group competitions for navigation.

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

Reflex may instead use:

```text
Reflex 2027

Esports
├── Valorant
└── ...

Fun Games
├── ...
└── ...
```

This grouping should be configurable rather than hardcoded around TSpark.

---

# 16. Competition Group

A lightweight concept such as `CompetitionGroup` may be introduced if required.

Conceptually:

```text
EventEdition
    │
    ├── CompetitionGroup
    │       Outdoor
    │       ├── Competition
    │       └── Competition
    │
    └── CompetitionGroup
            Indoor
            ├── Competition
            └── Competition
```

This differs from Sport Classification because it represents how an Event Edition organises its competitions.

---

# 17. Why Competition Grouping Matters

Without an edition-level grouping concept, the system might incorrectly assume:

```text
Football is globally Outdoor
```

therefore:

```text
Football always appears under Outdoor
```

Instead, presentation and organisation should be controlled by the edition where appropriate.

This also supports event-specific groups such as:

```text
Esports
Fun Games
Track Events
Field Events
```

without changing the core Sport model.

---

# 18. Competition Entry

## Entity

`CompetitionEntry`

## Purpose

Represents an entrant participating in a Competition.

Conceptually:

```text
Competition
Men's Football
      │
      ├── CMPN
      ├── IT
      ├── AIML
      └── ...
```

Each participating side is represented by a Competition Entry.

---

# 19. Why Competition Entry Exists

The Competition should not directly reference departments as participants.

That would incorrectly assume all competitions are department-based.

Instead:

```text
Competition
    ↓
CompetitionEntry
    ↓
Entrant
```

The entrant may represent:

* Department
* Team
* Individual participant

depending on the competition.

---

# 20. Entrant Type

A Competition should define what kind of entrant it expects.

Initial conceptual types:

```text
DEPARTMENT_TEAM
TEAM
INDIVIDUAL
```

These names are conceptual and may change during physical schema design.

---

# 21. Department Team Competition

TSpark is expected to use department representation extensively.

Example:

```text
Competition:
Men's Football

Entrant Type:
DEPARTMENT_TEAM

Entries:
├── CMPN
├── IT
├── AIML
└── MECH
```

Each Competition Entry represents that department's team in this specific Competition.

---

# 22. Department Entry vs Department

These are different concepts.

```text
Department
CMPN
```

is persistent reference data.

```text
CompetitionEntry
CMPN in TSpark 2027 Men's Football
```

is participation in one Competition.

Therefore:

```text
Department
    │
    ├── Entry → Men's Football 2027
    ├── Entry → Women's Football 2027
    └── Entry → Chess 2027
```

Each entry remains independent.

---

# 23. Named Team Competition

Some competitions may use independently named teams.

Example:

```text
Competition:
Valorant

Entrant Type:
TEAM

Entries:
├── Team Alpha
├── Team Nova
└── Team Phoenix
```

The system should support these without pretending they are TCET departments.

---

# 24. Individual Competition

Some sports may involve individual entrants.

Example:

```text
Competition:
Men's Chess

Entrant Type:
INDIVIDUAL

Entries:
├── Participant A
├── Participant B
├── Participant C
└── Participant D
```

Whether actual TSDW competitions use individual entries should be confirmed before full participant modelling is implemented.

---

# 25. Entrant Type Consistency

A Competition should normally use one entrant model consistently.

For example:

```text
Men's Football

DEPARTMENT_TEAM
```

should not contain:

```text
CMPN Department Team
Team Phoenix
Participant A
```

unless a future competition explicitly supports mixed entrant types.

Mixed entrant competitions are not currently required.

---

# 26. Competition Entry Data

Potential information:

```text
CompetitionEntry
├── id
├── competitionId
├── entrant reference
├── seed
├── status
├── displayName snapshot?
└── metadata
```

The exact entrant-reference strategy will be decided during physical schema design.

---

# 27. Entry Display Name

A Competition Entry may require a competition-specific display name.

Example:

```text
Department:
Computer Engineering

Short Code:
CMPN

Competition Entry Display:
CMPN
```

Named teams may simply display their team name.

Historical display information may require snapshotting if reference names change later.

---

# 28. Entry Status

Potential states include:

```text
REGISTERED
CONFIRMED
WITHDRAWN
DISQUALIFIED
```

Not all states are required for V1.

If registration workflows are not yet implemented, Competition Entries may initially be created directly by authorised administrators.

---

# 29. Competition Eligibility

A Competition may define eligibility expectations.

Examples:

* Department-based participation
* Division/category
* Team size
* Maximum roster size
* Minimum roster size

Detailed participant eligibility should not be implemented until actual institutional rules are known.

---

# 30. Competition Rules

A Competition may contain rules specific to that occurrence.

Examples:

```text
Match duration
Team size
Substitution rules
Tie-break rules
Scoring notes
Special event rules
```

Rules may initially be stored as structured text/content.

Not every rule needs to become executable application logic.

---

# 31. Human Rules vs Machine Rules

This distinction is important.

### Human-readable rules

Example:

```text
Teams must report 15 minutes before the scheduled fixture.
```

This belongs in competition information.

### Machine-enforced rules

Example:

```text
Maximum roster size = 7
```

This may eventually become structured configuration.

The system should not turn every sentence in the rulebook into software logic.

---

# 32. Competition Format

A Competition should define its tournament format.

Initial conceptual formats include:

```text
KNOCKOUT
ROUND_ROBIN
GROUP_STAGE
GROUPS_AND_KNOCKOUT
SERIES
MANUAL
```

Only formats actually required by TSDW need full automation.

---

# 33. Knockout

Example:

```text
Quarter Finals
      ↓
Semi Finals
      ↓
Final
```

Entrants are progressively eliminated.

Detailed bracket modelling belongs in `07-fixtures-and-tournaments.md`.

---

# 34. Round Robin

Entrants play according to round-robin scheduling rules.

Example:

```text
A vs B
A vs C
A vs D
B vs C
B vs D
C vs D
```

Competition standings may determine final placement.

---

# 35. Group Stage

Entrants are divided into groups.

Example:

```text
Group A
├── A
├── B
├── C
└── D

Group B
├── E
├── F
├── G
└── H
```

Group standings determine progression according to competition rules.

---

# 36. Groups + Knockout

A Competition may combine:

```text
Group Stage
     ↓
Qualification
     ↓
Knockout Stage
     ↓
Final
```

This format should be supported conceptually even if full automation is deferred.

---

# 37. Series

Some competitions may use a multi-match series.

Example:

```text
Best of 3
Best of 5
```

Whether this is required for TSDW events must be confirmed.

---

# 38. Manual Format

`MANUAL` exists for competitions whose progression cannot or should not initially be automated.

Administrators may manually create:

* Fixtures
* Progression
* Placements

while still using the same Competition, Fixture, Result, and Placement systems.

This prevents unusual event formats from requiring custom software immediately.

---

# 39. Competition Format Configuration

Formats may require configuration.

Examples:

```text
Knockout
├── Third-place match?
└── Seeding method?

Round Robin
├── Win points
├── Draw points
└── Loss points

Group Stage
├── Number of groups
├── Qualifiers per group
└── Tie-break rules
```

The system should avoid putting every possible format field directly onto the Competition table.

Structured format-specific configuration may be used where required.

---

# 40. Sport-Specific Configuration

Some sports require configuration unrelated to tournament format.

Examples:

```text
Football
→ match duration

Cricket
→ overs

Valorant
→ best-of series

Table Tennis
→ sets
```

The core Competition model should not gain fields such as:

```text
overs
goals
rounds
sets
maps
```

for every sport.

Sport-specific configuration should remain extensible.

---

# 41. Generic Core, Specific Extensions

The architecture should follow:

```text
Generic Competition
        │
        ├── Tournament Format
        │
        └── Sport-Specific Configuration
```

rather than:

```text
FootballCompetition
CricketCompetition
ChessCompetition
ValorantCompetition
...
```

unless a future sport genuinely requires a separate domain module.

---

# 42. Competition Lifecycle

Initial conceptual states:

```text
DRAFT
REGISTRATION
READY
ACTIVE
COMPLETED
CANCELLED
```

Not every Competition needs to pass through registration.

The final state machine may simplify these states for V1.

---

# 43. DRAFT

Competition configuration is incomplete.

Potential activities:

* Set sport
* Set division
* Configure format
* Add rules
* Add entrants

Draft competitions may remain unpublished.

---

# 44. REGISTRATION

The Competition is accepting entries.

This state is primarily relevant once registration workflows are implemented.

V1 may skip it for manually managed competitions.

---

# 45. READY

The Competition is configured sufficiently for fixtures and operations.

Potential conditions:

* Entrants confirmed
* Format configured
* Required operational data available

---

# 46. ACTIVE

The Competition is currently being conducted.

Individual fixtures maintain their own lifecycle.

A Competition being ACTIVE does not mean every fixture is LIVE.

---

# 47. COMPLETED

The Competition has concluded and official placements are available where applicable.

Historical corrections may still occur through controlled workflows.

---

# 48. CANCELLED

The Competition will not proceed.

Its historical/configuration data may remain available where appropriate.

---

# 49. Competition State Transitions

Conceptually:

```text
DRAFT
  │
  ├──► REGISTRATION
  │         │
  │         ▼
  └──────► READY
             │
             ▼
           ACTIVE
             │
             ▼
          COMPLETED
```

Cancellation may occur from applicable pre-completion states.

Exact transitions will be finalised with fixture workflows.

---

# 50. Competition Publication

Competition operational state and public visibility should remain separate.

Example:

```text
Status:
READY

Publication:
DRAFT
```

versus:

```text
Status:
READY

Publication:
PUBLISHED
```

A competition may be prepared internally before students can see it.

---

# 51. Public Competition Information

Published competitions may expose:

* Name
* Sport
* Division
* Group/category
* Rules
* Entrants
* Fixtures
* Results
* Placements

depending on publication state and feature availability.

---

# 52. Competition Placement

## Entity / Domain Concept

`CompetitionPlacement`

Represents official final placement within a Competition.

Example:

```text
Men's Football

1st → CMPN
2nd → IT
3rd → AIML
```

Potential data:

```text
Competition
CompetitionEntry
Position
Label
Finalised timestamp
```

---

# 53. Winner

A winner is a special case of Competition Placement.

Conceptually:

```text
position = 1
```

The platform should not require a separate `Winner` entity if placements already represent the outcome.

This avoids storing the same outcome twice.

---

# 54. Multiple Winners

Some activities may permit:

* Shared first place
* Ties
* Joint winners

The placement model should not unnecessarily prevent this.

Whether a specific Competition allows shared placement is controlled by its rules.

---

# 55. No Winner

A Competition may end without a winner.

Examples:

* Cancelled
* Abandoned
* Exhibition activity
* Results unavailable

The database should not require every Competition to contain a first-place record.

---

# 56. Department Winner

For department competitions:

```text
CompetitionPlacement
      ↓
CompetitionEntry
      ↓
Department
```

This allows public pages to display:

```text
Men's Football Winner
CMPN
```

without storing a duplicated department winner field directly on Competition.

---

# 57. Overall Event Champion

The overall TSpark department champion is not the same as a Competition winner.

Example:

```text
Football Winner → CMPN
Chess Winner → IT
Cricket Winner → AIML

Overall TSpark Champion → determined by event standings
```

Overall department standings belong in `10-departments-and-standings.md`.

---

# 58. Competition History

Historical Competition records belong permanently to their Event Edition.

Example:

```text
TSpark 2026
└── Men's Football
    ├── Entries
    ├── Fixtures
    ├── Results
    └── Placements
```

Creating:

```text
TSpark 2027
└── Men's Football
```

must create a new Competition record.

---

# 59. Reusing Sport Identity

The reusable Sport remains shared.

Conceptually:

```text
Sport
Football
   │
   ├── TSpark 2026 Men's Football
   ├── TSpark 2026 Women's Football
   ├── TSpark 2027 Men's Football
   └── TSpark 2027 Women's Football
```

This enables sport-level history without merging competition records.

---

# 60. Competition Templates

Future editions may benefit from reusable competition templates.

Example:

```text
TSpark Men's Football Template
├── Sport: Football
├── Division: Men
├── Format: Knockout
└── Default Rules
```

Creating a new Competition from a template should copy configuration into a new Competition rather than making historical competitions depend permanently on mutable template state.

Templates are deferred.

---

# 61. Competition Cloning

When creating a new Event Edition, administrators may eventually clone competition configuration from a previous edition.

Example:

```text
TSpark 2026
Men's Football
     │
     │ clone configuration
     ▼
TSpark 2027
Men's Football
```

Potentially copied:

* Sport
* Name
* Division
* Group
* Format
* Rules
* Configuration

Must not copy:

* Entrants
* Fixtures
* Scores
* Results
* Placements

unless a future workflow explicitly supports selective copying.

---

# 62. Administrative Competition Workflow

Potential V1 workflow:

```text
Create Event Edition
       ↓
Create Competition Groups
       ↓
Create Competition
       ↓
Select Sport
       ↓
Set Division
       ↓
Set Entrant Type
       ↓
Select Format
       ↓
Add Rules
       ↓
Add Competition Entries
       ↓
Mark Ready
       ↓
Publish
       ↓
Generate/Create Fixtures
```

---

# 63. Adding Department Entries

Example workflow:

```text
Competition:
Men's Football

Add Departments
      ↓
Select:
☑ CMPN
☑ IT
☑ AIML
☑ MECH
      ↓
Create Competition Entries
```

This should be faster than manually creating a separate team object for every department where detailed rosters are not yet required.

---

# 64. Team Rosters

If team rosters are required:

```text
CompetitionEntry
      ↓
Competition Team
      ↓
Team Members
      ↓
Participants
```

The exact roster model will be defined in `09-teams-and-participants.md`.

V1 competition management should not depend on complete participant-profile infrastructure unless required operationally.

---

# 65. Individual Entrants

For individual competitions:

```text
CompetitionEntry
      ↓
Participant
```

Participant information must respect privacy requirements.

Public competition pages should expose only information approved for public display.

---

# 66. Seeds

Competition Entries may optionally have seed values.

Example:

```text
1 → CMPN
2 → IT
3 → AIML
4 → MECH
```

Seeds may influence fixture generation.

Seeding is competition-specific and should not be required universally.

---

# 67. Draw / Fixture Generation Input

The Competition module provides:

```text
Competition
Format
Entries
Seeds
Configuration
```

The fixture/tournament module uses these to create:

```text
Fixtures
Rounds
Bracket relationships
```

This boundary prevents tournament generation logic from becoming part of basic Competition CRUD.

---

# 68. Competition Editing

Before operations begin, authorised administrators may modify configuration.

Once fixtures/results exist, some changes become dangerous.

Example:

Changing:

```text
Format:
Knockout
```

to:

```text
Round Robin
```

after completed fixtures exist should not be treated as a normal edit.

The service layer should enforce safe modification rules.

---

# 69. Competition Deletion

A draft Competition with no meaningful operational records may potentially be deleted.

Once it contains:

* Published fixtures
* Scores
* Results
* Placements

destructive deletion should be strongly restricted.

Prefer:

```text
Cancel
Unpublish
Correct
```

where historical information exists.

---

# 70. Sport Deactivation

A Sport may be deactivated when no longer offered.

Example:

```text
Sport
XYZ

active = false
```

Historical competitions using XYZ remain intact.

Deactivation prevents ordinary creation of new competitions using that Sport.

---

# 71. Sport Renaming

Renaming a Sport must not destroy historical context.

If the rename represents a simple correction:

```text
Foot Ball
→ Football
```

updating the shared reference may be appropriate.

If the sport's identity fundamentally changes, a new Sport may be required.

Historical snapshot needs will be determined during schema design.

---

# 72. Competition Permissions

Competition management follows the RBAC model defined in `04-auth-and-rbac.md`.

Conceptually:

```text
System Administrator
→ All competitions

Sports Administrator
→ Broad competition management

Event Manager
→ Competitions inside assigned Event Edition

Scorekeeper
→ Limited operational access to assigned Competition/Fixtures
```

---

# 73. Scorekeeper Boundary

A Scorekeeper should not normally control competition structure.

They may be allowed to:

* View assigned competition
* View entrants
* View fixtures
* Update permitted match state

They should not normally:

* Change competition format
* Add departments
* Remove entrants
* Delete competition
* Change rules

---

# 74. Audit Requirements

Important Competition operations should be auditable.

Examples:

* Competition created
* Format changed
* Entrant added
* Entrant removed
* Competition published
* Competition activated
* Competition completed
* Placement finalised
* Historical placement corrected

Detailed audit behaviour belongs in `21-audit-logs.md`.

---

# 75. Competition Invariants

### COMP-001

Every Competition must belong to exactly one Event Edition.

### COMP-002

Every Competition must reference a Sport.

### COMP-003

Competition records must not be reused across Event Editions.

### COMP-004

A Competition Entry must belong to exactly one Competition.

### COMP-005

A Competition Entry must conform to the Competition's supported entrant model.

### COMP-006

A Department is not itself a Competition Entry.

### COMP-007

A Sport is not itself a Competition.

### COMP-008

Competition lifecycle and publication state are separate.

### COMP-009

Competition lifecycle must not replace Fixture lifecycle.

### COMP-010

Sport-specific score fields must not be added directly to the generic Competition model without justification.

### COMP-011

A winner should be represented through official competition placement rather than duplicated independently.

### COMP-012

Completed historical Competition data must remain associated with its original Event Edition.

### COMP-013

Deactivating a Sport must not remove historical competitions.

### COMP-014

Changing Competition configuration must not silently invalidate existing Fixtures or Results.

### COMP-015

Event-level competition grouping must not require hardcoded TSpark-specific logic.

### COMP-016

Not every Competition must have a winner.

### COMP-017

Not every Competition must use department entrants.

### COMP-018

Not every Competition must have a gender division.

---

# 76. Example — TSpark Football

```text
Event
TSpark
  │
  └── EventEdition
      TSpark 2027
        │
        └── CompetitionGroup
            Outdoor
              │
              ├── Competition
              │   Men's Football
              │   ├── Sport: Football
              │   ├── Division: Men
              │   ├── Entrant Type: Department Team
              │   └── Format: Knockout
              │
              └── Competition
                  Women's Football
                  ├── Sport: Football
                  ├── Division: Women
                  ├── Entrant Type: Department Team
                  └── Format: Knockout
```

---

# 77. Example — Department Entries

```text
Men's Football
│
├── Entry
│   └── CMPN
│
├── Entry
│   └── IT
│
├── Entry
│   └── AIML
│
└── Entry
    └── MECH
```

The same departments may independently participate in Women's Football.

---

# 78. Example — Reflex Valorant

```text
Event
Reflex
  │
  └── EventEdition
      Reflex 2027
        │
        └── CompetitionGroup
            Esports
              │
              └── Competition
                  Valorant
                  ├── Sport: Valorant
                  ├── Division: Open
                  ├── Entrant Type: Team
                  └── Format: Knockout
```

Entries:

```text
Team Alpha
Team Nova
Team Phoenix
Team Zenith
```

No department assumption is required.

---

# 79. Example — Individual Chess

If required:

```text
Competition
Individual Chess
├── Sport: Chess
├── Division: Open
├── Entrant Type: Individual
└── Format: Knockout
```

Entries:

```text
Participant A
Participant B
Participant C
Participant D
```

The same tournament infrastructure can operate without team-specific assumptions.

---

# 80. Example — Unusual Fun Game

Suppose Reflex introduces an activity whose structure does not fit automated tournament formats.

It may use:

```text
Sport:
Activity X

Competition:
Activity X Challenge

Entrant Type:
Team

Format:
MANUAL
```

Administrators can still publish:

* Entrants
* Fixtures/rounds where applicable
* Results
* Placements

without requiring a custom tournament engine first.

---

# 81. V1 Scope

V1 should support:

* Reusable Sports
* Sport activation/deactivation
* Event-level Competition grouping
* Competitions
* Men/Women/Open-style divisions
* Department-team entrants
* Named-team entrants where required
* Competition Entries
* Knockout format
* Manual format
* Competition rules
* Publication
* Competition lifecycle
* Competition placements
* Historical competition records

Round Robin should be supported if confirmed as necessary for actual TSDW events.

Advanced format automation should follow real event requirements.

---

# 82. Deferred Capabilities

Potential later capabilities include:

* Participant self-registration
* Automatic eligibility validation
* Competition templates
* Advanced seeding
* Automated group draws
* Round-robin generation
* Complex group tie-breakers
* Sport-specific scoring engines
* Qualification rules
* Multi-stage tournament builders
* Detailed roster validation

The architecture must allow these without requiring all of them in V1.

---

# 83. Open Questions

## OQ-COMP-001 — Actual Sports List

What sports are currently conducted during:

* TSpark
* National Sports Day
* Reflex

The system should use actual event data rather than assumptions.

---

## OQ-COMP-002 — Divisions

Which sports currently have separate:

* Men's
* Women's
* Open
* Mixed

competitions?

---

## OQ-COMP-003 — Department Participation

Are all TSpark competitions department-vs-department, or do any use individual participants directly?

---

## OQ-COMP-004 — Competition Formats

Which formats are currently used by each sport?

Expected possibilities include:

* Knockout
* Round Robin
* Groups + Knockout

This must be confirmed before tournament automation is implemented.

---

## OQ-COMP-005 — Third Place

Which competitions conduct a third-place fixture?

---

## OQ-COMP-006 — Draws

Which sports permit a fixture to end in a draw?

---

## OQ-COMP-007 — Department Codes

What are the official department names and abbreviations that should be used as canonical reference data?

---

## OQ-COMP-008 — Team Rosters

Does V1 need complete player rosters for department teams, or are department-level Competition Entries sufficient initially?

---

## OQ-COMP-009 — Reflex Entrants

Are Reflex esports teams:

* Department teams
* Student-created teams
* Both

depending on competition?

---

## OQ-COMP-010 — Fun Games

Should Reflex fun games be treated as formal Competitions with results and placements, or as lighter event activities?

---

# 84. Decisions Established by This Document

This document establishes that:

* Sport and Competition are separate concepts.
* Competition belongs to an Event Edition.
* Competition Entries represent participation.
* Departments must not be used directly as fixture participants without edition/competition context.
* Department teams, named teams, and individual entrants are conceptually supported.
* Gender/category division is not universally required.
* Competition grouping is event-configurable.
* Tournament format belongs to Competition configuration.
* Generic Competition models should remain sport-agnostic.
* Competition winner is represented through placement.
* Historical competitions remain independent across editions.
* Manual competition operation is supported for unusual formats.
* Competition configuration and match execution remain separate concerns.

Significant architectural decisions should be recorded in [`27-decisions.md`](./27-decisions.md).

---

# 85. Related Documentation

* [`02-system-architecture.md`](./02-system-architecture.md) — Platform architecture
* [`03-data-model.md`](./03-data-model.md) — Conceptual entities
* [`04-auth-and-rbac.md`](./04-auth-and-rbac.md) — Access control
* [`05-events-and-seasons.md`](./05-events-and-seasons.md) — Event editions and lifecycle
* [`26-roadmap.md`](./26-roadmap.md) — Release scope
* [`27-decisions.md`](./27-decisions.md) — Decision log

The next domain document is:

* `07-fixtures-and-tournaments.md`

Later documents expand:

* `08-live-scoring.md`
* `09-teams-and-participants.md`
* `10-departments-and-standings.md`

---

# 86. Current Status

**Status: Initial Baseline**

The Sport, Competition, Competition Group, Competition Entry, entrant-type, format, lifecycle, and placement concepts are sufficiently defined to design fixture scheduling and tournament progression.

Actual sport lists, competition formats, and event rules should be confirmed from TSDW operational data before format-specific automation is implemented.
