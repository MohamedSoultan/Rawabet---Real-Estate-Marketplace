/**
 * Rawabet Architectural Data Flow: Frontend → API → Backend
 *
 * Data Architecture Rules:
 * 1. localStorage is strictly forbidden from being used as a client-side database.
 * 2. Sensitive data (Users, Leads, CRM notes, Private property addresses, Permissions, Seller profiles)
 *    exist strictly in-memory during active sessions and are synchronized via HTTP REST endpoints.
 * 3. localStorage is reserved exclusively for non-sensitive UI preferences (e.g., viewMode, compareIds).
 *
 * Pipeline Overview:
 * [ Frontend UI Component ]
 *         │  (User event / interaction)
 *         ▼
 * [ React Hooks / Zustand Stores ]
 *         │  (Dispatches async action)
 *         ▼
 * [ Domain API Layer (src/api/*) ]
 *         │  (Types validation, Request cancellation, Retry with backoff, Bearer token)
 *         ▼
 * [ HTTP Client (src/api/client.ts) ]
 *         │  (Fetch / XMLHttpRequest with progress)
 *         ▼
 * [ Laravel 11/12 REST API + Sanctum + MySQL ]
 */

import { propertyApi } from './propertyApi';
import { leadApi } from './leadApi';
import { authApi } from './authApi';
import { userApi } from './userApi';
import { uploadApi } from './uploadApi';
import { apiClient } from './client';

export const dataFlowPipeline = {
  property: propertyApi,
  lead: leadApi,
  auth: authApi,
  user: userApi,
  upload: uploadApi,
  client: apiClient,
};

export type DataFlowPipeline = typeof dataFlowPipeline;
