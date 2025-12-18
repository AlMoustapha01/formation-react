# 🎓 TP Redux Toolkit, Thunk & Saga

## Formation React.js - CNSS Bénin
### Travaux Pratiques : Gestion d'État Avancée

---

## 📋 Objectifs Pédagogiques

À la fin de ce TP, vous serez capable de :

1. **Configurer Redux Toolkit** dans une application React
2. **Créer des slices** avec `createSlice`
3. **Gérer les actions asynchrones** avec Redux Thunk (`createAsyncThunk`)
4. **Implémenter Redux Saga** pour des flux complexes
5. **Comparer** Thunk vs Saga et choisir selon le contexte
6. **Utiliser les hooks Redux** : `useSelector`, `useDispatch`

---

## 🛒 Contexte du Projet

Vous allez développer une application **E-Commerce CNSS Shop** permettant de :

- Afficher une liste de produits (depuis une API)
- Gérer un panier d'achat
- Authentifier les utilisateurs
- Gérer les états de chargement et les erreurs

---

## 📚 Partie 1 : Redux Toolkit - Les Bases (45 min)

### 1.1 Concepts Clés

#### Qu'est-ce que Redux Toolkit ?

Redux Toolkit est la méthode **officielle et recommandée** pour écrire du Redux. Il simplifie :

- La configuration du store
- La création des reducers (via `createSlice`)
- La gestion des actions asynchrones (via `createAsyncThunk`)
- L'immutabilité (via Immer intégré)

#### Architecture Redux

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPOSANTS                           │
│  ┌─────────────┐                      ┌─────────────┐      │
│  │  useSelector │◄────── STATE ──────│   STORE     │      │
│  └─────────────┘                      └──────┬──────┘      │
│                                              │              │
│  ┌─────────────┐                      ┌──────▼──────┐      │
│  │ useDispatch │────── ACTION ──────►│  REDUCERS   │      │
│  └─────────────┘                      └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Exercice 1 : Configuration du Store

**Objectif** : Configurer le store Redux avec Redux Toolkit

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Question** : Pourquoi utilise-t-on `configureStore` plutôt que `createStore` ?

### 1.3 Exercice 2 : Créer un Slice (Cart)

**Objectif** : Créer un slice pour gérer le panier

```typescript
// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // TODO: Implémenter addToCart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Votre code ici
    },
    
    // TODO: Implémenter removeFromCart
    removeFromCart: (state, action: PayloadAction<number>) => {
      // Votre code ici
    },
    
    // TODO: Implémenter updateQuantity
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      // Votre code ici
    },
    
    // TODO: Implémenter clearCart
    clearCart: (state) => {
      // Votre code ici
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**Exercice** : Complétez les reducers du panier. Utilisez la mutation directe (Immer s'en occupe).

---

## 📚 Partie 2 : Redux Thunk - Actions Asynchrones (45 min)

### 2.1 Concepts Clés

#### Qu'est-ce que Redux Thunk ?

Redux Thunk permet de dispatcher des **fonctions** au lieu d'objets actions. Idéal pour :

- Appels API simples
- Logique conditionnelle
- Actions séquentielles

#### Cycle de vie d'un Thunk

```
dispatch(fetchProducts())
        │
        ▼
┌───────────────────┐
│  pending          │ ──► isLoading = true
└───────────────────┘
        │
        ▼
   Appel API...
        │
   ┌────┴────┐
   ▼         ▼
fulfilled  rejected
   │         │
   ▼         ▼
data      error
```

### 2.2 Exercice 3 : Créer un AsyncThunk (Products)

**Objectif** : Charger les produits depuis l'API

```typescript
// src/features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { productService } from '../../services/productService';

// Création du thunk asynchrone
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getAll();
      return products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement');
    }
  }
);

// TODO: Créer fetchProductById
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    // Votre code ici
  }
);

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // TODO: Ajouter les cases pour fetchProductById
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
```

### 2.3 Exercice 4 : Thunk avec Paramètres et Conditions

**Objectif** : Créer un thunk conditionnel

```typescript
// Thunk avec condition (ne pas recharger si déjà en cache)
export const fetchProductsIfNeeded = createAsyncThunk(
  'products/fetchProductsIfNeeded',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    
    // TODO: Vérifier si les produits sont déjà chargés
    // Si oui, ne rien faire
    // Sinon, dispatcher fetchProducts
  }
);
```

**Question** : Quand utiliseriez-vous `condition` dans `createAsyncThunk` ?

---

## 📚 Partie 3 : Redux Saga - Flux Complexes (60 min)

### 3.1 Concepts Clés

#### Qu'est-ce que Redux Saga ?

Redux Saga utilise les **Generators ES6** pour gérer les effets de bord. Idéal pour :

- Flux complexes (login/logout, workflows)
- Annulation de requêtes
- Debounce/Throttle
- WebSockets

#### Effects principaux

| Effect | Description | Exemple |
|--------|-------------|---------|
| `call` | Appelle une fonction | `call(api.getProducts)` |
| `put` | Dispatche une action | `put(setProducts(data))` |
| `take` | Attend une action | `take('LOGIN_REQUEST')` |
| `takeEvery` | Écoute chaque action | `takeEvery('FETCH', handler)` |
| `takeLatest` | Annule les précédents | `takeLatest('SEARCH', handler)` |
| `select` | Accède au state | `select(state => state.user)` |
| `fork` | Crée une tâche non-bloquante | `fork(watchAuth)` |
| `cancel` | Annule une tâche | `cancel(task)` |

### 3.2 Exercice 5 : Première Saga (Products)

**Objectif** : Créer une saga pour charger les produits

```typescript
// src/store/saga/productsSaga.ts
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdStart,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
} from '../../features/products/productsSliceSaga';

// Saga pour charger tous les produits
function* fetchProductsSaga(): Generator {
  try {
    const products = yield call(productService.getAll);
    yield put(fetchProductsSuccess(products as Product[]));
  } catch (error: any) {
    yield put(fetchProductsFailure(error.message));
  }
}

// TODO: Saga pour charger un produit par ID
function* fetchProductByIdSaga(action: PayloadAction<number>): Generator {
  try {
    // Votre code ici
  } catch (error: any) {
    // Votre code ici
  }
}

// Watcher Saga
export function* watchProducts(): Generator {
  yield takeLatest(fetchProductsStart.type, fetchProductsSaga);
  yield takeLatest(fetchProductByIdStart.type, fetchProductByIdSaga);
}
```

### 3.3 Exercice 6 : Saga d'Authentification Complexe

**Objectif** : Implémenter un flux login/logout complet

```typescript
// src/store/saga/authSaga.ts
import { call, put, take, fork, cancel, cancelled } from 'redux-saga/effects';
import { Task } from 'redux-saga';
import { authService } from '../../services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
} from '../../features/auth/authSliceSaga';

// Saga de login
function* loginSaga(email: string, password: string): Generator {
  try {
    const response = yield call(authService.login, { email, password });
    const { user, token } = response as { user: User; token: string };
    
    // Stocker le token
    yield call([localStorage, 'setItem'], 'token', token);
    
    yield put(loginSuccess(user));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  } finally {
    // Exécuté même si annulé
    if (yield cancelled()) {
      console.log('Login annulé');
    }
  }
}

// Saga de logout
function* logoutSaga(): Generator {
  yield call([localStorage, 'removeItem'], 'token');
  yield put(setUser(null));
}

// Watcher principal - Gère le cycle login/logout
function* watchAuthFlow(): Generator {
  while (true) {
    // Attendre une action de login
    const { payload } = yield take(loginStart.type);
    const { email, password } = payload;
    
    // Fork le login (non-bloquant)
    const task: Task = yield fork(loginSaga, email, password);
    
    // Attendre logout ou erreur
    const action = yield take([logout.type, loginFailure.type]);
    
    // Si logout, annuler le login en cours
    if (action.type === logout.type) {
      yield cancel(task);
      yield call(logoutSaga);
    }
  }
}

export function* watchAuth(): Generator {
  yield fork(watchAuthFlow);
}
```

### 3.4 Exercice 7 : Saga avec Debounce (Recherche)

**Objectif** : Implémenter une recherche avec debounce

```typescript
// src/store/saga/searchSaga.ts
import { call, put, debounce, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import {
  searchProducts,
  setSearchResults,
  setSearchLoading,
} from '../../features/products/productsSliceSaga';

function* searchProductsSaga(action: PayloadAction<string>): Generator {
  const query = action.payload;
  
  if (query.length < 2) {
    yield put(setSearchResults([]));
    return;
  }
  
  yield put(setSearchLoading(true));
  
  try {
    const results = yield call(productService.search, query);
    yield put(setSearchResults(results as Product[]));
  } catch (error) {
    yield put(setSearchResults([]));
  } finally {
    yield put(setSearchLoading(false));
  }
}

export function* watchSearch(): Generator {
  // Debounce de 300ms
  yield debounce(300, searchProducts.type, searchProductsSaga);
}
```

---

## 📚 Partie 4 : Comparaison Thunk vs Saga (30 min)

### 4.1 Tableau Comparatif

| Critère | Redux Thunk | Redux Saga |
|---------|-------------|------------|
| **Complexité** | Simple | Plus complexe |
| **Courbe d'apprentissage** | Facile | Generators à maîtriser |
| **Cas d'usage** | CRUD simple, appels API | Workflows complexes |
| **Annulation** | Difficile | Natif (`cancel`, `cancelled`) |
| **Tests** | Mocks nécessaires | Facile avec les effects |
| **Debounce/Throttle** | Bibliothèque externe | Natif |
| **Taille bundle** | Léger | Plus lourd |

### 4.2 Quand utiliser quoi ?

#### Utilisez **Thunk** quand :
- ✅ Actions asynchrones simples (CRUD)
- ✅ Équipe junior ou projet petit
- ✅ Pas besoin d'annulation
- ✅ Logique séquentielle simple

#### Utilisez **Saga** quand :
- ✅ Workflows complexes (auth, paiement)
- ✅ Besoin d'annulation de requêtes
- ✅ Debounce/Throttle natif
- ✅ WebSockets, polling
- ✅ Tests unitaires avancés

### 4.3 Exercice 8 : Refactoring Thunk → Saga

**Objectif** : Convertir un thunk en saga

```typescript
// Version Thunk
export const addToCartWithStock = createAsyncThunk(
  'cart/addWithStock',
  async (product: Product, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const cartItem = state.cart.items.find(item => item.id === product.id);
    const currentQty = cartItem?.quantity || 0;
    
    // Vérifier le stock
    const stock = await productService.checkStock(product.id);
    
    if (currentQty + 1 > stock) {
      return rejectWithValue('Stock insuffisant');
    }
    
    dispatch(addToCart({ ...product, quantity: 1 }));
    return product;
  }
);

// TODO: Convertir en Saga
function* addToCartWithStockSaga(action: PayloadAction<Product>): Generator {
  // Votre code ici
}
```

---

## 📚 Partie 5 : Projet Final (60 min)

### 5.1 Objectif

Créer une application **E-Commerce** complète avec :

1. **Liste des produits** (chargement async)
2. **Recherche** avec debounce (Saga)
3. **Panier** (ajout, suppression, quantité)
4. **Authentification** (login/logout avec Saga)
5. **Persistance** du panier (localStorage)

### 5.2 Fonctionnalités à implémenter

#### Avec Redux Thunk :
- [ ] Charger les produits
- [ ] Charger un produit par ID
- [ ] Vérifier le stock avant ajout

#### Avec Redux Saga :
- [ ] Recherche avec debounce
- [ ] Flux d'authentification complet
- [ ] Synchronisation panier avec localStorage
- [ ] Polling des mises à jour de stock

### 5.3 Critères d'évaluation

| Critère | Points |
|---------|--------|
| Configuration Store correcte | 2 |
| Slices bien structurés | 3 |
| Thunks fonctionnels | 3 |
| Sagas implémentées | 4 |
| Gestion des erreurs | 2 |
| TypeScript strict | 2 |
| Code propre et commenté | 2 |
| Bonus: Tests unitaires | 2 |
| **Total** | **20** |

---

## 📝 Ressources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Saga Documentation](https://redux-saga.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/)

---

## ✅ Checklist de Rendu

- [ ] Code source complet
- [ ] README avec instructions
- [ ] Captures d'écran de l'application
- [ ] Réponses aux questions théoriques
- [ ] (Bonus) Tests unitaires

---

**Bonne chance ! 🚀**

*Formation React.js - CNSS Bénin - 2025*
