import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';
import { RecurringTransaction } from "@/shared/models/finance";

const COLLECTION_NAME = "recurring_transactions";

export const recurringTransactionRepository = {
  list: async (workspaceId: string): Promise<RecurringTransaction[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', user.uid),
        where('workspaceId', '==', workspaceId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as RecurringTransaction);
    } catch (error) {
      console.error("Erro ao listar transações recorrentes:", error);
      return [];
    }
  },

  save: async (transaction: RecurringTransaction): Promise<RecurringTransaction> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const transactionWithUser = { ...transaction, userId: user.uid };
      await setDoc(doc(db, COLLECTION_NAME, transaction.id), transactionWithUser);
      return transactionWithUser;
    } catch (error) {
      console.error("Erro ao salvar transação recorrente:", error);
      throw error;
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Erro ao remover transação recorrente:", error);
      throw error;
    }
  }
};
