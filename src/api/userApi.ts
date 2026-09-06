/**
 * User & Profile API Layer for Rawabet
 * Interfaces with Laravel endpoints: /api/v1/user & /api/v1/admin/users
 */

import { apiClient } from './client';
import { ApiResponse, RequestConfig } from './types';
import { User, UserRole, AccountStatus, SellerType } from '../types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  governorate_id?: string;
  city_id?: string;
  area_id?: string;
}

export interface RequestSellerVerificationPayload {
  seller_type: SellerType;
  agency_name?: string;
  tax_number?: string;
  commercial_registration?: string;
  documents?: string[];
}

export interface UserFilterParams {
  page?: number;
  per_page?: number;
  role?: UserRole;
  account_status?: AccountStatus;
  search?: string;
}

export const userApi = {
  /**
   * Get currently authenticated user's full profile
   */
  getProfile(config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user/profile', config);
  },

  /**
   * Update personal profile details
   */
  updateProfile(payload: UpdateProfilePayload, config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/user/profile', payload, config);
  },

  /**
   * Request official seller verification with license / agency credentials
   */
  requestSellerVerification(payload: RequestSellerVerificationPayload, config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/user/seller/verify', payload, config);
  },

  /**
   * Get user's saved favorite property IDs
   */
  getFavorites(config?: RequestConfig): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/user/favorites', config);
  },

  /**
   * Add a property to favorites
   */
  addFavorite(propertyId: string, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.post<null>(`/user/favorites/${encodeURIComponent(propertyId)}`, {}, config);
  },

  /**
   * Remove a property from favorites
   */
  removeFavorite(propertyId: string, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/user/favorites/${encodeURIComponent(propertyId)}`, config);
  },

  // ==========================================
  // Admin User Management Endpoints
  // ==========================================

  /**
   * List system users with role and status filtering (Admin)
   */
  getUsers(params?: UserFilterParams, config?: RequestConfig): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/admin/users', {
      ...config,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Update user status (ACTIVE, SUSPENDED, DISABLED) (Admin)
   */
  updateUserStatus(userId: string, status: AccountStatus, reason?: string, config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/admin/users/${encodeURIComponent(userId)}/status`, { status, reason }, config);
  },

  /**
   * Change user role (Admin)
   */
  updateUserRole(userId: string, role: UserRole, config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/admin/users/${encodeURIComponent(userId)}/role`, { role }, config);
  },

  /**
   * Approve or reject seller verification request (Admin)
   */
  reviewSellerVerification(userId: string, decision: 'VERIFIED' | 'REJECTED', notes?: string, config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.post<User>(`/admin/users/${encodeURIComponent(userId)}/verification`, { decision, notes }, config);
  }
};
