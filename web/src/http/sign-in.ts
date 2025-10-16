import { setCookie } from "nookies";
import { appConfig } from "@/constants/app-config";
import { apiClient } from "@/lib/axios/client";
import { httpMessageResponse } from "@/utils/http-message";

type SignInParams = {
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

export async function signIn({ email, password }: SignInParams) {
  try {
    const response = await apiClient.post<SignInResponse>("/auth/sign-in", {
      email,
      password,
    });

    setCookie(null, appConfig.authCookieName, response.data.token, {
      path: "/",
    });

    return httpMessageResponse({
      message: "Sign in successful",
      other: {
        token: response.data.token,
      },
    });
  } catch (error) {
    return httpMessageResponse({
      success: false,
      message: "Failed to sign in",
      other: error,
    });
  }
}
