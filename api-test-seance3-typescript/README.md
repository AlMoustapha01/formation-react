# 🚀 API REST TypeScript - Formation React.js CNSS Bénin

API Node.js/Express/TypeScript pour les ateliers pratiques de la **Séance 3 : Intégration API et Authentification JWT**.

## 📁 Structure du Projet

```
api-test-seance3/
├── src/
│   ├── middleware/
│   │   └── auth.ts          # Middleware JWT
│   ├── routes/
│   │   ├── auth.ts          # Routes authentification
│   │   ├── users.ts         # Routes utilisateurs
│   │   └── tasks.ts         # Routes tâches
│   ├── services/
│   │   ├── authService.ts   # Logique authentification
│   │   ├── userService.ts   # Logique utilisateurs
│   │   └── taskService.ts   # Logique tâches
│   ├── types/
│   │   └── index.ts         # Types et interfaces
│   ├── utils/
│   │   ├── database.ts      # Base de données mémoire
│   │   └── helpers.ts       # Fonctions utilitaires
│   ├── config.ts            # Configuration
│   └── server.ts            # Point d'entrée
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Mode développement (avec hot reload)
npm run dev

# Build production
npm run build
npm start
```

Le serveur démarre sur **http://localhost:3001**

## 🔐 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@cnss.bj` | `password123` | Admin |
| `user@cnss.bj` | `password123` | User |
| `dev@cnss.bj` | `password123` | Developer |

## 📚 Endpoints de l'API

### 🔑 Authentification

#### POST `/api/auth/login`
Connexion utilisateur.

```typescript
// Request
interface LoginDTO {
  email: string;
  password: string;
}

// Response
interface AuthResponse {
  message: string;
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // secondes
}
```

**Exemple:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnss.bj","password":"password123"}'
```

#### POST `/api/auth/refresh`
Rafraîchir le token d'accès.

```typescript
// Request
{ refreshToken: string }

// Response
interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}
```

#### POST `/api/auth/logout`
Déconnexion (invalide le refresh token).

#### GET `/api/auth/me` 🔒
Récupérer le profil de l'utilisateur connecté.

#### PUT `/api/auth/me` 🔒
Modifier le profil.

```typescript
interface UpdateUserDTO {
  name?: string;
  avatar?: string;
}
```

---

### 👥 Utilisateurs

#### GET `/api/users` 🔒
Liste des utilisateurs avec pagination.

**Query params:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `search` (recherche par nom ou email)

```typescript
interface UsersResponse {
  users: SafeUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### GET `/api/users/:id` 🔒
Détails d'un utilisateur.

#### POST `/api/users` 🔒
Créer un utilisateur.

```typescript
interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user' | 'developer';
}
```

#### DELETE `/api/users/:id` 🔒
Supprimer un utilisateur.

---

### ✅ Tâches (Todo)

#### GET `/api/tasks` 🔒
Liste des tâches de l'utilisateur connecté.

**Query params:**
- `page`, `limit` (pagination)
- `completed` (true/false)
- `priority` (low/medium/high)

```typescript
interface TasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}
```

#### GET `/api/tasks/:id` 🔒
Détails d'une tâche.

#### POST `/api/tasks` 🔒
Créer une tâche.

```typescript
interface CreateTaskDTO {
  title: string;
  priority?: 'low' | 'medium' | 'high';
}
```

#### PUT `/api/tasks/:id` 🔒
Modifier une tâche.

```typescript
interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
```

#### PATCH `/api/tasks/:id/toggle` 🔒
Basculer l'état completed.

#### DELETE `/api/tasks/:id` 🔒
Supprimer une tâche.

---

### 🔧 Utilitaires

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check avec uptime |
| `GET /api/stats` | Statistiques globales |
| `GET /api/slow` | Réponse lente (3s) - test loading |
| `GET /api/error-test` | Erreur 500 simulée |

---

## 🔒 Authentification JWT

Toutes les routes 🔒 nécessitent le header:
```
Authorization: Bearer <accessToken>
```

### Codes d'erreur

```typescript
const ErrorCodes = {
  // Auth
  MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NO_TOKEN: 'NO_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NO_REFRESH_TOKEN: 'NO_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  MISSING_FIELDS: 'MISSING_FIELDS',
  
  // Server
  SERVER_ERROR: 'SERVER_ERROR',
};
```

---

## 💻 Intégration React TypeScript

### Types partagés

Créez un fichier `src/types/api.ts` dans votre projet React:

```typescript
// Types User
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'developer';
  avatar: string;
  createdAt: string;
}

// Types Task
export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// Types Auth
export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Types API
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
```

### Configuration Axios

```typescript
// api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/api';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor avec refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post<{ accessToken: string }>(
          'http://localhost:3001/api/auth/refresh',
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Service d'authentification

```typescript
// services/authService.ts
import api from '../api/axios';
import { AuthResponse, User } from '../types/api';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/auth/logout', { refreshToken });
    localStorage.clear();
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data } = await api.put<{ user: User }>('/auth/me', updates);
    return data.user;
  },
};
```

### Service des tâches

```typescript
// services/taskService.ts
import api from '../api/axios';
import { Task, PaginationMeta } from '../types/api';

interface TasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

interface GetTasksParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export const taskService = {
  async getTasks(params: GetTasksParams = {}): Promise<TasksResponse> {
    const { data } = await api.get<TasksResponse>('/tasks', { params });
    return data;
  },

  async createTask(
    title: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<Task> {
    const { data } = await api.post<{ task: Task }>('/tasks', { title, priority });
    return data.task;
  },

  async toggleTask(id: number): Promise<Task> {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}/toggle`);
    return data.task;
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const { data } = await api.put<{ task: Task }>(`/tasks/${id}`, updates);
    return data.task;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
```

### Hook personnalisé avec React Query

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export function useTasks(params = {}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getTasks(params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, priority }: { title: string; priority?: string }) =>
      taskService.createTask(title, priority as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskService.toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

---

## 🧪 Tests avec curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnss.bj","password":"password123"}'

# Sauvegarder le token
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Profil
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Liste des tâches
curl "http://localhost:3001/api/tasks?completed=false" \
  -H "Authorization: Bearer $TOKEN"

# Créer une tâche
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Nouvelle tâche","priority":"high"}'

# Toggle tâche
curl -X PATCH http://localhost:3001/api/tasks/1/toggle \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Configuration

Les paramètres sont dans `src/config.ts`:

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| `port` | 3001 | Port du serveur |
| `jwt.accessTokenExpiry` | 15m | Durée access token |
| `jwt.refreshTokenExpiry` | 7d | Durée refresh token |
| `simulation.minDelay` | 100ms | Délai réseau min |
| `simulation.maxDelay` | 400ms | Délai réseau max |

---

## 🎓 Formation React.js CNSS Bénin

**Séance 3 - Thèmes abordés :**
- Communication API REST avec Axios
- Interceptors et configuration centralisée
- Authentification JWT (Access/Refresh Token)
- Gestion des erreurs HTTP
- Typage TypeScript end-to-end
- Tests avec React Query

Bonne formation ! 🚀
