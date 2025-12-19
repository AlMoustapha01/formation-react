import { User, Task } from "../types";

// =============================================================================
// USERS DATABASE
// Mot de passe hashé: "password123"
// =============================================================================

export const users: User[] = [
  {
    id: 1,
    email: "admin@cnss.bj",
    password: "$2a$10$2hDXvoEkFhwj1I4QitrJEuL/.czj5C8wam9bXiLSBjz7or5vzbZBu",
    name: "Administrateur CNSS",
    role: "admin",
    avatar:
      "https://ui-avatars.com/api/?name=Admin+CNSS&background=0D8ABC&color=fff",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    email: "user@cnss.bj",
    password: "$2a$10$2hDXvoEkFhwj1I4QitrJEuL/.czj5C8wam9bXiLSBjz7or5vzbZBu",
    name: "Utilisateur Test",
    role: "user",
    avatar:
      "https://ui-avatars.com/api/?name=User+Test&background=4ADE80&color=fff",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: 3,
    email: "dev@cnss.bj",
    password: "$2a$10$2hDXvoEkFhwj1I4QitrJEuL/.czj5C8wam9bXiLSBjz7or5vzbZBu",
    name: "Développeur Frontend",
    role: "developer",
    avatar:
      "https://ui-avatars.com/api/?name=Dev+Frontend&background=61DAFB&color=000",
    createdAt: "2025-02-01T00:00:00Z",
  },
];

// =============================================================================
// TASKS DATABASE
// =============================================================================

export const tasks: Task[] = [
  {
    id: 1,
    userId: 1,
    title: "Configurer Axios",
    completed: true,
    priority: "high",
    createdAt: "2025-12-10T09:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    title: "Implémenter JWT",
    completed: false,
    priority: "high",
    createdAt: "2025-12-11T10:00:00Z",
  },
  {
    id: 3,
    userId: 1,
    title: "Créer les interceptors",
    completed: false,
    priority: "medium",
    createdAt: "2025-12-12T11:00:00Z",
  },
  {
    id: 4,
    userId: 2,
    title: "Tester React Query",
    completed: true,
    priority: "low",
    createdAt: "2025-12-13T14:00:00Z",
  },
  {
    id: 5,
    userId: 2,
    title: "Écrire les tests MSW",
    completed: false,
    priority: "medium",
    createdAt: "2025-12-14T15:00:00Z",
  },
  {
    id: 6,
    userId: 3,
    title: "Optimiser les performances",
    completed: false,
    priority: "high",
    createdAt: "2025-12-15T09:00:00Z",
  },
  {
    id: 7,
    userId: 3,
    title: "Documenter l'API",
    completed: true,
    priority: "low",
    createdAt: "2025-12-15T10:00:00Z",
  },
];

// =============================================================================
// REFRESH TOKENS STORE
// =============================================================================

export const refreshTokens = new Set<string>();

// =============================================================================
// ID COUNTERS
// =============================================================================

export const counters = {
  userId: 4,
  taskId: 8,
};
