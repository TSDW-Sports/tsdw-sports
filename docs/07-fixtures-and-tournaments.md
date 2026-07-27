# TSDW Sports Platform — Fixtures & Tournaments

## 1. Purpose

This document defines how the **TSDW Sports Platform** models fixtures, tournament stages, rounds, scheduling, match lifecycle, scores, results, progression, BYEs, walkovers, postponements, corrections, and competition completion.

It establishes:

* Fixture identity
* Fixture participants/sides
* Scheduling
* Fixture lifecycle
* Score state
* Official results
* Tournament stages and rounds
* Knockout brackets
* Progression
* BYEs
* Walkovers
* Draws and tie-breaks
* Postponements
* Result corrections
* Concurrency expectations
* Tournament completion
* Historical integrity

Detailed real-time transport and sport-specific live scoring belong in `08-live-scoring.md`.

---

# 2. Core Hierarchy

Conceptually:

```text
EventEdition
    │
    └── Competition
          │
          ├── CompetitionEntries
          │
          ├── Tournament Structure
          │      ├── Stages
          │      └── Rounds
          │
          ├── Fixtures
          │      ├── Sides
          │      ├── Score
          │      └── Result
          │
          └── Placements
```

A Fixture always exists within the context of a Competition.

---

# 3. Fixture

## Entity

`Fixture`

## Purpose

Represents a scheduled or defined competitive encounter within a Competition.

Example:

```text
Competition:
TSpark 2027 Men's Football

Fixture:
CMPN vs IT
```

Potential fixture information includes:

```text
Fixture
├── id
├── competitionId
├── stageId?
├── roundId?
├── sequence/order
├── scheduledAt?
├── venueId?
├── status
├── publicationState
└── operational metadata
```

Sport-specific score details should not be placed directly into the generic Fixture structure.

---

# 4. Fixture Identity

Fixture identity must not depend on:

* Team names
* Department names
* Scheduled time
* Round label
* Score

These values may change.

Each Fixture requires a stable internal identifier.

---

# 5. Fixture Number

Events may use human-readable fixture numbers.

Example:

```text
Match 1
Match 2
Match 3
```

or:

```text
F01
F02
F03
```

These may be useful for:

* Event-day coordination
* Brackets
* Announcements
* Scorekeeping

A display number is not necessarily the database identifier.

---

# 6. Fixture Side

A Fixture contains participating positions.

Conceptually:

```text
Fixture
├── Side A
└── Side B
```

Each side may resolve to a Competition Entry.

Example:

```text
Side A → CMPN
Side B → IT
```

For most initial TSDW sports, fixtures are expected to be two-sided.

---

# 7. Why Fixture Side Is Conceptually Separate

Tournament fixtures may exist before their participants are known.

Example:

```text
Semi Final 1

Side A:
Winner of Quarter Final 1

Side B:
Winner of Quarter Final 2
```

At bracket creation time:

```text
Side A → unresolved
Side B → unresolved
```

After earlier fixtures finish:

```text
Side A → CMPN
Side B → IT
```

Therefore, a fixture side may represent either:

* A known Competition Entry
* A progression source that will later resolve to an entry

---

# 8. Two-Sided Fixtures

V1 should optimise for two-sided competitive encounters.

Conceptually:

```text
Fixture
├── Side A
└── Side B
```

This covers most:

* Team sports
* Racquet sports
* Board games
* Esports matches

The broader domain model should avoid making expansion to multi-entrant events impossible.

---

# 9. Multi-Entrant Events

Some activities may involve several entrants competing simultaneously.

Examples could include:

* Races
* Certain athletics events
* Multi-player activities

These may require a different event-result model rather than forcing them into a two-sided Fixture abstraction.

V1 should not over-generalise Fixture solely for hypothetical multi-entrant events.

Such events may initially use manual competition results if required.

---

# 10. Scheduling

A Fixture may have:

```text
scheduledAt
venue
```

Potentially:

```text
estimatedDuration
court/ground/resource
```

if operational requirements justify them.

A Fixture may exist before its schedule is final.

---

# 11. Unscheduled Fixtures

Bracket structure may be created before exact times are known.

Example:

```text
Semi Final
Participants: TBD
Date/Time: TBD
```

Therefore, schedule information should not necessarily be required when creating a Fixture.

---

# 12. Venue

A Fixture may reference a Venue.

Example:

```text
Fixture:
CMPN vs IT

Venue:
Football Ground
```

Venue modelling is expanded in `16-venues-and-checkin.md`.

---

# 13. Fixture Publication

Operational existence and public visibility are separate.

Example:

```text
Status:
SCHEDULED

Publication:
DRAFT
```

versus:

```text
Status:
SCHEDULED

Publication:
PUBLISHED
```

Organisers may prepare fixtures internally before publishing them.

---

# 14. Fixture Lifecycle

Initial conceptual states:

```text
DRAFT
SCHEDULED
LIVE
COMPLETED
POSTPONED
CANCELLED
WALKOVER
```

Additional internal states should only be introduced if actual workflows require them.

---

# 15. DRAFT

A Fixture exists but is not operationally ready.

Potential reasons:

* Participants unresolved
* Schedule incomplete
* Venue unknown
* Tournament structure still being edited

Draft fixtures should not become public accidentally.

---

# 16. SCHEDULED

A Fixture is ready for upcoming competition.

Potential characteristics:

* Participants known or valid progression sources defined
* Match expected to occur
* Operational configuration ready

Exact date/time may still be adjusted.

---

# 17. LIVE

The Fixture is currently being played.

During LIVE state:

* Score updates may occur
* Public live state may be broadcast
* Authorised scorekeepers may perform operational updates

Entering LIVE should be an explicit domain operation.

---

# 18. COMPLETED

The Fixture has concluded and has an official Result.

A completed Fixture should not accept normal live-score updates.

Corrections require a controlled workflow.

---

# 19. POSTPONED

The Fixture was scheduled but cannot proceed at the expected time.

A postponed Fixture may later be rescheduled.

Conceptually:

```text
SCHEDULED
    ↓
POSTPONED
    ↓
SCHEDULED
```

The history of schedule changes should remain auditable where appropriate.

---

# 20. CANCELLED

The Fixture will not be played and does not produce an ordinary competitive Result.

Cancellation should preserve the Fixture record where it has operational or historical significance.

---

# 21. WALKOVER

A walkover represents a Fixture resolved without ordinary play because one entrant advances under applicable rules.

Example:

```text
CMPN vs IT

IT unavailable

CMPN wins by walkover
```

The platform must distinguish this from an ordinary played result.

---

# 22. Fixture State Transitions

Typical lifecycle:

```text
DRAFT
  ↓
SCHEDULED
  ↓
LIVE
  ↓
COMPLETED
```

Alternative transitions may include:

```text
SCHEDULED
   ├──► POSTPONED
   ├──► CANCELLED
   └──► WALKOVER
```

A postponed fixture may return to:

```text
SCHEDULED
```

after rescheduling.

---

# 23. Domain Operations

State changes should use explicit operations.

Prefer:

```text
scheduleFixture()
startFixture()
completeFixture()
postponeFixture()
cancelFixture()
recordWalkover()
```

over arbitrary status mutation.

This allows validation, audit recording, progression, and realtime publication to remain consistent.

---

# 24. Starting a Fixture

Conceptually:

```text
startFixture(fixtureId)
```

may validate:

```text
Fixture exists
      ↓
User authorised
      ↓
Fixture state permits start
      ↓
Required entrants resolved
      ↓
No blocking configuration issue
      ↓
Set LIVE
      ↓
Audit
      ↓
Publish state change
```

---

# 25. Score

Score represents the competitive state of a Fixture.

Example:

```text
CMPN 2
IT   1
```

During a live match, score is mutable.

Score does not by itself mean the Fixture has officially concluded.

---

# 26. Generic Score Model

The generic system should support a simple score representation.

Conceptually:

```text
Side A Score
Side B Score
```

This is sufficient for many sports at the public-summary level.

However, detailed sport scoring may require richer data.

---

# 27. Sport-Specific Score State

Different sports may require different score structures.

Examples:

```text
Football
→ goals

Basketball
→ points + quarters

Cricket
→ runs, wickets, overs

Table Tennis
→ sets + points

Valorant
→ maps + rounds
```

The generic Fixture model must not gain every sport's scoring fields.

Detailed score models will be designed in `08-live-scoring.md`.

---

# 28. Score vs Result

These are separate concepts.

During play:

```text
Score
CMPN 2
IT   1

Fixture:
LIVE

Official Result:
none
```

After completion:

```text
Final Score
CMPN 2
IT   1

Fixture:
COMPLETED

Result:
CMPN won
```

---

# 29. Result

## Domain Concept

`Result`

Represents the official outcome of a Fixture.

Potential information:

```text
fixture
winner?
outcome type
final score snapshot
finalisedAt
finalisedBy
metadata
```

The final physical schema may combine some Result information with Fixture-related tables, but the domain distinction must remain.

---

# 30. Result Outcome

Potential outcome types include:

```text
WIN
DRAW
WALKOVER
CANCELLED
NO_RESULT
```

Not every sport supports every outcome.

---

# 31. Winner

A Result may identify a winning Competition Entry.

Example:

```text
Fixture:
CMPN vs IT

Result:
Winner → CMPN
```

Winner must reference an entrant eligible for that Fixture.

---

# 32. Draw

Some competitions may allow:

```text
CMPN 1
IT   1

Result:
DRAW
```

A tournament format requiring progression cannot leave a Fixture unresolved if a winner is required.

In such cases, sport/competition tie-break rules determine the advancing entrant.

---

# 33. Tie-Breaks

Tie-break mechanisms vary by sport.

Examples may include:

* Penalties
* Extra time
* Super over
* Tie-break set
* Additional map
* Competition-specific rule

The core tournament system needs the final advancing entrant.

It does not need to encode every sport's tie-break procedure directly.

---

# 34. Completing a Fixture

Conceptually:

```text
completeFixture()
```

may perform:

```text
Verify authorisation
       ↓
Verify LIVE/valid state
       ↓
Validate final score
       ↓
Determine/validate outcome
       ↓
Create official Result
       ↓
Set Fixture COMPLETED
       ↓
Resolve tournament progression
       ↓
Update derived standings if applicable
       ↓
Audit
       ↓
Commit transaction
       ↓
Broadcast final state
```

The domain change should be atomic where practical.

---

# 35. Result Finalisation

Finalisation is more significant than an ordinary score update.

Depending on the final access policy:

```text
Scorekeeper
→ update score
→ submit result

Event Manager / Sports Administrator
→ finalise result
```

or Scorekeepers may be permitted to finalise directly.

This remains an operational policy decision.

---

# 36. Tournament Structure

A Competition may organise Fixtures into:

```text
Stages
Rounds
Fixtures
```

Conceptually:

```text
Competition
   │
   ├── Stage
   │    └── Round
   │         └── Fixture
   │
   └── Stage
        └── Round
             └── Fixture
```

Simple competitions may not require explicit Stage records.

---

# 37. Tournament Stage

A Stage represents a major phase of competition.

Examples:

```text
Group Stage
Knockout Stage
Final Stage
```

For a pure knockout Competition, one Stage may be sufficient or Stage may be omitted if it adds no value.

---

# 38. Round

A Round groups Fixtures at the same progression level.

Examples:

```text
Round of 16
Quarter Finals
Semi Finals
Final
```

Potential information:

```text
name
sequence
stage
```

---

# 39. Round Ordering

Rounds should have explicit sequence rather than relying on labels.

Example:

```text
1 → Quarter Finals
2 → Semi Finals
3 → Final
```

This allows custom labels without breaking progression logic.

---

# 40. Knockout Tournament

Example with eight entrants:

```text
Quarter Finals

QF1 ─┐
     ├── SF1 ─┐
QF2 ─┘        │
              ├── Final
QF3 ─┐        │
     ├── SF2 ─┘
QF4 ─┘
```

Each later Fixture receives entrants from earlier results.

---

# 41. Progression Source

A Fixture side may be resolved from another Fixture.

Example:

```text
Semi Final 1

Side A:
Winner of QF1

Side B:
Winner of QF2
```

Conceptually:

```text
FixtureSide
├── entryId?
└── sourceFixtureId?
```

The physical model may use a more explicit progression structure.

---

# 42. Progression

When a source Fixture is completed:

```text
QF1
CMPN vs IT
Winner: CMPN
```

the tournament engine resolves:

```text
SF1 Side A
→ CMPN
```

This should occur through backend domain logic.

---

# 43. Progression Must Be Idempotent

Repeated processing of the same completed Result must not duplicate or corrupt bracket progression.

For example, retrying progression must not create:

```text
SF1
Side A → CMPN
Side A → CMPN
```

or multiple semifinal Fixtures.

Progression operations must be safe to retry.

---

# 44. Winner and Loser Sources

Some tournament structures may need:

```text
Winner of Fixture A
Loser of Fixture A
```

Example:

```text
Third Place Match
├── Loser of SF1
└── Loser of SF2
```

The progression model should support both where required.

---

# 45. Third-Place Fixture

A Competition may optionally contain a third-place Fixture.

Example:

```text
SF1 loser ─┐
           ├── Third Place
SF2 loser ─┘
```

This must be competition configuration rather than globally required behaviour.

---

# 46. BYE

A BYE means an entrant advances without playing a normal Fixture in that round.

Example with six entrants in an eight-slot bracket:

```text
QF1: A vs BYE → A advances
QF2: B vs C
QF3: D vs BYE → D advances
QF4: E vs F
```

A BYE is not the same as a walkover.

---

# 47. BYE vs Walkover

### BYE

Known as part of tournament structure.

No opponent is assigned.

```text
Entrant
   ↓
Advances automatically
```

### Walkover

A scheduled competitive encounter existed, but one side advances because the opponent cannot or does not compete.

```text
A vs B
     ↓
B unavailable
     ↓
A wins by walkover
```

These should remain distinct concepts.

---

# 48. BYE Representation

The platform should avoid creating fake entrants such as:

```text
Team Name:
BYE
```

A BYE represents an empty bracket position or automatic progression condition.

It is not a Competition Entry.

---

# 49. Automatic BYE Progression

Bracket generation may automatically advance an entrant through a BYE.

This progression should still be represented clearly enough that:

* Bracket display is understandable
* Future rounds resolve correctly
* Audit/debugging remains possible

No fake score or ordinary Result should be required.

---

# 50. Walkover Result

A walkover should produce an official competitive outcome.

Example:

```text
Fixture:
CMPN vs IT

Status:
WALKOVER

Result:
Winner → CMPN
Outcome → WALKOVER
```

A walkover may trigger normal tournament progression.

---

# 51. Knockout Bracket Generation

Input may include:

```text
Competition
Competition Entries
Seeds
Format Configuration
```

Output may include:

```text
Rounds
Fixtures
Progression relationships
BYE positions
```

Bracket generation should occur on the backend.

---

# 52. Bracket Size

Knockout bracket structures commonly require power-of-two slots.

Examples:

```text
2
4
8
16
32
```

If entrant count is not a power of two, BYEs may be introduced.

Example:

```text
6 entrants
→ 8-slot bracket
→ 2 BYEs
```

---

# 53. Seeding

If seed values exist, bracket generation may use them.

Example:

```text
Seed 1
Seed 2
Seed 3
Seed 4
```

Exact seeding algorithms should not be assumed until TSDW rules are confirmed.

V1 may support:

* Manual bracket arrangement
* Basic random draw
* Seeded generation

only where required.

---

# 54. Random Draw

If random fixture generation is supported, the generated draw becomes persistent tournament data.

The application should not re-randomise the bracket on every request.

Once accepted:

```text
Generated Draw
     ↓
Persist
     ↓
Publish
```

Regeneration after publication should require deliberate administrative action.

---

# 55. Manual Bracket

Administrators should be able to create or adjust a bracket manually before operations begin.

This is important because real event organisers may have constraints not captured by an automated algorithm.

Once results exist, structural bracket editing must become heavily restricted.

---

# 56. Bracket Locking

The system may introduce a concept of bracket readiness/locking.

Conceptually:

```text
Draft Bracket
    ↓
Review
    ↓
Lock / Publish
    ↓
Competition Operations
```

The exact mechanism may be implemented through Competition/Fixture lifecycle rather than a separate boolean.

---

# 57. Structural Changes After Results

Suppose:

```text
QF1 completed
QF2 completed
SF1 participants resolved
```

An administrator should not casually:

* Remove QF1
* Swap entrants
* Change QF1 winner
* Rebuild the bracket

because downstream state depends on those records.

Such changes require controlled correction logic.

---

# 58. Result Dependency

A Fixture result may affect:

* Future fixture entrants
* Competition placement
* Standings
* Public results
* Certificates
* Achievements

Therefore, result correction is a domain operation, not a simple field edit.

---

# 59. Result Correction

Example:

```text
QF1
Original winner: CMPN

Incorrect result discovered

Correct winner: IT
```

The system must determine whether downstream data exists.

Potentially affected:

```text
SF1 participant
SF1 result
Final participant
Placements
```

The platform must not silently replace QF1 winner while leaving contradictory downstream history.

---

# 60. Correction Strategy

Corrections should distinguish between:

### Safe correction

No dependent fixture has started.

```text
QF1 corrected
     ↓
Update unresolved/downstream entrant
```

### Dangerous correction

Dependent fixture has already started or completed.

```text
QF1 corrected
     ↓
SF1 already completed
```

This requires explicit administrative handling.

V1 may block automatic correction in such cases and require manual recovery by a System/Sports Administrator.

---

# 61. Correction Reason

Corrections to finalised Results should require a reason.

Example:

```text
Reason:
Incorrect score entered during event
```

The audit record should preserve:

* Previous result
* Corrected result
* Actor
* Timestamp
* Reason

---

# 62. Score Corrections During LIVE

Live score updates are ordinary mutable operational state.

Example:

```text
2–1
↓
Scorekeeper corrects mistaken update
↓
1–1
```

This should not require the same workflow as correcting a finalised Result.

However, live-score changes may still be logged where operationally useful.

---

# 63. Fixture Rescheduling

A Fixture may need:

```text
scheduledAt
venue
```

changed because of:

* Weather
* Venue conflict
* Delayed previous match
* Operational decision

Rescheduling should not require recreating the Fixture.

---

# 64. Postponement

Example:

```text
SCHEDULED
   ↓
POSTPONED

scheduledAt:
old time retained through audit/history

new schedule assigned

POSTPONED
   ↓
SCHEDULED
```

Public presentation should clearly communicate postponed status.

---

# 65. Fixture Cancellation

Cancellation means the Fixture will not produce an ordinary played outcome.

Depending on competition rules, cancellation may:

* Have no progression
* Require manual progression
* Trigger another competition decision

The system must not automatically invent a winner.

---

# 66. Round Robin

For round-robin competitions, Fixtures do not primarily progress winners into later Fixtures.

Instead:

```text
Fixture Results
      ↓
Standings
      ↓
Ranking / Qualification
```

The tournament engine must therefore separate:

```text
Fixture completion
```

from:

```text
Knockout progression
```

---

# 67. Round-Robin Fixture Generation

For N entrants, the platform may eventually generate a schedule ensuring required pairings.

Automation is only necessary if confirmed by actual TSDW competition formats.

Manual Fixture creation remains valid.

---

# 68. Standings Impact

A completed Result may contribute to standings.

Example:

```text
Win  → 3 points
Draw → 1 point
Loss → 0 points
```

These rules vary by Competition.

Detailed standings logic belongs in `10-departments-and-standings.md`.

The Fixture system provides authoritative Results as input.

---

# 69. Group Stage

A group-stage Competition may organise entrants into groups.

Example:

```text
Group A
├── CMPN
├── IT
├── AIML
└── MECH
```

Fixtures contribute to group standings.

Qualification then determines entrants entering another Stage.

---

# 70. Group Qualification

Conceptually:

```text
Group Results
      ↓
Standings
      ↓
Qualification Rule
      ↓
Knockout Fixture Side
```

Detailed qualification automation may be deferred.

V1 can support manual qualification if actual rules are too varied.

---

# 71. Groups + Knockout

Example:

```text
GROUP STAGE
     ↓
Group A standings
Group B standings
     ↓
Qualified entrants
     ↓
SEMI FINALS
     ↓
FINAL
```

The Stage model supports this structure without creating separate Competition records for each phase.

---

# 72. Manual Tournament Format

A MANUAL Competition may still contain:

* Fixtures
* Scores
* Results
* Placements

but progression is controlled manually.

This is useful for:

* Unusual fun games
* Formats not yet automated
* Incomplete historical data

Manual mode should not bypass validation or permissions.

---

# 73. Competition Completion

A Competition may be completed when its required competitive operations have concluded.

Potential validation:

```text
No Fixture LIVE
Required final Results available
Required Placements available
```

Exact conditions depend on Competition format.

---

# 74. Knockout Completion

A simple knockout Competition may be complete when:

```text
Final Fixture completed
      ↓
Winner known
      ↓
Required placements created
```

If a third-place Fixture exists, it may also need completion.

---

# 75. Placement Generation

For a standard knockout:

```text
Final winner
→ 1st

Final loser
→ 2nd
```

If third-place Fixture exists:

```text
Third-place winner
→ 3rd
```

Automatic placement generation should only occur where the Competition format provides unambiguous rules.

---

# 76. Manual Placements

Administrators may manually establish placements when:

* Format is MANUAL
* Historical records are incomplete
* Competition rules do not support automated derivation

Manual placement changes after finalisation should be audited.

---

# 77. Fixture Ordering

Fixtures may require explicit display/order fields.

Example event schedule:

```text
09:00 Match 1
10:00 Match 2
11:00 Match 3
```

Ordering must not rely solely on database creation time.

---

# 78. Simultaneous Fixtures

The system must support multiple Fixtures occurring at the same time.

Example:

```text
10:00

Football Ground
CMPN vs IT

Chess Room
AIML vs MECH

Esports Lab
Team A vs Team B
```

No global assumption should restrict the platform to one live Fixture.

---

# 79. Multiple Scorekeepers

Different scorekeepers may operate different Fixtures concurrently.

Example:

```text
Scorekeeper A
→ Football Fixture

Scorekeeper B
→ Chess Fixture

Scorekeeper C
→ Valorant Fixture
```

Permissions and realtime channels should remain resource-scoped.

---

# 80. Concurrent Updates to One Fixture

Two authorised users may accidentally attempt to update the same Fixture simultaneously.

Example:

```text
Scorekeeper A
score: 2–1

Scorekeeper B
score: 1–1
```

The backend must prevent silent loss of newer authoritative state.

---

# 81. Concurrency Control

The exact mechanism will be selected during implementation.

Potential strategies include:

* Optimistic concurrency/version field
* Transactional locking where appropriate
* Operation sequence numbers

The system should be able to detect stale updates.

---

# 82. Fixture Version

A Fixture or score state may conceptually expose:

```text
version = 14
```

A client sends:

```text
expectedVersion = 14
```

If the authoritative state is already:

```text
version = 15
```

the stale update can be rejected or reconciled.

Detailed live-score concurrency belongs in `08-live-scoring.md`.

---

# 83. Idempotency

Important operations should tolerate retries safely.

Examples:

```text
completeFixture
recordWalkover
finaliseResult
```

A network retry should not create:

* Duplicate Results
* Duplicate progression
* Duplicate placements

where the original operation already succeeded.

---

# 84. Transaction Boundary

Completing a knockout Fixture may affect several records.

Conceptually:

```text
BEGIN

Create/finalise Result
Set Fixture COMPLETED
Resolve winner
Populate downstream Fixture Side
Create/update audit record

COMMIT
```

If a required operation fails, the system should avoid leaving partial tournament state.

---

# 85. Realtime Publication

Realtime updates occur after authoritative persistence.

Conceptually:

```text
Scorekeeper
    ↓
API
    ↓
Validate
    ↓
Persist
    ↓
Commit
    ↓
Broadcast
```

The realtime system must not become the source of truth.

---

# 86. Client Reconnection

If a spectator loses connection:

```text
Connected
   ↓
Disconnected
   ↓
Several score updates happen
   ↓
Reconnect
```

the client should retrieve authoritative current state rather than assuming it received every realtime message.

Detailed behaviour belongs in `08-live-scoring.md`.

---

# 87. Public Fixture Visibility

Published Fixtures may expose:

* Competition
* Round
* Entrants
* Schedule
* Venue
* Status
* Score
* Result

Private operational metadata should not automatically become public.

---

# 88. TBD Entrants

Future bracket Fixtures may publicly show unresolved sides.

Example:

```text
Semi Final 1

Winner of QF1
vs
Winner of QF2
```

After resolution:

```text
CMPN
vs
IT
```

This allows the complete bracket to be published before every entrant is known.

---

# 89. Fixture History

Historical Fixtures remain attached to their original Competition and Event Edition.

Example:

```text
TSpark 2026
└── Men's Football
    └── Final
        ├── CMPN
        ├── IT
        ├── Score
        └── Result
```

New editions create new Fixtures.

---

# 90. Historical Incomplete Data

Older event records may only contain:

```text
Winner
Runner-up
```

without complete Fixtures.

The platform should not require fake Fixtures to represent historical competition outcomes.

Competition Placements may exist without complete historical tournament structure.

---

# 91. Fixture Permissions

The RBAC model applies.

Conceptually:

```text
System Administrator
→ All fixture operations

Sports Administrator
→ Broad fixture operations

Event Manager
→ Fixtures within assigned Event Edition

Scorekeeper
→ Operational actions within assigned scope
```

---

# 92. Scorekeeper Permissions

A Scorekeeper may potentially receive:

```text
fixture.read
fixture.start
fixture.score.update
fixture.complete
```

depending on policy.

They should not automatically receive:

```text
fixture.create
fixture.delete
bracket.regenerate
competition.update
result.correct.final
```

---

# 93. Finalisation Authority

Two possible policies remain:

### Model A

```text
Scorekeeper
→ update score
→ complete/finalise Fixture
```

### Model B

```text
Scorekeeper
→ update score
→ submit final score

Event Manager/Admin
→ approve/finalise Result
```

V1 should choose based on actual TSDW event-day workflow rather than unnecessary bureaucracy.

---

# 94. Audit Requirements

Important operations should be auditable.

Examples:

* Fixture created
* Fixture rescheduled
* Fixture started
* Fixture postponed
* Fixture cancelled
* Walkover recorded
* Result finalised
* Final Result corrected
* Bracket generated
* Bracket regenerated
* Entrant manually changed
* Placement finalised

---

# 95. Tournament Invariants

### FIX-001

Every Fixture must belong to exactly one Competition.

### FIX-002

A Fixture entrant must resolve to a Competition Entry belonging to that Competition.

### FIX-003

A Fixture must not be treated as LIVE solely because its scheduled time has arrived.

### FIX-004

A live Score is not an official Result.

### FIX-005

A completed Fixture must not accept ordinary live-score updates.

### FIX-006

A BYE must not be represented as a fake Competition Entry.

### FIX-007

A BYE and WALKOVER are different concepts.

### FIX-008

Knockout progression must use official Results.

### FIX-009

Tournament progression must be idempotent.

### FIX-010

A stale concurrent update must not silently overwrite newer authoritative state.

### FIX-011

Structural tournament changes must not silently invalidate existing Results.

### FIX-012

Final Result correction must preserve audit history.

### FIX-013

Correcting a Result must account for dependent downstream tournament state.

### FIX-014

Fixture state and Competition state are independent.

### FIX-015

Fixture state and Event Edition state are independent.

### FIX-016

A cancelled Fixture must not automatically produce a winner.

### FIX-017

A walkover may produce an official winner and progression.

### FIX-018

Multiple Fixtures may be LIVE simultaneously.

### FIX-019

Realtime transport must not be the authoritative store of Score or Result state.

### FIX-020

Historical incomplete data must not require fabricated Fixtures.

---

# 96. Example — Four-Team Knockout

Entrants:

```text
CMPN
IT
AIML
MECH
```

Bracket:

```text
Semi Final 1
CMPN ─┐
      ├── Winner ─┐
IT ───┘           │
                  ├── Final
AIML ─┐           │
      ├── Winner ─┘
MECH ─┘
```

Suppose:

```text
SF1
CMPN 2
IT   1

Winner:
CMPN
```

Then:

```text
Final Side A
→ CMPN
```

---

# 97. Example — Six-Team Knockout

Entrants:

```text
A
B
C
D
E
F
```

Eight-slot bracket:

```text
A ───── BYE ───┐
               ├── SF1
B ─┐            │
   ├── QF ──────┘
C ─┘

D ───── BYE ───┐
               ├── SF2
E ─┐            │
   ├── QF ──────┘
F ─┘
```

The BYE positions are tournament structure, not fake teams.

---

# 98. Example — Walkover

```text
Fixture
CMPN vs IT

Scheduled
2 January, 11:00
```

IT cannot participate.

Authorised operation:

```text
recordWalkover(
  winner = CMPN
)
```

Result:

```text
Fixture:
WALKOVER

Result:
Winner → CMPN
Outcome → WALKOVER
```

CMPN may then advance normally.

---

# 99. Example — Postponement

Original:

```text
CMPN vs IT
2 Jan
11:00
Football Ground
```

Weather prevents play.

```text
SCHEDULED
    ↓
POSTPONED
```

Later:

```text
3 Jan
09:00
Football Ground
```

Fixture returns to:

```text
SCHEDULED
```

The same Fixture identity remains.

---

# 100. Example — Result Correction

Original:

```text
QF1

CMPN 2
IT   1

Winner:
CMPN
```

Later verified as:

```text
CMPN 1
IT   2

Winner:
IT
```

If the semifinal has not started:

```text
Correct QF1 Result
      ↓
Update QF1
      ↓
Replace downstream unresolved entrant
CMPN → IT
      ↓
Audit
```

If the semifinal has already completed:

```text
Automatic correction blocked
      ↓
Administrator required
      ↓
Explicit recovery workflow
```

---

# 101. Example — Public Bracket

Before quarter finals finish:

```text
Quarter Final 1
CMPN vs IT

Quarter Final 2
AIML vs MECH

Semi Final 1
Winner of QF1
vs
Winner of QF2
```

After completion:

```text
Semi Final 1
CMPN
vs
AIML
```

The same bracket structure remains; only unresolved sides become resolved.

---

# 102. V1 Scope

V1 should support:

* Fixture creation
* Fixture scheduling
* Venues
* Publication state
* Two-sided Fixtures
* Draft/Scheduled/Live/Completed lifecycle
* Postponement
* Cancellation
* Walkovers
* Generic score summary
* Official Results
* Winner resolution
* Knockout rounds
* Knockout bracket relationships
* BYEs
* Manual brackets
* Basic bracket generation
* Tournament progression
* Competition Placements
* Result corrections
* Concurrent score-update protection
* Audit integration

---

# 103. Conditionally Required for V1

The following should be implemented if confirmed by actual competition formats:

* Round Robin
* Group Stage
* Groups + Knockout
* Third-place matches
* Draw handling
* Seeded bracket generation

We should not build complex tournament algorithms merely because they might someday be useful.

---

# 104. Deferred Capabilities

Potential later capabilities include:

* Double elimination
* Swiss-system tournaments
* Advanced bracket editing
* Automated complex qualification
* Rich sport-specific match timelines
* Detailed cricket scoring
* Map-by-map esports scoring
* Set-by-set racquet scoring
* Automatic venue optimisation
* Automatic schedule generation
* Referee assignment
* Match check-in
* Offline score synchronisation

These require separate requirements before implementation.

---

# 105. Open Questions

## OQ-FIX-001 — Current Tournament Formats

Which formats are actually used for each TSpark sport?

---

## OQ-FIX-002 — Scorekeeper Authority

Can a scorekeeper declare the official result immediately, or does a Secretary/Event Manager approve it?

---

## OQ-FIX-003 — Fixture Creation

Are TSpark brackets currently:

* Randomly drawn
* Seeded
* Manually decided
* Different by sport

---

## OQ-FIX-004 — Third Place

Which sports conduct third-place matches?

---

## OQ-FIX-005 — Walkovers

What official rules determine a walkover?

---

## OQ-FIX-006 — Rescheduling

Can a postponed Fixture move outside the formal Event Edition dates?

---

## OQ-FIX-007 — Simultaneous Editing

Will one Fixture normally have one assigned scorekeeper, or may multiple organisers update the same Fixture?

---

## OQ-FIX-008 — Score Detail

Which sports need detailed live scoring beyond a simple numeric summary in V1?

This directly affects `08-live-scoring.md`.

---

## OQ-FIX-009 — Historical Fixtures

How much fixture-level historical data from previous TSpark editions is available?

---

## OQ-FIX-010 — Manual Override

Which roles should be permitted to manually replace an entrant in a bracket after the bracket is published?

---

# 106. Decisions Established by This Document

This document establishes that:

* Fixture belongs to Competition.
* Fixture lifecycle is independent from Event and Competition lifecycle.
* Fixtures are primarily two-sided in V1.
* Future bracket participants may remain unresolved.
* Score and Result are separate concepts.
* Tournament progression uses official Results.
* BYEs are not fake entrants.
* Walkovers are official outcomes distinct from BYEs.
* Knockout progression is backend-owned and idempotent.
* Multiple Fixtures may operate concurrently.
* Concurrent score updates require conflict protection.
* Finalised Result corrections are controlled domain operations.
* Corrections must account for downstream tournament dependencies.
* Historical incomplete records need not fabricate Fixtures.
* Manual tournament operation remains supported.
* Realtime distribution occurs after authoritative persistence.

Significant decisions should be reflected in [`27-decisions.md`](./27-decisions.md).

---

# 107. Related Documentation

* [`02-system-architecture.md`](./02-system-architecture.md) — System architecture
* [`03-data-model.md`](./03-data-model.md) — Conceptual data model
* [`04-auth-and-rbac.md`](./04-auth-and-rbac.md) — Access control
* [`05-events-and-seasons.md`](./05-events-and-seasons.md) — Event lifecycle
* [`06-sports-and-competitions.md`](./06-sports-and-competitions.md) — Competition model
* [`26-roadmap.md`](./26-roadmap.md) — Release scope
* [`27-decisions.md`](./27-decisions.md) — Decision log

Future relevant documents include:

* `08-live-scoring.md`
* `10-departments-and-standings.md`
* `16-venues-and-checkin.md`
* `18-admin-dashboard.md`
* `19-public-website.md`
* `21-audit-logs.md`

---

# 108. Current Status

**Status: Initial Baseline**

The Fixture, Result, scheduling, knockout, progression, BYE, walkover, correction, and concurrency models are sufficiently defined to design the administrative and public interfaces.

Detailed sport-specific live scoring remains intentionally deferred to `08-live-scoring.md`.
