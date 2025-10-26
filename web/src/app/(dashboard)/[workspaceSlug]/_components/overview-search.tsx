import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function OverviewSearch() {
  return (
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Search for workspaces, tasks, etc"
        type="search"
      />
    </div>
  );
}
