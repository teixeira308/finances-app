import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { migrationService } from "../services/migrationService";
import { useWorkspaces } from "../hooks/useWorkspaces";

export const useMigration = () => {
  const { user } = useAuth();
  const { workspaces, loading: workspacesLoading } = useWorkspaces();
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    if (user && !workspacesLoading && workspaces.length === 0) {
      const run = async () => {
        setMigrating(true);
        try {
          await migrationService.runMigrationV2(user.uid);
          // Workspaces updated via onSnapshot in useWorkspaces
        } catch (err) {
          console.error("Migration failed:", err);
        } finally {
          setMigrating(false);
        }
      };
      run();
    }
  }, [user, workspaces, workspacesLoading]);

  return { migrating };
};
