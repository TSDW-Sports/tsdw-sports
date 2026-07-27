# TSDW Sports Platform — Authentication & RBAC

## 1. Purpose

This document defines the authentication and authorisation model for the **TSDW Sports Platform**.

It establishes:

* Which users require authentication
* Authentication boundaries
* Roles
* Permissions
* Resource-scoped access
* Administrative access principles
* Scorekeeper access
* Account lifecycle expectations
* Relationship between committee positions and system access
* Security invariants

This document defines the **access-control model**.

The specific authentication provider or library remains intentionally deferred.

---

# 2. Core Principles

## 2.1 Authentication and Authorisation Are Separate

Authentication answers:

> Who is making this request?

Authorisation answers:

> Is this identity allowed to perform this operation?

A successfully authenticated user does not automatically receive administrative access.

---

## 2.2 Organisational Position Is Not System Permission

TSDW Sports positions such as:

* Secretary
* Joint Secretary
* Coordinator
* Member

represent organisational responsibilities.

They must not automatically determine application permissions.

Conceptually:

```text
CommitteeMember
      │
      │ organisational relationship
      ▼
CommitteeRole

User
      │
      │ security relationship
      ▼
RoleAssignment
      │
      ▼
Permissions
```

These systems may reference the same person, but they serve different purposes.

---

## 2.3 Least Privilege

Users should receive only the permissions necessary to perform their responsibilities.

A scorekeeper assigned to one competition should not automatically be able to:

* Edit other competitions
* Publish achievements
* Manage users
* Modify committee records
* Change platform configuration

---

## 2.4 Server-Side Enforcement

The API is the authoritative authorisation boundary.

The frontend may:

* Hide unavailable controls
* Disable unavailable actions
* Redirect unauthorised users

but these behaviours do not provide security.

Every protected backend operation must enforce authorisation independently.

---

## 2.5 Access Must Be Revocable

Administrative access must be removable without:

* Deleting historical records
* Deleting committee history
* Deleting audit records
* Modifying source code

---

## 2.6 Historical Actions Must Remain Attributable

If an administrator later leaves TSDW or loses access, historical audit records must continue to identify their previous actions.

---

# 3. User Categories

The platform conceptually has three broad categories of users.

## 3.1 Public Visitors

Examples:

* Students
* Faculty
* Spectators
* External visitors

They may access public sports information without authentication.

---

## 3.2 Administrative Users

Authenticated users who receive explicit platform permissions.

Examples may include:

* Developer / System Administrator
* Sports Administrator
* Secretary
* Organiser
* Scorekeeper

---

## 3.3 Participants

Participants are sports-domain identities.

A Participant does not automatically require a User account.

Future functionality may optionally associate:

```text
Participant
     │
     └── User
```

if persistent authenticated participant features become necessary.

---

# 4. Public Access

Authentication should not be required to access information intentionally published for public consumption.

Potential public information includes:

* Events
* Event editions
* Sports
* Fixtures
* Schedules
* Live scores
* Results
* Winners
* Standings
* TCET teams
* Achievements
* Committee information
* Historical archives
* Certificate verification

Public access must still respect publication and privacy rules.

---

# 5. Protected Access

Authentication is required for administrative operations.

Examples include:

* Creating events
* Editing event editions
* Managing competitions
* Creating fixtures
* Updating scores
* Finalising results
* Publishing winners
* Managing achievements
* Managing committee records
* Managing administrative access
* Issuing certificates
* Viewing protected operational data

Authentication alone is insufficient.

The user must also be authorised for the requested operation.

---

# 6. User

## Entity

`User`

## Purpose

Represents an authenticated platform identity.

Potential information includes:

* Internal identifier
* Display name
* Email or institutional identity
* Authentication identity reference
* Account status
* Created timestamp
* Last relevant access metadata

Authentication credentials should be owned by the selected authentication system rather than duplicated unnecessarily in application tables.

---

# 7. Account Status

Administrative accounts should support lifecycle state.

Potential states include:

```text
ACTIVE
SUSPENDED
DISABLED
```

Exact implementation may vary depending on the authentication provider.

A disabled account must not retain operational access merely because role assignments still exist.

---

# 8. Role-Based Access Control

The platform will use **Role-Based Access Control (RBAC)**.

Conceptually:

```text
User
  ↓
Role Assignment
  ↓
Role
  ↓
Permissions
```

A Role groups permissions that commonly belong together.

---

# 9. Resource-Scoped Access

RBAC alone is insufficient for operational roles such as scorekeepers.

Example:

```text
User: A

Role:
Scorekeeper

Scope:
TSpark 2027
→ Men's Football
```

This user should not automatically be able to score:

```text
TSpark 2027
→ Women's Volleyball
```

Therefore, the platform will support **scoped role assignments** where required.

---

# 10. Role Assignment

## Concept

`RoleAssignment`

A Role Assignment connects:

```text
User
+
Role
+
Optional Scope
```

Example:

```text
User
Rahul

Role
Scorekeeper

Scope
Competition: TSpark 2027 Men's Football
```

Another example:

```text
User
Sports Secretary

Role
Sports Administrator

Scope
Global
```

The exact physical schema will be determined during database implementation.

---

# 11. Scope Hierarchy

Potential access scopes include:

```text
GLOBAL
EVENT_EDITION
SPORT
COMPETITION
FIXTURE
```

Not every role needs every scope type.

A useful conceptual hierarchy is:

```text
Global
  │
  └── Event Edition
          │
          └── Competition
                  │
                  └── Fixture
```

Sport scope may operate separately where responsibilities are assigned by sport across multiple competitions.

---

# 12. Scope Inheritance

A broader scope may authorise operations on resources below it.

Example:

```text
Role:
Scorekeeper

Scope:
Competition A
```

may allow score updates for:

```text
Fixture 1
Fixture 2
Fixture 3
```

inside Competition A.

But not:

```text
Fixture 8
```

inside Competition B.

Scope inheritance must be evaluated by the backend rather than trusted from client input.

---

# 13. Initial Platform Roles

The following roles represent the initial conceptual access model.

They may evolve before implementation.

---

# 14. System Administrator

## Purpose

Highest-level technical administration.

Expected to be held by the developer or trusted technical maintainers.

## Potential Capabilities

* Full platform administration
* User access management
* Role assignment
* Platform configuration
* All sports operations
* Recovery and technical administration

## Scope

```text
GLOBAL
```

## Important Rule

System Administrator should be assigned very sparingly.

Routine sports operations should not require this role.

---

# 15. Sports Administrator

## Purpose

Provides broad operational control over TSDW Sports content and events without granting unnecessary technical/system privileges.

Potential users may include trusted senior organisers.

## Potential Capabilities

* Manage events and editions
* Manage sports
* Manage competitions
* Manage fixtures
* Manage results
* Manage winners
* Manage TCET teams
* Manage achievements
* Manage committee records
* Manage announcements
* Assign operational access where permitted

## Scope

Usually:

```text
GLOBAL
```

or potentially:

```text
EVENT_EDITION
```

depending on future requirements.

---

# 16. Event Manager

## Purpose

Provides broad management of a specific event edition without granting control over the entire sports platform.

Example:

```text
Role:
Event Manager

Scope:
TSpark 2027
```

Potential capabilities:

* Manage competitions
* Manage entrants
* Manage fixtures
* Manage venues
* Manage results
* Manage announcements
* Coordinate scorekeepers

but only within the assigned Event Edition.

This role is particularly useful when different teams manage different events.

---

# 17. Scorekeeper

## Purpose

Allows operational users to update match state and scores during active events.

Potential capabilities:

* View assigned fixtures
* Start fixture
* Update score
* Pause/resume where supported
* Complete fixture
* Submit result

Potential restrictions:

* Cannot create events
* Cannot manage users
* Cannot modify committee records
* Cannot publish achievements
* Cannot modify unrelated competitions

## Expected Scope

Usually:

```text
COMPETITION
```

or:

```text
FIXTURE
```

---

# 18. Content Manager

A separate content-oriented role may be introduced if TSDW requires users who manage public information but should not control competition operations.

Potential capabilities:

* Achievements
* TCET team information
* Committee information
* Event descriptions
* Announcements

This role is not required to exist in V1 unless operational responsibilities justify it.

---

# 19. Committee Titles

Committee titles should not be implemented as platform security roles.

For example:

```text
Committee Role:
Secretary
```

does not imply:

```text
System Role:
Sports Administrator
```

Instead, an authorised administrator explicitly assigns platform access.

Example:

```text
Person
Aarav

Committee Membership
Secretary — 2026–27

User Account
aarav@...

Role Assignment
Sports Administrator
```

When the committee tenure ends, the historical Committee Membership remains.

The Role Assignment can be revoked independently.

---

# 20. Why Committee and Security Roles Are Separate

Suppose:

```text
2026–27
Secretary: Person A
```

and later:

```text
2027–28
Secretary: Person B
```

The platform must preserve:

```text
Committee History
2026–27 → Person A → Secretary
```

while access becomes:

```text
Person A → revoked
Person B → granted
```

If committee position and security role were the same record, historical organisational information and current security state would become incorrectly coupled.

---

# 21. Permission Model

Roles should resolve to explicit capabilities.

Conceptual permission format:

```text
resource.action
```

Examples:

```text
event.read
event.create
event.update

competition.read
competition.create
competition.update

fixture.read
fixture.create
fixture.update
fixture.score.update
fixture.start
fixture.complete

result.read
result.create
result.finalize

achievement.create
achievement.update
achievement.publish

committee.manage

user.manage
role.assign
```

The final permission vocabulary will be defined alongside API operations.

---

# 22. Permissions Should Describe Capabilities

Permissions should describe what the user can do, not who the user is.

Prefer:

```text
fixture.score.update
```

over:

```text
secretary_access
```

This allows organisational structures to change without rewriting security logic.

---

# 23. Permission Evaluation

A protected operation should conceptually evaluate:

```text
Request
   ↓
Authenticated?
   ↓
Account Active?
   ↓
Relevant Role Assignment?
   ↓
Required Permission?
   ↓
Scope Includes Resource?
   ↓
Domain Operation Allowed?
   ↓
Execute
```

Authorisation and domain-state validation are separate.

A user may have permission to update fixtures but still be unable to update a fixture that is already finalised.

---

# 24. Example — Score Update

Request:

```text
PATCH /api/v1/fixtures/F123/score
```

Conceptual checks:

```text
Authenticated?
    ↓
User active?
    ↓
Has fixture.score.update?
    ↓
Assignment scope includes F123?
    ↓
Fixture state allows score update?
    ↓
Input valid?
    ↓
Persist update
    ↓
Audit
    ↓
Broadcast
```

---

# 25. Example — Event Manager

User:

```text
Role:
Event Manager

Scope:
TSpark 2027
```

Request:

```text
Create fixture
```

Target:

```text
TSpark 2027
Men's Football
```

Result:

```text
Allowed
```

Request:

```text
Edit Reflex 2027 competition
```

Result:

```text
Denied
```

even though both resources belong to TSDW Sports.

---

# 26. Example — System Administrator

User:

```text
Role:
System Administrator

Scope:
GLOBAL
```

The role may access all administrative resources.

However, domain validation still applies.

System Administrator should not bypass database integrity rules simply because the user has full permissions.

---

# 27. Multiple Role Assignments

A User may have multiple assignments.

Example:

```text
User A

Event Manager
→ Reflex 2027

Scorekeeper
→ TSpark 2027 Men's Football
```

Effective permissions are derived from applicable assignments for the target resource.

---

# 28. Role Assignment Lifecycle

Role assignments should support:

* Creation
* Activation
* Revocation

Potentially:

* Start timestamp
* Expiry timestamp

Temporary access may be useful for event-day staff.

Example:

```text
Scorekeeper
TSpark 2027
Valid during event operations
```

The exact expiry mechanism will be decided during implementation.

---

# 29. Revocation

Removing access must not remove historical evidence of the user or their actions.

Example:

```text
User A
Scorekeeper
2027
```

After the event:

```text
Role Assignment → Revoked
```

Audit records remain.

---

# 30. Account Deletion

Administrative users should generally be disabled rather than physically deleted when they have historical activity.

This preserves:

* Audit attribution
* Operational history
* Security investigation context

Hard deletion should be restricted to cases where retention is unnecessary and safe.

---

# 31. Initial Administrator Bootstrap

The platform requires a secure mechanism for establishing the first System Administrator.

The exact mechanism depends on the selected authentication technology.

Potential approaches include:

* Controlled seed
* Environment-based bootstrap
* Administrative setup process

The mechanism must not leave a permanent public setup endpoint.

---

# 32. Creating Administrative Users

Administrative access should not be publicly self-service.

Potential workflow:

```text
Existing Authorised Admin
       ↓
Invite / Register Identity
       ↓
Create User
       ↓
Assign Role
       ↓
Assign Scope
       ↓
User Receives Access
```

The exact onboarding flow depends on authentication-provider capabilities.

---

# 33. Public Registration

V1 should not expose general public account registration unless a concrete feature requires it.

The public website does not require accounts for ordinary sports information.

Future participant authentication may introduce a separate onboarding flow.

---

# 34. Participant Authentication

Participant accounts are deferred.

If later required, authentication may support capabilities such as:

* Registration management
* Certificate access
* Personal participation history
* Team management

Participant authentication must not automatically grant administrative permissions.

---

# 35. Certificate Access

Certificate verification is public.

Certificate download may use an appropriate verification mechanism rather than requiring permanent participant accounts.

Potential approaches will be evaluated in `14-certificates.md`.

---

# 36. Authentication Provider Requirements

Although the provider remains undecided, the selected system should support the platform's required identity model.

Important requirements include:

* Secure authentication
* Session management
* Account revocation
* Server-side identity verification
* Compatibility with Next.js
* Compatibility with independent Fastify API
* Administrative onboarding
* Reasonable operational ownership

Optional capabilities may include:

* Institutional email restriction
* OAuth
* Passwordless login
* Multi-factor authentication

These are not yet accepted requirements.

---

# 37. Authentication Architecture

Conceptually:

```text
Browser
   │
   ▼
Authentication
   │
   ▼
Authenticated Identity
   │
   ▼
Web Application
   │
   ▼
API Request
   │
   ▼
API verifies identity
   │
   ▼
Application User
   │
   ▼
RBAC
```

The API must be able to verify authenticated requests independently.

---

# 38. Session Trust

The API must not trust user-provided claims such as:

```text
role = "ADMIN"
```

merely because they are sent by the frontend.

Security-sensitive identity and permission information must come from trusted server-side verification and authoritative platform records.

---

# 39. Role Data Ownership

Application roles, permissions, and scopes belong to the TSDW Sports application.

The authentication provider may establish identity.

It should not become the sole source of truth for domain-specific permissions unless a future decision explicitly establishes that architecture.

Conceptually:

```text
Authentication Provider
        ↓
     Identity
        ↓
Application User
        ↓
Role Assignments
        ↓
Permissions
```

---

# 40. Public vs Administrative Routes

Frontend routes may conceptually separate:

```text
/
├── events
├── sports
├── fixtures
├── achievements
└── ...

/admin
├── dashboard
├── events
├── fixtures
├── achievements
└── ...
```

The `/admin` route structure is a presentation boundary.

It is not the security boundary.

The API remains authoritative.

---

# 41. Administrative UI Behaviour

The admin interface should reflect effective permissions.

Example:

A Scorekeeper may see:

```text
Dashboard
Assigned Fixtures
Live Scoring
```

but not:

```text
Users
Committee Management
Platform Configuration
```

This improves usability and reduces accidental actions.

Backend checks remain mandatory regardless of frontend visibility.

---

# 42. Sensitive Operations

Some operations may require stronger restrictions.

Examples:

* Assigning System Administrator
* Revoking administrator access
* Finalising results
* Correcting final results
* Deleting published records
* Revoking certificates

Such operations may eventually require:

* Specific permissions
* Confirmation
* Audit metadata
* Reason for change

Detailed rules belong to their respective domain documents.

---

# 43. Final Result Corrections

Completed/finalised results should not be silently editable like ordinary draft content.

A future correction workflow may resemble:

```text
Final Result
     ↓
Correction Requested
     ↓
Authorised User
     ↓
Reason Required
     ↓
Correct Result
     ↓
Audit Previous + New State
```

The exact workflow will be defined in `07-fixtures-and-tournaments.md`.

---

# 44. Audit Requirements

Security-relevant operations should be auditable.

Examples include:

* User created
* User disabled
* Role assigned
* Role revoked
* Scope changed
* Score updated
* Result finalised
* Final result corrected
* Certificate issued
* Certificate revoked

Audit records should identify the authenticated actor where applicable.

---

# 45. Permission Changes

Changes to permissions or role assignments should themselves be protected.

A user should not be able to grant permissions beyond what their own role allows unless explicitly authorised.

The exact delegation model will be defined when user-management workflows are designed.

---

# 46. Default Deny

When permission evaluation is uncertain, the system should deny the protected operation.

Conceptually:

```text
Explicitly allowed?
    │
   Yes → continue
    │
    No
    ↓
   DENY
```

Protected functionality should not depend on explicit deny lists.

---

# 47. Unknown Roles

Unknown or removed roles must not accidentally inherit permissions.

If a role definition becomes invalid, access should fail safely.

---

# 48. Permission Caching

Permission information may eventually be cached for performance.

However:

* Revocation must propagate reliably.
* Cached permissions must not become an independent source of truth.
* Security correctness takes priority over avoiding a small database lookup.

No permission-caching architecture is currently required.

---

# 49. Scope Resolution

The backend should resolve scope from authoritative resource relationships.

Example:

```text
Fixture F123
   ↓
Competition C8
   ↓
EventEdition E4
```

If a user has:

```text
Event Manager
Scope: E4
```

the system can determine that F123 falls within the assignment.

The client should not need to claim:

```text
eventEditionId = E4
```

for authorisation to succeed.

---

# 50. Security Invariants

### AUTH-001

Public information must not require authentication unless a specific requirement says otherwise.

### AUTH-002

Authentication alone must not grant administrative access.

### AUTH-003

Every protected API operation must enforce authorisation server-side.

### AUTH-004

Committee position must not automatically grant application permissions.

### AUTH-005

Participant identity must not automatically imply a User account.

### AUTH-006

Administrative access must be revocable independently from historical organisational records.

### AUTH-007

Role assignments may be scoped to platform resources.

### AUTH-008

Users must not modify resources outside their effective scope.

### AUTH-009

Disabled accounts must not retain protected access.

### AUTH-010

Historical audit attribution must survive role revocation and account deactivation.

### AUTH-011

The frontend must not be trusted as an authorisation boundary.

### AUTH-012

Unknown or ambiguous protected access must default to denial.

### AUTH-013

Authentication-provider identity must not be treated as application permission.

### AUTH-014

System Administrator access must be limited to trusted technical administrators.

---

# 51. Initial Access Matrix

The following matrix is conceptual and will evolve with detailed module requirements.

| Capability                     | System Admin | Sports Admin |   Event Manager   |   Scorekeeper  | Public |
| ------------------------------ | :----------: | :----------: | :---------------: | :------------: | :----: |
| View published sports data     |       ✓      |       ✓      |         ✓         |        ✓       |    ✓   |
| Access admin interface         |       ✓      |       ✓      |         ✓         |        ✓       |    —   |
| Manage all events              |       ✓      |       ✓      |         —         |        —       |    —   |
| Manage assigned event          |       ✓      |       ✓      |         ✓         |        —       |    —   |
| Manage competitions            |       ✓      |       ✓      |       Scoped      |        —       |    —   |
| Manage fixtures                |       ✓      |       ✓      |       Scoped      | Scoped/limited |    —   |
| Update live scores             |       ✓      |       ✓      |       Scoped      |     Scoped     |    —   |
| Finalise results               |       ✓      |       ✓      |       Scoped      |     Limited    |    —   |
| Manage achievements            |       ✓      |       ✓      | Scoped if granted |        —       |    —   |
| Manage committee               |       ✓      |       ✓      |         —         |        —       |    —   |
| Manage platform users          |       ✓      |    Limited   |         —         |        —       |    —   |
| Assign System Admin            |       ✓      |       —      |         —         |        —       |    —   |
| Manage technical configuration |       ✓      |       —      |         —         |        —       |    —   |

`Scoped` means access depends on the user's Role Assignment.

This table is not a substitute for backend permission checks.

---

# 52. Authentication Technology Decision

Authentication technology remains **Deferred**.

Before selecting a provider, candidates should be evaluated against:

1. Independent Fastify API compatibility
2. Next.js integration
3. Server-side session/token verification
4. Administrative user onboarding
5. Account disabling/revocation
6. Security maintenance
7. Institutional ownership
8. Cost
9. Deployment constraints
10. Future participant authentication requirements

The provider should serve the architecture rather than dictate the application's permission model.

---

# 53. Decisions Established by This Document

This document establishes that:

* Authentication and authorisation are separate.
* Public visitors do not require accounts.
* Participants do not require accounts by default.
* Administrative users require explicit access.
* RBAC will be used.
* Role assignments may carry resource scope.
* Committee positions and security roles are independent.
* The API is the authoritative permission boundary.
* Application permissions remain controlled by the application.
* Access revocation must preserve historical records.
* Protected operations default to denial.

These decisions should be reflected in `27-decisions.md` where they represent significant architectural commitments.

---

# 54. Open Questions

## OQ-AUTH-001 — Administrative Identity

Should administrative accounts initially be restricted to TCET-issued or approved email addresses?

---

## OQ-AUTH-002 — Account Provisioning

Should administrators be invited by email, manually created, or provisioned through an institutional identity system?

---

## OQ-AUTH-003 — Multi-Factor Authentication

Should System Administrator or other privileged accounts require MFA?

---

## OQ-AUTH-004 — Event Manager Delegation

Should Event Managers be allowed to assign Scorekeepers within their own event scope?

---

## OQ-AUTH-005 — Scorekeeper Result Authority

Should Scorekeepers be allowed to finalise official results, or only submit scores for approval?

---

## OQ-AUTH-006 — Temporary Access

Should operational role assignments automatically expire after an event edition ends?

---

## OQ-AUTH-007 — Participant Accounts

If participant accounts are introduced later, which identity mechanism should link institutional students to Participant records?

---

# 55. V1 Authentication Scope

V1 requires:

```text
Administrative Authentication
        ↓
User
        ↓
Role Assignment
        ↓
Permission
        ↓
Optional Resource Scope
        ↓
Protected API Operation
```

At minimum, V1 should support:

* System Administrator
* Sports Administrator
* Event Manager
* Scorekeeper

Additional roles should only be introduced when real responsibilities justify them.

---

# 56. Deferred Capabilities

The following are not currently required for the initial authentication system:

* Public user accounts
* Social profiles
* Participant dashboards
* Student self-registration accounts
* Complex organisational hierarchies
* Enterprise SSO
* Multi-organisation tenancy

They may be introduced later if requirements change.

---

# 57. Related Documentation

* [`01-product-requirements.md`](./01-product-requirements.md) — Product requirements
* [`02-system-architecture.md`](./02-system-architecture.md) — System boundaries
* [`03-data-model.md`](./03-data-model.md) — Identity and domain entities
* [`27-decisions.md`](./27-decisions.md) — Architectural decision log

Future relevant documents include:

* `07-fixtures-and-tournaments.md`
* `08-live-scoring.md`
* `18-admin-dashboard.md`
* `21-audit-logs.md`
* `22-api-design.md`
* `23-security.md`

---

# 58. Current Status

**Status: Initial Baseline**

The access-control model is sufficiently defined to continue detailed domain design.

Authentication technology remains intentionally deferred until implementation requirements and deployment constraints are clearer.
