import { StatusCode } from "@/constants/status-code";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type SignUpParams = {
  name: string;
  email: string;
  password: string;
};

export async function signUp({ name, email, password }: SignUpParams) {
  try {
    const response = await apiClient.post<{ userId: string }>(
      "/users/register",
      {
        name,
        email,
        password,
      }
    );

    if (response.status !== StatusCode.CREATED) {
      return httpMessageResponse({
        success: false,
        message: "Failed to sign up",
      });
    }

    return httpMessageResponse({
      message: "Sign up successful",
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to sign up",
      other: error,
    });
  }
}
