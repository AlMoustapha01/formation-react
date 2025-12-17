// ============================================
// FICHIER: components/Dashboard.jsx
// Tableau de bord principal
// ============================================

import { useAuth } from '../contexts/AuthContext';
import { Navbar } from './Navbar';
import { UserCard } from './UserCard';
import { StatsCard } from './StatsCard';
import './Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        <h1 className="dashboard-welcome">
          Bienvenue, {user.name} ! 👋
        </h1>
        
        <div className="dashboard-grid">
          <UserCard />
          <StatsCard title="Dossiers traités" value="156" icon="📁" />
          <StatsCard title="En attente" value="23" icon="⏳" />
          <StatsCard title="Ce mois" value="42" icon="📊" />
        </div>
      </main>
    </div>
  );
}
