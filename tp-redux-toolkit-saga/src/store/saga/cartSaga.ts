import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  loadCart,
} from '../../features/cart/cartSlice';
import { CartItem, Product } from '../../types';
import { RootState } from '../../store';
import { productService } from '../../services/productService';

const CART_STORAGE_KEY = 'cnss_shop_cart';

/**
 * Saga: Sauvegarder le panier dans localStorage
 */
function* saveCartToStorage(): Generator<any, void, any> {
  try {
    const cartItems: CartItem[] = yield select(
      (state: RootState) => state.cart.items
    );
    yield call(
      [localStorage, 'setItem'],
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  } catch (error) {
    console.error('[Cart Saga] Erreur sauvegarde:', error);
  }
}

/**
 * Saga: Charger le panier depuis localStorage
 */
function* loadCartFromStorage(): Generator<any, void, any> {
  try {
    const cartStr: string | null = yield call(
      [localStorage, 'getItem'],
      CART_STORAGE_KEY
    );

    if (cartStr) {
      const cartItems: CartItem[] = JSON.parse(cartStr);
      yield put(loadCart(cartItems));
    }
  } catch (error) {
    console.error('[Cart Saga] Erreur chargement:', error);
  }
}

/**
 * Saga: Vérifier le stock avant d'ajouter au panier
 */
function* addToCartWithStockCheck(
  action: PayloadAction<Product>
): Generator<any, void, any> {
  const product = action.payload;

  try {
    // Récupérer la quantité actuelle dans le panier
    const cartItems: CartItem[] = yield select(
      (state: RootState) => state.cart.items
    );
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQty = existingItem?.quantity || 0;

    // Vérifier le stock disponible
    const stock: number = yield call(productService.checkStock, product.id);

    if (currentQty + 1 > stock) {
      // Stock insuffisant - on pourrait dispatcher une erreur ici
      console.warn(
        `[Cart Saga] Stock insuffisant pour ${product.name}. Stock: ${stock}, Panier: ${currentQty}`
      );
      // Pour l'instant, on laisse passer (le reducer gère déjà l'ajout)
    }

    // Sauvegarder après l'ajout
    yield call(saveCartToStorage);
  } catch (error) {
    console.error('[Cart Saga] Erreur vérification stock:', error);
    // Sauvegarder quand même
    yield call(saveCartToStorage);
  }
}

/**
 * Saga: Action d'initialisation du panier
 */
export const INIT_CART = 'cart/init';
export const initCart = () => ({ type: INIT_CART });

/**
 * Watcher: Écouter les changements du panier
 */
export function* watchCart(): Generator<any, void, any> {
  // Charger le panier au démarrage
  yield takeLatest(INIT_CART, loadCartFromStorage);

  // Sauvegarder à chaque modification
  yield takeEvery(
    [
      addToCart.type,
      removeFromCart.type,
      updateQuantity.type,
      incrementQuantity.type,
      decrementQuantity.type,
      clearCart.type,
    ],
    saveCartToStorage
  );

  // Vérifier le stock lors de l'ajout
  yield takeLatest(addToCart.type, addToCartWithStockCheck);
}

export default watchCart;
