"use client";

import { Inbox } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useGetProject } from "@/http/gen/endpoints/project/project.gen";
import { dayjsApi } from "@/lib/dayjs";
import { ProjectCard } from "./project-card";
import { ProjectCreateModal } from "./project-create-modal";
import {
  ProjectEditModal,
  type ProjectEditModalMethod,
} from "./project-edit-modal";

export function ProjectsSection() {
  const { workspaceSlug } = useParams();
  const { data, isLoading } = useGetProject();

  const [_, projects] = data ?? [];

  const projectEditModalRef = useRef<ProjectEditModalMethod | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Projects</h2>
          <p className="text-muted-foreground text-xs">
            Manage your project collections
          </p>
        </div>
        <ProjectCreateModal />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="col-span-4 flex h-64 w-full flex-col items-center justify-center">
            <Spinner className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        )}

        {!isLoading && projects?.total === 0 && (
          <div className="col-span-4 flex h-64 w-full flex-col items-center justify-center">
            <Inbox className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">No projects found</span>
          </div>
        )}

        {!isLoading &&
          (projects?.total ?? 0) > 0 &&
          projects?.projects.map((project) => (
            <ProjectCard
              color={project.background ?? "gray"}
              completedTasks={0}
              icon={project.icon ?? "Folder"}
              key={project.id}
              lastUpdate={dayjsApi(project.updatedAt).fromNow()}
              members={project.totalMembers}
              name={project.name}
              onEditProject={() => {
                projectEditModalRef.current?.open({
                  description: project.description ?? "",
                  icon: project.icon ?? "Folder",
                  id: project.id,
                  name: project.name,
                  slug: project.slug,
                });
              }}
              slug={project.slug}
              taskCount={0}
              workspaceSlug={String(workspaceSlug)}
            />
          ))}
      </div>

      <ProjectEditModal ref={projectEditModalRef} />
    </div>
  );
}
