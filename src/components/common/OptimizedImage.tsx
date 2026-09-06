import React, { useState, memo } from 'react';
import { getOptimizedImageUrl, getResponsiveSrcSet, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageOptimizer';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  targetWidth?: number;
  quality?: number;
  responsiveWidths?: number[];
  className?: string;
  wrapperClassName?: string;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  targetWidth = 800,
  quality = 80,
  responsiveWidths = [360, 640, 960],
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = hasError
    ? fallbackSrc
    : getOptimizedImageUrl(src, { width: targetWidth, quality });

  const srcSet = !hasError && responsiveWidths && responsiveWidths.length > 0
    ? getResponsiveSrcSet(src, responsiveWidths)
    : undefined;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${wrapperClassName}`}>
      {/* Background Skeleton Placeholder (avoids CLS and provides visual feedback) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse" />
      )}

      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading={loading}
        decoding={decoding}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
