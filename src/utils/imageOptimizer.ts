/**
 * Image Optimization Utilities for Rawabet Real Estate
 * Handles CDN query parameter formatting, responsive srcSets, and fallback resolution.
 */

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fit?: 'crop' | 'cover' | 'contain' | 'inside';
}

/**
 * Returns an optimized image URL by appending CDN-specific query parameters
 * where supported (such as Unsplash, Cloudinary, Imgix) while gracefully
 * preserving local, SVG, and blob URLs.
 */
export function getOptimizedImageUrl(
  src: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!src || typeof src !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Preserve local blob, data URLs, and SVGs directly
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.endsWith('.svg') ||
    trimmed.startsWith('/vite.svg')
  ) {
    return trimmed;
  }

  const {
    width = 800,
    quality = 80,
    format = 'auto',
    fit = 'crop'
  } = options;

  try {
    // Unsplash CDN Optimization
    if (trimmed.includes('unsplash.com')) {
      const url = new URL(trimmed);
      url.searchParams.set('auto', format === 'auto' ? 'format' : format);
      url.searchParams.set('fit', fit);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }

    // Cloudinary CDN Optimization
    if (trimmed.includes('cloudinary.com') && trimmed.includes('/upload/')) {
      const parts = trimmed.split('/upload/');
      const transform = `f_auto,q_${quality},w_${width},c_${fit === 'crop' ? 'fill' : 'scale'}`;
      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }

    // Standard URL without known CDN transformations
    return trimmed;
  } catch {
    return trimmed;
  }
}

/**
 * Generates responsive srcset string for standard widths.
 */
export function getResponsiveSrcSet(
  src: string | undefined | null,
  widths: number[] = [360, 640, 960, 1200]
): string {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
    return '';
  }

  return widths
    .map(w => `${getOptimizedImageUrl(src, { width: w })} ${w}w`)
    .join(', ');
}
