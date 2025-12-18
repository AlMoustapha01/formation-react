import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, Product } from '../../types';

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
};

// Helper pour recalculer les totaux
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Ajouter un produit au panier
     */
    addToCart: (state, action: PayloadAction<Product | CartItem>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // Si le produit existe, augmenter la quantité
        existingItem.quantity += 1;
      } else {
        // Sinon, ajouter le nouveau produit
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        });
      }

      // Recalculer les totaux
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    /**
     * Retirer un produit du panier
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);

      // Recalculer les totaux
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    /**
     * Mettre à jour la quantité d'un produit
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        if (quantity <= 0) {
          // Si quantité <= 0, supprimer l'item
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }

      // Recalculer les totaux
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    /**
     * Incrémenter la quantité
     */
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      }
    },

    /**
     * Décrémenter la quantité
     */
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      }
    },

    /**
     * Vider le panier
     */
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },

    /**
     * Charger le panier depuis le localStorage
     */
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    /**
     * Définir l'état de chargement
     */
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  loadCart,
  setCartLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
