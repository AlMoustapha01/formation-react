import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateTaskDTO, TaskPriority } from '@/types';
import { Plus, Flag } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (dto: CreateTaskDTO) => Promise<any>;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Basse', color: 'text-green-600' },
  { value: 'medium', label: 'Moyenne', color: 'text-yellow-600' },
  { value: 'high', label: 'Haute', color: 'text-red-600' },
];

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ title: title.trim(), priority });
      setTitle('');
      setPriority('medium');
      setShowPriority(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            disabled={isLoading}
          />
        </div>
        
        {/* Priority Selector */}
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowPriority(!showPriority)}
            className={priorities.find(p => p.value === priority)?.color}
          >
            <Flag className="w-4 h-4" />
          </Button>
          
          {showPriority && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setPriority(p.value);
                    setShowPriority(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-100
                    ${priority === p.value ? 'bg-gray-50 font-medium' : ''}
                    ${p.color}
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {/* Priority indicator */}
      <div className="mt-2 text-xs text-gray-500">
        Priorité: <span className={priorities.find(p => p.value === priority)?.color}>
          {priorities.find(p => p.value === priority)?.label}
        </span>
      </div>

      {/* Overlay pour fermer le dropdown */}
      {showPriority && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowPriority(false)}
        />
      )}
    </form>
  );
}

export default TaskForm;
