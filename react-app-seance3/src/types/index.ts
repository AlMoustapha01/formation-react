// =============================================================================
// USER TYPES
// =============================================================================

export type UserRole = 'admin' | 'user' | 'developer';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
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
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  users: User[];
  pagination: PaginationMeta;
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}
