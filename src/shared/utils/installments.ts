import { Transaction, TransactionType } from "../models/finance";
import { nanoid } from "nanoid";
import { toLocalISOString } from "./date";

export const projectInstallments = (
  baseTransaction: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "syncStatus">,
  installments: number
): Transaction[] => {
  const transactions: Transaction[] = [];
  const purchaseId = nanoid();
  const now = new Date().toISOString();

  for (let i = 1; i <= installments; i++) {
    const occurredAt = new Date(baseTransaction.occurredAt);
    occurredAt.setMonth(occurredAt.getMonth() + (i - 1));

    transactions.push({
      ...baseTransaction,
      id: nanoid(),
      occurredAt: toLocalISOString(occurredAt),
      installmentInfo: {
        current: i,
        total: installments,
        purchaseId
      },
      createdAt: now,
      updatedAt: now,
      syncStatus: "local_only"
    });
  }

  return transactions;
};
