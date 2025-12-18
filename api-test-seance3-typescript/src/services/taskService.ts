import { tasks, counters } from '../utils/database';
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TasksResponse,
  TaskPriority,
  ErrorCodes,
} from '../types';
import { calculatePagination, paginate } from '../utils/helpers';
import { config } from '../config';

interface GetTasksParams {
  userId: number;
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: TaskPriority;
}

class TaskService {
  /**
   * Liste des tâches de l'utilisateur
   */
  getTasks(params: GetTasksParams): TasksResponse {
    const {
      userId,
      page = config.pagination.defaultPage,
      limit = config.pagination.defaultLimit,
      completed,
      priority,
    } = params;

    let userTasks = tasks.filter((t) => t.userId === userId);

    // Filtres
    if (completed !== undefined) {
      userTasks = userTasks.filter((t) => t.completed === completed);
    }
    if (priority) {
      userTasks = userTasks.filter((t) => t.priority === priority);
    }

    // Tri par date décroissante
    userTasks.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Stats (avant pagination)
    const allUserTasks = tasks.filter((t) => t.userId === userId);
    const stats = {
      total: allUserTasks.length,
      completed: allUserTasks.filter((t) => t.completed).length,
      pending: allUserTasks.filter((t) => !t.completed).length,
    };

    // Pagination
    const paginatedTasks = paginate(userTasks, page, limit);

    return {
      tasks: paginatedTasks,
      pagination: calculatePagination(userTasks.length, page, limit),
      stats,
    };
  }

  /**
   * Récupérer une tâche par ID
   */
  getTaskById(id: number, userId: number): Task {
    const task = tasks.find((t) => t.id === id && t.userId === userId);
    if (!task) {
      throw {
        status: 404,
        error: 'Tâche non trouvée',
        code: ErrorCodes.NOT_FOUND,
      };
    }
    return task;
  }

  /**
   * Créer une tâche
   */
  createTask(userId: number, dto: CreateTaskDTO): Task {
    const { title, priority = 'medium' } = dto;

    if (!title || title.trim() === '') {
      throw {
        status: 400,
        error: 'Le titre est requis',
        code: ErrorCodes.MISSING_TITLE,
      };
    }

    const newTask: Task = {
      id: counters.taskId++,
      userId,
      title: title.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return newTask;
  }

  /**
   * Mettre à jour une tâche
   */
  updateTask(id: number, userId: number, dto: UpdateTaskDTO): Task {
    const taskIndex = tasks.findIndex((t) => t.id === id && t.userId === userId);

    if (taskIndex === -1) {
      throw {
        status: 404,
        error: 'Tâche non trouvée',
        code: ErrorCodes.NOT_FOUND,
      };
    }

    if (dto.title !== undefined) {
      tasks[taskIndex].title = dto.title.trim();
    }
    if (dto.completed !== undefined) {
      tasks[taskIndex].completed = dto.completed;
    }
    if (dto.priority !== undefined) {
      tasks[taskIndex].priority = dto.priority;
    }

    return tasks[taskIndex];
  }

  /**
   * Basculer l'état completed
   */
  toggleTask(id: number, userId: number): Task {
    const taskIndex = tasks.findIndex((t) => t.id === id && t.userId === userId);

    if (taskIndex === -1) {
      throw {
        status: 404,
        error: 'Tâche non trouvée',
        code: ErrorCodes.NOT_FOUND,
      };
    }

    tasks[taskIndex].completed = !tasks[taskIndex].completed;

    return tasks[taskIndex];
  }

  /**
   * Supprimer une tâche
   */
  deleteTask(id: number, userId: number): void {
    const taskIndex = tasks.findIndex((t) => t.id === id && t.userId === userId);

    if (taskIndex === -1) {
      throw {
        status: 404,
        error: 'Tâche non trouvée',
        code: ErrorCodes.NOT_FOUND,
      };
    }

    tasks.splice(taskIndex, 1);
  }
}

export const taskService = new TaskService();
