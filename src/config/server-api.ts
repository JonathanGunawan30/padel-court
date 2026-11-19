import { createHash } from "node:crypto";

export type ServiceName = "field" | "user" | "order";

export interface ServiceConfig {
  baseUrl?: string;
  serviceName?: string;
  signatureKey?: string;
}

export const serverApiConfig: Record<ServiceName, ServiceConfig> = {
  field: {
    baseUrl: process.env.FIELD_API_URL,
    serviceName: process.env.FIELD_SERVICE_NAME,
    signatureKey: process.env.FIELD_SIGNATURE_KEY,
  },
  user: {
    baseUrl: process.env.USER_API_URL,
    serviceName: process.env.USER_SERVICE_NAME,
    signatureKey: process.env.USER_SIGNATURE_KEY,
  },
  order: {
    baseUrl: process.env.ORDER_API_URL,
    serviceName: process.env.ORDER_SERVICE_NAME,
    signatureKey: process.env.ORDER_SIGNATURE_KEY,
  },
};

export function isValidService(service: string): service is ServiceName {
  return service === "field" || service === "user" || service === "order";
}

export function getServerAuthHeaders(serviceConfig: ServiceConfig, token?: string): Record<string, string> {
  const requestAt = new Date().toISOString();
  const serviceName = serviceConfig.serviceName || "";
  const signatureKey = serviceConfig.signatureKey || "";

  const validateKey = `${serviceName}:${signatureKey}:${requestAt}`;
  const apiKey = createHash("sha256").update(validateKey).digest("hex");

  const headers: Record<string, string> = {
    "x-service-name": serviceName,
    "x-request-at": requestAt,
    "x-api-key": apiKey,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
