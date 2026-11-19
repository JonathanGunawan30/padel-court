import axios from "axios";

export type ApiService = "field" | "user" | "order";

export const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  service: ApiService,
  path: string,
  config?: {
    data?: unknown;
    params?: Record<string, unknown>;
  }
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return axios({
    method,
    url: `/api/proxy/${service}${normalizedPath}`,
    data: config?.data,
    params: config?.params,
    withCredentials: true,
  });
};
