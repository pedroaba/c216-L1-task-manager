import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import type { User } from "@/types/user";
import { httpMessageResponse } from "@/utils/http-message";

type GetProfileResponse = User;

export async function getProfile() {
  try {
    const response = await apiClient.get<GetProfileResponse>("/users/me");

    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to get profile",
        other: response.data,
      });
    }

    return httpMessageResponse({
      message: "Profile fetched successfully",
      other: response.data,
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to get profile",
      other: error,
    });
  }
}
