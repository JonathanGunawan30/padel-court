import axios from "axios";
import crypto from "crypto";

export const getAuthHeaders = (serviceConfig: { serviceName?: string, signatureKey?: string }, token?: string) => {
  const requestAt = new Date().toISOString();
  const serviceName = serviceConfig.serviceName || "";
  const signatureKey = serviceConfig.signatureKey || "";
  
  const validateKey = `${serviceName}:${signatureKey}:${requestAt}`;
  const apiKey = crypto.createHash('sha256').update(validateKey).digest('hex');

  const headers: any = {
    "x-service-name": serviceName,
    "x-request-at": requestAt,
    "x-api-key": apiKey,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (method: 'get' | 'post' | 'put' | 'delete', url: string, config: { 
  serviceConfig: { serviceName?: string, signatureKey?: string }, 
  token?: string,
  data?: any,
  params?: any
}) => {
  const headers = getAuthHeaders(config.serviceConfig, config.token);
  
  return axios({
    method,
    url,
    data: config.data,
    params: config.params,
    headers
  });
};
