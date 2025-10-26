import { Crown } from "lucide-react";
import { Button } from "./ui/button";

export function UpgradeBanner() {
  return (
    <div className="rounded-xl border-2 border-primary/20 border-dashed bg-zinc-50 p-4 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <Crown className="size-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-sm">Upgrade to Pro</p>
          <p className="text-muted-foreground text-xs">
            Get unlimited tasks, projects and premium features
          </p>
        </div>
        <Button className="shrink-0 shadow-sm" size="sm">
          Upgrade
        </Button>
      </div>
    </div>
  );
}
