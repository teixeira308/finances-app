import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

import type { MonthlyGoal } from "@/shared/models/finance";
import { listGoals, saveGoal } from "@/features/settings/services/goalService";

interface GoalsState {
  items: MonthlyGoal[];
}

const initialState: GoalsState = {
  items: []
};

export const bootstrapGoals = createAsyncThunk("goals/bootstrap", async () => listGoals());

export const createGoal = createAsyncThunk(
  "goals/create",
  async (input: { monthRef: string; targetAmount: number }) => {
    const now = new Date().toISOString();
    return saveGoal({
      ...input,
      id: nanoid(),
      scope: "expense_total",
      createdAt: now,
      updatedAt: now
    });
  }
);

const slice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapGoals.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(createGoal.fulfilled, (state, action) => {
      state.items = [action.payload];
    });
  }
});

export const goalsReducer = slice.reducer;
