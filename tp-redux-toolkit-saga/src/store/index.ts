import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

// Reducers
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';

// Root Saga
import rootSaga from './saga/rootSaga';

// Créer le middleware Saga
const sagaMiddleware = createSagaMiddleware();

/**
 * Configuration du Store Redux
 * 
 * Intègre:
 * - Redux Toolkit (avec Thunk par défaut)
 * - Redux Saga (via middleware custom)
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Désactiver la vérification de sérialisation pour les actions Saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Lancer les Sagas
sagaMiddleware.run(rootSaga);

// Types TypeScript pour le store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
