import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { users, refreshTokens } from '../utils/database';
import {
  User,
  SafeUser,
  TokenPayload,
  RefreshTokenPayload,
  LoginDTO,
  AuthResponse,
  RefreshResponse,
  ErrorCodes,
} from '../types';
import { sanitizeUser } from '../utils/helpers';

class AuthService {
  /**
   * Génère un Access Token
   */
  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });
  }

  /**
   * Génère un Refresh Token
   */
  generateRefreshToken(user: User): string {
    const payload: RefreshTokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    });

    refreshTokens.add(token);
    return token;
  }

  /**
   * Connexion utilisateur
   */
  async login(dto: LoginDTO): Promise<AuthResponse> {
    const { email, password } = dto;

    // Validation
    if (!email || !password) {
      throw {
        status: 400,
        error: 'Email et mot de passe requis',
        code: ErrorCodes.MISSING_CREDENTIALS,
      };
    }

    // Recherche utilisateur
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw {
        status: 401,
        error: 'Identifiants incorrects',
        code: ErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Vérification mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw {
        status: 401,
        error: 'Identifiants incorrects',
        code: ErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Génération des tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      message: 'Connexion réussie',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessTokenExpirySeconds,
    };
  }

  /**
   * Rafraîchir le token
   */
  refresh(refreshToken: string): RefreshResponse {
    if (!refreshToken) {
      throw {
        status: 400,
        error: 'Refresh token requis',
        code: ErrorCodes.NO_REFRESH_TOKEN,
      };
    }

    if (!refreshTokens.has(refreshToken)) {
      throw {
        status: 403,
        error: 'Refresh token invalide ou révoqué',
        code: ErrorCodes.INVALID_REFRESH_TOKEN,
      };
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as RefreshTokenPayload;

      const user = users.find((u) => u.id === decoded.id);
      if (!user) {
        throw {
          status: 404,
          error: 'Utilisateur non trouvé',
          code: ErrorCodes.NOT_FOUND,
        };
      }

      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken,
        expiresIn: config.jwt.accessTokenExpirySeconds,
      };
    } catch (err) {
      refreshTokens.delete(refreshToken);
      throw {
        status: 403,
        error: 'Refresh token expiré',
        code: ErrorCodes.REFRESH_TOKEN_EXPIRED,
      };
    }
  }

  /**
   * Déconnexion
   */
  logout(refreshToken?: string): void {
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }
  }

  /**
   * Récupérer le profil
   */
  getProfile(userId: number): SafeUser {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw {
        status: 404,
        error: 'Utilisateur non trouvé',
        code: ErrorCodes.NOT_FOUND,
      };
    }
    return sanitizeUser(user);
  }

  /**
   * Mettre à jour le profil
   */
  updateProfile(
    userId: number,
    data: { name?: string; avatar?: string }
  ): SafeUser {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw {
        status: 404,
        error: 'Utilisateur non trouvé',
        code: ErrorCodes.NOT_FOUND,
      };
    }

    if (data.name) users[userIndex].name = data.name;
    if (data.avatar) users[userIndex].avatar = data.avatar;

    return sanitizeUser(users[userIndex]);
  }
}

export const authService = new AuthService();
