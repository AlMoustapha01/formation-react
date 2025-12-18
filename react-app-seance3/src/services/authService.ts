import api from '@/api/axios';
import { tokenStorage } from '@/utils/tokenStorage';
import {
  AuthResponse,
  LoginCredentials,
  User,
} from '@/types';

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Stocker les tokens dans les cookies sécurisés
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    tokenStorage.setUser(data.user);
    
    return data;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignorer les erreurs de logout
      console.error('Logout error:', error);
    } finally {
      // Toujours nettoyer les cookies
      tokenStorage.clearAll();
    }
  },

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    // Mettre à jour le cache utilisateur
    tokenStorage.setUser(data);
    return data;
  },

  /**
   * Mettre à jour le profil
   */
  async updateProfile(updates: { name?: string; avatar?: string }): Promise<User> {
    const { data } = await api.put<{ message: string; user: User }>(
      '/auth/me',
      updates
    );
    // Mettre à jour le cache utilisateur
    tokenStorage.setUser(data.user);
    return data.user;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return tokenStorage.hasTokens();
  },

  /**
   * Récupérer l'utilisateur depuis le cache
   */
  getCachedUser(): User | null {
    return tokenStorage.getUser<User>();
  },
};

export default authService;
