/**
 * Base HTTP Client for Rawabet API
 * Built with native fetch, timeout, retry with backoff, and request cancellation.
 */

import { ApiResponse, ApiError, RequestConfig } from './types';
import { envConfig } from '../config/env';

const TOKEN_STORAGE_KEY = 'rawabet_auth_token';

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number = 15000; // 15 seconds default
  private token: string | null = null;

  constructor() {
    this.baseUrl = (envConfig.apiBaseUrl || '/api/v1').replace(/\/$/, '');
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return this.token;
  }

  public clearToken(): void {
    this.setToken(null);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  /**
   * Helper to build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: RequestConfig['params']): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Execute request with timeout, retries, and cancellation
   */
  public async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      params,
      timeout = this.defaultTimeout,
      retries = 1,
      retryDelay = 800,
      signal: callerSignal,
      headers: customHeaders = {},
      body,
      ...customOptions
    } = config;

    const fullUrl = this.buildUrl(endpoint, params);

    let attempts = 0;
    const maxAttempts = Math.max(1, retries + 1);

    while (attempts < maxAttempts) {
      attempts++;

      // Create an internal abort controller for timeout and cancellation linking
      const internalController = new AbortController();
      let isTimeout = false;

      const timeoutId = setTimeout(() => {
        isTimeout = true;
        internalController.abort();
      }, timeout);

      // Link external caller signal if provided
      const onCallerAbort = () => {
        internalController.abort();
      };

      if (callerSignal) {
        if (callerSignal.aborted) {
          clearTimeout(timeoutId);
          throw this.normalizeError(new DOMException('The user aborted a request.', 'AbortError'), true);
        }
        callerSignal.addEventListener('abort', onCallerAbort, { once: true });
      }

      try {
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept-Language': 'ar',
          ...(customHeaders as Record<string, string>),
        };

        // If body is NOT FormData, set JSON content type
        const isFormData = body instanceof FormData;
        if (!isFormData && body !== undefined && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }

        const token = this.getToken();
        if (token && !headers['Authorization']) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchBody = isFormData 
          ? body 
          : (body !== undefined ? JSON.stringify(body) : undefined);

        const response = await fetch(fullUrl, {
          ...customOptions,
          headers,
          body: fetchBody,
          signal: internalController.signal,
        });

        clearTimeout(timeoutId);
        if (callerSignal) {
          callerSignal.removeEventListener('abort', onCallerAbort);
        }

        // Handle JSON response
        let responseData: Record<string, unknown> | null = null;
        let rawText = '';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = (await response.json()) as Record<string, unknown>;
          } catch {
            responseData = null;
          }
        } else {
          rawText = await response.text();
        }

        if (!response.ok) {
          const apiError: ApiError = {
            message: (responseData?.message as string) || response.statusText || rawText || 'حدث خطأ في الخادم',
            status: response.status,
            errors: responseData?.errors as Record<string, string[]> | undefined,
            code: (responseData?.code as string) || `HTTP_${response.status}`
          };

          // Do not retry client errors (4xx) except maybe 429 Too Many Requests
          const isClientError = response.status >= 400 && response.status < 500;
          if (isClientError || attempts >= maxAttempts) {
            throw apiError;
          }

          // Backoff before retry
          await this.delay(retryDelay * Math.pow(2, attempts - 1));
          continue;
        }

        // Standardize successful Laravel response
        return {
          data: (responseData?.data !== undefined ? responseData.data : (responseData ?? rawText)) as T,
          message: (responseData?.message as string) || 'تمت العملية بنجاح',
          success: (responseData?.success as boolean | undefined) ?? true,
          errors: responseData?.errors as Record<string, string[]> | undefined,
          meta: responseData?.meta as ApiResponse<T>['meta'],
        };

      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (callerSignal) {
          callerSignal.removeEventListener('abort', onCallerAbort);
        }

        const errObj = err as { name?: string; status?: number; isCanceled?: boolean; message?: string } | undefined;

        // Check if aborted by caller or timeout
        const isCanceled = errObj?.name === 'AbortError' || internalController.signal.aborted;
        if (isCanceled) {
          const canceledError: ApiError = {
            message: isTimeout ? 'انتهت مهلة انتظار الطلب (Timeout)' : 'تم إلغاء الطلب',
            code: isTimeout ? 'TIMEOUT' : 'ABORTED',
            isCanceled: true,
          };
          throw canceledError;
        }

        // If it was an already formatted ApiError (e.g. 4xx/5xx from above), check retry
        if (errObj?.status) {
          if (errObj.status >= 400 && errObj.status < 500) {
            throw err;
          }
        }

        // If we still have retries remaining for network/5xx failure
        if (attempts < maxAttempts) {
          await this.delay(retryDelay * Math.pow(2, attempts - 1));
          continue;
        }

        throw this.normalizeError(err);
      }
    }

    throw {
      message: 'تعذر إكمال الطلب بعد عدة محاولات',
      code: 'MAX_RETRIES_EXCEEDED'
    } as ApiError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeError(error: unknown, isAbort = false): ApiError {
    const errObj = error as { message?: string; code?: string; status?: number; isCanceled?: boolean; name?: string } | undefined;
    if (errObj?.status || errObj?.isCanceled) {
      return error as ApiError;
    }

    return {
      message: errObj?.message || 'تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت',
      code: isAbort ? 'ABORTED' : (errObj?.name || 'NETWORK_ERROR'),
      isCanceled: isAbort || errObj?.name === 'AbortError'
    };
  }

  // Convenience methods
  public get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  public put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  public patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  public delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new HttpClient();
