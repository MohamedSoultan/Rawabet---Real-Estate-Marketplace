import { create } from 'zustand';
import { User, UserRole, SellerProfile, CreateInternalUserPayload } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthModalOpen: boolean;
  authModalMode: 'LOGIN' | 'REGISTER' | 'OTP';
  authEmail: string;
  authMobile: string;
  pendingAction: string | null;

  // Actions
  setCurrentUser: (user: User | null) => void;
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER', pendingAction?: string) => void;
  closeAuthModal: () => void;
  loginWithEmailOrPhone: (identifier: string) => Promise<{ success: boolean; requiresOtp: boolean; message?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (name: string, email: string, mobile: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasPermission: (permissionCode: string) => boolean;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  toggleUserStatus: (userId: string) => void;
  createInternalUser: (userData: CreateInternalUserPayload) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: INITIAL_USERS[0] || null, // Default to Customer / Guest initially
  users: INITIAL_USERS,
  isAuthModalOpen: false,
  authModalMode: 'LOGIN',
  authEmail: '',
  authMobile: '',
  pendingAction: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  openAuthModal: (mode = 'LOGIN', pendingAction) => set({
    isAuthModalOpen: true,
    authModalMode: mode,
    pendingAction: pendingAction || null
  }),

  closeAuthModal: () => set({
    isAuthModalOpen: false,
    authEmail: '',
    authMobile: '',
    pendingAction: null
  }),

  loginWithEmailOrPhone: async (identifier) => {
    const trimmed = identifier.trim().toLowerCase();
    const existing = get().users.find(u => 
      u.email.toLowerCase() === trimmed || 
      u.mobile.replace(/\D/g, '') === trimmed.replace(/\D/g, '')
    );

    if (existing) {
      set({ 
        authEmail: existing.email, 
        authMobile: existing.mobile,
        authModalMode: 'OTP' 
      });
      return { success: true, requiresOtp: true };
    }

    // If new user entering phone or email
    if (trimmed.includes('@')) {
      set({ authEmail: trimmed, authModalMode: 'OTP' });
    } else {
      set({ authMobile: trimmed, authModalMode: 'OTP' });
    }
    return { success: true, requiresOtp: true };
  },

  verifyOtp: async (code) => {
    if (code !== '123456' && code.length !== 6) {
      return { success: false, message: 'رمز التحقق غير صحيح. للتجربة أدخل 123456' };
    }

    const { authEmail, authMobile, users } = get();
    let user = users.find(u => 
      (authEmail && u.email.toLowerCase() === authEmail.toLowerCase()) ||
      (authMobile && u.mobile.replace(/\D/g, '') === authMobile.replace(/\D/g, ''))
    );

    if (!user) {
      // Auto-create customer
      user = {
        id: `USR-${Date.now()}`,
        name: authEmail ? authEmail.split('@')[0] : 'عميل جديد',
        email: authEmail || `user_${Date.now()}@rawabet.com`,
        mobile: authMobile || '01000000000',
        email_verified_at: new Date().toISOString(),
        account_status: 'ACTIVE',
        role: 'CUSTOMER',
        custom_permissions: ['PERM_VIEW_PUBLIC', 'PERM_FAVORITES', 'PERM_CONTACT_RAWABET'],
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set({ users: [...users, user] });
    }

    set({ 
      currentUser: user,
      isAuthModalOpen: false,
      authEmail: '',
      authMobile: ''
    });

    return { success: true };
  },

  registerCustomer: async (name, email, mobile) => {
    const { users } = get();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'البريد الإلكتروني مسجل بالفعل' };
    }

    const newUser: User = {
      id: `USR-${Date.now()}`,
      name,
      email,
      mobile,
      email_verified_at: new Date().toISOString(),
      account_status: 'ACTIVE',
      role: 'CUSTOMER',
      custom_permissions: ['PERM_VIEW_PUBLIC', 'PERM_FAVORITES', 'PERM_CONTACT_RAWABET'],
      last_login_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    set({ 
      users: [...users, newUser],
      currentUser: newUser,
      isAuthModalOpen: false 
    });

    return { success: true };
  },

  logout: () => set({ currentUser: null }),

  hasPermission: (permissionCode) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return !!currentUser.custom_permissions?.includes(permissionCode);
  },

  updateUserPermissions: (userId, permissions) => {
    set(state => ({
      users: state.users.map(u => u.id === userId ? { ...u, custom_permissions: permissions } : u),
      currentUser: state.currentUser?.id === userId ? { ...state.currentUser, custom_permissions: permissions } : state.currentUser
    }));
  },

  toggleUserStatus: (userId) => {
    set(state => ({
      users: state.users.map(u => {
        if (u.id === userId) {
          const nextStatus = u.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, account_status: nextStatus };
        }
        return u;
      })
    }));
  },

  createInternalUser: async (userData) => {
    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: userData.name || 'موظف جديد',
      email: userData.email || `employee_${Date.now()}@rawabet.com`,
      mobile: userData.mobile || '01000000000',
      account_status: 'ACTIVE',
      role: userData.role || 'PROPERTY_REVIEWER',
      custom_permissions: userData.custom_permissions || ['PERM_VIEW_PUBLIC'],
      email_verified_at: new Date().toISOString(),
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    set(state => ({ users: [...state.users, newUser] }));
    return newUser;
  }
}));
