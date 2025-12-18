import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { checkSession } from './features/auth/authSlice';
import { initCart } from './store/saga/cartSaga';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Vérifier la session utilisateur au démarrage
    dispatch(checkSession());
    // Charger le panier depuis localStorage
    dispatch(initCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
