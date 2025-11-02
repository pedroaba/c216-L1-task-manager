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

  // 1) monta a URL
  let url = config.url ?? "";

  if (config.params && Object.keys(config.params).length > 0) {
    const search = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        search.append(key, String(value));
      }
    });

    const qs = search.toString();
    if (qs) {
      url = `${url}${url.includes("?") ? "&" : "?"}${qs}`;
    }
  }

  // 2) headers com token
  const headers = new Headers(config.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("session", token);
  }

  const response = await fetch(url, {
    method: config.method,
    body: config.data ? JSON.stringify(config.data) : undefined,
    signal: config.signal,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return [data as TError, null];
  }

  return [null, data as TData];
};

export default httpClient;
