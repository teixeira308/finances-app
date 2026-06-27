import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { type RecurringTransaction } from "@/shared/models/finance";
// Para simplificar, vamos usar o mesmo padrão de repositório, mas criar um específico se necessário.
// Por ora, vamos assumir que temos um serviço/repositório similar.
import { listRecurringTransactions, saveRecurringTransaction, removeRecurringTransaction } from "@/features/transactions/services/recurringTransactionService";

interface RecurringTransactionsState {
  items: RecurringTransaction[];
}

const initialState: RecurringTransactionsState = {
  items: []
};

export const bootstrapRecurringTransactions = createAsyncThunk("recurring/bootstrap", async (workspaceId: string) => listRecurringTransactions(workspaceId));

export const createRecurringTransaction = createAsyncThunk(
  "recurring/create",
  async (input: Omit<RecurringTransaction, "id" | "createdAt">) => {
    const now = new Date().toISOString();
    const recurring: RecurringTransaction = {
      ...input,
      id: nanoid(),
      createdAt: now,
      isActive: true
    };
    const clean = JSON.parse(JSON.stringify(recurring));
    return saveRecurringTransaction(clean);
  }
);

export const deleteRecurringTransaction = createAsyncThunk(
  "recurring/delete",
  async (id: string) => {
    await removeRecurringTransaction(id);
    return id;
  }
);

export const updateRecurringTransaction = createAsyncThunk(
  "recurring/update",
  async (input: { id: string; updates: Partial<Pick<RecurringTransaction, "amount" | "name" | "categoryId" | "startDate">> }, { getState }) => {
    const state = getState() as { recurringTransactions: { items: RecurringTransaction[] } };
    const existing = state.recurringTransactions.items.find(t => t.id === input.id);
    if (!existing) throw new Error("Recurring transaction not found");

    const recurring: RecurringTransaction = {
      ...existing,
      ...input.updates,
    };
    return saveRecurringTransaction(recurring);
  }
);

const slice = createSlice({
  name: "recurringTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapRecurringTransactions.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(createRecurringTransaction.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(deleteRecurringTransaction.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    });
    builder.addCase(updateRecurringTransaction.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
  }
});

export const recurringTransactionsReducer = slice.reducer;
export const selectRecurringTransactions = (state: any) => state.recurringTransactions.items;
