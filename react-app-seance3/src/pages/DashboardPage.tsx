import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, isLoading, createTask, toggleTask, deleteTask, updateTask } = useTasks({
    limit: 5,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {user?.name?.split(' ')[0]} ! 👋
        </h1>
        <p className="text-primary-100">
          Bienvenue sur votre tableau de bord. Gérez vos tâches efficacement.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une tâche
            </h2>
            <TaskForm onSubmit={createTask} />
          </div>

          {/* Recent Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tâches récentes
              </h2>
              <Link
                to="/tasks"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <TaskStats stats={stats} />

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accès rapide
            </h3>
            <div className="space-y-3">
              <Link
                to="/tasks"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Toutes les tâches</p>
                  <p className="text-sm text-gray-500">
                    {stats?.total || 0} tâches au total
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mon profil
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
