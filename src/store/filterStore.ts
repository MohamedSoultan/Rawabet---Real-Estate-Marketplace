import { create } from 'zustand';
import { FilterCriteria, PropertySortOption, PropertyFilterState } from '../types';

export interface FilterState {
  searchQuery: string;
  selectedGov: string;
  selectedCity: string;
  selectedArea: string;
  selectedType: string;
  selectedTx: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  bedrooms: string;
  bathrooms: string;
  features: string[];
  sortBy: PropertySortOption;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedGov: (gov: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedArea: (area: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedTx: (tx: string) => void;
  setMinPrice: (val: string) => void;
  setMaxPrice: (val: string) => void;
  setMinArea: (val: string) => void;
  setMaxArea: (val: string) => void;
  setBedrooms: (val: string) => void;
  setBathrooms: (val: string) => void;
  setFeatures: (features: string[]) => void;
  setSortBy: (sort: PropertySortOption) => void;
  resetFilters: () => void;
  setFilters: (filters: FilterCriteria) => void;
  setPropertyFilterState: (filterState: PropertyFilterState) => void;
  toPropertyFilterState: () => PropertyFilterState;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  searchQuery: '',
  selectedGov: '',
  selectedCity: '',
  selectedArea: '',
  selectedType: '',
  selectedTx: '',
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  bedrooms: '',
  bathrooms: '',
  features: [],
  sortBy: 'NEWEST',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedGov: (gov) => set({ selectedGov: gov, selectedCity: '', selectedArea: '' }),
  setSelectedCity: (city) => set({ selectedCity: city, selectedArea: '' }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedTx: (tx) => set({ selectedTx: tx }),
  setMinPrice: (val) => set({ minPrice: val }),
  setMaxPrice: (val) => set({ maxPrice: val }),
  setMinArea: (val) => set({ minArea: val }),
  setMaxArea: (val) => set({ maxArea: val }),
  setBedrooms: (val) => set({ bedrooms: val }),
  setBathrooms: (val) => set({ bathrooms: val }),
  setFeatures: (features) => set({ features }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  resetFilters: () => set({
    searchQuery: '',
    selectedGov: '',
    selectedCity: '',
    selectedArea: '',
    selectedType: '',
    selectedTx: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    features: [],
    sortBy: 'NEWEST'
  }),

  setPropertyFilterState: (state) => set({
    searchQuery: state.searchQuery || '',
    selectedGov: state.location?.governorate_id || '',
    selectedCity: state.location?.city_id || '',
    selectedArea: state.location?.area_id || '',
    selectedType: state.propertyType || '',
    selectedTx: state.transactionType || '',
    minPrice: state.minPrice !== undefined ? String(state.minPrice) : '',
    maxPrice: state.maxPrice !== undefined ? String(state.maxPrice) : '',
    minArea: state.minArea !== undefined ? String(state.minArea) : '',
    maxArea: state.maxArea !== undefined ? String(state.maxArea) : '',
    bedrooms: state.rooms !== undefined ? String(state.rooms) : '',
    bathrooms: state.bathrooms !== undefined ? String(state.bathrooms) : '',
    features: state.features || [],
    sortBy: state.sortBy || 'NEWEST',
  }),

  toPropertyFilterState: () => {
    const s = get();
    return {
      transactionType: s.selectedTx || undefined,
      propertyType: s.selectedType || undefined,
      location: (s.selectedGov || s.selectedCity || s.selectedArea) ? {
        governorate_id: s.selectedGov || undefined,
        city_id: s.selectedCity || undefined,
        area_id: s.selectedArea || undefined,
      } : undefined,
      minPrice: s.minPrice ? Number(s.minPrice) : undefined,
      maxPrice: s.maxPrice ? Number(s.maxPrice) : undefined,
      rooms: s.bedrooms ? Number(s.bedrooms) : undefined,
      bathrooms: s.bathrooms ? Number(s.bathrooms) : undefined,
      minArea: s.minArea ? Number(s.minArea) : undefined,
      maxArea: s.maxArea ? Number(s.maxArea) : undefined,
      features: s.features,
      searchQuery: s.searchQuery || undefined,
      sortBy: s.sortBy,
    };
  },

  setFilters: (filters) => set(state => ({
    ...state,
    ...(filters.searchQuery !== undefined ? { searchQuery: filters.searchQuery } : {}),
    ...(filters.search_query !== undefined ? { searchQuery: filters.search_query } : {}),
    ...(filters.selectedGov !== undefined ? { selectedGov: filters.selectedGov } : {}),
    ...(filters.governorate_id !== undefined ? { selectedGov: filters.governorate_id } : {}),
    ...(filters.selectedCity !== undefined ? { selectedCity: filters.selectedCity } : {}),
    ...(filters.city_id !== undefined ? { selectedCity: filters.city_id } : {}),
    ...(filters.selectedArea !== undefined ? { selectedArea: filters.selectedArea } : {}),
    ...(filters.area_id !== undefined ? { selectedArea: filters.area_id } : {}),
    ...(filters.selectedType !== undefined ? { selectedType: filters.selectedType } : {}),
    ...(filters.property_type_id !== undefined ? { selectedType: filters.property_type_id } : {}),
    ...(filters.selectedTx !== undefined ? { selectedTx: filters.selectedTx } : {}),
    ...(filters.transaction_type_id !== undefined ? { selectedTx: filters.transaction_type_id } : {}),
    ...(filters.minPrice !== undefined ? { minPrice: String(filters.minPrice) } : {}),
    ...(filters.maxPrice !== undefined ? { maxPrice: String(filters.maxPrice) } : {}),
    ...(filters.minArea !== undefined ? { minArea: String(filters.minArea) } : {}),
    ...(filters.maxArea !== undefined ? { maxArea: String(filters.maxArea) } : {}),
    ...(filters.bedrooms !== undefined ? { bedrooms: String(filters.bedrooms) } : {}),
    ...(filters.bathrooms !== undefined ? { bathrooms: String(filters.bathrooms) } : {}),
    ...(filters.features !== undefined ? { features: filters.features } : {}),
    ...(filters.sortBy !== undefined ? { sortBy: filters.sortBy } : {})
  }))
}));
