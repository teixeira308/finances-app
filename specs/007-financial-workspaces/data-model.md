# Data Model: Financial Workspaces Platform

## New Entities

### FinancialWorkspace
Represents a logical container for financial data.
- `id`: string (UUID)
- `userId`: string (Firebase UID)
- `name`: string
- `type`: "ACCOUNT" | "CREDIT_CARD"
- `metadata`: object
    - `limit`: number (for CREDIT_CARD)
    - `closingDay`: number (for CREDIT_CARD, 1-31)
    - `dueDay`: number (for CREDIT_CARD, 1-31)
    - `color`: string (UI theme color)
    - `icon`: string (Lucide icon name)
- `createdAt`: string (ISO)
- `updatedAt`: string (ISO)

## Updated Entities

### Transaction
Updated to include workspace context and installment support.
- `id`: string
- `userId`: string
- `workspaceId`: string (FK to FinancialWorkspace)
- `type`: "income" | "expense"
- `amount`: number
- `categoryId`: string
- `occurredAt`: string
- `note`: string
- `installmentInfo`: object (optional)
    - `current`: number
    - `total`: number
    - `purchaseId`: string (links installments together)
- `createdAt`: string
- `updatedAt`: string
- `syncStatus`: SyncStatus

### Category
Updated to be workspace-specific.
- `id`: string
- `userId`: string
- `workspaceId`: string
- `name`: string
- `type`: TransactionType
- `kind`: "default" | "custom"
- `colorToken`: string
- `iconToken`: string
- `isActive`: boolean

### RecurringTransaction
Updated with workspace context.
- `id`: string
- `userId`: string
- `workspaceId`: string
- ... (existing fields)

### MonthlyGoal
Updated with workspace context.
- `id`: string
- `userId`: string
- `workspaceId`: string
- ... (existing fields)

## Relationships

- `User` (1) --- (N) `FinancialWorkspace`
- `FinancialWorkspace` (1) --- (N) `Transaction`
- `FinancialWorkspace` (1) --- (N) `Category`
- `FinancialWorkspace` (1) --- (N) `MonthlyGoal`
- `FinancialWorkspace` (1) --- (N) `RecurringTransaction`
