# TSDW Sports Platform — Public Website

## 1. Purpose

This document defines the public-facing experience of the **TSDW Sports Platform**.

The public website is the primary interface through which students, participants, faculty, alumni, and visitors can:

* Discover TSDW Sports
* View active and upcoming events
* Follow live fixtures
* View schedules
* Explore tournament brackets
* View results and winners
* Explore historical Event Editions
* View official TCET sports-team achievements
* View TSDW Sports committee information
* Access participant services where applicable

The public website must work without authentication for all public information.

Participant-specific functionality such as certificate access may require authentication and is defined separately.

---

# 2. Product Principle

The public website is not primarily an informational college webpage.

It is a **live sports platform**.

During active events, the most important information is:

```text
LIVE NOW
TODAY'S FIXTURES
UPCOMING MATCHES
RECENT RESULTS
EVENT PROGRESS
```

Outside active events, the website may prioritise:

```text
Upcoming Events
Recent Events
Achievements
Sports
Historical Results
```

The homepage should adapt to the current sports context.

---

# 3. Public Information Architecture

Conceptual structure:

```text
/
├── events
│   ├── active
│   ├── upcoming
│   └── archive
│
├── fixtures
│
├── results
│
├── sports
│
├── achievements
│
├── committee
│
└── participant services
```

Event-specific pages form the main content hierarchy.

---

# 4. Primary Navigation

Potential primary navigation:

```text
Home
Events
Fixtures
Results
Achievements
Teams
About
```

Committee information may live under:

```text
About
```

or as a separate navigation item if organisational visibility requires it.

Participant-specific actions may appear separately:

```text
Login
My Certificates
```

when that functionality exists.

Navigation should remain concise.

---

# 5. Homepage

The homepage should answer:

> What is happening in TSDW Sports right now?

The content hierarchy should change based on current event state.

---

# 6. Homepage During Active Event

Example:

```text
TSDW SPORTS

TSpark 2027
LIVE

3 Fixtures Live

[ Follow TSpark ]

────────────────────

LIVE NOW

Men's Football
CMPN       2
IT         1

Women's Volleyball
AIML       1
EXTC       1

────────────────────

UP NEXT

11:30
Chess
CMPN vs MECH

12:00
Cricket
AIML vs IT

────────────────────

RECENT RESULTS

Men's Football
CMPN 2–1 IT

Women's Chess
MECH defeated AIML
```

Live content should appear before general promotional content.

---

# 7. Homepage Outside Active Event

Example:

```text
TSDW SPORTS

Sports. Competition. Community.

UPCOMING

Reflex 2027
Coming Soon

RECENT

TSpark 2027
Completed

[ View Results ]

────────────────────

TCET SPORTS

Recent Achievements

────────────────────

EXPLORE

Events
Sports
Achievements
History
```

The website should remain useful between major events.

---

# 8. Active Event Hero

When an Event Edition is ACTIVE, the homepage may promote it prominently.

Example:

```text
TSPARK 2027

2–4 January 2027

LIVE NOW

[ Follow Event ]
```

The hero should not consume so much space that live information disappears below the first screen on mobile.

---

# 9. Live Now

`Live Now` is one of the highest-priority public experiences.

It should display all publicly visible LIVE Fixtures.

Example:

```text
LIVE NOW

Men's Football
Quarter Final

CMPN             IT
  2       –       1

Football Ground

[ View Match ]
```

Multiple simultaneous live Fixtures must be supported.

---

# 10. No Live Fixtures

If an event is active but nothing is currently live:

```text
No matches are live right now.

Next fixture
11:30

CMPN vs IT
Men's Football
```

This is more useful than displaying an empty section.

---

# 11. Fixture Card

A reusable public Fixture Card may display:

```text
Competition
Round
Entrants
Score / Time
Status
Venue
```

Example:

```text
MEN'S FOOTBALL
Quarter Final

CMPN
2

IT
1

LIVE

Football Ground
```

The visual hierarchy should change depending on Fixture state.

---

# 12. Scheduled Fixture

Example:

```text
MEN'S FOOTBALL
Quarter Final

CMPN
vs
IT

2 Jan
11:00

Football Ground
```

The score area should not display:

```text
0 – 0
```

before the match begins unless that is explicitly meaningful.

Use:

```text
vs
```

instead.

---

# 13. Completed Fixture

Example:

```text
MEN'S FOOTBALL
FINAL

CMPN
2

IT
1

FINAL
```

The winner should be visually identifiable without relying only on colour.

---

# 14. Postponed Fixture

Example:

```text
MEN'S FOOTBALL

CMPN
vs
IT

POSTPONED

New schedule to be announced
```

If a new schedule exists, it should be shown.

---

# 15. Walkover

Example:

```text
MEN'S FOOTBALL

CMPN
vs
IT

CMPN wins by walkover
```

The UI should not display a fabricated score.

---

# 16. Event Page

Each Event should have a public identity page.

Example:

```text
/events/tspark
```

Potential content:

```text
TSpark

Annual inter-department sports event of TCET.

Current / Latest Edition
TSpark 2027

Previous Editions
2026
2025
2024
```

The recurring Event page connects all editions historically.

---

# 17. Event Edition Page

Example:

```text
/events/tspark/2027
```

Potential sections:

```text
Overview
Live
Schedule
Competitions
Results
Standings
```

Only relevant sections should appear.

---

# 18. Event Edition Header

Example:

```text
TSPARK 2027

2–4 January 2027

ACTIVE
```

Potential supporting information:

* Description
* Venue summary
* Event dates
* Current status

The interface should clearly distinguish active, upcoming, and completed editions.

---

# 19. Active Edition Page

During the event, priority should be:

```text
Live Fixtures
Today's Schedule
Recent Results
Competition Progress
```

General description should become secondary.

---

# 20. Upcoming Edition Page

Before the event:

```text
TSpark 2028

2–4 January 2028

UPCOMING

Fixtures will be announced soon.
```

Once fixtures are published, schedules become visible even before activation.

---

# 21. Completed Edition Page

After completion, the page should shift towards:

```text
Winners
Results
Final Standings
Competitions
Archived Fixtures
```

Live-oriented UI should disappear.

---

# 22. Event Archive

Historical editions should remain easy to discover.

Example:

```text
TSpark

Latest
2027

Previous Editions

2026
2025
2024
```

Older editions may be collapsed visually, but they must remain directly accessible.

---

# 23. Historical Integrity

Public historical pages should represent the edition as it officially concluded.

Creating TSpark 2028 must not overwrite:

```text
TSpark 2027
Fixtures
Scores
Results
Winners
```

Historical data remains edition-specific.

---

# 24. Competition Listing

Within an Event Edition:

```text
Competitions

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

Groups are event-configurable.

The public website must not hardcode only Indoor and Outdoor.

---

# 25. Competition Page

Example:

```text
/events/tspark/2027/mens-football
```

Potential content:

```text
Men's Football

Knockout

LIVE / READY / COMPLETED

Bracket
Fixtures
Results
Winner
Rules
```

The exact sections depend on competition state and format.

---

# 26. Competition Header

Example:

```text
TSPARK 2027
MEN'S FOOTBALL

Outdoor
Knockout
```

If completed:

```text
WINNER

CMPN
```

may receive prominent placement.

---

# 27. Competition Entrants

Public entrant display may show:

```text
Participating Departments

CMPN
IT
AIML
MECH
EXTC
```

For named-team competitions:

```text
Participating Teams

Team Nova
Team Phoenix
Team Alpha
```

Participant-level information should only appear when approved for public display.

---

# 28. Bracket

Knockout Competition pages should provide a visual bracket.

Example:

```text
QUARTER FINALS

CMPN ────┐
         ├── CMPN ────┐
IT ──────┘             │
                       ├── FINAL
AIML ────┐             │
         ├── MECH ─────┘
MECH ────┘
```

The bracket should update as official Results resolve progression.

---

# 29. Bracket on Mobile

Traditional wide brackets perform badly on small screens.

Mobile should not simply shrink a desktop bracket until text becomes unreadable.

Possible mobile presentation:

```text
Quarter Finals
↓
Semi Finals
↓
Final
```

with horizontally scrollable rounds or stacked round sections.

Readability takes priority over reproducing a desktop bracket layout exactly.

---

# 30. Unresolved Bracket Entrants

Before earlier Fixtures conclude:

```text
Semi Final

Winner of QF1
vs
Winner of QF2
```

After progression:

```text
Semi Final

CMPN
vs
MECH
```

The public bracket should reflect authoritative progression automatically.

---

# 31. BYEs

Bracket UI may display:

```text
CMPN
BYE
```

to explain automatic progression.

The presentation should make clear that BYE is not another team.

---

# 32. Fixture Page

Each important Fixture may have a public detail page.

Example:

```text
/fixtures/:fixtureId
```

Potential content:

```text
TSpark 2027
Men's Football
Quarter Final

CMPN

2

IT

1

LIVE

Football Ground
```

Additional sport-specific detail may appear where available.

---

# 33. Live Fixture Page

During a live match:

```text
LIVE

CMPN
2

IT
1
```

The interface should update without requiring manual refresh where realtime infrastructure is available.

---

# 34. Live Update Behaviour

Conceptually:

```text
Server persists Score
      ↓
Realtime update
      ↓
Public client receives state
      ↓
UI updates
```

The browser must not treat realtime messages as the permanent source of truth.

On reconnection, authoritative current state should be fetched.

---

# 35. Connection Loss

Public viewers should not be shown misleading information when realtime connectivity is interrupted.

Potential subtle status:

```text
Reconnecting…
```

After reconnection:

```text
Latest match state retrieved
```

The site should recover automatically where possible.

---

# 36. Live Score Timestamp

Where useful, live match views may show:

```text
Updated moments ago
```

or a last-update timestamp.

This can help users understand whether displayed information is current.

It should not imply the match itself stopped when updates temporarily pause.

---

# 37. Fixture Schedule

A central schedule page should support browsing all published Fixtures.

Example:

```text
/fixtures
```

Primary organisation:

```text
Today
Tomorrow
Upcoming
Completed
```

During a multi-day event, date-based browsing is essential.

---

# 38. Schedule Filters

Useful filters may include:

```text
Event
Date
Sport
Competition
Category
Status
```

On mobile, filters should remain compact and usable.

---

# 39. Today's Fixtures

During an active Event Edition:

```text
TODAY

09:00
Men's Football
CMPN vs IT

10:00
Chess
AIML vs MECH

11:30
Cricket
CMPN vs AIML
```

Fixtures may occur simultaneously.

---

# 40. Venue Information

Where venue data exists:

```text
11:30

Men's Football
CMPN vs IT

Football Ground
```

Venue information should be easily visible for upcoming Fixtures.

---

# 41. Results Page

A public Results area should allow users to browse completed Fixtures.

Potential structure:

```text
Results

Today
Yesterday
TSpark 2027
Reflex 2027
```

Filtering should remain event-centric.

---

# 42. Result Card

Example:

```text
FINAL

Men's Football

CMPN
2

IT
1

CMPN wins
```

For a draw:

```text
FINAL

CMPN
1

IT
1

Draw
```

where the Competition permits draws.

---

# 43. Winners

Competition winners should be easy to discover.

Example:

```text
TSpark 2027 Winners

Men's Football
CMPN

Women's Football
AIML

Chess
IT
```

The winner comes from official Competition Placement.

---

# 44. Competition Placements

Where available:

```text
Men's Football

1st
CMPN

2nd
IT

3rd
AIML
```

Shared placements should be representable if applicable.

---

# 45. Overall Event Standings

For events such as TSpark, department standings may eventually display:

```text
Department Standings

1. CMPN
2. IT
3. AIML
4. MECH
```

Detailed calculation belongs in `10-departments-and-standings.md`.

The public website should consume official standings rather than calculate them independently.

---

# 46. Overall Champion

If TSpark determines an overall department champion:

```text
TSPARK 2027

OVERALL CHAMPION

CMPN
```

This is distinct from individual Competition winners.

---

# 47. Sports Directory

The website may provide a Sports section.

Example:

```text
Sports

Football
Cricket
Basketball
Volleyball
Chess
Carrom
Table Tennis
Valorant
```

Only supported/active sports need prominent display.

---

# 48. Sport Page

Potential sport page:

```text
/sports/football
```

Content may include:

```text
Football

Current Competitions
Recent Results
Past Winners
TCET Team Achievements
```

This provides a sport-centric view across events and years.

---

# 49. TCET Official Teams

The public platform should distinguish:

```text
Event Participants
```

from:

```text
Official TCET Sports Teams
```

TSpark department teams are not necessarily the same as the official college team representing TCET externally.

---

# 50. Official Teams Directory

Potential structure:

```text
TCET Teams

Football
Basketball
Cricket
Chess
...
```

The exact model is defined in later team/achievement documentation.

---

# 51. Achievements

The platform should prominently preserve achievements of TCET sports teams.

Potential page:

```text
/achievements
```

Example:

```text
2026–27

Football

Intercollegiate Championship
Winner

Basketball

University Tournament
Runner-up
```

---

# 52. Achievement Information

Potential public information:

```text
Sport
Team
Competition/Tournament
Achievement
Position
Date
Academic Period
Description
Media
```

Actual fields are defined in `11-achievements.md`.

---

# 53. Achievement History

The latest academic period should receive priority.

Older achievements may be grouped by:

```text
2026–27
2025–26
2024–25
```

This follows the project's broader recent-first historical presentation.

---

# 54. Featured Achievements

Major achievements may appear on:

```text
Homepage
Sport Pages
Achievements Page
```

Featured status should be controlled by content configuration rather than inferred purely from placement.

---

# 55. Committee

The public website should identify the organising team behind TSDW Sports.

Potential page:

```text
/about/committee
```

Current academic period:

```text
TSDW SPORTS
2026–27

Secretary
Person A

Joint Secretary
Person B

Members
...
```

---

# 56. Committee History

Previous committees remain accessible.

Example:

```text
Committee

2026–27
[ Expanded ]

2025–26
[ Collapsed ]

2024–25
[ Collapsed ]
```

This matches the requirement to prioritise current leadership while preserving history.

---

# 57. Committee Roles vs Platform Access

The public committee page communicates organisational positions.

It must not expose:

```text
System Administrator
Scorekeeper
Internal Permissions
```

Platform access roles are internal security information.

---

# 58. About TSDW Sports

An About section may explain:

* TSDW Sports
* Purpose
* Event organisation
* College sports culture
* Major events

Content should remain concise.

The platform's primary value is operational sports information, not institutional marketing copy.

---

# 59. Major Events

The website should clearly present major TSDW Sports activities.

Known examples:

```text
TSpark
National Sports Day
Reflex
```

Each should have its own Event identity and edition history.

---

# 60. TSpark Presentation

TSpark should be presented as an annual inter-department sports event involving multiple competitions.

Potential page emphasis:

```text
Live Fixtures
Department Competitions
Schedule
Results
Winners
Standings
History
```

---

# 61. National Sports Day

National Sports Day should use the same Event/Event Edition architecture.

The website must not hardcode assumptions about which sports are conducted until actual operational data is confirmed.

---

# 62. Reflex Presentation

Reflex may emphasise:

```text
Esports
Competitive Games
Fun Games
```

depending on actual event structure.

The same platform architecture should support Reflex without requiring a separate website.

---

# 63. Event Visual Identity

Individual Events may eventually use distinct visual accents.

Example:

```text
TSpark
→ Event-specific identity

Reflex
→ Event-specific identity
```

However, all pages should remain recognisably part of the TSDW Sports platform.

Visual identity must not fragment the product into unrelated microsites.

---

# 64. Design Direction

The public website should feel:

```text
Competitive
Modern
Fast
Energetic
Sports-focused
Institutionally credible
```

It should avoid looking like:

```text
Generic college ERP
Corporate SaaS dashboard
Overdecorated gaming website
Template-heavy event landing page
```

Reflex-specific pages may lean more heavily into esports visual language without changing the entire platform identity.

---

# 65. Visual Hierarchy

Scores and match states should be immediately readable.

Priority example:

```text
LIVE

CMPN      2
IT        1

Men's Football
Quarter Final
```

rather than burying the score inside metadata.

---

# 66. Status Presentation

Common public states include:

```text
LIVE
UPCOMING
FINAL
POSTPONED
CANCELLED
```

Status should not depend only on colour.

Text labels must remain visible.

---

# 67. Department Identity

Department names/codes should remain consistent across:

* Fixtures
* Brackets
* Results
* Standings
* Winners

The website should use canonical department reference data.

---

# 68. Department Page

A future department-centric page may provide:

```text
CMPN

TSpark 2027

Competitions
Fixtures
Results
Achievements
Standings
```

This is useful but not required for the first v0 prototype.

---

# 69. Search

Public search may eventually cover:

* Events
* Sports
* Competitions
* Teams
* Results

Universal search is not required for V1.

Event and sport navigation should make primary information discoverable without search.

---

# 70. Public Authentication Boundary

Viewing public:

```text
Events
Fixtures
Scores
Results
Winners
Achievements
Committee
```

should not require login.

Authentication should only appear when accessing user-specific functionality.

---

# 71. Participant Login

Participant functionality may eventually include:

```text
Login
      ↓
My Participation
      ↓
My Certificates
```

This should remain separate from admin login and admin navigation.

---

# 72. Certificates

Participants may eventually download E-Certificates for eligible participation or achievements.

Potential flow:

```text
Participant Login
       ↓
My Certificates
       ↓
TSpark 2027
       ↓
Men's Football
       ↓
Participation Certificate
       ↓
Download
```

Certificate requirements belong in `14-certificates.md`.

The public website architecture should reserve space for this feature without making v0 depend on it.

---

# 73. Privacy

Public pages should expose only approved information.

Potentially sensitive/private information such as:

* Email addresses
* Phone numbers
* Student IDs
* Internal user IDs
* Access roles

must not appear publicly.

Participant names should only be displayed according to institutional policy and consent/legitimate publication requirements.

---

# 74. SEO

Public Event, Competition, Sport, Achievement, and historical pages should use meaningful metadata.

Example title:

```text
TSpark 2027 Men's Football | TSDW Sports
```

rather than:

```text
Competition | TSDW
```

---

# 75. Shareable URLs

Important public states should have stable URLs.

Examples:

```text
/events/tspark
/events/tspark/2027
/events/tspark/2027/mens-football
/fixtures/:fixtureId
/sports/football
/achievements
```

Users should be able to share a Competition or Fixture directly.

---

# 76. Slugs

Human-readable slugs should be used where practical.

Example:

```text
/events/tspark/2027/mens-football
```

rather than:

```text
/events/9c4e/editions/31/competitions/891
```

Internal IDs may still be used behind the scenes.

---

# 77. Social Sharing

Event and Competition pages may eventually provide suitable social metadata.

Sharing:

```text
TSpark 2027 Men's Football Final
```

should produce useful title, description, and preview information where supported.

This should not require manually generating a unique page for every share.

---

# 78. Mobile-First Requirement

A significant portion of public traffic during college events is likely to come from phones.

Therefore:

* Scores must be readable instantly
* Fixtures must be easy to scan
* Filters must remain usable
* Brackets must adapt properly
* Navigation must remain compact
* Pages should load quickly
* Touch targets should be appropriate

Mobile is a first-class target.

---

# 79. Event-Day Performance

Live pages should avoid unnecessary heavy content.

For example, the Fixture page should not load:

```text
All historical achievements
All committee records
Every fixture from every event
```

to render one live score.

Data should be fetched according to page requirements.

---

# 80. Images

Images may be useful for:

* Event identity
* Achievements
* Teams
* Committee members
* Historical highlights

However, live operational pages should not depend on large decorative images.

Scores and schedules must remain fast even on poor mobile connections.

---

# 81. Accessibility

Public pages should support:

* Semantic headings
* Keyboard navigation
* Sufficient contrast
* Visible focus states
* Accessible status labels
* Screen-reader-friendly scores
* Meaningful link text

Brackets require particular attention because their visual relationships can be difficult for assistive technologies.

---

# 82. Bracket Accessibility

The visual bracket should have an alternative logical representation.

Example:

```text
Semi Final 1

CMPN defeated IT
2–1

Semi Final 2

MECH defeated AIML
1–0

Final

CMPN vs MECH
Upcoming
```

The bracket cannot rely solely on visual connector lines.

---

# 83. Loading States

Live pages should distinguish:

```text
Loading
No Live Fixtures
Error
Live Fixtures Available
```

Do not display an empty state before the request has completed.

---

# 84. Error States

Example:

```text
Live scores are temporarily unavailable.

Try again shortly.
```

If previously loaded data remains visible, the interface should indicate that it may be stale rather than silently presenting it as current.

---

# 85. Empty States

Example upcoming edition:

```text
Fixtures haven't been published yet.

Check back closer to the event.
```

Example results:

```text
No results yet.

Results will appear as competitions conclude.
```

Empty states should reflect context.

---

# 86. Public Data Source

The public website consumes authoritative platform APIs.

Conceptually:

```text
Public Website
      ↓
Public API
      ↓
Domain Services
      ↓
Database
```

Public clients must not calculate official winners, progression, or standings independently.

---

# 87. Realtime Data Source

Realtime infrastructure distributes changes.

Conceptually:

```text
Database
   ↑
Domain Service
   │
   └──► Realtime Layer
             ↓
       Public Clients
```

The realtime layer is not the source of truth.

---

# 88. Caching

Historical pages may be cached aggressively.

Examples:

```text
TSpark 2025 Results
TSpark 2026 Winners
Historical Achievements
```

Live pages require fresher behaviour.

Caching strategy should reflect how frequently the underlying data changes.

---

# 89. Public API Safety

Public endpoints should expose only required public fields.

The frontend should not receive internal data and merely hide it visually.

For example, a public Fixture response should not contain:

```text
Internal notes
Private contact information
Audit metadata
Permission assignments
```

unless explicitly required.

---

# 90. Home Page Components

Potential reusable components:

```text
ActiveEventHero
LiveFixtureCard
FixtureCard
ResultCard
EventCard
CompetitionCard
AchievementCard
StandingsTable
BracketView
SectionHeader
EmptyState
StatusBadge
```

Components should follow common domain semantics across pages.

---

# 91. Event Components

Potential reusable components:

```text
EventHeader
EditionSwitcher
CompetitionGroup
ScheduleList
WinnerGrid
EventStandings
```

Historical and current editions should use the same core system rather than entirely separate page implementations.

---

# 92. Fixture Components

Potential:

```text
FixtureHeader
Scoreboard
FixtureMeta
LiveStatus
ResultSummary
VenueInfo
```

Sport-specific components may extend the generic Fixture presentation later.

---

# 93. Recent-First Historical Pattern

The project requirement is:

```text
Current / Latest
→ Highlighted

Previous
→ Collapsed / Archived
```

This pattern applies to:

```text
Event Editions
Achievements
Committee
```

Older data remains accessible rather than removed.

---

# 94. Homepage Content Priority

During active event:

```text
1. Active Event
2. Live Fixtures
3. Upcoming Fixtures
4. Recent Results
5. Competition/Event navigation
6. Achievements
7. General TSDW Sports content
```

Outside active event:

```text
1. Upcoming / Recent Event
2. Events
3. Achievements
4. Sports
5. Historical Results
6. About
```

---

# 95. v0 Prototype Scope

The first v0 prototype should demonstrate the core public experience using representative data.

It should focus on:

* Homepage
* Active event state
* Event page
* Competition page
* Live fixtures
* Schedule
* Bracket
* Results
* Winners
* Achievements
* Committee/history presentation

It does not require production backend infrastructure.

---

# 96. v0 Homepage

Prototype homepage should demonstrate an active TSpark state.

Example:

```text
TSDW SPORTS

TSPARK 2027
LIVE

2–4 January

[ Follow Event ]

LIVE NOW

Men's Football
CMPN 2–1 IT

Women's Volleyball
AIML 1–1 MECH

TODAY

11:30
Chess
CMPN vs MECH

12:00
Cricket
AIML vs IT

RECENT RESULTS

...
```

This immediately communicates the product's purpose.

---

# 97. v0 Event Page

Prototype:

```text
TSpark 2027

LIVE

Overview
Schedule
Competitions
Results
Standings
```

Competition groups:

```text
Outdoor
Indoor
```

with representative competitions.

---

# 98. v0 Competition Page

Prototype:

```text
Men's Football

TSpark 2027
Outdoor
Knockout

Bracket

Fixtures

Recent Results
```

The bracket should demonstrate:

* Completed Fixture
* Upcoming Fixture
* Resolved progression
* Unresolved progression
* BYE if useful

---

# 99. v0 Results

Prototype should demonstrate:

```text
Completed Match
Walkover
Competition Winner
Placement
```

so the interface is not designed around one outcome type only.

---

# 100. v0 Historical Presentation

Prototype should demonstrate the recent-first pattern.

Example:

```text
TSpark

2027
LIVE

Previous Editions

2026
COMPLETED

2025
COMPLETED
```

Similarly:

```text
Committee

2026–27
Expanded

2025–26
Collapsed
```

---

# 101. v0 Achievements

Use representative achievement cards to establish layout and hierarchy.

Example:

```text
2026–27

FOOTBALL

Intercollegiate Championship

WINNER
```

The prototype should avoid inventing claims that could be mistaken for actual TCET achievements.

Clearly use placeholder/sample data where real data is unavailable.

---

# 102. v0 Responsive Targets

The generated prototype should be intentionally designed for:

```text
Desktop
Tablet
Mobile
```

Particular attention should be given to:

```text
Live Fixture Cards
Schedule
Bracket
Navigation
Results
```

---

# 103. v0 Interaction Expectations

Prototype interactions may use mock state for:

* Navigation
* Filters
* Edition switching
* Competition tabs
* Expanding history
* Bracket navigation

Production data operations are not required yet.

---

# 104. Not Required for v0

The first generated public prototype does not need:

* Production authentication
* Participant accounts
* Certificate generation
* Real realtime transport
* Real API integration
* Complete historical data
* Complete sport-specific scoring
* Advanced search
* Notifications
* Check-in

These should not delay the initial interface prototype.

---

# 105. Public Website Invariants

### PUB-001

Public sports information must not require authentication.

### PUB-002

The homepage must prioritise active-event information when an Event Edition is ACTIVE.

### PUB-003

Multiple LIVE Fixtures must be supported.

### PUB-004

Scheduled Fixtures must not display fake `0–0` scores.

### PUB-005

Walkovers must not display fabricated scores.

### PUB-006

Official Results must come from authoritative backend data.

### PUB-007

Public clients must not independently determine tournament progression.

### PUB-008

Historical Event Editions must remain directly accessible.

### PUB-009

Current data should receive stronger visual priority than historical data.

### PUB-010

Official TCET Teams must remain conceptually distinct from Event Competition Entries.

### PUB-011

Committee positions must not expose internal platform permissions.

### PUB-012

Private participant information must not be included in public responses.

### PUB-013

Live pages must recover authoritative state after connection loss.

### PUB-014

Bracket presentation must remain usable on mobile.

### PUB-015

Bracket information must have an accessible non-visual representation.

### PUB-016

The public site must support stable shareable URLs for important content.

### PUB-017

Event-specific visual identity must remain within the broader TSDW Sports platform identity.

### PUB-018

The public website must not depend on complete historical fixture data to represent historical winners.

---

# 106. Example — Student Checking Today's Matches

```text
Student opens website
        ↓
Homepage
        ↓
TSpark 2027 LIVE
        ↓
TODAY
        ↓
11:30
Men's Football
CMPN vs IT
Football Ground
        ↓
Open Fixture
```

No login required.

---

# 107. Example — Student Following Live Match

```text
Homepage
   ↓
LIVE NOW
   ↓
CMPN 1–1 IT
   ↓
Open Match
   ↓
Score updates
   ↓
CMPN 2–1 IT
   ↓
FINAL
```

The transition occurs without requiring a page refresh where realtime infrastructure is available.

---

# 108. Example — Exploring TSpark History

```text
Events
   ↓
TSpark
   ↓
Latest
TSpark 2027

Previous
2026
2025
2024
   ↓
TSpark 2026
   ↓
Winners
Results
Competitions
```

Historical information remains part of the same Event identity.

---

# 109. Example — Exploring a Competition

```text
TSpark 2027
      ↓
Outdoor
      ↓
Men's Football
      ↓
Bracket
      ↓
Semi Final

CMPN
vs
IT
      ↓
Fixture Page
```

The navigation follows the sports hierarchy naturally.

---

# 110. Example — Achievement History

```text
Achievements

2026–27
[ Expanded ]

2025–26
[ Collapsed ]

2024–25
[ Collapsed ]
```

Users can explore older records without overwhelming the default page.

---

# 111. Example — Committee History

```text
TSDW Sports Committee

2026–27

Secretary
Person A

Joint Secretary
Person B

Members
...

Previous Committees

2025–26
2024–25
```

The current team receives priority while historical organisational records remain preserved.

---

# 112. Open Questions

## OQ-PUB-001 — Branding

What official branding assets may the platform use?

Potentially:

* TCET logo
* TSDW logo
* TSDW Sports identity
* Event-specific logos

Approval should be confirmed before production deployment.

---

## OQ-PUB-002 — Domain

What production domain/subdomain would the college prefer if the platform is adopted?

Potential conceptual examples:

```text
sports.<college-domain>
tsdw-sports.<college-domain>
```

No domain should be assumed until institutional approval.

---

## OQ-PUB-003 — Public Participant Names

Should individual participant names be publicly visible in:

* Teams
* Fixtures
* Results
* Achievements

or should public pages primarily identify departments/teams?

---

## OQ-PUB-004 — Live Scoring Detail

Which sports need detailed public live scoring in V1 beyond a basic score summary?

---

## OQ-PUB-005 — Overall TSpark Standings

How is the overall department champion calculated?

The website should not implement a points system until official rules are confirmed.

---

## OQ-PUB-006 — Achievement Media

Will official photographs be available for achievements and teams?

---

## OQ-PUB-007 — Committee Photos

Should committee profiles display photographs or only names and roles?

---

## OQ-PUB-008 — Event Media

Should Event Editions contain galleries/highlights, or should media remain outside the initial platform?

---

## OQ-PUB-009 — Public Historical Data

How many previous years of TSpark, National Sports Day, and Reflex data are available?

---

## OQ-PUB-010 — Participant Authentication

What identity system should eventually be used for participant certificate access?

This should be decided before implementing certificate authentication.

---

# 113. Decisions Established by This Document

This document establishes that:

* The public product is a live sports platform rather than a static informational site.
* Active-event information dominates the homepage during live events.
* Public sports information does not require login.
* Event and Event Edition pages form the main historical hierarchy.
* Fixtures, schedules, results, brackets, and winners are first-class public content.
* Multiple simultaneous live Fixtures are supported.
* Historical editions remain accessible.
* Recent data receives stronger visual priority than older records.
* Achievements and committee history use academic-period grouping.
* Official TCET Teams remain distinct from event entrants.
* Participant-specific functionality remains behind authentication.
* Mobile is a first-class target.
* Brackets require mobile and accessibility-specific presentation.
* Public clients consume authoritative results and progression.
* v0 will prototype representative states without production infrastructure.

Significant decisions should be reflected in [`27-decisions.md`](./27-decisions.md).

---

# 114. Related Documentation

* [`02-system-architecture.md`](./02-system-architecture.md) — Platform architecture
* [`03-data-model.md`](./03-data-model.md) — Domain model
* [`04-auth-and-rbac.md`](./04-auth-and-rbac.md) — Authentication and access
* [`05-events-and-seasons.md`](./05-events-and-seasons.md) — Event hierarchy
* [`06-sports-and-competitions.md`](./06-sports-and-competitions.md) — Competition model
* [`07-fixtures-and-tournaments.md`](./07-fixtures-and-tournaments.md) — Fixtures and brackets
* [`18-admin-dashboard.md`](./18-admin-dashboard.md) — Administrative interface
* [`26-roadmap.md`](./26-roadmap.md) — Release roadmap
* [`27-decisions.md`](./27-decisions.md) — Decision log

Future documents expand:

* `08-live-scoring.md`
* `09-teams-and-participants.md`
* `10-departments-and-standings.md`
* `11-achievements.md`
* `12-committee.md`
* `14-certificates.md`

---

# 115. Current Status

**Status: Initial Baseline**

The public homepage, Event pages, Competition pages, live Fixture experience, schedule, results, bracket, winners, historical presentation, achievements, committee, participant boundary, responsive behaviour, and public information architecture are sufficiently defined for the first v0 prototype.

The platform now has enough product, domain, administrative, and public-interface documentation to begin interface prototyping.
