import { calculateMonthlySummary } from "@/shared/models/finance";
import { transactionRepository } from "@/storage/repositories/transactionRepository";
import { goalRepository } from "@/storage/repositories/goalRepository";

export async function loadDashboardSummary(workspaceId: string, monthRef: string) {
  const [transactions, goals] = await Promise.all([
    transactionRepository.list(workspaceId), 
    goalRepository.list(workspaceId)
  ]);
  const goal = goals.find((item) => item.monthRef === monthRef);
  return calculateMonthlySummary(monthRef, transactions, goal);
}

