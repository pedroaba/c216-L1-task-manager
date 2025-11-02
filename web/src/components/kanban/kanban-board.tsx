"use client";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { KanbanColumn } from "./kanban-column";
import type { Task } from "./task-card";
import { TaskCard } from "./task-card";

type KanbanBoardProps = {
  initialTasks: Task[];
  columns: Array<{
    id: string;
    title: string;
    color: string;
  }>;
};

export function KanbanBoard({ initialTasks, columns }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) {
      return;
    }

    const overData = over.data.current;

    // Check if we're dragging over a column
    if (overData?.type === "column") {
      const newColumnId = overData.columnId;

      if (activeTask.status !== newColumnId) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeId ? { ...task, status: newColumnId } : task
          )
        );
      }
    }

    // Check if we're dragging over another task
    if (overData?.type === "task") {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) {
        return;
      }

      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeTask.status !== overTask.status) {
        // Moving to a different column
        setTasks((tasks) => {
          const updatedTasks = [...tasks];
          updatedTasks[activeIndex] = {
            ...activeTask,
            status: overTask.status,
          };
          return updatedTasks;
        });
      } else {
        // Reordering within the same column
        setTasks((tasks) => {
          const updatedTasks = [...tasks];
          updatedTasks.splice(activeIndex, 1);
          updatedTasks.splice(overIndex, 0, activeTask);
          return updatedTasks;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) {
      return;
    }

    const overData = over.data.current;

    // Final drop on a column
    if (overData?.type === "column") {
      const newColumnId = overData.columnId;

      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId ? { ...task, status: newColumnId } : task
        )
      );
    }
  };

  const getTasksByColumn = (columnId: string) =>
    tasks.filter((task) => task.status === columnId);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="inline-flex h-full w-full min-w-[680px] gap-6">
        {columns.map((column) => (
          <KanbanColumn
            column={column}
            key={column.id}
            tasks={getTasksByColumn(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 cursor-grabbing">
            <TaskCard columnId={activeTask.status} task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
