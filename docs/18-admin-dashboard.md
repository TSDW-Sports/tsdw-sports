# TSDW Sports Platform — Admin Dashboard

## 1. Purpose

This document defines the administrative interface of the **TSDW Sports Platform**.

The Admin Dashboard is the operational workspace used by authorised TSDW Sports personnel to configure events, manage competitions, schedule fixtures, operate live scoring, publish results, and maintain sports content.

It establishes:

* Admin information architecture
* Navigation
* Role-aware access
* Dashboard behaviour
* Event management
* Competition management
* Entrant management
* Fixture management
* Tournament/bracket management
* Live-scoring workflows
* Result management
* Publishing workflows
* Historical administration
* User/access management
* Safety and confirmation patterns
* Mobile/event-day requirements
* V1 interface scope

This document defines product behaviour and UX requirements.

Detailed visual design is intentionally deferred until implementation/prototyping.

---

# 2. Core Principle

The Admin Dashboard is not a generic CMS.

It is an operational sports-management interface.

The primary workflow is:

```text
Create Event Edition
        ↓
Configure Competitions
        ↓
Add Entrants
        ↓
Create Tournament Structure
        ↓
Schedule Fixtures
        ↓
Publish
        ↓
Operate Event
        ↓
Update Live Scores
        ↓
Finalise Results
        ↓
Complete Competitions
        ↓
Complete Event Edition
```

The interface should optimise for this workflow.

---

# 3. Admin Application Boundary

The administrative interface may conceptually live under:

```text
/admin
```

Example structure:

```text
/admin
├── dashboard
├── events
├── competitions
├── fixtures
├── live
├── results
├── sports
├── achievements
├── committee
└── users
```

Exact routes will be determined during frontend implementation.

The route hierarchy is not a security boundary.

All protected actions must be authorised by the API.

---

# 4. Authentication

Unauthenticated users attempting to access administrative functionality should be redirected to the authentication flow.

Conceptually:

```text
/admin
   ↓
Authenticated?
   │
   ├── No → Login
   │
   └── Yes
        ↓
   Resolve Permissions
        ↓
   Admin Interface
```

Successful authentication does not imply unrestricted admin access.

---

# 5. Role-Aware Interface

The dashboard should adapt to the authenticated user's effective permissions.

Example:

```text
System Administrator
├── Events
├── Competitions
├── Fixtures
├── Live Scoring
├── Achievements
├── Committee
├── Users
└── System Administration
```

A Scorekeeper may instead see:

```text
Scorekeeper
├── Dashboard
├── Assigned Fixtures
└── Live Scoring
```

Unavailable capabilities should not clutter the interface.

Backend authorisation remains mandatory.

---

# 6. Navigation Principles

Navigation should prioritise frequent operational tasks.

Primary concepts include:

```text
Dashboard
Events
Fixtures
Live
Results
```

Secondary management areas may include:

```text
Sports
Achievements
Committee
Users
```

depending on permissions.

The interface should avoid exposing every database entity as an equal navigation item.

---

# 7. Contextual Navigation

Many operations occur within an Event Edition.

Instead of forcing administrators to repeatedly navigate:

```text
Events
→ Competitions
→ Find TSpark 2027
→ Fixtures
→ Find TSpark 2027
```

the dashboard should support an Event Edition workspace.

Example:

```text
TSpark 2027
├── Overview
├── Competitions
├── Fixtures
├── Schedule
├── Results
├── Standings
├── Announcements
└── Settings
```

Only supported modules should appear.

---

# 8. Event Edition Workspace

An Event Edition should act as the main administrative context during event preparation and operation.

Example header:

```text
TSpark 2027

PLANNED
Published

2 Jan 2027 – 4 Jan 2027
```

Potential actions:

```text
Edit
Publish / Unpublish
Activate
Complete
Cancel
```

Actions must depend on state and permissions.

---

# 9. Global Dashboard

The `/admin` landing page should provide an operational summary.

Potential sections:

* Active events
* Upcoming events
* Live fixtures
* Fixtures starting soon
* Recently completed fixtures
* Operational issues
* Quick actions

The dashboard should answer:

> What requires attention right now?

rather than simply displaying generic statistics.

---

# 10. Dashboard Example

Conceptually:

```text
TSDW Sports Admin

ACTIVE EVENT
TSpark 2027
Day 2 of 3

LIVE NOW
3 Fixtures

UP NEXT
8 Fixtures

RECENT RESULTS
5 Completed

ACTION REQUIRED
2 Results awaiting finalisation
1 Fixture postponed
```

Exact metrics depend on implemented workflows.

---

# 11. Quick Actions

Authorised users may receive contextual quick actions such as:

```text
Create Event Edition
Create Competition
Create Fixture
Open Live Scoring
Publish Fixtures
```

Actions should reflect role permissions.

A Scorekeeper should not see:

```text
Create Event Edition
```

if they cannot perform it.

---

# 12. Event Management

The Events area should distinguish recurring Events from Event Editions.

Example:

```text
Events

TSpark
├── TSpark 2027
├── TSpark 2026
└── TSpark 2025

Reflex
├── Reflex 2027
└── Reflex 2026
```

The latest/relevant editions should receive priority.

Historical editions remain accessible.

---

# 13. Event List

Potential filtering:

```text
All
Active
Upcoming
Draft
Completed
Cancelled
```

Potential search:

```text
Search event or edition
```

Advanced filtering is not required initially.

---

# 14. Create Event

Creating a recurring Event should be available only to suitably privileged users.

Potential form:

```text
Name
Slug
Description
Status
```

The interface should explain that an Event represents the recurring identity.

Example:

```text
TSpark
```

not:

```text
TSpark 2027
```

---

# 15. Create Event Edition

Potential workflow:

```text
Create Edition
     ↓
Event
     ↓
Academic Period
     ↓
Edition Label
     ↓
Start Date
     ↓
End Date
     ↓
Description
     ↓
Create Draft
```

New editions should begin unpublished.

---

# 16. Event Status Controls

Lifecycle actions should be explicit.

Instead of a generic dropdown:

```text
Status:
[ COMPLETED ▼ ]
```

prefer contextual operations:

```text
Activate Event
Complete Event
Cancel Event
```

where appropriate.

This makes significant transitions harder to perform accidentally.

---

# 17. Publishing Controls

Publication should be visibly distinct from operational status.

Example:

```text
Status
PLANNED

Visibility
PUBLISHED
```

Potential actions:

```text
Publish
Unpublish
```

The interface must not imply that publishing automatically activates the event.

---

# 18. Competition Management

Inside an Event Edition:

```text
TSpark 2027
    ↓
Competitions
```

administrators should be able to:

* Create Competition Groups
* Create Competitions
* Configure sport
* Configure division
* Configure entrant type
* Configure format
* Add rules
* Add entrants
* Publish competitions
* Manage lifecycle

---

# 19. Competition Group Presentation

Example:

```text
Outdoor

Men's Football
Women's Football
Cricket
Volleyball

Indoor

Chess
Carrom
Table Tennis
```

Groups should support ordering.

The UI should not hardcode Indoor and Outdoor as the only available groups.

---

# 20. Create Competition

Potential workflow:

```text
Create Competition

Sport
[ Football ]

Name
[ Men's Football ]

Group
[ Outdoor ]

Division
[ Men ]

Entrant Type
[ Department Team ]

Format
[ Knockout ]

Create
```

Advanced configuration may follow creation.

---

# 21. Competition Workspace

A Competition should have its own operational workspace.

Example:

```text
Men's Football
TSpark 2027

READY
Published

Overview
Entrants
Bracket
Fixtures
Results
Rules
Settings
```

Tabs should depend on competition format and implemented features.

---

# 22. Competition Overview

Potential information:

```text
Sport
Football

Division
Men

Format
Knockout

Entrants
8

Fixtures
7

Completed
0

Status
READY
```

Primary actions should be visible contextually.

---

# 23. Entrant Management

For department competitions, the interface should allow bulk selection.

Example:

```text
Add Departments

☑ CMPN
☑ IT
☑ AIML
☑ MECH
☑ EXTC

[ Add Selected ]
```

Administrators should not have to create a redundant team record manually for every department entry.

---

# 24. Named Team Entrants

Where the competition uses named teams:

```text
Add Team

Team Name
[ Team Nova ]

[ Add Team ]
```

Detailed roster management is deferred to the participant/team module.

---

# 25. Entrant List

Example:

```text
Entrants

1. CMPN
2. IT
3. AIML
4. MECH
```

Potential actions before tournament operations:

```text
Edit
Remove
Seed
```

Once fixtures/results depend on entrants, destructive changes should become restricted.

---

# 26. Competition Format Configuration

For Knockout:

```text
Format
Knockout

Third-place Match
Yes / No

Draw Method
Manual / Random / Seeded
```

Only supported configuration should be shown.

The UI should not expose irrelevant settings for every format.

---

# 27. Bracket Setup

For knockout competitions:

```text
Entrants
    ↓
Configure Draw
    ↓
Preview Bracket
    ↓
Confirm
    ↓
Persist Fixtures
```

The administrator should see the bracket before accepting generated structure.

---

# 28. Bracket Preview

Example:

```text
Quarter Finals

CMPN ─────┐
          ├── QF1
IT ───────┘

AIML ─────┐
          ├── QF2
MECH ─────┘
```

Potential actions:

```text
Shuffle
Adjust
Confirm Bracket
```

if the selected generation method permits them.

---

# 29. Bracket Confirmation

Before confirmation:

```text
DRAFT BRACKET
```

After confirmation:

```text
CONFIRMED
```

Once the competition begins, structural changes should be restricted.

The exact domain mechanism may use lifecycle state rather than a dedicated bracket status.

---

# 30. BYE Presentation

BYEs should be presented clearly:

```text
CMPN
vs
BYE
```

for human understanding.

However, the interface must not create BYE as an actual Competition Entry.

---

# 31. Fixture Management

The fixture area should support both:

```text
Global fixture view
```

and:

```text
Event/Competition fixture view
```

The global view is useful during event-day operations.

---

# 32. Fixture List

Potential columns/cards:

```text
Time
Sport / Competition
Round
Side A
Side B
Venue
Status
```

Example:

```text
10:00
Men's Football
Quarter Final
CMPN vs IT
Football Ground
SCHEDULED
```

---

# 33. Fixture Filters

Useful filters include:

```text
Event
Date
Competition
Sport
Venue
Status
```

Event-day presets may include:

```text
Live
Upcoming
Completed
Postponed
```

---

# 34. Fixture Creation

Manual fixture creation should support:

```text
Competition
Round
Side A
Side B
Date
Time
Venue
```

The system should validate that selected entrants belong to the Competition.

---

# 35. Fixture Editing

Before a Fixture starts, authorised users may modify:

* Schedule
* Venue
* Publication
* Operational metadata

Changing participants or tournament relationships should be more restricted.

---

# 36. Rescheduling

Rescheduling should be a dedicated interaction where practical.

Example:

```text
Reschedule Fixture

Current
2 Jan 2027 — 10:00

New
2 Jan 2027 — 13:00

Reason
[ Ground unavailable ]

[ Confirm Reschedule ]
```

Reason requirements may depend on audit policy.

---

# 37. Postponement

Potential action:

```text
Postpone Fixture
```

Confirmation should show:

* Fixture
* Participants
* Current schedule
* Public impact

The UI should clearly indicate that postponement does not delete the Fixture.

---

# 38. Fixture Cancellation

Cancellation is destructive to expected operations and should require explicit confirmation.

Example:

```text
Cancel CMPN vs IT?

This fixture will remain in historical records but will not be played.

[ Keep Fixture ]
[ Cancel Fixture ]
```

---

# 39. Live Operations

The Admin Dashboard should provide a dedicated event-day operational area.

Conceptually:

```text
/live
```

This should prioritise speed and clarity over complex administration.

---

# 40. Live Operations Dashboard

Example:

```text
LIVE NOW

Men's Football
CMPN 2 – 1 IT
12 min remaining

Women's Volleyball
AIML 1 – 1 EXTC

UP NEXT

11:30
Chess
CMPN vs MECH
```

Authorised users can enter the relevant scoring console.

---

# 41. Assigned Fixtures

Scorekeepers should receive a focused view.

Example:

```text
My Fixtures

LIVE
CMPN vs IT
Men's Football

UPCOMING
AIML vs MECH
Men's Football
12:00
```

This reduces the risk of updating the wrong fixture.

---

# 42. Live Scoring Console

The scoring console should be optimised for event-day use.

Example:

```text
Men's Football
Quarter Final

CMPN              IT

2                  1

[-] [+]          [-] [+]

LIVE

[ Complete Match ]
```

Actual controls depend on sport-specific scoring requirements.

---

# 43. Score Update UX

Common scoring operations should require minimal interaction.

For simple scoring:

```text
+1
-1
```

may be preferable to repeatedly editing text fields.

However, score changes must still go through the authoritative API.

---

# 44. Live State Visibility

The console should clearly display:

```text
SCHEDULED
LIVE
COMPLETED
POSTPONED
```

The scorekeeper should never have to guess whether changes are being treated as live official operations.

---

# 45. Start Fixture

Starting should be deliberate.

Example:

```text
Start Match

CMPN vs IT
Men's Football

[ Cancel ]
[ Start Match ]
```

Once started:

```text
Status → LIVE
```

and realtime public updates may begin.

---

# 46. Complete Fixture

Completing a Fixture is more significant than changing score.

Potential flow:

```text
Complete Match
      ↓
Review Final Score
      ↓
Review Winner / Outcome
      ↓
Confirm
      ↓
Finalise / Submit Result
```

The exact finalisation authority depends on RBAC policy.

---

# 47. Result Review

Example:

```text
Final Score

CMPN
2

IT
1

Winner
CMPN

[ Back ]
[ Confirm Result ]
```

For supported draw outcomes:

```text
Outcome
DRAW
```

may be available.

---

# 48. Walkover

Walkover should be a dedicated operation.

Example:

```text
Record Walkover

Fixture
CMPN vs IT

Winner
[ CMPN ]

Reason
[ Team unavailable ]

[ Confirm Walkover ]
```

It should not require entering a fake score.

---

# 49. Result Correction

Finalised results should not expose an ordinary:

```text
Edit
```

button.

Prefer:

```text
Correct Result
```

which communicates that the operation affects official history.

---

# 50. Result Correction Flow

Potential flow:

```text
Correct Result
      ↓
Show Existing Result
      ↓
Enter Correct Result
      ↓
Reason Required
      ↓
Dependency Check
      ↓
Confirm
```

If downstream tournament state makes automatic correction unsafe:

```text
Correction cannot be applied automatically.

This result has dependent completed fixtures.
Administrative recovery is required.
```

---

# 51. Realtime Conflict Handling

If another administrator updates the same Fixture while the current screen contains stale state, the interface must not silently overwrite the newer state.

Potential behaviour:

```text
This fixture changed since you opened it.

Current score:
2–1

Your attempted update was based on:
1–1

[ Reload Current State ]
```

More sophisticated reconciliation may be introduced later.

---

# 52. Connection State

During live operations, the interface should indicate realtime/network state.

Example:

```text
Connected
Reconnecting
Offline
```

The user should not assume an update succeeded merely because they clicked a button.

---

# 53. Mutation Feedback

Important operations should provide clear status.

Example:

```text
Updating score…
Score updated
```

or:

```text
Update failed
Current score has been reloaded.
```

Avoid ambiguous success states.

---

# 54. Mobile Event-Day Use

Live scoring must work effectively on phones.

This is not optional.

Event-day scorekeepers are unlikely to sit at desktop computers beside every field or court.

The scoring interface should therefore prioritise:

* Large touch targets
* Minimal typing
* High readability
* Fast loading
* Clear connection state
* Simple navigation
* Prevention of accidental destructive actions

---

# 55. Desktop Administration

Complex setup workflows are better suited to desktop layouts.

Examples:

* Event configuration
* Competition creation
* Bracket setup
* Fixture scheduling
* User management

The Admin Dashboard should be responsive rather than forcing identical interaction patterns across device sizes.

---

# 56. Results Management

The Results area should allow authorised users to inspect:

```text
Recently Completed
Awaiting Finalisation
Finalised
Corrected
```

depending on the chosen approval workflow.

---

# 57. Competition Completion

Within a Competition workspace:

```text
Complete Competition
```

should only become available when domain requirements are satisfied.

Potential checks:

```text
No live fixtures
Final result available
Required placements available
```

If blocked, the UI should explain why.

---

# 58. Placements

Administrators should be able to inspect official placements.

Example:

```text
Men's Football

1st — CMPN
2nd — IT
3rd — AIML
```

Where placements are derived automatically, the UI should identify the source.

Manual correction should require appropriate permissions.

---

# 59. Event Completion

Completing an Event Edition should be treated as a significant operation.

Potential confirmation:

```text
Complete TSpark 2027?

All competitions should have concluded before completing the event.

Historical data will remain accessible.

[ Cancel ]
[ Complete Event ]
```

The backend determines whether completion is valid.

---

# 60. Historical Editions

Completed editions remain accessible through the Admin Dashboard.

Example:

```text
TSpark

2027
COMPLETED

2026
COMPLETED

2025
COMPLETED
```

The latest edition should receive priority.

Older editions may use a collapsed/archive presentation.

---

# 61. Historical Editing

Historical records should not appear as freely editable as active data.

For completed editions, normal controls may be replaced with:

```text
View
Correct
```

where applicable.

This reinforces the distinction between operational editing and historical correction.

---

# 62. Sports Management

Privileged administrators may manage reusable Sports.

Example:

```text
Sports

Football
ACTIVE

Cricket
ACTIVE

Chess
ACTIVE

Valorant
ACTIVE
```

Potential actions:

```text
Create
Edit
Deactivate
```

Hard deletion should be restricted where historical references exist.

---

# 63. Achievements Management

The platform should eventually support management of TCET official sports-team achievements.

Potential interface:

```text
Achievements

2026–27
├── Football — Intercollegiate Championship — Winner
├── Chess — University Tournament — Runner-up
└── ...
```

Detailed requirements belong in `11-achievements.md`.

For V1 prototyping, this section may use representative data and basic CRUD structure.

---

# 64. Committee Management

Authorised users should be able to maintain TSDW Sports committee history.

Example:

```text
Committee

2026–27

Secretary
Person A

Joint Secretary
Person B

Members
...
```

Previous periods should remain available historically.

Committee roles do not grant system permissions automatically.

---

# 65. User Management

Only appropriately privileged users should access platform user administration.

Potential list:

```text
Name
Identity
Status
Roles
Scopes
```

Example:

```text
Person A
ACTIVE
Event Manager
TSpark 2027
```

---

# 66. Assign Role

Potential workflow:

```text
User
     ↓
Role
     ↓
Scope
     ↓
Confirm
```

Example:

```text
Role
Scorekeeper

Scope
Men's Football — TSpark 2027
```

The interface should make the scope highly visible.

---

# 67. Revoke Access

Revocation should be straightforward.

Example:

```text
Revoke Scorekeeper Access?

User:
Person A

Scope:
TSpark 2027 Men's Football

Historical actions will remain in audit records.

[ Cancel ]
[ Revoke ]
```

---

# 68. System Administrator Management

Granting System Administrator access should require stronger confirmation.

The interface should make clear that this role grants platform-wide technical administration.

Routine sports operations should not require it.

---

# 69. Committee vs User Interface

The UI must not blur:

```text
Committee Member
```

and:

```text
Platform User
```

A person may appear in committee history without having administrative access.

Likewise, a technical administrator may have system access without holding a committee position.

---

# 70. Audit Visibility

Important entities may expose an activity/history view.

Example:

```text
Fixture History

10:03
Score changed 1–0 → 1–1
by Scorekeeper A

10:27
Fixture completed
by Scorekeeper A

10:35
Result finalised
by Event Manager B
```

Detailed audit implementation belongs in `21-audit-logs.md`.

---

# 71. Dangerous Actions

Actions capable of affecting historical or public data should be visually and behaviourally distinguished.

Examples:

* Cancel Event
* Cancel Competition
* Cancel Fixture
* Correct Result
* Regenerate Bracket
* Revoke Access
* Unpublish completed data

These should not sit beside ordinary Save actions without confirmation.

---

# 72. Confirmation Strategy

Not every action needs confirmation.

Avoid confirmations for ordinary reversible edits such as:

```text
Change description
Update venue before event
```

Require stronger confirmation for consequential operations such as:

```text
Finalise Result
Cancel Fixture
Correct Final Result
Revoke Access
```

Excessive confirmations reduce their usefulness.

---

# 73. Destructive Action Language

Buttons should describe the actual operation.

Prefer:

```text
Cancel Fixture
Revoke Access
Correct Result
```

over vague:

```text
Proceed
Confirm
Submit
```

where the action is consequential.

---

# 74. Empty States

Empty states should help administrators continue the workflow.

Example:

```text
No competitions yet.

Create the first competition for TSpark 2027.

[ Create Competition ]
```

instead of:

```text
No data found.
```

---

# 75. Loading States

Operational pages should provide meaningful loading states.

For example, the live dashboard should not show:

```text
0 live fixtures
```

while data is still loading.

Loading, empty, error, and populated states must remain distinct.

---

# 76. Error States

Errors should explain:

* What failed
* Whether the operation was applied
* What the user can do next

Example:

```text
Score update failed.

The fixture was updated by another scorekeeper.
Current state has been reloaded.
```

Avoid exposing raw server errors to ordinary administrators.

---

# 77. Unsaved Changes

Forms containing meaningful configuration should warn before navigation if unsaved changes would be lost.

This is particularly useful for:

* Competition configuration
* Rules
* Event setup

Simple immediate actions should not require a large form-save model.

---

# 78. Search

Search may be useful for:

* Events
* Competitions
* Fixtures
* Users
* Historical records

V1 does not require a universal command-palette search.

Context-specific search is sufficient.

---

# 79. Responsive Navigation

Desktop may use:

```text
Sidebar
```

Mobile may use:

```text
Compact navigation
```

The live-scoring workflow should require very few navigation steps on mobile.

---

# 80. Admin Home During No Active Event

Outside active event periods, the dashboard may prioritise:

```text
Upcoming Events
Draft Editions
Recent Results
Achievements
Setup Tasks
```

The dashboard should adapt to operational context.

---

# 81. Admin Home During Active Event

During TSpark:

```text
LIVE FIXTURES
UP NEXT
POSTPONED
RESULTS TO REVIEW
EVENT STATUS
```

should receive higher priority than configuration statistics.

---

# 82. Operational Attention Model

The dashboard should surface exceptions.

Examples:

```text
Fixture scheduled but venue missing
Competition has no entrants
Fixture postponed without new schedule
Result awaiting finalisation
Competition ready but unpublished
```

This is more useful than vanity metrics.

---

# 83. Notifications

In-app operational notifications may eventually surface:

* Result submitted
* Fixture postponed
* Schedule changed
* Access assigned
* Competition published

Full notification architecture is deferred to `17-notifications.md`.

V1 should not depend on a complete notification system.

---

# 84. Public Preview

Administrators may benefit from:

```text
View Public Page
```

for:

* Event Edition
* Competition
* Fixture
* Achievement

This should open the corresponding public representation rather than create a separate preview implementation where possible.

---

# 85. Draft Preview

If unpublished data requires previewing, a secure preview mechanism may eventually be introduced.

This is not mandatory for initial implementation.

---

# 86. Bulk Operations

Useful bulk actions may include:

```text
Publish selected fixtures
Add selected departments
```

Bulk destructive operations should be introduced cautiously.

V1 should prioritise workflows that demonstrably save significant organiser time.

---

# 87. Accessibility

The Admin Dashboard should support:

* Keyboard-accessible controls
* Proper labels
* Semantic status indicators
* Sufficient contrast
* Visible focus states
* Screen-reader-compatible form feedback

Status must not be communicated by colour alone.

---

# 88. Performance

Event-day pages should prioritise responsiveness.

Particularly:

```text
Live Dashboard
Assigned Fixtures
Live Scoring Console
```

These pages should avoid loading unrelated historical or administrative data.

---

# 89. Admin URL Design

Potential conceptual routes:

```text
/admin

/admin/events
/admin/events/:editionId

/admin/events/:editionId/competitions
/admin/events/:editionId/fixtures
/admin/events/:editionId/results

/admin/competitions/:competitionId

/admin/fixtures
/admin/fixtures/:fixtureId
/admin/fixtures/:fixtureId/live

/admin/sports
/admin/achievements
/admin/committee
/admin/users
```

Exact routing remains an implementation decision.

---

# 90. UI Component Strategy

Reusable admin components may include:

```text
StatusBadge
EntityHeader
DataTable
FilterBar
EmptyState
ConfirmDialog
PermissionGate
EventSwitcher
FixtureCard
ScoreControl
BracketView
ActivityTimeline
```

The UI should reuse domain patterns rather than creating isolated page-specific components everywhere.

---

# 91. Status Vocabulary

The interface should consistently use domain terminology.

Avoid one page saying:

```text
Finished
```

while another says:

```text
Completed
```

for the same state.

Status labels should map consistently to backend domain states.

---

# 92. Optimistic UI

Optimistic updates may be useful for low-risk interactions.

Live scoring requires caution.

The interface must not display an update as authoritative if the server has not accepted it.

Where optimistic interaction is used, failed mutations must reconcile immediately with server state.

---

# 93. Source of Truth

The Admin Dashboard is a client of the API.

Conceptually:

```text
Admin UI
   ↓
API
   ↓
Domain Services
   ↓
Database
```

The frontend must not independently determine official tournament progression, result validity, or permissions.

---

# 94. V1 Primary Roles

The initial admin experience should support:

```text
System Administrator
Sports Administrator
Event Manager
Scorekeeper
```

The UI should not require separate handcrafted applications for each role.

Shared screens should adapt based on permissions.

---

# 95. V1 Admin Scope

V1 should include interfaces for:

### Authentication

* Admin login
* Session handling
* Access-denied states

### Dashboard

* Active/upcoming event summary
* Live fixtures
* Upcoming fixtures
* Recent results
* Contextual quick actions

### Events

* Event list
* Edition list
* Create/edit Event Edition
* Publish
* Activate
* Complete
* Cancel

### Competitions

* Competition groups
* Competition creation
* Sport selection
* Division
* Entrant type
* Format
* Rules
* Entrants
* Lifecycle
* Publication

### Tournaments

* Knockout bracket
* Manual arrangement
* BYEs
* Bracket confirmation
* Progression display

### Fixtures

* Fixture list
* Scheduling
* Venue
* Publication
* Postponement
* Cancellation
* Walkover

### Live Scoring

* Assigned fixtures
* Start fixture
* Score updates
* Complete fixture
* Result review
* Connection/conflict feedback

### Results

* Completed fixtures
* Official results
* Placements
* Controlled correction

### Sports

* Sport list
* Create/edit
* Activate/deactivate

---

# 96. V1 Secondary Interfaces

The initial UI architecture should reserve coherent areas for:

```text
Achievements
Committee
Users / Access
```

but implementation depth may depend on the first release milestone.

Because these are core product requirements, they must not be architecturally excluded even if the first v0 prototype uses representative data.

---

# 97. Not Required for v0 Prototype

The first v0-generated interface does not need functional backend implementation for:

* Real authentication
* Real database mutations
* WebSocket/SSE realtime transport
* Complex sport-specific scoring
* Certificate generation
* Participant login
* Notification delivery
* Audit persistence

However, the UI should be structured so these systems can replace mock behaviour cleanly.

---

# 98. v0 Prototype Goal

The v0 prototype should answer:

> Does this administrative product make sense to an organiser using it before and during a real TSDW Sports event?

It should demonstrate the primary workflows using representative data.

The prototype is not the production backend.

---

# 99. Representative Prototype Data

The v0 prototype may include a fictional/current-style edition such as:

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

Example departments may be used to demonstrate entrant and fixture behaviour.

Prototype data must remain easy to replace with actual canonical data later.

---

# 100. v0 Admin Pages

At minimum, the prototype should demonstrate:

```text
/admin
/admin/events
/admin/events/tspark-2027
/admin/events/tspark-2027/competitions
/admin/competitions/mens-football
/admin/competitions/mens-football/bracket
/admin/fixtures
/admin/fixtures/example/live
```

Routes may differ in final implementation.

The important requirement is workflow coverage.

---

# 101. Admin Dashboard Invariants

### ADM-001

The Admin Dashboard must not be treated as the security boundary.

### ADM-002

Navigation and controls must reflect effective permissions.

### ADM-003

Operational status and publication status must be displayed separately where both matter.

### ADM-004

The UI must not independently determine official tournament progression.

### ADM-005

Finalised Results must not use ordinary unrestricted editing.

### ADM-006

Live scoring must work effectively on mobile devices.

### ADM-007

The interface must distinguish loading, empty, error, and populated states.

### ADM-008

Consequential operations must use clear action-specific language.

### ADM-009

Historical data must remain accessible through the administrative interface.

### ADM-010

Committee positions must not be presented as equivalent to system roles.

### ADM-011

BYEs must not create fake Competition Entries.

### ADM-012

Stale live updates must not silently overwrite newer authoritative state.

### ADM-013

The admin interface must support multiple simultaneously active Fixtures.

### ADM-014

The Event Edition should act as the primary operational context.

### ADM-015

The dashboard should prioritise actionable operational information over vanity metrics.

---

# 102. Example — Event Setup Workflow

```text
Sports Administrator
        ↓
Events
        ↓
TSpark
        ↓
Create 2027 Edition
        ↓
Set dates
        ↓
Create Competition Groups
        ↓
Outdoor
Indoor
        ↓
Create Competitions
        ↓
Add Departments
        ↓
Configure Formats
        ↓
Generate Brackets
        ↓
Schedule Fixtures
        ↓
Review
        ↓
Publish
```

---

# 103. Example — Event-Day Scorekeeper Workflow

```text
Scorekeeper logs in
        ↓
Dashboard
        ↓
My Fixtures
        ↓
CMPN vs IT
        ↓
Start Match
        ↓
LIVE
        ↓
Update Score
        ↓
2–1
        ↓
Complete Match
        ↓
Review Result
        ↓
Submit / Finalise
```

The user should not need access to unrelated administrative modules.

---

# 104. Example — Event Manager Workflow

```text
Event Manager
      ↓
TSpark 2027
      ↓
Live Overview
      ↓
See:
3 live
8 upcoming
1 postponed
2 results awaiting review
      ↓
Resolve operational issues
```

This is the core purpose of the event-day dashboard.

---

# 105. Example — Historical Administration

```text
Events
  ↓
TSpark
  ↓
2026
COMPLETED
  ↓
View Competitions
  ↓
Men's Football
  ↓
Fixtures
Results
Placements
```

Ordinary setup controls should be reduced for completed historical data.

---

# 106. Open Questions

## OQ-ADM-001 — Scorekeeper Devices

Will scorekeepers primarily use:

* Personal phones
* Committee-owned devices
* Laptops
* A combination

This affects event-day UX priorities.

---

## OQ-ADM-002 — Score Finalisation

Can Scorekeepers finalise Results directly, or should an Event Manager/Secretary approve them?

---

## OQ-ADM-003 — Number of Operators

Approximately how many organisers may use the dashboard simultaneously during TSpark?

---

## OQ-ADM-004 — Fixture Assignment

Should Scorekeepers be assigned:

* Individual Fixtures
* Entire Competitions
* Sports
* Any of these depending on responsibility

The RBAC model supports scoped access, but the operational workflow must be chosen.

---

## OQ-ADM-005 — Venue Management

Are venues stable enough to maintain as reusable records, or are they usually entered per event?

---

## OQ-ADM-006 — Result Verification

Does TSDW currently use a paper/referee verification process before declaring results official?

---

## OQ-ADM-007 — Department Data

Who maintains the official list of participating departments and department codes?

---

## OQ-ADM-008 — Event-Day Command View

Does the Secretary require one central screen showing every currently active sport, or will responsibilities be divided among sport coordinators?

---

# 107. Decisions Established by This Document

This document establishes that:

* The Admin Dashboard is an operational sports-management interface.
* Event Edition is the primary administration context.
* The dashboard is role-aware.
* Scorekeepers receive a focused operational interface.
* Live scoring must be mobile-friendly.
* Complex setup workflows may favour desktop.
* Event, Competition, Fixture, and Result lifecycles are reflected directly in the UI.
* Publication state remains separate from operational state.
* Result correction is distinct from ordinary editing.
* Brackets are reviewed before confirmation.
* Historical administration remains available.
* Operational exceptions receive dashboard priority.
* The frontend remains a client of authoritative backend domain logic.
* v0 will prototype workflows using representative data rather than implement production infrastructure.

Significant architectural decisions should be reflected in [`27-decisions.md`](./27-decisions.md).

---

# 108. Related Documentation

* [`02-system-architecture.md`](./02-system-architecture.md) — Platform architecture
* [`03-data-model.md`](./03-data-model.md) — Domain model
* [`04-auth-and-rbac.md`](./04-auth-and-rbac.md) — Authentication and permissions
* [`05-events-and-seasons.md`](./05-events-and-seasons.md) — Event lifecycle
* [`06-sports-and-competitions.md`](./06-sports-and-competitions.md) — Competition model
* [`07-fixtures-and-tournaments.md`](./07-fixtures-and-tournaments.md) — Tournament operations
* [`26-roadmap.md`](./26-roadmap.md) — Release roadmap
* [`27-decisions.md`](./27-decisions.md) — Decision log

The next required v0 document is:

* `19-public-website.md`

Future documents will expand:

* `08-live-scoring.md`
* `11-achievements.md`
* `12-committee.md`
* `16-venues-and-checkin.md`
* `21-audit-logs.md`

---

# 109. Current Status

**Status: Initial Baseline**

The administrative interface, role-aware navigation, event setup, competition setup, fixture management, tournament operation, live-scoring workflow, result management, and historical administration requirements are sufficiently defined for the first prototype.

The next step is to define the public-facing product before generating any interface.
