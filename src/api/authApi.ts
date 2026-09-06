/**
 * Authentication API Layer for Rawabet
 * Interfaces with Laravel Sanctum endpoints: /api/v1/auth/*
 */

import { apiClient } from './client';
import { ApiResponse, RequestConfig } from './types';
import { User, UserRole, SellerType } from '../types';
import { authSession } from '../security/authSession';

export interface LoginPayload {
  email_or_mobile: string;
  password?: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  role?: UserRole;
  seller_type?: SellerType;
  agency_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type?: string;
  expires_in?: number;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  /**
   * Log in user with email or mobile phone and password
   */
  async login(payload: LoginPayload, config?: RequestConfig): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload, config);
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
      authSession.setToken(response.data.token, response.data.expires_in);
    }
    return response;
  },

  /**
   * Register a new user (buyer, individual seller, or broker)
   */
  async register(payload: RegisterPayload, config?: RequestConfig): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload, config);
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
      authSession.setToken(response.data.token, response.data.expires_in);
    }
    return response;
  },

  /**
   * Log out and revoke active bearer token
   */
  async logout(config?: RequestConfig): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<null>('/auth/logout', {}, config);
      return response;
    } finally {
      apiClient.clearToken();
      authSession.clearToken();
    }
  },

  /**
   * Get current authenticated user session
   */
  getMe(config?: RequestConfig): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me', config);
  },

  /**
   * Send SMS OTP verification code to mobile number
   */
  requestOtp(mobile: string, config?: RequestConfig): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/otp/send', { mobile }, config);
  },

  /**
   * Verify mobile OTP and log in / confirm
   */
  async verifyOtp(mobile: string, code: string, config?: RequestConfig): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/otp/verify', { mobile, code }, config);
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
      authSession.setToken(response.data.token, response.data.expires_in);
    }
    return response;
  },

  /**
   * Request password reset link
   */
  forgotPassword(email: string, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.post<null>('/auth/forgot-password', { email }, config);
  },

  /**
   * Reset password with reset token
   */
  resetPassword(payload: ResetPasswordPayload, config?: RequestConfig): Promise<ApiResponse<null>> {
    return apiClient.post<null>('/auth/reset-password', payload, config);
  }
};
