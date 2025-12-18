import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} ajouté au panier !`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 5 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Stock limité
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Ajouter</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
