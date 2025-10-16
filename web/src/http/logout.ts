import { destroyCookie } from "nookies";
import { appConfig } from "@/constants/app-config";
import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

export async function logout() {
  try {
    const response = await apiClient.post("/auth/sign-out");
    if (response.status !== StatusCode.OK) {
      return httpMessageResponse({
        success: false,
        message: "Failed to logout",
        other: response.data,
      });
    }

    destroyCookie(null, appConfig.authCookieName);

    return httpMessageResponse({
      message: "Logout successful",
      other: {},
    });
  } catch (error) {
    return httpMessageResponse({
      message: "Failed to logout",
      other: error,
    });
  }
}
