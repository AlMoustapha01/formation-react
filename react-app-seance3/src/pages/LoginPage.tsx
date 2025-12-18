import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger si déjà connecté
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <LoginForm />
        
        {/* Footer */}
        <p className="text-center text-primary-200 text-sm mt-8">
          Formation React.js - CNSS Bénin © 2025
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
