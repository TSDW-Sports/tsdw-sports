# TSDW Sports Platform — Data Model

## 1. Purpose

This document defines the conceptual data model for the **TSDW Sports Platform**.

It describes:

* Core entities
* Entity responsibilities
* Relationships
* Historical ownership
* Data lifecycle expectations
* Identity boundaries
* Important invariants

This document defines the **domain model**, not the final Prisma schema.

Implementation-specific details such as:

* SQL column types
* Prisma syntax
* Index definitions
* Migration files
* Generated identifiers

will be decided during database implementation.

---

# 2. Modelling Principles

## 2.1 Historical by Design

Records belonging to previous academic years and event editions must remain meaningful after current reference data changes.

Historical information must not depend solely on whatever the current state of the organisation happens to be.

---

## 2.2 Event-Agnostic

Core entities must support:

* TSpark
* Reflex
* National Sports Day
* Future TSDW Sports events

without requiring new database structures for every event type.

---

## 2.3 Sport-Agnostic

The core match model must support multiple sports without embedding football-, cricket-, chess-, or esports-specific assumptions into every fixture.

---

## 2.4 Separate Identity from Participation

A person, department, sport, or event may exist independently from their participation in a specific year or competition.

For example:

```text
Department
Computer Engineering

≠

Competition Entry
Computer Engineering's Men's Football team
in TSpark 2027
```

---

## 2.5 Separate Current Reference Data from Historical Context

Reference entities may change.

Historical records must retain enough context to remain understandable.

The implementation may use:

* Persistent references
* Historical records
* Snapshots

depending on the entity and requirement.

---

## 2.6 Avoid Premature Generalisation

Entities should model known domain concepts.

The platform should not create highly generic abstractions merely to support hypothetical future organisations or sports systems.

---

# 3. High-Level Domain Model

Conceptually:

```text
AcademicPeriod
      │
      ├──────────── CommitteeTenure
      │
      ├──────────── TCETTeamSeason
      │
      └──────────── Achievement
      │
      ▼
Event
  │
  ▼
EventEdition
  │
  ├──── Competition
  │        │
  │        ├──── CompetitionEntry
  │        │          │
  │        │          └──── Team / Participant
  │        │
  │        └──── Fixture
  │                  │
  │                  └──── Result
  │
  ├──── Announcement
  │
  └──── Registration
```

Additional systems connect to this model:

```text
User
 └── Role / Permission

Participant
 └── Certificate

Administrative Operation
 └── AuditRecord
```

---

# 4. Academic Period

## Entity

`AcademicPeriod`

## Purpose

Represents an academic period used to organise historical records.

Example:

```text
2026–27
```

Potentially associated with:

* Event editions
* Committee tenures
* TCET team seasons
* Achievements

## Important Rule

Academic periods are not the same thing as event editions.

Multiple events may occur during the same academic period.

---

# 5. Event

## Entity

`Event`

## Purpose

Represents the recurring identity of an event.

Examples:

```text
TSpark
Reflex
National Sports Day
```

## Potential Data

* Name
* Slug
* Description
* Active status

## Relationships

```text
Event
  │
  └── 1:N EventEdition
```

## Important Rule

An Event does not contain a particular year's fixtures or results.

Those belong to an Event Edition.

---

# 6. Event Edition

## Entity

`EventEdition`

## Purpose

Represents one occurrence of an Event.

Example:

```text
Event
TSpark

EventEdition
TSpark 2027
```

## Potential Data

* Event
* Academic period
* Display name
* Start date
* End date
* Description
* Status
* Publication state

## Relationships

An Event Edition may contain:

```text
EventEdition
├── Competitions
├── Registrations
├── Announcements
└── Event-specific operational data
```

## Historical Ownership

Competition data, fixtures, results, and related operational records belong to the Event Edition.

Creating a new edition must not modify previous editions.

---

# 7. Sport

## Entity

`Sport`

## Purpose

Represents a sport or supported activity.

Examples:

```text
Football
Cricket
Chess
Valorant
Carrom
```

## Potential Data

* Name
* Slug
* Description
* Active status

## Important Rule

Sport represents the reusable identity of the activity.

It does not represent a particular competition within an event.

---

# 8. Sport Category

Sport classification may be represented separately if required.

Potential examples:

```text
Indoor
Outdoor
Esports
Recreational
```

A Sport may belong to one or more classifications depending on final requirements.

Whether this becomes a dedicated entity or controlled reference value will be decided during schema design.

---

# 9. Competition

## Entity

`Competition`

## Purpose

Represents a specific competitive category conducted within an Event Edition.

Example:

```text
EventEdition
TSpark 2027

Sport
Football

Competition
Men's Football
```

Another example:

```text
EventEdition
Reflex 2027

Sport
Valorant

Competition
Valorant Tournament
```

## Potential Data

* Event edition
* Sport
* Name
* Category
* Format
* Status
* Rules
* Publication state

## Relationships

```text
EventEdition
    │
    └── Competition
          │
          ├── CompetitionEntries
          └── Fixtures
```

---

# 10. Competition Format

A Competition may define a format such as:

```text
Knockout
Round Robin
Group Stage
Groups + Knockout
Series
Manual
```

The initial schema should not require all formats to be automated.

The format identifies how the competition is intended to operate.

Detailed format configuration will be designed in `06-sports-and-competitions.md` and `07-fixtures-and-tournaments.md`.

---

# 11. Department

## Entity

`Department`

## Purpose

Represents a TCET department that may participate in internal competitions.

Potential data:

* Name
* Short name/code
* Active status

Example:

```text
Computer Engineering
CMPN
```

## Important Rule

Department identity must remain stable enough to preserve historical participation.

Renaming or deactivating a department must not remove historical results.

---

# 12. Competition Entry

## Entity

`CompetitionEntry`

## Purpose

Represents an entrant participating in a particular Competition.

This abstraction is important because not every competition necessarily involves department teams.

An entrant may conceptually represent:

* Department team
* Registered team
* Individual participant
* Other supported competition entrant

Example:

```text
Competition
TSpark 2027 — Men's Football

CompetitionEntry
CMPN Men's Football
```

## Relationships

```text
Competition
    │
    └── CompetitionEntry
            │
            ├── Department?
            ├── Team?
            └── Participant?
```

The exact technical representation of entrant types will be decided during schema design.

---

# 13. Team

## Entity

`Team`

## Purpose

Represents a group of participants competing together.

A Team may be associated with:

* Department
* Competition
* Registration workflow

depending on context.

## Important Distinction

A competition team is not automatically an official TCET sports team.

Official college teams are modelled separately.

---

# 14. Team Membership

## Entity

`TeamMember`

## Purpose

Associates a Participant with a Team for a particular roster.

Potential information:

* Participant
* Team
* Role
* Roster status

Possible roles may include:

```text
Captain
Player
Substitute
```

Roles must remain flexible because sports use different roster structures.

---

# 15. Participant

## Entity

`Participant`

## Purpose

Represents a student participating in sports operations.

Potential uses include:

* Team membership
* Individual competition entry
* Registration
* Certificates
* Participation history
* Achievements

## Important Rule

Participant is not the same entity as User.

A Participant may exist without having a platform account.

---

# 16. User

## Entity

`User`

## Purpose

Represents an authenticated identity capable of accessing protected platform functionality.

Potential users include:

* System administrators
* Sports administrators
* Secretaries
* Organisers
* Scorekeepers
* Future authenticated participants

## Important Rule

Authentication identity and sports participation are separate concerns.

Conceptually:

```text
Participant
     │
     └── User?    optional
```

The exact relationship will be designed in `04-auth-and-rbac.md`.

---

# 17. Fixture

## Entity

`Fixture`

## Purpose

Represents a scheduled competitive encounter.

A fixture belongs to a Competition.

Potential data:

* Competition
* Stage/round
* Scheduled date/time
* Venue
* Status
* Publication state

## Relationships

Conceptually:

```text
Competition
    │
    └── Fixture
          │
          ├── FixtureSide A
          ├── FixtureSide B
          └── Result
```

The model should avoid assuming that all fixtures always contain exactly two teams until competition requirements are validated.

However, two-sided fixtures are expected to cover the majority of initial sports.

---

# 18. Fixture Side

## Concept

`FixtureSide`

A fixture side represents an entrant assigned to a competitive position in a fixture.

Example:

```text
Fixture #17

Side A → CMPN
Side B → IT
```

This may be implemented as:

* Dedicated records
* Explicit fixture fields
* Another structure

depending on requirements.

The conceptual separation is useful for tournament progression because a side may initially be derived from:

```text
Winner of Fixture #12
```

before the actual team is known.

---

# 19. Fixture Stage / Round

Fixtures may belong to a tournament stage or round.

Examples:

```text
Group A
Round 1
Quarter Final
Semi Final
Final
```

Whether stages become dedicated entities or structured competition metadata will depend on tournament design.

---

# 20. Fixture Status

Fixtures require lifecycle state.

Expected states may include:

```text
DRAFT
SCHEDULED
LIVE
COMPLETED
POSTPONED
CANCELLED
WALKOVER
```

The final state machine will be defined in `07-fixtures-and-tournaments.md`.

---

# 21. Score

Live and final score data belongs to the fixture context.

The core model should initially support generic scoring.

Conceptually:

```text
Fixture

Side A
score = 2

Side B
score = 1
```

Sport-specific scoring may later extend this model.

The database model must not assume that the generic numeric score contains all possible sport-specific information.

---

# 22. Result

## Entity / Domain Concept

`Result`

## Purpose

Represents the official outcome of a Fixture.

Potential information:

* Fixture
* Outcome
* Winner
* Final scores
* Result status
* Finalised timestamp

## Important Distinction

**Score** represents competitive state.

**Result** represents the official outcome.

A live score must not automatically be treated as an official result.

---

# 23. Competition Placement

## Entity / Domain Concept

`CompetitionPlacement`

## Purpose

Represents final competition-level placements.

Examples:

```text
1st — CMPN
2nd — IT
3rd — AIML
```

Potential fields:

* Competition
* Competition entry
* Position
* Label

This allows different competitions to represent outcomes beyond only "winner".

---

# 24. Standings

Standings may be required at multiple levels.

Examples include:

### Competition Standings

```text
Team
Played
Won
Lost
Points
```

for round-robin competitions.

### Event Department Standings

```text
CMPN  42
AIML  38
IT    31
```

for overall event championships.

These represent different concepts and should not automatically share one data structure.

Detailed modelling will be determined after actual competition and TSpark rules are confirmed.

---

# 25. Venue

## Entity

`Venue`

## Purpose

Represents a location where fixtures or event activities occur.

Potential data:

* Name
* Description
* Location information
* Active status

Fixtures may reference a Venue.

Historical fixture venue information must remain recoverable.

---

# 26. TCET Official Team

## Entity

`TCETTeam`

## Purpose

Represents an official sports team representing TCET externally.

Example:

```text
TCET Football Team
TCET Cricket Team
TCET Chess Team
```

## Relationships

A TCET Team is associated with a Sport.

Historical rosters may vary by academic year.

---

# 27. TCET Team Season

## Entity

`TCETTeamSeason`

## Purpose

Represents an official TCET team's state during a particular Academic Period.

Example:

```text
TCET Football Team
└── 2026–27
```

Potential information:

* Team
* Academic period
* Captain
* Relevant metadata
* Roster

This allows the persistent team identity to remain separate from yearly rosters.

---

# 28. TCET Team Membership

## Entity

`TCETTeamMember`

## Purpose

Associates participants with a TCET Team Season.

Potential information:

* Participant
* Team season
* Role

This preserves historical official-team rosters.

---

# 29. Achievement

## Entity

`Achievement`

## Purpose

Represents a recognised sporting accomplishment.

Potential data:

* Title
* Description
* Sport
* Academic period
* Date
* Competition/tournament
* Placement
* Publication state

An achievement may be associated with:

* TCET Team
* TCET Team Season
* Participant

depending on context.

---

# 30. Committee Tenure

## Entity

`CommitteeTenure`

## Purpose

Represents the TSDW Sports organising committee for a particular period.

Potential relationships:

```text
AcademicPeriod
      │
      └── CommitteeTenure
               │
               └── CommitteeMembers
```

The system should not assume exactly one committee tenure per academic period if future requirements require otherwise.

---

# 31. Committee Role

## Entity

`CommitteeRole`

## Purpose

Represents a role used within a committee.

Examples may include:

```text
Secretary
Joint Secretary
Coordinator
Member
```

Roles should be configurable because the committee structure may change.

---

# 32. Committee Member

## Entity

`CommitteeMember`

## Purpose

Represents a person's membership in a Committee Tenure.

Potential information:

* Tenure
* Person/member identity
* Committee role
* Display order

Committee membership does not automatically grant platform permissions.

Organisational role and system access are separate concepts.

---

# 33. Announcement

## Entity

`Announcement`

## Purpose

Represents information published by organisers.

Potential scope:

```text
Platform
Event Edition
Competition
Fixture
```

Potential information:

* Title
* Content
* Priority
* Publication state
* Published timestamp
* Author

The exact scope model will be defined later.

---

# 34. Registration

## Entity / Domain

`Registration`

## Purpose

Represents a submission to participate in an event or competition.

Potential registration types:

* Team registration
* Individual registration

Potential state:

```text
PENDING
APPROVED
REJECTED
```

Registration workflows are planned for V2 and should not complicate the initial V1 schema unnecessarily.

Core entities should nevertheless avoid preventing registration support later.

---

# 35. Certificate

## Entity

`Certificate`

## Purpose

Represents an issued digital certificate.

Potential data:

* Unique certificate identifier
* Recipient
* Event edition
* Competition
* Certificate type
* Achievement/placement
* Issue timestamp
* Verification status
* File reference

Potential recipient contexts may include:

* Participant
* Organiser

The final certificate model will be defined in `14-certificates.md`.

---

# 36. Certificate File

Generated certificate files should be stored outside the relational database.

The Certificate record may reference an object-storage location.

Conceptually:

```text
Certificate Record
       │
       └── Storage Object
              ↓
             PDF
```

The database remains authoritative for certificate validity.

Possession of a PDF alone does not establish validity.

---

# 37. Role

## Entity / Domain Concept

`Role`

## Purpose

Represents a collection of system permissions.

Potential examples:

```text
System Administrator
Sports Administrator
Secretary
Scorekeeper
```

Exact roles are not yet final.

---

# 38. Permission

## Entity / Domain Concept

`Permission`

## Purpose

Represents an allowed system capability.

Conceptual examples:

```text
event.create
fixture.create
fixture.score.update
result.finalize
achievement.publish
```

The exact permission vocabulary will be defined in `04-auth-and-rbac.md`.

---

# 39. User Role Assignment

A user may receive one or more role assignments.

Assignments may eventually include resource scope.

Example:

```text
User
  ↓
Scorekeeper
  ↓
TSpark 2027
  ↓
Men's Football
```

The scope model belongs in `04-auth-and-rbac.md`.

---

# 40. Audit Record

## Entity

`AuditRecord`

## Purpose

Records important administrative operations.

Potential data:

* Actor
* Action
* Resource type
* Resource identifier
* Previous state
* Resulting state
* Timestamp
* Metadata

Audit records should survive account deactivation.

---

# 41. Person Identity

Several domains refer to people:

* Participants
* Committee members
* Administrative users
* TCET team members

It may eventually be useful to introduce a shared person identity model.

However, this should not be assumed prematurely.

For V1, committee members may not need the same data requirements as participants.

The final identity model should be determined after `04-auth-and-rbac.md`, `09-teams-and-participants.md`, and `13-committee.md`.

---

# 42. Entity Relationship Overview

Conceptually:

```text
AcademicPeriod
│
├── EventEdition
│      │
│      ├── Competition
│      │      │
│      │      ├── CompetitionEntry
│      │      │       ├── Department?
│      │      │       ├── Team?
│      │      │       └── Participant?
│      │      │
│      │      ├── Fixture
│      │      │      └── Result
│      │      │
│      │      └── CompetitionPlacement
│      │
│      └── Announcement
│
├── CommitteeTenure
│      └── CommitteeMember
│
├── TCETTeamSeason
│      └── TCETTeamMember
│
└── Achievement
```

Persistent reference entities include:

```text
Event
Sport
Department
Venue
TCETTeam
CommitteeRole
```

Identity/security entities include:

```text
User
Role
Permission
RoleAssignment
AuditRecord
```

Future participant operations include:

```text
Participant
TeamMember
Registration
Certificate
```

---

# 43. Ownership Hierarchy

Records should have clear ownership.

For event operations:

```text
Event
  ↓
EventEdition
  ↓
Competition
  ↓
Fixture
  ↓
Result
```

Deleting or changing a parent record must account for its historical children.

Production deletion rules should favour preserving meaningful historical records.

---

# 44. Deletion Strategy

The system should not default to hard-deleting historical records.

Potential strategies include:

* Deactivation
* Archival
* Soft deletion
* Restricted hard deletion

The exact strategy may differ by entity.

Examples:

A mistakenly created draft fixture may reasonably be deleted.

A published completed TSpark final should not disappear through ordinary administration.

Detailed deletion policies will be defined per domain.

---

# 45. Publication State

Existence in the database does not necessarily mean public visibility.

Relevant entities may require publication state.

Examples include:

* Event editions
* Fixtures
* Results
* Achievements
* Announcements

Conceptually:

```text
Administrative State
        ↓
Publication Decision
        ↓
Public Visibility
```

Publication state should remain distinct from operational state where necessary.

For example:

```text
Fixture status: SCHEDULED
Publication: DRAFT
```

is different from:

```text
Fixture status: SCHEDULED
Publication: PUBLISHED
```

---

# 46. Slugs and Public Identity

Public resources should support stable human-readable URLs where appropriate.

Examples:

```text
/events/tspark
/events/tspark/2027
/sports/football
```

Database identifiers should remain separate from public slugs.

A slug is a routing/display identifier, not necessarily the database primary key.

---

# 47. Internal Identifiers

Core entities should use stable internal identifiers independent of:

* Names
* Display labels
* Academic years
* Public slugs

Names can change.

Identifiers should not.

The exact identifier format will be selected during schema implementation.

---

# 48. Time

Time-sensitive records may include:

* Event dates
* Fixture schedules
* Publication timestamps
* Audit timestamps
* Certificate issuance
* Registration windows

The database should store timestamps consistently.

Display formatting and local timezone handling belong to application presentation.

The platform's primary operational timezone will need to be explicitly configured.

---

# 49. Data Integrity Rules

At minimum, the final schema and service layer should enforce rules such as:

### DI-001

An Event Edition must belong to an Event.

### DI-002

A Competition must belong to an Event Edition.

### DI-003

A Fixture must belong to a Competition.

### DI-004

A fixture entrant must be eligible for the fixture's Competition.

### DI-005

An official Result must correspond to a Fixture.

### DI-006

A Competition Placement must reference an entrant in that Competition.

### DI-007

A TCET Team Season must belong to a TCET Team and an Academic Period.

### DI-008

Historical records must not become invalid when current reference entities are deactivated.

### DI-009

Participant records must not require associated User accounts.

### DI-010

Committee membership must not automatically grant application permissions.

### DI-011

Public visibility must respect publication and privacy rules.

### DI-012

Certificate identifiers must be unique.

---

# 50. Data That Should Not Be Duplicated Without Reason

The system should avoid manually storing derived information when it can reliably be calculated from authoritative data.

Examples may include:

```text
Winner
derived from official Result

Current standings
derived from results + points rules
```

However, derived data may be persisted when required for:

* Historical accuracy
* Performance
* Auditing
* Snapshotting

Such duplication should be deliberate.

---

# 51. Historical Snapshots

Some historical records may require snapshots rather than relying entirely on mutable reference data.

Example:

A department may be renamed in the future.

Historical TSpark results should still be understandable in their original context.

The exact snapshot strategy should be decided per entity during schema design.

The platform should not blindly snapshot every field of every related entity.

---

# 52. V1 Data Scope

V1 primarily requires support for:

```text
AcademicPeriod
Event
EventEdition
Sport
Competition
Department
CompetitionEntry
Team
Fixture
Result
CompetitionPlacement
Venue
TCETTeam
TCETTeamSeason
Achievement
CommitteeTenure
CommitteeRole
CommitteeMember

User
Role
Permission
RoleAssignment
AuditRecord
```

Some entities may be simplified in the first implementation where their complete future behaviour is not yet required.

---

# 53. Deferred Data Scope

The following areas are primarily associated with later releases:

```text
Detailed Participant Profiles
Registration Workflows
Certificate Generation
Check-In
Sport-Specific Score Data
Advanced Standings
Notifications
Advanced Historical Statistics
```

The V1 model should avoid blocking these capabilities without implementing their full complexity prematurely.

---

# 54. Open Data-Modelling Questions

## OQ-DATA-001 — Academic Period vs Calendar Event Year

How should event editions be labelled when an event occurs in one calendar year but belongs to an academic year spanning two years?

---

## OQ-DATA-002 — Department History

Can department names or codes change, merge, or become inactive?

The answer affects historical-reference strategy.

---

## OQ-DATA-003 — Competition Entrants

Which entrant types are actually required?

Expected possibilities include:

* Department teams
* Named teams
* Individual participants

---

## OQ-DATA-004 — Multi-Sided Competitions

Do any current TSDW sports require fixtures involving more than two simultaneous entrants?

---

## OQ-DATA-005 — Draws and Ties

Which competitions permit draws, ties, rematches, tie-breakers, or shared placements?

---

## OQ-DATA-006 — TCET Team Rosters

How much official-team roster history is available and expected to be maintained?

---

## OQ-DATA-007 — Participant Identifier

Which institutional identifier can reliably identify the same student across multiple events?

---

## OQ-DATA-008 — Committee Identity

Should committee members eventually reference a common person/participant identity, or is historical display information sufficient?

---

## OQ-DATA-009 — Historical Imports

How incomplete are historical event records likely to be?

The schema should not require information that does not exist for historical editions.

---

# 55. Schema Design Rules

When translating this conceptual model into the database schema:

1. Do not model UI components as database entities.
2. Do not hardcode individual events into schema structure.
3. Do not hardcode current committee roles.
4. Do not require participants to have user accounts.
5. Do not overwrite historical editions.
6. Do not use names as primary identity.
7. Do not make public visibility implicit.
8. Do not encode sport-specific scoring into the generic Fixture entity.
9. Preserve referential integrity where practical.
10. Use service-level validation for business rules that cannot be expressed safely through database constraints alone.

---

# 56. Conceptual Model vs Physical Schema

This document intentionally uses conceptual entities.

The final physical database may:

* Combine some concepts
* Split some concepts
* Use join tables
* Introduce enums
* Introduce snapshots
* Add technical metadata
* Add indexes
* Add constraints

Such implementation choices are acceptable as long as the domain behaviour defined here remains preserved.

---

# 57. Related Documentation

* [`00-overview.md`](./00-overview.md) — Platform concepts and terminology
* [`01-product-requirements.md`](./01-product-requirements.md) — Product requirements
* [`02-system-architecture.md`](./02-system-architecture.md) — System architecture
* [`26-roadmap.md`](./26-roadmap.md) — Release scope
* [`27-decisions.md`](./27-decisions.md) — Decision history

The next relevant document is:

* `04-auth-and-rbac.md`

Detailed domain modelling will later be expanded through:

* `05-events-and-seasons.md`
* `06-sports-and-competitions.md`
* `07-fixtures-and-tournaments.md`
* `09-teams-and-participants.md`
* `10-departments-and-standings.md`

---

# 58. Current Status

**Status: Initial Baseline**

The conceptual model is sufficiently defined to begin authentication/access design and detailed domain documentation.

The final database schema should not be created until the remaining critical domain boundaries have been clarified.
