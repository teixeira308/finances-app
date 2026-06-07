import React from "react";
import { Navigate } from "react-router-dom";
import { useWorkspaces } from "@/features/workspaces/hooks/useWorkspaces";
import { Spinner } from "react-bootstrap";
import { useMigration } from "@/features/workspaces/hooks/useMigration";

interface WorkspaceGuardProps {
  children: React.ReactNode;
}

export const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({ children }) => {
  const { workspaces, activeWorkspaceId, loading } = useWorkspaces();
  const { migrating } = useMigration();

  if ((loading || migrating) && workspaces.length === 0) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-black">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-ios-gray small fw-bold text-uppercase">Preparando seu ambiente...</p>
        </div>
      </div>
    );
  }

  // If no active workspace and multiple exist, go to selection
  if (!activeWorkspaceId && workspaces.length > 1) {
    return <Navigate to="/workspaces" replace />;
  }

  // If only one exists, it will be automatically activated by useWorkspaces/slice logic
  // but if not yet activated, we wait.
  if (!activeWorkspaceId && workspaces.length === 1) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-black">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // If zero workspaces, we need migration or onboarding
  if (workspaces.length === 0 && !loading && !migrating) {
    return <Navigate to="/workspaces" replace />;
  }

  return <>{children}</>;
};
