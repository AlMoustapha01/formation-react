// =============================================================================
// PRODUCT TYPES
// =============================================================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

// =============================================================================
// CART TYPES
// =============================================================================

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
}

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// =============================================================================
// PRODUCTS STATE
// =============================================================================

export interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
