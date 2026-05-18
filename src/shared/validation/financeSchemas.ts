import type { Category, MonthlyGoal, Transaction } from "@/shared/models/finance";

export function validateTransaction(input: Partial<Transaction>): string[] {
  const errors: string[] = [];

  if (!input.type) errors.push("Tipo obrigatorio.");
  if (!input.categoryId) errors.push("Categoria obrigatoria.");
  if (!input.occurredAt) errors.push("Data obrigatoria.");
  if (!input.amount || input.amount <= 0) errors.push("Valor deve ser maior que zero.");
  if (input.note && input.note.length > 240) errors.push("Observacao muito longa.");

  return errors;
}

export function validateCategory(input: Partial<Category>, activeNames: string[]): string[] {
  const errors: string[] = [];
  const normalizedName = input.name?.trim().toLowerCase();

  if (!normalizedName) errors.push("Nome obrigatorio.");
  if (normalizedName && activeNames.includes(normalizedName)) errors.push("Categoria duplicada.");
  if (!input.colorToken) errors.push("Cor obrigatoria.");
  if (!input.iconToken) errors.push("Icone obrigatorio.");

  return errors;
}

export function validateGoal(input: Partial<MonthlyGoal>): string[] {
  const errors: string[] = [];

  if (!input.monthRef) errors.push("Mes obrigatorio.");
  if (!input.targetAmount || input.targetAmount <= 0) errors.push("Meta deve ser maior que zero.");

  return errors;
}

