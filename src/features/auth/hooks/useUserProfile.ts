import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { userRepository } from '@/storage/repositories/userRepository';
import type { UserProfile } from '@/shared/models/finance';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let userProfile = await userRepository.getProfile(user.uid);
      
      // Se não existir perfil, cria um inicial (Migração Progressiva)
      if (!userProfile && user.email) {
        userProfile = await userRepository.createInitialProfile(
          user.uid, 
          user.email, 
          user.displayName || undefined
        );
      }
      
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await userRepository.updateProfile(user.uid, data);
      await fetchProfile(); // Recarrega
    } catch (err) {
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile
  };
}
