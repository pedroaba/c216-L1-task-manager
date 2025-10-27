"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartData = [
  {
    date: "2024-04-01",
    "E-commerce Platform": 45,
    "Mobile App": 32,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-04-02",
    "E-commerce Platform": 28,
    "Mobile App": 42,
    "Admin Dashboard": 15,
  },
  {
    date: "2024-04-03",
    "E-commerce Platform": 38,
    "Mobile App": 25,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-04-04",
    "E-commerce Platform": 52,
    "Mobile App": 48,
    "Admin Dashboard": 31,
  },
  {
    date: "2024-04-05",
    "E-commerce Platform": 67,
    "Mobile App": 55,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-04-06",
    "E-commerce Platform": 58,
    "Mobile App": 62,
    "Admin Dashboard": 35,
  },
  {
    date: "2024-04-07",
    "E-commerce Platform": 44,
    "Mobile App": 38,
    "Admin Dashboard": 21,
  },
  {
    date: "2024-04-08",
    "E-commerce Platform": 72,
    "Mobile App": 58,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-04-09",
    "E-commerce Platform": 18,
    "Mobile App": 24,
    "Admin Dashboard": 12,
  },
  {
    date: "2024-04-10",
    "E-commerce Platform": 48,
    "Mobile App": 35,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-04-11",
    "E-commerce Platform": 61,
    "Mobile App": 68,
    "Admin Dashboard": 39,
  },
  {
    date: "2024-04-12",
    "E-commerce Platform": 55,
    "Mobile App": 42,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-04-13",
    "E-commerce Platform": 63,
    "Mobile App": 72,
    "Admin Dashboard": 45,
  },
  {
    date: "2024-04-14",
    "E-commerce Platform": 32,
    "Mobile App": 48,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-04-15",
    "E-commerce Platform": 28,
    "Mobile App": 35,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-04-16",
    "E-commerce Platform": 31,
    "Mobile App": 42,
    "Admin Dashboard": 19,
  },
  {
    date: "2024-04-17",
    "E-commerce Platform": 78,
    "Mobile App": 68,
    "Admin Dashboard": 52,
  },
  {
    date: "2024-04-18",
    "E-commerce Platform": 65,
    "Mobile App": 82,
    "Admin Dashboard": 48,
  },
  {
    date: "2024-04-19",
    "E-commerce Platform": 44,
    "Mobile App": 38,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-04-20",
    "E-commerce Platform": 22,
    "Mobile App": 32,
    "Admin Dashboard": 15,
  },
  {
    date: "2024-04-21",
    "E-commerce Platform": 31,
    "Mobile App": 45,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-04-22",
    "E-commerce Platform": 48,
    "Mobile App": 38,
    "Admin Dashboard": 24,
  },
  {
    date: "2024-04-23",
    "E-commerce Platform": 32,
    "Mobile App": 52,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-04-24",
    "E-commerce Platform": 68,
    "Mobile App": 58,
    "Admin Dashboard": 35,
  },
  {
    date: "2024-04-25",
    "E-commerce Platform": 42,
    "Mobile App": 48,
    "Admin Dashboard": 31,
  },
  {
    date: "2024-04-26",
    "E-commerce Platform": 18,
    "Mobile App": 28,
    "Admin Dashboard": 12,
  },
  {
    date: "2024-04-27",
    "E-commerce Platform": 72,
    "Mobile App": 82,
    "Admin Dashboard": 48,
  },
  {
    date: "2024-04-28",
    "E-commerce Platform": 28,
    "Mobile App": 38,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-04-29",
    "E-commerce Platform": 58,
    "Mobile App": 48,
    "Admin Dashboard": 35,
  },
  {
    date: "2024-04-30",
    "E-commerce Platform": 82,
    "Mobile App": 72,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-05-01",
    "E-commerce Platform": 35,
    "Mobile App": 48,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-05-02",
    "E-commerce Platform": 58,
    "Mobile App": 68,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-05-03",
    "E-commerce Platform": 48,
    "Mobile App": 38,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-05-04",
    "E-commerce Platform": 72,
    "Mobile App": 82,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-05-05",
    "E-commerce Platform": 88,
    "Mobile App": 72,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-05-06",
    "E-commerce Platform": 92,
    "Mobile App": 98,
    "Admin Dashboard": 78,
  },
  {
    date: "2024-05-07",
    "E-commerce Platform": 72,
    "Mobile App": 58,
    "Admin Dashboard": 45,
  },
  {
    date: "2024-05-08",
    "E-commerce Platform": 32,
    "Mobile App": 48,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-05-09",
    "E-commerce Platform": 48,
    "Mobile App": 38,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-05-10",
    "E-commerce Platform": 58,
    "Mobile App": 68,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-05-11",
    "E-commerce Platform": 65,
    "Mobile App": 52,
    "Admin Dashboard": 38,
  },
  {
    date: "2024-05-12",
    "E-commerce Platform": 42,
    "Mobile App": 48,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-05-13",
    "E-commerce Platform": 42,
    "Mobile App": 32,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-05-14",
    "E-commerce Platform": 88,
    "Mobile App": 92,
    "Admin Dashboard": 68,
  },
  {
    date: "2024-05-15",
    "E-commerce Platform": 92,
    "Mobile App": 72,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-05-16",
    "E-commerce Platform": 68,
    "Mobile App": 82,
    "Admin Dashboard": 48,
  },
  {
    date: "2024-05-17",
    "E-commerce Platform": 98,
    "Mobile App": 82,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-05-18",
    "E-commerce Platform": 58,
    "Mobile App": 68,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-05-19",
    "E-commerce Platform": 48,
    "Mobile App": 38,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-05-20",
    "E-commerce Platform": 38,
    "Mobile App": 48,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-05-21",
    "E-commerce Platform": 22,
    "Mobile App": 32,
    "Admin Dashboard": 15,
  },
  {
    date: "2024-05-22",
    "E-commerce Platform": 21,
    "Mobile App": 28,
    "Admin Dashboard": 12,
  },
  {
    date: "2024-05-23",
    "E-commerce Platform": 52,
    "Mobile App": 58,
    "Admin Dashboard": 35,
  },
  {
    date: "2024-05-24",
    "E-commerce Platform": 58,
    "Mobile App": 48,
    "Admin Dashboard": 32,
  },
  {
    date: "2024-05-25",
    "E-commerce Platform": 42,
    "Mobile App": 52,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-05-26",
    "E-commerce Platform": 45,
    "Mobile App": 38,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-05-27",
    "E-commerce Platform": 82,
    "Mobile App": 88,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-05-28",
    "E-commerce Platform": 48,
    "Mobile App": 38,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-05-29",
    "E-commerce Platform": 18,
    "Mobile App": 28,
    "Admin Dashboard": 12,
  },
  {
    date: "2024-05-30",
    "E-commerce Platform": 68,
    "Mobile App": 58,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-05-31",
    "E-commerce Platform": 38,
    "Mobile App": 48,
    "Admin Dashboard": 28,
  },
  {
    date: "2024-06-01",
    "E-commerce Platform": 38,
    "Mobile App": 42,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-06-02",
    "E-commerce Platform": 88,
    "Mobile App": 82,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-06-03",
    "E-commerce Platform": 25,
    "Mobile App": 32,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-06-04",
    "E-commerce Platform": 82,
    "Mobile App": 72,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-06-05",
    "E-commerce Platform": 22,
    "Mobile App": 28,
    "Admin Dashboard": 15,
  },
  {
    date: "2024-06-06",
    "E-commerce Platform": 58,
    "Mobile App": 48,
    "Admin Dashboard": 35,
  },
  {
    date: "2024-06-07",
    "E-commerce Platform": 65,
    "Mobile App": 72,
    "Admin Dashboard": 48,
  },
  {
    date: "2024-06-08",
    "E-commerce Platform": 72,
    "Mobile App": 58,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-06-09",
    "E-commerce Platform": 82,
    "Mobile App": 88,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-06-10",
    "E-commerce Platform": 35,
    "Mobile App": 42,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-06-11",
    "E-commerce Platform": 22,
    "Mobile App": 32,
    "Admin Dashboard": 15,
  },
  {
    date: "2024-06-12",
    "E-commerce Platform": 92,
    "Mobile App": 82,
    "Admin Dashboard": 68,
  },
  {
    date: "2024-06-13",
    "E-commerce Platform": 21,
    "Mobile App": 28,
    "Admin Dashboard": 12,
  },
  {
    date: "2024-06-14",
    "E-commerce Platform": 82,
    "Mobile App": 72,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-06-15",
    "E-commerce Platform": 65,
    "Mobile App": 68,
    "Admin Dashboard": 48,
  },
  {
    date: "2024-06-16",
    "E-commerce Platform": 72,
    "Mobile App": 58,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-06-17",
    "E-commerce Platform": 88,
    "Mobile App": 98,
    "Admin Dashboard": 72,
  },
  {
    date: "2024-06-18",
    "E-commerce Platform": 25,
    "Mobile App": 32,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-06-19",
    "E-commerce Platform": 68,
    "Mobile App": 58,
    "Admin Dashboard": 42,
  },
  {
    date: "2024-06-20",
    "E-commerce Platform": 78,
    "Mobile App": 82,
    "Admin Dashboard": 65,
  },
  {
    date: "2024-06-21",
    "E-commerce Platform": 38,
    "Mobile App": 42,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-06-22",
    "E-commerce Platform": 65,
    "Mobile App": 52,
    "Admin Dashboard": 38,
  },
  {
    date: "2024-06-23",
    "E-commerce Platform": 88,
    "Mobile App": 98,
    "Admin Dashboard": 72,
  },
  {
    date: "2024-06-24",
    "E-commerce Platform": 32,
    "Mobile App": 38,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-06-25",
    "E-commerce Platform": 35,
    "Mobile App": 42,
    "Admin Dashboard": 25,
  },
  {
    date: "2024-06-26",
    "E-commerce Platform": 82,
    "Mobile App": 72,
    "Admin Dashboard": 58,
  },
  {
    date: "2024-06-27",
    "E-commerce Platform": 88,
    "Mobile App": 92,
    "Admin Dashboard": 68,
  },
  {
    date: "2024-06-28",
    "E-commerce Platform": 35,
    "Mobile App": 42,
    "Admin Dashboard": 22,
  },
  {
    date: "2024-06-29",
    "E-commerce Platform": 25,
    "Mobile App": 32,
    "Admin Dashboard": 18,
  },
  {
    date: "2024-06-30",
    "E-commerce Platform": 88,
    "Mobile App": 82,
    "Admin Dashboard": 65,
  },
];

const chartConfig = {
  ecommerce: {
    label: "E-commerce Platform",
    color: "#3b82f6",
  },
  mobile: {
    label: "Mobile App",
    color: "#10b981",
  },
  admin: {
    label: "Admin Dashboard",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

export function ProjectUsageGraph() {
  const transformedData = chartData.map((item) => ({
    date: item.date,
    ecommerce: item["E-commerce Platform"],
    mobile: item["Mobile App"],
    admin: item["Admin Dashboard"],
  }));

  const filteredData = transformedData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    const DAYS_TO_SUBTRACT = 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - DAYS_TO_SUBTRACT);
    return date >= startDate;
  });

  function genGradDefs() {
    return Object.keys(chartConfig).map((key) => (
      <linearGradient
        id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`}
        key={key}
        x1="0"
        x2="0"
        y1="0"
        y2="1"
      >
        <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
        <stop
          offset="95%"
          stopColor={`var(--color-${key})`}
          stopOpacity={0.1}
        />
      </linearGradient>
    ));
  }

  function genAreas() {
    return Object.keys(chartConfig).map((key) => (
      <Area
        dataKey={key}
        fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)})`}
        key={key}
        stackId="a"
        stroke={`var(--color-${key})`}
        type="natural"
      />
    ));
  }

  return (
    <Card className="pt-0 dark:bg-zinc-900">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b px-4 py-4! sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Task Usage by Project</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Monitor which projects are consuming the most tasks in your
            workspace
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart data={filteredData}>
            <defs>{genGradDefs()}</defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!(active && payload?.length)) {
                  return null;
                }

                const date = new Date(label);
                const totalTasks = payload.reduce(
                  (sum, entry) =>
                    sum + (typeof entry.value === "number" ? entry.value : 0),
                  0
                );

                return (
                  <div className="relative min-w-72 rounded-sm border border-zinc-200 bg-white p-4 opacity-90 shadow-xl backdrop-blur-3xl dark:border-zinc-700 dark:bg-zinc-900">
                    {/* Header with date */}
                    <div className="mb-5">
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {date.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                    </div>

                    {/* Project metrics */}
                    <div className="flex flex-col gap-0.5">
                      {payload.map((entry) => {
                        // Map dataKey to project name
                        const projectName =
                          chartConfig[entry.dataKey as keyof typeof chartConfig]
                            ?.label || entry.dataKey;

                        return (
                          <div
                            className="flex w-full items-center"
                            key={entry.dataKey}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-3 w-3 rounded-full shadow-sm"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <p
                                  className="max-w-40 truncate font-medium text-sm text-zinc-700 dark:text-zinc-300"
                                  title={projectName as string}
                                >
                                  {projectName}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                  {entry.value}
                                </span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                  tarefas
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Total section */}
                    <div className="mt-5 border-zinc-100 border-t pt-4 dark:border-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-zinc-600 dark:text-zinc-400">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-blue-600 text-lg dark:text-blue-400">
                            {totalTasks}
                          </span>
                          <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">
                            tarefas
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
              cursor
            />
            {genAreas()}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
