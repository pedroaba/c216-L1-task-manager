import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type CreateWorkspaceParams = {
  name: string;
  description: string;
};

export async function createWorkspace({
  name,
  description,
}: CreateWorkspaceParams) {
  try {
    const response = await apiClient.post<{ workspaceId: string }>(
      "/workspace",
      {
        name,
        description,
      }
    );

    if (response.status !== StatusCode.CREATED) {
      return httpMessageResponse({
        success: false,
        message: "Failed to create workspace",
      });
    }

    return httpMessageResponse<{ workspaceId: string }>({
      message: "Workspace created successfully",
      other: {
        workspaceId: response.data.workspaceId,
      },
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to create workspace",
      other: error,
    });
  }
}
