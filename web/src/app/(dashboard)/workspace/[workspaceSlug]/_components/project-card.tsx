import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  icons,
  MoreVertical,
  PenLine,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteProjectIdOrSlug,
  getGetProjectQueryKey,
} from "@/http/gen/endpoints/project/project.gen";
import { camelCasify } from "@/utils/camel-casify";

type ProjectCardProps = {
  name: string;
  taskCount: number;
  completedTasks: number;
  color: string;
  members: number;
  lastUpdate: string;
  workspaceSlug: string;
  slug: string;
  icon: string;
  onEditProject: () => void;
};

export function ProjectCard({
  name,
  taskCount,
  completedTasks,
  color,
  members,
  lastUpdate,
  workspaceSlug,
  slug,
  onEditProject,
  icon,
}: ProjectCardProps) {
  const queryClient = useQueryClient();

  async function handleDeleteProject() {
    const toastId = toast.loading("Deleting project...");
    const [error] = await deleteProjectIdOrSlug(slug);

    if (error) {
      toast.error("Failed to delete project", { id: toastId });
      return;
    }

    toast.success("Project deleted successfully", { id: toastId });
    await queryClient.invalidateQueries({
      queryKey: getGetProjectQueryKey(),
    });
  }

  const Icon =
    icons[
      camelCasify(icon, {
        keepFirstLetterUpperCase: true,
      }) as keyof typeof icons
    ];

  return (
    <Link href={`/workspace/${workspaceSlug}/projects/${slug}`}>
      <Card className="group hover:-translate-y-0.5 cursor-pointer overflow-hidden p-0 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="space-y-4 p-0">
          <div className={`relative h-32 ${color}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="size-8 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();

                      onEditProject();
                    }}
                  >
                    <PenLine className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive hover:text-destructive!"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDeleteProject();
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <Icon className="size-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="space-y-4 px-5 pb-5">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base leading-tight">
                  {name}
                </h3>
                <Badge className="shrink-0" variant="secondary">
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>
                    {completedTasks}/{taskCount}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  <span>{members}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  <span>{lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
