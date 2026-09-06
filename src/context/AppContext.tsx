import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, 
  UserProfile,
  SellerProfile,
  UserRole, 
  Property, 
  PropertyVersion, 
  Lead, 
  Governorate, 
  City, 
  Area, 
  PropertyType, 
  TransactionType, 
  SystemSetting, 
  HelpResource, 
  AuditLog, 
  AppNotification, 
  Favorite, 
  LeadStatus, 
  LeadChannel, 
  SellerType,
  ContactInquiry,
  PropertyRequest,
  CreateInternalUserPayload,
  PropertyDraftPayload,
  InternalEditPropertyPayload,
  UpdatePropertyTypePayload,
  UpdateSystemSettingsPayload,
  LeadActivityType
} from '../types';
import { 
  INITIAL_GOVERNORATES, 
  INITIAL_CITIES, 
  INITIAL_AREAS, 
  INITIAL_PROPERTY_TYPES, 
  INITIAL_TRANSACTION_TYPES, 
  INITIAL_USERS, 
  INITIAL_PROPERTIES, 
  INITIAL_LEADS, 
  INITIAL_SETTINGS, 
  INITIAL_HELP_RESOURCES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { envConfig } from '../config/env';

interface AuthModalConfig {
  isOpen: boolean;
  view: 'REGISTER' | 'OTP' | 'LOGIN';
  pendingAction?: () => void;
  email?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  properties: Property[];
  leads: Lead[];
  governorates: Governorate[];
  cities: City[];
  areas: Area[];
  propertyTypes: PropertyType[];
  transactionTypes: TransactionType[];
  settings: SystemSetting;
  helpResources: HelpResource[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  favorites: Favorite[];
  authModal: AuthModalConfig;
  unreadNotificationsCount: number;
  userProfile?: UserProfile;
  sellerProfile?: SellerProfile;
  
  // Auth & Persona
  setCurrentUser: (user: User | null) => void;
  switchPersona?: (role: 'GUEST' | UserRole, specificUserId?: string) => void;
  openAuthModal: (view?: 'REGISTER' | 'OTP' | 'LOGIN', pendingAction?: () => void) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string) => { success: boolean; error?: string; user?: User };
  forgotPassword: (identifier: string) => { success: boolean; message: string; error?: string };
  registerUser: (data: { 
    name: string; 
    mobile: string; 
    email: string; 
    password?: string;
    sellerType?: SellerType;
    agencyName?: string;
    taxNumber?: string;
    governorate_id?: string; 
    area_id?: string 
  }) => { success: boolean; error?: string; user?: User };
  verifyOTP: (email: string, otp: string) => { success: boolean; error?: string };
  loginWithEmail: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: { name?: string; mobile?: string; governorate_id?: string; area_id?: string }) => { success: boolean; error?: string };
  activateSellerCapability: (sellerType: SellerType) => void;
  enableSellerRole: (sellerType: SellerType, agencyName?: string, taxNumber?: string) => { success: boolean; error?: string };
  requestSellerVerification: (note?: string) => void;
  reviewSellerVerification: (userId: string, decision: 'VERIFIED' | 'REJECTED', note?: string) => void;
  toggleUserStatus: (userId: string) => void;
  createInternalUser: (userData: CreateInternalUserPayload) => void;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  
  // Properties & Versions
  getPublishedProperties: () => Property[];
  getMyProperties: () => Property[];
  getPropertyById: (propertyId: string) => Property | undefined;
  savePropertyDraft: (propertyData: PropertyDraftPayload, propertyId?: string) => { success: boolean; propertyId?: string; error?: string };
  submitPropertyForReview: (propertyId: string, versionData: PropertyDraftPayload) => { success: boolean; error?: string };
  approvePropertyVersion: (propertyId: string, versionId: string, internalNote?: string) => { success: boolean; error?: string };
  approveVersion?: (propertyId: string, versionId: string, internalNote?: string) => { success: boolean; error?: string };
  rejectPropertyVersion: (propertyId: string, versionId: string, rejectionReason: string, internalNote?: string) => { success: boolean; error?: string };
  rejectVersion?: (propertyId: string, versionId: string, rejectionReason: string, internalNote?: string) => { success: boolean; error?: string };
  startPropertyReview: (propertyId: string, versionId: string) => { success: boolean; error?: string };
  requestPropertyModification: (propertyId: string, versionId: string, modificationFeedback: string, internalNote?: string) => { success: boolean; error?: string };
  editPublishedPropertyAsRevision: (propertyId: string) => string | null;
  directInternalEditPublishedProperty: (propertyId: string, versionId: string, updatedFields: InternalEditPropertyPayload) => { success: boolean; error?: string };
  markPropertyStatus: (propertyId: string, status: 'SOLD' | 'RENTED' | 'ARCHIVED') => void;
  validateForbiddenContact: (text: string) => { hasForbidden: boolean; match?: string };
  
  // Leads & CRM
  createLeadFromInteraction: (propertyId: string, channel: LeadChannel) => { success: boolean; leadId?: string; error?: string };
  createLead?: (propertyId: string, channel: LeadChannel) => { success: boolean; leadId?: string; error?: string };
  createViewingRequest: (propertyId: string, data: { customerName: string; customerMobile: string; preferredDate: string; preferredTime: string; notes?: string }) => { success: boolean; leadId?: string; error?: string };
  updateLeadStatus: (leadId: string, newStatus: LeadStatus, noteBody?: string) => void;
  addLeadNote: (leadId: string, noteBody: string) => void;
  assignLead: (leadId: string, userId: string) => void;
  scheduleFollowUp: (leadId: string, followUpDate: string, notes?: string) => void;
  markLeadContacted: (leadId: string, notes?: string) => void;
  
  // Master Data & Settings
  toggleGovernorateActive: (govId: string) => void;
  addGovernorate: (name_ar: string) => void;
  toggleCityActive: (cityId: string) => void;
  addCity: (governorateId: string, name_ar: string) => void;
  addArea: (cityId: string, name_ar: string) => void;
  updatePropertyType: (typeId: string, updates: UpdatePropertyTypePayload) => void;
  updateSettings: (newSettings: UpdateSystemSettingsPayload) => void;
  addHelpResource: (resource: Omit<HelpResource, 'id'>) => void;
  
  // Notifications & Favorites & Compare
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  compareIds: string[];
  addToCompare: (propertyId: string) => { success: boolean; message?: string };
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;

  // Contact Inquiries
  contactInquiries: ContactInquiry[];
  submitContactInquiry: (data: Omit<ContactInquiry, 'id' | 'created_at' | 'status'>) => { success: boolean; error?: string };
  updateContactInquiryStatus: (id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED', response_notes?: string) => void;
  
  // Customer Property Requests (Demand Capture Flow)
  propertyRequests: PropertyRequest[];
  submitPropertyRequest: (data: Omit<PropertyRequest, 'id' | 'reference_number' | 'created_at' | 'status'>) => { success: boolean; request?: PropertyRequest };
  
  // Permissions & Audit
  hasPermission: (permissionKey: string) => boolean;
  addAuditEntry: (entry: Omit<AuditLog, 'id' | 'created_at'>) => void;
  resetToDefaultData: () => void;
  resetToDefault?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys strictly restricted to non-sensitive UI preferences
const UI_PREF_COMPARE_KEY = 'rawabet_ui_compare';
const UI_PREF_FAVORITES_KEY = 'rawabet_ui_favorites';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master states: Runtime in-memory state (Never stored in localStorage as database)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [governorates, setGovernorates] = useState<Governorate[]>(INITIAL_GOVERNORATES);
  const [cities, setCities] = useState<City[]>(INITIAL_CITIES);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(INITIAL_PROPERTY_TYPES);
  const [transactionTypes] = useState<TransactionType[]>(INITIAL_TRANSACTION_TYPES);
  const [settings, setSettings] = useState<SystemSetting>(INITIAL_SETTINGS);
  const [helpResources, setHelpResources] = useState<HelpResource[]>(INITIAL_HELP_RESOURCES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Non-sensitive UI Preferences
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try {
      const saved = localStorage.getItem(UI_PREF_FAVORITES_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        if (Array.isArray(ids)) {
          return ids.map((id, idx) => ({
            id: `fav-${idx}`,
            user_id: 'guest',
            property_id: id,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 86400000).toISOString()
          }));
        }
      }
    } catch {}
    return [
      { id: 'fav-1', user_id: 'user-cust-1', property_id: 'prop-101', created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }
    ];
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(UI_PREF_COMPARE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([
    {
      id: 'inq-1',
      name: 'م. أحمد الشناوي',
      mobile: '01012345678',
      email: 'ahmed.shinawy@example.com',
      subject: 'استفسار عن حجز موعد معاينة في كفر الشيخ',
      message: 'أريد معرفة هل المعاينة في برج الهدى متاحة يوم الجمعة القادم؟ وهل يمكن مقابلة المالك الموثق؟',
      category: 'BUYER_INQUIRY',
      status: 'NEW',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'inq-2',
      name: 'د. سامح عبد الفتاح',
      mobile: '01123456789',
      email: 'sameh.fatah@example.com',
      subject: 'طلب توثيق مكتب عقاري معتمد',
      message: 'لدينا مكتب عقاري في حي المحافظة ونرغب في توثيق الحساب ونشر أكثر من 15 عقار معتمد.',
      category: 'SELLER_SUPPORT',
      status: 'IN_PROGRESS',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      response_notes: 'تم التواصل هاتفياً وطلب السجل التجاري وجاري الفحص الهندسي'
    }
  ]);

  const [propertyRequests, setPropertyRequests] = useState<PropertyRequest[]>([
    {
      id: 'req-sample-1',
      reference_number: 'REQ-10024',
      customer_id: 'user-cust-1',
      full_name: 'أحمد محمود العشري',
      whatsapp_number: '01012345678',
      governorate: 'كفر الشيخ',
      city_or_area: 'مدينة كفر الشيخ - القنطرة البيضاء',
      transaction_type: 'BUY',
      property_type: 'شقة سكنية',
      budget: 1800000,
      area_sqm: 140,
      bedrooms: 3,
      additional_notes: 'الدور الثاني أو الثالث مع مصعد، تشطيب سوبر لوكس، جاهزة للاستلام الفوري.',
      status: 'SEARCHING',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'req-sample-2',
      reference_number: 'REQ-10025',
      customer_id: 'user-cust-1',
      full_name: 'أحمد محمود العشري',
      whatsapp_number: '01012345678',
      governorate: 'محافظات أخرى - طلب خاص',
      city_or_area: 'الإسكندرية - سموحة',
      transaction_type: 'RENT',
      property_type: 'محل / مقر تجاري',
      budget: 12000,
      area_sqm: 65,
      additional_notes: 'مقر إداري أو عيادة طبية في موقع حيوي، يفضل واجهة رئيسية.',
      status: 'PENDING',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ]);

  const [authModal, setAuthModal] = useState<AuthModalConfig>({
    isOpen: false,
    view: 'REGISTER'
  });

  // Security Purge: Clean up any legacy sensitive database keys previously stored in localStorage
  useEffect(() => {
    try {
      const legacySensitiveKeys = [
        'rawabet_app_v3_prod_users',
        'rawabet_app_v3_prod_currentUser',
        'rawabet_app_v3_prod_properties',
        'rawabet_app_v3_prod_leads',
        'rawabet_app_v3_prod_govs',
        'rawabet_app_v3_prod_cities',
        'rawabet_app_v3_prod_areas',
        'rawabet_app_v3_prod_types',
        'rawabet_app_v3_prod_settings',
        'rawabet_app_v3_prod_help',
        'rawabet_app_v3_prod_audit',
        'rawabet_app_v3_prod_notifs',
        'rawabet_app_v3_prod_favs',
        'rawabet_app_v3_prod_compare',
        'rawabet_app_v3_prod_inquiries',
        'rawabet_app_v3_prod_property_requests',
        'rawabet_demo_v2_users',
        'rawabet_demo_v2_currentUser',
        'rawabet_demo_v2_properties',
        'rawabet_demo_v2_leads',
        'rawabet_demo_v2_govs',
        'rawabet_demo_v2_cities',
        'rawabet_demo_v2_areas',
        'rawabet_demo_v2_types',
        'rawabet_demo_v2_settings',
        'rawabet_demo_v2_help',
        'rawabet_demo_v2_audit',
        'rawabet_demo_v2_notifs',
        'rawabet_demo_v2_favs',
        'rawabet_demo_v2_compare',
        'rawabet_demo_v2_inquiries',
        'rawabet_demo_v2_property_requests',
      ];
      legacySensitiveKeys.forEach(key => localStorage.removeItem(key));
    } catch {
      // ignore
    }
  }, []);

  // Persist strictly non-sensitive UI preferences only
  useEffect(() => {
    try {
      localStorage.setItem(UI_PREF_COMPARE_KEY, JSON.stringify(compareIds));
      localStorage.setItem(UI_PREF_FAVORITES_KEY, JSON.stringify(favorites.map(f => f.property_id)));
    } catch {
      // ignore storage quota issues
    }
  }, [compareIds, favorites]);

  // Forbidden contact detector for property description and title
  const validateForbiddenContact = useCallback((text: string): { hasForbidden: boolean; match?: string } => {
    if (!text) return { hasForbidden: false };
    
    // Egyptian phone numbers pattern: 010, 011, 012, 015 with 8 digits, with or without spaces/dashes
    const phoneRegex = /(?:\+?20|0)?1[0125][\d\s-]{8,11}/;
    // URL pattern: http, https, www, .com, .net, .org, .eg, .me, etc.
    const urlRegex = /(?:https?:\/\/|www\.)[^\s]+|[\w-]+\.(?:com|net|org|eg|me|info|co|xyz|app)\b/i;
    // Social handles & messengers
    const socialRegex = /(?:واتساب|واتس|تليجرام|تليغرام|فيسبوك|فيس|انستجرام|انستا|تيك\s?توك|whatsapp|telegram|facebook|instagram)\s*[:=]?\s*[\d\w@._-]+/i;
    
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) return { hasForbidden: true, match: `رقم هاتف (${phoneMatch[0]})` };
    
    const urlMatch = text.match(urlRegex);
    if (urlMatch) return { hasForbidden: true, match: `رابط خارجي (${urlMatch[0]})` };
    
    const socialMatch = text.match(socialRegex);
    if (socialMatch) return { hasForbidden: true, match: `وسيلة تواصل اجتماعي (${socialMatch[0]})` };

    return { hasForbidden: false };
  }, []);

  // Add audit log helper
  const addAuditEntry = useCallback((entry: Omit<AuditLog, 'id' | 'created_at'>) => {
    const newLog: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // Check RBAC Permissions
  const hasPermission = useCallback((permissionKey: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;

    // Check custom explicit permissions first
    if (currentUser.custom_permissions && (currentUser.custom_permissions.includes(permissionKey) || currentUser.custom_permissions.includes('*'))) {
      return true;
    }

    // Role-based default permission matrices
    const rolePermissions: Record<UserRole, string[]> = {
      SUPER_ADMIN: [
        '*',
        'system.full_access',
        'users.manage',
        'roles.manage',
        'permissions.manage',
        'settings.manage',
        'taxonomy.manage',
        'locations.manage',
        'property.approve',
        'property.reject',
        'property.review',
        'property.view_pending',
        'property.edit_pending',
        'property.view_private_source',
        'seller.verify',
        'lead.view',
        'lead.edit',
        'lead.change_status',
        'lead.add_note',
        'lead.contact',
        'audit.view'
      ],
      OPERATIONS_MANAGER: [
        'PERM_APPROVE_PROPERTIES',
        'property.approve',
        'PERM_REJECT_PROPERTIES',
        'property.reject',
        'PERM_VIEW_PENDING',
        'property.view_pending',
        'property.review',
        'property.edit_pending',
        'PERM_VIEW_PRIVATE_SELLER_INFO',
        'property.view_private_source',
        'PERM_VERIFY_SELLERS',
        'seller.verify',
        'PERM_VIEW_AUDIT_LOGS',
        'audit.view',
        'locations.manage',
        'taxonomy.manage'
      ],
      PROPERTY_REVIEWER: [
        'PERM_APPROVE_PROPERTIES',
        'property.approve',
        'PERM_REJECT_PROPERTIES',
        'property.reject',
        'PERM_VIEW_PENDING',
        'property.view_pending',
        'property.review',
        'property.edit_pending',
        'PERM_VIEW_PRIVATE_SELLER_INFO',
        'property.view_private_source',
        'PERM_VERIFY_SELLERS',
        'seller.verify'
      ],
      SALES_USER: [
        'PERM_MANAGE_LEADS',
        'lead.view',
        'lead.edit',
        'lead.change_status',
        'lead.add_note',
        'lead.contact',
        'leads.manage'
      ],
      CONTENT_MANAGER: [
        'PERM_MANAGE_LOCATIONS',
        'locations.manage',
        'PERM_MANAGE_TAXONOMY',
        'taxonomy.manage',
        'PERM_MANAGE_SYSTEM_SETTINGS',
        'settings.general',
        'settings.branding',
        'settings.legal',
        'help.manage'
      ],
      CUSTOMER: [
        'property.browse',
        'property.favorite',
        'lead.submit'
      ]
    };

    const allowed = rolePermissions[currentUser.role] || [];
    if (allowed.includes(permissionKey)) return true;

    // If user is a verified or active seller (Owner/Broker), add seller capabilities
    if (currentUser.role === 'CUSTOMER' && currentUser.seller_profile) {
      const sellerPerms = [
        'property.create',
        'property.edit_own',
        'property.view_own_status',
        'property.view_own',
        'property.browse',
        'property.favorite'
      ];
      if (sellerPerms.includes(permissionKey)) return true;
    }

    return false;
  }, [currentUser]);

  // Auth modal triggers
  const openAuthModal = useCallback((view: 'REGISTER' | 'OTP' | 'LOGIN' = 'REGISTER', pendingAction?: () => void) => {
    setAuthModal({
      isOpen: true,
      view,
      pendingAction
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Persona switch helper - strictly restricted to development mode
  const switchPersona = useCallback((role: 'GUEST' | UserRole, specificUserId?: string) => {
    if (!import.meta.env.DEV) {
      console.warn('[Security] Persona switching is strictly disabled in production environments.');
      return;
    }
    if (role === 'GUEST') {
      setCurrentUser(null);
      return;
    }
    if (specificUserId) {
      const user = users.find(u => u.id === specificUserId);
      if (user) {
        setCurrentUser(user);
        return;
      }
    }
    // Find matching role
    const matching = users.find(u => u.role === role);
    if (matching) {
      setCurrentUser(matching);
    }
  }, [users]);

  // Robust Production Login Function
  const login = useCallback((identifier: string, password?: string): { success: boolean; error?: string; user?: User } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.trim().replace(/[\s-]+/g, '');
    
    const targetUser = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.mobile.replace(/[\s-]+/g, '') === cleanMobile
    );

    if (!targetUser) {
      return { 
        success: false, 
        error: 'لم يتم العثور على حساب مسجل بهذا البريد أو رقم الهاتف.' 
      };
    }

    if (targetUser.account_status === 'DISABLED' || targetUser.account_status === 'SUSPENDED') {
      return { 
        success: false, 
        error: 'هذا الحساب معطل أو موقوف حالياً. يرجى التواصل مع إدارة منصة روابط.' 
      };
    }

    // Check password if provided
    if (password !== undefined) {
      const isMatch = (password === targetUser.password);

      if (!isMatch) {
        return { 
          success: false, 
          error: 'كلمة المرور غير صحيحة. يرجى التحقق من كتابة كلمة المرور بالشكل السليم.' 
        };
      }
    }

    const updatedUser: User = {
      ...targetUser,
      last_login_at: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    addAuditEntry({
      actor_id: updatedUser.id,
      actor_name: updatedUser.name,
      actor_role: updatedUser.role,
      action: 'USER_LOGIN',
      entity_type: 'USER',
      entity_id: updatedUser.id,
      new_value: `تسجيل دخول ناجح للمستخدم (${updatedUser.email} - ${updatedUser.role})`
    });

    if (authModal.pendingAction) {
      authModal.pendingAction();
    }

    closeAuthModal();

    return { success: true, user: updatedUser };
  }, [users, authModal, closeAuthModal, addAuditEntry]);

  // Forgot Password Function
  const forgotPassword = useCallback((identifier: string): { success: boolean; message: string; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.trim().replace(/[\s-]+/g, '');
    
    const targetUser = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.mobile.replace(/[\s-]+/g, '') === cleanMobile
    );

    if (!targetUser) {
      return {
        success: false,
        message: 'لم يتم العثور على حساب مسجل بهذه البيانات.',
        error: 'البريد أو رقم الهاتف غير مسجل لدينا.'
      };
    }

    return {
      success: true,
      message: `تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني (${targetUser.email}) ورسالة نصية SMS.`
    };
  }, [users]);

  // Register user flow
  const registerUser = useCallback((data: { 
    name: string; 
    mobile: string; 
    email: string; 
    password?: string;
    sellerType?: SellerType;
    agencyName?: string;
    taxNumber?: string;
    governorate_id?: string; 
    area_id?: string 
  }) => {
    if (!data.name.trim() || !data.mobile.trim() || !data.email.trim()) {
      return { success: false, error: 'يرجى إكمال جميع الحقول الإلزامية' };
    }
    
    // Check if email already registered
    const existing = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول مباشرة.' };
    }

    const isSeller = !!data.sellerType;
    const newUserId = `user-${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      name: data.name.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim().replace(/[\s-]+/g, ''),
      password: data.password || 'User@12345',
      email_verified_at: new Date().toISOString(),
      account_status: 'ACTIVE',
      role: 'CUSTOMER',
      last_login_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      seller_profile: isSeller ? {
        id: `seller-${Date.now()}`,
        user_id: newUserId,
        seller_type: data.sellerType!,
        agency_name: data.agencyName,
        tax_number: data.taxNumber,
        verification_status: 'NOT_REQUESTED'
      } : undefined,
      user_profile: {
        id: `prof-${Date.now()}`,
        user_id: newUserId,
        governorate_id: data.governorate_id || 'gov-kfs',
        area_id: data.area_id || 'area-101',
        preferred_language: 'ar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      custom_permissions: isSeller ? [
        'property.create',
        'property.edit_own',
        'property.view_own_status',
        'property.browse',
        'property.favorite'
      ] : [
        'property.browse',
        'property.favorite',
        'lead.submit'
      ]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    addAuditEntry({
      actor_id: newUser.id,
      actor_name: newUser.name,
      actor_role: newUser.role,
      action: 'USER_ROLE_CHANGED',
      entity_type: 'USER',
      entity_id: newUser.id,
      new_value: `تسجيل حساب جديد بنجاح (${newUser.name} - ${isSeller ? data.sellerType : 'عميل'})`
    });

    if (authModal.pendingAction) {
      authModal.pendingAction();
    }

    closeAuthModal();
    return { success: true, user: newUser };
  }, [users, authModal, closeAuthModal, addAuditEntry]);

  // Verify OTP
  const verifyOTP = useCallback((email: string, otp: string) => {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'كود التأكيد غير صحيح. (جرّب كود الاختبار: 123456)' };
    }

    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      return { success: false, error: 'لم يتم العثور على الحساب' };
    }

    const updatedUser: User = {
      ...targetUser,
      email_verified_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    // Execute pending action if any
    if (authModal.pendingAction) {
      authModal.pendingAction();
    }
    
    closeAuthModal();
    return { success: true };
  }, [users, authModal, closeAuthModal]);

  // Login with Email (direct OTP request)
  const loginWithEmail = useCallback((email: string) => {
    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل، يرجى إنشاء حساب جديد.' };
    }
    if (targetUser.account_status === 'DISABLED' || targetUser.account_status === 'SUSPENDED') {
      return { success: false, error: 'الحساب متوقف. تواصل مع فريق روابط للمساعدة.' };
    }
    setAuthModal(prev => ({ ...prev, view: 'OTP', email }));
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    if (currentUser) {
      addAuditEntry({
        actor_id: currentUser.id,
        actor_name: currentUser.name,
        actor_role: currentUser.role,
        action: 'USER_LOGOUT',
        entity_type: 'USER',
        entity_id: currentUser.id,
        new_value: `تسجيل خروج (${currentUser.email})`
      });
    }
    setCurrentUser(null);
  }, [currentUser, addAuditEntry]);

  // Update User Profile
  const updateProfile = useCallback((data: { name?: string; mobile?: string; governorate_id?: string; area_id?: string }) => {
    if (!currentUser) return { success: false, error: 'يجب تسجيل الدخول أولاً' };

    const updatedUser: User = {
      ...currentUser,
      name: data.name !== undefined ? data.name : currentUser.name,
      mobile: data.mobile !== undefined ? data.mobile : currentUser.mobile,
      updated_at: new Date().toISOString(),
      user_profile: {
        id: currentUser.user_profile?.id || `prof-${Date.now()}`,
        user_id: currentUser.id,
        governorate_id: data.governorate_id || currentUser.user_profile?.governorate_id || 'gov-kfs',
        city_id: currentUser.user_profile?.city_id,
        area_id: data.area_id || currentUser.user_profile?.area_id || 'area-101',
        preferred_language: 'ar',
        created_at: currentUser.user_profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'USER_ROLE_CHANGED',
      entity_type: 'USER',
      entity_id: currentUser.id,
      new_value: JSON.stringify({ name: updatedUser.name, mobile: updatedUser.mobile })
    });

    return { success: true };
  }, [currentUser, addAuditEntry]);

  // Activate Owner/Broker
  const activateSellerCapability = useCallback((sellerType: SellerType) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      seller_profile: {
        id: `seller-${Date.now()}`,
        user_id: currentUser.id,
        seller_type: sellerType,
        verification_status: 'NOT_REQUESTED'
      }
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, [currentUser]);

  // Enable Seller Role with details
  const enableSellerRole = useCallback((sellerType: SellerType, agencyName?: string, taxNumber?: string) => {
    if (!currentUser) return { success: false, error: 'يجب تسجيل الدخول أولاً' };

    const updatedProfile: SellerProfile = {
      id: currentUser.seller_profile?.id || `seller-${Date.now()}`,
      user_id: currentUser.id,
      seller_type: sellerType,
      verification_status: 'NOT_REQUESTED',
      agency_name: agencyName,
      tax_number: taxNumber
    };

    const updatedUser: User = {
      ...currentUser,
      seller_profile: updatedProfile,
      updated_at: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'SELLER_VERIFICATION_REQUESTED',
      entity_type: 'USER',
      entity_id: currentUser.id,
      new_value: `ROLE_ENABLED_${sellerType}`
    });

    return { success: true };
  }, [currentUser, addAuditEntry]);

  // Request verification
  const requestSellerVerification = useCallback((note?: string) => {
    if (!currentUser || !currentUser.seller_profile) return;
    const updatedProfile: SellerProfile = {
      ...currentUser.seller_profile,
      verification_status: 'PENDING',
      verification_note: note || currentUser.seller_profile.verification_note,
      verification_requested_at: new Date().toISOString()
    };
    const updatedUser = {
      ...currentUser,
      seller_profile: updatedProfile
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'SELLER_VERIFICATION_REQUESTED',
      entity_type: 'USER',
      entity_id: currentUser.id,
      new_value: 'PENDING'
    });
  }, [currentUser, addAuditEntry]);

  // Review seller verification
  const reviewSellerVerification = useCallback((userId: string, decision: 'VERIFIED' | 'REJECTED', note?: string) => {
    const target = users.find(u => u.id === userId);
    if (!target || !target.seller_profile) return;

    const updatedUser: User = {
      ...target,
      seller_profile: {
        ...target.seller_profile,
        verification_status: decision,
        verified_at: decision === 'VERIFIED' ? new Date().toISOString() : undefined,
        verified_by: currentUser?.id,
        verification_note: note
      }
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
    }

    addAuditEntry({
      actor_id: currentUser?.id || 'admin',
      actor_name: currentUser?.name || 'إدارة روابط',
      actor_role: currentUser?.role || 'SUPER_ADMIN',
      action: decision === 'VERIFIED' ? 'SELLER_VERIFICATION_APPROVED' : 'SELLER_VERIFICATION_REJECTED',
      entity_type: 'USER',
      entity_id: userId,
      old_value: 'PENDING',
      new_value: decision,
      metadata: { note }
    });

    // Notify seller
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: userId,
        type: decision === 'VERIFIED' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
        title: decision === 'VERIFIED' ? 'تهانينا! تم توثيق حسابك من روابط' : 'تنبيه: بخصوص طلب توثيق الحساب',
        body: decision === 'VERIFIED' 
          ? 'تم اعتماد وتوثيق حسابك بنجاح. أصبحت عقاراتك تحظى بأولوية المراجعة.' 
          : `تم رفض طلب التوثيق: ${note || 'يرجى مراجعة إدارة روابط'}`,
        read_at: null,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  }, [users, currentUser, addAuditEntry]);

  // Toggle user active/disable
  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.account_status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        addAuditEntry({
          actor_id: currentUser?.id || 'admin',
          actor_name: currentUser?.name || 'إدارة روابط',
          actor_role: currentUser?.role || 'SUPER_ADMIN',
          action: 'USER_STATUS_TOGGLED',
          entity_type: 'USER',
          entity_id: userId,
          old_value: u.account_status,
          new_value: nextStatus
        });
        return { ...u, account_status: nextStatus };
      }
      return u;
    }));
  }, [currentUser, addAuditEntry]);

  // Create internal employee
  const createInternalUser = useCallback((userData: CreateInternalUserPayload) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      email_verified_at: new Date().toISOString(),
      account_status: userData.account_status || 'ACTIVE',
      role: userData.role || 'PROPERTY_REVIEWER',
      custom_permissions: userData.custom_permissions || [],
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    addAuditEntry({
      actor_id: currentUser?.id || 'admin',
      actor_name: currentUser?.name || 'إدارة روابط',
      actor_role: currentUser?.role || 'SUPER_ADMIN',
      action: 'INTERNAL_USER_CREATED',
      entity_type: 'USER',
      entity_id: newUser.id,
      new_value: `Role: ${newUser.role}, Email: ${newUser.email}`
    });
  }, [currentUser, addAuditEntry]);

  // Update permissions
  const updateUserPermissions = useCallback((userId: string, permissions: string[]) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        addAuditEntry({
          actor_id: currentUser?.id || 'admin',
          actor_name: currentUser?.name || 'إدارة روابط',
          actor_role: currentUser?.role || 'SUPER_ADMIN',
          action: 'PERMISSIONS_UPDATED',
          entity_type: 'USER',
          entity_id: userId,
          old_value: JSON.stringify(u.custom_permissions || []),
          new_value: JSON.stringify(permissions)
        });
        return { ...u, custom_permissions: permissions };
      }
      return u;
    }));
  }, [currentUser, addAuditEntry]);

  // Filter public properties
  const publishedProperties = useMemo(() => {
    return properties.filter(p => p.current_status === 'PUBLISHED' || p.current_status === 'PENDING_REVISION');
  }, [properties]);

  const getPublishedProperties = useCallback(() => {
    return publishedProperties;
  }, [publishedProperties]);

  // Filter seller own properties
  const getMyProperties = useCallback(() => {
    if (!currentUser) return [];
    return properties.filter(p => p.seller_id === currentUser.id);
  }, [properties, currentUser]);

  const getPropertyById = useCallback((propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  }, [properties]);

  // Save draft property
  const savePropertyDraft = useCallback((versionData: PropertyDraftPayload, propertyId?: string) => {
    if (!currentUser) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    }

    if (propertyId) {
      // Update existing draft
      setProperties(prev => prev.map(p => {
        if (p.id === propertyId) {
          const updatedVersions = p.versions.map(v => {
            if (v.version_status === 'DRAFT') {
              return {
                ...v,
                ...versionData,
                updated_at: new Date().toISOString()
              };
            }
            return v;
          });
          return { ...p, versions: updatedVersions, updated_at: new Date().toISOString() };
        }
        return p;
      }));
      return { success: true, propertyId };
    } else {
      // Create new draft
      const newPropId = `prop-${Date.now()}`;
      const referenceNumber = `RAW-KFS-${String(properties.length + 1).padStart(6, '0')}`;
      const newVersion: PropertyVersion = {
        id: `ver-${Date.now()}-1`,
        property_id: newPropId,
        version_number: 1,
        title: versionData.title || 'مسودة عقار جديد',
        description: versionData.description || '',
        governorate_id: versionData.governorate_id || 'gov-kfs',
        city_id: versionData.city_id || 'city-kfs-1',
        area_id: versionData.area_id || 'area-101',
        public_location_text: versionData.public_location_text || '',
        private_address: versionData.private_address || '',
        price: versionData.price || 0,
        area_sqm: versionData.area_sqm || 0,
        bedrooms: versionData.bedrooms,
        bathrooms: versionData.bathrooms,
        floor: versionData.floor,
        finishing: versionData.finishing,
        features: versionData.features || [],
        version_status: 'DRAFT',
        submitted_by: currentUser.id,
        submitted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        media: versionData.media || []
      };

      const newProperty: Property = {
        id: newPropId,
        reference_number: referenceNumber,
        seller_id: currentUser.id,
        property_type_id: versionData.property_type_id || 'type-apt',
        transaction_type_id: versionData.transaction_type_id || 'tx-sale',
        current_status: 'DRAFT',
        current_published_version_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        versions: [newVersion],
        reviews: []
      };

      setProperties(prev => [newProperty, ...prev]);
      return { success: true, propertyId: newPropId };
    }
  }, [currentUser, properties.length]);

  // Submit property for review
  const submitPropertyForReview = useCallback((propertyId: string, versionData: PropertyDraftPayload) => {
    if (!currentUser) return { success: false, error: 'غير مصرح' };

    // Validation
    if (!versionData.title || versionData.title.trim().length < 10) {
      return { success: false, error: 'عنوان العقار يجب أن يكون 10 أحرف على الأقل.' };
    }
    if (!versionData.description || versionData.description.trim().length < 30) {
      return { success: false, error: 'وصف العقار يجب أن يكون 30 حرفاً على الأقل.' };
    }
    if (!versionData.price || versionData.price <= 0) {
      return { success: false, error: 'اكتب سعر صحيح للعقار أكبر من الصفر.' };
    }
    if (!versionData.area_sqm || versionData.area_sqm <= 0) {
      return { success: false, error: 'اكتب مساحة صحيحة للعقار بالمتر المربع.' };
    }
    if (!versionData.private_address || versionData.private_address.trim().length < 5) {
      return { success: false, error: 'العنوان التفصيلي الخاص مطلوب لمراجعة فريق روابط.' };
    }

    // Check forbidden content (phone, links, social)
    const titleCheck = validateForbiddenContact(versionData.title || '');
    if (titleCheck.hasForbidden) {
      return { success: false, error: `مينفعش تضيف ${titleCheck.match} داخل عنوان العقار. التواصل بيتم من خلال روابط.` };
    }
    const descCheck = validateForbiddenContact(versionData.description || '');
    if (descCheck.hasForbidden) {
      return { success: false, error: `مينفعش تضيف ${descCheck.match} داخل وصف العقار. التواصل بيتم من خلال روابط.` };
    }

    // Check images count against property type limits
    const pType = propertyTypes.find(pt => pt.id === versionData.property_type_id || 'type-apt') || propertyTypes[0];
    const imageCount = (versionData.media || []).length;
    if (imageCount < pType.min_images) {
      return { success: false, error: `عدد الصور أقل من الحد المطلوب لنوع العقار (${pType.name_ar} يتطلب ${pType.min_images} صور على الأقل).` };
    }
    if (imageCount > pType.max_images) {
      return { success: false, error: `عدد الصور أكبر من الحد الأقصى المسموح (${pType.max_images} صور).` };
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const isAlreadyPublished = p.current_status === 'PUBLISHED' || p.current_published_version_id !== null;
        const nextStatus = isAlreadyPublished ? 'PENDING_REVISION' : 'PENDING_REVIEW';
        
        // Find existing draft/pending version or create new version
        const existingVer = p.versions[p.versions.length - 1];
        let updatedVersions = [...p.versions];

        if (existingVer && (existingVer.version_status === 'DRAFT' || existingVer.version_status === 'REJECTED')) {
          updatedVersions[updatedVersions.length - 1] = {
            ...existingVer,
            ...versionData,
            version_status: 'PENDING',
            submitted_by: currentUser.id,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as PropertyVersion;
        } else {
          const newVerNumber = p.versions.length + 1;
          const newVersion: PropertyVersion = {
            id: `ver-${p.id}-${newVerNumber}`,
            property_id: p.id,
            version_number: newVerNumber,
            title: versionData.title!,
            description: versionData.description!,
            governorate_id: versionData.governorate_id || 'gov-kfs',
            city_id: versionData.city_id || 'city-kfs-1',
            area_id: versionData.area_id || 'area-101',
            public_location_text: versionData.public_location_text || '',
            private_address: versionData.private_address || '',
            price: Number(versionData.price),
            area_sqm: Number(versionData.area_sqm),
            bedrooms: versionData.bedrooms,
            bathrooms: versionData.bathrooms,
            floor: versionData.floor,
            finishing: versionData.finishing,
            features: versionData.features || [],
            version_status: 'PENDING',
            submitted_by: currentUser.id,
            submitted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            media: versionData.media || []
          };
          updatedVersions.push(newVersion);
        }

        return {
          ...p,
          current_status: nextStatus,
          updated_at: new Date().toISOString(),
          versions: updatedVersions
        };
      }
      return p;
    }));

    // Notify internal reviewers
    const targetProp = properties.find(p => p.id === propertyId);
    const refNum = targetProp ? targetProp.reference_number : propertyId;
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: 'user-reviewer-1',
        type: 'PROPERTY_SUBMITTED',
        title: 'عقار جديد قيد المراجعة',
        body: `تم إرسال العقار رقم ${refNum} للمراجعة من قبل المالك/الوسيط.`,
        related_type: 'PROPERTY',
        related_id: propertyId,
        read_at: null,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'PROPERTY_SUBMITTED_FOR_REVIEW',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      new_value: 'PENDING_REVIEW'
    });

    return { success: true };
  }, [currentUser, properties, propertyTypes, validateForbiddenContact, addAuditEntry]);

  // Approve property version
  const approvePropertyVersion = useCallback((propertyId: string, versionId: string, internalNote?: string) => {
    if (!currentUser || !hasPermission('property.approve')) {
      return { success: false, error: 'ما عندكش صلاحية لاعتماد العقارات.' };
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updatedVersions = p.versions.map(v => {
          if (v.id === versionId) {
            return {
              ...v,
              version_status: 'APPROVED' as const,
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
              review_decision: 'APPROVED' as const,
              updated_at: new Date().toISOString()
            };
          }
          return v;
        });

        const newReview = {
          id: `rev-${Date.now()}`,
          property_id: propertyId,
          property_version_id: versionId,
          reviewer_id: currentUser.id,
          reviewer_name: currentUser.name,
          decision: 'APPROVED' as const,
          internal_note: internalNote || 'تمت الموافقة ونشر العقار',
          created_at: new Date().toISOString()
        };

        return {
          ...p,
          current_status: 'PUBLISHED' as const,
          current_published_version_id: versionId,
          updated_at: new Date().toISOString(),
          versions: updatedVersions,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    }));

    const targetProp = properties.find(p => p.id === propertyId);
    const sellerId = targetProp ? targetProp.seller_id : '';

    // Notify seller
    if (sellerId) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          user_id: sellerId,
          type: 'PROPERTY_APPROVED',
          title: 'تهانينا! تمت الموافقة على عقارك',
          body: `تمت مراجعة ونشر عقارك رقم ${targetProp?.reference_number} على منصة روابط بنجاح.`,
          related_type: 'PROPERTY',
          related_id: propertyId,
          read_at: null,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
    }

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'PROPERTY_APPROVED',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      field_name: 'current_published_version_id',
      new_value: versionId,
      metadata: { internalNote }
    });

    return { success: true };
  }, [currentUser, hasPermission, properties, addAuditEntry]);

  // Reject property version
  const rejectPropertyVersion = useCallback((propertyId: string, versionId: string, rejectionReason: string, internalNote?: string) => {
    if (!currentUser || !hasPermission('property.reject')) {
      return { success: false, error: 'ما عندكش صلاحية لرفض العقارات.' };
    }
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return { success: false, error: 'اكتب سبب الرفض بالتفصيل (10 أحرف على الأقل) قبل المتابعة.' };
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updatedVersions = p.versions.map(v => {
          if (v.id === versionId) {
            return {
              ...v,
              version_status: 'REJECTED' as const,
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
              review_decision: 'REJECTED' as const,
              rejection_reason: rejectionReason,
              updated_at: new Date().toISOString()
            };
          }
          return v;
        });

        const newReview = {
          id: `rev-${Date.now()}`,
          property_id: propertyId,
          property_version_id: versionId,
          reviewer_id: currentUser.id,
          reviewer_name: currentUser.name,
          decision: 'REJECTED' as const,
          reason: rejectionReason,
          internal_note: internalNote || '',
          created_at: new Date().toISOString()
        };

        // If the property has an existing published version, it stays PUBLISHED with old version!
        const nextStatus = p.current_published_version_id ? 'PUBLISHED' : 'REJECTED';

        return {
          ...p,
          current_status: nextStatus,
          updated_at: new Date().toISOString(),
          versions: updatedVersions,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    }));

    const targetProp = properties.find(p => p.id === propertyId);
    const sellerId = targetProp ? targetProp.seller_id : '';

    if (sellerId) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          user_id: sellerId,
          type: 'PROPERTY_REJECTED',
          title: 'العقار محتاج شوية تعديلات قبل النشر',
          body: `بخصوص العقار رقم ${targetProp?.reference_number}: ${rejectionReason}`,
          related_type: 'PROPERTY',
          related_id: propertyId,
          read_at: null,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
    }

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'PROPERTY_REJECTED',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      old_value: 'PENDING',
      new_value: 'REJECTED',
      metadata: { rejectionReason, internalNote }
    });

    return { success: true };
  }, [currentUser, hasPermission, properties, addAuditEntry]);

  // Start property review (Mark as UNDER_REVIEW)
  const startPropertyReview = useCallback((propertyId: string, versionId: string) => {
    if (!currentUser || !hasPermission('property.view_pending')) {
      return { success: false, error: 'غير مصرح' };
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          current_status: 'UNDER_REVIEW' as const,
          updated_at: new Date().toISOString()
        };
      }
      return p;
    }));

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'PROPERTY_REVIEW_STARTED',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      new_value: 'UNDER_REVIEW'
    });

    return { success: true };
  }, [currentUser, hasPermission, addAuditEntry]);

  // Request Property Modification (Needs Modification workflow)
  const requestPropertyModification = useCallback((propertyId: string, versionId: string, modificationFeedback: string, internalNote?: string) => {
    if (!currentUser || !hasPermission('property.reject')) {
      return { success: false, error: 'ما عندكش صلاحية لإرجاع العقار للتعديل.' };
    }
    if (!modificationFeedback || modificationFeedback.trim().length < 5) {
      return { success: false, error: 'اكتب التعديلات المطلوبة بوضوح لتوجيه المالك.' };
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updatedVersions = p.versions.map(v => {
          if (v.id === versionId) {
            return {
              ...v,
              version_status: 'NEEDS_MODIFICATION' as const,
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
              review_decision: 'NEEDS_MODIFICATION' as const,
              rejection_reason: modificationFeedback,
              updated_at: new Date().toISOString()
            };
          }
          return v;
        });

        const newReview = {
          id: `rev-${Date.now()}`,
          property_id: propertyId,
          property_version_id: versionId,
          reviewer_id: currentUser.id,
          reviewer_name: currentUser.name,
          decision: 'NEEDS_MODIFICATION' as const,
          reason: modificationFeedback,
          internal_note: internalNote || '',
          created_at: new Date().toISOString()
        };

        return {
          ...p,
          current_status: 'NEEDS_MODIFICATION' as const,
          updated_at: new Date().toISOString(),
          versions: updatedVersions,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    }));

    const targetProp = properties.find(p => p.id === propertyId);
    const sellerId = targetProp ? targetProp.seller_id : '';

    if (sellerId) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          user_id: sellerId,
          type: 'PROPERTY_REJECTED',
          title: 'مطلوب تعديلات على إعلان العقار',
          body: `بخصوص العقار رقم ${targetProp?.reference_number}: ${modificationFeedback}`,
          related_type: 'PROPERTY',
          related_id: propertyId,
          read_at: null,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
    }

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'PROPERTY_MODIFICATION_REQUESTED',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      new_value: 'NEEDS_MODIFICATION',
      metadata: { modificationFeedback, internalNote }
    });

    return { success: true };
  }, [currentUser, hasPermission, properties, addAuditEntry]);

  // Clone published version to create a new draft revision (Mandatory Versioning Principle!)
  const editPublishedPropertyAsRevision = useCallback((propertyId: string): string | null => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop || !prop.current_published_version_id) return null;

    const currentPublishedVer = prop.versions.find(v => v.id === prop.current_published_version_id);
    if (!currentPublishedVer) return null;

    // Check if there is already a draft/pending revision
    const existingDraft = prop.versions.find(v => v.version_status === 'DRAFT' || v.version_status === 'PENDING');
    if (existingDraft) {
      return existingDraft.id;
    }

    const newVerNum = prop.versions.length + 1;
    const newVersion: PropertyVersion = {
      ...currentPublishedVer,
      id: `ver-${prop.id}-${newVerNum}`,
      version_number: newVerNum,
      version_status: 'DRAFT',
      submitted_at: null,
      reviewed_by: null,
      reviewed_at: null,
      review_decision: null,
      rejection_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          versions: [...p.versions, newVersion],
          updated_at: new Date().toISOString()
        };
      }
      return p;
    }));

    return newVersion.id;
  }, [properties]);

  // Direct internal edit of published property (Audited!)
  const directInternalEditPublishedProperty = useCallback((propertyId: string, versionId: string, updatedFields: InternalEditPropertyPayload) => {
    if (!currentUser || !hasPermission('property.edit_published')) {
      return { success: false, error: 'غير مصرح بتعديل العقارات المنشورة مباشرة.' };
    }

    const prop = properties.find(p => p.id === propertyId);
    const ver = prop?.versions.find(v => v.id === versionId);

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updatedVersions = p.versions.map(v => {
          if (v.id === versionId) {
            return {
              ...v,
              ...updatedFields,
              updated_at: new Date().toISOString()
            };
          }
          return v;
        });
        return { ...p, versions: updatedVersions, updated_at: new Date().toISOString() };
      }
      return p;
    }));

    addAuditEntry({
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      actor_role: currentUser.role,
      action: 'DIRECT_INTERNAL_PUBLISHED_EDIT',
      entity_type: 'PROPERTY',
      entity_id: propertyId,
      old_value: JSON.stringify({ price: ver?.price, title: ver?.title }),
      new_value: JSON.stringify({ price: updatedFields.price, title: updatedFields.title })
    });

    return { success: true };
  }, [currentUser, hasPermission, properties, addAuditEntry]);

  // Mark property Sold / Rented / Archived
  const markPropertyStatus = useCallback((propertyId: string, status: 'SOLD' | 'RENTED' | 'ARCHIVED') => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        addAuditEntry({
          actor_id: currentUser?.id || 'admin',
          actor_name: currentUser?.name || 'مستخدم روابط',
          actor_role: currentUser?.role || 'CUSTOMER',
          action: `PROPERTY_MARKED_${status}`,
          entity_type: 'PROPERTY',
          entity_id: propertyId,
          old_value: p.current_status,
          new_value: status
        });
        return { ...p, current_status: status, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  }, [currentUser, addAuditEntry]);

  // Lead generation & deduplication rule
  const createLeadFromInteraction = useCallback((propertyId: string, channel: LeadChannel) => {
    if (!currentUser) {
      openAuthModal('REGISTER', () => {
        // Will re-invoke on success
      });
      return { success: false, error: 'AUTH_REQUIRED' };
    }

    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return { success: false, error: 'العقار غير موجود' };

    const activeVersion = prop.versions.find(v => v.id === prop.current_published_version_id) || prop.versions[0];

    // Check deduplication: customer_id + property_id + open lead
    const openStatuses: LeadStatus[] = ['NEW', 'WHATSAPP_CONTACT_INITIATED', 'CALL_CONTACT_INITIATED', 'CONTACTED', 'FOLLOW_UP', 'VIEWING'];
    const existingOpenLead = leads.find(l => 
      l.customer_id === currentUser.id && 
      l.property_id === propertyId && 
      openStatuses.includes(l.status)
    );

    if (existingOpenLead) {
      // Append Activity instead of duplicate open Lead!
      const newActivity = {
        id: `act-${Date.now()}`,
        lead_id: existingOpenLead.id,
        activity_type: (channel === 'WHATSAPP' ? 'WHATSAPP_CONTACT_INITIATED' : 'CALL_CONTACT_INITIATED') as LeadActivityType,
        channel,
        description: `تكرار اهتمام العميل بالعقار عبر قناة ${channel === 'WHATSAPP' ? 'واتساب' : 'الاتصال الهاتفي'}`,
        created_by: currentUser.id,
        created_by_name: currentUser.name,
        created_at: new Date().toISOString()
      };

      setLeads(prev => prev.map(l => {
        if (l.id === existingOpenLead.id) {
          return {
            ...l,
            last_activity_at: new Date().toISOString(),
            activities: [newActivity, ...l.activities]
          };
        }
        return l;
      }));

      return { success: true, leadId: existingOpenLead.id };
    } else {
      // Create new Lead
      const newLeadId = `lead-${Date.now()}`;
      const refNum = `LEAD-${String(leads.length + 1).padStart(6, '0')}`;
      const initialStatus: LeadStatus = channel === 'WHATSAPP' ? 'WHATSAPP_CONTACT_INITIATED' : 'CALL_CONTACT_INITIATED';

      const newLead: Lead = {
        id: newLeadId,
        reference_number: refNum,
        customer_id: currentUser.id,
        customer_name: currentUser.name,
        customer_mobile: currentUser.mobile,
        customer_email: currentUser.email,
        property_id: propertyId,
        property_reference: prop.reference_number,
        property_title: activeVersion.title,
        status: initialStatus,
        source: 'Website Detail Page',
        contact_channel: channel,
        assigned_to: 'user-sales-1',
        assigned_user_name: 'سارة يوسف (مسؤول مبيعات)',
        last_activity_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        activities: [
          {
            id: `act-${Date.now()}-1`,
            lead_id: newLeadId,
            activity_type: 'CREATED',
            channel,
            description: `تم إنشاء الطلب آلياً عند بدء العميل التواصل عبر ${channel === 'WHATSAPP' ? 'واتساب' : 'الاتصال الهاتفي'}`,
            created_by: currentUser.id,
            created_by_name: currentUser.name,
            created_at: new Date().toISOString()
          },
          {
            id: `act-${Date.now()}-2`,
            lead_id: newLeadId,
            activity_type: (channel === 'WHATSAPP' ? 'WHATSAPP_CONTACT_INITIATED' : 'CALL_CONTACT_INITIATED') as LeadActivityType,
            channel,
            description: `تم توجيه العميل لأرقام روابط المعتمدة (${settings.primary_phone})`,
            created_by: currentUser.id,
            created_by_name: currentUser.name,
            created_at: new Date().toISOString()
          }
        ],
        notes: []
      };

      setLeads(prev => [newLead, ...prev]);

      // Notify Sales team
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          user_id: 'user-sales-1',
          type: 'NEW_LEAD',
          title: 'طلب اهتمام جديد بعقار',
          body: `اهتمام جديد من العميل ${currentUser.name} بالعقار ${prop.reference_number}.`,
          related_type: 'LEAD',
          related_id: newLeadId,
          read_at: null,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);

      return { success: true, leadId: newLeadId };
    }
  }, [currentUser, properties, leads, settings.primary_phone, openAuthModal]);

  // Update Lead Status
  const updateLeadStatus = useCallback((leadId: string, newStatus: LeadStatus, noteBody?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updatedActivities = [
          {
            id: `act-${Date.now()}`,
            lead_id: leadId,
            activity_type: 'STATUS_CHANGED' as const,
            description: `تغيير حالة الطلب من [${l.status}] إلى [${newStatus}]`,
            created_by: currentUser?.id,
            created_by_name: currentUser?.name || 'فريق المبيعات',
            created_at: new Date().toISOString()
          },
          ...l.activities
        ];

        let updatedNotes = l.notes;
        if (noteBody && noteBody.trim()) {
          updatedNotes = [
            {
              id: `note-${Date.now()}`,
              lead_id: leadId,
              user_id: currentUser?.id || 'sales',
              user_name: currentUser?.name || 'مسؤول مبيعات',
              body: noteBody.trim(),
              created_at: new Date().toISOString()
            },
            ...l.notes
          ];
        }

        return {
          ...l,
          status: newStatus,
          last_activity_at: new Date().toISOString(),
          activities: updatedActivities,
          notes: updatedNotes
        };
      }
      return l;
    }));
  }, [currentUser]);

  // Add internal Lead Note
  const addLeadNote = useCallback((leadId: string, noteBody: string) => {
    if (!noteBody.trim()) return;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNote = {
          id: `note-${Date.now()}`,
          lead_id: leadId,
          user_id: currentUser?.id || 'sales',
          user_name: currentUser?.name || 'مسؤول مبيعات',
          body: noteBody.trim(),
          created_at: new Date().toISOString()
        };
        const newAct = {
          id: `act-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'NOTE_ADDED' as const,
          description: 'إضافة ملاحظة داخلية جديدة لمتابعة الطلب',
          created_by: currentUser?.id,
          created_by_name: currentUser?.name || 'مسؤول مبيعات',
          created_at: new Date().toISOString()
        };
        return {
          ...l,
          last_activity_at: new Date().toISOString(),
          notes: [newNote, ...l.notes],
          activities: [newAct, ...l.activities]
        };
      }
      return l;
    }));
  }, [currentUser]);

  const assignLead = useCallback((leadId: string, userId: string) => {
    const assignedUser = users.find(u => u.id === userId);
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          assigned_to: userId,
          assigned_user_name: assignedUser?.name || 'مسؤول مبيعات',
          last_activity_at: new Date().toISOString(),
          activities: [
            {
              id: `act-${Date.now()}`,
              lead_id: leadId,
              activity_type: 'ASSIGNED',
              description: `تم إسناد الطلب للمسؤول: ${assignedUser?.name}`,
              created_by: currentUser?.id,
              created_by_name: currentUser?.name || 'المشرف',
              created_at: new Date().toISOString()
            },
            ...l.activities
          ]
        };
      }
      return l;
    }));
  }, [users, currentUser]);

  // Create Viewing Request (Secondary CTA on Property Details)
  const createViewingRequest = useCallback((propertyId: string, data: { customerName: string; customerMobile: string; preferredDate: string; preferredTime: string; notes?: string }) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return { success: false, error: 'العقار غير موجود' };

    const activeVersion = prop.versions.find(v => v.id === prop.current_published_version_id) || prop.versions[0];
    const newLeadId = `lead-${Date.now()}`;
    const refNum = `VIEW-${String(leads.length + 1).padStart(6, '0')}`;

    const newLead: Lead = {
      id: newLeadId,
      reference_number: refNum,
      customer_id: currentUser?.id || 'guest',
      customer_name: data.customerName,
      customer_mobile: data.customerMobile,
      customer_email: currentUser?.email || '',
      property_id: propertyId,
      property_reference: prop.reference_number,
      property_title: activeVersion.title,
      status: 'VIEWING',
      source: 'طلب معاينة ميدانية عبر الموقع',
      contact_channel: 'WEBSITE',
      assigned_to: 'user-sales-1',
      assigned_user_name: 'سارة يوسف (مسؤول مبيعات)',
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}-1`,
          lead_id: newLeadId,
          activity_type: 'VIEWING_SCHEDULED',
          channel: 'WEBSITE',
          description: `حجز معاينة ميدانية مبدئية بتاريخ ${data.preferredDate} الساعة ${data.preferredTime}`,
          created_by: currentUser?.id || 'guest',
          created_by_name: data.customerName,
          created_at: new Date().toISOString()
        }
      ],
      notes: data.notes ? [
        {
          id: `note-${Date.now()}`,
          lead_id: newLeadId,
          user_id: currentUser?.id || 'customer',
          user_name: data.customerName,
          body: `ملاحظات المعاينة من العميل: ${data.notes}`,
          created_at: new Date().toISOString()
        }
      ] : []
    };

    setLeads(prev => [newLead, ...prev]);

    // Send Sales notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: 'user-sales-1',
        type: 'NEW_LEAD',
        title: 'طلب معاينة ميدانية جديد',
        body: `طلب العميل ${data.customerName} معاينة العقار ${prop.reference_number} بتاريخ ${data.preferredDate} الساعة ${data.preferredTime}`,
        related_type: 'LEAD',
        related_id: newLeadId,
        read_at: null,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    addAuditEntry({
      actor_id: currentUser?.id || 'guest',
      actor_name: data.customerName,
      actor_role: currentUser?.role || 'CUSTOMER',
      action: 'VIEWING_REQUEST_CREATED',
      entity_type: 'LEAD',
      entity_id: newLeadId,
      metadata: { propertyId, preferredDate: data.preferredDate, preferredTime: data.preferredTime }
    });

    return { success: true, leadId: newLeadId };
  }, [currentUser, properties, leads.length, addAuditEntry]);

  // Schedule follow up
  const scheduleFollowUp = useCallback((leadId: string, followUpDate: string, notes?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newAct = {
          id: `act-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'FOLLOW_UP_SCHEDULED' as const,
          description: `تم جدولة متابعة لاحقة مع العميل بتاريخ: ${followUpDate}`,
          created_by: currentUser?.id || 'sales',
          created_by_name: currentUser?.name || 'مسؤول مبيعات',
          created_at: new Date().toISOString()
        };

        const newNotes = notes && notes.trim() ? [
          {
            id: `note-${Date.now()}`,
            lead_id: leadId,
            user_id: currentUser?.id || 'sales',
            user_name: currentUser?.name || 'مسؤول مبيعات',
            body: `جدولة متابعة: ${notes.trim()}`,
            created_at: new Date().toISOString()
          },
          ...l.notes
        ] : l.notes;

        return {
          ...l,
          status: 'FOLLOW_UP' as const,
          last_activity_at: new Date().toISOString(),
          activities: [newAct, ...l.activities],
          notes: newNotes
        };
      }
      return l;
    }));
  }, [currentUser]);

  // Mark lead contacted
  const markLeadContacted = useCallback((leadId: string, notes?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newAct = {
          id: `act-${Date.now()}`,
          lead_id: leadId,
          activity_type: 'CALL_COMPLETED' as const,
          description: `تم التواصل هاتفياً مع العميل والتحقق من الجدية والطلب`,
          created_by: currentUser?.id || 'sales',
          created_by_name: currentUser?.name || 'مسؤول مبيعات',
          created_at: new Date().toISOString()
        };

        const newNotes = notes && notes.trim() ? [
          {
            id: `note-${Date.now()}`,
            lead_id: leadId,
            user_id: currentUser?.id || 'sales',
            user_name: currentUser?.name || 'مسؤول مبيعات',
            body: notes.trim(),
            created_at: new Date().toISOString()
          },
          ...l.notes
        ] : l.notes;

        return {
          ...l,
          status: 'CONTACTED' as const,
          last_activity_at: new Date().toISOString(),
          activities: [newAct, ...l.activities],
          notes: newNotes
        };
      }
      return l;
    }));
  }, [currentUser]);

  // Master Data modifications
  const toggleGovernorateActive = useCallback((govId: string) => {
    setGovernorates(prev => prev.map(g => {
      if (g.id === govId) {
        const next = !g.is_active;
        addAuditEntry({
          actor_id: currentUser?.id || 'admin',
          actor_name: currentUser?.name || 'إدارة روابط',
          actor_role: currentUser?.role || 'SUPER_ADMIN',
          action: next ? 'GOVERNORATE_ACTIVATED' : 'GOVERNORATE_DEACTIVATED',
          entity_type: 'GOVERNORATE',
          entity_id: govId,
          old_value: String(g.is_active),
          new_value: String(next)
        });
        return { ...g, is_active: next, updated_at: new Date().toISOString() };
      }
      return g;
    }));
  }, [currentUser, addAuditEntry]);

  const addGovernorate = useCallback((name_ar: string) => {
    const safeName = (name_ar || '').trim();
    const newGov: Governorate = {
      id: `gov-${Date.now()}`,
      name_ar: safeName,
      slug: safeName.toLowerCase().replace(/\s+/g, '-'),
      is_active: true,
      created_by: currentUser?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setGovernorates(prev => [...prev, newGov]);
    addAuditEntry({
      actor_id: currentUser?.id || 'admin',
      actor_name: currentUser?.name || 'إدارة روابط',
      actor_role: currentUser?.role || 'SUPER_ADMIN',
      action: 'GOVERNORATE_CREATED',
      entity_type: 'GOVERNORATE',
      entity_id: newGov.id,
      new_value: name_ar
    });
  }, [currentUser, addAuditEntry]);

  const toggleCityActive = useCallback((cityId: string) => {
    setCities(prev => prev.map(c => c.id === cityId ? { ...c, is_active: !c.is_active } : c));
  }, []);

  const addCity = useCallback((governorateId: string, name_ar: string) => {
    const newCity: City = {
      id: `city-${Date.now()}`,
      governorate_id: governorateId,
      name_ar,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCities(prev => [...prev, newCity]);
  }, []);

  const addArea = useCallback((cityId: string, name_ar: string) => {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      city_id: cityId,
      name_ar,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setAreas(prev => [...prev, newArea]);
  }, []);

  const updatePropertyType = useCallback((typeId: string, updates: UpdatePropertyTypePayload) => {
    setPropertyTypes(prev => prev.map(pt => pt.id === typeId ? { ...pt, ...updates, updated_at: new Date().toISOString() } : pt));
  }, []);

  const updateSettings = useCallback((newSettings: UpdateSystemSettingsPayload) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings, updated_at: new Date().toISOString() };
      addAuditEntry({
        actor_id: currentUser?.id || 'admin',
        actor_name: currentUser?.name || 'إدارة روابط',
        actor_role: currentUser?.role || 'SUPER_ADMIN',
        action: 'SYSTEM_SETTINGS_UPDATED',
        entity_type: 'SYSTEM',
        entity_id: 'SYSTEM_SETTINGS',
        new_value: JSON.stringify(newSettings)
      });
      return updated;
    });
  }, [currentUser, addAuditEntry]);

  const addHelpResource = useCallback((resource: Omit<HelpResource, 'id'>) => {
    const newRes: HelpResource = {
      ...resource,
      id: `help-${Date.now()}`
    };
    setHelpResources(prev => [...prev, newRes]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
  }, []);

  const toggleFavorite = useCallback((propertyId: string) => {
    const effectiveUserId = currentUser?.id || 'guest';
    setFavorites(prev => {
      // Filter out already expired favorites on each action
      const validFavs = prev.filter(f => !f.expires_at || new Date(f.expires_at).getTime() > Date.now());
      const exists = validFavs.some(f => f.user_id === effectiveUserId && f.property_id === propertyId);
      if (exists) {
        return validFavs.filter(f => !(f.user_id === effectiveUserId && f.property_id === propertyId));
      } else {
        const newFav: Favorite = {
          id: `fav-${Date.now()}`,
          user_id: effectiveUserId,
          property_id: propertyId,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 86400000).toISOString() // 30-day expiration
        };
        return [...validFavs, newFav];
      }
    });
  }, [currentUser]);

  const isFavorite = useCallback((propertyId: string) => {
    const effectiveUserId = currentUser?.id || 'guest';
    return favorites.some(f => 
      f.user_id === effectiveUserId && 
      f.property_id === propertyId && 
      (!f.expires_at || new Date(f.expires_at).getTime() > Date.now())
    );
  }, [currentUser, favorites]);

  // Submit Customer Property Request (Demand capture when no matching inventory is found)
  const submitPropertyRequest = useCallback((data: Omit<PropertyRequest, 'id' | 'reference_number' | 'created_at' | 'status'>) => {
    const newId = `req-${Date.now()}`;
    const refNum = `REQ-${String(propertyRequests.length + 101).padStart(5, '0')}`;
    const newReq: PropertyRequest = {
      ...data,
      id: newId,
      reference_number: refNum,
      customer_id: currentUser?.id,
      source: data.source || 'طلب عقار بمواصفات خاصة (Demand Capture)',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    setPropertyRequests(prev => [newReq, ...prev]);

    // Phase 5 & 6 requirement: The customer request immediately creates a Lead for Rawabet team
    const newLeadId = `lead-${Date.now()}`;
    const leadRef = `LEAD-${String(leads.length + 1).padStart(6, '0')}`;
    const formattedBudget = new Intl.NumberFormat('ar-EG').format(data.budget);

    const newLead: Lead = {
      id: newLeadId,
      reference_number: leadRef,
      customer_id: currentUser?.id || `cust-req-${Date.now()}`,
      customer_name: data.full_name,
      customer_mobile: data.whatsapp_number,
      customer_email: currentUser?.email || '',
      property_id: 'SPECIAL_REQUEST',
      property_reference: refNum,
      property_title: `طلب عقار بمواصفات خاصة: ${data.property_type} (${data.transaction_type === 'BUY' ? 'شراء' : 'إيجار'}) - ميزانية ${formattedBudget} ج.م`,
      status: 'NEW',
      source: data.source || 'طلب عقار بمواصفات خاصة (Demand Capture)',
      contact_channel: 'WHATSAPP',
      assigned_to: 'user-sales-1',
      assigned_user_name: 'سارة يوسف (مسؤول مبيعات)',
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}-1`,
          lead_id: newLeadId,
          activity_type: 'CREATED',
          channel: 'WHATSAPP',
          description: `تسجيل طلب عقار بمواصفات خاصة: ${data.property_type} في ${data.city_or_area} (${data.governorate})، ميزانية: ${formattedBudget} جنيه`,
          created_by: currentUser?.id || 'customer',
          created_by_name: data.full_name,
          created_at: new Date().toISOString()
        }
      ],
      notes: [
        {
          id: `note-${Date.now()}-1`,
          lead_id: newLeadId,
          user_id: 'system',
          user_name: 'نظام إدارة الطلبات',
          body: `المحافظة: ${data.governorate} | المنطقة/المدينة: ${data.city_or_area} | المساحة: ${data.area_sqm || 'غير محدد'} م² | الغرف: ${data.bedrooms || 'غير محدد'} | ملاحظات العميل: ${data.additional_notes || 'لا توجد'}`,
          created_at: new Date().toISOString()
        }
      ]
    };

    setLeads(prev => [newLead, ...prev]);

    // Notify Sales team
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: 'user-sales-1',
        type: 'NEW_LEAD',
        title: 'طلب عقار جديد بمواصفات خاصة',
        body: `سجل العميل ${data.full_name} طلباً لـ (${data.property_type}) بميزانية ${formattedBudget} ج.م في ${data.city_or_area}.`,
        related_type: 'LEAD',
        related_id: newLeadId,
        read_at: null,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    return { success: true, request: newReq };
  }, [currentUser, propertyRequests.length, leads.length]);

  const unreadNotificationsCount = notifications.filter(n => {
    if (!currentUser) return false;
    return (n.user_id === currentUser.id || currentUser.role === 'SUPER_ADMIN') && !n.read_at;
  }).length;

  const addToCompare = useCallback((propertyId: string) => {
    if (compareIds.includes(propertyId)) {
      return { success: false, message: 'العقار مضاف بالفعل لقائمة المقارنة' };
    }
    if (compareIds.length >= 4) {
      return { success: false, message: 'الحد الأقصى للمقارنة هو 4 عقارات في وقت واحد' };
    }
    setCompareIds(prev => [...prev, propertyId]);
    return { success: true, message: 'تمت إضافة العقار للمقارنة بنجاح' };
  }, [compareIds]);

  const removeFromCompare = useCallback((propertyId: string) => {
    setCompareIds(prev => prev.filter(id => id !== propertyId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isInCompare = useCallback((propertyId: string) => {
    return compareIds.includes(propertyId);
  }, [compareIds]);

  const submitContactInquiry = useCallback((data: Omit<ContactInquiry, 'id' | 'created_at' | 'status'>) => {
    const newInq: ContactInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'NEW',
      created_at: new Date().toISOString()
    };
    setContactInquiries(prev => [newInq, ...prev]);

    // Send admin notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: 'user-super-1',
        type: 'CONTACT_INQUIRY',
        title: 'رسالة تواصل جديدة',
        body: `رسالة جديدة من ${data.name}: "${data.subject}"`,
        read_at: null,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    return { success: true };
  }, []);

  const updateContactInquiryStatus = useCallback((id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED', response_notes?: string) => {
    setContactInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          status,
          response_notes: response_notes !== undefined ? response_notes : inq.response_notes
        };
      }
      return inq;
    }));
  }, []);

  const resetToDefaultData = useCallback(() => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[3]);
    setProperties(INITIAL_PROPERTIES);
    setLeads(INITIAL_LEADS);
    setGovernorates(INITIAL_GOVERNORATES);
    setCities(INITIAL_CITIES);
    setAreas(INITIAL_AREAS);
    setPropertyTypes(INITIAL_PROPERTY_TYPES);
    setSettings(INITIAL_SETTINGS);
    setHelpResources(INITIAL_HELP_RESOURCES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFavorites([
      { id: 'fav-1', user_id: 'user-cust-1', property_id: 'prop-101', created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }
    ]);
    setCompareIds([]);
    try {
      localStorage.removeItem(UI_PREF_COMPARE_KEY);
      localStorage.removeItem(UI_PREF_FAVORITES_KEY);
    } catch {}
  }, []);

  const contextValue: AppContextType = useMemo(() => ({
    currentUser,
    users,
    properties,
    leads,
    governorates,
    cities,
    areas,
    propertyTypes,
    transactionTypes,
    settings,
    helpResources,
    auditLogs,
    notifications,
    favorites,
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    contactInquiries,
    submitContactInquiry,
    updateContactInquiryStatus,
    authModal,
    unreadNotificationsCount,
    userProfile: currentUser?.user_profile,
    sellerProfile: currentUser?.seller_profile,
    setCurrentUser,
    switchPersona,
    openAuthModal,
    closeAuthModal,
    login,
    forgotPassword,
    registerUser,
    verifyOTP,
    loginWithEmail,
    logout,
    updateProfile,
    activateSellerCapability,
    enableSellerRole,
    requestSellerVerification,
    reviewSellerVerification,
    toggleUserStatus,
    createInternalUser,
    updateUserPermissions,
    getPublishedProperties,
    getMyProperties,
    getPropertyById,
    savePropertyDraft,
    submitPropertyForReview,
    approvePropertyVersion,
    approveVersion: approvePropertyVersion,
    rejectPropertyVersion,
    rejectVersion: rejectPropertyVersion,
    startPropertyReview,
    requestPropertyModification,
    editPublishedPropertyAsRevision,
    directInternalEditPublishedProperty,
    markPropertyStatus,
    validateForbiddenContact,
    createLeadFromInteraction,
    createLead: createLeadFromInteraction,
    createViewingRequest,
    updateLeadStatus,
    addLeadNote,
    assignLead,
    scheduleFollowUp,
    markLeadContacted,
    toggleGovernorateActive,
    addGovernorate,
    toggleCityActive,
    addCity,
    addArea,
    updatePropertyType,
    updateSettings,
    addHelpResource,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleFavorite,
    isFavorite,
    propertyRequests,
    submitPropertyRequest,
    hasPermission,
    addAuditEntry,
    resetToDefaultData,
    resetToDefault: resetToDefaultData
  }), [
    currentUser,
    users,
    properties,
    leads,
    governorates,
    cities,
    areas,
    propertyTypes,
    transactionTypes,
    settings,
    helpResources,
    auditLogs,
    notifications,
    favorites,
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    contactInquiries,
    submitContactInquiry,
    updateContactInquiryStatus,
    authModal,
    unreadNotificationsCount,
    setCurrentUser,
    switchPersona,
    openAuthModal,
    closeAuthModal,
    login,
    forgotPassword,
    registerUser,
    verifyOTP,
    loginWithEmail,
    logout,
    updateProfile,
    activateSellerCapability,
    enableSellerRole,
    requestSellerVerification,
    reviewSellerVerification,
    toggleUserStatus,
    createInternalUser,
    updateUserPermissions,
    getPublishedProperties,
    getMyProperties,
    getPropertyById,
    savePropertyDraft,
    submitPropertyForReview,
    approvePropertyVersion,
    rejectPropertyVersion,
    startPropertyReview,
    requestPropertyModification,
    editPublishedPropertyAsRevision,
    directInternalEditPublishedProperty,
    markPropertyStatus,
    validateForbiddenContact,
    createLeadFromInteraction,
    createViewingRequest,
    updateLeadStatus,
    addLeadNote,
    assignLead,
    scheduleFollowUp,
    markLeadContacted,
    toggleGovernorateActive,
    addGovernorate,
    toggleCityActive,
    addCity,
    addArea,
    updatePropertyType,
    updateSettings,
    addHelpResource,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleFavorite,
    isFavorite,
    propertyRequests,
    submitPropertyRequest,
    hasPermission,
    addAuditEntry,
    resetToDefaultData
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
