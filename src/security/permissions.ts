/**
 * Rawabet RBAC & Permission System
 * Mirrors Laravel Spatie Permissions / Gate policies
 */

import { User, UserRole } from '../types';

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: 'PERM_MANAGE_USERS',
  MANAGE_ROLES: 'PERM_MANAGE_ROLES',
  
  // Property Review & Approval
  APPROVE_PROPERTIES: 'PERM_APPROVE_PROPERTIES',
  REJECT_PROPERTIES: 'PERM_REJECT_PROPERTIES',
  VIEW_PENDING_PROPERTIES: 'PERM_VIEW_PENDING',
  EDIT_PENDING_PROPERTIES: 'PERM_EDIT_PENDING',
  VIEW_PRIVATE_SELLER_INFO: 'PERM_VIEW_PRIVATE_SELLER_INFO',
  
  // Seller Verification
  VERIFY_SELLERS: 'PERM_VERIFY_SELLERS',
  
  // Leads & CRM
  MANAGE_LEADS: 'PERM_MANAGE_LEADS',
  VIEW_LEADS: 'lead.view',
  EDIT_LEADS: 'lead.edit',
  CONTACT_LEADS: 'lead.contact',
  
  // Taxonomy & Settings
  MANAGE_LOCATIONS: 'PERM_MANAGE_LOCATIONS',
  MANAGE_TAXONOMY: 'PERM_MANAGE_TAXONOMY',
  MANAGE_SETTINGS: 'PERM_MANAGE_SYSTEM_SETTINGS',
  
  // Audit Logs
  VIEW_AUDIT_LOGS: 'PERM_VIEW_AUDIT_LOGS',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | string;

// Standard Role to Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'], // Universal access
  OPERATIONS_MANAGER: [
    PERMISSIONS.APPROVE_PROPERTIES,
    PERMISSIONS.REJECT_PROPERTIES,
    PERMISSIONS.VIEW_PENDING_PROPERTIES,
    PERMISSIONS.EDIT_PENDING_PROPERTIES,
    PERMISSIONS.VIEW_PRIVATE_SELLER_INFO,
    PERMISSIONS.VERIFY_SELLERS,
    PERMISSIONS.MANAGE_LOCATIONS,
    PERMISSIONS.MANAGE_TAXONOMY,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    'property.approve',
    'property.reject',
    'property.view_pending',
    'property.view_private_source',
    'seller.verify',
    'audit.view',
  ],
  PROPERTY_REVIEWER: [
    PERMISSIONS.APPROVE_PROPERTIES,
    PERMISSIONS.REJECT_PROPERTIES,
    PERMISSIONS.VIEW_PENDING_PROPERTIES,
    PERMISSIONS.EDIT_PENDING_PROPERTIES,
    PERMISSIONS.VIEW_PRIVATE_SELLER_INFO,
    PERMISSIONS.VERIFY_SELLERS,
    'property.approve',
    'property.reject',
    'property.view_pending',
    'property.view_private_source',
    'seller.verify',
  ],
  SALES_USER: [
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.CONTACT_LEADS,
    'lead.view',
    'lead.edit',
    'lead.change_status',
    'lead.add_note',
    'lead.contact',
    'leads.manage',
  ],
  CONTENT_MANAGER: [
    PERMISSIONS.MANAGE_LOCATIONS,
    PERMISSIONS.MANAGE_TAXONOMY,
    PERMISSIONS.MANAGE_SETTINGS,
    'locations.manage',
    'taxonomy.manage',
    'settings.general',
    'settings.branding',
    'settings.legal',
    'settings.manage',
    'help.manage',
  ],
  CUSTOMER: [
    'property.browse',
    'property.favorite',
    'lead.submit',
  ]
};

/**
 * Checks if a user possesses a specific permission
 */
export function hasPermission(user: User | null | undefined, permission: PermissionKey): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  // 1. Check user custom explicit permissions
  if (user.custom_permissions && Array.isArray(user.custom_permissions)) {
    if (user.custom_permissions.includes('*') || user.custom_permissions.includes(permission)) {
      return true;
    }
  }

  // 2. Check role-assigned default permissions
  const assigned = ROLE_PERMISSIONS[user.role] || [];
  return assigned.includes('*') || assigned.includes(permission);
}

/**
 * Checks if a user has any of the requested permissions
 */
export function hasAnyPermission(user: User | null | undefined, permissions: PermissionKey[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return permissions.some(perm => hasPermission(user, perm));
}

/**
 * Checks if a user has all of the requested permissions
 */
export function hasAllPermissions(user: User | null | undefined, permissions: PermissionKey[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return permissions.every(perm => hasPermission(user, perm));
}
