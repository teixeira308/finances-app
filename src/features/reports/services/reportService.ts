import { calculateMonthlySummary } from "@/shared/models/finance";
import { transactionRepository } from "@/storage/repositories/transactionRepository";

export async function loadReport(monthRef: string, categoryId?: string) {
  const transactions = await transactionRepository.list();
  const filtered = categoryId ? transactions.filter((item) => item.categoryId === categoryId) : transactions;
  return calculateMonthlySummary(monthRef, filtered);
}

