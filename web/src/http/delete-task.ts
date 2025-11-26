import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

export async function deleteTask(id: string) {
  try {
    const response = await apiClient.delete(`/task/${id}`);

    if (response.status !== StatusCode.NO_CONTENT) {
      return httpMessageResponse({
        success: false,
        message: "Failed to delete task",
      });
    }

    return httpMessageResponse({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to delete task",
      other: error,
    });
  }
}

