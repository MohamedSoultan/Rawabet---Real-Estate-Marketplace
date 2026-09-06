/**
 * Property API Layer for Rawabet
 * Interfaces with Laravel 11/12 endpoints: /api/v1/properties
 */

import { apiClient } from './client';
import { ApiResponse, RequestConfig } from './types';
import { Property, PropertyStatus, ReviewDecision } from '../types';

export interface PropertyFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  property_type_id?: string;
  transaction_type_id?: string;
  governorate_id?: string;
  city_id?: string;
  area_id?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: PropertyStatus;
  sort_by?: 'created_at' | 'price' | 'area_sqm' | 'views_count';
  sort_direction?: 'asc' | 'desc';
}

export interface CreatePropertyPayload {
  property_type_id: string;
  transaction_type_id: string;
  governorate_id: string;
  city_id: string;
  area_id?: string;
  public_location_text?: string;
  private_address?: string;
  private_notes?: string;
  title: string;
  description: string;
  price: number;
  area_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: string;
  finishing_type?: string;
  features?: string[];
  media?: Array<{
    id?: string;
    path: string;
    media_type: 'IMAGE' | 'DOCUMENT' | 'VIDEO';
    is_cover?: boolean;
    sort_order?: number;
  }>;
  as_draft?: boolean;
}

export interface UpdatePropertyPayload extends Partial<CreatePropertyPayload> {
  version_comment?: string;
}

export interface ReviewPropertyPayload {
  decision: ReviewDecision;
  rejection_reason?: string;
  modification_notes?: string;
}

export const propertyApi = {
  /**
   * Fetch paginated and filtered public properties
   */
  getProperties(params?: PropertyFilterParams, config?: RequestConfig): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>('/properties', {
      ...config,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Fetch single property by UUID or unique reference number
   */
  getPropertyById(idOrReference: string, config?: RequestConfig): Promise<ApiResponse<Property>> {
    return apiClient.get<Property>(`/properties/${encodeURIComponent(idOrReference)}`, config);
  },

  /**
   * Fetch similar / related properties in the same area or category
   */
  getSimilarProperties(propertyId: string, limit: number = 4, config?: RequestConfig): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>(`/properties/${encodeURIComponent(propertyId)}/similar`, {
      ...config,
      params: { limit },
    });
  },

  /**
   * Fetch properties owned by currently authenticated seller
   */
  getMyProperties(params?: { status?: PropertyStatus; page?: number }, config?: RequestConfig): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>('/seller/properties', {
      ...config,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Create a new property listing (draft or direct review)
   */
  createProperty(payload: CreatePropertyPayload, config?: RequestConfig): Promise<ApiResponse<Property>> {
    return apiClient.post<Property>('/properties', payload, config);
  },

  /**
   * Update an existing property by creating a new version or updating draft
   */
  updateProperty(id: string, payload: UpdatePropertyPayload, config?: RequestConfig): Promise<ApiResponse<Property>> {
    return apiClient.put<Property>(`/properties/${encodeURIComponent(id)}`, payload, config);
  },

  /**
   * Submit a draft property version to internal operations review
   */
  submitForReview(propertyId: string, config?: RequestConfig): Promise<ApiResponse<Property>> {
    return apiClient.post<Property>(`/properties/${encodeURIComponent(propertyId)}/submit-review`, {}, config);
  },

  /**
   * Operations/Reviewer decision: Approve, Reject, or Request Modification
   */
  reviewPropertyVersion(propertyId: string, versionId: string, payload: ReviewPropertyPayload, config?: RequestConfig): Promise<ApiResponse<Property>> {
    return apiClient.post<Property>(
      `/operations/properties/${encodeURIComponent(propertyId)}/versions/${encodeURIComponent(versionId)}/review`,
      payload,
      config
    );
  },

  /**
   * Archive or soft delete a property
   */
  deleteProperty(id: string, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/properties/${encodeURIComponent(id)}`, config);
  }
};
