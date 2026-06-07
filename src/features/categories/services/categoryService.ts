import { categoryRepository } from "@/storage/repositories/categoryRepository";
import type { Category } from "@/shared/models/finance";
import { validateCategory } from "@/shared/validation/financeSchemas";

export async function listCategories(workspaceId: string) {
  return categoryRepository.list(workspaceId);
}

export async function saveCategory(category: Category) {
  const existing = await categoryRepository.list(category.workspaceId);
  const errors = validateCategory(category, existing.filter((item) => item.id !== category.id).map((item) => item.name.toLowerCase()));
  if (errors.length) throw new Error(errors[0]);
  return categoryRepository.save(category);
}

