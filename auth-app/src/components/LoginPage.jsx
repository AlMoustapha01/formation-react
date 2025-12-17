// ============================================
// FICHIER: components/LoginPage.jsx
// Page de connexion
// ============================================

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('admin@cnss.bj');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🔐 Connexion</h1>
        <p className="login-subtitle">CNSS Bénin - Espace sécurisé</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="login-hint">
          💡 Utilisez: admin@cnss.bj / password123
        </p>
      </div>
    </div>
  );
}
