import { calculateMonthlySummary, type MonthlyGoal, type MonthlySummary, type Transaction } from "@/shared/models/finance";
import { transactionRepository } from "@/storage/repositories/transactionRepository";

export async function listTransactions(workspaceId: string) {
  return transactionRepository.list(workspaceId);
}

export async function saveTransaction(transaction: Transaction) {
  return transactionRepository.save(transaction);
}

export async function getMonthlySummary(workspaceId: string, monthRef: string, goal?: MonthlyGoal): Promise<MonthlySummary> {
  const transactions = await transactionRepository.list(workspaceId);
  return calculateMonthlySummary(monthRef, transactions, goal);
}

