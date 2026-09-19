import React, { useState } from 'react';
import { Star, ArrowUpRight, Heart, ShoppingBag } from './icons';
import SplitText from './SplitText';
import Balatro from './Balatro';
import CountUp from './CountUp';
import { useAuth } from './AuthContext';
import styles from './dashboard.module.css';
import Image11 from '../Media/11.png';
import Image12 from '../Media/12.png';
import Image13 from '../Media/13.png';
import Image14 from '../Media/14.png';
import OWLogo from '../Media/OW-Logo.png';


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DashboardProps {
  searchQuery: string;
  selectedCategory: string;
  favorites: string[];
  toggleFavorite: (item: string) => void;
  cartItems: CartItem[];
  onAddToCart: (product: CartItem) => void;
  onShowAuthModal: (product: CartItem) => void;
  isInCart: (id: string) => boolean;
}

// ===== 1. HERO SECTION =====
const HeroSection: React.FC = () => (
  <section className={`relative rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 ${styles.heroSection}`}>
    <Balatro
      isRotate={false}
      mouseInteraction={true}
      pixelFilter={700}
    />
    <div className={`absolute inset-0 backdrop-blur-sm ${styles.heroGradient}`}>
    </div>
    <div className={`relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 ${styles.heroContent}`}>
      <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 ${styles.heroBadge}`}>
        <span className={`text-xs sm:text-sm font-semibold tracking-wider ${styles.badgeText}`}>PREMIUM HANDMADE CHOCOLATE GIFTING</span>
      </div>
      <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 ${styles.heroTitle}`}>
        <SplitText
          text="Create Memorable Moments"
          delay={300}
          charDelay={0.05}
        />
      </h1>
      <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 max-w-2xl px-2 ${styles.heroDescription}`}>
        Uniquely crafted handmade chocolates for your special occasions, personalized with custom naming and artistic packaging in Sri Lanka
      </p>
      <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
        <button
          onClick={() => {
            const featuredSection = document.getElementById('featured-collection');
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className={`px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 shadow-lg ${styles.primaryButton}`}
        >
          Shop the Collection
        </button>
        <button className={`px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 ${styles.secondaryButton}`}>
          Discover Luxury
        </button>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 flex-wrap justify-center">
        <div className="text-center">
          <div className={`text-2xl sm:text-3xl font-bold ${styles.statValue}`}>
            <CountUp from={0} to={4} duration={2} separator="," />+
          </div>
          <div className={`text-xs sm:text-sm ${styles.statLabel}`}>Handmade Products</div>
        </div>
        <div className={`w-px h-10 sm:h-12 ${styles.statDivider}`}></div>
        <div className="text-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.productRating}`} fill="currentColor" />
            <span className={`text-2xl sm:text-3xl font-bold ${styles.statValue}`}>
              <CountUp from={0} to={4.9} duration={2} />
            </span>
          </div>
          <div className={`text-xs sm:text-sm ${styles.statLabel}`}>Customer Rating</div>
        </div>
        <div className={`w-px h-10 sm:h-12 ${styles.statDivider}`}></div>
        <div className="text-center">
          <div className={`text-2xl sm:text-3xl font-bold ${styles.statValue}`}>
            <CountUp from={0} to={1} duration={2} />K+
          </div>
          <div className={`text-xs sm:text-sm ${styles.statLabel}`}>Happy Customers</div>
        </div>
      </div>
    </div>
  </section>
);

// ===== 2. PROMOTIONAL BANNER SECTION =====
/*const PromoBanner: React.FC = () => (
  <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(164, 69, 41, 0.3)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <div className="px-8 py-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Star className="w-8 h-8" style={{color: '#C7A07A'}} fill="currentColor"/>
        <h2 className="text-3xl md:text-4xl font-bold" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>Sweet Deals</h2>
        <Star className="w-8 h-8" style={{color: '#C7A07A'}} fill="currentColor"/>
      </div>
      <p className="text-xl mb-6" style={{color: '#E2CEB1'}}>Indulge with 40% - 50% Off Premium Selection</p>
      <button className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg" style={{backgroundColor: '#C7A07A', color: '#16302B'}}>
        Shop the Sale
      </button>
    </div>
  </section>
);*/

// ===== 3. FEATURED PRODUCTS SECTION =====
interface ProductCardProps {
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: () => void;
  onAddToCart: (data: any) => void;
  name: string;
  description: string;
  rating: number;
  image: string;
  quantityOptions: Array<{ pieces: number; price: number }>;
  addOns: {
    giftCard: { available: boolean; price: number };
    customName: { available: boolean; price: number };
  };
  comingSoon: boolean;
}

const FeaturedProductCard: React.FC<ProductCardProps> = ({
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  name,
  description,
  rating,
  image,
  quantityOptions,
  addOns,
  comingSoon
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0]);
  const [includeGiftCard, setIncludeGiftCard] = useState(false);
  const [includeCustomName, setIncludeCustomName] = useState(false);
  const [customName, setCustomName] = useState('');

  const calculateTotal = () => {
    let total = selectedQuantity.price;
    if (includeGiftCard) total += addOns.giftCard.price;
    if (includeCustomName) total += addOns.customName.price;
    return total;
  };

  const handleAddToCart = () => {
    const cartData = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${selectedQuantity.pieces}pcs${includeGiftCard ? '-gift' : ''}${includeCustomName ? '-name' : ''}`,
      productId: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      pieces: selectedQuantity.pieces,
      basePrice: selectedQuantity.price,
      addOns: {
        giftCard: includeGiftCard,
        customName: includeCustomName ? customName : null
      },
      totalPrice: calculateTotal(),
      quantity: 1,
      image: image
    };
    onAddToCart(cartData);
    setIsExpanded(false);
    setIncludeGiftCard(false);
    setIncludeCustomName(false);
    setCustomName('');
    setSelectedQuantity(quantityOptions[0]);
  };

  return (
    <div className={`rounded-lg md:rounded-xl overflow-hidden transition-all ${styles.productCard} ${styles.expandable} ${isExpanded ? styles.productCardExpanded : ''}`}>
      <div className={`relative h-48 sm:h-56 md:h-64 ${styles.productImage}`}>
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        {includeCustomName && customName && isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`px-4 py-2 rounded-lg backdrop-blur-md ${styles.customNameOverlay}`}>
              <p className={`text-xl font-bold text-center ${styles.customNameText}`}>
                {customName}
              </p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={onToggleFavorite}
            className={`backdrop-blur-md p-2.5 rounded-full transition-all hover:scale-110 shadow-lg ${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? styles.favoriteIconActive : styles.favoriteIcon}`} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-base sm:text-lg md:text-xl font-semibold ${styles.productTitle}`}>{name}</h3>
          <div className="flex items-center gap-1">
            <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${styles.productRating}`} fill="currentColor" />
            <span className={`text-xs sm:text-sm font-semibold ${styles.productRating}`}>{rating}</span>
          </div>
        </div>
        <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isExpanded ? '' : 'line-clamp-2'} ${styles.productDescription}`}>{description}</p>

        {!isExpanded ? (
          // Collapsed State
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className={`text-xs ${styles.priceLabel}`}>Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xs sm:text-sm ${styles.priceCurrency}`}>Rs</span>
                  <span className={`text-2xl sm:text-3xl font-bold ${styles.priceAmount}`}>{quantityOptions[0].price}</span>
                </div>
              </div>
              <button
                onClick={() => comingSoon ? null : setIsExpanded(true)}
                disabled={comingSoon}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base ${comingSoon ? styles.selectButtonDisabled : styles.selectButton}`}
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{comingSoon ? 'Coming Soon' : 'Select Options'}</span>
                <span className="sm:hidden">{comingSoon ? 'Soon' : 'Options'}</span>
              </button>
            </div>
          </>
        ) : (
          // Expanded State
          <div className="space-y-3 sm:space-y-4">
            {/* Quantity Selection */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>Select Quantity *</h4>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {quantityOptions.map((option) => (
                  <button
                    key={option.pieces}
                    onClick={() => setSelectedQuantity(option)}
                    className="p-2 rounded-lg transition-all text-center"
                    style={{
                      backgroundColor: selectedQuantity.pieces === option.pieces
                        ? 'rgba(199, 160, 122, 0.3)'
                        : 'rgba(22, 48, 43, 0.5)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: selectedQuantity.pieces === option.pieces
                        ? '#C7A07A'
                        : 'rgba(199, 160, 122, 0.2)'
                    }}
                  >
                    <div className="text-sm font-bold" style={{ color: '#FDFCE8' }}>{option.pieces}pc</div>
                    <div className="text-xs" style={{ color: '#C7A07A' }}>Rs {option.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h4 className={`text-xs sm:text-sm font-semibold mb-2 ${styles.sectionTitle}`}>Add-ons (Optional)</h4>

              {/* Gift Card */}
              <div
                className={`p-2 rounded-md sm:rounded-lg mb-2 cursor-pointer transition-all ${includeGiftCard ? styles.addOnItemSelected : styles.addOnItem}`}
                onClick={() => setIncludeGiftCard(!includeGiftCard)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="checkbox"
                      checked={includeGiftCard}
                      onChange={(e) => setIncludeGiftCard(e.target.checked)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${styles.addOnCheckbox}`}
                      aria-label="Include gift card"
                    />
                    <span className="text-xs" aria-hidden="true">🎁</span>
                    <span className={`text-xs font-semibold ${styles.addOnLabel}`}>Gift Card</span>
                  </div>
                  <span className={`text-xs font-bold ${styles.addOnPrice}`}>+Rs {addOns.giftCard.price}</span>
                </div>
              </div>

              {/* Custom Name */}
              <div className={`p-2 rounded-md sm:rounded-lg transition-all ${includeCustomName ? styles.addOnItemSelected : styles.addOnItem}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="checkbox"
                      checked={includeCustomName}
                      onChange={(e) => setIncludeCustomName(e.target.checked)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${styles.addOnCheckbox}`}
                      aria-label="Include custom name"
                    />
                    <span className="text-xs" aria-hidden="true">✍️</span>
                    <span className={`text-xs font-semibold ${styles.addOnLabel}`}>Custom Name</span>
                  </div>
                  <span className={`text-xs font-bold ${styles.addOnPrice}`}>+Rs {addOns.customName.price}</span>
                </div>
                {includeCustomName && (
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter name..."
                    maxLength={50}
                    className={`w-full px-2 py-1 rounded text-xs outline-none ${styles.addOnInput}`}
                    aria-label="Custom name text"
                  />
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className={`p-2 rounded-md sm:rounded-lg ${styles.priceBreakdown}`}>
              <div className={`flex justify-between text-xs mb-1 ${styles.priceBreakdownItem}`}>
                <span>Base ({selectedQuantity.pieces}pc):</span>
                <span>Rs {selectedQuantity.price}</span>
              </div>
              {includeGiftCard && (
                <div className={`flex justify-between text-xs mb-1 ${styles.priceBreakdownItem}`}>
                  <span>Gift Card:</span>
                  <span>Rs {addOns.giftCard.price}</span>
                </div>
              )}
              {includeCustomName && (
                <div className={`flex justify-between text-xs mb-1 ${styles.priceBreakdownItem}`}>
                  <span>Custom Name:</span>
                  <span>Rs {addOns.customName.price}</span>
                </div>
              )}
              <div className={`flex justify-between text-xs sm:text-sm font-bold pt-1 border-t ${styles.priceBreakdownTotal}`}>
                <span>Total:</span>
                <span>Rs {calculateTotal()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setIncludeGiftCard(false);
                  setIncludeCustomName(false);
                  setCustomName('');
                  setSelectedQuantity(quantityOptions[0]);
                }}
                className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105 ${styles.cancelButton}`}
                aria-label="Cancel and close options"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 ${styles.addToCartButton}`}
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Add to Cart</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeaturedProducts: React.FC<{ favorites: string[], toggleFavorite: (id: string) => void, onAddToCart: (product: any) => void, isInCart: (id: string) => boolean }> = ({ favorites, toggleFavorite, onAddToCart, isInCart }) => {
  const products = [
    {
      id: 'luxury-truffle-box',
      name: 'ChocE NutMelt',
      description: 'ChocE NutMelt blends roasted nuts with rich chocolate to create a smooth, crunchy, irresistible bite.',
      rating: 4.9,

      image: Image11,
      quantityOptions: [
        { pieces: 2, price: 400 },
        { pieces: 4, price: 750 },
        { pieces: 6, price: 1000 }
      ],
      addOns: {
        giftCard: { available: true, price: 350 },
        customName: { available: true, price: 250 }
      },
      comingSoon: false
    },
    {
      id: 'dark-elegance',
      name: 'ChocE Date Bliss',
      description: 'ChocE Date Bliss combines soft, sweet dates with a layer of rich chocolate and a touch of nut crunch.',
      rating: 4.8,

      image: Image12,
      quantityOptions: [
        { pieces: 4, price: 400 },
        { pieces: 6, price: 550 },
        { pieces: 8, price: 700 }
      ],
      addOns: {
        giftCard: { available: true, price: 350 },
        customName: { available: true, price: 250 }
      },
      comingSoon: false
    },
    {
      id: 'golden-praline',
      name: 'ChocE Amour',
      description: 'ChocE Amour is a premium heart-shaped chocolate with a rich nut-filled center, the perfect romantic indulgence.',
      rating: 4.9,

      image: Image13,
      quantityOptions: [
        { pieces: 2, price: 400 },
        { pieces: 4, price: 750 },
        { pieces: 6, price: 1000 }
      ],
      addOns: {
        giftCard: { available: true, price: 350 },
        customName: { available: true, price: 250 }
      },
      comingSoon: false
    },
    {
      id: 'artisan-collection',
      name: 'Coming Soon',
      description: 'Coming Soon',
      rating: 5.0,
      image: Image14,
      quantityOptions: [
        { pieces: 6, price: 500 }
      ],
      addOns: {
        giftCard: { available: true, price: 350 },
        customName: { available: true, price: 250 }
      },
      comingSoon: true
    }
  ];

  return (
    <section id="featured-collection" className="mb-4 md:mb-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 ${styles.featuredSection}`}>Featured Collection</h2>
        <p className={`text-sm sm:text-base md:text-lg px-4 ${styles.featuredSubtitle}`}>Perfectly crafted handmade chocolates for every special celebration</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map(product => (
          <div key={product.id} className="relative">
            {product.comingSoon && (
              <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full backdrop-blur-md ${styles.comingSoonBadge}`}>
                <span className={`text-xs font-bold ${styles.comingSoonText}`}>COMING SOON</span>
              </div>
            )}
            <FeaturedProductCard
              name={product.name}
              description={product.description}
              rating={product.rating}
              image={product.image}
              quantityOptions={product.quantityOptions}
              addOns={product.addOns}
              comingSoon={product.comingSoon}
              isFavorite={favorites.includes(product.id)}
              isInCart={isInCart(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onAddToCart={(data) => onAddToCart(data)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// ===== 4. BRAND STORY SECTION =====
/*const BrandStory: React.FC = () => (
  <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(115, 65, 40, 0.4)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
      <div className="flex flex-col justify-center">
        <div className="inline-block px-4 py-2 rounded-full mb-4 self-start" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
          <span className="text-sm font-semibold tracking-wider" style={{color: '#C7A07A'}}>THE ARTISAN'S TOUCH</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>
          Crafted with Passion & Precision
        </h2>
        <p className="text-base mb-4" style={{color: '#E2CEB1', lineHeight: '1.8'}}>
          Our master chocolatiers craft each artisan chocolate experience with dedication and expertise. Using only the finest premium ingredients sourced from around the world, we create confections that delight the senses and elevate every moment.
        </p>
        <p className="text-base mb-6" style={{color: '#E2CEB1', lineHeight: '1.8'}}>
          From single-origin cocoa beans to hand-selected toppings, every element is carefully chosen to ensure an unforgettable taste experience that embodies luxury and craftsmanship.
        </p>
        <button className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 self-start shadow-lg flex items-center gap-2" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)', color: '#FDFCE8', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)'}}>
          <span>Our Story</span>
          <ArrowUpRight className="w-5 h-5"/>
        </button>
      </div>
      <div className="relative rounded-xl overflow-hidden" style={{minHeight: '300px', backgroundColor: 'rgba(22, 48, 43, 0.5)'}}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">ðŸ«</div>
          <p className="text-sm" style={{color: '#E2CEB1'}}>Artisan Chocolatier at Work</p>
          <p className="text-xs mt-2" style={{color: '#C7A07A'}}>(High-quality image placeholder)</p>
        </div>
      </div>
    </div>
  </section>
);*/

// ===== 5. EMAIL NEWSLETTER SECTION =====
/*const NewsletterSection: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(57, 5, 23, 0.5)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
        <div>
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
            <span className="text-sm font-semibold tracking-wider" style={{color: '#C7A07A'}}>JOIN OUR COMMUNITY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>
            Exclusive Offers & Early Access
          </h2>
          <p className="text-base mb-2" style={{color: '#E2CEB1'}}>
            Be the first to know about new collections and receive <span style={{color: '#C7A07A', fontWeight: 'bold'}}>15% off</span> your first order.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Early access to limited editions</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Exclusive member-only deals</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Seasonal collection previews</span>
            </li>
          </ul>
        </div>
        <div className="backdrop-blur-md rounded-xl p-6" style={{backgroundColor: 'rgba(57, 30, 16, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">âœ“</div>
              <p className="text-xl font-semibold mb-2" style={{color: '#C7A07A'}}>Successfully Subscribed!</p>
              <p className="text-sm" style={{color: '#E2CEB1'}}>Check your email for your welcome offer</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="block text-sm font-semibold mb-2" style={{color: '#FDFCE8'}}>Email Address</label>
              <input 
                type="email" 
                id="newsletter-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg mb-4 outline-none text-sm" 
                style={{backgroundColor: 'rgba(22, 48, 43, 0.5)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)', color: '#FDFCE8'}}
              />
              <button 
                type="submit"
                className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg" 
                style={{backgroundColor: '#C7A07A', color: '#16302B'}}
              >
                Subscribe Now
              </button>
              <p className="text-xs text-center mt-3" style={{color: '#E2CEB1'}}>We respect your privacy. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};*/

// ===== 6. FOOTER SECTION =====
const Footer: React.FC = () => (
  <footer className="rounded-2xl overflow-hidden backdrop-blur-sm mt-8" style={{ backgroundColor: 'rgba(57, 30, 16, 0.9)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)' }}>
    <div className="p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={OWLogo} alt="ChocE Moments" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>ChocE Moments</span>
          </div>
          <p className="text-sm mb-4" style={{ color: '#E2CEB1' }}>Premium handmade chocolate gifting brand creating memorable moments with personalized, artistically packaged chocolates made from organic and local ingredients.</p>
          <div className="space-y-2">
            <a href="tel:0706878899" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#C7A07A' }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>0706878899</span>
            </a>
            <a href="mailto:chocemoments@gmail.com" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#C7A07A' }}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>chocemoments@gmail.com</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{ color: '#FDFCE8' }}>Shop</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>All Chocolates</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Gift Boxes</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Seasonal Collections</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Corporate Gifts</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Best Sellers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{ color: '#FDFCE8' }}>Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Shipping Info</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Returns & Exchanges</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>FAQ</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Contact Us</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Track Order</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{ color: '#FDFCE8' }}>About</h3>
          <ul className="space-y-2 mb-4">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Our Story</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Blog</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Sustainability</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Careers</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/chocemoments?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A' }} title="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61582694976286" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A' }} title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://wa.me/94706878899" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A' }} title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="pt-6" style={{ borderTop: '1px solid rgba(199, 160, 122, 0.2)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: '#E2CEB1' }}>© 2026 ChocE Moments. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Privacy Policy</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Terms of Service</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#E2CEB1' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ===== MAIN DASHBOARD COMPONENT =====
const Dashboard: React.FC<DashboardProps> = ({
  searchQuery,
  selectedCategory,
  favorites,
  toggleFavorite,
  cartItems,
  onAddToCart,
  onShowAuthModal,
  isInCart
}) => {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (cartData: CartItem) => {
    if (!isAuthenticated) {
      onShowAuthModal(cartData);
    } else {
      onAddToCart(cartData);
    }
  };

  return (
    <div className="flex flex-col px-4 py-6">
      <HeroSection />
      <FeaturedProducts
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onAddToCart={handleAddToCart}
        isInCart={isInCart}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;
