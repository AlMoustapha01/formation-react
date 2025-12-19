import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, LogIn } from 'lucide-react';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Email invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(6, 'Minimum 6 caractères'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
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
    setValue('email', credentials[type].email);
    setValue('password', credentials[type].password);
    clearErrors();
  };

  return (
    <div className="w-full min-w-3xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-2">Formation React.js - CNSS Bénin</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
              error={errors.email?.message}
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
              {...register('password')}
              error={errors.password?.message}
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
