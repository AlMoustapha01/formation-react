// ============================================
// FICHIER: components/LoginPage.jsx
// Page de connexion
// ============================================
import './LoginPage.css';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

const schema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(8, 'Mot de passe doit contenir au moins 8 caractères').required('Mot de passe requis'),
}).required();


export function LoginPage() {
  const {login, isLoading} = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
   const result = await login(data.email, data.password);

   if(!result.success){
     setError(result.error);
   }
   
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 2000);
    }
  }, [error]);

  return (
    <div className="login-container">
      <div className="login-card">
        {error && <p className="login-error">{error}</p>}

        <h1 className="login-title">🔐 Connexion</h1>
        <p className="login-subtitle">CNSS Bénin - Espace sécurisé</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              {...register('email')}
              className="form-input"
              placeholder="votre@email.com"
              required
            />
            {errors.email && <p className="login-error">{errors.email.message}</p>}
          </div>
          
          <div className="form-field">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              {...register('password')}
              className="form-input"
              placeholder="••••••••"
              required
            />
            {errors.password && <p className="login-error">{errors.password.message}</p>}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="login-hint">
          💡 Utilisez: admin@cnss.bj / password123
        </p>
      </div>
    </div>
  );
}
