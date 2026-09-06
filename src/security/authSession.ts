/**
 * Authentication Session & JWT / Sanctum Compatibility Layer
 * Handles bearer token validation, expiration checking, and session headers.
 */

const TOKEN_KEY = 'rawabet_auth_token';
const EXPIRY_KEY = 'rawabet_token_expiry';

export interface AuthSessionData {
  token: string;
  expiresAt: number | null;
  isValid: boolean;
}

export const authSession = {
  /**
   * Set authentication token and optional expiration time (in seconds or timestamp)
   */
  setToken(token: string, expiresInSeconds?: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (expiresInSeconds) {
        const expiresAt = Date.now() + expiresInSeconds * 1000;
        localStorage.setItem(EXPIRY_KEY, String(expiresAt));
      } else {
        localStorage.removeItem(EXPIRY_KEY);
      }
    } catch {
      // Storage unavailable or disabled
    }
  },

  /**
   * Retrieve active bearer token if not expired
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      // Check expiry if set
      const expiry = localStorage.getItem(EXPIRY_KEY);
      if (expiry) {
        const expiresAt = Number(expiry);
        if (!isNaN(expiresAt) && Date.now() > expiresAt) {
          this.clearToken();
          return null;
        }
      }

      return token;
    } catch {
      return null;
    }
  },

  /**
   * Clear session token
   */
  clearToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    } catch {
      // Storage unavailable
    }
  },

  /**
   * Inspect current session validity
   */
  getSession(): AuthSessionData {
    const token = this.getToken();
    let expiresAt: number | null = null;
    
    if (typeof window !== 'undefined') {
      const expiry = localStorage.getItem(EXPIRY_KEY);
      if (expiry) {
        expiresAt = Number(expiry);
      }
    }

    return {
      token: token || '',
      expiresAt,
      isValid: !!token,
    };
  },

  /**
   * Standard authorization headers for outgoing HTTP calls
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};

    return {
      'Authorization': `Bearer ${token}`,
      'X-Requested-With': 'XMLHttpRequest',
    };
  }
};
