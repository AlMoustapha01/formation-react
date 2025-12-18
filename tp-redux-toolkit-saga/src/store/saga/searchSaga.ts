import { call, put, debounce, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import {
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
} from '../../features/products/productsSlice';
import { Product } from '../../types';
import { RootState } from '../../store';

/**
 * Saga de recherche de produits
 * Effectue une recherche avec debounce de 300ms
 */
function* searchProductsSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  const query = action.payload;

  // Si la requête est trop courte, réinitialiser les résultats
  if (query.length < 2) {
    // Récupérer tous les produits depuis le state
    const allProducts: Product[] = yield select(
      (state: RootState) => state.products.items
    );
    yield put(setSearchResults(allProducts));
    return;
  }

  // Indiquer que la recherche est en cours
  yield put(setSearchLoading(true));

  try {
    // Appel à l'API de recherche
    const results: Product[] = yield call(productService.search, query);
    yield put(setSearchResults(results));
  } catch (error: any) {
    console.error('[Search Saga] Erreur:', error);
    // En cas d'erreur, afficher tous les produits
    const allProducts: Product[] = yield select(
      (state: RootState) => state.products.items
    );
    yield put(setSearchResults(allProducts));
  }
}

/**
 * Watcher: Recherche avec debounce
 * Attend 300ms après la dernière frappe avant de lancer la recherche
 */
export function* watchSearch(): Generator<any, void, any> {
  yield debounce(300, setSearchQuery.type, searchProductsSaga);
}

export default watchSearch;
