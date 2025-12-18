# 🚀 Application React.js - Formation CNSS Bénin

Application React TypeScript complète pour la **Séance 3 : Intégration API et Authentification JWT**.

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** avec Access Token + Refresh Token
- 🍪 **Stockage sécurisé** des tokens dans les cookies
- 🔄 **Refresh automatique** du token via interceptors Axios
- ✅ **CRUD Tâches** complet avec filtres et statistiques
- 👤 **Gestion du profil** utilisateur
- 🎨 **Interface moderne** avec Tailwind CSS
- 📱 **Design responsive**
- 🔔 **Notifications toast** pour le feedback utilisateur

## 📁 Structure du Projet

```
src/
├── api/
│   └── axios.ts           # Instance Axios configurée
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx      # Formulaire de connexion
│   │   └── ProtectedRoute.tsx # Protection des routes
│   ├── layout/
│   │   ├── Header.tsx         # Navigation principale
│   │   └── MainLayout.tsx     # Layout avec header
│   ├── tasks/
│   │   ├── TaskForm.tsx       # Formulaire création tâche
│   │   ├── TaskItem.tsx       # Item de tâche
│   │   ├── TaskList.tsx       # Liste des tâches
│   │   └── TaskStats.tsx      # Statistiques
│   └── ui/
│       ├── Button.tsx         # Bouton réutilisable
│       ├── Input.tsx          # Input réutilisable
│       └── Spinner.tsx        # Loader
├── contexts/
│   └── AuthContext.tsx    # Contexte d'authentification
├── hooks/
│   └── useTasks.ts        # Hook personnalisé pour les tâches
├── pages/
│   ├── DashboardPage.tsx  # Page tableau de bord
│   ├── LoginPage.tsx      # Page de connexion
│   ├── ProfilePage.tsx    # Page profil
│   └── TasksPage.tsx      # Page des tâches
├── services/
│   ├── authService.ts     # Service d'authentification
│   └── taskService.ts     # Service des tâches
├── types/
│   └── index.ts           # Types TypeScript
├── utils/
│   └── tokenStorage.ts    # Gestion cookies sécurisés
├── App.tsx
├── main.tsx
├── router.tsx
└── index.css
```

## 📦 Installation

```bash
# Cloner ou extraire le projet
cd react-app-seance3

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer en développement
npm run dev
```

L'application démarre sur **http://localhost:5173**

## ⚙️ Prérequis

- **Node.js** 18+
- **API Backend** démarrée sur http://localhost:3001

## 🔐 Sécurité des Tokens

### Stockage dans les Cookies

Les tokens sont stockés de manière sécurisée via `js-cookie` avec les options suivantes :

```typescript
const COOKIE_OPTIONS = {
  // Cookie HTTPS uniquement en production
  secure: import.meta.env.PROD,
  
  // Protection CSRF
  sameSite: 'strict',
  
  // Chemin du cookie
  path: '/',
  
  // Durée de vie
  expires: 7, // jours
};
```

### Refresh Automatique

L'intercepteur Axios gère automatiquement le renouvellement du token :

1. Détection d'une erreur 401 avec code `TOKEN_EXPIRED`
2. Mise en file d'attente des requêtes en cours
3. Appel au endpoint `/auth/refresh`
4. Mise à jour du token et rejeu des requêtes

```typescript
// Gestion des requêtes multiples pendant le refresh
let isRefreshing = false;
let failedQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      // Refresh et rejeu automatique
    }
  }
);
```

## 🎯 Bonnes Pratiques Implémentées

### Architecture

- **Séparation des responsabilités** : Services, Hooks, Composants
- **Types TypeScript** stricts pour toute l'application
- **Composants réutilisables** (Button, Input, Spinner)
- **Contexte React** pour l'état global d'authentification

### Sécurité

- **Cookies sécurisés** avec `sameSite: strict`
- **Pas de stockage localStorage** pour les tokens sensibles
- **Refresh token** séparé de l'access token
- **Protection des routes** côté client

### UX

- **États de chargement** visuels (Spinner, isLoading)
- **Gestion des erreurs** avec notifications toast
- **Feedback utilisateur** sur chaque action
- **Design responsive** mobile-first

## 📝 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@cnss.bj` | `password123` | Admin |
| `user@cnss.bj` | `password123` | User |
| `dev@cnss.bj` | `password123` | Developer |

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## 📚 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router 6** - Routing
- **Axios** - Client HTTP
- **js-cookie** - Gestion des cookies
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications

## 🔗 Intégration avec l'API

L'application est configurée pour communiquer avec l'API sur `http://localhost:3001`.

### Endpoints utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Connexion |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Déconnexion |
| GET | `/auth/me` | Profil utilisateur |
| PUT | `/auth/me` | Mise à jour profil |
| GET | `/tasks` | Liste des tâches |
| POST | `/tasks` | Créer tâche |
| PUT | `/tasks/:id` | Modifier tâche |
| PATCH | `/tasks/:id/toggle` | Toggle completed |
| DELETE | `/tasks/:id` | Supprimer tâche |

## 🎓 Formation React.js CNSS Bénin

**Séance 3 - Concepts abordés :**

- Configuration d'Axios avec interceptors
- Gestion sécurisée des tokens JWT
- Refresh token automatique
- Architecture services/hooks
- Contexte React pour l'authentification
- Protection des routes
- Gestion des erreurs API

---

Bonne formation ! 🚀
