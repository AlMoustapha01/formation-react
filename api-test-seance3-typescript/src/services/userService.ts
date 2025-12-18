import bcrypt from 'bcryptjs';
import { users, counters } from '../utils/database';
import {
  User,
  SafeUser,
  CreateUserDTO,
  UsersResponse,
  ErrorCodes,
} from '../types';
import {
  sanitizeUser,
  calculatePagination,
  paginate,
  generateAvatarUrl,
} from '../utils/helpers';
import { config } from '../config';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

class UserService {
  /**
   * Liste des utilisateurs avec pagination et recherche
   */
  getUsers(params: GetUsersParams): UsersResponse {
    const page = params.page || config.pagination.defaultPage;
    const limit = Math.min(
      params.limit || config.pagination.defaultLimit,
      config.pagination.maxLimit
    );
    const search = params.search?.toLowerCase() || '';

    let filteredUsers = users.map(sanitizeUser);

    // Recherche
    if (search) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    // Pagination
    const paginatedUsers = paginate(filteredUsers, page, limit);

    return {
      users: paginatedUsers,
      pagination: calculatePagination(filteredUsers.length, page, limit),
    };
  }

  /**
   * Récupérer un utilisateur par ID
   */
  getUserById(id: number): SafeUser {
    const user = users.find((u) => u.id === id);
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
   * Créer un utilisateur
   */
  async createUser(dto: CreateUserDTO): Promise<SafeUser> {
    const { email, password, name, role = 'user' } = dto;

    // Validation
    if (!email || !password || !name) {
      throw {
        status: 400,
        error: 'Email, mot de passe et nom requis',
        code: ErrorCodes.MISSING_FIELDS,
      };
    }

    // Vérifier email unique
    if (users.find((u) => u.email === email)) {
      throw {
        status: 409,
        error: 'Cet email est déjà utilisé',
        code: ErrorCodes.EMAIL_EXISTS,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: counters.userId++,
      email,
      password: hashedPassword,
      name,
      role,
      avatar: generateAvatarUrl(name),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return sanitizeUser(newUser);
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(id: number, currentUserId: number): void {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw {
        status: 404,
        error: 'Utilisateur non trouvé',
        code: ErrorCodes.NOT_FOUND,
      };
    }

    // Empêcher suppression de soi-même
    if (users[userIndex].id === currentUserId) {
      throw {
        status: 400,
        error: 'Vous ne pouvez pas supprimer votre propre compte',
        code: ErrorCodes.CANNOT_DELETE_SELF,
      };
    }

    users.splice(userIndex, 1);
  }
}

export const userService = new UserService();
