export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
export type SellerType = 'OWNER' | 'BROKER' | 'INDIVIDUAL_OWNER' | 'REAL_ESTATE_OFFICE';
export type VerificationStatus = 'NOT_REQUESTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED';

export type PropertyStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'PUBLISHED' 
  | 'REJECTED' 
  | 'PENDING_REVISION' 
  | 'ARCHIVED' 
  | 'SOLD' 
  | 'RENTED';

export type VersionStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReviewDecision = 'APPROVED' | 'REJECTED';

export type LeadStatus = 
  | 'NEW' 
  | 'WHATSAPP_CONTACT_INITIATED' 
  | 'CALL_CONTACT_INITIATED' 
  | 'CONTACTED' 
  | 'FOLLOW_UP' 
  | 'VIEWING' 
  | 'WON' 
  | 'LOST';

export type LeadChannel = 'WHATSAPP' | 'CALL' | 'WEBSITE';
export type LeadActivityType = 
  | 'CREATED' 
  | 'WHATSAPP_CONTACT_INITIATED' 
  | 'CALL_CONTACT_INITIATED' 
  | 'STATUS_CHANGED' 
  | 'NOTE_ADDED' 
  | 'ASSIGNED';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'PROPERTY_REVIEWER' 
  | 'SALES_USER' 
  | 'OPERATIONS_MANAGER' 
  | 'CONTENT_MANAGER' 
  | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  email_verified_at: string | null;
  account_status: AccountStatus;
  avatar_path?: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  role: UserRole;
  custom_permissions?: string[];
  seller_profile?: SellerProfile;
  user_profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  governorate_id: string;
  city_id?: string;
  area_id?: string;
  preferred_language: 'ar';
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  seller_type: SellerType;
  verification_status: VerificationStatus;
  agency_name?: string;
  tax_number?: string;
  verification_requested_at?: string;
  verified_at?: string;
  verified_by?: string;
  verification_note?: string;
}

export interface Governorate {
  id: string;
  name_ar: string;
  slug: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  governorate_id: string;
  name_ar: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  city_id: string;
  name_ar: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyType {
  id: string;
  name_ar: string;
  slug: string;
  min_images: number;
  max_images: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionType {
  id: string;
  name_ar: string;
  slug: string;
  is_active: boolean;
}

export interface PropertyMedia {
  id: string;
  property_version_id: string;
  media_type: 'IMAGE' | 'VIDEO';
  path: string;
  mime_type: string;
  file_size: number;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface PropertyVersion {
  id: string;
  property_id: string;
  version_number: number;
  title: string;
  description: string;
  governorate_id: string;
  city_id: string;
  area_id: string;
  public_location_text: string;
  private_address: string;
  price: number;
  area_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: string;
  finishing?: string;
  features?: string[];
  version_status: VersionStatus;
  submitted_by: string;
  submitted_at: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_decision?: ReviewDecision | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  media: PropertyMedia[];
}

export interface PropertyReview {
  id: string;
  property_id: string;
  property_version_id: string;
  reviewer_id: string;
  reviewer_name: string;
  decision: ReviewDecision;
  reason?: string | null;
  internal_note?: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  reference_number: string;
  seller_id: string;
  property_type_id: string;
  transaction_type_id: string;
  current_status: PropertyStatus;
  current_published_version_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  versions: PropertyVersion[];
  reviews: PropertyReview[];
  // Transient for convenience
  seller?: User;
}

export interface Lead {
  id: string;
  reference_number: string;
  customer_id: string;
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  property_id: string;
  property_reference: string;
  property_title: string;
  status: LeadStatus;
  source: string;
  contact_channel: LeadChannel;
  assigned_to?: string | null;
  assigned_user_name?: string | null;
  last_activity_at: string;
  closed_at?: string | null;
  created_at: string;
  activities: LeadActivity[];
  notes: LeadNote[];
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: LeadActivityType;
  channel?: LeadChannel | null;
  description: string;
  created_by?: string | null;
  created_by_name?: string;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  user_name: string;
  body: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  related_type?: string;
  related_id?: string;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  field_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  metadata?: Record<string, unknown> | null;
  ip_address?: string;
  created_at: string;
}

export interface SystemSetting {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  primary_phone: string;
  secondary_phone: string;
  primary_whatsapp: string;
  secondary_whatsapp: string;
  whatsapp_phone?: string;
  official_address?: string;
  support_email: string;
  home_headline_ar: string;
  home_description_ar: string;
  privacy_policy_ar: string;
  terms_ar: string;
  about_ar: string;
  updated_by?: string;
  updated_at: string;
}

export interface HelpResource {
  id: string;
  title: string;
  resource_type: 'PDF' | 'YOUTUBE' | 'ARTICLE';
  path?: string | null;
  url?: string | null;
  content_ar?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  expires_at: string; // created_at + 30 days
}

export interface ContactInquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
  category: 'GENERAL' | 'SELLER_SUPPORT' | 'BUYER_INQUIRY' | 'PARTNERSHIP' | 'COMPLAINT';
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  response_notes?: string;
}
