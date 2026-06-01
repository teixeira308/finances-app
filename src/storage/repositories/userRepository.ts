import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';
import type { UserProfile } from '@/shared/models/finance';

const COLLECTION_NAME = 'users';

export const userRepository = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  async createInitialProfile(uid: string, email: string, displayName?: string): Promise<UserProfile> {
    const names = (displayName || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const newProfile: UserProfile = {
      id: uid,
      email: email,
      firstName,
      lastName,
      displayName: displayName || email.split('@')[0],
      preferences: {
        theme: 'dark',
        privacyMode: false
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        version: 1
      }
    };

    try {
      await setDoc(doc(db, COLLECTION_NAME, uid), newProfile);
      return newProfile;
    } catch (error) {
      console.error("Erro ao criar perfil inicial:", error);
      throw error;
    }
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      await updateDoc(docRef, {
        ...data,
        'metadata.lastUpdate': new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  }
};
