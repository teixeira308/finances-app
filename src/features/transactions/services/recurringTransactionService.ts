import { RecurringTransaction } from "@/shared/models/finance";
import { recurringTransactionRepository } from "@/storage/repositories/recurringTransactionRepository";

export async function listRecurringTransactions() {
  return recurringTransactionRepository.list();
}

export async function saveRecurringTransaction(transaction: RecurringTransaction) {
  return recurringTransactionRepository.save(transaction);
}

export async function removeRecurringTransaction(id: string) {
  return recurringTransactionRepository.remove(id);
}
