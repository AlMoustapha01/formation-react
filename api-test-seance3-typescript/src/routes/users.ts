import { Router, Response } from "express";
import { userService } from "../services/userService";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { logError } from "../utils/logger";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     description: Récupère la liste des utilisateurs avec pagination et recherche
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou email
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = userService.getUsers({
      page: Number(req.query.page) || undefined,
      limit: Number(req.query.limit) || undefined,
      search: req.query.search as string,
    });
    res.json(result);
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "get_users",
      userId: req.user?.id,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Détail d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détail de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = userService.getUserById(Number(req.params.id));
    res.json(user);
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "get_user_by_id",
      targetUserId: req.params.id,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email déjà existant ou champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      message: "Utilisateur créé",
      user,
    });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "create_user",
      email: req.body.email,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur supprimé
 *       400:
 *         description: Impossible de supprimer son propre compte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    userService.deleteUser(Number(req.params.id), req.user!.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "delete_user",
      targetUserId: req.params.id,
      userId: req.user?.id,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

export default router;
