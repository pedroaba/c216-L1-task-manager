import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";

export function ProjectsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Projects</h2>
          <p className="text-muted-foreground text-xs">
            Manage your project collections
          </p>
        </div>
        <Button className="shadow-sm" size="sm">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          color="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          completedTasks={32}
          lastUpdate="2h ago"
          members={4}
          name="Website Redesign"
          taskCount={45}
        />
        <ProjectCard
          color="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700"
          completedTasks={89}
          lastUpdate="1d ago"
          members={7}
          name="Mobile App"
          taskCount={120}
        />
        <ProjectCard
          color="bg-gradient-to-br from-green-500 via-green-600 to-green-700"
          completedTasks={54}
          lastUpdate="3h ago"
          members={3}
          name="Marketing Campaign"
          taskCount={78}
        />
      </div>
    </div>
  );
}
