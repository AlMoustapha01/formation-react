# 🛒 CNSS Shop - TP Redux Toolkit, Thunk & Saga

Application e-commerce complète pour le TP Redux de la formation React.js CNSS Bénin.

## 📦 Installation

```bash
npm install
npm run dev
```

L'application démarre sur **http://localhost:5173**

## 🎯 Objectifs du TP

Ce TP couvre :

1. **Redux Toolkit** - Configuration du store et création de slices
2. **Redux Thunk** - Actions asynchrones avec `createAsyncThunk`
3. **Redux Saga** - Flux complexes avec les Generators

## 📁 Structure du Projet

```
src/
├── features/
│   ├── auth/
│   │   └── authSlice.ts       # Slice auth (pour Saga)
│   ├── cart/
│   │   └── cartSlice.ts       # Slice panier (actions sync)
│   └── products/
│       └── productsSlice.ts   # Slice produits (avec Thunks)
├── store/
│   ├── saga/
│   │   ├── authSaga.ts        # Saga authentification
│   │   ├── cartSaga.ts        # Saga synchronisation panier
│   │   ├── searchSaga.ts      # Saga recherche debounce
│   │   └── rootSaga.ts        # Combinaison des sagas
│   ├── hooks.ts               # Hooks typés (useAppDispatch, useAppSelector)
│   └── index.ts               # Configuration store
├── services/
│   ├── authService.ts         # Service authentification
│   └── productService.ts      # Service produits
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
└── pages/
    ├── HomePage.tsx
    ├── CartPage.tsx
    └── LoginPage.tsx
```

## 🔑 Concepts Clés

### Redux Toolkit (Slice)

```typescript
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Immer permet la mutation directe
      state.items.push(action.payload);
    },
  },
});
```

### Redux Thunk

```typescript
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Redux Saga

```typescript
function* loginSaga(credentials) {
  try {
    const { user, token } = yield call(authService.login, credentials);
    yield call([localStorage, 'setItem'], 'token', token);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* watchAuth() {
  yield takeLatest(loginStart.type, loginSaga);
}
```

## 🧪 Fonctionnalités

### Avec Redux Thunk
- ✅ Chargement des produits
- ✅ Recherche de produits (version Thunk)
- ✅ Chargement conditionnel (cache)

### Avec Redux Saga
- ✅ Authentification (login/logout avec annulation)
- ✅ Recherche avec debounce (300ms)
- ✅ Synchronisation panier → localStorage
- ✅ Vérification de session au démarrage

### Slice Synchrone
- ✅ Gestion du panier (add, remove, update quantity)
- ✅ Calcul automatique des totaux

## 🔐 Comptes de Test

| Email | Mot de passe |
|-------|--------------|
| `admin@cnss.bj` | `password123` |
| `user@cnss.bj` | `password123` |

## 📚 Exercices du TP

Consultez le fichier `TP_REDUX_ENONCE.md` pour :

- Les exercices à compléter
- Les questions théoriques
- Les critères d'évaluation

## 🛠️ Technologies

- React 18
- Redux Toolkit
- Redux Saga
- TypeScript
- Tailwind CSS
- React Router
- React Hot Toast

---

**Formation React.js - CNSS Bénin - 2025**
