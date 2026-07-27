# TSDW Sports Platform — Decision Log

## 1. Purpose

This document records significant product, domain, architectural, and technical decisions made during development of the **TSDW Sports Platform**.

The purpose of this log is to preserve not only **what** was decided, but also **why** the decision was made.

Without this context, future developers may encounter an existing design, assume it was arbitrary, and replace it without understanding the original constraints.

This document therefore acts as a lightweight **Architecture Decision Record (ADR)** log for the project.

---

# 2. Decision Format

Each significant decision follows this structure:

```text
ADR-XXX — Decision Title

Status
Date

Context
What problem or question required a decision?

Decision
What did we decide?

Rationale
Why was this approach selected?

Consequences
What benefits, costs, and constraints result from the decision?

Alternatives Considered
What other approaches were considered?

Revisit When
Under what conditions should this decision be reconsidered?
```

Not every implementation detail requires an ADR.

A decision should generally be recorded when it:

* Significantly affects the domain model
* Affects multiple platform modules
* Introduces an important architectural constraint
* Changes security or access-control behaviour
* Changes product scope
* Has meaningful long-term consequences
* Would be difficult or expensive to reverse
* Is likely to make a future developer ask, "Why was this designed this way?"

---

# 3. Decision Statuses

The following statuses may be used.

| Status         | Meaning                                                    |
| -------------- | ---------------------------------------------------------- |
| **Proposed**   | Decision is being considered but is not final              |
| **Accepted**   | Decision has been approved and should guide implementation |
| **Superseded** | A newer ADR replaces this decision                         |
| **Deprecated** | The decision should no longer guide new implementation     |
| **Rejected**   | The proposed approach was explicitly rejected              |

When a decision is superseded, the old ADR should remain in this document for historical context.

It should reference the ADR that replaced it.

---

# 4. Product and Domain Decisions

## ADR-001 — Build a Sports Operations Platform, Not Only a Website

**Status:** Accepted
**Date:** 2026-07-27

### Context

The initial requirement could be interpreted as creating a public website for TSDW Sports.

However, the required capabilities include:

* Event management
* Fixtures
* Live scoring
* Results
* Winners
* Teams
* Achievements
* Committee records
* Administrative access
* Participant operations
* Certificates
* Historical records

These requirements involve operational workflows and persistent structured data rather than only informational pages.

### Decision

The project will be designed as a **sports operations and information platform** with a public website as one interface to the system.

### Rationale

Treating the project as a conventional content website would make operational features such as fixtures, live scoring, tournament progression, permissions, and certificates difficult to integrate cleanly.

The platform model provides a stronger foundation for both public information and internal sports operations.

### Consequences

**Positive**

* Operational features become first-class parts of the system.
* Public and administrative functionality can use the same structured data.
* The platform can grow beyond static event information.
* Routine sports operations can eventually be performed without code changes.

**Negative**

* The system is more complex than a conventional informational website.
* Authentication, authorisation, data integrity, and administration become important engineering concerns.

### Alternatives Considered

**Static sports website**

Rejected because it does not adequately support operational workflows.

**Website with manually embedded spreadsheets/forms**

May be useful temporarily during migration but should not define the platform architecture.

### Revisit When

Reconsider only if TSDW requires a substantially simpler informational product and no longer requires operational capabilities.

---

## ADR-002 — Separate Event from Event Edition

**Status:** Accepted
**Date:** 2026-07-27

### Context

Events such as TSpark and Reflex recur across multiple academic years.

Treating every occurrence as an unrelated event would duplicate the recurring event identity and make historical navigation less structured.

Treating TSpark as a single record that is updated each year would destroy or complicate historical data.

### Decision

The platform will distinguish between:

* **Event** — the recurring event identity
* **Event Edition** — a particular occurrence of that event

Example:

```text
Event
└── TSpark
    ├── TSpark 2025
    ├── TSpark 2026
    └── TSpark 2027
```

### Rationale

The distinction allows stable event identity while preserving independent information for each occurrence.

Each edition can have its own:

* Dates
* Sports
* Competitions
* Teams
* Fixtures
* Results
* Winners
* Announcements

### Consequences

**Positive**

* Historical editions remain structured.
* Creating a new year does not overwrite the previous year.
* Public navigation can naturally group editions under an event.
* Recurring event metadata does not need unnecessary duplication.

**Negative**

* Adds another domain relationship.
* Administrative workflows must distinguish between editing an event and editing an edition.

### Alternatives Considered

**Create an unrelated Event record every year**

Rejected because recurring identity would be duplicated.

**Single Event record updated annually**

Rejected because historical preservation would become difficult.

### Revisit When

This decision should only be reconsidered if recurring events cease to be relevant to the platform.

---

## ADR-003 — Historical Preservation Is a Core System Property

**Status:** Accepted
**Date:** 2026-07-27

### Context

TSDW Sports changes across academic years.

Events, fixtures, winners, teams, achievements, participants, and committee members all change over time.

A system focused only on current information would repeatedly replace valuable historical data.

### Decision

Historical preservation will be considered a core system requirement from the beginning.

New academic years and event editions must not overwrite previous sports records.

### Rationale

The platform has the opportunity to become a persistent TCET sports archive rather than another temporary committee website.

Historical data also enables future capabilities such as:

* Past champions
* Department performance history
* Team history
* Achievement history
* Committee history
* Historical statistics

### Consequences

**Positive**

* Institutional sports history is preserved.
* Historical analysis becomes possible.
* Committee transitions do not erase previous records.

**Negative**

* Data models must account for time and historical relationships.
* Deletion and modification rules require greater care.
* Historical records may be incomplete for earlier years.

### Alternatives Considered

**Store only current data**

Rejected because it conflicts directly with the long-term purpose of the platform.

**Archive previous websites/pages separately**

Rejected because historical information would remain fragmented and difficult to query.

### Revisit When

This is considered a foundational product principle and is unlikely to be reversed.

---

## ADR-004 — Use Archive Navigation Instead of Large Collapsed Historical Sections

**Status:** Accepted
**Date:** 2026-07-27

### Context

The original concept proposed keeping current information expanded while collapsing previous years.

This works with a small amount of data but becomes difficult to navigate as years accumulate.

### Decision

Historical information will be accessed through structured edition/year navigation rather than placing every year on the same page inside collapsed sections.

For example:

```text
TSpark

Edition: [ 2027 ▼ ]

2027
2026
2025
2024
```

Current information will remain the default and receive primary visibility.

### Rationale

Structured archive navigation scales better and provides cleaner URLs, filtering, and historical browsing.

### Consequences

**Positive**

* Current pages remain uncluttered.
* Historical navigation scales across many years.
* Individual editions can have stable URLs.
* Historical information can be queried independently.

**Negative**

* Requires explicit archive navigation and routing.

### Alternatives Considered

**Accordion/collapsible sections containing every year**

Rejected as the primary archive strategy because it does not scale well.

Collapsible components may still be used locally where appropriate.

### Revisit When

Reconsider if historical datasets remain extremely small and structured navigation proves unnecessarily complex.

---

## ADR-005 — Department Teams and Official TCET Teams Are Separate Concepts

**Status:** Accepted
**Date:** 2026-07-27

### Context

Internal events such as TSpark involve teams representing individual TCET departments.

TCET also has official teams representing the college in external competitions.

Although both are sports teams, they represent fundamentally different entities.

### Decision

The domain model will distinguish between:

* Teams participating on behalf of departments in internal competitions
* Official TCET teams representing the college externally

### Rationale

Combining the concepts would create ambiguity around:

* Representation
* Rosters
* Achievements
* Competition context
* Historical records

### Consequences

**Positive**

* Internal and external sports records remain clear.
* TCET achievements can be associated correctly.
* Department competition history remains independent.

**Negative**

* Some team-related functionality may need to support both concepts.

### Alternatives Considered

**Single Team model with no conceptual distinction**

Rejected because it would blur different business concepts.

This decision does not yet prescribe whether implementation will use separate database models or a shared model with explicit types. That belongs in data-model design.

### Revisit When

Revisit during data-model design if a shared technical representation can preserve the conceptual distinction cleanly.

---

## ADR-006 — The Platform Must Be Event-Agnostic

**Status:** Accepted
**Date:** 2026-07-27

### Context

TSpark is currently the most clearly understood sports event and contains significant functionality.

Building the system directly around TSpark would be easier initially.

However, TSDW Sports also operates Reflex, National Sports Day, and potentially future events with different structures.

### Decision

The core platform will not be hardcoded around TSpark.

TSpark will be represented using generic event, edition, sport, competition, fixture, and result concepts.

### Rationale

A generic event model allows new events to be created without requiring structural application changes.

### Consequences

**Positive**

* Reflex and National Sports Day can use the same platform.
* Future events can be introduced through administration.
* TSpark-specific assumptions are less likely to contaminate the core domain.

**Negative**

* Generic modelling requires more careful design.
* Some TSpark-specific functionality may require specialised extensions.

### Alternatives Considered

**Build a TSpark management system first**

Rejected as the platform architecture because it creates unnecessary future migration risk.

TSpark may still be the primary real-world scenario used to validate the generic design.

### Revisit When

Reconsider if future requirements establish that different events require entirely independent operational systems.

---

## ADR-007 — The Platform Must Be Sport-Agnostic at Its Core

**Status:** Accepted
**Date:** 2026-07-27

### Context

Different sports use significantly different scoring and competition structures.

Examples include football, cricket, volleyball, chess, and esports.

Implementing detailed rules for every sport before the core platform is stable would create excessive complexity.

### Decision

The core platform will use generic competition, fixture, score, status, and result concepts.

Sport-specific behaviour may be introduced through specialised extensions where justified.

### Rationale

Most initial requirements can be supported without replicating professional scoring systems for every sport.

### Consequences

**Positive**

* New sports can be added more easily.
* Core fixtures and results remain consistent.
* Initial implementation remains manageable.

**Negative**

* Generic scoring will not capture every sport-specific statistic.
* Some sports may eventually require additional data structures.

### Alternatives Considered

**Build dedicated scoring systems for each sport immediately**

Rejected because the development cost and complexity are not justified during initial releases.

### Revisit When

Introduce specialised scoring when actual event operations demonstrate that the generic model is insufficient.

---

## ADR-008 — Start with Generic Live Scoring

**Status:** Accepted
**Date:** 2026-07-27

### Context

Live scoring is a major planned capability.

Professional scoring systems vary significantly by sport.

For example:

```text
Football
Goals + match time

Cricket
Runs + wickets + overs + innings

Volleyball
Sets + points

Esports
Maps + rounds + series
```

### Decision

The first live-scoring implementation will use a generic score model capable of representing common match states and results.

Detailed sport-specific scoring will be introduced later only where required.

### Rationale

The platform should first prove that it can reliably handle:

```text
Fixture
→ Live
→ Score Updates
→ Completed
→ Result
```

before adding specialised scoring complexity.

### Consequences

**Positive**

* Live scoring can be introduced earlier.
* Common infrastructure can be validated.
* Sport-specific extensions can build on stable foundations.

**Negative**

* Early live scoring may provide less detail than sport-specific platforms.

### Alternatives Considered

**Detailed scoring from the first release**

Rejected because it introduces unnecessary complexity before the core match system is proven.

### Revisit When

Revisit per sport when organisers identify specific scoring requirements that generic scoring cannot satisfy.

---

## ADR-009 — Live Scoring Will Follow Core Fixture and Result Management

**Status:** Accepted
**Date:** 2026-07-27

### Context

Live scoring is one of the most visible planned features and could be prioritised early.

However, live scoring depends on reliable modelling of:

* Events
* Competitions
* Teams
* Fixtures
* Match states
* Results
* Permissions

Building real-time infrastructure before these concepts stabilise would increase rework.

### Decision

V1 will establish fixture and result management first.

Live scoring will be introduced in V1.5 after the underlying match workflow is stable.

### Rationale

The platform should first reliably support:

```text
Event
→ Competition
→ Team
→ Fixture
→ Result
→ Winner
→ Archive
```

Real-time updates are an enhancement to that workflow, not its foundation.

### Consequences

**Positive**

* Domain problems can be solved before real-time complexity is introduced.
* Live scoring builds on tested fixture and result workflows.
* V1 remains smaller and easier to validate.

**Negative**

* The first usable release will not include one of the platform's most visible planned features.

### Alternatives Considered

**Live scoring in V1**

Rejected because it creates additional infrastructure complexity before core match management is stable.

### Revisit When

Reconsider only if an upcoming TSDW event requires live scoring before V1 can otherwise be completed.

---

## ADR-010 — Participant Accounts Are Not Required by Default

**Status:** Accepted
**Date:** 2026-07-27

### Context

Participants may eventually require:

* Registration
* Team membership
* Participation history
* Certificate access

A straightforward approach would be to create an account for every participant.

However, this introduces:

* Account provisioning
* Password management
* Recovery workflows
* Duplicate accounts
* Access revocation
* Additional personal data
* User support

### Decision

The platform will not require permanent participant accounts unless a feature provides sufficient reason for persistent authentication.

Participant records and user accounts will be treated as separate concepts.

### Rationale

A student can participate in an event without needing an application account.

Features such as certificate retrieval may be supported through limited verification mechanisms instead.

### Consequences

**Positive**

* Reduced authentication complexity.
* Fewer unnecessary user accounts.
* Lower support burden.
* Participant records remain independent from platform access.

**Negative**

* Some participant features may require alternative verification mechanisms.
* Persistent personalised dashboards may require accounts later.

### Alternatives Considered

**Account for every participant**

Rejected as a default requirement because current workflows do not justify the complexity.

### Revisit When

Reconsider if persistent participant functionality such as self-service registrations, team management, notifications, or personal sports profiles becomes important.

---

## ADR-011 — Routine Sports Content Must Not Require Code Changes

**Status:** Accepted
**Date:** 2026-07-27

### Context

Sports information changes frequently.

Examples include:

* New event editions
* Fixtures
* Scores
* Winners
* Achievements
* Committee members
* Announcements

Requiring a developer to modify code and deploy the application for these changes would create an operational bottleneck.

### Decision

Routine sports content and operations will eventually be managed through authenticated administrative interfaces.

Developers remain responsible for application structure, features, technical configuration, and maintenance.

### Rationale

The platform should remain usable by future TSDW organising teams even when the original developer is unavailable.

### Consequences

**Positive**

* Organisers can manage their own operations.
* Fewer deployments are required for content changes.
* The platform can survive developer transitions.
* Event operations are faster.

**Negative**

* Requires an administrative application.
* Requires authentication, authorisation, validation, and audit controls.

### Alternatives Considered

**Developer-controlled content files**

Suitable only during early development, not for production sports operations.

**Direct database editing**

Rejected as an operational workflow due to usability and data-integrity risks.

### Revisit When

This is considered a core maintainability principle.

---

## ADR-012 — Use Role-Based and Scoped Administrative Access

**Status:** Accepted
**Date:** 2026-07-27

### Context

Different organisers require different levels of access.

A secretary may manage broad event operations, while a scorekeeper may only need permission to update a specific competition or fixture.

Providing every organiser with full administrative access creates unnecessary risk.

### Decision

Administrative access will follow role-based access control with support for resource scoping where required.

Potential roles include:

* System Administrator
* Sports Administrator
* Secretary/Organiser
* Scorekeeper

Permissions may be scoped to resources such as:

* Event edition
* Sport
* Competition
* Fixture

### Rationale

The platform should follow the principle of least privilege.

### Consequences

**Positive**

* Reduced risk of accidental or unauthorised changes.
* Responsibilities can be delegated safely.
* Temporary event staff can receive limited access.

**Negative**

* Authorisation becomes more complex.
* Administrative UI must reflect permission boundaries.
* Server-side permission enforcement is required.

### Alternatives Considered

**All administrators receive full access**

Rejected due to unnecessary operational and security risk.

**Only the developer can modify data**

Rejected because it creates an unsustainable operational bottleneck.

### Revisit When

The specific role model should be refined after actual TSDW operational responsibilities are documented.

---

## ADR-013 — Public Sports Information Should Not Require Authentication

**Status:** Accepted
**Date:** 2026-07-27

### Context

Students and spectators primarily need quick access to:

* Fixtures
* Schedules
* Live scores
* Results
* Winners
* Standings
* Achievements

Requiring login would create unnecessary friction.

### Decision

Information intended for public consumption will be accessible without authentication.

Authentication will be required only for protected operations or information.

### Rationale

During active events, access speed and simplicity are more important than account-based personalisation.

### Consequences

**Positive**

* Students can access information immediately.
* Fixtures and results can be shared through direct links.
* No account is required for spectators.

**Negative**

* Public/private data boundaries must be defined carefully.
* Public endpoints must be designed to avoid leaking administrative data.

### Alternatives Considered

**Require TCET login for the entire platform**

Rejected because no current requirement justifies restricting public sports information.

### Revisit When

Reconsider if TCET introduces institutional requirements restricting specific information.

---

## ADR-014 — Participant Administrative Data Is Private by Default

**Status:** Accepted
**Date:** 2026-07-27

### Context

Participant records may contain information required for registration, eligibility, team management, or certificates.

The existence of this information in the system does not mean it should be publicly exposed.

### Decision

Participant administrative information will be private by default.

Any participant information shown publicly must be intentionally selected for public presentation.

### Rationale

Public sports information and administrative participant data serve different purposes.

The platform should minimise unnecessary exposure of student information.

### Consequences

**Positive**

* Clearer privacy boundaries.
* Reduced accidental exposure.
* Future athlete profiles can be designed separately from administrative records.

**Negative**

* Public roster features may require explicit public fields or presentation rules.

### Alternatives Considered

**Make participant profiles public automatically**

Rejected because administrative data should not implicitly become public content.

### Revisit When

Reconsider specific public fields if TSDW or TCET defines approved public roster or athlete-profile requirements.

---

## ADR-015 — Certificate Verification Should Not Require a Participant Account

**Status:** Accepted
**Date:** 2026-07-27

### Context

Certificates should be independently verifiable by people who may not have access to the platform as authenticated users.

Examples include:

* Students
* Faculty
* Employers
* Event organisers
* Other institutions

### Decision

Issued certificates will eventually support public verification through a unique certificate identifier.

QR codes may direct to the public verification mechanism.

Participant login will not be required for third-party certificate verification.

### Rationale

A verification system loses much of its usefulness if the verifier must create an account.

### Consequences

**Positive**

* Certificates can be independently verified.
* QR verification becomes practical.
* Verification links can remain stable.

**Negative**

* Verification pages must carefully limit exposed personal information.
* Certificate identifiers must be designed to avoid accidental information leakage.

### Alternatives Considered

**Verification available only after login**

Rejected because it adds unnecessary friction and reduces external usefulness.

### Revisit When

Reconsider if institutional policy requires restricted verification.

---

## ADR-016 — Prefer Manual Reliability Before Workflow Automation

**Status:** Accepted
**Date:** 2026-07-27

### Context

The platform may eventually automate:

* Fixture generation
* Tournament progression
* Standings
* Registration validation
* Certificate generation
* Notifications

Automating workflows before their real operational rules are understood risks encoding incorrect assumptions.

### Decision

Reliable manual administrative workflows will be implemented before complex automation where practical.

Automation should be added after the underlying workflow and rules are validated.

### Rationale

A correct manual workflow is more valuable than an incorrect automated workflow.

### Consequences

**Positive**

* Requirements can be validated using real events.
* Automation can be built against proven processes.
* Exceptional cases remain manageable.

**Negative**

* Early versions may require more organiser effort.
* Some workflows may temporarily involve manual operations.

### Alternatives Considered

**Automate everything from the first implementation**

Rejected because many TSDW operational rules are not yet sufficiently documented.

### Revisit When

Individual workflows should be automated once their rules are understood and automation provides meaningful operational value.

---

## ADR-017 — Historical Records Must Survive Current Reference-Data Changes

**Status:** Accepted
**Date:** 2026-07-27

### Context

Departments, committee roles, sports names, competition structures, and other reference data may change over time.

Historical records should continue to represent what existed during the original event.

### Decision

The data model must be designed so changes to current reference information do not unintentionally destroy or invalidate historical sports records.

### Rationale

Historical accuracy is part of the platform's purpose.

### Consequences

**Positive**

* Archived event data remains meaningful.
* Current organisational changes do not rewrite history.

**Negative**

* Data deletion and update behaviour will require careful modelling.
* Some entities may require historical snapshots, versioning, or retained references.

This ADR defines the requirement, not the implementation technique.

### Alternatives Considered

**Always reference only the latest current data**

Rejected because historical records could become inaccurate.

### Revisit When

Implementation strategy should be revisited during data-model design.

---

# 5. Engineering Decisions Pending

The following areas intentionally do **not** have accepted decisions yet.

They should be evaluated during Stage 0 rather than selected implicitly.

## Application Architecture

Pending questions include:

* Monorepo vs alternative repository structure
* Public and admin application boundaries
* Backend/API boundaries
* Shared package strategy

---

## Frontend

No frontend framework has been formally selected.

---

## Backend

No backend framework or API architecture has been formally selected.

---

## Database

No database technology has been formally selected.

---

## Data Access

No ORM, query builder, or database access strategy has been formally selected.

---

## Authentication

The product requires administrative authentication, but no authentication technology has been selected.

---

## Real-Time Communication

Live scoring requires timely public updates, but no transport technology has been selected.

Potential approaches will be evaluated later.

---

## File Storage

Certificate files, images, and other media may require object/file storage.

No provider or architecture has been selected.

---

## Deployment

No hosting or deployment platform has been selected.

---

## Testing

Testing requirements exist, but the specific tools and test architecture remain undecided.

---

# 6. Proposed Decisions

This section may temporarily contain decisions under active evaluation.

A proposed decision should eventually be:

* Accepted
* Rejected
* Superseded

or removed if it never became significant enough to warrant an ADR.

Currently, no technical architecture proposals have been accepted.

---

# 7. Superseded Decisions

No decisions have currently been superseded.

When this occurs, retain the original ADR and reference the replacement.

Example:

```text
ADR-020 — Original Decision

Status: Superseded by ADR-031
```

Historical decisions should not be deleted merely because the platform changed direction.

---

# 8. Decision Index

| ADR     | Decision                                                              | Status   |
| ------- | --------------------------------------------------------------------- | -------- |
| ADR-001 | Build a Sports Operations Platform, Not Only a Website                | Accepted |
| ADR-002 | Separate Event from Event Edition                                     | Accepted |
| ADR-003 | Historical Preservation Is a Core System Property                     | Accepted |
| ADR-004 | Use Archive Navigation Instead of Large Collapsed Historical Sections | Accepted |
| ADR-005 | Department Teams and Official TCET Teams Are Separate Concepts        | Accepted |
| ADR-006 | The Platform Must Be Event-Agnostic                                   | Accepted |
| ADR-007 | The Platform Must Be Sport-Agnostic at Its Core                       | Accepted |
| ADR-008 | Start with Generic Live Scoring                                       | Accepted |
| ADR-009 | Live Scoring Will Follow Core Fixture and Result Management           | Accepted |
| ADR-010 | Participant Accounts Are Not Required by Default                      | Accepted |
| ADR-011 | Routine Sports Content Must Not Require Code Changes                  | Accepted |
| ADR-012 | Use Role-Based and Scoped Administrative Access                       | Accepted |
| ADR-013 | Public Sports Information Should Not Require Authentication           | Accepted |
| ADR-014 | Participant Administrative Data Is Private by Default                 | Accepted |
| ADR-015 | Certificate Verification Should Not Require a Participant Account     | Accepted |
| ADR-016 | Prefer Manual Reliability Before Workflow Automation                  | Accepted |
| ADR-017 | Historical Records Must Survive Current Reference-Data Changes        | Accepted |

---

# 9. Adding New Decisions

When a significant decision is made:

1. Assign the next ADR number.
2. Record the date.
3. Describe the context that required the decision.
4. State the decision clearly.
5. Explain the rationale.
6. Record positive and negative consequences.
7. Record meaningful alternatives considered.
8. Define when the decision should be reconsidered.
9. Add the ADR to the Decision Index.

Do not renumber existing ADRs.

Once an ADR number has been used, it remains part of the project's history.

---

# 10. Relationship to Other Documentation

This file records **why significant decisions were made**.

It should not replace detailed documentation.

For example:

```text
27-decisions.md
ADR: Use role-based and scoped access
        ↓
04-auth-and-rbac.md
Detailed permission model
        ↓
Implementation
Actual authorisation system
```

Similarly:

```text
ADR: Event and Event Edition are separate
        ↓
03-data-model.md
Entity relationships
        ↓
Database Schema
Technical implementation
```

The decision log should remain concise enough to explain architectural intent without becoming the implementation specification.

---

# 11. Current Decision State

The project currently has an established **product direction** but intentionally does not yet have an established **technical architecture**.

Accepted decisions currently define:

* The type of platform being built
* Core domain distinctions
* Historical-data principles
* Administrative philosophy
* Public access philosophy
* Participant-account strategy
* Initial scoring strategy
* Development sequencing

Technology choices will be recorded only after their requirements and trade-offs have been evaluated.

This prevents technology familiarity from being mistaken for architectural justification.
