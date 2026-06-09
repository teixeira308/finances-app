import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  completeOnboarding,
  loadOnboardingState,
  completeTransactionGuide,
  loadTransactionGuideState,
} from "@/features/onboarding/services/onboardingService";
import type { RootState } from "@/store/rootReducer";

interface OnboardingSliceState {
  hasSeenOnboarding: boolean;
  hasSeenTransactionGuide: boolean;
}

const initialState: OnboardingSliceState = {
  hasSeenOnboarding: false,
  hasSeenTransactionGuide: false,
};

export const bootstrapOnboarding = createAsyncThunk("onboarding/bootstrap", async () => loadOnboardingState());
export const finishOnboarding = createAsyncThunk("onboarding/finish", async () => completeOnboarding());

export const bootstrapTransactionGuide = createAsyncThunk("onboarding/bootstrapTransactionGuide", async () =>
  loadTransactionGuideState()
);
export const finishTransactionGuide = createAsyncThunk("onboarding/finishTransactionGuide", async () =>
  completeTransactionGuide()
);

const slice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapOnboarding.fulfilled, (state, action) => {
      state.hasSeenOnboarding = action.payload.hasSeenOnboarding;
    });
    builder.addCase(finishOnboarding.fulfilled, (state) => {
      state.hasSeenOnboarding = true;
    });
    builder.addCase(bootstrapTransactionGuide.fulfilled, (state, action) => {
      state.hasSeenTransactionGuide = action.payload.hasSeenTransactionGuide;
    });
    builder.addCase(finishTransactionGuide.fulfilled, (state) => {
      state.hasSeenTransactionGuide = true;
    });
  },
});

export const onboardingReducer = slice.reducer;
export const selectHasSeenOnboarding = (state: RootState) => state.onboarding.hasSeenOnboarding;
export const selectHasSeenTransactionGuide = (state: RootState) => state.onboarding.hasSeenTransactionGuide;
