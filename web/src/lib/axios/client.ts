import axios from "axios";
import { parseCookies } from "nookies";
import { appConfig } from "@/constants/app-config";
import { StatusCode } from "@/constants/status-code";
import { env } from "@/env";

export const baseURL = env.NEXT_PUBLIC_API_URL;
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const cookies = parseCookies(null);
  const token = cookies[appConfig.authCookieName];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.session = token;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === StatusCode.UNAUTHORIZED) {
      window.location.href = "/auth/sign-in";
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
