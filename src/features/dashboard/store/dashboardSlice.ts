import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toLocalMonthRef } from "@/shared/utils/date";

interface DashboardState {
  selectedMonth: string;
}

const initialState: DashboardState = {
  selectedMonth: toLocalMonthRef(new Date())
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

