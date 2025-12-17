// ============================================
// FICHIER: components/Navbar.jsx
// Barre de navigation
// ============================================

import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🏛️</span>
        <span className="navbar-title">CNSS Bénin</span>
      </div>
      
      <div className="navbar-user">
        <span className="navbar-avatar">{user.avatar}</span>
        <span className="navbar-username">{user.name}</span>
        <span className="navbar-role">{user.role}</span>
        
        <button onClick={logout} className="navbar-logout">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
