import React, { useState } from 'react';
import { X, ArrowLeft, CreditCard, CheckCircle } from './icons';
import { useAuth } from './AuthContext';

import { API_BASE_URL } from '../config';


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

interface PaymentPageProps {
  cartItems: CartItem[];
  formData: {
    name: string;
    address: string;
    phone: string;
  };
  onBack: () => void;
  onOrderSuccess: () => void;
  onClose: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  cartItems,
  formData,
  onBack,
  onOrderSuccess,
  onClose
}) => {
  const { user, isAuthenticated, getToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);

  // Check if token exists when component mounts
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      setError('Please login to place an order');
    } else {
      const token = getToken();
      if (!token) {
        setError('Your session has expired. Please login again.');
      }
    }
  }, [isAuthenticated, user, getToken]);

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      setError('Please login to place an order');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Get JWT token using AuthContext method
      const token = getToken();

      if (!token) {
        setError('Your session has expired. Please login again to place an order.');
        setIsProcessing(false);
        return;
      }

      // Prepare order items for backend
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        pieces: item.pieces,
        basePrice: item.basePrice,
        totalPrice: item.totalPrice, // Price per unit
        addOns: item.addOns,
        image: item.image
      }));

      // Create order via backend API with cash on delivery
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          address: formData.address,
          phone: formData.phone,
          paymentMethod: 'cash' // Always cash on delivery
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Order created successfully
      setOrderId(data.result?.orderId || 'N/A');
      setOrderSuccess(true);

      // Clear cart after successful order
      setTimeout(() => {
        onOrderSuccess();
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred while processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(3, 17, 13, 0.95)' }}>
        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl text-center"
          style={{
            backgroundColor: 'rgba(57, 30, 16, 0.98)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'rgba(199, 160, 122, 0.4)'
          }}
        >
          <CheckCircle className="w-20 h-20 mx-auto mb-4" style={{ color: '#4CAF50' }} />
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
            Order Placed Successfully!
          </h2>
          <p className="text-lg mb-2" style={{ color: '#E2CEB1' }}>
            Your order ID: <span className="font-bold" style={{ color: '#C7A07A' }}>{orderId}</span>
          </p>
          <p className="text-sm mb-6" style={{ color: '#E2CEB1' }}>
            We'll process your order and contact you shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#C7A07A', color: '#16302B' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(3, 17, 13, 0.95)' }}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-4 border-b"
          style={{
            backgroundColor: 'rgba(57, 30, 16, 0.98)',
            borderColor: 'rgba(199, 160, 122, 0.3)'
          }}
        >
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-opacity-80 transition-all"
            style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#C7A07A' }} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
            Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-80 transition-all"
            style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
          >
            <X className="w-5 h-5" style={{ color: '#C7A07A' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
          {/* Order Summary */}
          <div
            className="rounded-xl p-6 mb-6"
            style={{
              backgroundColor: 'rgba(57, 30, 16, 0.6)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(199, 160, 122, 0.3)'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: '#FDFCE8' }}>Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#FDFCE8' }}>
                      {item.name} ({item.pieces} Pieces) × {item.quantity}
                    </p>
                    {(item.addOns.giftCard || item.addOns.customName) && (
                      <div className="text-xs mt-1" style={{ color: '#E2CEB1' }}>
                        {item.addOns.giftCard && <div>• Gift Card</div>}
                        {item.addOns.customName && <div>• Custom Name: {item.addOns.customName}</div>}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold ml-4" style={{ color: '#C7A07A' }}>
                    Rs {(item.totalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'rgba(199, 160, 122, 0.2)' }}>
              <span className="text-lg font-bold" style={{ color: '#FDFCE8' }}>Total:</span>
              <span className="text-2xl font-bold" style={{ color: '#C7A07A', fontFamily: 'Georgia, serif' }}>
                Rs {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Information */}
          <div
            className="rounded-xl p-6 mb-6"
            style={{
              backgroundColor: 'rgba(57, 30, 16, 0.6)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(199, 160, 122, 0.3)'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: '#FDFCE8' }}>Delivery Information</h3>
            <div className="space-y-2 text-sm">
              <p><span style={{ color: '#E2CEB1' }}>Name:</span> <span style={{ color: '#FDFCE8' }}>{formData.name}</span></p>
              <p><span style={{ color: '#E2CEB1' }}>Phone:</span> <span style={{ color: '#FDFCE8' }}>{formData.phone}</span></p>
              <p><span style={{ color: '#E2CEB1' }}>Address:</span> <span style={{ color: '#FDFCE8' }}>{formData.address}</span></p>
            </div>
          </div>

          {/* Payment Method - Cash on Delivery Only */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full rounded-xl p-6 mb-6 transition-all hover:scale-[1.02] text-left"
            style={{
              backgroundColor: isProcessing ? 'rgba(199, 160, 122, 0.1)' : 'rgba(199, 160, 122, 0.2)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#C7A07A',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(199, 160, 122, 0.3)' }}>
                <span style={{ color: '#C7A07A', fontSize: '24px' }}>💵</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg" style={{ color: '#FDFCE8' }}>Cash on Delivery</p>
                <p className="text-sm" style={{ color: '#E2CEB1' }}>Click to place order - Pay when you receive your order</p>
              </div>
              {isProcessing && (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: '#C7A07A' }}></div>
              )}
            </div>
          </button>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-lg p-4 mb-6"
              style={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', borderLeft: '3px solid #f44336' }}
            >
              <p className="text-sm mb-3" style={{ color: '#f44336' }}>{error}</p>
              {error.includes('login') && (
                <button
                  onClick={onBack}
                  className="text-sm font-semibold underline"
                  style={{ color: '#C7A07A' }}
                >
                  Go back to login
                </button>
              )}
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            style={{
              backgroundColor: isProcessing
                ? 'rgba(199, 160, 122, 0.5)'
                : '#C7A07A',
              color: '#16302B',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Place Order (Cash on Delivery)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

