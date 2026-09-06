/**
 * Reusable React Hook for Typed API Calls
 * Encapsulates Loading state, Error state, Cancellation, and Retry logic.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { ApiResponse, ApiError, ApiState } from './types';

export interface UseApiOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T, response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
  autoResetErrorOnExecute?: boolean;
}

export interface UseApiReturn<T, Args extends any[]> extends ApiState<T> {
  execute: (...args: Args) => Promise<ApiResponse<T> | null>;
  cancel: () => void;
  retry: () => Promise<ApiResponse<T> | null>;
  reset: () => void;
  isCanceled: boolean;
}

export function useApi<T, Args extends any[] = []>(
  apiFn: (...args: [...Args, { signal?: AbortSignal }?]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, Args> {
  const {
    initialData = null,
    onSuccess,
    onError,
    autoResetErrorOnExecute = true
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    success: false,
  });

  const [isCanceled, setIsCanceled] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastArgsRef = useRef<Args | null>(null);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsCanceled(true);
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  // Execute API function
  const execute = useCallback(async (...args: Args): Promise<ApiResponse<T> | null> => {
    // Cancel prior inflight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    lastArgsRef.current = args;
    setIsCanceled(false);

    setState(prev => ({
      ...prev,
      loading: true,
      error: autoResetErrorOnExecute ? null : prev.error,
      success: false,
    }));

    try {
      // Pass signal as the final argument if supported
      const response = await apiFn(...args, { signal: controller.signal });

      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
      });

      if (onSuccess) {
        onSuccess(response.data, response);
      }

      return response;
    } catch (err: unknown) {
      const errObj = err as ApiError | undefined;
      if (controller.signal.aborted || errObj?.isCanceled) {
        setIsCanceled(true);
        setState(prev => ({ ...prev, loading: false }));
        return null;
      }

      const normalizedError: ApiError = {
        message: errObj?.message || 'حدث خطأ أثناء معالجة الطلب',
        status: errObj?.status,
        errors: errObj?.errors,
        code: errObj?.code,
      };

      setState(prev => ({
        ...prev,
        loading: false,
        error: normalizedError,
        success: false,
      }));

      if (onError) {
        onError(normalizedError);
      }

      return null;
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [apiFn, onSuccess, onError, autoResetErrorOnExecute]);

  // Retry the last execution
  const retry = useCallback(async (): Promise<ApiResponse<T> | null> => {
    if (!lastArgsRef.current) {
      return null;
    }
    return execute(...lastArgsRef.current);
  }, [execute]);

  // Reset to initial state
  const reset = useCallback(() => {
    cancel();
    setState({
      data: initialData,
      loading: false,
      error: null,
      success: false,
    });
    setIsCanceled(false);
  }, [cancel, initialData]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    cancel,
    retry,
    reset,
    isCanceled,
  };
}
