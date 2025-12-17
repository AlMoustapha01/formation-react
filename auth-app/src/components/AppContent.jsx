// ============================================
// FICHIER: components/AppContent.jsx
// Gère l'affichage conditionnel selon l'auth
// ============================================

import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { Dashboard } from './Dashboard';
import { LoadingSpinner } from './LoadingSpinner';

export function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un spinner pendant la vérification
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Afficher la page de connexion ou le dashboard
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
