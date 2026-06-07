import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

import type { MonthlyGoal } from "@/shared/models/finance";
import { listGoals, saveGoal } from "@/features/settings/services/goalService";
import type { RootState } from "@/store/rootReducer";

interface GoalsState {
  items: MonthlyGoal[];
}

const initialState: GoalsState = {
  items: []
};

export const bootstrapGoals = createAsyncThunk("goals/bootstrap", async (workspaceId: string) => listGoals(workspaceId));

export const createGoal = createAsyncThunk(
  "goals/create",
  async (input: { monthRef: string; targetAmount: number }, { getState }) => {
    const state = getState() as RootState;
    const activeWorkspaceId = state.workspaces.activeWorkspaceId;
    if (!activeWorkspaceId) throw new Error("No active workspace");

    const now = new Date().toISOString();
    return saveGoal({
      ...input,
      id: nanoid(),
      userId: "", // set by repository (repository logic usually handles auth.currentUser)
      workspaceId: activeWorkspaceId,
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
