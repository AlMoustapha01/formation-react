import api from '@/api/axios';
import {
  Task,
  TasksResponse,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskPriority,
} from '@/types';

/**
 * Paramètres pour récupérer les tâches
 */
interface GetTasksParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: TaskPriority;
}

/**
 * Service de gestion des tâches
 */
export const taskService = {
  /**
   * Récupérer la liste des tâches
   */
  async getTasks(params: GetTasksParams = {}): Promise<TasksResponse> {
    const { data } = await api.get<TasksResponse>('/tasks', { params });
    return data;
  },

  /**
   * Récupérer une tâche par ID
   */
  async getTaskById(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  /**
   * Créer une nouvelle tâche
   */
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const { data } = await api.post<{ message: string; task: Task }>(
      '/tasks',
      dto
    );
    return data.task;
  },

  /**
   * Mettre à jour une tâche
   */
  async updateTask(id: number, dto: UpdateTaskDTO): Promise<Task> {
    const { data } = await api.put<{ message: string; task: Task }>(
      `/tasks/${id}`,
      dto
    );
    return data.task;
  },

  /**
   * Basculer l'état completed d'une tâche
   */
  async toggleTask(id: number): Promise<Task> {
    const { data } = await api.patch<{ message: string; task: Task }>(
      `/tasks/${id}/toggle`
    );
    return data.task;
  },

  /**
   * Supprimer une tâche
   */
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
