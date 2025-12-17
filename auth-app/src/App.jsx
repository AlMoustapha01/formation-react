// ============================================
// FICHIER: App.jsx
// Point d'entrée de l'application
// ============================================

import { AuthProvider } from './contexts/AuthContext';
import { AppContent } from './components/AppContent';
import './App.css';

function App() {
  return (
    // Envelopper toute l'application avec le Provider
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
