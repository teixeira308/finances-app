import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/rootReducer';
import {
  loadTermsAcceptance,
  acceptTerms as acceptTermsService,
} from '../services/termsService';

export interface TermsState {
  accepted: boolean;
  loading: boolean;
  acceptedAt: string;
}

const initialState: TermsState = {
  accepted: false,
  loading: true,
  acceptedAt: '',
};

export const bootstrapTerms = createAsyncThunk(
  'terms/bootstrap',
  async () => {
    const acceptance = await loadTermsAcceptance();
    return acceptance;
  }
);

export const acceptTerms = createAsyncThunk(
  'terms/accept',
  async () => {
    await acceptTermsService();
    return { acceptedAt: new Date().toISOString() };
  }
);

const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrapTerms.fulfilled, (state, action) => {
        state.accepted = action.payload.accepted;
        state.acceptedAt = action.payload.acceptedAt;
        state.loading = false;
      })
      .addCase(bootstrapTerms.rejected, (state) => {
        state.loading = false;
      })
      .addCase(acceptTerms.fulfilled, (state, action) => {
        state.accepted = true;
        state.acceptedAt = action.payload.acceptedAt;
      });
  },
});

export const selectTermsAccepted = (state: RootState) => state.terms.accepted;
export const selectTermsLoading = (state: RootState) => state.terms.loading;

export const termsReducer = termsSlice.reducer;
