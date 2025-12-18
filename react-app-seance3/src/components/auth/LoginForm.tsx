import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, LogIn } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      // Erreur gérée dans le contexte
    }
  };

  const fillDemo = (type: 'admin' | 'user' | 'dev') => {
    const credentials = {
      admin: { email: 'admin@cnss.bj', password: 'password123' },
      user: { email: 'user@cnss.bj', password: 'password123' },
      dev: { email: 'dev@cnss.bj', password: 'password123' },
    };
    setEmail(credentials[type].email);
    setPassword(credentials[type].password);
    setErrors({});
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-2">Formation React.js - CNSS Bénin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              className="pl-10"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              className="pl-10"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Se connecter
          </Button>
        </form>

        {/* Comptes de démo */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center mb-4">
            Comptes de démonstration
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fillDemo('admin')}
              className="flex-1 text-xs"
            >
              Admin
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fillDemo('user')}
              className="flex-1 text-xs"
            >
              User
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fillDemo('dev')}
              className="flex-1 text-xs"
            >
              Dev
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
