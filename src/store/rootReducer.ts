import { combineReducers } from "@reduxjs/toolkit";

import { categoriesReducer } from "@/features/categories/store/categoriesSlice";
import { dashboardReducer } from "@/features/dashboard/store/dashboardSlice";
import { onboardingReducer } from "@/features/onboarding/store/onboardingSlice";
import { reportsReducer } from "@/features/reports/store/reportsSlice";
import { goalsReducer } from "@/features/settings/store/goalsSlice";
import { transactionsReducer } from "@/features/transactions/store/transactionsSlice";
import { recurringTransactionsReducer } from "@/features/transactions/store/recurringTransactionsSlice";
import { workspaceReducer } from "@/features/workspaces/store/workspaceSlice";

export const rootReducer = combineReducers({
  transactions: transactionsReducer,
  recurringTransactions: recurringTransactionsReducer,
  dashboard: dashboardReducer,
  reports: reportsReducer,
  categories: categoriesReducer,
  goals: goalsReducer,
  onboarding: onboardingReducer,
  workspaces: workspaceReducer
});

export type RootState = ReturnType<typeof rootReducer>;

