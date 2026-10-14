import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import appConfig from '../../config';
import type { ApiSuccessResponse } from '../../types/api';
import headersUtil from '../headers';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Auth endpoints that must never trigger the refresh-and-retry flow
const NO_REFRESH_URLS = ['/auth/login', '/auth/refresh', '/auth/logout'];

class ApiCall {
  private static instance: ApiCall;
  private readonly client: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;
  private onUnauthorized?: () => void;

  private constructor() {
    this.client = axios.create({
      baseURL: appConfig.apiBaseUrl,
      withCredentials: true,
      headers: headersUtil.getDefault(),
    });
    this.client.interceptors.response.use(undefined, this.handleResponseError);
  }

  public static getInstance(): ApiCall {
    if (!ApiCall.instance) {
      ApiCall.instance = new ApiCall();
    }
    return ApiCall.instance;
  }

  // Called when the session can't be refreshed (e.g. to clear auth state)
  public setUnauthorizedHandler(handler: () => void): void {
    this.onUnauthorized = handler;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<ApiSuccessResponse<T>>(url, config);
    return res.data.data;
  }

  public async post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.post<ApiSuccessResponse<T>>(url, body, config);
    return res.data.data;
  }

  public async put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<ApiSuccessResponse<T>>(url, body, config);
    return res.data.data;
  }

  public async patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.patch<ApiSuccessResponse<T>>(url, body, config);
    return res.data.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<ApiSuccessResponse<T>>(url, config);
    return res.data.data;
  }

  // Multipart upload with progress reported as 0–100
  public async upload<T>(
    url: string,
    body: FormData,
    onProgress?: (percent: number) => void,
  ): Promise<T> {
    const res = await this.client.post<ApiSuccessResponse<T>>(url, body, {
      headers: headersUtil.getMultipart(),
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
    return res.data.data;
  }

  // Same-origin URL for links such as file downloads
  public url(path: string): string {
    return `${appConfig.apiBaseUrl}${path}`;
  }

  private handleResponseError = async (error: AxiosError): Promise<unknown> => {
    const original = error.config as RetriableConfig | undefined;
    const isRefreshable =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !NO_REFRESH_URLS.some((url) => original.url?.startsWith(url));

    if (!isRefreshable) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      await this.refreshSession();
      return this.client(original);
    } catch (refreshError) {
      this.onUnauthorized?.();
      return Promise.reject(refreshError);
    }
  };

  // Concurrent 401s share a single refresh request
  private refreshSession(): Promise<void> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.client
        .post('/auth/refresh')
        .then(() => undefined)
        .finally(() => {
          this.refreshPromise = null;
        });
    }
    return this.refreshPromise;
  }
}

export default ApiCall.getInstance();
