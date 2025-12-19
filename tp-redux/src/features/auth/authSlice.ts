import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, LoginCredentials } from "../../types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Actions pour les Sagas (pas de logique async ici)

    /**
     * Déclencher le login (pour Saga)
     */
    loginStart: (state, action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Login réussi
     */
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * Login échoué
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    /**
     * Déconnexion
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Définir l'utilisateur (pour restauration de session)
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },

    /**
     * Effacer l'erreur
     */
    clearAuthError: (state) => {
      state.error = null;
    },

    /**
     * Vérifier la session (pour Saga)
     */
    checkSession: (state) => {
      state.isLoading = true;
    },

    /**
     * Session vérifiée
     */
    sessionChecked: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearAuthError,
  checkSession,
  sessionChecked,
} = authSlice.actions;

export default authSlice.reducer;
