import { User, SafeUser, PaginationMeta } from '../types';

/**
 * Retire le mot de passe d'un utilisateur
 */
export function sanitizeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Calcule les métadonnées de pagination
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Applique la pagination à un tableau
 */
export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return items.slice(startIndex, endIndex);
}

/**
 * Génère un délai aléatoire
 */
export function randomDelay(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Génère une URL d'avatar
 */
export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
