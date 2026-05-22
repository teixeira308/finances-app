import { RecurringTransaction } from "@/shared/models/finance";

const STORAGE_KEY = "recurring_transactions";

export const recurringTransactionRepository = {
  list: async (): Promise<RecurringTransaction[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  save: async (transaction: RecurringTransaction): Promise<RecurringTransaction> => {
    const list = await recurringTransactionRepository.list();
    list.push(transaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return transaction;
  },
  remove: async (id: string): Promise<void> => {
    const list = await recurringTransactionRepository.list();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
