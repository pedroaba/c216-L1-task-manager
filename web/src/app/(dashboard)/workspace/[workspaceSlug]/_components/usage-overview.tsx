"use client";

import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { cn } from "@/lib/utils";
import { ProjectUsageGraph } from "./project-usage-graph";
import { TotalProjectAlert } from "./total-project-alert";
import { TotalTaskAlert } from "./total-task-alert";

type ProjectUsage = {
  name: string;
  tasks: number;
  maxTasks: number;
  color: string;
};

const MAX_TASKS_PER_PROJECT_FREE_PLAN = 1000;
const MAX_PROJECTS_FREE_PLAN = 5;
const PERCENTAGE_MULTIPLIER = 100;
const HIGH_USAGE_THRESHOLD = 80;

const mockProjects: ProjectUsage[] = [
  {
    name: "Website Redesign",
    tasks: 45,
    maxTasks: MAX_TASKS_PER_PROJECT_FREE_PLAN,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Mobile App",
    tasks: 120,
    maxTasks: MAX_TASKS_PER_PROJECT_FREE_PLAN,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Marketing Campaign",
    tasks: 78,
    maxTasks: MAX_TASKS_PER_PROJECT_FREE_PLAN,
    color: "from-green-500 to-green-600",
  },
];

export function UsageOverview() {
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.tasks, 0);
  const totalProjects = mockProjects.length;
  const maxProjects = MAX_PROJECTS_FREE_PLAN;
  const totalMaxTasks = MAX_TASKS_PER_PROJECT_FREE_PLAN;
  const usagePercentage = (totalTasks / totalMaxTasks) * PERCENTAGE_MULTIPLIER;
  const projectsUsagePercentage =
    (totalProjects / maxProjects) * PERCENTAGE_MULTIPLIER;
  const isHighUsage = usagePercentage > HIGH_USAGE_THRESHOLD;

  return (
    <Card className="gap-4 overflow-hidden border-2 p-0">
      <CardHeader className="bg-zinc-50 p-4 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div className="">
            <div className="flex items-center gap-2">
              <CardTitle className="font-semibold text-base">
                Workspace Usage
              </CardTitle>
              <Badge className="gap-1" variant="secondary">
                <Zap className="size-3" />
                Free Plan
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Track your tasks and projects usage
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="m-0 p-4 pt-1">
        {/* Overall Usage */}
        <div className="mb-4 space-y-4">
          <p className="font-semibold">Usage Overview</p>

          <div className="rounded-xl border bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TotalTaskAlert currentTaskLimit={totalMaxTasks} />
                  <span className="font-medium text-sm">Total Tasks</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {Intl.NumberFormat().format(totalTasks)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    of {Intl.NumberFormat().format(totalMaxTasks)} available
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Progress
                  className={cn(
                    "h-2.5",
                    usagePercentage > HIGH_USAGE_THRESHOLD && "bg-red-500/30"
                  )}
                  indicatorClassName={cn(
                    usagePercentage > HIGH_USAGE_THRESHOLD && "bg-red-500"
                  )}
                  value={usagePercentage}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {usagePercentage.toFixed(2)}% used
                  </span>
                  {isHighUsage && (
                    <Badge className="text-xs" variant="destructive">
                      High Usage
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TotalProjectAlert currentProjectLimit={maxProjects} />
                  <span className="font-medium text-sm">Active Projects</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{totalProjects}</p>
                  <p className="text-muted-foreground text-xs">
                    of {maxProjects} available
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Progress
                  className={cn(
                    "h-2.5",
                    projectsUsagePercentage > HIGH_USAGE_THRESHOLD &&
                      "bg-red-500/30"
                  )}
                  indicatorClassName={cn(
                    projectsUsagePercentage > HIGH_USAGE_THRESHOLD &&
                      "bg-red-500"
                  )}
                  value={projectsUsagePercentage}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {maxProjects - totalProjects} slots remaining
                  </span>

                  {projectsUsagePercentage > HIGH_USAGE_THRESHOLD && (
                    <Badge className="text-xs" variant="destructive">
                      High Usage
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ProjectUsageGraph />
        </div>

        <Separator className="mb-4" />

        <UpgradeBanner />
      </CardContent>
    </Card>
  );
}
