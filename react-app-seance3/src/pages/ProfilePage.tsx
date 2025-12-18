import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Shield, Calendar, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile({ name: name.trim() });
      updateUser(updatedUser);
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />
        
        {/* Avatar & Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-xl border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 capitalize">
              <Shield className="w-4 h-4 mr-1" />
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Modifier mes informations
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nom complet
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <Input
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                L'email ne peut pas être modifié
              </p>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Enregistrer les modifications
          </Button>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations du compte
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Rôle</p>
              <p className="text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Membre depuis</p>
              <p className="text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
