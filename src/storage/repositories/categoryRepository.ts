import { 
  collection, 
  getDocs, 
  setDoc, 
  doc,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';
import type { Category } from '@/shared/models/finance';

const COLLECTION_NAME = 'categories';

export const categoryRepository = {
  async list() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Category);
    } catch (error) {
      console.error("Erro ao listar categorias do Firebase:", error);
      return [];
    }
  },

  async save(category: Category) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const categoryWithUser = { ...category, userId: user.uid };
      await setDoc(doc(db, COLLECTION_NAME, category.id), categoryWithUser);
      return categoryWithUser;
    } catch (error) {
      console.error("Erro ao salvar categoria no Firebase:", error);
      throw error;
    }
  },

  async remove(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Erro ao remover categoria no Firebase:", error);
      throw error;
    }
  }
};
