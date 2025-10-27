import { ChevronDown, Plus } from "lucide-react";
import { CreateWorkspaceModal } from "@/components/create-workspace-modal";
import { Card, CardContent } from "@/components/ui/card";

type WorkspaceCardProps = {
  name: string;
  count: number;
  gradient: string;
};

function WorkspaceCard({ name, count, gradient }: WorkspaceCardProps) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md">
      <CardContent className="space-y-3 py-5">
        <div className={`h-24 rounded-lg ${gradient}`} />
        <div className="space-y-1">
          <h3 className="font-semibold text-base">{name}</h3>
          <p className="text-muted-foreground text-sm">
            {count === 0 ? "No tasks yet" : `${count} tasks`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkspacesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-lg">Your workspaces</h2>
        <ChevronDown className="size-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateWorkspaceModal
          trigger={
            <Card className="group cursor-pointer border-dashed transition-all hover:border-primary hover:bg-accent/50">
              <CardContent className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 py-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Plus className="size-6 text-primary" />
                </div>
                <span className="font-medium text-sm">Create Workspace</span>
              </CardContent>
            </Card>
          }
        />

        <WorkspaceCard
          count={0}
          gradient="bg-gradient-to-br from-purple-500/20 to-purple-700/20"
          name="General"
        />
      </div>
    </div>
  );
}
