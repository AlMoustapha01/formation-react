import { useEffect } from 'react';
import { Loader2, AlertCircle, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCart';

export function HomePage() {
    const dispatch = useAppDispatch();
    const { filteredItems, isLoading, error, searchQuery } = useAppSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Categories uniques
    const categories = [...new Set(filteredItems.map((p) => p.category))];

    if (isLoading && filteredItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="mt-4 text-gray-500">Chargement des produits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-red-700 mb-2">
                        Erreur de chargement
                    </h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => dispatch(fetchProducts())}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Bienvenue sur CNSS Shop</h1>
                <p className="text-primary-100 mb-4">
                    Découvrez notre sélection de produits tech de qualité
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                        {filteredItems.length} produits
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                        {categories.length} catégories
                    </span>
                </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
                <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-5 h-5" />
                    <span>
                        {filteredItems.length} résultat(s) pour "{searchQuery}"
                    </span>
                </div>
            )}

            {/* Products Grid */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Aucun produit trouvé
                    </h2>
                    <p className="text-gray-500">
                        Essayez avec d'autres termes de recherche
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;