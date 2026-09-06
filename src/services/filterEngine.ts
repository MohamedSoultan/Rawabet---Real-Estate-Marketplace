import { Property, PropertyFilterState, PropertySortOption, FilterCriteria } from '../types';

/**
 * Creates a clean default PropertyFilterState
 */
export function createDefaultFilterState(): PropertyFilterState {
  return {
    transactionType: undefined,
    propertyType: undefined,
    location: {
      governorate_id: 'gov-kfs',
      city_id: undefined,
      area_id: undefined,
    },
    minPrice: undefined,
    maxPrice: undefined,
    rooms: undefined,
    bathrooms: undefined,
    minArea: undefined,
    maxArea: undefined,
    features: [],
    searchQuery: undefined,
    sortBy: 'NEWEST',
  };
}

/**
 * Converts legacy or partial FilterCriteria into centralized PropertyFilterState
 */
export function fromFilterCriteria(criteria: FilterCriteria): PropertyFilterState {
  return {
    transactionType: criteria.selectedTx || criteria.transaction_type_id || undefined,
    propertyType: criteria.selectedType || criteria.property_type_id || undefined,
    location: {
      governorate_id: criteria.selectedGov || criteria.governorate_id || undefined,
      city_id: criteria.selectedCity || criteria.city_id || undefined,
      area_id: criteria.selectedArea || criteria.area_id || undefined,
    },
    minPrice: criteria.minPrice ? Number(criteria.minPrice) : criteria.min_price || undefined,
    maxPrice: criteria.maxPrice ? Number(criteria.maxPrice) : criteria.max_price || undefined,
    rooms: criteria.bedrooms ? Number(criteria.bedrooms) : criteria.rooms || undefined,
    bathrooms: criteria.bathrooms ? Number(criteria.bathrooms) : undefined,
    minArea: criteria.minArea ? Number(criteria.minArea) : undefined,
    maxArea: criteria.maxArea ? Number(criteria.maxArea) : undefined,
    features: criteria.features || [],
    searchQuery: criteria.searchQuery || criteria.search_query || undefined,
    sortBy: criteria.sortBy || 'NEWEST',
  };
}

/**
 * Converts centralized PropertyFilterState back to FilterCriteria for view compatibility
 */
export function toFilterCriteria(filter: PropertyFilterState): FilterCriteria {
  return {
    selectedTx: filter.transactionType,
    transaction_type_id: filter.transactionType,
    selectedType: filter.propertyType,
    property_type_id: filter.propertyType,
    selectedGov: filter.location?.governorate_id,
    governorate_id: filter.location?.governorate_id,
    selectedCity: filter.location?.city_id,
    city_id: filter.location?.city_id,
    selectedArea: filter.location?.area_id,
    area_id: filter.location?.area_id,
    minPrice: filter.minPrice !== undefined ? String(filter.minPrice) : undefined,
    maxPrice: filter.maxPrice !== undefined ? String(filter.maxPrice) : undefined,
    min_price: filter.minPrice,
    max_price: filter.maxPrice,
    bedrooms: filter.rooms !== undefined ? String(filter.rooms) : undefined,
    rooms: filter.rooms,
    bathrooms: filter.bathrooms !== undefined ? String(filter.bathrooms) : undefined,
    minArea: filter.minArea !== undefined ? String(filter.minArea) : undefined,
    maxArea: filter.maxArea !== undefined ? String(filter.maxArea) : undefined,
    features: filter.features,
    searchQuery: filter.searchQuery,
    search_query: filter.searchQuery,
    sortBy: filter.sortBy,
  };
}

/**
 * Converts URLSearchParams to PropertyFilterState
 */
export function fromUrlParams(params: URLSearchParams): PropertyFilterState {
  const gov = params.get('governorate_id') || params.get('gov') || undefined;
  const city = params.get('city_id') || params.get('city') || undefined;
  const area = params.get('area_id') || params.get('area') || undefined;

  return {
    transactionType: params.get('transaction_type_id') || params.get('tx') || undefined,
    propertyType: params.get('property_type_id') || params.get('type') || undefined,
    location: (gov || city || area) ? { governorate_id: gov, city_id: city, area_id: area } : undefined,
    minPrice: params.get('min_price') ? Number(params.get('min_price')) : undefined,
    maxPrice: params.get('max_price') ? Number(params.get('max_price')) : undefined,
    rooms: params.get('rooms') ? Number(params.get('rooms')) : params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
    bathrooms: params.get('bathrooms') ? Number(params.get('bathrooms')) : undefined,
    minArea: params.get('min_area') ? Number(params.get('min_area')) : undefined,
    maxArea: params.get('max_area') ? Number(params.get('max_area')) : undefined,
    features: params.get('features') ? params.get('features')!.split(',').filter(Boolean) : [],
    searchQuery: params.get('q') || params.get('searchQuery') || undefined,
    sortBy: (params.get('sortBy') as PropertySortOption) || 'NEWEST',
  };
}

/**
 * Converts PropertyFilterState to URLSearchParams
 */
export function toUrlParams(filter: PropertyFilterState): URLSearchParams {
  const next = new URLSearchParams();
  if (filter.transactionType) next.set('transaction_type_id', filter.transactionType);
  if (filter.propertyType) next.set('property_type_id', filter.propertyType);
  if (filter.location?.governorate_id) next.set('governorate_id', filter.location.governorate_id);
  if (filter.location?.city_id) next.set('city_id', filter.location.city_id);
  if (filter.location?.area_id) next.set('area_id', filter.location.area_id);
  if (filter.minPrice !== undefined && filter.minPrice > 0) next.set('min_price', String(filter.minPrice));
  if (filter.maxPrice !== undefined && filter.maxPrice > 0) next.set('max_price', String(filter.maxPrice));
  if (filter.rooms !== undefined && filter.rooms > 0) next.set('rooms', String(filter.rooms));
  if (filter.bathrooms !== undefined && filter.bathrooms > 0) next.set('bathrooms', String(filter.bathrooms));
  if (filter.minArea !== undefined && filter.minArea > 0) next.set('min_area', String(filter.minArea));
  if (filter.maxArea !== undefined && filter.maxArea > 0) next.set('max_area', String(filter.maxArea));
  if (filter.features && filter.features.length > 0) next.set('features', filter.features.join(','));
  if (filter.searchQuery && filter.searchQuery.trim()) next.set('q', filter.searchQuery.trim());
  if (filter.sortBy && filter.sortBy !== 'NEWEST') next.set('sortBy', filter.sortBy);
  return next;
}

/**
 * Core Filter Engine: Filter properties based on PropertyFilterState.
 * ALL parts of the application (Listing page, Search, Start Journey, Recommendations) use this!
 */
export function filterProperties(properties: Property[], filter: PropertyFilterState): Property[] {
  return properties.filter(p => {
    const activeVerId = p.current_published_version_id || p.versions[0]?.id;
    const ver = p.versions.find(v => v.id === activeVerId) || p.versions[0];

    if (!ver) return false;

    // 1. Transaction Type
    if (filter.transactionType) {
      const pTx = p.transaction_type_id?.toLowerCase() || '';
      const filterTx = filter.transactionType.toLowerCase();
      // Handle BUY vs tx-sale and RENT vs tx-rent mappings
      const isMatch =
        pTx === filterTx ||
        (filterTx === 'buy' && (pTx === 'tx-sale' || pTx === 'sale')) ||
        (filterTx === 'rent' && (pTx === 'tx-rent' || pTx === 'rent')) ||
        (filterTx === 'tx-sale' && pTx === 'buy') ||
        (filterTx === 'tx-rent' && pTx === 'rent');
      if (!isMatch) return false;
    }

    // 2. Property Type
    if (filter.propertyType) {
      if (p.property_type_id !== filter.propertyType) return false;
    }

    // 3. Location (Governorate, City, Area)
    if (filter.location) {
      if (filter.location.governorate_id && ver.governorate_id !== filter.location.governorate_id) {
        return false;
      }
      if (filter.location.city_id && ver.city_id !== filter.location.city_id) {
        return false;
      }
      if (filter.location.area_id && ver.area_id !== filter.location.area_id) {
        return false;
      }
    }

    // 4. Price (min and max)
    if (filter.minPrice !== undefined && ver.price < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice !== undefined && ver.price > filter.maxPrice) {
      return false;
    }

    // 5. Rooms (Bedrooms)
    if (filter.rooms !== undefined) {
      if (!ver.bedrooms || ver.bedrooms < filter.rooms) {
        return false;
      }
    }

    // 6. Bathrooms
    if (filter.bathrooms !== undefined) {
      if (!ver.bathrooms || ver.bathrooms < filter.bathrooms) {
        return false;
      }
    }

    // 7. Area sqm (min and max)
    if (filter.minArea !== undefined && ver.area_sqm < filter.minArea) {
      return false;
    }
    if (filter.maxArea !== undefined && ver.area_sqm > filter.maxArea) {
      return false;
    }

    // 8. Features & Customer Preferences (flexible keyword matching)
    if (filter.features && filter.features.length > 0) {
      const propFeatures = (ver.features || []).map(f => f.toLowerCase());
      const titleLower = (ver.title || '').toLowerCase();
      const descLower = (ver.description || '').toLowerCase();
      const finishingLower = (ver.finishing || '').toLowerCase();

      // Check if property matches the selected features/preferences
      const matchesAtLeastOne = filter.features.some(f => {
        const featLower = f.toLowerCase();
        // Exact feature match
        if (propFeatures.some(pf => pf.includes(featLower) || featLower.includes(pf))) return true;
        // Search in title, description, finishing
        if (titleLower.includes(featLower) || descLower.includes(featLower) || finishingLower.includes(featLower)) return true;
        
        // Smart preference keywords mapping
        if (featLower.includes('خدمات') && (descLower.includes('خدمات') || descLower.includes('موقع حيوي') || descLower.includes('موقع مميز'))) return true;
        if (featLower.includes('عائل') && ((ver.bedrooms || 0) >= 2 || descLower.includes('عائل'))) return true;
        if (featLower.includes('مساحة') && ver.area_sqm >= 130) return true;
        if (featLower.includes('فاخر') || featLower.includes('لوكس')) return finishingLower.includes('لوكس') || descLower.includes('فاخر');
        if (featLower.includes('خصوصية') && (descLower.includes('خاص') || descLower.includes('مستقل') || descLower.includes('فيلا'))) return true;
        if (featLower.includes('حديقة') && (descLower.includes('حديقة') || propFeatures.some(pf => pf.includes('حديقة')))) return true;
        if (featLower.includes('رئيسي') && (descLower.includes('رئيسي') || titleLower.includes('رئيسي'))) return true;
        if (featLower.includes('استثمار') && (descLower.includes('استثمار') || descLower.includes('عائد') || p.property_type_id?.includes('shop') || p.property_type_id?.includes('land'))) return true;
        if (featLower.includes('بناء') && (descLower.includes('بناء') || descLower.includes('رخصة') || descLower.includes('ترخيص'))) return true;

        return false;
      });

      if (!matchesAtLeastOne) return false;
    }

    // 9. Search Query
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      const title = ver.title?.toLowerCase() || '';
      const desc = ver.description?.toLowerCase() || '';
      const ref = p.reference_number?.toLowerCase() || '';
      const loc = ver.public_location_text?.toLowerCase() || '';
      if (!title.includes(q) && !desc.includes(q) && !ref.includes(q) && !loc.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort properties based on PropertySortOption
 */
export function sortProperties(properties: Property[], sortBy?: PropertySortOption): Property[] {
  const list = [...properties];
  const sort = sortBy || 'NEWEST';

  list.sort((a, b) => {
    const verA = a.versions.find(v => v.id === a.current_published_version_id) || a.versions[0];
    const verB = b.versions.find(v => v.id === b.current_published_version_id) || b.versions[0];

    if (sort === 'PRICE_ASC') {
      return (verA?.price || 0) - (verB?.price || 0);
    }
    if (sort === 'PRICE_DESC') {
      return (verB?.price || 0) - (verA?.price || 0);
    }
    // Default NEWEST
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return list;
}

/**
 * Score property matching for Recommendations based on PropertyFilterState.
 * Returns a score between 0 and 100.
 */
export function scorePropertyMatch(property: Property, filter: PropertyFilterState): number {
  const activeVerId = property.current_published_version_id || property.versions[0]?.id;
  const ver = property.versions.find(v => v.id === activeVerId) || property.versions[0];
  if (!ver) return 0;

  let score = 0;
  let maxPossible = 0;

  // Transaction type match (weight 30)
  if (filter.transactionType) {
    maxPossible += 30;
    const pTx = property.transaction_type_id?.toLowerCase() || '';
    const fTx = filter.transactionType.toLowerCase();
    if (pTx === fTx || (fTx === 'buy' && pTx.includes('sale')) || (fTx === 'rent' && pTx.includes('rent'))) {
      score += 30;
    }
  }

  // Property type match (weight 25)
  if (filter.propertyType) {
    maxPossible += 25;
    if (property.property_type_id === filter.propertyType) {
      score += 25;
    }
  }

  // Location match (weight 25)
  if (filter.location) {
    if (filter.location.city_id) {
      maxPossible += 15;
      if (ver.city_id === filter.location.city_id) score += 15;
    }
    if (filter.location.area_id) {
      maxPossible += 10;
      if (ver.area_id === filter.location.area_id) score += 10;
    }
  }

  // Price match (weight 20)
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    maxPossible += 20;
    const price = ver.price;
    const min = filter.minPrice ?? 0;
    const max = filter.maxPrice ?? Infinity;
    if (price >= min && price <= max) {
      score += 20;
    } else {
      // Proximity score
      const midpoint = max === Infinity ? min : (min + max) / 2;
      const deviation = Math.abs(price - midpoint) / midpoint;
      if (deviation < 0.2) score += 10;
    }
  }

  // Rooms match (weight 10)
  if (filter.rooms !== undefined) {
    maxPossible += 10;
    if (ver.bedrooms && ver.bedrooms >= filter.rooms) {
      score += 10;
    }
  }

  return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 50;
}

/**
 * Recommendations Engine:
 * Returns ranked property recommendations for a given user journey or filter state
 */
export function getRecommendedProperties(
  properties: Property[],
  filter: PropertyFilterState,
  limit: number = 4
): Array<{ property: Property; matchScore: number }> {
  const scored = properties
    .map(property => ({
      property,
      matchScore: scorePropertyMatch(property, filter),
    }))
    .filter(item => item.matchScore > 20) // Only relevant matches
    .sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, limit);
}
