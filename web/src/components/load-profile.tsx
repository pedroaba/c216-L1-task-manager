import { Loader2 } from "lucide-react";

export function LoadProfile() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="flex flex-col items-center gap-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
          <Loader2 className="relative size-16 animate-spin text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-semibold text-xl tracking-tight">
            Welcome back!
          </h2>
          <p className="max-w-sm text-muted-foreground text-sm">
            We're loading your workspace and getting everything ready
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-2 flex justify-between text-muted-foreground text-xs">
            <span>Loading profile...</span>
            <span>Almost there</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-primary/50 to-primary" />
          </div>
        </div>
        <p className="text-center text-muted-foreground text-xs">
          This usually takes just a few seconds
        </p>
      </div>
    </div>
  );
}
