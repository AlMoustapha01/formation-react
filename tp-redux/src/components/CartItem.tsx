import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../types';
import { useAppDispatch } from '../store/hooks';
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from '../features/cart/cartSlice';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const dispatch = useAppDispatch();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            {/* Image */}
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-primary-600 font-semibold">
                    {formatPrice(item.price)}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => dispatch(decrementQuantity(item.id))}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Minus className="w-4 h-4 text-gray-600" />
                </button>

                <span className="w-8 text-center font-medium">{item.quantity}</span>

                <button
                    onClick={() => dispatch(incrementQuantity(item.id))}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Plus className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
                <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                </p>
            </div>

            {/* Remove */}
            <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}

export default CartItem;