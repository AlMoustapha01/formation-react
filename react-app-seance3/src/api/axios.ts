import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';
import { ApiError, RefreshResponse } from '@/types';

/**
 * Instance Axios configurée pour l'API
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important pour les cookies
  withCredentials: true,
});

/**
 * Flag pour éviter les appels multiples au refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Traite la file d'attente des requêtes échouées
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Intercepteur de requête - Ajoute le token d'authentification
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse - Gère les erreurs et le refresh token
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si pas de config ou déjà retry, rejeter
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Gestion du token expiré
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      // Si déjà en cours de refresh, mettre en file d'attente
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Appel au endpoint de refresh
        const { data } = await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
          { refreshToken }
        );

        // Stocker le nouveau token
        tokenStorage.setAccessToken(data.accessToken);

        // Mettre à jour le header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        // Traiter les requêtes en attente
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué - déconnecter l'utilisateur
        processQueue(refreshError as Error, null);
        tokenStorage.clearAll();
        
        // Rediriger vers login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion du token invalide ou manquant
    if (
      error.response?.status === 401 &&
      (error.response?.data?.code === 'NO_TOKEN' ||
        error.response?.data?.code === 'INVALID_TOKEN')
    ) {
      tokenStorage.clearAll();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
