// ============================================
// FICHIER: components/StatsCard.jsx
// Carte affichant une statistique
// ============================================

import './StatsCard.css';

export function StatsCard({ title, value, icon }) {
  return (
    <div className="stats-card">
      <span className="stats-card-icon">{icon}</span>
      <div className="stats-card-content">
        <p className="stats-card-value">{value}</p>
        <p className="stats-card-title">{title}</p>
      </div>
    </div>
  );
}
