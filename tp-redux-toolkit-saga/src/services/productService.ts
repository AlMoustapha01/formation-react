import axios from 'axios';
import { Product } from '../types';

const API_URL = 'http://localhost:3001/api';

// Données mockées pour le TP (si pas d'API)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    description: 'Puce M3 Pro, 18 Go RAM, 512 Go SSD',
    price: 2499000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Ordinateurs',
    stock: 15,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: '256 Go, Titane Naturel',
    price: 899000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    category: 'Smartphones',
    stock: 25,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    description: 'Réduction de bruit active, USB-C',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    category: 'Audio',
    stock: 50,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'iPad Air',
    description: 'Puce M1, 256 Go, WiFi',
    price: 549000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Tablettes',
    stock: 20,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 2',
    description: 'GPS + Cellular, 49mm, Titane',
    price: 699000,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    category: 'Montres',
    stock: 10,
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24 Ultra',
    description: '512 Go, Titane Noir',
    price: 1099000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    category: 'Smartphones',
    stock: 18,
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Sony WH-1000XM5',
    description: 'Casque sans fil, Réduction de bruit',
    price: 299000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Audio',
    stock: 30,
    rating: 4.9,
  },
  {
    id: 8,
    name: 'Dell XPS 15',
    description: 'Intel i7, 32 Go RAM, 1 To SSD',
    price: 1899000,
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400',
    category: 'Ordinateurs',
    stock: 12,
    rating: 4.5,
  },
];

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  /**
   * Récupérer tous les produits
   */
  async getAll(): Promise<Product[]> {
    try {
      // Essayer l'API réelle
      const response = await axios.get(`${API_URL}/products`);
      return response.data.products || response.data;
    } catch {
      // Fallback sur les données mockées
      await delay(800);
      return mockProducts;
    }
  },

  /**
   * Récupérer un produit par ID
   */
  async getById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch {
      await delay(500);
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Produit non trouvé');
      }
      return product;
    }
  },

  /**
   * Rechercher des produits
   */
  async search(query: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { q: query },
      });
      return response.data;
    } catch {
      await delay(300);
      const lowerQuery = query.toLowerCase();
      return mockProducts.filter(
        p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      );
    }
  },

  /**
   * Vérifier le stock d'un produit
   */
  async checkStock(id: number): Promise<number> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}/stock`);
      return response.data.stock;
    } catch {
      await delay(200);
      const product = mockProducts.find(p => p.id === id);
      return product?.stock || 0;
    }
  },

  /**
   * Récupérer les produits par catégorie
   */
  async getByCategory(category: string): Promise<Product[]> {
    await delay(500);
    if (category === 'all') {
      return mockProducts;
    }
    return mockProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  },
};

export default productService;
