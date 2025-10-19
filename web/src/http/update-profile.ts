import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type UpdateProfileParams = {
  userId: string;
  email: string;
  name: string;
};

export async function updateProfile({
  userId,
  email,
  name,
}: UpdateProfileParams) {
  try {
    const response = await apiClient.put(`/users/${userId}`, {
      email,
      name,
    });

    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to update profile",
      });
    }

    return httpMessageResponse({
      message: "Profile updated successfully",
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to update profile",
      other: error,
    });
  }
}
