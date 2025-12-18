import { Request } from 'express';

// =============================================================================
// USER TYPES
// =============================================================================

export type UserRole = 'admin' | 'user' | 'developer';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export type SafeUser = Omit<User, 'password'>;

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  avatar?: string;
}

// =============================================================================
// TASK TYPES
// =============================================================================

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: string;
}

export interface CreateTaskDTO {
  title: string;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  priority?: TaskPriority;
}

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: number;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface ApiError {
  error: string;
  code: string;
  path?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export interface UsersResponse {
  users: SafeUser[];
  pagination: PaginationMeta;
}

// =============================================================================
// EXPRESS EXTENSIONS
// =============================================================================

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// =============================================================================
// ERROR CODES
// =============================================================================

export const ErrorCodes = {
  // Auth
  MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NO_TOKEN: 'NO_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NO_REFRESH_TOKEN: 'NO_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  MISSING_FIELDS: 'MISSING_FIELDS',
  MISSING_TITLE: 'MISSING_TITLE',
  CANNOT_DELETE_SELF: 'CANNOT_DELETE_SELF',
  
  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SIMULATED_ERROR: 'SIMULATED_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
