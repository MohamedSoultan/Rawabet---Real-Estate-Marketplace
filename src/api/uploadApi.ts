/**
 * File & Media Upload API Layer for Rawabet
 * Interfaces with Laravel endpoints: /api/v1/media/upload
 */

import { apiClient } from './client';
import { ApiResponse, RequestConfig, UploadedMedia, UploadProgressEvent } from './types';

export interface UploadOptions extends Omit<RequestConfig, 'body'> {
  folder?: 'properties' | 'avatars' | 'verifications' | 'documents';
  onProgress?: (progress: UploadProgressEvent) => void;
}

export const uploadApi = {
  /**
   * Upload a single file with optional progress tracking and cancellation
   */
  uploadFile(file: File, options: UploadOptions = {}): Promise<ApiResponse<UploadedMedia>> {
    const { folder = 'properties', onProgress, signal, ...restConfig } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // If XMLHttpRequest progress tracking is needed, support it with fallback to fetch
    if (onProgress && typeof XMLHttpRequest !== 'undefined') {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${apiClient.getBaseUrl()}/media/upload`;

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        const token = apiClient.getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percent,
            });
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                data: response.data || response,
                message: response.message || 'تم رفع الملف بنجاح',
                success: true,
              });
            } else {
              reject({
                message: response.message || 'فشل في رفع الملف',
                status: xhr.status,
                errors: response.errors,
              });
            }
          } catch {
            reject({
              message: 'استجابة غير صالحة من خادم الرفع',
              status: xhr.status,
            });
          }
        };

        xhr.onerror = () => {
          reject({
            message: 'حدث خطأ في الاتصال أثناء رفع الملف',
            status: 0,
          });
        };

        if (signal) {
          signal.addEventListener('abort', () => {
            xhr.abort();
            reject({
              message: 'تم إلغاء عملية الرفع',
              isCanceled: true,
            });
          });
        }

        xhr.send(formData);
      });
    }

    // Default fetch client upload
    return apiClient.post<UploadedMedia>('/media/upload', formData, {
      ...restConfig,
      signal,
    });
  },

  /**
   * Upload multiple files simultaneously
   */
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<ApiResponse<UploadedMedia[]>> {
    const { folder = 'properties', signal, ...restConfig } = options;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('folder', folder);

    return apiClient.post<UploadedMedia[]>('/media/upload-multiple', formData, {
      ...restConfig,
      signal,
    });
  },

  /**
   * Delete uploaded file by media ID
   */
  deleteFile(mediaId: string, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/media/${encodeURIComponent(mediaId)}`, config);
  }
};
