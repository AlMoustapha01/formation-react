import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, clearAuthError } from '../features/auth/authSlice';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginStart({ email, password }));
  };

  const fillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@cnss.bj');
      setPassword('password123');
    } else {
      setEmail('user@cnss.bj');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-500 mt-2">Accédez à votre compte CNSS Shop</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">Comptes de démonstration</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg"
              >
                Utilisateur
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-primary-600 hover:underline">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
