import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { completeOnboarding, loadOnboardingState } from "@/features/onboarding/services/onboardingService";
import type { RootState } from "@/store/rootReducer";

interface OnboardingSliceState {
  hasSeenOnboarding: boolean;
}

const initialState: OnboardingSliceState = {
  hasSeenOnboarding: false
};

export const bootstrapOnboarding = createAsyncThunk("onboarding/bootstrap", async () => loadOnboardingState());
export const finishOnboarding = createAsyncThunk("onboarding/finish", async () => completeOnboarding());

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
  }
});

export const onboardingReducer = slice.reducer;
export const selectHasSeenOnboarding = (state: RootState) => state.onboarding.hasSeenOnboarding;
