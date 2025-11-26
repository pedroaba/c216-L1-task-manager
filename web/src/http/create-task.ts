import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type CreateTaskParams = {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  status?: "todo" | "in-progress" | "in-review" | "done";
  priority?: "low" | "medium" | "high";
  labels?: string[];
  dueDate?: string;
};

export async function createTask({
  title,
  description,
  projectId,
  assigneeId,
  status = "todo",
  priority = "medium",
  labels = [],
  dueDate,
}: CreateTaskParams) {
  try {
    // Build payload, excluding undefined values
    const payload: Record<string, unknown> = {
      title,
      projectId,
      status,
      priority,
      labels,
    };
    
    if (description !== undefined) {
      payload.description = description;
    }
    
    if (assigneeId !== undefined) {
      payload.assigneeId = assigneeId;
    }
    
    if (dueDate !== undefined) {
      payload.dueDate = dueDate;
    }
    
    const response = await apiClient.post<{ taskId: string }>("/task", payload);

    if (response.status !== StatusCode.CREATED) {
      return httpMessageResponse({
        success: false,
        message: "Failed to create task",
      });
    }

    return httpMessageResponse<{ taskId: string }>({
      message: "Task created successfully",
      other: {
        taskId: response.data.taskId,
      },
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to create task",
      other: error,
    });
  }
}

