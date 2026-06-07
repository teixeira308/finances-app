import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FinancialWorkspace } from "@/shared/models/finance";
import type { RootState } from "@/store/rootReducer";

interface WorkspaceState {
  workspaces: FinancialWorkspace[];
  activeWorkspaceId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: localStorage.getItem("active_workspace_id"),
  loading: false,
  error: null
};

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<FinancialWorkspace[]>) => {
      state.workspaces = action.payload;
      if (!state.activeWorkspaceId && action.payload.length > 0) {
        state.activeWorkspaceId = action.payload[0].id;
        localStorage.setItem("active_workspace_id", action.payload[0].id);
      }
    },
    setActiveWorkspaceId: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
      localStorage.setItem("active_workspace_id", action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setWorkspaces, setActiveWorkspaceId, setLoading, setError } = workspaceSlice.actions;
export const workspaceReducer = workspaceSlice.reducer;

export const selectWorkspaces = (state: RootState) => state.workspaces.workspaces;
export const selectActiveWorkspaceId = (state: RootState) => state.workspaces.activeWorkspaceId;
export const selectActiveWorkspace = (state: RootState) => 
  state.workspaces.workspaces.find(w => w.id === state.workspaces.activeWorkspaceId);
export const selectWorkspaceLoading = (state: RootState) => state.workspaces.loading;
