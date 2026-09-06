/**
 * Application Environment Configuration
 * Provides centralized environment variable access and production defaults.
 */

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  isProduction: boolean;
  appUrl: string;
  apiBaseUrl: string;
  appName: string;
  brandNameAr: string;
  supportPhone: string;
  supportEmail: string;
  defaultGovernorateId: string;
  defaultPageSize: number;
  enableAnalytics: boolean;
  security: {
    maskPrivateSellerData: boolean;
    sessionTimeoutMinutes: number;
  };
}

export const envConfig: AppConfig = {
  env: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'production',
  isProduction: import.meta.env.PROD || true,
  appUrl: import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://rawabet-eg.com'),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.rawabet-eg.com',
  appName: 'Rawabet Real Estate Brokerage',
  brandNameAr: 'روابط للوساطة العقارية',
  supportPhone: '01000920759',
  supportEmail: 'support@rawabet-eg.com',
  defaultGovernorateId: 'gov-kfs',
  defaultPageSize: 6,
  enableAnalytics: false,
  security: {
    maskPrivateSellerData: true,
    sessionTimeoutMinutes: 60,
  }
};
