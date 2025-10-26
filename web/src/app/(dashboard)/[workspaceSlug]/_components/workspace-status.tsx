import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function WorkspaceStatus() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="gap-1 p-1 px-2" variant="outline">
          <div className="size-2 animate-pulse rounded-full bg-green-500" />
          Active
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-green-500 shadow-sm" />
            <p className="font-semibold text-sm">Workspace Status</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Health</span>
              <Badge className="h-5 px-2 text-xs" variant="secondary">
                Excellent
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Uptime</span>
              <span className="font-medium text-xs">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Projects</span>
              <span className="font-medium text-xs">12 active</span>
            </div>
          </div>
          <div className="border-t pt-2">
            <p className="text-muted-foreground text-xs leading-relaxed">
              All systems operational. Your workspace is running smoothly and
              ready for project management.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
