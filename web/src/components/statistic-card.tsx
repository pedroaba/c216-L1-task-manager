"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatisticCardProps = {
  title: string;
  value: string;
  change: number;
  isPositiveCard?: boolean;
};

export function StatisticCard({
  title,
  value,
  change,
  isPositiveCard = true,
}: StatisticCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-sm transition-all hover:shadow-md">
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-1",
          isPositiveCard && "bg-gradient-to-b from-green-500 to-green-600",
          !isPositiveCard && "bg-gradient-to-b from-red-500 to-red-600"
        )}
      />
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{title}</span>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs",
              isPositiveCard &&
                "bg-green-500/10 text-green-700 dark:text-green-400",
              !isPositiveCard && "bg-red-500/10 text-red-700 dark:text-red-400"
            )}
          >
            {isPositiveCard ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-3xl tracking-tight">{value}</div>
          <p className="text-muted-foreground text-xs">
            {isPositiveCard ? "Increased" : "Decreased"} from last period
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
