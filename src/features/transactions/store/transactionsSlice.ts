import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type { Transaction } from "@/shared/models/finance";
import { validateTransaction } from "@/shared/validation/financeSchemas";
import { listTransactions, saveTransaction } from "@/features/transactions/services/transactionService";
import { transactionRepository } from "@/storage/repositories/transactionRepository";

interface TransactionsState {
  items: Transaction[];
  error?: string;
}

const initialState: TransactionsState = {
  items: []
};

export const bootstrapTransactions = createAsyncThunk("transactions/bootstrap", async (workspaceId: string) => listTransactions(workspaceId));

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string) => {
    await transactionRepository.remove(id);
    return id;
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "syncStatus">) => {
    const errors = validateTransaction(input);
    if (errors.length) throw new Error(errors[0]);

    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...input,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
      syncStatus: "local_only"
    };
    return saveTransaction(transaction);
  }
);

export const createPurchase = createAsyncThunk(
  "transactions/createPurchase",
  async (transactions: Transaction[]) => {
    const saved = await Promise.all(transactions.map(tx => saveTransaction(tx)));
    return saved;
  }
);

const slice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionsError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapTransactions.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.error = undefined;
    });
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(createPurchase.fulfilled, (state, action) => {
      state.items = [...action.payload, ...state.items];
      state.error = undefined;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    });
  }
});

export const { setTransactionsError } = slice.actions;
export const transactionsReducer = slice.reducer;

