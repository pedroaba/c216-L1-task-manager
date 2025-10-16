import axios from "axios";
import { env } from "@/env";

export const baseURL = env.API_URL;
export const apiClient = axios.create({
  baseURL: env.API_URL,
});
