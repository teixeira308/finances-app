# Data Model: Gastos Mensais Mobile

## Transaction

**Purpose**: Represents one income or expense entry used in balances, history, and
reports.

**Fields**:
- `id`: unique identifier
- `type`: `income` or `expense`
- `amount`: positive monetary value
- `category_id`: reference to a category
- `occurred_at`: date-time of the financial event
- `note`: optional free-text observation
- `created_at`: creation timestamp
- `updated_at`: last modification timestamp
- `sync_status`: `local_only`, `pending_sync`, `synced`, or `sync_conflict`
- `deleted_at`: optional soft-delete timestamp

**Validation Rules**:
- `amount` must be greater than zero
- `type` must be one of the supported transaction types
- `category_id` must reference an active category at save time
- `note` is optional and bounded to a practical display length
- `occurred_at` cannot be empty

**State Transitions**:
- `local_only` -> `pending_sync` when sync becomes available
- `pending_sync` -> `synced` after successful reconciliation
- `pending_sync` -> `sync_conflict` if local and remote versions diverge
- any active state -> soft deleted when user confirms deletion

## Category

**Purpose**: Organizes transactions for filtering, reporting, and goal tracking.

**Fields**:
- `id`: unique identifier
- `name`: user-visible category name
- `kind`: `default` or `custom`
- `color_token`: selected color identifier
- `icon_token`: selected icon identifier
- `is_active`: whether the category can be assigned to new transactions
- `created_at`: creation timestamp
- `updated_at`: last modification timestamp

**Validation Rules**:
- `name` must be unique within active categories for the user
- `color_token` must map to an allowed theme-safe color
- `icon_token` must map to an allowed icon set
- default categories cannot be permanently removed from reporting history

**State Transitions**:
- active -> inactive when user removes a category that already has transaction history
- custom draft -> active once saved with valid fields

## Monthly Goal

**Purpose**: Tracks the user's target spending limit for a given month.

**Fields**:
- `id`: unique identifier
- `month_ref`: month in `YYYY-MM` form
- `target_amount`: goal threshold
- `scope`: default `expense_total`
- `created_at`: creation timestamp
- `updated_at`: last modification timestamp

**Validation Rules**:
- one active goal per month and scope
- `target_amount` must be greater than zero

**Derived Values**:
- `spent_amount`: total qualifying expenses in the month
- `remaining_amount`: target minus spent amount
- `progress_ratio`: spent amount divided by target amount

## Monthly Summary

**Purpose**: Aggregated read model for dashboard and reports.

**Fields**:
- `month_ref`: selected month
- `income_total`: total incomes in the month
- `expense_total`: total expenses in the month
- `net_balance`: income minus expenses
- `transaction_count`: number of included records
- `top_categories`: ranked expense groups for the period
- `goal_progress`: optional computed goal snapshot
- `last_computed_at`: last refresh timestamp

**Validation Rules**:
- summary values are derived only from non-deleted qualifying transactions
- category totals must reconcile exactly with source transaction sums

## Onboarding State

**Purpose**: Remembers whether first-run education has been completed or skipped.

**Fields**:
- `has_seen_onboarding`: boolean
- `completed_at`: optional completion timestamp
- `entry_mode`: `skip_to_local` or future authenticated path

## Sync Record

**Purpose**: Tracks optional future synchronization metadata without coupling it to UI
models.

**Fields**:
- `entity_type`: transaction, category, or goal
- `entity_id`: referenced local identifier
- `sync_status`: pending, synced, failed, or conflict
- `last_attempt_at`: optional timestamp
- `last_error_code`: optional failure code
- `remote_version`: optional remote revision marker

**Relationships**:
- Category 1 -> many Transactions
- Monthly Goal 1 -> 1 Monthly Summary per month scope
- Transactions many -> 1 Monthly Summary for reporting windows
