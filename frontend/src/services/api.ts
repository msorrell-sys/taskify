import axios, { AxiosInstance } from 'axios';
import { ApiResponse, ApiError } from '@taskify/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Axios instance configured for Taskify API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Response interceptor to handle API errors consistently
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      // Attach structured error to the error object
      error.apiError = apiError;
    }
    return Promise.reject(error);
  }
);

/**
 * Generic GET request
 */
export async function get<T>(url: string): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data.data;
}

/**
 * Generic POST request
 */
export async function post<T, D = any>(url: string, data: D): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data.data;
}

/**
 * Generic PATCH request
 */
export async function patch<T, D = any>(url: string, data: D): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data.data;
}

/**
 * Generic DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data.data;
}
