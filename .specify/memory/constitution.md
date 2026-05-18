<!--
Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Modified principles:
  - I. Code Quality Is the Baseline -> I. React Native Code Must Stay Modular and Typed
  - II. Tests Prove Behavior -> II. Every Money Flow Must Be Verified
  - III. User Experience Must Stay Consistent -> III. Fast and Consistent Mobile UX Is Mandatory
  - IV. Performance Budgets Are Requirements -> IV. Offline-First Consistency and Performance Are Product Requirements
  - V. Changes Must Be Small, Observable, and Reviewable -> V. Security and Privacy Are Built Into the Default Flow
- Added sections:
  - Product Guardrails
  - Delivery Workflow
- Removed sections:
  - Delivery Standards
  - Review and Release Workflow
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ pending .specify/templates/commands/*.md (directory not present in this repository)
- Follow-up TODOs:
  - None
-->
# Gastos Mensais Mobile Constitution

## Core Principles

### I. React Native Code Must Stay Modular and Typed
Application code MUST separate presentation, state management, domain logic, and
storage or sync concerns so transaction behavior can be tested without rendering a
screen. TypeScript strictness, linting, and formatting MUST pass before merge.
Reusable UI primitives, navigation contracts, and data models MUST be explicit, and
new abstractions MUST be justified by active duplication or measurable complexity.
Rationale: finance features evolve quickly, and loosely structured mobile code becomes
unsafe and expensive to change.

### II. Every Money Flow Must Be Verified
Every change affecting transaction entry, categorization, totals, reports, sync, or
settings MUST include automated tests that prove the expected behavior. Unit tests
MUST cover money calculations and validation rules, integration tests MUST cover
storage and sync boundaries, and end-to-end or screen-flow tests MUST cover primary
user journeys on mobile. Regression tests MUST be added for every bug involving data
loss, incorrect totals, or stale UI state. Rationale: incorrect financial behavior
breaks user trust immediately.

### III. Fast and Consistent Mobile UX Is Mandatory
The app MUST let a user record a standard expense in 10 seconds or less under normal
conditions, using clear navigation across Dashboard, Transaction Entry, Reports, and
Settings. Every user-facing flow MUST define loading, empty, success, validation
error, and sync-conflict states, and MUST behave consistently on supported Android
and iOS devices. Monthly summaries and charts MUST present receitas versus despesas in
language and visuals that match the product system. Rationale: budgeting apps fail
when speed, clarity, or consistency degrade.

### IV. Offline-First Consistency and Performance Are Product Requirements
Transaction creation, local edits, and monthly dashboard reads MUST work without a
network connection and MUST reconcile deterministically when connectivity returns.
Each feature MUST define measurable mobile performance budgets, including screen load,
input responsiveness, and synchronization latency where relevant. Regressions that
cause visible jank, data inconsistency, or failed offline recovery MUST block release
until fixed or explicitly waived with a mitigation plan. Rationale: this product is
expected to be reliable in real-world mobile conditions, not only on ideal networks.

### V. Security and Privacy Are Built Into the Default Flow
Locally stored financial data MUST be encrypted at rest using platform-appropriate
storage mechanisms, and sensitive data MUST never be logged in plaintext. Features
MUST minimize personal data collection, document data handling boundaries, and leave
clear extension points for future secure authentication such as OAuth or biometrics
without exposing secrets today. Any privacy or security exception MUST be reviewed,
documented, time-bounded, and tracked to closure before release. Rationale: expense
data is sensitive, and privacy failures are product failures.

## Product Guardrails

- Specifications MUST describe the mobile journey for capture, review, reporting,
  settings, offline behavior, and error recovery where relevant.
- Plans MUST name the React Native architecture choices, local storage approach,
  sync model, encryption strategy, and the test layers required by the feature.
- Tasks MUST include validation of Android and iOS behavior, UX state handling,
  performance verification, and privacy or security checks when the work touches data.
- Releases MUST not knowingly ship incorrect totals, broken offline entry, missing
  encryption for persisted financial data, or critical accessibility regressions in
  modified screens.

## Delivery Workflow

- Constitution compliance MUST be checked during specification, planning,
  implementation, and review.
- Code review MUST reject changes that weaken financial correctness, mobile UX
  consistency, offline reliability, or data protection.
- Manual QA is required for changed primary mobile journeys, but it MUST supplement
  automated coverage rather than replace it.
- Any exception MUST document the constraint, approver, mitigation, and follow-up
  task before merge or release.

## Governance

This constitution overrides conflicting local habits and informal process notes. Any
amendment MUST be documented in `.specify/memory/constitution.md`, synchronized with
the plan, spec, and tasks templates, and include a semantic version bump rationale.
MAJOR versions apply to removed or materially redefined principles, MINOR versions
apply to new principles or materially expanded sections, and PATCH versions apply to
clarifications that do not change obligations. Compliance reviews MUST occur for
every implementation plan and every merge review that affects app behavior or data.

**Version**: 2.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
