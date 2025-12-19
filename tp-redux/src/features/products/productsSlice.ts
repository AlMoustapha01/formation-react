import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product, ProductsState } from "../../types";
import { productService } from "../../services/productService";
import type { RootState } from "../../store";

// =============================================================================
// ASYNC THUNKS
// =============================================================================

/**
 * Thunk: Charger tous les produits
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getAll();
      return products;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Erreur lors du chargement des produits"
      );
    }
  }
);

/**
 * Thunk: Charger un produit par ID
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number, { rejectWithValue }) => {
    try {
      const product = await productService.getById(id);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message || "Produit non trouvé");
    }
  }
);

/**
 * Thunk: Charger les produits seulement si nécessaire
 */
export const fetchProductsIfNeeded = createAsyncThunk(
  "products/fetchProductsIfNeeded",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;

    // Ne pas recharger si déjà en cache
    if (state.products.items.length > 0) {
      return state.products.items;
    }

    // Sinon, charger depuis l'API
    const result = await dispatch(fetchProducts()).unwrap();
    return result;
  }
);

/**
 * Thunk: Charger les produits par catégorie
 */
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const products = await productService.getByCategory(category);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erreur lors du chargement");
    }
  }
);

/**
 * Thunk: Rechercher des produits (version Thunk)
 */
export const searchProductsThunk = createAsyncThunk(
  "products/searchThunk",
  async (query: string, { rejectWithValue }) => {
    try {
      if (query.length < 2) {
        return [];
      }
      const products = await productService.search(query);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erreur de recherche");
    }
  }
);

// =============================================================================
// SLICE
// =============================================================================

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  searchQuery: "",
  isLoading: false,
  isSearching: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    /**
     * Effacer l'erreur
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Définir la requête de recherche
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /**
     * Filtrer les produits localement
     */
    filterProducts: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      if (!query) {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
    },

    /**
     * Effacer le produit sélectionné
     */
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    /**
     * Définir les résultats de recherche
     */
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.filteredItems = action.payload;
      state.isSearching = false;
    },

    /**
     * Définir l'état de recherche
     */
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
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
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // searchProductsThunk
      .addCase(searchProductsThunk.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.isSearching = false;
        state.filteredItems = action.payload;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  filterProducts,
  clearSelectedProduct,
  setSearchResults,
  setSearchLoading,
} = productsSlice.actions;

export default productsSlice.reducer;
