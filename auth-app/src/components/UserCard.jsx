// ============================================
// FICHIER: components/UserCard.jsx
// Carte affichant le profil utilisateur
// ============================================

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserCard.css';

export function UserCard() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    updateProfile({ name });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <span className="user-card-avatar">{user.avatar}</span>
        <h3 className="user-card-title">Mon Profil</h3>
      </div>
      
      <div className="user-card-content">
        {isEditing ? (
          <div className="user-card-edit">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="user-card-input"
              placeholder="Votre nom"
            />
            <div className="user-card-buttons">
              <button onClick={handleSave} className="btn-save">
                Sauvegarder
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="user-card-info">
              <strong>Nom:</strong> {user.name}
            </p>
            <p className="user-card-info">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="user-card-info">
              <strong>Rôle:</strong> {user.role}
            </p>
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-edit"
            >
              ✏️ Modifier
            </button>
          </>
        )}
      </div>
    </div>
  );
}
