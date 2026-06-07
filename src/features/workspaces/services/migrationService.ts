import { 
  collection, 
  getDocs, 
  query, 
  where, 
  writeBatch, 
  doc 
} from "firebase/firestore";
import { db } from "@/shared/services/firebase";
import { workspaceRepository } from "@/storage/repositories/workspaceRepository";
import type { FinancialWorkspace } from "@/shared/models/finance";
import { nanoid } from "nanoid";

export const migrationService = {
  async runMigrationV2(userId: string): Promise<void> {
    const workspaces = await workspaceRepository.findAllByUserId(userId);
    
    if (workspaces.length > 0) return; // Already migrated or has workspaces

    console.log("Starting migration for user:", userId);

    const workspaceId = nanoid();
    const defaultWorkspace: FinancialWorkspace = {
      id: workspaceId,
      userId,
      name: "Controle de Contas",
      type: "ACCOUNT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Create the default workspace
    await workspaceRepository.save(defaultWorkspace);

    // 2. Update all existing entities to link to this workspaceId
    const collectionsToUpdate = [
      "transactions",
      "categories",
      "recurring_transactions",
      "goals"
    ];

    for (const collName of collectionsToUpdate) {
      const q = query(collection(db, collName), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((snap) => {
        const data = snap.data();
        if (!data.workspaceId) {
          batch.update(snap.ref, { workspaceId });
        }
      });
      await batch.commit();
      console.log(`Migrated ${snapshot.size} documents in ${collName}`);
    }

    console.log("Migration completed successfully");
  }
};
