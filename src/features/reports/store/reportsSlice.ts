import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ReportsState {
  period: "week" | "month" | "year";
  categoryId?: string;
}

const initialState: ReportsState = {
  period: "month"
};

const slice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReportPeriod(state, action: PayloadAction<"week" | "month" | "year">) {
      state.period = action.payload;
    },
    setReportCategory(state, action: PayloadAction<string | undefined>) {
      state.categoryId = action.payload;
    }
  }
});

export const { setReportPeriod, setReportCategory } = slice.actions;
export const reportsReducer = slice.reducer;

