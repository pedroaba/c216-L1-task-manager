import { parseCookies } from "nookies";
import { appConfig } from "@/constants/app-config";
import { env } from "@/env";

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

  // 1) monta a URL usando baseURL da variável de ambiente ou do config
  const baseURL = config.baseURL || env.NEXT_PUBLIC_API_URL;
  let url = config.url ?? "";

  // Se a URL já é completa (começa com http), substitui o host pela baseURL
  // Caso contrário, concatena com baseURL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Extrai o path da URL hardcoded e usa com baseURL
    try {
      const urlObj = new URL(url);
      url = `${baseURL}${urlObj.pathname}${urlObj.search}`;
    } catch {
      // Se falhar ao parsear, tenta substituir manualmente
      url = url.replace(/^https?:\/\/[^/]+/, baseURL);
    }
  } else {
    // Se não começa com http, concatena com baseURL
    url = `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
  }

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
