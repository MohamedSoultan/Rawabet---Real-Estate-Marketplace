import { create } from 'zustand';
import { Property } from '../types';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface UIState {
  toasts: ToastNotification[];
  previewProperty: Property | null;
  isWizardOpen: boolean;
  isRequestPropertyOpen: boolean;
  isRequestViewingOpen: boolean;
  viewingProperty: Property | null;
  legalModalType: 'PRIVACY' | 'TERMS' | 'ABOUT' | null;
  isMobileFilterDrawerOpen: boolean;
  isMobileMenuOpen: boolean;

  // Actions
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  setPreviewProperty: (property: Property | null) => void;
  setIsWizardOpen: (open: boolean) => void;
  setIsRequestPropertyOpen: (open: boolean) => void;
  openRequestViewing: (property: Property) => void;
  closeRequestViewing: () => void;
  setLegalModalType: (type: 'PRIVACY' | 'TERMS' | 'ABOUT' | null) => void;
  setIsMobileFilterDrawerOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  previewProperty: null,
  isWizardOpen: false,
  isRequestPropertyOpen: false,
  isRequestViewingOpen: false,
  viewingProperty: null,
  legalModalType: null,
  isMobileFilterDrawerOpen: false,
  isMobileMenuOpen: false,

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, type, message };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  setPreviewProperty: (property) => set({ previewProperty: property }),
  setIsWizardOpen: (open) => set({ isWizardOpen: open }),
  setIsRequestPropertyOpen: (open) => set({ isRequestPropertyOpen: open }),
  
  openRequestViewing: (property) => set({
    isRequestViewingOpen: true,
    viewingProperty: property
  }),
  
  closeRequestViewing: () => set({
    isRequestViewingOpen: false,
    viewingProperty: null
  }),

  setLegalModalType: (type) => set({ legalModalType: type }),
  setIsMobileFilterDrawerOpen: (open) => set({ isMobileFilterDrawerOpen: open }),
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open })
}));
