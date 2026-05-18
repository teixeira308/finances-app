import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  selectedMonth: string;
}

const initialState: DashboardState = {
  selectedMonth: new Date().toISOString().slice(0, 7)
};

const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    }
  }
});

export const { setSelectedMonth } = slice.actions;
export const dashboardReducer = slice.reducer;

