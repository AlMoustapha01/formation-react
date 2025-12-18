/**
 * API REST de Test - Formation React.js CNSS Bénin
 * Séance 3 : Intégration API et Authentification JWT
 *
 * TypeScript Version
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import { swaggerSpec } from "./config/swagger";
import { randomDelay } from "./utils/helpers";
import { tasks, users } from "./utils/database";
import { ErrorCodes } from "./types";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";

const app = express();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// CORS
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  })
);

// JSON Parser
app.use(express.json());

// Simuler un délai réseau (réalisme)
app.use((req: Request, res: Response, next: NextFunction) => {
  const delay = randomDelay(
    config.simulation.minDelay,
    config.simulation.maxDelay
  );
  setTimeout(next, delay);
});

// Logger des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =============================================================================
// ROUTES
// =============================================================================

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API CNSS - Documentation",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Vérifie l'état de santé de l'API
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Statistiques globales
 *     description: Récupère les statistiques globales de l'API (public)
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: Statistiques
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 */
app.get("/api/stats", (req: Request, res: Response) => {
  res.json({
    totalUsers: users.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    pendingTasks: tasks.filter((t) => !t.completed).length,
  });
});

/**
 * @swagger
 * /api/error-test:
 *   get:
 *     summary: Simuler une erreur 500
 *     description: Endpoint de test pour simuler une erreur serveur
 *     tags: [Utils]
 *     responses:
 *       500:
 *         description: Erreur simulée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/error-test", (req: Request, res: Response) => {
  res.status(500).json({
    error: "Erreur serveur simulée",
    code: ErrorCodes.SIMULATED_ERROR,
  });
});

/**
 * @swagger
 * /api/slow:
 *   get:
 *     summary: Simuler une réponse lente
 *     description: Endpoint de test avec un délai de 3 secondes
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: Réponse après délai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Réponse lente (3 secondes)
 */
app.get("/api/slow", (req: Request, res: Response) => {
  setTimeout(() => {
    res.json({ message: "Réponse lente (3 secondes)" });
  }, config.simulation.slowEndpointDelay);
});

// =============================================================================
// GESTION DES ERREURS
// =============================================================================

// 404 - Route non trouvée
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route non trouvée",
    code: ErrorCodes.NOT_FOUND,
    path: req.path,
  });
});

// Gestionnaire d'erreurs global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erreur:", err);
  res.status(500).json({
    error: "Erreur serveur interne",
    code: ErrorCodes.INTERNAL_ERROR,
  });
});

// =============================================================================
// DÉMARRAGE DU SERVEUR
// =============================================================================

app.listen(config.port, () => {
  console.log("");
  console.log(
    "╔══════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║   API REST TypeScript - Formation React.js CNSS Bénin - Séance 3 ║"
  );
  console.log(
    "╠══════════════════════════════════════════════════════════════════╣"
  );
  console.log(
    `║  🚀 Serveur démarré sur http://localhost:${config.port}                  ║`
  );
  console.log(
    "╠══════════════════════════════════════════════════════════════════╣"
  );
  console.log(
    "║  Comptes de test :                                               ║"
  );
  console.log(
    "║    • admin@cnss.bj / password123 (admin)                         ║"
  );
  console.log(
    "║    • user@cnss.bj / password123 (user)                           ║"
  );
  console.log(
    "║    • dev@cnss.bj / password123 (developer)                       ║"
  );
  console.log(
    "╠══════════════════════════════════════════════════════════════════╣"
  );
  console.log(
    "║  Endpoints :                                                     ║"
  );
  console.log(
    "║    Auth:  POST /api/auth/login, /refresh, /logout                ║"
  );
  console.log(
    "║           GET  /api/auth/me, PUT /api/auth/me                    ║"
  );
  console.log(
    "║    Users: GET  /api/users, POST /api/users                       ║"
  );
  console.log(
    "║           GET  /api/users/:id, DELETE /api/users/:id             ║"
  );
  console.log(
    "║    Tasks: GET  /api/tasks, POST /api/tasks                       ║"
  );
  console.log(
    "║           GET  /api/tasks/:id, PUT /api/tasks/:id                ║"
  );
  console.log(
    "║           PATCH /api/tasks/:id/toggle, DELETE /api/tasks/:id     ║"
  );
  console.log(
    "║    Utils: GET  /api/health, /api/stats, /api/slow, /api/error    ║"
  );
  console.log(
    "╠══════════════════════════════════════════════════════════════════╣"
  );
  console.log(
    `║  📚 Documentation Swagger: http://localhost:${config.port}/api-docs          ║`
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════════╝"
  );
  console.log("");
});

export default app;
