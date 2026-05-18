import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';
import type { Transaction } from '@/shared/models/finance';

const COLLECTION_NAME = 'transactions';

export const transactionRepository = {
  async list() {
    const user = auth.currentUser;
    if (!user) return [];
    
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', user.uid),
        orderBy('occurredAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Transaction);
    } catch (error) {
      console.error("Erro ao listar transações do Firebase:", error);
      return [];
    }
  },

  async save(transaction: Transaction) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const transactionWithUser = { ...transaction, userId: user.uid };
      await setDoc(doc(db, COLLECTION_NAME, transaction.id), transactionWithUser);
      return transactionWithUser;
    } catch (error) {
      console.error("Erro ao salvar transação no Firebase:", error);
      throw error;
    }
  },

  async remove(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Erro ao remover transação no Firebase:", error);
      throw error;
    }
  }
};
