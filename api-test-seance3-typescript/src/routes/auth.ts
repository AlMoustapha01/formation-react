import { Router, Response } from "express";
import { authService } from "../services/authService";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { logError, logAuth } from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", async (req, res: Response) => {
  try {
    const result = await authService.login(req.body);
    logAuth("login", req.body.email || "unknown", true);
    res.json(result);
  } catch (err: any) {
    logAuth(
      "login",
      req.body.email || "unknown",
      false,
      err.error || err.message
    );
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Token rafraîchi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Token de rafraîchissement invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/refresh", (req, res: Response) => {
  try {
    const result = authService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (err: any) {
    logError(err.error || err.message, { action: "refresh_token" });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie
 */
router.post("/logout", (req, res: Response) => {
  authService.logout(req.body.refreshToken);
  res.json({ message: "Déconnexion réussie" });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Profil utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/me",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = authService.getProfile(req.user!.id);
      res.json(user);
    } catch (err: any) {
      logError(err.error || err.message, {
        action: "get_profile",
        userId: req.user?.id,
      });
      res.status(err.status || 500).json({
        error: err.error || "Erreur serveur",
        code: err.code || "SERVER_ERROR",
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Modifier le profil
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil mis à jour
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/me",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = authService.updateProfile(req.user!.id, req.body);
      res.json({
        message: "Profil mis à jour",
        user,
      });
    } catch (err: any) {
      logError(err.error || err.message, {
        action: "update_profile",
        userId: req.user?.id,
      });
      res.status(err.status || 500).json({
        error: err.error || "Erreur serveur",
        code: err.code || "SERVER_ERROR",
      });
    }
  }
);

export default router;
