import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from './icons';
import { useAuth } from './AuthContext';

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

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToPayment: (formData: CheckoutFormData) => void;
}

interface CheckoutFormData {
  name: string;
  address: string;
  phone: string;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onProceedToPayment }) => {
  const { user, isAuthenticated } = useAuth();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<CheckoutFormData>>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    address: '',
    phone: ''
  });

  // Pre-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name,
        address: user.address,
        phone: user.phone
      });
    }
  }, [isAuthenticated, user]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Delivery address is required';
    } else if (formData.address.trim().length < 10) {
      errors.address = 'Please enter a complete address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated and has a valid token
    if (!isAuthenticated) {
      alert('Please login to proceed to payment');
      return;
    }

    // Verify token exists in localStorage
    const token = localStorage.getItem('choce_token');
    if (!token) {
      alert('Your session has expired. Please login again.');
      return;
    }

    // Proceed to payment page
    onProceedToPayment(formData);
    setShowCheckoutForm(false);
    onClose();
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    onUpdateQuantity(id, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(id, currentQuantity - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999] backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 z-[9999] shadow-2xl transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          backgroundColor: 'rgba(57, 30, 16, 0.98)',
          borderLeft: '2px solid rgba(199, 160, 122, 0.4)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between p-3 sm:p-4 border-b"
            style={{ borderColor: 'rgba(199, 160, 122, 0.3)' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#C7A07A' }} />
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#FDFCE8' }}>Your Cart</h2>
              <h2 className="text-xl font-bold" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
                Shopping Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-opacity-80 transition-all"
              style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
            >
              <X className="w-5 h-5" style={{ color: '#C7A07A' }} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" style={{ color: '#C7A07A' }} />
                <p className="text-lg font-semibold mb-2" style={{ color: '#FDFCE8' }}>Your cart is empty</p>
                <p className="text-sm" style={{ color: '#E2CEB1' }}>Add some delicious chocolates to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="rounded-lg p-3 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(22, 48, 43, 0.4)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'rgba(199, 160, 122, 0.3)'
                    }}
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        style={{ backgroundColor: 'rgba(22, 48, 43, 0.5)' }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1" style={{ color: '#FDFCE8' }}>
                          {item.name} ({item.pieces} Pieces)
                        </h3>
                        {(item.addOns.giftCard || item.addOns.customName) && (
                          <div className="text-xs mb-1" style={{ color: '#E2CEB1' }}>
                            {item.addOns.giftCard && <div>• Gift Card</div>}
                            {item.addOns.customName && <div>• Name: {item.addOns.customName}</div>}
                          </div>
                        )}
                        <p className="text-sm mb-2" style={{ color: '#C7A07A' }}>
                          Rs {item.totalPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              className="p-1 rounded hover:bg-opacity-80 transition-all"
                              style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
                            >
                              <Minus className="w-3 h-3" style={{ color: '#C7A07A' }} />
                            </button>
                            <span className="text-sm font-semibold w-8 text-center" style={{ color: '#FDFCE8' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                              className="p-1 rounded hover:bg-opacity-80 transition-all"
                              style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
                            >
                              <Plus className="w-3 h-3" style={{ color: '#C7A07A' }} />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded hover:bg-opacity-80 transition-all"
                            style={{ backgroundColor: 'rgba(164, 69, 41, 0.3)' }}
                          >
                            <Trash2 className="w-4 h-4" style={{ color: '#A44529' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t" style={{ borderColor: 'rgba(199, 160, 122, 0.2)' }}>
                      <span className="text-xs" style={{ color: '#E2CEB1' }}>Subtotal:</span>
                      <span className="text-sm font-bold" style={{ color: '#C7A07A' }}>
                        Rs {(item.totalPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {cartItems.length > 0 && (
            <div
              className="p-3 sm:p-4 border-t"
              style={{
                borderColor: 'rgba(199, 160, 122, 0.3)',
                backgroundColor: 'rgba(22, 48, 43, 0.6)'
              }}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-semibold" style={{ color: '#FDFCE8' }}>Total:</span>
                <span className="text-xl sm:text-2xl font-bold" style={{ color: '#C7A07A', fontFamily: 'Georgia, serif' }}>
                  Rs {totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#C7A07A', color: '#16302B' }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 mt-2 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(199, 160, 122, 0.2)',
                  color: '#FDFCE8',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(199, 160, 122, 0.4)'
                }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-[9999] backdrop-blur-sm"
            onClick={() => setShowCheckoutForm(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div
              className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
              style={{
                backgroundColor: 'rgba(57, 30, 16, 0.98)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'rgba(199, 160, 122, 0.4)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
                  Checkout Details
                </h2>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="p-2 rounded-full hover:bg-opacity-80 transition-all"
                  style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#C7A07A' }} />
                </button>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customer-name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: undefined });
                      }
                    }}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      backgroundColor: 'rgba(22, 48, 43, 0.5)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: formErrors.name ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                      color: '#FDFCE8'
                    }}
                  />
                  {formErrors.name && (
                    <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customer-phone"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) {
                        setFormErrors({ ...formErrors, phone: undefined });
                      }
                    }}
                    placeholder="0701234567"
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      backgroundColor: 'rgba(22, 48, 43, 0.5)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: formErrors.phone ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                      color: '#FDFCE8'
                    }}
                  />
                  {formErrors.phone && (
                    <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="customer-address" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                    Delivery Address *
                  </label>
                  <textarea
                    id="customer-address"
                    required
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (formErrors.address) {
                        setFormErrors({ ...formErrors, address: undefined });
                      }
                    }}
                    placeholder="Street address, City, Postal Code"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                    style={{
                      backgroundColor: 'rgba(22, 48, 43, 0.5)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: formErrors.address ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                      color: '#FDFCE8'
                    }}
                  />
                  {formErrors.address && (
                    <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(199, 160, 122, 0.1)' }}>
                    <span className="text-sm font-semibold" style={{ color: '#E2CEB1' }}>Order Total:</span>
                    <span className="text-xl font-bold" style={{ color: '#C7A07A' }}>
                      Rs {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isSubmitting ? 'rgba(199, 160, 122, 0.5)' : '#C7A07A',
                      color: '#16302B',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
