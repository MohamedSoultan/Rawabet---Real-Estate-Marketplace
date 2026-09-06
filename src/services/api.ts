/**
 * Rawabet API Service Architecture
 * Designed for seamless integration with a future Laravel 11/12 REST API backend.
 * 
 * In offline / development / demo mode, all calls gracefully fall back to
 * local state and mock data without blocking application startup.
 */

import { envConfig } from '../config/env';
import { Property, User, Lead, Governorate, Area, SubmitPropertyReviewPayload, SubmitLeadPayload } from '../types';
import { INITIAL_PROPERTIES, INITIAL_GOVERNORATES, INITIAL_AREAS } from '../data/initialData';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  fromFallback?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private isOnlineBackendAvailable: boolean | null = null;

  constructor() {
    this.baseUrl = envConfig.apiBaseUrl.replace(/\/$/, '');
    // Try to load saved token if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('rawabet_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('rawabet_auth_token', token);
      } else {
        localStorage.removeItem('rawabet_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  /**
   * Generic request handler with graceful mock data fallback.
   * If the Laravel endpoint is not reachable, returns fallback data immediately.
   */
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    fallbackData?: T
  ): Promise<ApiResponse<T>> {
    // If we already know backend is not available during this session, avoid slow timeouts
    if (this.isOnlineBackendAvailable === false && fallbackData !== undefined) {
      return {
        success: true,
        data: fallbackData,
        fromFallback: true,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // Fast 2.5s timeout for resilience

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.isOnlineBackendAvailable = true;

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data || result,
        message: result.message,
        fromFallback: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      // Mark as unavailable for this session to avoid laggy fetches
      this.isOnlineBackendAvailable = false;

      // If fallback mock data is provided, use it gracefully
      if (fallbackData !== undefined) {
        return {
          success: true,
          data: fallbackData,
          fromFallback: true,
        };
      }

      const errObj = err as { message?: string } | undefined;
      return {
        success: false,
        error: errObj?.message || 'Network request failed, using local mode.',
        fromFallback: true,
      };
    }
  }
}

export const apiClient = new ApiClient();

// ==========================================
// Specialized Domain Services for Laravel API
// ==========================================

export const propertyService = {
  async getProperties(): Promise<ApiResponse<Property[]>> {
    return apiClient.request<Property[]>('/api/v1/properties', { method: 'GET' }, INITIAL_PROPERTIES);
  },

  async getPropertyById(id: string): Promise<ApiResponse<Property | undefined>> {
    const found = INITIAL_PROPERTIES.find(p => p.id === id);
    return apiClient.request<Property | undefined>(`/api/v1/properties/${id}`, { method: 'GET' }, found);
  },

  async createProperty(propertyData: SubmitPropertyReviewPayload): Promise<ApiResponse<Property>> {
    return apiClient.request<Property>('/api/v1/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }
};

export const taxonomyService = {
  async getGovernorates(): Promise<ApiResponse<Governorate[]>> {
    return apiClient.request<Governorate[]>('/api/v1/locations/governorates', { method: 'GET' }, INITIAL_GOVERNORATES);
  },

  async getAreas(cityId?: string): Promise<ApiResponse<Area[]>> {
    const fallback = cityId 
      ? INITIAL_AREAS.filter(a => a.city_id === cityId)
      : INITIAL_AREAS;
    const url = cityId 
      ? `/api/v1/locations/areas?city_id=${cityId}`
      : '/api/v1/locations/areas';
    return apiClient.request<Area[]>(url, { method: 'GET' }, fallback);
  }
};

export const leadService = {
  async submitLead(lead: SubmitLeadPayload): Promise<ApiResponse<Lead>> {
    return apiClient.request<Lead>('/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }
};
