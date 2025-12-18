import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearCart } from '../features/cart/cartSlice';
import { CartItem } from '../components/CartItem';
import toast from 'react-hot-toast';

export function CartPage() {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Panier vidé !');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer commande');
      return;
    }
    toast.success('Commande validée ! (Simulation)');
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-500 mb-6">
            Ajoutez des produits pour commencer vos achats
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Panier</h1>
          <p className="text-gray-500">{totalItems} article(s)</p>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Vider le panier
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Récapitulatif
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Valider la commande
            </button>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 text-center mt-4">
                <Link to="/login" className="text-primary-600 hover:underline">
                  Connectez-vous
                </Link>{' '}
                pour passer commande
              </p>
            )}

            <Link
              to="/"
              className="flex items-center justify-center gap-2 mt-4 text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
