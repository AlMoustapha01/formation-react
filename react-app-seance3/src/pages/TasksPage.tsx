import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskStats } from '@/components/tasks/TaskStats';
import { Button } from '@/components/ui/Button';
import { TaskPriority } from '@/types';
import { Filter, RefreshCw } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'completed';

export function TasksPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const {
    tasks,
    stats,
    isLoading,
    refetch,
    createTask,
    toggleTask,
    deleteTask,
    updateTask,
  } = useTasks({
    completed: filter === 'all' ? undefined : filter === 'completed',
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En cours' },
    { key: 'completed', label: 'Terminées' },
  ];

  const priorities: { key: TaskPriority | 'all'; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'high', label: 'Haute' },
    { key: 'medium', label: 'Moyenne' },
    { key: 'low', label: 'Basse' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Tâches</h1>
          <p className="text-gray-500">
            Gérez et suivez l'avancement de vos tâches
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Actualiser
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Task Form */}
          <TaskForm onSubmit={createTask} />

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Statut:</span>
                <div className="flex gap-1">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={`
                        px-3 py-1.5 text-sm rounded-lg transition-colors
                        ${filter === f.key
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-sm text-gray-500">Priorité:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {priorities.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>

        {/* Sidebar */}
        <div>
          <TaskStats stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
