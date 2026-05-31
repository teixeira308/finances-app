export type TransactionType = "income" | "expense";
export type SyncStatus = "local_only" | "pending_sync" | "synced" | "sync_conflict";
export type RecurrenceType = "weekly" | "monthly" | "yearly";
export type BusinessDayConfig = 'first' | 'last' | 'fifth';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  occurredAt: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  deletedAt?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  frequency: RecurrenceType;
  dayOfWeek?: number; // 0 (Sun) - 6 (Sat)
  dayOfMonth?: number; // 1 - 31
  monthOfYear?: number; // 1 - 12
  businessDayConfig?: BusinessDayConfig;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  kind: "default" | "custom";
  colorToken: string;
  iconToken: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyGoal {
  id: string;
  monthRef: string;
  targetAmount: number;
  scope: "expense_total";
  createdAt: string;
  updatedAt: string;
} 

export interface GoalProgress {
  targetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  progressRatio: number;
}

export interface MonthlySummary {
  monthRef: string;
  incomeTotal: number;
  expenseTotal: number;
  netBalance: number;
  transactionCount: number;
  topCategories: Array<{ categoryId: string; total: number }>;
  goalProgress?: GoalProgress;
  lastComputedAt: string;
}

export interface OnboardingState {
  hasSeenOnboarding: boolean;
  completedAt?: string;
  entryMode: "skip_to_local" | "future_authenticated";
}

export interface SyncRecord {
  entityType: "transaction" | "category" | "goal";
  entityId: string;
  syncStatus: "pending" | "synced" | "failed" | "conflict";
  lastAttemptAt?: string;
  lastErrorCode?: string;
  remoteVersion?: string;
}

export interface UserProfile {
  id: string; // uid
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  preferences: {
    theme: 'dark';
    privacyMode: boolean;
  };
  metadata: {
    createdAt: string; // ISO
    lastLogin: string; // ISO
    version: number;
  }
}

export function calculateMonthlySummary(
  monthRef: string,
  transactions: Transaction[],
  goal?: MonthlyGoal
): MonthlySummary {
  const active = transactions.filter(
    (transaction) => !transaction.deletedAt && transaction.occurredAt.startsWith(monthRef)
  );
  const incomeTotal = active
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenseTotal = active
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const categoryTotals = new Map<string, number>();

  active.forEach((transaction) => {
    if (transaction.type === "expense") {
      categoryTotals.set(
        transaction.categoryId,
        (categoryTotals.get(transaction.categoryId) ?? 0) + transaction.amount
      );
    }
  });

  const goalProgress = goal
    ? {
        targetAmount: goal.targetAmount,
        spentAmount: expenseTotal,
        remainingAmount: Math.max(goal.targetAmount - expenseTotal, 0),
        progressRatio: goal.targetAmount === 0 ? 0 : expenseTotal / goal.targetAmount
      }
    : undefined;

  return {
    monthRef,
    incomeTotal,
    expenseTotal,
    netBalance: incomeTotal - expenseTotal,
    transactionCount: active.length,
    topCategories: [...categoryTotals.entries()].map(([categoryId, total]) => ({ categoryId, total })),
    goalProgress,
    lastComputedAt: new Date().toISOString()
  };
}
