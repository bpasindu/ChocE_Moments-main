import React from 'react';
import { ModeraLogo, Search, AppGrid, Heart, ShoppingBag } from './icons';
import { useAuth } from './AuthContext';
import Logo from '../Media/OW-Logo.png';


interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  favoritesCount: number;
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  favoritesCount,
  cartCount,
  onCartClick,
  onLoginClick,
  onAdminClick,
  onHomeClick
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = React.useState(false);
  const [showCartPanel, setShowCartPanel] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const categories = ["Truffles", "Dark Chocolate", "Milk Chocolate", "Gift Boxes", "Bars", "Seasonal"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <header className="relative z-50 flex items-center justify-between text-neutral-300 px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3" style={{ flexShrink: 0 }}>
      <button
        onClick={onHomeClick}
        className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 hover:scale-105 transition-transform"
        style={{ backgroundColor: 'rgba(57, 30, 16, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)' }}
      >
        <img src={Logo} alt="ChocE Moments" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
        <span className="font-semibold text-xs sm:text-sm" style={{ color: '#FDFCE8' }}>ChocE Moments</span>
      </button>
      <div className="flex flex-1 mx-2 sm:mx-4 md:mx-6 lg:mx-8 justify-center">
        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#C7A07A' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chocolates..."
            className="backdrop-blur-sm rounded-full w-full h-9 sm:h-10 md:h-11 pl-10 sm:pl-12 pr-4 outline-none text-xs sm:text-sm md:text-base"
            style={{ backgroundColor: 'rgba(115, 65, 40, 0.4)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)', color: '#FDFCE8' }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
        {user?.role === 'admin' && (
          <button
            onClick={onAdminClick}
            className="hidden sm:block px-3 py-1.5 rounded-full text-xs font-bold border border-[#C7A07A] text-[#C7A07A] hover:bg-[#C7A07A] hover:text-[#16302B] transition-colors"
          >
            ADMIN DASHBOARD
          </button>
        )}
        <button
          className="backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full"
          style={{ backgroundColor: 'rgba(115, 65, 40, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)' }}
          title="Grid View"
        >
          <AppGrid className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E2CEB1' }} />
        </button>
        <button
          onClick={() => setShowFavoritesPanel(!showFavoritesPanel)}
          className="relative backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(164, 69, 41, 0.4)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(164, 69, 41, 0.5)' }}
          title="Favorites"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#A44529' }} fill="currentColor" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[8px] sm:text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#A44529', color: '#FDFCE8' }}>
              {favoritesCount}
            </span>
          )}
        </button>
        <button
          onClick={onCartClick}
          className="relative backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(115, 65, 40, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)' }}
          title="Shopping Cart"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#C7A07A' }} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[8px] sm:text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#C7A07A', color: '#16302B' }}>
              {cartCount}
            </span>
          )}
        </button>
        {isAuthenticated ? (
          <div className="flex relative items-center gap-2 sm:gap-2.5 backdrop-blur-sm rounded-full pl-2 sm:pl-3 md:pl-4 pr-1 sm:pr-1.5 md:pr-2 py-1 sm:py-1.5 md:py-2" style={{ backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)' }}>
            <span className="hidden sm:inline text-xs sm:text-sm font-medium" style={{ color: '#FDFCE8' }}>{user?.name || 'User'}</span>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="relative">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#C7A07A', color: '#16302B' }}>
                {user?.name?.[0] || 'U'}
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-2xl py-2 z-[9999]" style={{ backgroundColor: 'rgba(57, 30, 16, 0.98)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)' }}>
                <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(199, 160, 122, 0.2)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#FDFCE8' }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: '#E2CEB1' }}>{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-all"
                  style={{ color: '#E2CEB1', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(199, 160, 122, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#C7A07A', color: '#16302B' }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;