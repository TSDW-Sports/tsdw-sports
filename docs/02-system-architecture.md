# TSDW Sports Platform — System Architecture

## 1. Purpose

This document defines the high-level system architecture for the **TSDW Sports Platform**.

It describes:

* System boundaries
* Application responsibilities
* Architectural layers
* Repository structure
* Communication between components
* Data ownership
* Dependency rules
* Real-time boundaries
* Storage boundaries
* Environment strategy
* Architectural constraints

This document establishes **how the platform is structurally organised**.

Detailed database entities, API contracts, authentication rules, module behaviour, and deployment configuration are documented separately.

---

# 2. Architectural Goals

The architecture should support the following goals.

## 2.1 Maintainability

The system should remain understandable and maintainable by future developers without depending on undocumented knowledge held by the original development team.

---

## 2.2 Separation of Concerns

Public presentation, administration, business logic, data access, persistence, and infrastructure concerns should remain clearly separated.

---

## 2.3 Independent Backend

Core sports operations should not depend directly on the frontend framework.

The backend should expose application capabilities through explicit interfaces so that future clients can interact with the same system.

Potential future clients may include:

* Web application
* Administrative interfaces
* Dedicated event displays
* Mobile applications
* External integrations

These are not current requirements, but the architecture should not unnecessarily prevent them.

---

## 2.4 Historical Integrity

The architecture must support persistent historical records across event editions and academic years.

Current operations must not overwrite historical information.

---

## 2.5 Event and Sport Flexibility

The architecture must avoid coupling core platform behaviour directly to:

* TSpark
* A specific academic year
* A specific department
* A specific sport
* A specific competition format

Event-specific and sport-specific behaviour may extend the platform where necessary.

---

## 2.6 Operational Reliability

Administrative operations such as score updates, result publication, tournament progression, and certificate issuance must be handled through controlled backend workflows.

---

## 2.7 Incremental Complexity

The architecture should support advanced capabilities without requiring all of them to exist from the first release.

Examples include:

* Live scoring
* Tournament automation
* Registrations
* Certificates
* Notifications
* Sport-specific scoring

---

# 3. High-Level Architecture

The platform will use a client-server architecture with a dedicated web application and backend API.

```text
                       USERS
                         │
                         ▼
                ┌────────────────┐
                │      WEB       │
                │                │
                │ Public Website │
                │ Admin UI       │
                └───────┬────────┘
                        │
                        │ HTTPS
                        ▼
                ┌────────────────┐
                │      API       │
                │                │
                │ Business Logic │
                │ Validation     │
                │ Authorization  │
                │ Transactions   │
                └───────┬────────┘
                        │
             ┌──────────┼───────────┐
             ▼          ▼           ▼
       ┌──────────┐ ┌────────┐ ┌─────────┐
       │PostgreSQL│ │Realtime│ │ Storage │
       └──────────┘ └────────┘ └─────────┘
```

The **Web Application** is responsible for user interaction.

The **API Application** owns business operations and protected access to platform data.

The **Database** stores structured platform records.

The **Realtime Layer** will eventually distribute time-sensitive updates such as live scores.

The **Storage Layer** will eventually store generated files and media where required.

---

# 4. Repository Architecture

The project will use a TypeScript monorepo.

Planned structure:

```text
tsdw-sports/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── database/
│   ├── validation/
│   ├── types/
│   └── config/
│
├── docs/
│
├── package.json
├── pnpm-workspace.yaml
└── ...
```

Additional packages should only be created when a clear shared responsibility exists.

The repository should not become a collection of small packages without practical architectural value.

---

# 5. Monorepo Strategy

The platform will initially maintain the web application, backend API, shared packages, and documentation within a single repository.

## Rationale

The applications belong to the same product and will evolve together.

A monorepo provides:

* Coordinated changes
* Shared types
* Shared validation
* Shared configuration
* Simplified local development
* Atomic commits across applications
* Centralised documentation

Separate repositories would introduce coordination overhead without a current operational benefit.

---

# 6. Web Application

The web application will contain both:

* Public platform
* Administrative interface

These represent separate access contexts but do not initially require separate frontend applications.

Planned responsibility:

```text
apps/web
│
├── Public
│   ├── Home
│   ├── Events
│   ├── Sports
│   ├── Fixtures
│   ├── Results
│   ├── Teams
│   ├── Achievements
│   ├── Committee
│   ├── Archive
│   └── Certificate Verification
│
└── Admin
    ├── Dashboard
    ├── Events
    ├── Competitions
    ├── Fixtures
    ├── Results
    ├── Teams
    ├── Achievements
    ├── Committee
    └── ...
```

The exact route structure will be defined during frontend design.

---

# 7. Why Public and Admin Share One Web Application

The public and administrative interfaces belong to the same product and share:

* Domain types
* Authentication context
* Design system
* Components
* Navigation infrastructure
* API client behaviour
* Validation
* Build tooling

Separating them immediately would introduce additional deployment and maintenance complexity without providing a clear current benefit.

Logical boundaries should still exist between public and administrative interfaces.

Administrative code must not rely on frontend visibility as a security boundary.

The backend remains responsible for authorisation.

---

# 8. Web Technology

The initial frontend technology selection is:

* **Next.js**
* **TypeScript**
* **Tailwind CSS**

Next.js will provide the web application framework.

TypeScript will be used throughout the application.

Tailwind CSS will provide the styling foundation.

Detailed component architecture, rendering strategy, caching, and design-system decisions will be defined later.

---

# 9. Backend Application

The backend will exist as an independent application.

Planned location:

```text
apps/api
```

Initial technology selection:

* **Node.js**
* **TypeScript**
* **Fastify**
* **REST**

The API owns the authoritative execution of platform business operations.

---

# 10. Backend Responsibilities

The backend is responsible for:

* Input validation
* Authentication integration
* Authorisation
* Business rules
* Domain operations
* Database access
* Transactions
* Audit recording
* Result processing
* Tournament progression
* Certificate operations
* Live-scoring operations
* Controlled access to private information

The frontend must not be treated as the authority for these operations.

---

# 11. Backend Layering

Backend modules should separate transport logic from business logic and persistence.

Conceptually:

```text
HTTP Request
     │
     ▼
Route / Controller
     │
     ▼
Application Service
     │
     ▼
Data Access
     │
     ▼
Database
```

Cross-cutting systems may participate where required:

```text
                 Authorization
                       │
                       ▼
HTTP → Route → Service → Data Access → Database
                       │
                       ├── Audit
                       ├── Realtime
                       └── Storage
```

---

# 12. Route / Controller Layer

The route layer handles HTTP-specific concerns.

Responsibilities include:

* Route definitions
* Request parsing
* Input validation boundary
* Authentication context extraction
* Calling application services
* Mapping results to HTTP responses

Routes should remain thin.

A route should not contain significant tournament, scoring, standings, certificate, or other domain logic.

---

# 13. Application Service Layer

Application services coordinate business operations.

Example:

```text
completeFixture()
```

may eventually perform:

```text
Validate fixture state
        ↓
Verify user permission
        ↓
Validate final result
        ↓
Complete fixture
        ↓
Determine winner
        ↓
Update tournament progression
        ↓
Update standings if applicable
        ↓
Write audit record
        ↓
Commit transaction
        ↓
Publish update
```

The service layer allows the same business operation to remain consistent regardless of which client initiates it.

---

# 14. Data Access Layer

Database access should remain separated from HTTP transport concerns.

The data-access layer is responsible for persistence operations.

Business logic should not become tightly coupled to individual ORM calls scattered across route handlers.

The exact repository abstraction should remain pragmatic.

The project should avoid introducing repository classes purely for architectural ceremony when a simpler module boundary provides sufficient separation.

---

# 15. API Style

The platform will initially use a REST API.

Example resource structure may eventually resemble:

```text
/api/v1/events
/api/v1/event-editions
/api/v1/sports
/api/v1/competitions
/api/v1/fixtures
/api/v1/teams
/api/v1/achievements
```

Operation-oriented endpoints may be used where a business operation is more meaningful than generic CRUD.

For example:

```text
POST /api/v1/fixtures/:fixtureId/start
POST /api/v1/fixtures/:fixtureId/complete
```

rather than exposing unrestricted field mutation.

Detailed conventions will be defined in `22-api-design.md`.

---

# 16. API Versioning

The API should use explicit versioning.

Initial public application API routes should use:

```text
/api/v1
```

Breaking API contract changes should not silently alter existing version behaviour.

The exact long-term versioning strategy will be defined during API design.

---

# 17. Database

The primary structured database will be **PostgreSQL**.

The platform contains strongly relational data including:

```text
Event
  ↓
Event Edition
  ↓
Competition
  ↓
Team
  ↓
Fixture
  ↓
Result
```

alongside relationships involving:

* Departments
* Participants
* TCET teams
* Achievements
* Committee tenures
* Users
* Roles
* Permissions
* Certificates
* Announcements
* Audit records

A relational database is appropriate for these relationships and integrity requirements.

---

# 18. ORM and Data Access

The initial ORM selection is **Prisma**.

Prisma will support:

* Schema definition
* Type-safe database access
* Migrations
* Development tooling

Prisma is an implementation detail of the persistence layer.

Business logic should not be designed around Prisma-specific behaviour where avoidable.

Detailed database modelling belongs in `03-data-model.md`.

---

# 19. Shared Validation

Shared validation schemas should be used where both the web and API applications need consistent definitions.

The initial validation library selection is **Zod**.

Potential location:

```text
packages/validation
```

Examples may include:

* Event forms
* Fixture forms
* Achievement forms
* Shared query/filter structures

Server-side validation remains authoritative.

Client-side validation exists primarily for user experience.

---

# 20. Shared Types

Cross-application types may be stored in:

```text
packages/types
```

Examples include stable application-level types that are genuinely shared between applications.

The project should avoid manually duplicating types already safely derived from schemas or other authoritative definitions.

Shared packages should reduce duplication rather than create another source of truth.

---

# 21. Database Package

Database-specific configuration may live in:

```text
packages/database
```

Potential responsibilities include:

* Prisma schema
* Generated client integration
* Database client lifecycle
* Migrations
* Seed infrastructure

The exact structure will be determined during database implementation.

---

# 22. Configuration Package

Shared development and tooling configuration may be placed in:

```text
packages/config
```

Only genuinely shared configuration should be moved into this package.

Application-specific configuration should remain with the application that owns it.

---

# 23. Authentication Boundary

Administrative functionality requires authenticated identities.

However, the authentication technology has not yet been selected.

The architecture therefore defines the required boundary rather than a provider.

Conceptually:

```text
User
  ↓
Authentication System
  ↓
Identity
  ↓
API
  ↓
Authorization
  ↓
Operation
```

Authentication answers:

> Who is this user?

Authorisation answers:

> Is this user allowed to perform this operation on this resource?

These concerns must remain distinct.

Detailed authentication design belongs in `04-auth-and-rbac.md`.

---

# 24. Authorisation Boundary

The API is the authoritative permission boundary.

The web application may hide inaccessible controls, but this is only a user-experience feature.

Every protected operation must be authorised by the backend.

Example:

```text
Scorekeeper
    ↓
PATCH / fixture score
    ↓
API
    ↓
Authenticated?
    ↓
Permission for this competition?
    ↓
Fixture editable?
    ↓
Update
```

A request must not become valid merely because it originated from the official frontend.

---

# 25. Real-Time Architecture

Live scoring eventually requires timely distribution of match updates.

Conceptually:

```text
Scorekeeper
    │
    ▼
   API
    │
    ├── Persist Update
    │
    └── Publish Update
             │
             ▼
       Realtime Layer
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     User  User  Display
```

The exact real-time transport has intentionally not yet been selected.

Potential approaches include:

* WebSockets
* Server-Sent Events
* Higher-level real-time libraries

The choice will be evaluated during live-scoring design.

---

# 26. Database Before Broadcast

Live updates must not exist only in the real-time transport.

The persistent database remains the source of truth.

Conceptually:

```text
Score Update
     ↓
Validate
     ↓
Persist
     ↓
Commit
     ↓
Broadcast
```

Clients reconnecting after losing connectivity must be able to retrieve the authoritative state from the API/database.

The realtime layer distributes changes; it does not replace persistence.

---

# 27. File and Object Storage

The platform may eventually need storage for:

* Generated certificates
* Achievement images
* Team images
* Event media
* Documents

Binary files should not be stored directly in the relational database unless a specific requirement justifies it.

The architecture anticipates S3-compatible object storage.

The storage provider has not yet been selected.

---

# 28. Audit Architecture

Important administrative actions should produce audit records.

Conceptually:

```text
Administrative Operation
         │
         ▼
    Service Layer
      │       │
      ▼       ▼
   Domain    Audit
   Change    Record
      │       │
      └───┬───┘
          ▼
      Transaction
```

Where practical, the domain change and corresponding audit record should succeed or fail together.

Detailed audit behaviour belongs in `21-audit-logs.md`.

---

# 29. Transaction Boundaries

Operations affecting multiple related records should use database transactions where consistency requires atomic behaviour.

Examples may include:

* Completing a fixture and recording its result
* Advancing a tournament winner
* Updating standings from a result
* Issuing a certificate and recording its issuance
* Applying administrative corrections

The system should avoid partially completed operations that leave competition state inconsistent.

---

# 30. Error Handling

The API should provide a consistent error model.

Errors may include categories such as:

* Validation error
* Authentication error
* Authorisation error
* Resource not found
* Conflict
* Invalid state transition
* Internal failure

Internal implementation details must not be unnecessarily exposed to clients.

Detailed API error contracts will be defined in `22-api-design.md`.

---

# 31. Logging

The backend should use structured operational logging.

Logs may include:

* Application startup
* Request failures
* Infrastructure failures
* Background operation failures
* Relevant security events

Application logs and audit records are different concepts.

**Logs** support technical operations.

**Audit records** explain meaningful administrative actions.

---

# 32. Module Boundaries

The backend should be organised around business domains rather than technical file types alone.

Potential modules include:

```text
events
sports
competitions
departments
teams
participants
fixtures
results
standings
venues
tcet-teams
achievements
committee
announcements
certificates
users
auth
audit
```

A module may contain its own:

* Routes
* Validation
* Services
* Data access
* Domain utilities

Exact module structure will evolve during implementation.

---

# 33. Example Backend Structure

A possible structure is:

```text
apps/api/src/
├── modules/
│   ├── events/
│   ├── competitions/
│   ├── fixtures/
│   ├── teams/
│   ├── achievements/
│   └── ...
│
├── plugins/
├── middleware/
├── lib/
├── config/
├── app.ts
└── server.ts
```

This structure is illustrative rather than a final implementation contract.

The system should prefer domain cohesion over creating large global folders such as:

```text
controllers/
services/
repositories/
```

containing unrelated modules.

---

# 34. Example Module Structure

A module may eventually resemble:

```text
fixtures/
├── fixture.routes.ts
├── fixture.service.ts
├── fixture.repository.ts
├── fixture.schema.ts
└── fixture.types.ts
```

Not every module must contain every file.

Files should exist because they provide useful separation, not because a template requires them.

---

# 35. Dependency Direction

Dependencies should generally flow inward toward business logic.

Conceptually:

```text
Transport
   ↓
Application Logic
   ↓
Persistence Interfaces / Data Access
   ↓
Infrastructure
```

Business rules should not depend on:

* HTTP request objects
* Frontend components
* Browser APIs
* Deployment-provider APIs

Infrastructure integrations should remain behind appropriate boundaries.

---

# 36. Public Data Flow

Example public request:

```text
Student
   ↓
Web Application
   ↓
GET /api/v1/event-editions/current
   ↓
API
   ↓
Service
   ↓
Database
   ↓
Response
   ↓
Web Application
   ↓
Student
```

Public endpoints do not require authentication unless the requested information is protected.

---

# 37. Administrative Data Flow

Example administrative operation:

```text
Secretary
    ↓
Admin Interface
    ↓
Authenticated API Request
    ↓
Authentication
    ↓
Authorization
    ↓
Validation
    ↓
Service
    ↓
Transaction
    ├── Domain Change
    └── Audit Record
    ↓
Response
```

For live operations, a real-time publication may follow successful persistence.

---

# 38. Source of Truth

The backend and database form the authoritative system for sports records.

The frontend must not maintain an independent authoritative copy of:

* Fixtures
* Results
* Winners
* Standings
* Permissions
* Certificates
* Historical records

Client-side state may cache or optimistically represent information, but persisted server state remains authoritative.

---

# 39. Environment Strategy

The project should eventually support at least:

```text
Development
Production
```

A staging environment may be introduced when deployment maturity or institutional adoption justifies it.

### Development

Used for:

* Local development
* Database migrations
* Seed data
* Feature testing

### Production

Used for actual TSDW Sports operations and public access.

Production data must not be casually reused as development data.

---

# 40. Environment Configuration

Environment-specific configuration should be provided outside source code.

Examples include:

```text
DATABASE_URL
AUTH_*
STORAGE_*
REALTIME_*
```

Actual variable names will be defined when the corresponding systems are implemented.

Secrets must not be committed to source control.

A safe example environment file should eventually document required configuration.

---

# 41. Deployment Architecture

The architecture should allow the web and API applications to be deployed independently.

Conceptually:

```text
                 Internet
                    │
            ┌───────┴───────┐
            ▼               ▼
       Web Deployment   API Deployment
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Database   Storage   Realtime
```

The exact hosting providers have not been selected.

Deployment decisions should be based on:

* Reliability
* Cost
* Operational complexity
* Database requirements
* Real-time support
* Institutional ownership
* Backup and recovery needs

Detailed deployment design belongs in `24-deployment.md`.

---

# 42. Scalability Strategy

The platform should initially optimise for:

* Simplicity
* Correctness
* Maintainability
* Event-day reliability

It does not require infrastructure designed for professional sports-scale traffic.

The architecture should nevertheless avoid obvious constraints preventing:

* Multiple concurrent matches
* Multiple scorekeepers
* Large event-day traffic spikes
* Multiple years of historical data

Scaling decisions should be driven by measured requirements rather than speculation.

---

# 43. Failure Considerations

The architecture should account for failures such as:

* API unavailable
* Database unavailable
* Client loses connection
* Live connection interrupted
* Duplicate administrative requests
* Concurrent score updates
* Storage unavailable
* Partial operation failure

Critical operations should prefer recoverable and consistent behaviour over silent failure.

Detailed resilience strategies will evolve with implementation.

---

# 44. Security Architecture

Security must exist across system boundaries.

At minimum:

```text
Browser
   ↓
HTTPS
   ↓
Authentication
   ↓
API Authorization
   ↓
Validation
   ↓
Business Rules
   ↓
Database
```

Security-sensitive decisions will be expanded in:

* `04-auth-and-rbac.md`
* `23-security.md`

---

# 45. Privacy Boundary

Public and administrative data must remain logically separated.

The API should explicitly control which information is returned through public endpoints.

The presence of information in the database does not imply that the information is publicly accessible.

This is particularly important for:

* Participant information
* Administrative user information
* Internal notes
* Audit history
* Authentication information

---

# 46. Testing Boundary

The architecture should support testing at multiple levels.

Potential layers include:

```text
Unit
  ↓
Service / Domain
  ↓
API Integration
  ↓
Database Integration
  ↓
End-to-End
```

Critical sports workflows should be testable independently from the user interface.

Detailed testing strategy belongs in `25-testing-strategy.md`.

---

# 47. Architectural Constraints

The following constraints currently guide implementation.

### AC-001

Core business operations must execute on the backend.

### AC-002

Protected operations must enforce authorisation server-side.

### AC-003

The database remains the authoritative persistent source of sports data.

### AC-004

Real-time transport must not become the only source of match state.

### AC-005

Historical records must not be overwritten by new event editions.

### AC-006

The core platform must not depend directly on TSpark-specific behaviour.

### AC-007

The core match system must not depend on a single sport's scoring model.

### AC-008

Routine sports content must be manageable without source-code changes.

### AC-009

Infrastructure providers should not unnecessarily leak into core business logic.

### AC-010

Shared packages should exist only where genuine shared ownership exists.

---

# 48. Initial Technology Baseline

The current technical baseline is:

| Area                | Selection                        |
| ------------------- | -------------------------------- |
| Language            | TypeScript                       |
| Runtime             | Node.js                          |
| Package Manager     | pnpm                             |
| Repository          | Monorepo                         |
| Web Framework       | Next.js                          |
| Styling             | Tailwind CSS                     |
| Backend Framework   | Fastify                          |
| API                 | REST                             |
| Database            | PostgreSQL                       |
| ORM                 | Prisma                           |
| Validation          | Zod                              |
| Authentication      | Deferred                         |
| Real-Time Transport | Deferred                         |
| Object Storage      | S3-compatible; provider deferred |
| Deployment          | Deferred                         |

Deferred decisions should not be interpreted as missing architecture.

Their architectural boundaries are defined, while their implementation technologies will be selected when sufficient requirements exist.

---

# 49. Decisions Established by This Architecture

The following technical decisions should be recorded in the project decision log:

* Use a TypeScript monorepo
* Separate the web and API applications
* Keep public and administrative interfaces in one web application initially
* Use PostgreSQL as the primary structured database
* Use REST for the application API
* Use Fastify for the backend
* Use Prisma for relational data access
* Use Zod for shared validation where appropriate
* Keep real-time transport separate from persistent state
* Defer provider-specific authentication, storage, real-time, and deployment decisions

These decisions should receive formal ADR entries rather than relying solely on this document.

---

# 50. Future Architecture Evolution

The architecture may evolve as the platform grows.

Potential future changes may include:

* Separate administrative frontend
* Background job processing
* Queue infrastructure
* Dedicated notification service
* Caching layer
* Dedicated real-time service
* Search infrastructure
* Analytics pipelines
* Additional client applications

These should not be introduced until requirements justify their operational and maintenance cost.

---

# 51. Related Documentation

* [`00-overview.md`](./00-overview.md) — Product overview and terminology
* [`01-product-requirements.md`](./01-product-requirements.md) — Product requirements
* [`26-roadmap.md`](./26-roadmap.md) — Development phases
* [`27-decisions.md`](./27-decisions.md) — Decision log

The next architecture documents are:

* `03-data-model.md`
* `04-auth-and-rbac.md`

Later documents will define individual domain modules and infrastructure concerns in greater detail.

---

# 52. Current Architecture Status

**Status: Initial Baseline**

The architecture is sufficiently defined to guide domain and data modelling.

The following areas remain intentionally unresolved:

* Authentication technology
* Detailed role and permission model
* Real-time transport
* Object storage provider
* Hosting providers
* Detailed API contracts
* Detailed database schema
* Frontend component architecture

These decisions will be made through the relevant design documents rather than being selected implicitly during implementation.
