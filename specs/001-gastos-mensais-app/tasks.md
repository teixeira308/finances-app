# Tasks: Gastos Mensais Mobile

**Input**: Design documents from `/specs/001-gastos-mensais-app/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Every user story and every bug fix MUST include the
test tasks needed to prove behavior, plus regression coverage for defects.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile**: `app/src/`, `app/tests/`, optional `backend/src/`
- Paths below follow the React Native structure defined in `plan.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and shared developer tooling

- [X] T001 Create the React Native app structure and feature-first directories in app/src/ and app/tests/
- [X] T002 Initialize project dependencies and scripts in app/package.json
- [X] T003 [P] Configure TypeScript, Expo, and module path aliases in app/tsconfig.json and app/babel.config.js
- [X] T004 [P] Configure ESLint and Prettier rules for the mobile app in app/.eslintrc.cjs and app/.prettierrc
- [X] T005 [P] Configure Husky pre-commit lint hooks in .husky/pre-commit and app/package.json
- [X] T006 [P] Configure Jest and React Native Testing Library in app/jest.config.ts and app/tests/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Set up the root navigation shell and typed route contracts in app/src/navigation/index.tsx and app/src/navigation/routes.ts
- [X] T008 [P] Set up the app theme system for light and dark modes in app/src/theme/index.ts and app/src/theme/paper-theme.ts
- [X] T009 [P] Create the Redux Toolkit store, typed hooks, and shared state bootstrapping in app/src/store/index.ts, app/src/store/rootReducer.ts, and app/src/store/hooks.ts
- [X] T010 [P] Implement the SQLite database bootstrap and table schema for transactions, categories, goals, onboarding, and sync metadata in app/src/storage/sqlite/database.ts and app/src/storage/sqlite/migrations.ts
- [X] T011 [P] Implement secure storage and non-sensitive cache adapters in app/src/storage/secure/secureStore.ts and app/src/storage/cache/asyncStorage.ts
- [X] T012 [P] Create shared domain models and validation schemas for transactions, categories, goals, and summaries in app/src/shared/models/finance.ts and app/src/shared/validation/financeSchemas.ts
- [X] T013 Implement repository interfaces and base SQLite repositories in app/src/storage/repositories/transactionRepository.ts, app/src/storage/repositories/categoryRepository.ts, and app/src/storage/repositories/goalRepository.ts
- [X] T014 [P] Implement safe logging, error mapping, and privacy redaction helpers in app/src/shared/utils/logger.ts and app/src/shared/utils/errorMapper.ts
- [X] T015 Implement the future sync boundary and sync status model scaffolding in app/src/sync/syncService.ts and app/src/sync/syncTypes.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Registrar Transacoes Rapidamente (Priority: P1) 🎯 MVP

**Goal**: Let the user create income and expense transactions quickly while keeping the monthly balance and recent history accurate offline.

**Independent Test**: Create one income and one expense with category, date, time, and optional note; verify both save offline, appear in recent transactions, and update the monthly balance correctly.

### Tests for User Story 1 ⚠️

- [X] T016 [P] [US1] Add unit tests for transaction validation, balance calculations, and reducer behavior in app/tests/unit/transactions/transactionLogic.test.ts
- [X] T017 [P] [US1] Add integration tests for transaction persistence and offline retrieval in app/tests/integration/transactions/transactionRepository.test.ts
- [X] T018 [P] [US1] Add UI tests for transaction creation and inline validation in app/tests/ui/transactions/transactionEntryScreen.test.tsx

### Implementation for User Story 1

- [X] T019 [P] [US1] Implement the transaction domain service and selectors in app/src/features/transactions/services/transactionService.ts and app/src/features/transactions/selectors/transactionSelectors.ts
- [X] T020 [P] [US1] Implement the transactions Redux slice and async actions in app/src/features/transactions/store/transactionsSlice.ts
- [X] T021 [P] [US1] Build the transaction form fields and reusable amount/category inputs in app/src/features/transactions/components/TransactionForm.tsx and app/src/features/transactions/components/AmountInput.tsx
- [X] T022 [US1] Implement the transaction entry screen flow in app/src/screens/TransactionEntryScreen.tsx
- [X] T023 [US1] Implement the recent transactions list component and monthly balance card in app/src/features/dashboard/components/RecentTransactionList.tsx and app/src/features/dashboard/components/MonthlyBalanceCard.tsx
- [X] T024 [US1] Wire transaction save success, validation error, and persistence failure feedback in app/src/features/transactions/viewmodels/useTransactionEntryViewModel.ts
- [X] T025 [US1] Verify rapid-entry performance and offline save behavior in app/tests/integration/transactions/transactionPerformance.test.ts

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Consultar Historico e Relatorios (Priority: P2)

**Goal**: Allow the user to review monthly history and understand spending patterns through filters and charts.

**Independent Test**: Seed known transactions, apply period and category filters, and confirm the dashboard, history list, and reports show matching totals and chart values.

### Tests for User Story 2 ⚠️

- [X] T026 [P] [US2] Add unit tests for summary aggregation, filter logic, and chart mapping in app/tests/unit/reports/reportSelectors.test.ts
- [X] T027 [P] [US2] Add integration tests for filtered history queries and monthly summary generation in app/tests/integration/reports/reportRepository.test.ts
- [X] T028 [P] [US2] Add UI tests for dashboard and reports filtering states in app/tests/ui/reports/reportsScreen.test.tsx

### Implementation for User Story 2

- [X] T029 [P] [US2] Implement monthly summary and report aggregation services in app/src/features/reports/services/reportService.ts and app/src/features/dashboard/services/dashboardService.ts
- [X] T030 [P] [US2] Implement reports and history Redux slices with filter state in app/src/features/reports/store/reportsSlice.ts and app/src/features/dashboard/store/dashboardSlice.ts
- [X] T031 [P] [US2] Build shared filter controls and empty-state components in app/src/features/reports/components/PeriodFilter.tsx and app/src/shared/ui/EmptyState.tsx
- [X] T032 [US2] Implement the dashboard screen with monthly chart and recent summaries in app/src/screens/DashboardScreen.tsx
- [X] T033 [US2] Implement the reports screen with category chart, totals, and filters in app/src/screens/ReportsScreen.tsx
- [X] T034 [US2] Implement the transaction history list and filtered query view in app/src/features/transactions/components/TransactionHistoryList.tsx
- [X] T035 [US2] Verify dashboard load time, filter responsiveness, and offline read behavior in app/tests/integration/reports/reportPerformance.test.ts

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Gerenciar Categorias e Metas (Priority: P3)

**Goal**: Let the user personalize categories and define monthly spending goals that appear in the monthly context.

**Independent Test**: Create and edit a custom category, use it in a transaction, define a monthly goal, and verify the goal progress reflects current expenses without breaking existing reports.

### Tests for User Story 3 ⚠️

- [X] T036 [P] [US3] Add unit tests for category uniqueness, category deletion rules, and goal progress calculations in app/tests/unit/settings/categoryGoalLogic.test.ts
- [X] T037 [P] [US3] Add integration tests for category persistence, in-use deactivation, and goal storage in app/tests/integration/settings/categoryGoalRepository.test.ts
- [X] T038 [P] [US3] Add UI tests for category management and goal configuration flows in app/tests/ui/settings/categoriesAndGoalsScreen.test.tsx

### Implementation for User Story 3

- [X] T039 [P] [US3] Implement category and goal domain services in app/src/features/categories/services/categoryService.ts and app/src/features/settings/services/goalService.ts
- [X] T040 [P] [US3] Implement category and goal Redux slices in app/src/features/categories/store/categoriesSlice.ts and app/src/features/settings/store/goalsSlice.ts
- [X] T041 [P] [US3] Build category form, icon picker, and color picker components in app/src/features/categories/components/CategoryForm.tsx, app/src/features/categories/components/IconPicker.tsx, and app/src/features/categories/components/ColorPicker.tsx
- [X] T042 [P] [US3] Build the monthly goal form and progress card in app/src/features/settings/components/MonthlyGoalForm.tsx and app/src/features/dashboard/components/GoalProgressCard.tsx
- [X] T043 [US3] Implement the categories management screen in app/src/screens/CategoriesScreen.tsx
- [X] T044 [US3] Implement the settings screen sections for monthly goals and future sync preferences in app/src/screens/SettingsScreen.tsx
- [X] T045 [US3] Integrate category lifecycle handling into transaction entry and reporting flows in app/src/features/transactions/viewmodels/useTransactionEntryViewModel.ts and app/src/features/reports/services/reportService.ts
- [X] T046 [US3] Verify goal progress accuracy, category reuse, and privacy-safe behavior in app/tests/integration/settings/categoryGoalBehavior.test.ts

**Checkpoint**: User Stories 1, 2, and 3 should all work independently

---

## Phase 6: User Story 4 - Iniciar o App sem Bloqueio (Priority: P4)

**Goal**: Give first-time users a short onboarding path that explains the app and allows immediate local usage without mandatory login.

**Independent Test**: Launch the app on a clean install, complete or skip onboarding, and confirm the app opens to local usage without requiring authentication and does not re-show onboarding after completion.

### Tests for User Story 4 ⚠️

- [X] T047 [P] [US4] Add unit tests for onboarding completion state and first-run gating in app/tests/unit/onboarding/onboardingState.test.ts
- [X] T048 [P] [US4] Add integration tests for onboarding persistence across app restarts in app/tests/integration/onboarding/onboardingPersistence.test.ts
- [X] T049 [P] [US4] Add UI tests for onboarding progression and skip-to-local behavior in app/tests/ui/onboarding/onboardingScreen.test.tsx

### Implementation for User Story 4

- [X] T050 [P] [US4] Implement onboarding state service and persistence adapter in app/src/features/onboarding/services/onboardingService.ts and app/src/features/onboarding/store/onboardingSlice.ts
- [X] T051 [P] [US4] Build onboarding step components and copy container in app/src/features/onboarding/components/OnboardingPager.tsx and app/src/features/onboarding/components/OnboardingStep.tsx
- [X] T052 [US4] Implement the onboarding screen and skip flow in app/src/screens/OnboardingScreen.tsx
- [X] T053 [US4] Wire first-run navigation gating between onboarding and dashboard in app/src/navigation/AppNavigator.tsx
- [X] T054 [US4] Verify onboarding-to-local entry timing and theme parity in app/tests/integration/onboarding/onboardingExperience.test.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T055 [P] Add accessibility and theme contrast refinements across shared UI components in app/src/shared/ui/ and app/src/theme/
- [X] T056 Add redacted diagnostics, user-safe sync status messaging, and failure telemetry hooks in app/src/shared/utils/logger.ts and app/src/sync/syncService.ts
- [X] T057 [P] Add additional regression coverage for cross-feature finance flows in app/tests/unit/regressions/financeRegression.test.ts
- [X] T058 Validate the quickstart end-to-end scenario and update docs in specs/001-gastos-mensais-app/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, starts immediately
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories
- **User Story 1 (Phase 3)**: Starts after Foundational completion
- **User Story 2 (Phase 4)**: Starts after Foundational completion and depends on transaction data paths from US1 for realistic validation
- **User Story 3 (Phase 5)**: Starts after Foundational completion and integrates with transaction and report flows from US1 and US2
- **User Story 4 (Phase 6)**: Starts after Foundational completion and can proceed in parallel with later stories once navigation shell exists
- **Polish (Phase 7)**: Depends on completion of all desired user stories

### User Story Dependencies

- **US1 (P1)**: Independent MVP and first delivery slice
- **US2 (P2)**: Depends on persisted transactions from US1 to produce meaningful history and reports
- **US3 (P3)**: Depends on US1 transaction entry and benefits from US2 reporting visibility
- **US4 (P4)**: Depends only on foundational navigation and persistence setup

### Within Each User Story

- Tests MUST be written and fail before implementation
- Models and state contracts before services
- Services before screen wiring
- Core implementation before integration verification
- Story complete before moving to the next required dependent slice

### Parallel Opportunities

- Phase 1 tasks marked `[P]` can run in parallel
- Phase 2 storage, theme, state, and logging tasks marked `[P]` can run in parallel
- In each story, unit, integration, and UI tests marked `[P]` can run in parallel
- Form/component tasks and slice/service tasks marked `[P]` can run in parallel when they touch different files
- US4 can be developed in parallel with US2 after the foundational navigation shell exists

---

## Parallel Example: User Story 1

```bash
Task: "Add unit tests for transaction validation, balance calculations, and reducer behavior in app/tests/unit/transactions/transactionLogic.test.ts"
Task: "Add integration tests for transaction persistence and offline retrieval in app/tests/integration/transactions/transactionRepository.test.ts"
Task: "Add UI tests for transaction creation and inline validation in app/tests/ui/transactions/transactionEntryScreen.test.tsx"
Task: "Implement the transaction domain service and selectors in app/src/features/transactions/services/transactionService.ts and app/src/features/transactions/selectors/transactionSelectors.ts"
Task: "Implement the transactions Redux slice and async actions in app/src/features/transactions/store/transactionsSlice.ts"
Task: "Build the transaction form fields and reusable amount/category inputs in app/src/features/transactions/components/TransactionForm.tsx and app/src/features/transactions/components/AmountInput.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add unit tests for summary aggregation, filter logic, and chart mapping in app/tests/unit/reports/reportSelectors.test.ts"
Task: "Add integration tests for filtered history queries and monthly summary generation in app/tests/integration/reports/reportRepository.test.ts"
Task: "Add UI tests for dashboard and reports filtering states in app/tests/ui/reports/reportsScreen.test.tsx"
Task: "Implement monthly summary and report aggregation services in app/src/features/reports/services/reportService.ts and app/src/features/dashboard/services/dashboardService.ts"
Task: "Implement reports and history Redux slices with filter state in app/src/features/reports/store/reportsSlice.ts and app/src/features/dashboard/store/dashboardSlice.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add unit tests for category uniqueness, category deletion rules, and goal progress calculations in app/tests/unit/settings/categoryGoalLogic.test.ts"
Task: "Add integration tests for category persistence, in-use deactivation, and goal storage in app/tests/integration/settings/categoryGoalRepository.test.ts"
Task: "Build category form, icon picker, and color picker components in app/src/features/categories/components/CategoryForm.tsx, app/src/features/categories/components/IconPicker.tsx, and app/src/features/categories/components/ColorPicker.tsx"
Task: "Build the monthly goal form and progress card in app/src/features/settings/components/MonthlyGoalForm.tsx and app/src/features/dashboard/components/GoalProgressCard.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate offline transaction entry, recent history, and monthly balance
5. Demo the MVP before adding reports, customization, and onboarding polish

### Incremental Delivery

1. Deliver US1 for reliable transaction entry
2. Add US2 for history and reports visibility
3. Add US3 for categories and monthly goals
4. Add US4 for first-run onboarding flow
5. Finish with cross-cutting quality, accessibility, and regression work

### Parallel Team Strategy

1. One developer handles shared setup and navigation foundations
2. A second developer can start onboarding once foundational navigation is ready
3. After US1 stabilizes, reporting and categories/goals can proceed on separate tracks
4. Final polish consolidates shared UI, privacy, and regression coverage

---

## Notes

- Total tasks: 58
- Story task counts: US1 = 10, US2 = 10, US3 = 11, US4 = 8
- Suggested MVP scope: Phase 1 + Phase 2 + Phase 3
- All tasks follow the required checklist format with checkbox, task ID, labels, and file paths
