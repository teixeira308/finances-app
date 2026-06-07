# Research Findings: Financial Workspaces Platform

## Workspace Isolation Strategy

### Decision: Redux + Firestore Query Filtering
Rationale: By keeping the `activeWorkspaceId` in the Redux store, we can ensure that all data-fetching hooks and services automatically filter by the current context. Firestore security rules will enforce this isolation at the server level.
Alternatives considered:
- Separate sub-collections per workspace: Rejected because it makes cross-workspace reporting (if ever needed) very difficult and complicates indexing.
- Root-level collection with `workspaceId` field: Chosen for scalability and ease of migration.

## Data Migration for Existing Users

### Decision: Just-In-Time Migration Hook
Rationale: When a user logs in, a `useMigration` hook will check if the user has any workspaces. If zero, it will create the default "Controle de Contas" workspace and run a batch update on all existing transactions, categories, and goals to link them to the new workspace ID.
Alternatives considered:
- Cloud Function migration: Rejected to keep the implementation within the client-side Firebase footprint and avoid extra costs/infrastructure for a small project.

## Credit Card Installment Engine

### Decision: Virtual Invoices from Installment-linked Transactions
Rationale: Transactions in a `CREDIT_CARD` workspace will include an `installmentInfo` field (e.g., `{ current: 1, total: 12, purchaseId: "..." }`). The "Faturas" view will group these transactions by month based on their `occurredAt` and the card's `closingDay`.
Alternatives considered:
- Explicit "Invoice" entities: Rejected as it creates stale data issues. Calculating invoices dynamically from the transaction list is more robust.

## Workspace Navigation Flow

### Decision: "Guard" pattern with Workspace Switcher
Rationale: A `WorkspaceGuard` component will wrap the main application routes. If no workspace is active, it redirects to the selection screen. A switcher in the `Sidebar` or `Header` allows changing the `activeWorkspaceId` in Redux, which triggers a re-fetch of all workspace-specific data.
Alternatives considered:
- URL-based workspace ID (e.g., `/:workspaceId/dashboard`): Rejected for simplicity in the current single-page app structure, though it would be more "RESTful".
