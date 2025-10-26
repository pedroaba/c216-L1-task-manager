import { Zap } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type TotalProjectAlertProps = {
  currentProjectLimit: number;
};

export function TotalProjectAlert({
  currentProjectLimit,
}: TotalProjectAlertProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-help">
        <div className="!cursor-help rounded-lg bg-blue-500/10 p-2">
          <Zap className="size-4 text-blue-600 dark:text-blue-400" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Zap className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm leading-tight">
                Project Limit Information
              </h4>
              <p className="text-muted-foreground text-xs">Free Plan Usage</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-md border border-border/50 bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Current Limit</span>
                <span className="font-bold text-primary text-sm">
                  {Intl.NumberFormat().format(currentProjectLimit)} projects
                </span>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Maximum number of projects you can create in your workspace
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-accent bg-accent/50 p-2">
              <span className="text-accent-foreground text-xs">💡</span>
              <p className="text-accent-foreground text-xs">
                Upgrade to Pro to unlock more projects and advanced features.
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
