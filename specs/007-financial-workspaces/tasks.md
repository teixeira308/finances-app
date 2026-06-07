---
description: "Task list for Financial Workspaces implementation"
---

# Tasks: Financial Workspaces Platform

**Input**: Design documents from `specs/007-financial-workspaces/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Tests are REQUIRED. Every user story MUST include test tasks to prove behavior and security isolation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Update financial models in src/shared/models/finance.ts to include FinancialWorkspace and workspaceId in entities
- [ ] T002 Create workspace Redux slice in src/features/workspaces/store/workspaceSlice.ts
- [ ] T003 [P] Add workspaceReducer to src/store/rootReducer.ts
- [ ] T004 [P] Update Firestore security rules in firestore.rules to support workspaces collection and workspaceId validation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T005 Implement FinancialWorkspaceRepository in src/features/workspaces/services/workspaceService.ts
- [ ] T006 Update TransactionRepository and CategoryRepository to filter by workspaceId
- [ ] T007 [P] Implement useWorkspaces custom hook in src/features/workspaces/hooks/useWorkspaces.ts
- [ ] T008 [P] Configure global loading state for workspace context transitions

---

## Phase 3: User Story 1 - Workspace Selection (Priority: P1) 🎯 MVP

**Goal**: Allow users to choose their financial environment after login.

**Independent Test**: Login with a multi-workspace user and verify the "Profile Selection" grid appears.

### Tests for User Story 1

- [ ] T009 [P] [US1] Unit test for WorkspaceSelection component in src/features/workspaces/components/__tests__/WorkspaceSelection.test.tsx
- [ ] T010 [US1] Integration test for workspace redirection logic in src/navigation/__tests__/WorkspaceGuard.test.tsx

### Implementation for User Story 1

- [ ] T011 [US1] Create WorkspaceSelection screen in src/features/workspaces/screens/WorkspaceSelectionScreen.tsx
- [ ] T012 [US1] Implement WorkspaceGuard component in src/navigation/WorkspaceGuard.tsx
- [ ] T013 [US1] Update App.tsx to include WorkspaceGuard in the main route tree
- [ ] T014 [US1] Add "Add New Workspace" modal to the selection screen

---

## Phase 4: User Story 4 - Automatic Migration (Priority: P1)

**Goal**: Ensure existing users are automatically migrated to the new workspace structure.

**Independent Test**: Access an old account and verify a "Controle de Contas" workspace is created and linked to old data.

### Tests for User Story 4

- [ ] T015 [P] [US4] Unit test for migration logic in src/features/workspaces/services/__tests__/migrationService.test.ts

### Implementation for User Story 4

- [ ] T016 [US4] Implement migrationService in src/features/workspaces/services/migrationService.ts
- [ ] T017 [US4] Create useMigration hook to trigger logic on first login post-update
- [ ] T018 [US4] Implement batch update logic for linking legacy transactions/categories/goals to the default workspace

---

## Phase 5: User Story 2 - Credit Card Management (Priority: P1)

**Goal**: Dedicated environment for credit card tracking with installments and invoices.

**Independent Test**: Create a card workspace, register a 3x purchase, and verify 3 invoices are projected.

### Tests for User Story 2

- [ ] T019 [P] [US2] Unit test for installment projection utility in src/shared/utils/__tests__/installments.test.ts
- [ ] T020 [US2] Integration test for credit card dashboard data aggregation

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement installment projection logic in src/shared/utils/installments.ts
- [ ] T022 [US2] Create CreditCardDashboard in src/features/workspaces/screens/CreditCardDashboard.tsx
- [ ] T023 [US2] Implement dynamic Sidebar menu based on workspace type in src/navigation/Sidebar.tsx
- [ ] T024 [US2] Update NewTransactionScreen to handle credit card purchases with installment selection
- [ ] T025 [US2] Create "Parcelamentos" view in src/features/workspaces/screens/InstallmentsScreen.tsx
- [ ] T026 [US2] Create "Faturas" view in src/features/workspaces/screens/InvoicesScreen.tsx

---

## Phase 6: User Story 3 - Quick Workspace Switching (Priority: P2)

**Goal**: Switch between workspaces instantly from the header.

**Independent Test**: Click the header switcher, select another workspace, and see the UI update without reload.

### Implementation for User Story 3

- [ ] T027 [P] [US3] Create WorkspaceSwitcher component in src/features/workspaces/components/WorkspaceSwitcher.tsx
- [ ] T028 [US3] Integrate WorkspaceSwitcher into the MainLayout header
- [ ] T029 [US3] Add "Switch Workspace" action to the Sidebar for mobile accessibility

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T030 [P] Update documentation in specs/ and root README.md
- [ ] T031 Optimize Firestore indices for workspaceId-based queries
- [ ] T032 Final validation of iOS/Android mobile UX consistency
- [ ] T033 Run quickstart.md validation with a clean test user

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)** -> **Foundational (Phase 2)** -> **User Stories (Phases 3-6)** -> **Polish (Phase 7)**

### User Story Dependencies
- **US1** and **US4** should be implemented first to ensure legacy users can access the app.
- **US2** depends on **Foundational** (Phase 2).
- **US3** is an enhancement to the existing navigation.

---

## Implementation Strategy

### MVP First
1. Complete Setup and Foundational.
2. Implement **US4 (Migration)** to avoid breaking existing accounts.
3. Implement **US1 (Selection)** to establish the new entry flow.

### Incremental Delivery
1. After MVP, add **US2 (Credit Card)** as the first major new feature.
2. Finish with **US3 (Switcher)** for UX polish.
