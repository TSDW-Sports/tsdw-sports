# TSDW Sports Platform — Events & Seasons

## 1. Purpose

This document defines how the **TSDW Sports Platform** models recurring events, individual event editions, academic periods, dates, lifecycle states, publication, and historical archiving.

It establishes:

* Event identity
* Event editions
* Academic periods
* Event lifecycle
* Publication state
* Current and upcoming events
* Historical editions
* Event configuration
* Edition creation
* Event archival behaviour
* Administrative workflows
* Important invariants

This document expands the conceptual model established in [`03-data-model.md`](./03-data-model.md).

---

# 2. Terminology

The platform uses three separate concepts:

```text
Academic Period
Event
Event Edition
```

They must not be treated as interchangeable.

---

# 3. Academic Period

An **Academic Period** represents an institutional academic year or equivalent organisational period.

Example:

```text
2026–27
```

It provides historical context for records such as:

* Event editions
* Committee tenures
* TCET team seasons
* Achievements

An Academic Period does not itself represent a sports event.

---

# 4. Event

An **Event** represents the recurring identity of a TSDW Sports event.

Examples:

```text
TSpark
Reflex
National Sports Day
```

An Event may exist for many years.

Conceptually:

```text
TSpark
├── 2025 Edition
├── 2026 Edition
└── 2027 Edition
```

The Event contains information that belongs to the recurring identity rather than one occurrence.

---

# 5. Event Edition

An **Event Edition** represents one occurrence of an Event.

Example:

```text
Event
TSpark

Event Edition
TSpark 2027
```

The Event Edition owns operational information specific to that occurrence.

Examples include:

* Dates
* Competitions
* Entrants
* Fixtures
* Results
* Winners
* Announcements
* Venues
* Event-specific configuration

---

# 6. Why Event and Event Edition Are Separate

If TSpark were represented as a single mutable record:

```text
TSpark
2026 data
    ↓
replace
    ↓
2027 data
```

historical information would become difficult to preserve.

Instead:

```text
Event
TSpark
  │
  ├── Edition 2026
  │      └── 2026 operational data
  │
  └── Edition 2027
         └── 2027 operational data
```

Each edition remains independent.

---

# 7. No Generic Season Entity

The platform will not initially introduce a separate generic `Season` entity.

The required time concepts are already represented by:

```text
AcademicPeriod
+
EventEdition
```

For example:

```text
Academic Period
2026–27

Event
TSpark

Event Edition
TSpark 2027
```

A generic Season entity should only be introduced if a future requirement represents a time period that cannot be modelled cleanly using these existing concepts.

---

# 8. Academic Period Model

Potential information:

```text
AcademicPeriod
├── id
├── name
├── startDate
├── endDate
├── status
└── metadata
```

Example:

```text
Name:
2026–27

Start:
2026

End:
2027
```

Exact date requirements will depend on TCET academic-calendar needs.

---

# 9. Academic Period Status

Potential states include:

```text
UPCOMING
CURRENT
COMPLETED
```

The final implementation may derive some state from dates rather than persist it.

There should normally be only one Academic Period designated as current for ordinary platform operations.

---

# 10. Event Model

Potential Event information includes:

```text
Event
├── id
├── name
├── slug
├── shortDescription
├── description
├── active
└── presentation metadata
```

Examples:

```text
TSpark
Reflex
National Sports Day
```

The Event should not contain edition-specific dates or winners.

---

# 11. Event Identity

An Event should maintain stable identity across editions.

Example:

```text
/events/tspark
```

may represent the recurring TSpark event.

Individual editions may use:

```text
/events/tspark/2027
```

The exact route design belongs in `19-public-website.md`.

---

# 12. Event Activation

An Event may be active or inactive.

An inactive Event:

* Remains historically accessible where appropriate
* Cannot normally receive new editions
* Is not necessarily removed from historical archives

Example:

If TSDW permanently discontinues an event, historical editions should remain intact.

---

# 13. Event Edition Model

Potential information includes:

```text
EventEdition
├── id
├── eventId
├── academicPeriodId
├── name
├── slug / edition identifier
├── startDate
├── endDate
├── status
├── publicationState
├── description
└── configuration
```

Additional fields should only be added when concrete requirements justify them.

---

# 14. Edition Naming

The platform should support a human-readable edition label.

Examples:

```text
TSpark 2027
Reflex 2026
National Sports Day 2026
```

The display label should not be used as the internal identity.

---

# 15. Edition Identifier

An edition may require a short public identifier such as:

```text
2027
```

However, the system must not assume that calendar year alone is globally unique.

For example:

```text
TSpark 2027
Reflex 2027
```

are different editions.

Uniqueness belongs within the appropriate Event context.

---

# 16. Academic Period Relationship

An Event Edition may belong to an Academic Period.

Example:

```text
Academic Period
2026–27
      │
      └── TSpark 2027
```

This provides institutional historical context while allowing the edition itself to use a public calendar-year label.

---

# 17. Academic Period vs Event Year

These concepts must remain separate.

Example:

```text
Academic Period:
2026–27

Event:
TSpark

Edition:
2027
```

The public may naturally refer to the event as:

```text
TSpark 2027
```

while institutional records associate it with:

```text
Academic Year 2026–27
```

The system should support both.

---

# 18. Event Dates

An Event Edition should support:

```text
startDate
endDate
```

For example:

```text
TSpark 2027

Start:
2 January 2027

End:
4 January 2027
```

Dates must belong to the edition rather than the recurring Event.

---

# 19. Multi-Day Events

An edition may span multiple days.

Fixtures and activities may be scheduled anywhere within the event period where operational rules allow.

The system should not assume:

```text
Event Edition = one day
```

---

# 20. Single-Day Events

Single-day events remain supported.

Conceptually:

```text
startDate = endDate
```

or an equivalent implementation.

---

# 21. Event Edition Lifecycle

An Event Edition requires an operational lifecycle.

Initial conceptual states:

```text
DRAFT
PLANNED
ACTIVE
COMPLETED
CANCELLED
```

These states describe the operational lifecycle.

Publication is handled separately.

---

# 22. DRAFT

`DRAFT` represents an edition being configured internally.

Examples:

* Dates not final
* Competitions still being created
* Fixtures incomplete
* Event not ready for operational use

Draft editions may remain invisible to the public.

---

# 23. PLANNED

`PLANNED` represents an edition that has been sufficiently configured for upcoming operations.

Potential characteristics:

* Event dates established
* Core configuration available
* Competitions being prepared
* Event has not started

A planned edition may be publicly published.

---

# 24. ACTIVE

`ACTIVE` represents an edition currently operating.

Potential activities include:

* Fixtures being played
* Live scoring
* Results being recorded
* Announcements being published

The system must not infer that every fixture is live merely because the edition is active.

Fixture lifecycle remains independent.

---

# 25. COMPLETED

`COMPLETED` represents an edition whose sports operations have concluded.

A completed edition may still receive authorised corrections.

Completion does not make data immutable by itself.

However, ordinary editing should become more restricted.

---

# 26. CANCELLED

`CANCELLED` represents an edition that will not proceed.

Historical information may still be preserved.

A cancelled edition should not be hard-deleted solely because it did not occur.

---

# 27. Lifecycle Transitions

Conceptually:

```text
DRAFT
  │
  ▼
PLANNED
  │
  ▼
ACTIVE
  │
  ▼
COMPLETED
```

Cancellation may occur where appropriate:

```text
DRAFT ──────► CANCELLED
PLANNED ────► CANCELLED
```

Whether an active edition can be cancelled depends on operational requirements.

---

# 28. State Transition Enforcement

Edition state transitions should be controlled through domain operations rather than arbitrary status mutation.

Prefer operations such as:

```text
planEdition()
activateEdition()
completeEdition()
cancelEdition()
```

over unrestricted:

```text
update status = "COMPLETED"
```

This allows transition rules and audit behaviour to be enforced consistently.

---

# 29. Invalid State Transitions

The system should reject invalid transitions.

For example:

```text
COMPLETED
   ↓
ACTIVE
```

should not happen through ordinary administration.

If exceptional recovery is required, it should use an explicitly authorised correction workflow.

---

# 30. Publication State

Operational lifecycle and public visibility are different concepts.

An edition may therefore have a separate publication state.

Initial conceptual states:

```text
DRAFT
PUBLISHED
```

Potential future needs may introduce additional states, but they are not currently required.

---

# 31. Operational State vs Publication State

Example:

```text
Operational State:
PLANNED

Publication:
DRAFT
```

means the edition exists operationally but is not publicly visible.

Another example:

```text
Operational State:
PLANNED

Publication:
PUBLISHED
```

means students may view the upcoming event.

---

# 32. Published Active Event

During the event:

```text
Operational State:
ACTIVE

Publication:
PUBLISHED
```

Public pages may prioritise:

* Current fixtures
* Live matches
* Results
* Announcements

---

# 33. Completed Published Event

After completion:

```text
Operational State:
COMPLETED

Publication:
PUBLISHED
```

The edition remains publicly accessible as historical information.

It transitions naturally into the archive experience.

---

# 34. Unpublishing

Unpublishing an edition should not delete it.

Conceptually:

```text
PUBLISHED
    ↓
DRAFT
```

may be allowed for authorised administrators where necessary.

However, unpublishing a completed historical edition should be treated carefully because public links may already exist.

---

# 35. Current Event

The platform may highlight a current Event Edition.

"Current" should primarily reflect operational state rather than a manually maintained global boolean.

For example:

```text
status = ACTIVE
```

is a strong indication that the edition is currently operating.

---

# 36. Multiple Active Editions

The architecture should not assume that only one Event Edition can ever be active globally.

Example:

A future situation could involve:

```text
National Sports Day activities
+
Reflex competition
```

overlapping operationally.

Therefore:

```text
isCurrentEvent = one global record
```

should not be a core platform assumption.

---

# 37. Featured Event

Public presentation may require one edition to receive primary homepage visibility even when multiple editions are relevant.

This is a presentation concept rather than an operational lifecycle concept.

A future `featured` or homepage configuration mechanism may be introduced.

It should not determine whether the event is operationally active.

---

# 38. Upcoming Events

An upcoming edition is generally a published edition whose operational lifecycle has not yet become ACTIVE.

Potentially:

```text
PLANNED
+
PUBLISHED
+
startDate in future
```

The exact public-query rules will be defined in `19-public-website.md`.

---

# 39. Past Events

Completed published editions form the primary historical archive.

Conceptually:

```text
Event
TSpark
  │
  ├── 2027 ← recent
  ├── 2026
  ├── 2025
  └── 2024
```

The latest edition should generally receive priority.

Older editions remain navigable.

---

# 40. Archive Behaviour

Historical editions should not be moved into a separate disconnected storage system merely because they are old.

They remain normal Event Edition records.

"Archive" is primarily a product/navigation state.

Conceptually:

```text
Current Data
+
Historical Data
=
Same Structured Platform
```

---

# 41. Event Landing Page

The recurring Event may have a landing page.

Example:

```text
TSpark
```

The page may show:

* Event description
* Latest edition
* Current/upcoming edition
* Previous editions
* Historical winners
* Relevant information

Detailed public UX belongs in `19-public-website.md`.

---

# 42. Edition Page

An Event Edition page may provide access to:

* Overview
* Sports
* Competitions
* Fixtures
* Results
* Winners
* Standings
* Announcements

depending on the event and available information.

---

# 43. Creating an Event

Creating a recurring Event should be an infrequent administrative operation.

Potential workflow:

```text
Sports Administrator
      ↓
Create Event
      ↓
Name
Description
Slug
      ↓
Event Available
```

Creating an Event should not automatically create an Event Edition.

---

# 44. Creating an Event Edition

Potential workflow:

```text
Select Event
     ↓
Create Edition
     ↓
Select Academic Period
     ↓
Set Edition Label
     ↓
Set Dates
     ↓
Create as DRAFT
```

Competition configuration follows afterward.

---

# 45. Edition Creation Should Start as Draft

New Event Editions should default to:

```text
Operational State:
DRAFT

Publication:
DRAFT
```

This prevents incomplete configuration from becoming public accidentally.

---

# 46. Reusing Previous Edition Configuration

Recurring events may have similar structures each year.

Example:

```text
TSpark 2026
    ↓
Football
Cricket
Chess
Volleyball
...
```

TSpark 2027 may require many of the same competitions.

A future administrative capability may allow:

```text
Create edition from previous edition
```

However, this must create new records rather than reuse historical operational records.

---

# 47. Edition Cloning

Conceptually:

```text
TSpark 2026
      │
      │ Clone configuration
      ▼
TSpark 2027
```

Potentially copied:

* Competition definitions
* Categories
* Format configuration
* Rules
* Venue defaults

Must not be copied as historical outcomes:

* Fixtures
* Scores
* Results
* Winners
* Participants
* Audit records

Exact cloning behaviour will be defined when the feature is required.

---

# 48. Event-Specific Configuration

Different events may require different capabilities.

Example:

```text
TSpark
→ Department competitions
→ Standings
→ Indoor/outdoor sports

Reflex
→ Esports
→ Fun games

National Sports Day
→ Structure currently uncertain
```

The platform should represent these differences through configuration and domain records rather than separate hardcoded applications.

---

# 49. Event Type

A generic Event Type entity is not currently required.

The platform should not prematurely create:

```text
SPORTS_FEST
ESPORTS_EVENT
NATIONAL_DAY
```

unless those classifications eventually control meaningful behaviour.

Names and descriptions alone are not sufficient justification for another domain abstraction.

---

# 50. Event Features

If events eventually require configurable capabilities, feature configuration may be introduced.

Conceptually:

```text
TSpark 2027
├── competitions
├── department standings
└── live scoring

Reflex 2027
├── competitions
└── live scoring
```

This should only be introduced when event-level feature differences actually affect application behaviour.

---

# 51. Event Ownership

Event Edition operational records should belong clearly to their edition.

For example:

```text
TSpark 2027
│
├── Men's Football
│    ├── Fixtures
│    └── Results
│
├── Women's Football
│    ├── Fixtures
│    └── Results
│
└── Chess
```

Data from TSpark 2026 must not accidentally appear in TSpark 2027 because a Sport or Department reference is shared.

---

# 52. Competition Ownership

Competitions belong to one Event Edition.

Conceptually:

```text
EventEdition 1:N Competition
```

The same reusable Sport may appear in many editions.

Example:

```text
Sport
Football

├── TSpark 2026 → Men's Football
├── TSpark 2026 → Women's Football
├── TSpark 2027 → Men's Football
└── TSpark 2027 → Women's Football
```

---

# 53. Event Status Does Not Replace Competition Status

An ACTIVE Event Edition may contain competitions that are:

```text
UPCOMING
ACTIVE
COMPLETED
CANCELLED
```

Competition lifecycle must remain independent.

Similarly, fixture lifecycle remains independent from both.

---

# 54. Completion Requirements

Completing an Event Edition may require validation.

Potential checks include:

* No fixtures remain LIVE
* Required competitions have concluded
* Results are sufficiently finalised

The exact requirements should remain configurable or operationally appropriate.

The platform should not assume every event must contain competitions.

---

# 55. Completion Does Not Freeze History Permanently

Historical data may occasionally require correction.

Example:

```text
TSpark 2027
COMPLETED

Incorrect final result discovered
```

An appropriately authorised administrator may correct the record.

Such changes should:

* Require suitable permission
* Preserve audit history
* Avoid silent rewriting

---

# 56. Cancellation

Cancelling an Event Edition should preserve its identity and available historical information.

Potential public presentation:

```text
Reflex 2027
Cancelled
```

rather than pretending the edition never existed.

Whether cancelled draft editions become public depends on publication decisions.

---

# 57. Date Changes

Upcoming event dates may change.

Authorised administrators should be able to update edition dates before or during planning.

Changes to publicly published dates should eventually support:

* Audit history
* Announcement workflow where appropriate

The platform should not require a developer deployment for date changes.

---

# 58. Event Date Validation

At minimum:

```text
startDate <= endDate
```

Where Academic Period dates are available, the system may warn if an edition falls outside its associated academic period.

Whether this is an error or warning depends on actual institutional rules.

---

# 59. Fixture Date Validation

A fixture associated with an Event Edition will normally occur during the edition's operational period.

However, the system should not enforce this blindly until requirements for:

* Qualifiers
* Postponements
* Rescheduled finals

are understood.

Validation may eventually distinguish between:

```text
Warning
vs
Blocking Error
```

---

# 60. Timezone

TSDW Sports operations require a defined platform timezone.

The application should not rely on whichever timezone happens to exist on the server.

Event and fixture timestamps should be stored consistently and rendered using the configured operational timezone.

The specific timezone configuration belongs in implementation/environment design.

---

# 61. Administrative Event List

The admin interface should allow authorised users to distinguish between:

```text
Active
Upcoming
Draft
Completed
Cancelled
```

editions.

Historical editions should remain searchable and manageable according to permissions.

---

# 62. Public Event Ordering

Public event presentation should generally prioritise:

```text
Active
    ↓
Upcoming
    ↓
Recently Completed
    ↓
Historical
```

The exact homepage presentation belongs in `19-public-website.md`.

---

# 63. Event Search and Filtering

As history grows, administrators and public users may need filtering by:

* Event
* Academic period
* Year
* Status

Advanced search is not required for V1, but the data model should support these relationships.

---

# 64. Permissions

Event operations should use the RBAC model defined in [`04-auth-and-rbac.md`](./04-auth-and-rbac.md).

Examples:

```text
System Administrator
→ all editions

Sports Administrator
→ broad event management

Event Manager
→ assigned edition

Scorekeeper
→ no general edition management
```

---

# 65. Event Manager Scope

Example:

```text
User
Event Manager

Scope:
TSpark 2027
```

The user may manage allowed resources beneath that edition.

Conceptually:

```text
TSpark 2027
├── Competitions
├── Fixtures
├── Entrants
├── Venues
└── Announcements
```

according to assigned permissions.

---

# 66. Audit Requirements

Important event operations should eventually produce audit records.

Examples:

* Event created
* Event renamed
* Edition created
* Edition published
* Edition activated
* Edition completed
* Edition cancelled
* Dates changed
* Historical edition corrected

Detailed audit schema belongs in `21-audit-logs.md`.

---

# 67. Deletion Rules — Event

A recurring Event should not normally be hard-deleted if historical editions exist.

Preferred operation:

```text
Deactivate Event
```

Historical editions remain accessible.

---

# 68. Deletion Rules — Event Edition

A draft Event Edition with no meaningful operational data may potentially be deleted.

Once an edition contains published or historical sports records, deletion should be strongly restricted.

Prefer:

```text
Cancel
Unpublish
Archive through lifecycle
```

over destructive deletion.

---

# 69. Deletion Rules — Academic Period

An Academic Period referenced by historical records should not be deleted through ordinary administration.

Its existence provides historical context.

---

# 70. Event Invariants

### EVT-001

Every Event Edition must belong to an Event.

### EVT-002

An Event may contain multiple Event Editions.

### EVT-003

Operational records from one edition must not be reused as records of another edition.

### EVT-004

Creating a new edition must not modify previous editions.

### EVT-005

An Event Edition may belong to an Academic Period.

### EVT-006

Academic Period and Event Edition are distinct concepts.

### EVT-007

Operational state and publication state are distinct.

### EVT-008

A completed edition remains historically accessible when published.

### EVT-009

Deactivating an Event must not remove historical editions.

### EVT-010

Committee tenure must not be inferred from the Event Edition.

### EVT-011

Multiple Event Editions may potentially be active simultaneously.

### EVT-012

Event lifecycle must not determine individual fixture state.

### EVT-013

Event names and edition labels must not serve as database identity.

### EVT-014

A newly created edition must not become publicly visible by default.

### EVT-015

Historical corrections must preserve auditability.

---

# 71. Example — TSpark

```text
AcademicPeriod
2026–27

Event
TSpark

EventEdition
TSpark 2027
├── Start: 2 Jan 2027
├── End: 4 Jan 2027
├── Status: PLANNED
├── Publication: PUBLISHED
│
├── Men's Football
├── Women's Football
├── Cricket
├── Chess
└── ...
```

As the event begins:

```text
TSpark 2027

PLANNED
   ↓
ACTIVE
```

After operations conclude:

```text
ACTIVE
   ↓
COMPLETED
```

The edition then remains available historically.

---

# 72. Example — Reflex

```text
Event
Reflex
│
├── Reflex 2026
└── Reflex 2027
```

Reflex may contain:

```text
Esports competitions
Fun-game competitions
Other activities
```

without requiring a separate event architecture.

---

# 73. Example — National Sports Day

The exact National Sports Day format is currently unknown.

The platform should therefore avoid inventing event-specific rules.

It can initially exist as:

```text
Event
National Sports Day

EventEdition
National Sports Day 2027
```

with detailed competitions or activities added when actual requirements are known.

---

# 74. V1 Requirements

V1 should support administrators performing:

```text
Create Event
     ↓
Create Edition
     ↓
Associate Academic Period
     ↓
Configure Dates
     ↓
Configure Edition
     ↓
Publish
     ↓
Activate
     ↓
Operate Event
     ↓
Complete
     ↓
Preserve in Archive
```

V1 does not require:

* Automated edition creation every year
* Automatic cloning
* Advanced event templates
* Multi-organisation event ownership

---

# 75. Future Enhancements

Potential future capabilities include:

* Edition templates
* Clone previous edition
* Event branding
* Event-specific media
* Automated archival presentation
* Event-level dashboards
* Event analytics
* Scheduled publication
* Scheduled activation
* Event feature configuration

These should only be implemented when justified by actual workflows.

---

# 76. Open Questions

## OQ-EVT-001 — Academic Period Dates

Does TCET provide canonical start/end dates for academic years that the platform should store?

---

## OQ-EVT-002 — Edition Naming

Should public edition naming consistently use:

```text
TSpark 2027
```

or sometimes:

```text
TSpark 2026–27
```

depending on official TSDW convention?

---

## OQ-EVT-003 — Multiple Active Events

Can TSDW Sports operate multiple formal event editions concurrently?

The architecture already permits this.

The answer affects public homepage behaviour.

---

## OQ-EVT-004 — Event Completion

Who has authority to mark an entire Event Edition as completed?

---

## OQ-EVT-005 — Event Cancellation

What operational states may be cancelled after fixtures or results already exist?

---

## OQ-EVT-006 — Edition Cloning

How similar are TSpark competition structures between academic years?

This determines whether cloning provides meaningful administrative value.

---

## OQ-EVT-007 — National Sports Day

What competitions and workflows are actually used during National Sports Day?

No assumptions should be encoded until this is known.

---

# 77. Decisions Established by This Document

This document establishes that:

* Academic Period, Event, and Event Edition are separate concepts.
* A generic Season entity will not initially be introduced.
* Event Edition owns occurrence-specific sports operations.
* Event lifecycle and publication state are separate.
* Editions begin as unpublished drafts.
* Historical editions remain normal structured records.
* Multiple editions may potentially be active concurrently.
* Event status does not replace competition or fixture status.
* Recurring Events may be deactivated without deleting history.
* Edition creation must preserve historical independence.
* Calendar-year edition labels and academic periods may coexist.

Significant decisions should be reflected in [`27-decisions.md`](./27-decisions.md).

---

# 78. Related Documentation

* [`00-overview.md`](./00-overview.md) — Product terminology
* [`01-product-requirements.md`](./01-product-requirements.md) — Product requirements
* [`02-system-architecture.md`](./02-system-architecture.md) — System architecture
* [`03-data-model.md`](./03-data-model.md) — Conceptual data model
* [`04-auth-and-rbac.md`](./04-auth-and-rbac.md) — Access control
* [`26-roadmap.md`](./26-roadmap.md) — Release scope
* [`27-decisions.md`](./27-decisions.md) — Decision log

The next domain document is:

* `06-sports-and-competitions.md`

---

# 79. Current Status

**Status: Initial Baseline**

The event and edition model is sufficiently defined to design sports, competition categories, competition formats, entrants, and competition lifecycle.

Some institutional details remain intentionally open and should be resolved using actual TSDW practices rather than assumptions.
