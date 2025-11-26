import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";
import type { TaskResponse } from "./list-task";

type UpdateTaskParams = {
  id: string;
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "in-review" | "done";
  priority?: "low" | "medium" | "high";
  assigneeId?: string | null;
  labels?: string[];
  dueDate?: string | null;
};

type UpdateTaskResponse = {
  task: TaskResponse;
};

export async function updateTask({
  id,
  title,
  description,
  status,
  priority,
  assigneeId,
  labels,
  dueDate,
}: UpdateTaskParams) {
  try {
    // Build payload, excluding undefined values
    const payload: Record<string, unknown> = {};
    
    if (title !== undefined) {
      payload.title = title;
    }
    
    if (description !== undefined) {
      payload.description = description;
    }
    
    if (status !== undefined) {
      payload.status = status;
    }
    
    if (priority !== undefined) {
      payload.priority = priority;
    }
    
    if (assigneeId !== undefined) {
      payload.assigneeId = assigneeId;
    }
    
    if (labels !== undefined) {
      payload.labels = labels;
    }
    
    if (dueDate !== undefined && dueDate !== null) {
      payload.dueDate = dueDate;
    } else if (dueDate === null) {
      // Explicitly set to null to clear the date
      payload.dueDate = null;
    }
    
    const response = await apiClient.put<UpdateTaskResponse>(`/task/${id}`, payload);

    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to update task",
      });
    }

    return httpMessageResponse<UpdateTaskResponse>({
      message: "Task updated successfully",
      other: response.data,
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to update task",
      other: error,
    });
  }
}

