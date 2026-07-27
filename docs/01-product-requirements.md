# TSDW Sports Platform — Product Requirements

## 1. Purpose

This document defines the product requirements for the **TSDW Sports Platform**.

It translates the goals established in [`00-overview.md`](./00-overview.md) into explicit functional and non-functional requirements that can guide system design, implementation, testing, and future development.

This document defines **what the platform must support**.

It does not define the specific technical implementation, database schema, API architecture, framework choices, or deployment infrastructure.

---

## 2. Requirement Conventions

Requirements are assigned stable identifiers so they can be referenced from architecture documents, implementation tasks, tests, issues, and future decisions.

### Requirement Types

| Prefix    | Category                    |
| --------- | --------------------------- |
| `FR-EVT`  | Events and Event Editions   |
| `FR-SPT`  | Sports and Competitions     |
| `FR-DEP`  | Departments                 |
| `FR-REG`  | Registrations               |
| `FR-TEAM` | Teams                       |
| `FR-PAR`  | Participants                |
| `FR-FIX`  | Fixtures                    |
| `FR-SCR`  | Live Scoring                |
| `FR-RES`  | Results and Winners         |
| `FR-STD`  | Standings                   |
| `FR-VEN`  | Venues                      |
| `FR-TCT`  | TCET Official Teams         |
| `FR-ACH`  | Achievements                |
| `FR-COM`  | Committee                   |
| `FR-ANN`  | Announcements               |
| `FR-CER`  | Certificates                |
| `FR-ARC`  | Archive                     |
| `FR-AUTH` | Authentication              |
| `FR-RBAC` | Roles and Permissions       |
| `FR-ADM`  | Administration              |
| `FR-AUD`  | Audit History               |
| `FR-PUB`  | Public Website              |
| `NFR-*`   | Non-Functional Requirements |

### Requirement Language

The following terminology is used:

* **MUST** — required for the relevant release or capability.
* **SHOULD** — strongly preferred but may be deferred when justified.
* **MAY** — optional or future capability.

Release prioritisation is defined separately in [`26-roadmap.md`](./26-roadmap.md).

---

# 3. Functional Requirements

## 3.1 Events and Event Editions

### FR-EVT-001 — Event Management

The system MUST support recurring sports events.

Examples include:

* TSpark
* Reflex
* National Sports Day

An event represents the persistent identity of the event rather than a single occurrence.

---

### FR-EVT-002 — Event Editions

The system MUST support multiple editions of an event.

Each edition MUST be independently manageable and MAY contain:

* Academic year
* Title
* Description
* Start date
* End date
* Status
* Sports
* Competitions
* Fixtures
* Venues
* Participants
* Teams
* Results
* Winners
* Announcements

Historical editions MUST remain available after newer editions are created.

---

### FR-EVT-003 — Event Status

An event edition MUST support lifecycle states appropriate for distinguishing upcoming, active, completed, and archived editions.

The exact state model will be defined during domain design.

---

### FR-EVT-004 — Current Edition

The system MUST be able to identify the current or most relevant edition of an event for primary display.

Older editions MUST remain accessible.

---

### FR-EVT-005 — Flexible Event Structure

The system MUST NOT assume that all events contain the same sports, competition formats, categories, or operational workflows.

---

### FR-EVT-006 — Event Information

Authorised users MUST be able to manage public information associated with an event edition.

This MAY include:

* Description
* Dates
* Rules
* Registration information
* Important notices
* Relevant documents

---

## 3.2 Sports and Competitions

### FR-SPT-001 — Sport Management

The system MUST support multiple sports and activities.

Examples may include:

* Football
* Cricket
* Basketball
* Volleyball
* Chess
* Carrom
* Table Tennis
* Esports
* Recreational games

The supported list MUST be configurable.

---

### FR-SPT-002 — Sport Categories

Sports SHOULD support broad classifications such as:

* Indoor
* Outdoor
* Esports
* Recreational

The classification system MUST remain extensible.

---

### FR-SPT-003 — Competition Management

An event edition MUST be able to contain multiple competitions.

A competition represents a specific competitive activity within an event edition.

For example:

```text
TSpark 2027
└── Football
    ├── Men's Football
    └── Women's Football
```

---

### FR-SPT-004 — Flexible Competition Categories

The system MUST NOT assume that every sport contains men's and women's categories.

Competition categories MUST be configurable according to the event.

---

### FR-SPT-005 — Competition Format

A competition MUST be capable of defining its competition format.

Potential formats include:

* Knockout
* Round robin
* Group stage
* Group stage followed by knockout
* Series
* Custom/manual structure

Not every format is required in the initial release.

---

### FR-SPT-006 — Competition Status

Competitions MUST support lifecycle states sufficient to distinguish preparation, active competition, completion, and cancellation where required.

---

## 3.3 Departments

### FR-DEP-001 — Department Records

The system MUST maintain records of TCET departments that may participate in internal sports events.

---

### FR-DEP-002 — Department Participation

Departments MUST be able to participate in multiple competitions within an event edition.

---

### FR-DEP-003 — Historical Department Data

Historical results MUST remain associated with the department that participated at the time of the event.

Changes to current department information MUST NOT destroy historical competition records.

---

### FR-DEP-004 — Department Performance

The platform SHOULD provide department-specific views containing relevant participation, results, standings, and achievements.

---

## 3.4 Registrations

### FR-REG-001 — Registration Windows

The system MAY support configurable registration periods for event editions or individual competitions.

---

### FR-REG-002 — Team Registration

Where enabled, authorised users or eligible participants SHOULD be able to submit teams for competitions.

---

### FR-REG-003 — Individual Registration

Where applicable, the platform SHOULD support individual participant registration.

---

### FR-REG-004 — Registration Review

Registrations SHOULD support review states such as:

* Pending
* Approved
* Rejected

Final workflow states will be defined during domain design.

---

### FR-REG-005 — Registration Validation

The system SHOULD validate registrations according to competition rules where those rules can be represented by the platform.

Examples may include:

* Team size
* Participant eligibility
* Duplicate registration restrictions
* Required team captain
* Competition-specific limits

---

## 3.5 Teams

### FR-TEAM-001 — Competition Teams

The system MUST support teams participating in competitions.

---

### FR-TEAM-002 — Department Representation

For department-based competitions, a team MUST be capable of representing a department.

---

### FR-TEAM-003 — Team Members

Teams SHOULD support an associated roster of participants.

---

### FR-TEAM-004 — Team Roles

A roster SHOULD support relevant team roles where required, such as:

* Captain
* Player
* Substitute

The system MUST NOT assume every sport uses the same team roles.

---

### FR-TEAM-005 — Historical Rosters

Team rosters associated with completed historical competitions MUST remain recoverable even when students participate in different teams in future years.

---

## 3.6 Participants

### FR-PAR-001 — Participant Records

The system SHOULD maintain participant records where required for competition operations, registration, team membership, or certificate issuance.

---

### FR-PAR-002 — Participant Identity

Participant records SHOULD support sufficient information to distinguish students reliably.

The exact identifiers and personal information collected will be determined separately.

---

### FR-PAR-003 — Participation History

The system SHOULD be capable of associating participants with their historical event, competition, and team participation.

---

### FR-PAR-004 — Data Exposure

Participant information MUST NOT automatically become publicly visible merely because it exists in the administrative system.

Public participant information must be explicitly defined and limited.

---

## 3.7 Fixtures

### FR-FIX-001 — Fixture Creation

Authorised users MUST be able to create fixtures between eligible competition entries.

---

### FR-FIX-002 — Fixture Information

A fixture SHOULD support:

* Competition
* Participants or teams
* Stage or round
* Scheduled date
* Scheduled time
* Venue
* Match status
* Score/result information

---

### FR-FIX-003 — Fixture Publication

Fixtures MUST be capable of being published for public viewing.

Draft fixtures SHOULD remain private until published.

---

### FR-FIX-004 — Fixture Modification

Authorised users MUST be able to modify scheduled fixtures when operational changes occur.

---

### FR-FIX-005 — Match Status

Fixtures MUST support match lifecycle states.

The state model SHOULD account for cases such as:

* Draft
* Scheduled
* Live
* Completed
* Postponed
* Cancelled
* Walkover

The final state machine will be documented separately.

---

### FR-FIX-006 — Tournament Progression

For supported competition formats, the system SHOULD be capable of advancing winners to subsequent tournament stages.

---

### FR-FIX-007 — Manual Override

Authorised users MUST have a controlled method for correcting or overriding tournament progression when exceptional circumstances occur.

Such changes SHOULD be auditable.

---

### FR-FIX-008 — Fixture Filtering

Public users SHOULD be able to filter fixtures by relevant criteria such as:

* Event edition
* Sport
* Competition
* Date
* Department
* Match status

---

## 3.8 Live Scoring

### FR-SCR-001 — Live Match Status

Authorised users MUST be able to mark eligible fixtures as live.

---

### FR-SCR-002 — Score Updates

Authorised users MUST be able to update scores while a match is in progress.

---

### FR-SCR-003 — Public Score Updates

Public users SHOULD receive current score information without requiring manual page reloads where practical.

---

### FR-SCR-004 — Generic Scoring

The initial scoring system SHOULD support a generic score model capable of representing common competition results.

---

### FR-SCR-005 — Sport-Specific Scoring

The platform MAY support specialised scoring models for individual sports in future releases.

Examples include:

* Cricket innings, runs, wickets, and overs
* Volleyball sets
* Football match events
* Esports maps or rounds

---

### FR-SCR-006 — Score Correction

Authorised users MUST be able to correct incorrect scores.

Important corrections SHOULD be recorded in the audit history.

---

### FR-SCR-007 — Concurrent Updates

The platform SHOULD reduce the risk of conflicting score updates when multiple authorised users interact with the same fixture.

---

## 3.9 Results and Winners

### FR-RES-001 — Match Results

Completed fixtures MUST support a final result.

---

### FR-RES-002 — Winner Determination

Where applicable, a completed fixture MUST be capable of identifying a winner.

The platform MUST also accommodate competitions where a draw or other result is valid.

---

### FR-RES-003 — Competition Placements

Competitions SHOULD support final placements such as:

* Winner
* Runner-up
* Third place

Placement structures MUST remain configurable.

---

### FR-RES-004 — Result Publication

Results MUST be capable of being published publicly.

---

### FR-RES-005 — Historical Results

Published historical results MUST remain accessible after the event edition is completed.

---

## 3.10 Department Standings

### FR-STD-001 — Standings

The system SHOULD support department standings for events where an overall department competition exists.

---

### FR-STD-002 — Configurable Points

Standings rules SHOULD be configurable.

For example, an event may award points based on:

* Winner
* Runner-up
* Semi-final placement
* Participation
* Other event-specific criteria

---

### FR-STD-003 — Automatic Calculation

Where rules are configured, standings SHOULD be calculated from competition outcomes rather than manually duplicated.

---

### FR-STD-004 — Manual Adjustment

Authorised administrators SHOULD be able to apply justified manual adjustments when required.

Adjustments MUST be auditable.

---

### FR-STD-005 — Public Leaderboard

Current standings SHOULD be publicly viewable during relevant events.

---

## 3.11 Venues

### FR-VEN-001 — Venue Management

The system SHOULD maintain venues used for matches and sports activities.

---

### FR-VEN-002 — Fixture Venue

Fixtures SHOULD be assignable to a venue.

---

### FR-VEN-003 — Venue Schedule

The platform SHOULD support viewing scheduled activities grouped by venue.

---

### FR-VEN-004 — Venue Changes

Authorised users MUST be able to change fixture venues when required.

Changes SHOULD be reflected on public schedules promptly.

---

## 3.12 TCET Official Sports Teams

### FR-TCT-001 — Official Team Records

The system MUST support official sports teams representing TCET externally.

---

### FR-TCT-002 — Separation from Department Teams

TCET official teams MUST remain conceptually distinct from department teams participating in internal competitions.

---

### FR-TCT-003 — Team History

The platform SHOULD preserve official team information across academic years.

---

### FR-TCT-004 — Team Members

Official teams SHOULD support player rosters and relevant roles where appropriate.

---

### FR-TCT-005 — Team Achievements

Achievements SHOULD be associable with official TCET teams.

---

## 3.13 Achievements

### FR-ACH-001 — Achievement Records

Authorised users MUST be able to create and manage sports achievement records.

---

### FR-ACH-002 — Achievement Information

An achievement SHOULD support relevant information such as:

* Title
* Competition or tournament
* Sport
* Date
* Placement/result
* Team or athlete
* Description
* Academic year

---

### FR-ACH-003 — Public Achievements

Published achievements MUST be publicly viewable.

---

### FR-ACH-004 — Achievement History

Older achievements MUST remain accessible while recent achievements receive greater prominence.

---

### FR-ACH-005 — Individual Achievements

The platform SHOULD support achievements associated with individual athletes where required.

---

## 3.14 Committee

### FR-COM-001 — Committee Tenures

The system MUST support TSDW Sports committee records across multiple academic years or tenures.

---

### FR-COM-002 — Committee Roles

Committee roles MUST be configurable because organisational structures may change over time.

---

### FR-COM-003 — Committee Members

Each tenure MUST support multiple members and their respective roles.

---

### FR-COM-004 — Current Committee

The current committee MUST receive primary visibility on the public platform.

---

### FR-COM-005 — Committee Archive

Previous committee tenures MUST remain publicly accessible unless specific records are intentionally restricted.

---

## 3.15 Announcements

### FR-ANN-001 — Announcement Management

Authorised users SHOULD be able to publish event-related announcements.

---

### FR-ANN-002 — Announcement Scope

Announcements SHOULD be capable of being associated with relevant contexts such as:

* Platform-wide
* Event edition
* Sport
* Competition
* Fixture

---

### FR-ANN-003 — Important Announcements

The platform SHOULD support highlighting urgent or important announcements.

---

### FR-ANN-004 — Announcement History

Announcements SHOULD retain publication timestamps and relevant historical context.

---

## 3.16 Certificates

### FR-CER-001 — Certificate Records

The platform SHOULD support digital certificate records for eligible participants.

---

### FR-CER-002 — Certificate Types

Certificates MAY represent:

* Participation
* Winner
* Runner-up
* Placement
* Organising contribution
* Other recognised categories

---

### FR-CER-003 — Certificate Generation

Authorised users SHOULD be able to generate certificates using approved templates and participant data.

---

### FR-CER-004 — Unique Certificate Identifier

Each issued certificate MUST have a unique identifier.

---

### FR-CER-005 — Certificate Verification

The platform SHOULD provide a public mechanism for verifying issued certificates.

---

### FR-CER-006 — QR Verification

Certificates SHOULD be capable of containing a QR code that directs users to the verification mechanism.

---

### FR-CER-007 — Certificate Access

Eligible participants SHOULD have a secure mechanism for accessing their certificates.

A full participant account MUST NOT be required solely for certificate access unless later requirements justify it.

---

### FR-CER-008 — Certificate Integrity

Changes affecting already-issued certificates SHOULD be controlled and auditable.

---

## 3.17 Sports Archive

### FR-ARC-001 — Historical Preservation

Completed event data MUST remain preserved unless retention requirements explicitly require removal.

---

### FR-ARC-002 — Edition Archive

Public users MUST be able to access previous editions of recurring events.

---

### FR-ARC-003 — Historical Fixtures and Results

Archived event editions SHOULD retain their fixtures, results, winners, and standings.

---

### FR-ARC-004 — Historical Achievements

Achievements SHOULD be browsable by relevant periods such as academic year.

---

### FR-ARC-005 — Historical Committees

Previous committee tenures MUST remain accessible.

---

### FR-ARC-006 — Historical Navigation

The platform SHOULD provide clear year- or edition-based navigation rather than displaying all historical information simultaneously.

---

## 3.18 Authentication

### FR-AUTH-001 — Public Access

Public information MUST be accessible without authentication.

---

### FR-AUTH-002 — Administrative Authentication

Administrative functionality MUST require authentication.

---

### FR-AUTH-003 — Secure Sessions

Authenticated sessions MUST be managed securely.

Implementation details will be determined during architecture design.

---

### FR-AUTH-004 — Account Lifecycle

The platform SHOULD support administrative account activation, deactivation, and access revocation.

This is particularly important because committee responsibilities change between academic years.

---

### FR-AUTH-005 — Participant Authentication

Participant authentication MAY be introduced for features that genuinely require persistent student accounts.

The system MUST NOT assume that every participant needs an account.

---

## 3.19 Roles and Permissions

### FR-RBAC-001 — Role-Based Access Control

Administrative functionality MUST use a controlled authorisation system.

---

### FR-RBAC-002 — Least Privilege

Users MUST receive only the permissions necessary for their responsibilities.

---

### FR-RBAC-003 — Developer/System Administration

Technical administrators MUST be capable of managing system-level configuration and administrative access.

---

### FR-RBAC-004 — Sports Administration

Sports administrators SHOULD be capable of managing broad event and sports operations without receiving unnecessary technical system privileges.

---

### FR-RBAC-005 — Secretary/Organiser Access

Secretaries and organisers SHOULD receive operational permissions according to their responsibilities.

---

### FR-RBAC-006 — Scorekeeper Access

Scorekeepers SHOULD be restricted to relevant match-management capabilities.

---

### FR-RBAC-007 — Scoped Permissions

The permission system SHOULD eventually support access scoped to resources such as:

* Event edition
* Sport
* Competition
* Fixture

For example, a scorekeeper assigned to Football should not automatically gain permission to modify Chess results.

---

### FR-RBAC-008 — Permission Revocation

Administrative permissions MUST be revocable without deleting historical actions performed by the user.

---

## 3.20 Administration

### FR-ADM-001 — Administrative Interface

The system MUST provide an administrative interface for authorised users.

---

### FR-ADM-002 — Content Management

Routine sports content MUST be manageable without editing application source code.

---

### FR-ADM-003 — Event Operations

Authorised users SHOULD be able to perform relevant event operations from the administrative interface.

---

### FR-ADM-004 — Validation

Administrative interfaces SHOULD prevent invalid operations where reasonable.

Examples include:

* Completing a match without sufficient result information
* Assigning ineligible teams to a fixture
* Creating conflicting tournament progression
* Issuing duplicate certificates unintentionally

---

### FR-ADM-005 — Destructive Actions

Destructive operations MUST require appropriate permissions and SHOULD include safeguards against accidental execution.

---

## 3.21 Audit History

### FR-AUD-001 — Audit Records

The system SHOULD record important administrative actions.

---

### FR-AUD-002 — Audit Information

An audit record SHOULD identify:

* Actor
* Action
* Affected resource
* Timestamp
* Relevant previous state
* Relevant resulting state

where appropriate.

---

### FR-AUD-003 — Score Audit

Important score corrections and result changes SHOULD be auditable.

---

### FR-AUD-004 — Standings Adjustments

Manual standings adjustments MUST be auditable.

---

### FR-AUD-005 — Audit Protection

Normal operational users MUST NOT be able to arbitrarily modify audit history.

---

## 3.22 Public Website

### FR-PUB-001 — Event Discovery

Public users MUST be able to discover current and upcoming sports events.

---

### FR-PUB-002 — Current Event Visibility

Active events SHOULD receive greater prominence than historical events.

---

### FR-PUB-003 — Live Matches

The platform SHOULD prominently display currently active matches during live events.

---

### FR-PUB-004 — Upcoming Fixtures

Public users SHOULD be able to view upcoming fixtures.

---

### FR-PUB-005 — Results

Public users MUST be able to access published results and winners.

---

### FR-PUB-006 — Standings

Where standings exist, public users SHOULD be able to access them.

---

### FR-PUB-007 — TCET Teams

Public users SHOULD be able to browse official TCET sports teams.

---

### FR-PUB-008 — Achievements

Public users MUST be able to browse published sports achievements.

---

### FR-PUB-009 — Committee

Public users SHOULD be able to view the current and historical TSDW Sports committees.

---

### FR-PUB-010 — Archive Navigation

Public users SHOULD be able to navigate between current and historical sports data without unnecessary clutter.

---

### FR-PUB-011 — Shareable Pages

Important public resources SHOULD have stable, shareable URLs.

Examples include:

* Event editions
* Competitions
* Fixtures
* Results
* Teams
* Achievements
* Certificate verification

---

# 4. Non-Functional Requirements

## 4.1 Performance

### NFR-PERF-001

Public pages SHOULD load efficiently on typical student mobile networks.

### NFR-PERF-002

Live-score operations SHOULD propagate updates with sufficiently low latency for practical event use.

### NFR-PERF-003

Historical data growth SHOULD NOT significantly degrade access to current event information.

---

## 4.2 Availability and Reliability

### NFR-REL-001

The platform SHOULD remain available during active sports events where live information depends on it.

### NFR-REL-002

A temporary client connection failure SHOULD NOT corrupt match or event data.

### NFR-REL-003

Critical operations SHOULD fail safely rather than leave competition data in an inconsistent state.

### NFR-REL-004

The system SHOULD support an appropriate backup and recovery strategy before being relied upon for official records.

---

## 4.3 Security

### NFR-SEC-001

Administrative functionality MUST NOT be accessible to unauthorised users.

### NFR-SEC-002

The platform MUST enforce permissions server-side.

Client-side UI restrictions alone MUST NOT be treated as security controls.

### NFR-SEC-003

Sensitive credentials and secrets MUST NOT be stored in source control.

### NFR-SEC-004

User input MUST be validated before being trusted by the system.

### NFR-SEC-005

Administrative operations affecting critical sports records SHOULD be protected against common web security threats.

### NFR-SEC-006

Authentication and authorisation failures MUST NOT expose protected administrative information.

---

## 4.4 Privacy

### NFR-PRIV-001

The platform SHOULD collect only participant information required for legitimate platform operations.

### NFR-PRIV-002

Administrative participant data MUST NOT automatically become public data.

### NFR-PRIV-003

Sensitive participant identifiers MUST NOT be exposed through public URLs or public APIs without a justified requirement.

### NFR-PRIV-004

Public certificate verification SHOULD reveal only information necessary to establish certificate validity.

---

## 4.5 Usability

### NFR-USE-001

The public platform MUST be usable on mobile devices.

### NFR-USE-002

Common information such as live scores, today's fixtures, and results SHOULD require minimal navigation during active events.

### NFR-USE-003

Administrative score updates SHOULD be fast enough for practical use during live matches.

### NFR-USE-004

The interface SHOULD clearly distinguish scheduled, live, completed, postponed, and cancelled matches.

---

## 4.6 Accessibility

### NFR-ACC-001

Core platform functionality SHOULD be usable with keyboard navigation.

### NFR-ACC-002

Important information MUST NOT depend solely on colour to communicate state.

### NFR-ACC-003

The interface SHOULD use appropriate semantic structure and accessible labels.

### NFR-ACC-004

Text and controls SHOULD maintain sufficient readability and contrast.

---

## 4.7 Maintainability

### NFR-MNT-001

The platform SHOULD be structured so future developers can maintain it without relying on undocumented knowledge.

### NFR-MNT-002

Significant architectural and product decisions SHOULD be documented.

### NFR-MNT-003

Routine content changes MUST NOT require application code modifications.

### NFR-MNT-004

Modules SHOULD have clearly defined responsibilities.

### NFR-MNT-005

Important business rules SHOULD be implemented consistently rather than duplicated across interfaces.

---

## 4.8 Extensibility

### NFR-EXT-001

New event editions MUST be creatable without changing application source code.

### NFR-EXT-002

New sports SHOULD be addable without redesigning the entire platform.

### NFR-EXT-003

The system SHOULD accommodate additional competition formats over time.

### NFR-EXT-004

The platform SHOULD allow future specialised scoring systems without requiring replacement of the core event model.

---

## 4.9 Data Integrity

### NFR-DATA-001

Historical sports records MUST NOT be silently overwritten by newer editions.

### NFR-DATA-002

Relationships between fixtures, teams, competitions, results, and winners MUST remain internally consistent.

### NFR-DATA-003

Critical result changes SHOULD retain sufficient history for administrative review.

### NFR-DATA-004

Deleting current reference data SHOULD NOT unintentionally destroy historical records.

---

## 4.10 Scalability

### NFR-SCL-001

The platform SHOULD support multiple years of historical sports data.

### NFR-SCL-002

The platform SHOULD support concurrent public users during major college sports events.

### NFR-SCL-003

The system SHOULD support multiple simultaneous live fixtures.

The platform does not initially need infrastructure designed for professional sports-scale traffic.

---

# 5. Business Rules

## BR-001 — Historical Preservation

Creating a new event edition MUST NOT replace the previous edition.

---

## BR-002 — Current vs Historical Content

Current or active information should receive primary visibility while historical information remains accessible.

---

## BR-003 — Internal vs Official Teams

Department teams competing internally and official TCET teams representing the college externally are distinct concepts.

---

## BR-004 — Event Flexibility

Events are not required to share identical sports, categories, rules, or competition structures.

---

## BR-005 — Sport Flexibility

Sports are not required to share identical scoring systems or match structures.

---

## BR-006 — Operational Ownership

Authorised sports organisers should manage operational sports data.

Developers should not be required for routine content updates.

---

## BR-007 — Controlled Result Changes

Published results and critical competition outcomes must not be modifiable without appropriate authorisation.

---

## BR-008 — Participant Privacy

The existence of a participant record does not imply permission to publish all information associated with that participant.

---

## BR-009 — Certificate Uniqueness

Each issued certificate must be independently identifiable.

---

## BR-010 — Committee Transition

Changes in committee membership must not remove historical committee records or historical actions.

---

# 6. Primary User Journeys

The following journeys represent major workflows the platform should eventually support.

## 6.1 Student Checks Today's Fixtures

```text
Open Platform
    ↓
Current Event
    ↓
Today's Fixtures
    ↓
Filter by Sport / Department
    ↓
View Match Details
```

---

## 6.2 Student Follows a Live Match

```text
Open Platform
    ↓
Live Matches
    ↓
Select Fixture
    ↓
View Current Score and Match Status
    ↓
Receive Updated Information
```

---

## 6.3 Secretary Updates a Match

```text
Authenticate
    ↓
Open Admin Dashboard
    ↓
Select Assigned Event / Competition
    ↓
Select Fixture
    ↓
Start Match
    ↓
Update Score
    ↓
Complete Match
    ↓
Publish Result
```

---

## 6.4 Administrator Creates a New TSpark Edition

```text
Authenticate
    ↓
Create Event Edition
    ↓
Select TSpark
    ↓
Configure Dates
    ↓
Configure Sports and Competitions
    ↓
Configure Teams / Registrations
    ↓
Create or Generate Fixtures
    ↓
Publish Edition
```

The exact workflow may change after domain and administration design.

---

## 6.5 Participant Retrieves Certificate

```text
Open Certificate Portal
    ↓
Provide Required Verification Information
    ↓
Locate Eligible Certificate
    ↓
Access Certificate
```

A permanent participant account is not assumed.

---

## 6.6 Third Party Verifies Certificate

```text
Scan QR / Open Verification Page
    ↓
Certificate Identifier Resolved
    ↓
Display Verification Status
    ↓
Display Limited Certificate Information
```

---

## 6.7 Visitor Browses Historical TSpark Results

```text
Open TSpark
    ↓
Select Previous Edition
    ↓
Select Sport / Competition
    ↓
View Fixtures, Results and Winners
```

---

# 7. Constraints and Assumptions

## 7.1 Organisational Structure

TSDW Sports roles, responsibilities, sports, and event structures may change between academic years.

The platform must therefore avoid unnecessarily hardcoding current organisational structures.

---

## 7.2 Event Rules

Competition rules may vary between sports and event editions.

The system should distinguish between platform-wide rules and event-specific rules.

---

## 7.3 Connectivity

Event venues may experience inconsistent network connectivity.

Operational interfaces should avoid unnecessarily heavy network requirements.

Offline scoring is not currently a committed requirement.

---

## 7.4 Data Availability

Historical sports data may be incomplete or inconsistent when initially entering previous years into the platform.

The system should not assume that every historical edition will contain the same level of detail.

---

## 7.5 Institutional Adoption

The platform is currently being developed for TSDW Sports and may potentially be adopted more formally in the future.

The system should therefore be designed for maintainability and ownership transition without assuming formal institutional adoption has already occurred.

---

# 8. Out of Scope for Initial Development

The following capabilities are not considered initial requirements:

* Native Android or iOS applications
* Professional-grade analytics for every sport
* Video streaming
* Fantasy sports
* Betting or wagering systems
* Social networking
* Public chat systems
* AI-based sports predictions
* Advanced athlete performance tracking
* Full professional cricket scoring
* Full professional football event tracking
* Custom scoring engines for every sport
* Complex external sports federation integrations

These may only be considered if future requirements justify them.

---

# 9. Open Product Questions

The following questions require further clarification before their related features are finalised.

### OQ-001 — TSpark Competition Formats

Which tournament formats are actually used for each TSpark sport?

---

### OQ-002 — TSpark Overall Championship

Does TSpark calculate an overall department champion using points across sports?

If yes:

* What is the points system?
* Are men's and women's results weighted equally?
* Does participation award points?

---

### OQ-003 — National Sports Day

What activities and competition structures are normally used during National Sports Day?

---

### OQ-004 — Reflex

Which esports and recreational games are typically conducted, and what competition formats do they use?

---

### OQ-005 — Registration Ownership

Who submits teams?

Possible workflows include:

* Department representatives
* Team captains
* Participants
* TSDW organisers entering submissions manually

---

### OQ-006 — Participant Identity

Which TCET identifier should be used to reliably identify participants?

---

### OQ-007 — Certificates

Which event participants receive certificates, and which certificate categories are officially recognised?

---

### OQ-008 — Committee Roles

What roles currently exist within TSDW Sports, and which roles should receive platform access?

---

### OQ-009 — Scorekeeping

Who updates scores during live events?

For example:

* Secretary
* Assigned sport coordinator
* Match-specific scorekeeper
* Multiple authorised organisers

---

### OQ-010 — Result Approval

Does a match result require confirmation or approval before becoming final?

---

### OQ-011 — Historical Data

How many previous years of sports information are currently available for initial migration?

---

### OQ-012 — Public Participant Information

Which participant information, if any, should appear publicly on team rosters, winners lists, and achievement pages?

---

# 10. Requirement Status

This document represents the **initial product requirements baseline**.

Requirements may change as:

* TSDW Sports workflows are clarified
* Existing event processes are examined
* Committee members provide operational requirements
* Technical constraints are discovered
* Institutional requirements emerge

Significant requirement changes should be documented rather than silently altering the intended behaviour of the platform.

---

# 11. Related Documentation

* [`00-overview.md`](./00-overview.md) — Product context, vision, terminology, and scope
* [`26-roadmap.md`](./26-roadmap.md) — Release phases and feature prioritisation
* [`27-decisions.md`](./27-decisions.md) — Significant product and technical decisions

Future documentation will define:

* System architecture
* Data model
* Authentication and authorisation
* Events and seasons
* Competition management
* Fixtures and tournaments
* Live scoring
* Administrative workflows
* API design
* Security
* Testing
* Deployment
