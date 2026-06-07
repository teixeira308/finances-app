# Feature Specification: Financial Workspaces Platform

**Feature Branch**: `007-financial-workspaces`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "Transformar o sistema atual em uma plataforma com múltiplos espaços financeiros independentes (Financial Workspaces), permitindo a coexistência de módulos de 'Contas' (o sistema atual) e 'Cartões de Crédito' (novo módulo) com navegação, dashboard e dados completamente isolados, inspirando-se na experiência de seleção de perfil da Netflix. Inclui tela de seleção pós-login, seletor rápido no topo, modelagem Firestore atualizada com isolamento por workspaceId e migração automática para usuários existentes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Workspace Selection (Priority: P1)

As a returning user with multiple financial spaces (e.g., Personal Accounts, Nubank, Inter), I want to be presented with a profile selection screen after logging in so that I can choose which environment I want to manage.

**Why this priority**: Core navigation concept. It establishes the "Financial Workspace" paradigm.

**Independent Test**: Can be tested by logging in with a user that has multiple workspaces and verifying the selection screen appears.

**Acceptance Scenarios**:

1. **Given** a user with multiple workspaces, **When** they log in, **Then** they see a selection screen with all their workspaces.
2. **Given** a user with only one workspace, **When** they log in, **Then** they are automatically redirected to that workspace's dashboard.
3. **Given** the selection screen, **When** the user clicks a workspace, **Then** they enter that specific environment with its isolated menu and data.

---

### User Story 2 - Credit Card Management (Priority: P1)

As a user, I want a dedicated workspace for each of my credit cards so that I can track my limit, invoices, and installments without mixing them with my liquid cash accounts.

**Why this priority**: Key functional differentiator for the new platform version.

**Independent Test**: Can be tested by creating a `CREDIT_CARD` workspace and verifying its unique dashboard and features (limit, purchases, invoices).

**Acceptance Scenarios**:

1. **Given** a Credit Card workspace, **When** I view the dashboard, **Then** I see the total limit, utilized amount, available limit, and current/next invoice totals.
2. **Given** the purchase registration form, **When** I enter a value and number of installments, **Then** the system automatically projects future invoices for all installments.
3. **Given** a purchase with installments, **When** I view the "Parcelamentos" screen, **Then** I see a clear progress tracker for each parcel.

---

### User Story 3 - Quick Workspace Switching (Priority: P2)

As a user working within a workspace, I want to quickly switch to another workspace without logging out so that I can efficiently manage different parts of my financial life.

**Why this priority**: Essential for a smooth user experience in a multi-workspace environment.

**Independent Test**: Can be tested by using the top selector in any workspace and verifying the immediate transition to another workspace.

**Acceptance Scenarios**:

1. **Given** I am inside a workspace, **When** I click the workspace selector in the header, **Then** I see a list of my other workspaces.
2. **Given** the switcher list, **When** I select another workspace, **Then** the UI updates immediately to the new workspace's context (menu, dashboard, data) without a full page reload or re-authentication.

---

### User Story 4 - Automatic Migration (Priority: P1)

As an existing user of the system, I want my data to be preserved and automatically organized into a default workspace so that I don't lose my history after the platform update.

**Why this priority**: Critical for backward compatibility and user retention.

**Independent Test**: Can be tested by accessing an old account and verifying all existing data is now associated with a "Controle de Contas" workspace.

**Acceptance Scenarios**:

1. **Given** an account created before the workspace update, **When** I log in for the first time after the update, **Then** a default `ACCOUNT` workspace named "Controle de Contas" is automatically created.
2. **Given** existing transactions, categories, and goals, **When** the migration runs, **Then** all these entities are linked to the new default workspace.

---

### Edge Cases

- **Workspace Deletion**: What happens to data when a workspace is deleted? (Assumption: All linked data is deleted or archived).
- **Payment between Workspaces**: How does paying a credit card invoice affect the `ACCOUNT` workspace? (Assumption: A "Pay Invoice" action in a `CREDIT_CARD` workspace creates a corresponding expense in a selected `ACCOUNT` workspace).
- **Empty Workspaces**: How does the UI handle a user with zero workspaces (should not be possible after migration/onboarding).

## User Experience Consistency *(mandatory)*

- **Existing Patterns Reused**: Follows the existing iOS-inspired dark theme, using the same typography and color tokens (`--ios-blue`, `--ios-green`, `--ios-red`, `--ios-gray`).
- **States Covered**:
    - **Selection Screen**: Profile grid similar to Netflix/Disney+.
    - **Header Switcher**: Dropdown/Popover in the top navigation bar.
    - **Loading**: Pulse skeletons for workspace data loading.
- **Responsive/Device Considerations**:
    - Selection screen adapts from a 1-column list on mobile to a grid on desktop.
    - Top switcher must be easily clickable on touch devices.
- **Intentional Deviations**: The navigation menu is now workspace-dependent. This is a deliberate change to reduce cognitive load and isolate different financial contexts.

## Offline, Sync, and Privacy *(mandatory)*

- **Offline Behavior**: Workspaces and their transactions are cached locally using Firestore's persistence. Users can switch between cached workspaces offline.
- **Sync/Reconciliation Rules**: Standard Firestore real-time sync. Conflict resolution favors the most recent write.
- **Sensitive Data Handling**: Financial data is isolated by `workspaceId` at the Firestore security rules level. No data from `Workspace A` should be queryable when the user is in `Workspace B`.
- **Future Auth Hooks**: Not applicable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support multiple `FinancialWorkspace` entities per user.
- **FR-002**: System MUST distinguish between `ACCOUNT` and `CREDIT_CARD` workspace types.
- **FR-003**: System MUST provide a dedicated "Profile Selection" screen after login for multi-workspace users.
- **FR-004**: System MUST automatically redirect single-workspace users to their environment.
- **FR-005**: System MUST provide a quick workspace switcher in the application header.
- **FR-006**: System MUST isolate navigation menus based on the active workspace type.
- **FR-007**: System MUST implement automatic data migration for existing users, creating a default "Controle de Contas" workspace.
- **FR-008**: Credit Card workspaces MUST support limit tracking (Total, Used, Available).
- **FR-009**: Credit Card workspaces MUST support installment-based purchases with automatic future invoice projection.
- **FR-010**: System MUST enforce workspace-level data isolation via Firestore Security Rules.
- **FR-011**: System MUST provide a "Parcelamentos" view in Credit Card workspaces to track progress of multi-part purchases.

### Key Entities *(include if feature involves data)*

- **FinancialWorkspace**: Represents an isolated financial environment. Attributes: `id`, `userId`, `name`, `type` (ACCOUNT | CREDIT_CARD), `metadata` (limit, closingDay, etc. for cards).
- **Transaction**: Existing entity updated with `workspaceId`. Represents a single movement (income/expense) or a credit card purchase.
- **RecurringTransaction**: Existing entity updated with `workspaceId`.
- **Category**: Existing entity updated with `workspaceId`. Allows per-workspace custom categories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of existing users have their data successfully migrated to a default workspace without data loss.
- **SC-002**: Users can switch between workspaces in under 500ms (UI responsiveness).
- **SC-003**: Selection screen loads in under 1 second after successful authentication.
- **SC-004**: 0 instances of data leakage between workspaces (verified via security rule tests).
- **SC-005**: Users can register a 12-month installment purchase and see all 12 projected invoices instantly.

## Assumptions

- **Existing Auth**: The current Firebase Authentication flow will be reused.
- **Default Workspace**: All current data is homogeneous and fits the `ACCOUNT` type.
- **Manual Sync**: Invoice payment between workspaces requires a manual trigger from the user to link a "Card Payment" to a specific "Bank Account".
