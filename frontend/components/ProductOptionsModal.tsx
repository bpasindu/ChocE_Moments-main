import React, { useState } from 'react';
import { X, ShoppingBag } from './icons';

interface QuantityOption {
  pieces: number;
  price: number;
}

interface AddOns {
  giftCard: { available: boolean; price: number };
  customName: { available: boolean; price: number };
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  quantityOptions: QuantityOption[];
  addOns: AddOns;
}

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (productData: any) => void;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState<QuantityOption | null>(null);
  const [includeGiftCard, setIncludeGiftCard] = useState(false);
  const [includeCustomName, setIncludeCustomName] = useState(false);
  const [customName, setCustomName] = useState('');

  React.useEffect(() => {
    if (product && product.quantityOptions.length > 0) {
      setSelectedQuantity(product.quantityOptions[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const calculateTotal = () => {
    let total = selectedQuantity?.price || 0;
    if (includeGiftCard) total += product.addOns.giftCard.price;
    if (includeCustomName) total += product.addOns.customName.price;
    return total;
  };

  const handleAddToCart = () => {
    if (!selectedQuantity) return;

    const cartItem = {
      id: `${product.id}-${selectedQuantity.pieces}pcs${includeGiftCard ? '-gift' : ''}${includeCustomName ? '-name' : ''}`,
      productId: product.id,
      name: product.name,
      pieces: selectedQuantity.pieces,
      basePrice: selectedQuantity.price,
      addOns: {
        giftCard: includeGiftCard,
        customName: includeCustomName ? customName : null
      },
      totalPrice: calculateTotal(),
      quantity: 1,
      image: product.image
    };

    onAddToCart(cartItem);
    
    // Reset and close
    setSelectedQuantity(product.quantityOptions[0]);
    setIncludeGiftCard(false);
    setIncludeCustomName(false);
    setCustomName('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            backgroundColor: 'rgba(57, 30, 16, 0.98)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'rgba(199, 160, 122, 0.4)'
          }}
        >
          {/* Header */}
          <div 
            className="sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-sm"
            style={{ 
              borderColor: 'rgba(199, 160, 122, 0.3)',
              backgroundColor: 'rgba(57, 30, 16, 0.95)'
            }}
          >
            <h2 className="text-2xl font-bold" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
              Customize Your Order
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-opacity-80 transition-all"
              style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
            >
              <X className="w-5 h-5" style={{ color: '#C7A07A' }} />
            </button>
          </div>

          <div className="p-6">
            {/* Product Image and Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(22, 48, 43, 0.5)' }}>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                {includeCustomName && customName && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="px-6 py-3 rounded-lg backdrop-blur-md"
                      style={{ backgroundColor: 'rgba(57, 30, 16, 0.8)' }}
                    >
                      <p 
                        className="text-2xl font-bold text-center"
                        style={{ 
                          color: '#C7A07A', 
                          fontFamily: 'Georgia, serif',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {customName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#E2CEB1' }}>
                  {product.description}
                </p>
              </div>
            </div>

            {/* Quantity Options */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3" style={{ color: '#FDFCE8' }}>
                Select Quantity *
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.quantityOptions.map((option) => (
                  <button
                    key={option.pieces}
                    onClick={() => setSelectedQuantity(option)}
                    className="p-4 rounded-lg transition-all hover:scale-105"
                    style={{
                      backgroundColor: selectedQuantity?.pieces === option.pieces 
                        ? 'rgba(199, 160, 122, 0.3)' 
                        : 'rgba(22, 48, 43, 0.5)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: selectedQuantity?.pieces === option.pieces 
                        ? '#C7A07A' 
                        : 'rgba(199, 160, 122, 0.2)'
                    }}
                  >
                    <div className="text-lg font-bold" style={{ color: '#FDFCE8' }}>
                      {option.pieces} Pieces
                    </div>
                    <div className="text-sm" style={{ color: '#C7A07A' }}>
                      Rs {option.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3" style={{ color: '#FDFCE8' }}>
                Add-ons (Optional)
              </h4>
              
              {/* Gift Card */}
              {product.addOns.giftCard.available && (
                <div 
                  className="p-4 rounded-lg mb-3 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: includeGiftCard 
                      ? 'rgba(199, 160, 122, 0.2)' 
                      : 'rgba(22, 48, 43, 0.3)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: includeGiftCard 
                      ? '#C7A07A' 
                      : 'rgba(199, 160, 122, 0.2)'
                  }}
                  onClick={() => setIncludeGiftCard(!includeGiftCard)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeGiftCard}
                        onChange={(e) => setIncludeGiftCard(e.target.checked)}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: '#C7A07A' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎁</span>
                          <span className="font-semibold" style={{ color: '#FDFCE8' }}>
                            Custom Gift Card
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#E2CEB1' }}>
                          Beautiful gift packaging with personalized message
                        </p>
                      </div>
                    </div>
                    <span className="font-bold" style={{ color: '#C7A07A' }}>
                      +Rs {product.addOns.giftCard.price}
                    </span>
                  </div>
                </div>
              )}

              {/* Custom Name */}
              {product.addOns.customName.available && (
                <div 
                  className="p-4 rounded-lg transition-all"
                  style={{
                    backgroundColor: includeCustomName 
                      ? 'rgba(199, 160, 122, 0.2)' 
                      : 'rgba(22, 48, 43, 0.3)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: includeCustomName 
                      ? '#C7A07A' 
                      : 'rgba(199, 160, 122, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeCustomName}
                        onChange={(e) => setIncludeCustomName(e.target.checked)}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: '#C7A07A' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✍️</span>
                          <span className="font-semibold" style={{ color: '#FDFCE8' }}>
                            Custom Name on Chocolate
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#E2CEB1' }}>
                          Personalize with a special name or message
                        </p>
                      </div>
                    </div>
                    <span className="font-bold" style={{ color: '#C7A07A' }}>
                      +Rs {product.addOns.customName.price}
                    </span>
                  </div>
                  
                  {includeCustomName && (
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter name or message..."
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: 'rgba(22, 48, 43, 0.5)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(199, 160, 122, 0.3)',
                        color: '#FDFCE8'
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div 
              className="p-4 rounded-lg mb-6"
              style={{
                backgroundColor: 'rgba(199, 160, 122, 0.1)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(199, 160, 122, 0.3)'
              }}
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm" style={{ color: '#E2CEB1' }}>
                  <span>Base ({selectedQuantity?.pieces} Pieces):</span>
                  <span>Rs {selectedQuantity?.price}</span>
                </div>
                {includeGiftCard && (
                  <div className="flex justify-between text-sm" style={{ color: '#E2CEB1' }}>
                    <span>Gift Card:</span>
                    <span>Rs {product.addOns.giftCard.price}</span>
                  </div>
                )}
                {includeCustomName && (
                  <div className="flex justify-between text-sm" style={{ color: '#E2CEB1' }}>
                    <span>Custom Name:</span>
                    <span>Rs {product.addOns.customName.price}</span>
                  </div>
                )}
                <div 
                  className="flex justify-between text-lg font-bold pt-2 border-t"
                  style={{ color: '#C7A07A', borderColor: 'rgba(199, 160, 122, 0.3)' }}
                >
                  <span>Total:</span>
                  <span>Rs {calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(199, 160, 122, 0.2)',
                  color: '#FDFCE8',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(199, 160, 122, 0.4)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#C7A07A', color: '#16302B' }}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductOptionsModal;
