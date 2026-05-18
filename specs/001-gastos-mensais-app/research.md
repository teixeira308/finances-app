# Research: Gastos Mensais Mobile

## State Management

**Decision**: Use Redux Toolkit as the primary application state layer.

**Rationale**: The feature set includes transaction mutations, monthly summaries,
filters, categories, onboarding state, and future sync metadata. Redux Toolkit keeps
these flows explicit, serializable, and easy to test across reducers, selectors, and
async flows.

**Alternatives considered**:
- Recoil: simpler for small local graphs, but less opinionated for complex offline and
  persistence workflows.

## UI Component System

**Decision**: Use React Native Paper for the shared UI system.

**Rationale**: It provides a stable component baseline, strong theme support for
light/dark mode, and enough structure for consistent form, list, and feedback
patterns without overcommitting the app to a broader design abstraction.

**Alternatives considered**:
- NativeBase: broader component catalog, but unnecessary abstraction for the initial
  scope and a heavier surface area to standardize.

## Charting

**Decision**: Use Victory Native XL for monthly visualizations.

**Rationale**: Reports require receitas-versus-despesas comparison and category-based
visualization with custom composition. Victory's composability is better suited to
dashboard and report growth than lighter canned chart kits.

**Alternatives considered**:
- React Native Chart Kit: faster to start, but less flexible for evolving report and
  dashboard needs.

## Local Database

**Decision**: Use SQLite via `expo-sqlite` for v1 persistence.

**Rationale**: The app needs structured local records, filters, summaries, and
predictable offline reads and writes. SQLite is sufficient for a single-user mobile
dataset and keeps operational complexity below WatermelonDB.

**Alternatives considered**:
- WatermelonDB: stronger for very large sync-heavy datasets, but unnecessary for the
  initial scope and adds heavier modeling overhead.

## Secure Storage

**Decision**: Use Expo Secure Store for sensitive metadata and key material, not as
the main transaction database.

**Rationale**: Secure Store is appropriate for protected tokens, encryption metadata,
and sensitive preferences, while SQLite remains the source of truth for structured
transaction and category data.

**Alternatives considered**:
- Persisting everything in Secure Store: too limited for relational queries and
  monthly aggregation needs.

## Cache Strategy

**Decision**: Use Async Storage only for non-sensitive UI cache and ephemeral
preferences.

**Rationale**: Filter presets, dismissed onboarding flags, and non-sensitive display
preferences benefit from lightweight cached access without complicating the source of
truth model.

**Alternatives considered**:
- Using Async Storage as the primary data store: insufficient for transaction-heavy
  querying and data integrity needs.

## Architecture

**Decision**: Use feature-first MVVM with isolated domains and a dedicated future sync
layer.

**Rationale**: Screens remain thin, view models coordinate UI state, domain services
hold finance rules, repositories encapsulate SQLite access, and the sync layer can be
introduced later without rewriting core transaction logic.

**Alternatives considered**:
- Screen-first folders: faster initially, but leads to repeated logic and poor
  separation as reporting and offline behavior grow.
- Monolithic service layer: simpler on day one, but creates high coupling between UI,
  persistence, and sync concerns.

## Testing Strategy

**Decision**: Use Jest for unit and state tests and React Native Testing Library for
screen and critical flow coverage.

**Rationale**: The constitution requires verification of money flows, UX states, and
offline behavior. This pairing covers calculation correctness, reducer behavior,
screen feedback, and input workflows without relying on manual QA alone.

**Alternatives considered**:
- UI-only testing: insufficient for finance calculations and offline state transitions.
- Unit-only testing: insufficient for screen-level confidence in onboarding, forms,
  and dashboard rendering.

## Quality Tooling

**Decision**: Enforce ESLint, Prettier, and Husky pre-commit checks.

**Rationale**: These provide consistent code style, early error detection, and a
shared baseline for a typed mobile codebase with multiple feature modules.

**Alternatives considered**:
- Manual formatting and ad hoc review: too inconsistent for a growing app with strong
  maintainability requirements.
