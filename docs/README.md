# TSDW Sports Platform — Documentation

This directory contains the product, architecture, domain, engineering, and operational documentation for the **TSDW Sports Platform**.

The documentation is maintained alongside the source code so that product requirements, architectural decisions, and implementation remain aligned as the platform evolves.

---

## Documentation Index

### Product

| Document                                                     | Purpose                                                | Status           |
| ------------------------------------------------------------ | ------------------------------------------------------ | ---------------- |
| [`00-overview.md`](./00-overview.md)                         | Product context, vision, scope, users, and terminology | Complete         |
| [`01-product-requirements.md`](./01-product-requirements.md) | Functional and non-functional product requirements     | Initial baseline |
| [`26-roadmap.md`](./26-roadmap.md)                           | Development phases, priorities, and release scope      | Initial baseline |
| [`27-decisions.md`](./27-decisions.md)                       | Product and architecture decision log                  | Active           |

### Architecture

| Document                    | Purpose                                              | Status           |
| --------------------------- | ---------------------------------------------------- | ---------------- |
| `02-system-architecture.md` | Overall application and infrastructure architecture  | Initial baseline |
| `03-data-model.md`          | Core entities, relationships, and data ownership     | Initial baseline |
| `04-auth-and-rbac.md`       | Authentication, roles, permissions, and access scope | Initial baseline |

### Platform Modules

| Document                            | Purpose                                                | Status           |
| ----------------------------------- | ------------------------------------------------------ | ---------------- |
| `05-events-and-seasons.md`          | Events, editions, academic periods, and lifecycle      | Initial baseline |
| `06-sports-and-competitions.md`     | Sports, categories, competitions, and formats          | Initial baseline |
| `07-fixtures-and-tournaments.md`    | Fixtures, match states, brackets, and progression      | Planned |
| `08-live-scoring.md`                | Live match updates and scoring architecture            | Planned |
| `09-teams-and-participants.md`      | Competition teams, rosters, and participants           | Planned |
| `10-departments-and-standings.md`   | Department participation, points, and standings        | Planned |
| `11-tcet-teams.md`                  | Official TCET sports teams and historical rosters      | Planned |
| `12-achievements.md`                | Team and individual sports achievements                | Planned |
| `13-committee.md`                   | TSDW Sports committee tenures and roles                | Planned |
| `14-certificates.md`                | Certificate generation, distribution, and verification | Planned |
| `15-registrations.md`               | Team and participant registration workflows            | Planned |
| `16-venues-and-checkin.md`          | Venues, schedules, and event check-in                  | Planned |
| `17-announcements-notifications.md` | Event announcements and future notifications           | Planned |
| `18-admin-dashboard.md`             | Administrative workflows and interfaces                | Planned |
| `19-public-website.md`              | Public information architecture and user experience    | Planned |
| `20-sports-archive.md`              | Historical sports records and archive navigation       | Planned |
| `21-audit-logs.md`                  | Administrative action and data-change history          | Planned |

### Engineering

| Document                 | Purpose                                           | Status  |
| ------------------------ | ------------------------------------------------- | ------- |
| `22-api-design.md`       | API conventions, resources, errors, and contracts | Planned |
| `23-security.md`         | Security requirements and threat considerations   | Planned |
| `24-deployment.md`       | Environments, hosting, deployment, and recovery   | Planned |
| `25-testing-strategy.md` | Testing levels, tooling, and critical scenarios   | Planned |

---

## Reading Order

For understanding the project from scratch:

```text
00-overview.md
      ↓
01-product-requirements.md
      ↓
26-roadmap.md
      ↓
27-decisions.md
      ↓
02-system-architecture.md
      ↓
03-data-model.md
      ↓
04-auth-and-rbac.md
      ↓
Domain-specific documentation
```

The overview explains **what the platform is**.

The requirements define **what it must do**.

The roadmap defines **when capabilities are introduced**.

The decision log explains **why significant choices were made**.

Architecture and domain documents define **how the system is designed to satisfy those requirements**.

---

## Documentation Principles

### Documentation Is Part of the Project

Documentation should evolve alongside implementation rather than being reconstructed after development.

### Decisions Should Be Traceable

Significant product and technical decisions should be recorded in [`27-decisions.md`](./27-decisions.md).

### Requirements Should Be Referenced

Architecture, implementation, tests, and issues may reference requirement identifiers from [`01-product-requirements.md`](./01-product-requirements.md).

Example:

```text
FR-SCR-002 — Score Updates
```

### Avoid Duplicate Sources of Truth

Detailed information should have one primary document.

Other documents should reference it rather than maintaining conflicting copies.

### Document Current Intent

Documentation should describe the system as currently intended.

Historical architectural decisions should remain available through the decision log.

### Unknowns Should Remain Explicit

When operational requirements are unknown, they should be recorded as open questions rather than replaced with assumptions.

---

## Document Status

Documents may use the following general lifecycle:

```text
Planned
   ↓
Draft
   ↓
Initial Baseline
   ↓
Active
```

**Planned** — document has not yet been created.

**Draft** — actively being designed and not yet reliable as a specification.

**Initial Baseline** — sufficiently defined to guide initial development but expected to evolve.

**Active** — maintained as an ongoing source of truth.

A document does not need to become permanently "Complete." Most technical documentation evolves with the platform.

---

## Current Project Phase

The project is currently in:

**Stage 0 — Product Planning**

Completed foundation documents:

* Project Overview
* Product Requirements
* Product Roadmap
* Decision Log

The next major documentation milestone is:

**System Architecture**

This will establish the technical boundaries of the platform before implementation begins.

---

## Contributing to Documentation

When changing platform behaviour:

1. Determine whether an existing requirement is affected.
2. Update the relevant domain or engineering documentation.
3. Record significant design decisions in the decision log.
4. Keep examples consistent with current terminology.
5. Avoid silently changing previously established architectural intent.

Documentation changes should be committed alongside or before the implementation they describe.

---

## Project Documentation Structure

```text
docs/
├── README.md
├── 00-overview.md
├── 01-product-requirements.md
├── 02-system-architecture.md
├── 03-data-model.md
├── 04-auth-and-rbac.md
├── 05-events-and-seasons.md
├── 06-sports-and-competitions.md
├── 07-fixtures-and-tournaments.md
├── 08-live-scoring.md
├── 09-teams-and-participants.md
├── 10-departments-and-standings.md
├── 11-tcet-teams.md
├── 12-achievements.md
├── 13-committee.md
├── 14-certificates.md
├── 15-registrations.md
├── 16-venues-and-checkin.md
├── 17-announcements-notifications.md
├── 18-admin-dashboard.md
├── 19-public-website.md
├── 20-sports-archive.md
├── 21-audit-logs.md
├── 22-api-design.md
├── 23-security.md
├── 24-deployment.md
├── 25-testing-strategy.md
├── 26-roadmap.md
└── 27-decisions.md
```

Documents should be created when their subject reaches the design stage rather than creating empty files solely to match this structure.
