"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import type { Task } from "@/components/kanban/task-card";
import { listTasks, type TaskResponse } from "@/http/list-task";

// Type guard for ListTaskResponse
function isListTaskResponse(
  other: unknown
): other is { tasks: TaskResponse[]; total: number; page: number; limit: number; hasNextPage: boolean } {
  return (
    typeof other === "object" &&
    other !== null &&
    "tasks" in other &&
    Array.isArray((other as { tasks: unknown }).tasks)
  );
}
import { deleteTask } from "@/http/delete-task";
import { convertTaskResponseToTask } from "@/utils/task-utils";
import { Spinner } from "@/components/ui/spinner";
import { useGetProjectIdOrSlug } from "@/http/gen/endpoints/project/project.gen";
import {
  TaskEditModal,
  type TaskEditModalMethod,
} from "./task-edit-modal";
import { TaskCreateModal } from "./task-create-modal";
import {
  TaskPreviewModal,
  type TaskPreviewModalMethod,
} from "./task-preview-modal";

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "in-review", title: "In Review", color: "bg-yellow-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

export function TasksBoard() {
  const { projectSlug } = useParams();
  const queryClient = useQueryClient();
  const taskEditModalRef = useRef<TaskEditModalMethod | null>(null);
  const taskPreviewModalRef = useRef<TaskPreviewModalMethod | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<
    "todo" | "in-progress" | "in-review" | "done"
  >("todo");

  // First, get the project by slug to get the project ID
  const {
    data: projectResponse,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProjectIdOrSlug(String(projectSlug));

  // httpClient returns [error, data] format - same pattern as useGetProject
  const [projectErrorData, projectData] = projectResponse ?? [];

  // Extract project ID
  const projectId = projectData?.project?.id || null;

  // Then, fetch tasks using the project ID
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!projectId) {
        return [];
      }

      const response = await listTasks({
        projectId,
      });

      if (!response.success || !isListTaskResponse(response.other)) {
        toast.error(response.message || "Failed to load tasks");
        return [];
      }

      return response.other.tasks.map(convertTaskResponseToTask);
    },
    enabled: !!projectId,
  });

  if (isLoadingProject || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Check for errors - projectErrorData is null on success, error object on failure
  if (projectError || (projectErrorData && projectErrorData !== null)) {
    const errorMessage =
      (projectErrorData &&
        typeof projectErrorData === "object" &&
        "message" in projectErrorData &&
        typeof projectErrorData.message === "string"
        ? projectErrorData.message
        : null) ||
      (projectError instanceof Error ? projectError.message : null) ||
      "Project not found";
    
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            Error loading project
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  // Check if project was not found (projectData is null but no error)
  if (!isLoadingProject && !projectData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            Project not found
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            The project "{projectSlug}" does not exist
          </p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            Error loading tasks
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {queryError instanceof Error ? queryError.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const tasks: Task[] = data ?? [];

  async function handleEditTask(task: Task) {
    taskEditModalRef.current?.open(task);
  }

  function handlePreviewTask(task: Task) {
    // Always get the latest task data from the query cache before opening
    const queryData = queryClient.getQueryData<Task[]>(["tasks"]);
    const latestTask = queryData?.find((t) => t.id === task.id) || task;
    taskPreviewModalRef.current?.open(latestTask);
  }

  async function handleDeleteTask(taskId: string) {
    const toastId = toast.loading("Deleting task...");
    const response = await deleteTask(taskId);

    if (!response.success) {
      toast.error(response.message || "Failed to delete task", { id: toastId });
      return;
    }

    toast.success(response.message || "Task deleted successfully", { id: toastId });
    // Invalidate and refetch tasks queries
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
    
    // Force refetch to ensure the list is updated immediately
    queryClient.refetchQueries({
      queryKey: ["tasks"],
    });
  }

  function handleCreateTask(status: string) {
    // Map column IDs to status values
    const statusMap: Record<string, "todo" | "in-progress" | "in-review" | "done"> = {
      todo: "todo",
      "in-progress": "in-progress",
      "in-review": "in-review",
      done: "done",
    };
    
    setInitialStatus(statusMap[status] || "todo");
    setIsCreateModalOpen(true);
  }

  return (
    <>
      <KanbanBoard
        columns={columns}
        initialTasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onCreateTask={handleCreateTask}
        onPreviewTask={handlePreviewTask}
      />
      <TaskEditModal ref={taskEditModalRef} />
      <TaskPreviewModal
        ref={taskPreviewModalRef}
        onDelete={handleDeleteTask}
      />
      <TaskCreateModal
        initialStatus={initialStatus}
        onOpenChange={setIsCreateModalOpen}
        open={isCreateModalOpen}
      />
    </>
  );
}

