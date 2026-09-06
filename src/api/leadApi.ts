/**
 * Lead & CRM API Layer for Rawabet
 * Interfaces with Laravel endpoints: /api/v1/leads & /api/v1/sales/leads
 */

import { apiClient } from './client';
import { ApiResponse, RequestConfig } from './types';
import { Lead, LeadStatus, LeadChannel, LeadActivityType } from '../types';

export interface SubmitLeadPayload {
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  property_id: string;
  contact_channel: LeadChannel;
  source?: string;
  notes?: string;
}

export interface RequestViewingPayload {
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  property_id: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
}

export interface LeadFilterParams {
  page?: number;
  per_page?: number;
  status?: LeadStatus;
  channel?: LeadChannel;
  assigned_to?: string;
  property_id?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export const leadApi = {
  /**
   * Submit an inquiry / lead from buyer or property viewer
   */
  submitLead(payload: SubmitLeadPayload, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>('/leads', payload, config);
  },

  /**
   * Submit a structured viewing request
   */
  requestViewing(payload: RequestViewingPayload, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>('/leads/request-viewing', payload, config);
  },

  /**
   * Fetch leads list for sales CRM & operations
   */
  getLeads(params?: LeadFilterParams, config?: RequestConfig): Promise<ApiResponse<Lead[]>> {
    return apiClient.get<Lead[]>('/sales/leads', {
      ...config,
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Fetch single lead with full activities timeline and internal notes
   */
  getLeadById(leadId: string, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.get<Lead>(`/sales/leads/${encodeURIComponent(leadId)}`, config);
  },

  /**
   * Update lead lifecycle status (e.g. CONTACTED, VIEWING, WON, LOST)
   */
  updateLeadStatus(leadId: string, status: LeadStatus, note?: string, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.patch<Lead>(`/sales/leads/${encodeURIComponent(leadId)}/status`, { status, note }, config);
  },

  /**
   * Assign lead to a specific sales agent
   */
  assignLead(leadId: string, assignedToUserId: string, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>(`/sales/leads/${encodeURIComponent(leadId)}/assign`, { assigned_to: assignedToUserId }, config);
  },

  /**
   * Add internal CRM note to a lead
   */
  addNote(leadId: string, note: string, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>(`/sales/leads/${encodeURIComponent(leadId)}/notes`, { note }, config);
  },

  /**
   * Record specific activity (Call completed, WhatsApp sent, etc.)
   */
  recordActivity(leadId: string, activityType: LeadActivityType, description: string, config?: RequestConfig): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>(`/sales/leads/${encodeURIComponent(leadId)}/activities`, {
      activity_type: activityType,
      description
    }, config);
  }
};
