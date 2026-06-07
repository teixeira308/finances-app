import { 
  collection, 
  getDocs, 
  setDoc, 
  doc,
  query,
  where
} from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';
import type { MonthlyGoal } from '@/shared/models/finance';

const COLLECTION_NAME = 'goals';

export const goalRepository = {
  async list(workspaceId: string) {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', user.uid),
        where('workspaceId', '==', workspaceId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as MonthlyGoal);
    } catch (error) {
      console.error("Erro ao listar metas do Firebase:", error);
      return [];
    }
  },

  async save(goal: MonthlyGoal) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const goalWithUser = { ...goal, userId: user.uid };
      await setDoc(doc(db, COLLECTION_NAME, goal.id), goalWithUser);
      return goalWithUser;
    } catch (error) {
      console.error("Erro ao salvar meta no Firebase:", error);
      throw error;
    }
  }
};
