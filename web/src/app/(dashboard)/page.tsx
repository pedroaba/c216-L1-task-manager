import { FolderOpen, Plus } from "lucide-react";
import { CreateWorkspaceModal } from "@/components/create-workspace-modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="space-y-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50 transition-colors duration-300 hover:bg-muted">
            <FolderOpen
              className="size-10 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-3">
            <h1 className="font-semibold text-2xl tracking-tight">
              No workspace selected
            </h1>
            <p className="mx-auto max-w-sm text-balance text-muted-foreground text-sm leading-relaxed">
              Select a workspace from the sidebar or create a new one to get
              started
            </p>
          </div>

          {/* Action */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <CreateWorkspaceModal
              trigger={
                <Button className="min-w-[200px] shadow-sm" size="lg">
                  <Plus className="size-4" />
                  Create workspace
                </Button>
              }
            />
            <p className="text-muted-foreground text-xs">
              or choose an existing workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
