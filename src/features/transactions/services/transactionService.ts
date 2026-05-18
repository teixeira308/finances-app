import { calculateMonthlySummary, type MonthlyGoal, type MonthlySummary, type Transaction } from "@/shared/models/finance";
import { transactionRepository } from "@/storage/repositories/transactionRepository";

export async function listTransactions() {
  return transactionRepository.list();
}

export async function saveTransaction(transaction: Transaction) {
  return transactionRepository.save(transaction);
}

export async function getMonthlySummary(monthRef: string, goal?: MonthlyGoal): Promise<MonthlySummary> {
  const transactions = await transactionRepository.list();
  return calculateMonthlySummary(monthRef, transactions, goal);
}

