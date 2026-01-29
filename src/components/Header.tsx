import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentPage: 'menu' | 'cart' | 'checkout';
  onNavigate: (page: 'menu' | 'cart' | 'checkout') => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('menu')}
          >
            <div className="text-3xl">🍗</div>
            <div>
              <h1 className="text-2xl font-bold">阿力雞排</h1>
              <p className="text-sm text-primary-100">仁和店 - 線上訂購</p>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">🛒</span>
            <span>購物車</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Store Info */}
        <div className="mt-4 pt-4 border-t border-primary-500 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>新竹縣湖口區仁和路170號</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📞</span>
            <a href="tel:0977411311" className="hover:underline">0977-411-311</a>
          </div>
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span>15:00 - 02:00</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
