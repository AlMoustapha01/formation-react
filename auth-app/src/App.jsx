// ============================================
// FICHIER: App.jsx
// Point d'entrée de l'application
// ============================================

import './App.css';
import { LoginPage } from './components/LoginPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

export default App;
