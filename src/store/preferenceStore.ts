import { create } from 'zustand';

interface PreferenceState {
  favorites: string[]; // property IDs
  compareIds: string[]; // max 4 property IDs
  viewMode: 'grid' | 'list';

  // Actions
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  toggleCompare: (propertyId: string) => { success: boolean; message?: string };
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const FAVORITES_KEY = 'rawabet_favorites';
const COMPARE_KEY = 'rawabet_compare';

const getInitialFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getInitialCompare = (): string[] => {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const usePreferenceStore = create<PreferenceState>((set, get) => ({
  favorites: getInitialFavorites(),
  compareIds: getInitialCompare(),
  viewMode: 'grid',

  toggleFavorite: (propertyId) => {
    const { favorites } = get();
    const next = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
    set({ favorites: next });
  },

  isFavorite: (propertyId) => get().favorites.includes(propertyId),

  toggleCompare: (propertyId) => {
    const { compareIds } = get();
    if (compareIds.includes(propertyId)) {
      const next = compareIds.filter(id => id !== propertyId);
      try {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      } catch {}
      set({ compareIds: next });
      return { success: true };
    }

    if (compareIds.length >= 4) {
      return { success: false, message: 'يمكنك مقارنة 4 عقارات كحد أقصى في وقت واحد' };
    }

    const next = [...compareIds, propertyId];
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
    } catch {}
    set({ compareIds: next });
    return { success: true };
  },

  removeFromCompare: (propertyId) => {
    const next = get().compareIds.filter(id => id !== propertyId);
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
    } catch {}
    set({ compareIds: next });
  },

  clearCompare: () => {
    try {
      localStorage.removeItem(COMPARE_KEY);
    } catch {}
    set({ compareIds: [] });
  },

  isInCompare: (propertyId) => get().compareIds.includes(propertyId),

  setViewMode: (mode) => set({ viewMode: mode })
}));
