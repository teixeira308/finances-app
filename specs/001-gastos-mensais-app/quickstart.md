# Quickstart: Gastos Mensais Mobile

## Goal

Validate the mobile planning assumptions by standing up the app shell, the local
data flow, and the primary user journeys before task expansion.

## Prerequisites

- Node.js LTS installed
- Expo-compatible mobile simulator or physical Android/iOS device
- Package manager selected by the implementation team

## Setup

1. Install project dependencies.
2. Start the Expo development server.
3. Launch the app on Android and iOS targets.
4. Confirm linting and formatting commands run successfully.
5. Confirm the Jest test runner and React Native Testing Library environment execute.

## Validation Flow

1. Open the app for the first time and verify onboarding appears.
2. Skip onboarding into local usage.
3. Create at least one expense and one income transaction.
4. Confirm the dashboard updates balance, recent items, and monthly chart.
5. Create a custom category and use it in a transaction.
6. Add a monthly goal and confirm progress appears in the monthly context.
7. Toggle light and dark theme and verify visual readability.
8. Disable connectivity and confirm transaction entry and local history still work.

## Expected Outcomes

- Primary navigation works across all defined areas.
- Local persistence survives app restart for transactions, categories, and goals.
- Reports and dashboard reflect the same source data without value drift.
- Offline entry remains available without blocking the user.
