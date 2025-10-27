import { CheckCircle2, Clock, Folder, MoreVertical, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProjectCardProps = {
  name: string;
  taskCount: number;
  completedTasks: number;
  color: string;
  members: number;
  lastUpdate: string;
};

const PERCENTAGE_MULTIPLIER = 100;

export function ProjectCard({
  name,
  taskCount,
  completedTasks,
  color,
  members,
  lastUpdate,
}: ProjectCardProps) {
  const progress =
    taskCount > 0 ? (completedTasks / taskCount) * PERCENTAGE_MULTIPLIER : 0;

  return (
    <Card className="group hover:-translate-y-0.5 cursor-pointer overflow-hidden p-0 transition-all hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="space-y-4 p-0">
        <div className={`relative h-32 ${color}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <Button
              className="size-8 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              size="icon-sm"
              variant="ghost"
            >
              <MoreVertical className="size-4" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <Folder className="size-8 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 pb-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base leading-tight">{name}</h3>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress className="h-1.5" value={progress} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
