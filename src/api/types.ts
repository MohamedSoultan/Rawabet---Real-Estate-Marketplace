/**
 * Core Types for Rawabet API Client
 * Configured for Laravel 11/12 REST API & Sanctum Authentication
 */

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: Record<string, string[]>;
  meta?: ApiPaginationMeta;
}

export interface ApiPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
  isCanceled?: boolean;
}

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  body?: unknown;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadedMedia {
  id: string;
  path: string;
  url: string;
  file_name: string;
  mime_type: string;
  size: number;
  media_type: 'IMAGE' | 'DOCUMENT' | 'VIDEO';
  created_at: string;
}
