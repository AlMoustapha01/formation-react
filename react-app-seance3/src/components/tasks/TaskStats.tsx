import { CheckCircle, Circle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
  } | null;
}

export function TaskStats({ stats }: TaskStatsProps) {
  if (!stats) return null;

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: ListTodo,
      color: 'text-primary-600 bg-primary-100',
    },
    {
      label: 'Terminées',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'En cours',
      value: stats.pending,
      icon: Circle,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
        <span className="text-2xl font-bold text-primary-600">
          {completionRate}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-center">
              <div
                className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full mb-2
                  ${item.color}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskStats;
