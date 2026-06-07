import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { workspaceRepository } from "@/storage/repositories/workspaceRepository";
import { 
  setWorkspaces, 
  setLoading, 
  setError, 
  selectWorkspaces, 
  selectActiveWorkspaceId,
  selectActiveWorkspace,
  selectWorkspaceLoading,
  setActiveWorkspaceId
} from "../store/workspaceSlice";

export const useWorkspaces = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const workspaces = useAppSelector(selectWorkspaces);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const loading = useAppSelector(selectWorkspaceLoading);

  useEffect(() => {
    if (user) {
      const fetchWorkspaces = async () => {
        dispatch(setLoading(true));
        try {
          const list = await workspaceRepository.findAllByUserId(user.uid);
          dispatch(setWorkspaces(list));
        } catch (err) {
          dispatch(setError(err instanceof Error ? err.message : "Erro ao carregar workspaces"));
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchWorkspaces();
    }
  }, [user, dispatch]);

  const changeWorkspace = (id: string) => {
    dispatch(setActiveWorkspaceId(id));
  };

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    loading,
    changeWorkspace
  };
};
