import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST - Formation React.js CNSS Bénin",
      version: "1.0.0",
      description: `
API REST TypeScript pour la formation React.js CNSS Bénin - Séance 3.

## Authentification
Cette API utilise JWT (JSON Web Tokens) pour l'authentification.
- Obtenez un token via \`POST /api/auth/login\`
- Incluez le token dans le header: \`Authorization: Bearer <token>\`

## Comptes de test
| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@cnss.bj | password123 | admin |
| user@cnss.bj | password123 | user |
| dev@cnss.bj | password123 | developer |
      `,
      contact: {
        name: "CNSS Bénin",
        email: "contact@cnss.bj",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez votre token JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", format: "email", example: "user@cnss.bj" },
            name: { type: "string", example: "Jean Dupont" },
            role: {
              type: "string",
              enum: ["admin", "user", "developer"],
              example: "user",
            },
            avatar: {
              type: "string",
              example: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            title: { type: "string", example: "Ma tâche" },
            completed: { type: "boolean", example: false },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@cnss.bj" },
            password: { type: "string", example: "password123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Connexion réussie" },
            user: { $ref: "#/components/schemas/User" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            expiresIn: { type: "integer", example: 900 },
          },
        },
        RefreshRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
        RefreshResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            expiresIn: { type: "integer", example: 900 },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "nouveau@cnss.bj",
            },
            password: { type: "string", example: "password123" },
            name: { type: "string", example: "Nouveau Utilisateur" },
            role: {
              type: "string",
              enum: ["admin", "user", "developer"],
              example: "user",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Nouvelle tâche" },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", example: "Tâche modifiée" },
            completed: { type: "boolean", example: true },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Nouveau Nom" },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.png",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 100 },
            totalPages: { type: "integer", example: 10 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Message d'erreur" },
            code: { type: "string", example: "ERROR_CODE" },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "OK" },
            timestamp: { type: "string", format: "date-time" },
            uptime: { type: "number", example: 123.456 },
            version: { type: "string", example: "1.0.0" },
            environment: { type: "string", example: "development" },
          },
        },
        StatsResponse: {
          type: "object",
          properties: {
            totalUsers: { type: "integer", example: 3 },
            totalTasks: { type: "integer", example: 10 },
            completedTasks: { type: "integer", example: 5 },
            pendingTasks: { type: "integer", example: 5 },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentification et gestion du profil" },
      { name: "Users", description: "Gestion des utilisateurs" },
      { name: "Tasks", description: "Gestion des tâches" },
      { name: "Utils", description: "Endpoints utilitaires" },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/server.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
