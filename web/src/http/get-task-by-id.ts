import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";
import type { TaskResponse } from "./list-task";

type GetTaskByIdResponse = {
  task: TaskResponse;
};

export async function getTaskById(id: string) {
  try {
    const response = await apiClient.get<GetTaskByIdResponse>(`/task/${id}`);

    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to get task",
      });
    }

    return httpMessageResponse<GetTaskByIdResponse>({
      message: "Task fetched successfully",
      other: response.data,
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to get task",
      other: error,
    });
  }
}

