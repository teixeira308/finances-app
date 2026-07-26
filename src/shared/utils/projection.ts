import { Transaction, RecurringTransaction, BusinessDayConfig } from "../models/finance";
import { toLocalISOString, toLocalDateOnly } from "./date";

/**
 * Helper to find specific business days in a month.
 * Excludes weekends (Sat, Sun). Holidays are not handled in this version.
 */
function getBusinessDayOfMonth(year: number, month: number, config: BusinessDayConfig): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  const businessDays: number[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sun, 6 = Sat
      businessDays.push(day);
    }
  }

  if (config === 'first') return businessDays[0];
  if (config === 'fifth') return businessDays[4] || businessDays[businessDays.length - 1];
  if (config === 'last') return businessDays[businessDays.length - 1];

  return 1;
}

/**
 * Projects recurring transactions into a specific month.
 * monthRef format: "YYYY-MM"
 */
export function projectRecurringTransactions(
  recurring: RecurringTransaction[],
  monthRef: string
): Transaction[] {
  const [year, month] = monthRef.split('-').map(Number);
  const startDateOfMonth = new Date(year, month - 1, 1);
  const endDateOfMonth = new Date(year, month, 0);

  const projected: Transaction[] = [];

  recurring.forEach((rt) => {
    if (!rt.isActive) return;

    const rtStartDate = new Date(rt.startDate);
    const rtEndDate = rt.endDate ? new Date(rt.endDate) : null;

    // Check if the recurring transaction is active during this month
    if (rtStartDate > endDateOfMonth) return;
    if (rtEndDate && rtEndDate < startDateOfMonth) return;

    if (rt.frequency === 'monthly') {
      let day = rt.dayOfMonth || 1;
      
      if (rt.businessDayConfig) {
        day = getBusinessDayOfMonth(year, month, rt.businessDayConfig);
      }

      const occurrenceDate = new Date(year, month - 1, day);

      // Verify if the day is valid for this month (e.g., Feb 30th)
      if (occurrenceDate.getMonth() === month - 1) {
        if (occurrenceDate >= rtStartDate && (!rtEndDate || occurrenceDate <= rtEndDate)) {
          projected.push(createProjectedTransaction(rt, occurrenceDate));
        }
      } else if (day > 28 && !rt.businessDayConfig) {
          // Fallback for end of month if not using business day config
          const lastDay = new Date(year, month, 0);
          if (lastDay >= rtStartDate && (!rtEndDate || lastDay <= rtEndDate)) {
              projected.push(createProjectedTransaction(rt, lastDay));
          }
      }
    } else if (rt.frequency === 'weekly') {
      const dayOfWeek = rt.dayOfWeek ?? rtStartDate.getDay();
      let d = new Date(year, month - 1, 1);
      
      while (d.getDay() !== dayOfWeek) {
        d.setDate(d.getDate() + 1);
      }

      while (d.getMonth() === month - 1) {
        if (d >= rtStartDate && (!rtEndDate || d <= rtEndDate)) {
          projected.push(createProjectedTransaction(rt, new Date(d)));
        }
        d.setDate(d.getDate() + 7);
      }
    } else if (rt.frequency === 'yearly') {
      const monthOfYear = rt.monthOfYear || (rtStartDate.getMonth() + 1);
      if (monthOfYear === month) {
        const day = rt.dayOfMonth || rtStartDate.getDate();
        const occurrenceDate = new Date(year, month - 1, day);
        if (occurrenceDate >= rtStartDate && (!rtEndDate || occurrenceDate <= rtEndDate)) {
            projected.push(createProjectedTransaction(rt, occurrenceDate));
        }
      }
    }
  });

  return projected;
}

function createProjectedTransaction(rt: RecurringTransaction, date: Date): Transaction {
  return {
    id: `projected-${rt.id}-${toLocalISOString(date)}`,
    userId: rt.userId,
    workspaceId: rt.workspaceId,
    type: rt.type,
    amount: rt.amount,
    categoryId: rt.categoryId,
    occurredAt: toLocalISOString(date),
    note: rt.name,
    createdAt: rt.createdAt,
    updatedAt: rt.createdAt,
    syncStatus: 'synced',
  };
}
