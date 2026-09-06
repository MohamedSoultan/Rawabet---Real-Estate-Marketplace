import { create } from 'zustand';
import { 
  Property, 
  PropertyVersion, 
  PropertyDraftPayload,
  Governorate, 
  City, 
  Area, 
  PropertyType, 
  TransactionType,
  PropertyStatus,
  ReviewDecision,
  VersionStatus
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_GOVERNORATES, 
  INITIAL_CITIES, 
  INITIAL_AREAS, 
  INITIAL_PROPERTY_TYPES, 
  INITIAL_TRANSACTION_TYPES 
} from '../data/initialData';

interface PropertyState {
  properties: Property[];
  governorates: Governorate[];
  cities: City[];
  areas: Area[];
  propertyTypes: PropertyType[];
  transactionTypes: TransactionType[];
  isLoading: boolean;
  error: string | null;

  // Selectors
  getPublishedProperties: () => Property[];
  getPropertyByIdOrRef: (idOrRef: string) => Property | undefined;
  getSellerProperties: (sellerId: string) => Property[];
  getPendingReviews: () => Property[];

  // Actions
  addProperty: (property: Property) => void;
  updatePropertyVersion: (propertyId: string, versionData: PropertyDraftPayload) => void;
  submitForReview: (propertyId: string) => void;
  reviewProperty: (propertyId: string, versionId: string, decision: ReviewDecision, reason?: string) => void;
  changePropertyStatus: (propertyId: string, status: PropertyStatus) => void;
  deleteProperty: (propertyId: string) => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: INITIAL_PROPERTIES,
  governorates: INITIAL_GOVERNORATES,
  cities: INITIAL_CITIES,
  areas: INITIAL_AREAS,
  propertyTypes: INITIAL_PROPERTY_TYPES,
  transactionTypes: INITIAL_TRANSACTION_TYPES,
  isLoading: false,
  error: null,

  getPublishedProperties: () => {
    return get().properties.filter(p => p.current_status === 'PUBLISHED');
  },

  getPropertyByIdOrRef: (idOrRef) => {
    const query = idOrRef.trim().toLowerCase();
    return get().properties.find(p => 
      p.id.toLowerCase() === query || 
      p.reference_number.toLowerCase() === query
    );
  },

  getSellerProperties: (sellerId) => {
    return get().properties.filter(p => p.seller_id === sellerId);
  },

  getPendingReviews: () => {
    return get().properties.filter(p => 
      p.current_status === 'PENDING_REVIEW' || 
      p.current_status === 'UNDER_REVIEW' || 
      p.current_status === 'PENDING_REVISION'
    );
  },

  addProperty: (property) => {
    set(state => ({ properties: [property, ...state.properties] }));
  },

  updatePropertyVersion: (propertyId, versionData) => {
    set(state => ({
      properties: state.properties.map(p => {
        if (p.id !== propertyId) return p;
        const currentVersion = p.versions[0];
        const updatedVersion: PropertyVersion = {
          ...currentVersion,
          ...versionData,
          version_number: (currentVersion?.version_number || 1) + 1,
          id: `VER-${Date.now()}`,
          version_status: 'PENDING',
          submitted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          media: versionData.media || currentVersion?.media || []
        };
        return {
          ...p,
          current_status: p.current_status === 'PUBLISHED' ? 'PENDING_REVISION' : 'PENDING_REVIEW',
          versions: [updatedVersion, ...p.versions],
          updated_at: new Date().toISOString()
        };
      })
    }));
  },

  submitForReview: (propertyId) => {
    set(state => ({
      properties: state.properties.map(p => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          current_status: 'PENDING_REVIEW',
          updated_at: new Date().toISOString()
        };
      })
    }));
  },

  reviewProperty: (propertyId, versionId, decision, reason) => {
    set(state => ({
      properties: state.properties.map(p => {
        if (p.id !== propertyId) return p;

        const updatedVersions = p.versions.map(v => {
          if (v.id === versionId) {
            const verStatus: VersionStatus = decision === 'APPROVED' ? 'APPROVED' : decision === 'REJECTED' ? 'REJECTED' : 'NEEDS_MODIFICATION';
            return {
              ...v,
              version_status: verStatus,
              review_decision: decision,
              rejection_reason: reason || v.rejection_reason,
              reviewed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          return v;
        });

        const newStatus: PropertyStatus = decision === 'APPROVED' ? 'PUBLISHED' : decision === 'REJECTED' ? 'REJECTED' : 'NEEDS_MODIFICATION';

        return {
          ...p,
          current_status: newStatus,
          current_published_version_id: decision === 'APPROVED' ? versionId : p.current_published_version_id,
          versions: updatedVersions,
          updated_at: new Date().toISOString()
        };
      })
    }));
  },

  changePropertyStatus: (propertyId, status) => {
    set(state => ({
      properties: state.properties.map(p => 
        p.id === propertyId ? { ...p, current_status: status, updated_at: new Date().toISOString() } : p
      )
    }));
  },

  deleteProperty: (propertyId) => {
    set(state => ({
      properties: state.properties.filter(p => p.id !== propertyId)
    }));
  }
}));
