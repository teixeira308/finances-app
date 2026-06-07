# Quickstart: Financial Workspaces

## Setup
1. Run migration: `npm run migrate:workspaces` (locally via script) or login to trigger `useMigration` hook.
2. Verify "Controle de Contas" appears in the selection screen.

## Key Workflows

### Creating a Credit Card Workspace
1. Go to selection screen (logout and login or use the top switcher's "Manage" option).
2. Click "Novo Cartão".
3. Enter name, limit, closing day, and due day.
4. Save and enter the new workspace.

### Registering a Purchase with Installments
1. In a `CREDIT_CARD` workspace, go to "Nova Compra".
2. Fill details and set "Parcelas" > 1.
3. Save.
4. Go to "Faturas" to see the projected monthly values.
5. Go to "Parcelamentos" to see the progress of the purchase.

### Switching Workspaces
1. Click the workspace name in the header.
2. Select another workspace from the dropdown.
3. Observe the menu and dashboard updating to the new context.
