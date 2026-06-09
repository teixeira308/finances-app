import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';

export const TERMS_VERSION = '1.0.0';

export interface TermsAcceptance {
  accepted: boolean;
  acceptedAt: string;
  version: string;
  ip?: string;
}

export async function loadTermsAcceptance(): Promise<TermsAcceptance> {
  const user = auth.currentUser;
  if (!user) return { accepted: false, acceptedAt: '', version: '' };

  try {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.termsAccepted === true) {
        return {
          accepted: true,
          acceptedAt: data.termsAcceptedAt || '',
          version: data.termsVersion || '',
          ip: data.termsIp || undefined,
        };
      }
    }
    return { accepted: false, acceptedAt: '', version: '' };
  } catch {
    return { accepted: false, acceptedAt: '', version: '' };
  }
}

export async function acceptTerms(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  let ip: string | undefined;
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    ip = data.ip;
  } catch {
    // ip remains undefined
  }

  const payload: Record<string, unknown> = {
    termsAccepted: true,
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: TERMS_VERSION,
  };
  if (ip) payload.termsIp = ip;

  try {
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, payload);
  } catch {
    await setDoc(doc(db, 'users', user.uid), payload);
  }
}
