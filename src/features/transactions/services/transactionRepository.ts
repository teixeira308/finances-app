import type { Transaction } from '@/shared/models/finance';

const STORAGE_KEY = 'gastos_mensais_transactions';

const getStoredTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveStoredTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const transactionRepository = {
  async list() {
    return getStoredTransactions();
  },
  async save(transaction: Transaction) {
    const transactions = getStoredTransactions();
    const index = transactions.findIndex((item) => item.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
    } else {
      transactions.unshift(transaction);
    }
    saveStoredTransactions(transactions);
    return transaction;
  },
  async remove(id: string) {
    const transactions = getStoredTransactions();
    const filtered = transactions.filter((item) => item.id !== id);
    saveStoredTransactions(filtered);
  }
};
