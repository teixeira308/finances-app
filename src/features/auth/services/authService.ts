import { auth } from '@/shared/services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  sendEmailVerification,
  type User
} from 'firebase/auth';

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const getCurrentUser = () => auth.currentUser;

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const changePassword = (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return updatePassword(user, newPassword);
};

export const changeEmail = (newEmail: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return updateEmail(user, newEmail);
};

export const reauthenticateUser = (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Usuário não autenticado");
  const credential = EmailAuthProvider.credential(user.email, password);
  return reauthenticateWithCredential(user, credential);
};

export const deleteUserAccount = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return deleteUser(user);
};

export const verifyEmail = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return sendEmailVerification(user);
};
