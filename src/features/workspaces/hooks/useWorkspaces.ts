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
    if (!user) return;

    if (workspaces.length === 0) {
      dispatch(setLoading(true));
    }

    const unsubscribe = workspaceRepository.subscribeToWorkspacesByUserId(
      user.uid,
      (workspaces) => {
        dispatch(setWorkspaces(workspaces));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
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
