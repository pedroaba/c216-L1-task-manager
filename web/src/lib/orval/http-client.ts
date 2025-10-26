import { parseCookies } from "nookies";
import { appConfig } from "@/constants/app-config";

export type RequestConfig<TData = unknown> = {
  baseURL?: string;
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  data?: TData | FormData;
  params?: object;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export type ResponseConfig<TData = unknown, TError = unknown> = [
  TError | null,
  TData | null,
];

export type ResponseErrorConfig<TError = unknown> = TError;

export const httpClient = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData, TError>> => {
  const cookies = parseCookies();
  const token = cookies[appConfig.authCookieName];
  if (token) {
    const headers = new Headers(config.headers);
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("session", token);
    config.headers = headers;
  }

  const response = await fetch(`${config.url}`, {
    method: config.method.toUpperCase(),
    body: config.data ? JSON.stringify(config.data) : undefined,
    signal: config.signal,
    headers: config.headers,
  });

  const data = await response.json();

  if (!response.ok) {
    return [data as TError, null];
  }

  return [null, data as TData];
};

export default httpClient;
