# TSDW Sports Platform — Product Roadmap

## 1. Purpose

This document defines the planned development roadmap for the **TSDW Sports Platform**.

The platform has a broad long-term scope, but attempting to implement every planned capability simultaneously would increase complexity, delay usable releases, and make architectural mistakes more expensive.

Development will therefore proceed incrementally.

Each phase should produce a coherent and usable improvement to the platform while establishing the foundation required by later phases.

This roadmap defines **when capabilities are intended to be introduced**.

Detailed product requirements are defined in [`01-product-requirements.md`](./01-product-requirements.md).

---

# 2. Roadmap Principles

## 2.1 Foundation Before Features

Core domain concepts, permissions, data relationships, and architecture should be established before complex operational features depend on them.

---

## 2.2 Build for Real Workflows

Features should solve actual TSDW Sports requirements.

A technically interesting feature should not receive priority simply because it is interesting to build.

---

## 2.3 Deliver Incrementally

Each major phase should leave the platform in a usable state.

Development should avoid long periods where many partially implemented systems depend on each other before anything can be used.

---

## 2.4 Avoid Premature Complexity

The initial platform does not need to replicate professional sports platforms.

Generic systems should be preferred where they adequately solve current requirements.

Specialised systems should be introduced only when real use cases justify them.

---

## 2.5 Preserve Future Extensibility

Avoiding premature complexity does not mean hardcoding the current year, current committee, TSpark, or current sports into the system.

Core models should allow the platform to grow without unnecessary redesign.

---

## 2.6 Historical Data Is a Core Capability

Historical preservation is not an optional feature to be added after the platform is complete.

The system should be designed from the beginning so new academic years and event editions do not overwrite previous records.

---

## 2.7 Administration Before Automation

Before automating tournament generation, certificate issuance, standings, or other workflows, the platform should first provide reliable manual administrative workflows.

Automation should reduce existing work rather than become a prerequisite for operating the platform.

---

# 3. Development Stages

The current roadmap is divided into the following stages:

```text
Planning
    ↓
Foundation
    ↓
V1 — Sports Information Platform
    ↓
V1.5 — Live Event Operations
    ↓
V2 — Participation and Certificates
    ↓
V3 — Sports Archive and Platform Expansion
```

The version numbers describe product milestones rather than strict semantic software versions.

---

# 4. Stage 0 — Product Planning

## Goal

Define what the platform is before implementation begins.

This stage establishes the product requirements, terminology, scope, architecture, and domain model.

---

## Deliverables

### Product Documentation

* Project overview
* Product requirements
* Product roadmap
* Decision log

### Domain Documentation

Define the major concepts used by the platform, including:

* Events
* Event editions
* Sports
* Competitions
* Departments
* Teams
* Participants
* Fixtures
* Results
* Achievements
* Committee tenures

### Architecture

Determine:

* Application architecture
* Repository structure
* Frontend architecture
* Backend architecture
* Database approach
* Authentication strategy
* Authorisation strategy
* Deployment approach

### Data Model

Design relationships between the platform's core entities.

### Initial UI Planning

Define the primary public and administrative information architecture.

---

## Completion Criteria

Stage 0 is complete when:

* Core terminology is defined.
* V1 requirements are identified.
* Major domain relationships are understood.
* Initial architecture decisions are documented.
* The initial data model can support V1 without obvious structural conflicts.
* Development environment requirements are known.

---

# 5. Stage 1 — Engineering Foundation

## Goal

Create the technical foundation required to build the platform safely and consistently.

This stage should avoid implementing large product features.

---

## Planned Capabilities

### Repository Foundation

Establish:

* Application structure
* Shared packages where justified
* Environment configuration
* Code quality tooling
* Development scripts

### Database Foundation

Implement the initial database structure for core platform entities.

### Authentication Foundation

Implement administrative authentication.

### Authorisation Foundation

Establish role and permission enforcement.

### Application Shells

Create the basic:

* Public application
* Administrative interface
* Backend/API layer

depending on the final architecture.

### Error Handling

Establish consistent application and API error handling.

### Validation

Establish input validation patterns.

### Logging

Introduce basic operational logging.

### Development Data

Create controlled seed data for local development and testing.

---

## Not Included

Stage 1 should not attempt to implement:

* Full live scoring
* Tournament automation
* Registration workflows
* Certificate generation
* Notifications
* Advanced statistics

---

## Completion Criteria

Stage 1 is complete when:

* The project can be set up locally from documented instructions.
* The application can connect to its development database.
* Database migrations can be performed consistently.
* Administrative authentication works.
* Server-side permissions can be enforced.
* Public and administrative application foundations are accessible.
* Development seed data can be created reliably.

---

# 6. V1 — Sports Information Platform

## Goal

Create the first usable version of the TSDW Sports Platform.

V1 should establish the platform as the central public source for TSDW Sports information and allow authorised organisers to manage that information without modifying source code.

The primary objective is **structured sports information**, not advanced event automation.

---

## 6.1 Event Management

V1 should support:

* Recurring events
* Event editions
* Event dates
* Event descriptions
* Event statuses
* Current event identification
* Historical editions

Initial events may include:

* TSpark
* Reflex
* National Sports Day

The system must not depend on these being the only events.

---

## 6.2 Sports and Competitions

V1 should support:

* Sports
* Sport categories
* Competitions within event editions
* Competition categories
* Basic competition information
* Competition status

Competition structures may initially be managed manually.

---

## 6.3 Departments

V1 should support:

* TCET department records
* Department participation in competitions
* Historical department associations

---

## 6.4 Fixtures

V1 should support:

* Fixture creation
* Fixture editing
* Scheduling
* Team assignment
* Date and time
* Venue assignment
* Fixture status
* Public fixture publication

Fixtures may initially be created manually.

Automatic bracket generation is not required for V1.

---

## 6.5 Results and Winners

V1 should support:

* Final match results
* Winner identification
* Draws where applicable
* Competition winners
* Runners-up or other configured placements
* Public result pages

---

## 6.6 TCET Official Teams

V1 should support:

* Official TCET sports teams
* Academic-year-based team information
* Basic roster information where available
* Historical team records

---

## 6.7 Achievements

V1 should support:

* Achievement creation
* Sport association
* Team or athlete association where applicable
* Competition/tournament information
* Date
* Placement
* Description
* Academic year
* Public achievement pages

---

## 6.8 Committee

V1 should support:

* Committee tenures
* Configurable committee roles
* Committee members
* Current committee
* Previous committees

---

## 6.9 Public Website

V1 should provide public access to:

* Current events
* Upcoming events
* Event editions
* Sports
* Fixtures
* Schedules
* Results
* Winners
* TCET teams
* Achievements
* Current committee
* Historical editions

Current information should receive greater visibility than historical information.

---

## 6.10 Administrative Dashboard

V1 should provide authorised users with interfaces to manage:

* Events
* Event editions
* Sports
* Competitions
* Departments
* Fixtures
* Results
* Winners
* TCET teams
* Achievements
* Committee records

Routine content management should not require a developer or code deployment.

---

## V1 Completion Criteria

V1 is complete when an authorised organiser can:

1. Create or manage an event edition.
2. Configure its sports and competitions.
3. Add participating teams or departments where required.
4. Create and publish fixtures.
5. Enter completed results.
6. Publish winners.
7. Manage TCET team information.
8. Publish achievements.
9. Manage committee records.

And a public visitor can:

1. Discover current events.
2. View schedules and fixtures.
3. View results and winners.
4. Browse TCET teams and achievements.
5. View the current committee.
6. Navigate to historical editions.

No source-code modification should be required for these routine operations.

---

# 7. V1.5 — Live Event Operations

## Goal

Transform the information platform into a tool that can actively support TSDW Sports during live events.

V1.5 should focus on **event-day operations**.

---

## 7.1 Live Scoring

Introduce:

* Live match status
* Score updates
* Public live-score display
* Near-real-time score propagation
* Score correction
* Generic scoring model

The first implementation should prioritise reliability and speed over detailed sport-specific statistics.

---

## 7.2 Match State Management

Implement a defined match lifecycle.

Potential states include:

```text
DRAFT
SCHEDULED
LIVE
COMPLETED
POSTPONED
CANCELLED
WALKOVER
```

Allowed transitions should be formally defined before implementation.

---

## 7.3 Scorekeeper Access

Introduce operational access for scorekeepers.

Permissions should be capable of restricting users to relevant:

* Events
* Sports
* Competitions
* Fixtures

A scorekeeper should not automatically receive broad administrative access.

---

## 7.4 Audit History

Record important administrative actions, particularly:

* Score changes
* Result changes
* Match state changes
* Manual competition adjustments
* Standings adjustments

---

## 7.5 Announcements

Introduce event announcements for:

* Delays
* Venue changes
* Fixture changes
* Important notices
* Result announcements

Important announcements may receive prominent public placement.

---

## 7.6 Venue Operations

Improve venue support with:

* Venue schedules
* Fixtures grouped by venue
* Venue changes
* Public venue information

---

## 7.7 Department Standings

Where required by event rules, introduce:

* Configurable points systems
* Calculated department standings
* Public leaderboards
* Manual adjustments with audit history

This capability should only be implemented after actual TSpark scoring rules are confirmed.

---

## 7.8 Tournament Progression

For supported formats, introduce automated or assisted tournament progression.

Initial support may focus on:

* Knockout tournaments

Later expansion may include:

* Round robin
* Group stages
* Groups followed by knockout

Manual correction must remain available to authorised administrators.

---

## V1.5 Completion Criteria

V1.5 is complete when the platform can reliably support an active sports event where:

1. Organisers publish fixtures.
2. Assigned users update match statuses.
3. Scores are updated during matches.
4. Students can follow current scores.
5. Completed results are recorded.
6. Tournament progression works for supported formats.
7. Important changes are auditable.
8. Event announcements can be published quickly.

---

# 8. V2 — Participation and Certificates

## Goal

Extend the platform from event management into participant operations.

V2 should reduce manual work associated with registrations, rosters, event participation, and certificate distribution.

---

## 8.1 Participant Records

Introduce structured participant records sufficient for:

* Registration
* Team membership
* Participation history
* Certificate issuance

Only information necessary for legitimate platform operations should be collected.

---

## 8.2 Team Rosters

Support:

* Players
* Captains
* Substitutes
* Other sport-specific roles where required

Historical rosters should remain associated with their event editions.

---

## 8.3 Registrations

Support registration workflows where useful.

Potential capabilities include:

* Registration windows
* Department team submissions
* Individual registrations
* Team registrations
* Approval/rejection workflows
* Eligibility validation
* Team-size validation

The final workflow depends on how TSDW actually collects registrations.

---

## 8.4 Check-In

Where operationally useful, support event or match check-in.

Potential implementation:

```text
Registration
    ↓
Approved Team
    ↓
Team Identifier / QR
    ↓
Organizer Verification
    ↓
Checked In
```

Check-in should only be implemented if it solves an actual event-day requirement.

---

## 8.5 Certificate Generation

Introduce certificate generation based on approved templates.

Certificates may include:

* Participant name
* Event
* Sport/competition
* Achievement
* Date
* Certificate identifier
* Verification QR code

---

## 8.6 Certificate Verification

Provide a public verification mechanism.

A verification result should expose only information necessary to confirm the certificate.

---

## 8.7 Certificate Distribution

Participants should be able to securely access eligible certificates.

A permanent participant account should not be introduced solely to enable downloads unless later requirements justify it.

---

## V2 Completion Criteria

V2 is complete when the platform can support a workflow such as:

```text
Registration
    ↓
Review
    ↓
Participation
    ↓
Results
    ↓
Certificate Eligibility
    ↓
Certificate Generation
    ↓
Distribution
    ↓
Public Verification
```

without requiring organisers to manually duplicate the same participant information across multiple systems.

---

# 9. V3 — Sports Archive and Platform Expansion

## Goal

Use accumulated structured data to create a comprehensive historical sports platform.

V3 focuses on long-term institutional value rather than immediate event operations.

---

## 9.1 Enhanced Sports Archive

Provide richer historical navigation across:

* Event editions
* Fixtures
* Results
* Winners
* Standings
* TCET teams
* Achievements
* Committees
* Participants where appropriate

---

## 9.2 Department Profiles

Potential department pages may contain:

* Event participation
* Results
* Placements
* Historical standings
* Sports achievements

Only data supported by reliable historical records should be presented.

---

## 9.3 Athlete Profiles

Where privacy and institutional requirements allow, public athlete profiles may include approved information such as:

* Sports
* TCET team membership
* Event participation
* Public achievements

Administrative participant records should not automatically become public athlete profiles.

---

## 9.4 Historical Statistics

The platform may derive statistics from accumulated records, such as:

* Event champions by year
* Department performance over time
* Most successful teams
* Competition history
* Achievement counts

Statistics should be derived from structured source records rather than manually duplicated.

---

## 9.5 Search

Introduce platform-wide discovery across relevant public records.

Potential searchable resources include:

* Events
* Sports
* Teams
* Departments
* Achievements
* Historical editions

---

## 9.6 Notifications

Where justified, introduce notifications for relevant events such as:

* Upcoming fixtures
* Fixture changes
* Match delays
* Results
* Certificate availability

Notification channels should be selected according to actual operational requirements.

---

## 9.7 Sport-Specific Scoring

Introduce specialised scoring only for sports where generic scoring is insufficient.

Potential examples include:

### Cricket

* Innings
* Runs
* Wickets
* Overs

### Volleyball

* Sets
* Set scores

### Football

* Match events
* Goals
* Cards

### Esports

* Maps
* Rounds
* Series score

Each scoring extension should integrate with the common match/result model.

---

# 10. Future Possibilities

The following capabilities are intentionally not committed to a roadmap version.

They may be evaluated if future requirements justify them.

* Native mobile application
* Advanced sports analytics
* External college tournament integrations
* Automated messaging integrations
* Public athlete statistics
* Media galleries
* Event photo management
* Public APIs
* Data exports
* Advanced reporting
* Dedicated display/scoreboard mode
* Multi-college tournament support
* Multi-organisation support

Their presence in this section does not mean they will be implemented.

---

# 11. Explicit Non-Priorities

The following should not distract from the core platform without a major change in product direction:

* Fantasy sports
* Betting or wagering
* Public chat
* Social networking
* Sports streaming
* AI match predictions
* Professional athlete analytics
* Building a scoring engine equivalent to professional sports platforms

The platform exists to support TSDW Sports operations and records.

---

# 12. Requirement Mapping

At a high level, requirement groups map to roadmap phases as follows.

| Requirement Group        | Foundation |  V1 | V1.5 |  V2 |  V3 |
| ------------------------ | :--------: | :-: | :--: | :-: | :-: |
| Events & Editions        |      ●     |  ●  |      |     |     |
| Sports & Competitions    |      ●     |  ●  |   ●  |     |  ●  |
| Departments              |      ●     |  ●  |      |     |  ●  |
| Fixtures                 |            |  ●  |   ●  |     |     |
| Results & Winners        |            |  ●  |   ●  |     |     |
| TCET Teams               |            |  ●  |      |     |  ●  |
| Achievements             |            |  ●  |      |     |  ●  |
| Committee                |            |  ●  |      |     |  ●  |
| Authentication           |      ●     |  ●  |   ●  |  ●  |     |
| RBAC                     |      ●     |  ●  |   ●  |  ●  |     |
| Admin Dashboard          |      ●     |  ●  |   ●  |  ●  |     |
| Live Scoring             |            |     |   ●  |     |  ●  |
| Audit History            |      ●     |  ●  |   ●  |  ●  |     |
| Announcements            |            |     |   ●  |     |     |
| Venues                   |            |  ●  |   ●  |     |     |
| Standings                |            |     |   ●  |     |  ●  |
| Tournament Progression   |            |     |   ●  |     |  ●  |
| Participants             |            |     |      |  ●  |  ●  |
| Registrations            |            |     |      |  ●  |     |
| Team Rosters             |            |     |      |  ●  |  ●  |
| Certificates             |            |     |      |  ●  |     |
| Certificate Verification |            |     |      |  ●  |     |
| Archive                  |      ●     |  ●  |   ●  |  ●  |  ●  |
| Search                   |            |     |      |     |  ●  |
| Notifications            |            |     |      |     |  ●  |
| Historical Statistics    |            |     |      |     |  ●  |

`●` indicates that the requirement group is materially involved in that phase.

---

# 13. Development Priority Within a Phase

Features inside a roadmap phase are not automatically equal in priority.

When deciding implementation order, use the following priority:

### 1. Data Integrity

Can the system store the information correctly?

### 2. Administrative Workflow

Can authorised organisers manage the information reliably?

### 3. Public Experience

Can students access the information effectively?

### 4. Automation

Can repetitive organiser work be safely automated?

### 5. Enhancement

Can the experience be made richer without compromising the above?

This prevents visual polish or advanced automation from being prioritised over reliable operations.

---

# 14. Release Readiness

A phase should not be considered complete merely because its UI exists.

Before a release is considered ready, relevant capabilities should satisfy:

* Functional requirements
* Server-side authorisation
* Input validation
* Error handling
* Data integrity expectations
* Responsive public interfaces
* Administrative usability
* Required testing
* Deployment readiness
* Documentation updates

Critical workflows should be tested using realistic sports-event scenarios.

---

# 15. Roadmap Changes

This roadmap is expected to evolve as the project progresses.

A roadmap change may be justified by:

* Clarified TSDW workflows
* Committee feedback
* Event requirements
* Technical discoveries
* Institutional adoption
* Security requirements
* Operational constraints
* Changes in available development resources

Changes should be deliberate.

Significant changes to product direction or release scope should be recorded in [`27-decisions.md`](./27-decisions.md).

---

# 16. Immediate Next Milestone

The project is currently in **Stage 0 — Product Planning**.

The immediate priorities are:

1. Complete the initial product documentation.
2. Resolve critical open product questions where possible.
3. Define the system architecture.
4. Define the initial domain/data model.
5. Define authentication and authorisation requirements.
6. Establish the repository/application architecture.
7. Begin Stage 1 only after the foundation is sufficiently understood.

Implementation should not begin by selecting frameworks or creating application boilerplate before these decisions are documented.

---

# 17. Related Documentation

* [`00-overview.md`](./00-overview.md) — Product context, vision, and terminology
* [`01-product-requirements.md`](./01-product-requirements.md) — Functional and non-functional requirements
* [`27-decisions.md`](./27-decisions.md) — Significant product and technical decisions

Future documentation will provide detailed designs for each major system capability.
