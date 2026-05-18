import { calculateMonthlySummary } from "@/shared/models/finance";
import { transactionRepository } from "@/storage/repositories/transactionRepository";
import { goalRepository } from "@/storage/repositories/goalRepository";

export async function loadDashboardSummary(monthRef: string) {
  const [transactions, goals] = await Promise.all([transactionRepository.list(), goalRepository.list()]);
  const goal = goals.find((item) => item.monthRef === monthRef);
  return calculateMonthlySummary(monthRef, transactions, goal);
}

