"use client";

import { StatisticCard } from "@/components/statistic-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatisticsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Statistics</h2>
        <Select defaultValue="7d">
          <SelectTrigger className="w-fit gap-2">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          change={12.5}
          isPositiveCard={true}
          title="Total Tasks"
          value="243"
        />
        <StatisticCard
          change={8.3}
          isPositiveCard={true}
          title="Completed"
          value="186"
        />
        <StatisticCard
          change={-5.2}
          isPositiveCard={false}
          title="In Progress"
          value="42"
        />
        <StatisticCard
          change={15.7}
          isPositiveCard={true}
          title="Projects"
          value="3"
        />
      </div>
    </div>
  );
}
