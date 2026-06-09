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
  }
});

export const recurringTransactionsReducer = slice.reducer;
export const selectRecurringTransactions = (state: any) => state.recurringTransactions.items;
