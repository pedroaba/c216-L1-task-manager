import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type ListTaskParams = {
  page?: number;
  limit?: number;
  q?: string;
  projectId?: string;
  status?: "todo" | "in-progress" | "in-review" | "done";
  priority?: "low" | "medium" | "high";
  assigneeId?: string;
};

export type TaskResponse = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  labels: string[];
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
};

type ListTaskResponse = {
  tasks: TaskResponse[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export async function listTasks(params?: ListTaskParams) {
  try {
    const response = await apiClient.get<ListTaskResponse>("/task", {
      params,
    });

    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to list tasks",
      });
    }

    return httpMessageResponse<ListTaskResponse>({
      message: "Tasks fetched successfully",
      other: response.data,
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to list tasks",
      other: error,
    });
  }
}

