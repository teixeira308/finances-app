import { goalRepository } from "@/storage/repositories/goalRepository";
import type { MonthlyGoal } from "@/shared/models/finance";
import { validateGoal } from "@/shared/validation/financeSchemas";

export async function listGoals() {
  return goalRepository.list();
}

export async function saveGoal(goal: MonthlyGoal) {
  const errors = validateGoal(goal);
  if (errors.length) throw new Error(errors[0]);
  return goalRepository.save(goal);
}

