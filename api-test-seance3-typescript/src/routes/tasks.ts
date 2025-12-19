import { Router, Response } from "express";
import { taskService } from "../services/taskService";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest, TaskPriority } from "../types";
import { logError } from "../utils/logger";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Liste des tâches
 *     description: Récupère les tâches de l'utilisateur connecté avec pagination et filtres
 *     tags: [Tasks]
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
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut (true/false)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrer par priorité
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = taskService.getTasks({
      userId: req.user!.id,
      page: Number(req.query.page) || undefined,
      limit: Number(req.query.limit) || undefined,
      completed:
        req.query.completed !== undefined
          ? req.query.completed === "true"
          : undefined,
      priority: req.query.priority as TaskPriority | undefined,
    });
    res.json(result);
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "get_tasks",
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
 * /api/tasks/{id}:
 *   get:
 *     summary: Détail d'une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Détail de la tâche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = taskService.getTaskById(Number(req.params.id), req.user!.id);
    res.json(task);
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "get_task_by_id",
      taskId: req.params.id,
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
 * /api/tasks:
 *   post:
 *     summary: Créer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tâche créée
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Titre manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = taskService.createTask(req.user!.id, req.body);
    res.status(201).json({
      message: "Tâche créée",
      task,
    });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "create_task",
      userId: req.user?.id,
      title: req.body.title,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Modifier une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tâche mise à jour
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = taskService.updateTask(
      Number(req.params.id),
      req.user!.id,
      req.body
    );
    res.json({
      message: "Tâche mise à jour",
      task,
    });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "update_task",
      taskId: req.params.id,
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
 * /api/tasks/{id}/toggle:
 *   patch:
 *     summary: Basculer l'état completed
 *     description: Inverse le statut completed de la tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Statut modifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Statut de la tâche modifié
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/toggle", (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = taskService.toggleTask(Number(req.params.id), req.user!.id);
    res.json({
      message: "Statut de la tâche modifié",
      task,
    });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "toggle_task",
      taskId: req.params.id,
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
 * /api/tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tâche supprimée
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", (req: AuthenticatedRequest, res: Response) => {
  try {
    taskService.deleteTask(Number(req.params.id), req.user!.id);
    res.json({ message: "Tâche supprimée" });
  } catch (err: any) {
    logError(err.error || err.message, {
      action: "delete_task",
      taskId: req.params.id,
      userId: req.user?.id,
    });
    res.status(err.status || 500).json({
      error: err.error || "Erreur serveur",
      code: err.code || "SERVER_ERROR",
    });
  }
});

export default router;
