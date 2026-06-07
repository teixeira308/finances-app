import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

import type { Category } from "@/shared/models/finance";
import { listCategories, saveCategory } from "@/features/categories/services/categoryService";
import type { RootState } from "@/store/rootReducer";
import { categoryRepository } from "@/storage/repositories/categoryRepository";

interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: []
};

export const bootstrapCategories = createAsyncThunk("categories/bootstrap", async (workspaceId: string) => listCategories(workspaceId));

export const createCategory = createAsyncThunk(
  "categories/create",
  async (input: Omit<Category, "id" | "createdAt" | "updatedAt" | "kind" | "isActive">) => {
    const now = new Date().toISOString();
    return saveCategory({
      ...input,
      id: nanoid(),
      kind: "custom",
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    await categoryRepository.remove(id);
    return id;
  }
);

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapCategories.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    });
  }
});

export const categoriesReducer = slice.reducer;
export const selectCategories = (state: RootState) => state.categories.items;
