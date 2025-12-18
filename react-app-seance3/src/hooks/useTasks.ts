import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/taskService';
import { Task, TasksResponse, TaskPriority, CreateTaskDTO } from '@/types';
import toast from 'react-hot-toast';

interface UseTasksOptions {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: TaskPriority;
}

interface UseTasksReturn {
  tasks: Task[];
  stats: TasksResponse['stats'] | null;
  pagination: TasksResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTask: (dto: CreateTaskDTO) => Promise<Task | null>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (id: number, title: string) => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les tâches
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TasksResponse['stats'] | null>(null);
  const [pagination, setPagination] = useState<TasksResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupérer les tâches
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(options);
      setTasks(response.tasks);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur lors du chargement';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [options.page, options.limit, options.completed, options.priority]);

  /**
   * Charger les tâches au montage et quand les options changent
   */
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Créer une tâche
   */
  const createTask = useCallback(async (dto: CreateTaskDTO): Promise<Task | null> => {
    try {
      const newTask = await taskService.createTask(dto);
      setTasks((prev) => [newTask, ...prev]);
      setStats((prev) => prev ? {
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      } : null);
      toast.success('Tâche créée !');
      return newTask;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur lors de la création';
      toast.error(message);
      return null;
    }
  }, []);

  /**
   * Basculer l'état d'une tâche
   */
  const toggleTask = useCallback(async (id: number) => {
    try {
      const updatedTask = await taskService.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      setStats((prev) => {
        if (!prev) return null;
        if (updatedTask.completed) {
          return { ...prev, completed: prev.completed + 1, pending: prev.pending - 1 };
        } else {
          return { ...prev, completed: prev.completed - 1, pending: prev.pending + 1 };
        }
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur lors de la mise à jour';
      toast.error(message);
    }
  }, []);

  /**
   * Supprimer une tâche
   */
  const deleteTask = useCallback(async (id: number) => {
    try {
      const taskToDelete = tasks.find((t) => t.id === id);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setStats((prev) => {
        if (!prev || !taskToDelete) return null;
        return {
          ...prev,
          total: prev.total - 1,
          completed: taskToDelete.completed ? prev.completed - 1 : prev.completed,
          pending: taskToDelete.completed ? prev.pending : prev.pending - 1,
        };
      });
      toast.success('Tâche supprimée !');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur lors de la suppression';
      toast.error(message);
    }
  }, [tasks]);

  /**
   * Mettre à jour une tâche
   */
  const updateTask = useCallback(async (id: number, title: string) => {
    try {
      const updatedTask = await taskService.updateTask(id, { title });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      toast.success('Tâche mise à jour !');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur lors de la mise à jour';
      toast.error(message);
    }
  }, []);

  return {
    tasks,
    stats,
    pagination,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    toggleTask,
    deleteTask,
    updateTask,
  };
}

export default useTasks;
