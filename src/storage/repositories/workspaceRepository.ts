import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/shared/services/firebase";
import type { FinancialWorkspace } from "@/shared/models/finance";

const COLLECTION_NAME = "workspaces";

export const workspaceRepository = {
  async findById(id: string): Promise<FinancialWorkspace | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as FinancialWorkspace) : null;
  },

  async findAllByUserId(userId: string): Promise<FinancialWorkspace[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FinancialWorkspace);
  },

  async save(workspace: FinancialWorkspace): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, workspace.id);
    await setDoc(docRef, {
      ...workspace,
      updatedAt: new Date().toISOString()
    });
  },

  async update(id: string, data: Partial<FinancialWorkspace>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
