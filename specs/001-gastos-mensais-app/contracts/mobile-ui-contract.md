# Mobile UI Contract: Gastos Mensais Mobile

## Navigation Areas

- `Onboarding`
- `Dashboard`
- `Transaction Entry`
- `Reports`
- `Categories`
- `Settings`

## Dashboard Contract

**Inputs**:
- selected month
- locally available transactions
- optional monthly goal

**Outputs**:
- monthly balance
- receitas versus despesas chart
- recent transactions list
- goal progress summary when configured

**Required States**:
- loading
- empty
- populated
- offline with local data
- error with retry

## Transaction Entry Contract

**Inputs**:
- transaction type
- amount
- category
- date and time
- optional note

**Behavior Rules**:
- save is blocked until required fields are valid
- successful save updates dashboard and history views
- offline save remains available
- validation feedback is shown inline and immediately understandable

## Reports Contract

**Inputs**:
- period filter: week, month, year
- optional category filter

**Outputs**:
- category chart
- receitas versus despesas summary
- filtered totals and counts

**Required States**:
- no data for selected period
- filtered results
- loading while recalculating

## Categories Contract

**Inputs**:
- category name
- icon choice
- color choice

**Behavior Rules**:
- categories in use cannot silently orphan historical transactions
- edits propagate to future displays and filtered reports
- deletion must preserve historical reporting integrity

## Theming Contract

- all screens support light and dark theme
- key financial values remain legible in both themes
- charts and category colors must preserve readable contrast
