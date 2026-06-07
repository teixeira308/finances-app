# Implementation Plan: Financial Workspaces Platform

**Branch**: `007-financial-workspaces` | **Date**: 2026-06-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-financial-workspaces/spec.md`

## Summary
Transform the Nexo platform into a multi-workspace system where users can manage liquid accounts and credit cards in isolated environments. This will be achieved by introducing a `FinancialWorkspace` entity and updating all existing entities to support `workspaceId` filtering. The user experience will include a Netflix-style selection screen and a quick switcher in the header.

## Technical Context

**Language/Version**: TypeScript / React 19

**Primary Dependencies**: Redux Toolkit, Firebase 12 (Firestore, Auth), React-Bootstrap, Lucide-React

**Storage**: Firestore (with local persistence enabled)

**Testing**: Vitest for unit/logic, Firestore Security Rules Unit Testing

**Target Platform**: Web (Mobile-First)

**Project Type**: Web Application

**Performance Goals**: <1s for selection screen load, <500ms for workspace context switching.

**Constraints**: Must maintain 100% backward compatibility via automatic migration.

**Scale/Scope**: ~10 new components, 1 new Redux slice, update to all data services.

## Constitution Check

- **Code Quality**: Modularization of workspace-specific logic into custom hooks (`useAccountWorkspace`, `useCreditCardWorkspace`). Introduction of `workspaceSlice` to manage global context. Strict TypeScript interfaces for new metadata.
- **Testing**:
    - Unit tests for credit card installment projection logic.
    - Integration tests for `FinancialWorkspaceRepository`.
    - Firestore Security Rules unit tests to verify `workspaceId` isolation.
    - Screen-flow tests for the Workspace Selection journey.
- **UX Consistency**: Implementation of the "Profile Selection" screen following existing dark-theme iOS-inspired patterns. Reuse of `MainLayout` with dynamic sidebar content based on workspace type.
- **Offline, Security, and Performance**: Standard Firestore offline persistence handles local state. Security rules updated to validate `workspaceId` ownership. Performance budget monitored to ensure context switching doesn't require a page reload.
- **Observability and Reviewability**: Logging of migration events and workspace switching. No sensitive financial data in logs.

## Project Structure

### Documentation (this feature)

```text
specs/007-financial-workspaces/
├── plan.md              # This file
├── research.md          # Research findings and decisions
├── data-model.md        # Entity schemas and relationships
├── quickstart.md        # User workflows and setup
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (generated later)
```

### Source Code

```text
src/
├── features/
│   ├── workspaces/      # NEW: Workspace management logic
│   │   ├── components/  # Selection screen, switcher
│   │   ├── services/    # FinancialWorkspaceRepository
│   │   └── store/       # workspaceSlice
│   ├── onboarding/      # Existing: updated for migration
│   └── ...              # Other features updated to accept workspaceId
├── navigation/
│   ├── WorkspaceGuard.tsx # NEW: Context gate
│   ├── Sidebar.tsx      # UPDATED: Dynamic menus
│   └── ...
├── shared/
│   ├── models/          # UPDATED: finance.ts with new interfaces
│   └── ...
└── store/
    ├── rootReducer.ts   # UPDATED: include workspaceReducer
    └── ...
```

**Structure Decision**: Single project structure (Option 1).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Cross-workspace data reference | Paying a card invoice needs to hit a bank account. | Fully isolated modules | Rejected because users expect "Pay Invoice" to automatically update their bank balance. |
