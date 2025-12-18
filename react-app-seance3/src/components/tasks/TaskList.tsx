import { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { Spinner } from '@/components/ui/Spinner';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onToggle,
  onDelete,
  onUpdate,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Chargement des tâches...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Aucune tâche
        </h3>
        <p className="text-gray-500">
          Commencez par créer votre première tâche !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;
