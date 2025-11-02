"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CirclePlus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "./task-card";
import { TaskCard } from "./task-card";

type KanbanColumnProps = {
  column: {
    id: string;
    title: string;
    color: string;
  };
  tasks: Task[];
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <div className="@container flex h-full w-full min-w-fit max-w-sm shrink-0 flex-col">
      {/* Column Header */}
      <div className="mb-4 flex flex-shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2 rounded-full",
              column.id === "in-progress" && "animate-pulse",
              column.color
            )}
          />
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            {column.title}
          </h3>
          <Badge className="ml-1" variant="secondary">
            {tasks.length}
          </Badge>
        </div>
        <Button className="size-8" size="icon" variant="ghost">
          <Plus className="size-4" />
        </Button>
      </div>

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg transition-colors",
          tasks.length === 0 && "gap-0",
          isOver && "bg-muted/50"
        )}
        ref={setNodeRef}
      >
        <SortableContext
          id={column.id}
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={cn("space-y-3")}>
            {tasks.map((task) => (
              <TaskCard columnId={column.id} key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <CirclePlus className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Add new task</p>
          </div>
        )}
      </div>
    </div>
  );
}
