import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authService } from '@/services/authService';
import { User, LoginCredentials, AuthContextType } from '@/types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Vérifie l'authentification au chargement
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier si des tokens existent
        if (authService.isAuthenticated()) {
          // Essayer de récupérer le profil
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (error) {
        // Token invalide ou expiré, utiliser le cache
        const cachedUser = authService.getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success(`Bienvenue, ${response.user.name} !`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mettre à jour l'utilisateur
   */
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
