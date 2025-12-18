import { LoginCredentials, User } from '../types';

// Utilisateurs mockés
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    email: 'admin@cnss.bj',
    password: 'password123',
    name: 'Admin CNSS',
    avatar: 'https://ui-avatars.com/api/?name=Admin+CNSS&background=3b82f6&color=fff',
  },
  {
    id: 2,
    email: 'user@cnss.bj',
    password: 'password123',
    name: 'Utilisateur Test',
    avatar: 'https://ui-avatars.com/api/?name=User+Test&background=10b981&color=fff',
  },
];

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(1000);

    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const { password, ...userWithoutPassword } = user;
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Récupérer l'utilisateur courant
   */
  async getCurrentUser(): Promise<User | null> {
    await delay(500);
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Vérifier si le token est valide
   */
  async verifyToken(token: string): Promise<boolean> {
    await delay(200);
    return token.startsWith('mock-jwt-token-');
  },
};

export default authService;
