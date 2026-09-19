import React from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ClickSpark from './components/ClickSpark';
import Cart from './components/Cart';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import PaymentPage from './components/PaymentPage';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  pieces: number;
  basePrice: number;
  addOns: {
    giftCard: boolean;
    customName: string | null;
  };
  totalPrice: number;
  quantity: number;
  image: string;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Truffles");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [pendingCartItem, setPendingCartItem] = React.useState<CartItem | null>(null);
  const [isPaymentPageOpen, setIsPaymentPageOpen] = React.useState(false);
  const [checkoutFormData, setCheckoutFormData] = React.useState<{ name: string; address: string; phone: string } | null>(null);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('choce_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('choce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toggleFavorite = (item: string) => {
    setFavorites(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const addToCart = (product: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, product];
    });
    showToast('Item added to cart!', 'success');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleCart = (productData: CartItem) => {
    addToCart(productData);
  };

  const isInCart = (id: string) => cartItems.some(item => item.productId === id);

  const handleAuthSuccess = () => {
    if (pendingCartItem) {
      addToCart(pendingCartItem);
      setPendingCartItem(null);
    }
  };

  return (
    <AuthProvider>
      <AppContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        cartItems={cartItems}
        addToCart={addToCart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isInCart={isInCart}
        toasts={toasts}
        removeToast={removeToast}
        showToast={showToast}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        setPendingCartItem={setPendingCartItem}
        handleAuthSuccess={handleAuthSuccess}
        onProceedToPayment={(formData) => {
          setCheckoutFormData(formData);
          setIsPaymentPageOpen(true);
        }}
        isPaymentPageOpen={isPaymentPageOpen}
        checkoutFormData={checkoutFormData}
        onPaymentClose={() => {
          setIsPaymentPageOpen(false);
          setCheckoutFormData(null);
        }}
        onOrderSuccess={() => {
          setCartItems([]);
          localStorage.removeItem('choce_cart');
          setIsPaymentPageOpen(false);
          setCheckoutFormData(null);
          showToast('Order placed successfully!', 'success');
        }}
        onClearCart={() => {
          setCartItems([]);
          localStorage.removeItem('choce_cart');
          showToast('Cart cleared!', 'success');
        }}
      />
    </AuthProvider>
  );
};

import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard

interface AppContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  favorites: string[];
  toggleFavorite: (item: string) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isInCart: (id: string) => boolean;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  setPendingCartItem: (item: CartItem | null) => void;
  handleAuthSuccess: () => void;
  onProceedToPayment: (formData: { name: string; address: string; phone: string }) => void;
  isPaymentPageOpen: boolean;
  checkoutFormData: { name: string; address: string; phone: string } | null;
  onPaymentClose: () => void;
  onOrderSuccess: () => void;
  onClearCart: () => void;
}

const AppContent: React.FC<AppContentProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  favorites,
  toggleFavorite,
  cartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  isCartOpen,
  setIsCartOpen,
  isInCart,
  toasts,
  removeToast,
  showToast,
  isAuthModalOpen,
  setIsAuthModalOpen,
  setPendingCartItem,
  handleAuthSuccess,
  onProceedToPayment,
  isPaymentPageOpen,
  checkoutFormData,
  onPaymentClose,
  onOrderSuccess,
  onClearCart
}) => {
  const [currentView, setCurrentView] = React.useState<'home' | 'admin'>('home');
  const { user } = useAuth(); // Get user from context

  // Redirect to Admin Dashboard if user is admin
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      setCurrentView('admin');
    }
  }, [user]);

  return (
    <>
      <ClickSpark color="#C7A07A" particleCount={10} sparkSize={6} minSpeed={60} maxSpeed={180} />
      <div className="h-screen overflow-hidden font-sans" style={{ backgroundColor: '#03110D' }}>
        <div className="border rounded-xl md:rounded-2xl lg:rounded-3xl h-full flex flex-col" style={{ backgroundColor: 'rgba(57, 5, 23, 0.75)', borderColor: 'rgba(199, 160, 122, 0.15)', margin: '8px', height: 'calc(100vh - 16px)' }}>
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            favoritesCount={favorites.length}
            cartCount={cartItems.length}
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onAdminClick={() => setCurrentView('admin')}
            onHomeClick={() => setCurrentView('home')}
          />
          <main className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
            {currentView === 'home' ? (
              <Dashboard
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                cartItems={cartItems}
                onAddToCart={(item) => {
                  addToCart(item);
                }}
                onShowAuthModal={(item) => {
                  setPendingCartItem(item);
                  setIsAuthModalOpen(true);
                }}
                isInCart={isInCart}
              />
            ) : (
              <AdminDashboard />
            )}
          </main>
        </div>
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={onClearCart}
        onProceedToPayment={onProceedToPayment}
      />
      {isPaymentPageOpen && checkoutFormData && (
        <PaymentPage
          cartItems={cartItems}
          formData={checkoutFormData}
          onBack={() => {
            onPaymentClose();
            setIsCartOpen(true);
          }}
          onOrderSuccess={onOrderSuccess}
          onClose={onPaymentClose}
        />
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCartItem(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default App;