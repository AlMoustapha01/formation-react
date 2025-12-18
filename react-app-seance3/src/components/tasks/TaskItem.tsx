import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Check,
  Circle,
  Trash2,
  Edit2,
  X,
  Save,
  AlertCircle,
  Clock,
  Flag,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
}

const priorityConfig = {
  low: {
    color: 'text-green-600 bg-green-100',
    icon: Clock,
    label: 'Basse',
  },
  medium: {
    color: 'text-yellow-600 bg-yellow-100',
    icon: Flag,
    label: 'Moyenne',
  },
  high: {
    color: 'text-red-600 bg-red-100',
    icon: AlertCircle,
    label: 'Haute',
  },
};

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  const handleSave = () => {
    if (editValue.trim() && editValue !== task.title) {
      onUpdate(task.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={`
        group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200
        hover:border-gray-300 hover:shadow-sm transition-all duration-200
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 
          flex items-center justify-center transition-colors
          ${task.completed
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'border-gray-300 hover:border-primary-500'
          }
        `}
      >
        {task.completed ? (
          <Check className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4 text-transparent group-hover:text-gray-300" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="py-1"
          />
        ) : (
          <p
            className={`
              text-gray-900 truncate
              ${task.completed ? 'line-through text-gray-500' : ''}
            `}
          >
            {task.title}
          </p>
        )}
        
        {/* Meta info */}
        <div className="flex items-center gap-3 mt-1">
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${priority.color}
            `}
          >
            <PriorityIcon className="w-3 h-3" />
            {priority.label}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(task.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={task.completed}
              className="text-gray-600 hover:text-primary-600 hover:bg-primary-50"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
