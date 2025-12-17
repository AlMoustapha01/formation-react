// ============================================
// FICHIER: components/LoadingSpinner.jsx
// Spinner de chargement
// ============================================

import './LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Chargement...</p>
    </div>
  );
}
