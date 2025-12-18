import Cookies from 'js-cookie';

/**
 * Configuration des cookies sécurisés
 * 
 * Note: Pour une sécurité maximale en production, les tokens devraient être
 * stockés dans des cookies HttpOnly côté serveur. Cette implémentation
 * utilise js-cookie avec les meilleures pratiques possibles côté client.
 */

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  // Expire dans 7 jours (pour refresh token)
  expires: 7,
  // Cookie accessible uniquement via HTTPS en production
  secure: import.meta.env.PROD,
  // Protège contre les attaques CSRF
  sameSite: 'strict',
  // Chemin du cookie
  path: '/',
};

const ACCESS_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  ...COOKIE_OPTIONS,
  // Access token expire plus vite (stocké en session si pas d'expires)
  expires: 1 / 96, // 15 minutes (1/96 de jour)
};

const COOKIE_KEYS = {
  ACCESS_TOKEN: 'cnss_access_token',
  REFRESH_TOKEN: 'cnss_refresh_token',
  USER: 'cnss_user',
} as const;

/**
 * Service de gestion des tokens via cookies sécurisés
 */
export const tokenStorage = {
  /**
   * Stocke l'access token
   */
  setAccessToken(token: string): void {
    Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, ACCESS_TOKEN_OPTIONS);
  },

  /**
   * Récupère l'access token
   */
  getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Stocke le refresh token
   */
  setRefreshToken(token: string): void {
    Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, token, COOKIE_OPTIONS);
  },

  /**
   * Récupère le refresh token
   */
  getRefreshToken(): string | undefined {
    return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Stocke les informations utilisateur
   */
  setUser(user: object): void {
    Cookies.set(COOKIE_KEYS.USER, JSON.stringify(user), COOKIE_OPTIONS);
  },

  /**
   * Récupère les informations utilisateur
   */
  getUser<T>(): T | null {
    const userStr = Cookies.get(COOKIE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as T;
    } catch {
      return null;
    }
  },

  /**
   * Stocke tous les tokens après login
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  /**
   * Supprime tous les tokens (logout)
   */
  clearAll(): void {
    Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN, { path: '/' });
    Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN, { path: '/' });
    Cookies.remove(COOKIE_KEYS.USER, { path: '/' });
  },

  /**
   * Vérifie si l'utilisateur a des tokens
   */
  hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  },
};

export default tokenStorage;
