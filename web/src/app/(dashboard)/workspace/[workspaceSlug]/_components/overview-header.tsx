import { FolderOpen } from "lucide-react";
import { WorkspaceStatus } from "./workspace-status";

type OverviewHeaderProps = {
  workspaceName: string;
};

export function OverviewHeader({ workspaceName }: OverviewHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 p-3">
            <FolderOpen className="size-6 text-primary" strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-2xl tracking-tight">
                {workspaceName}
              </h1>
              <WorkspaceStatus />
            </div>
            <p className="text-muted-foreground text-sm">
              Manage your projects and track your task usage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
