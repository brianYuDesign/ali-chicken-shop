import { useCart } from '../../context/CartContext';
import CartItemCard from './CartItemCard';

interface CartProps {
  onGoBack: () => void;
  onCheckout: () => void;
}

const Cart = ({ onGoBack, onCheckout }: CartProps) => {
  const { cartItems, getTotalAmount, getItemCount } = useCart();
  const totalAmount = getTotalAmount();
  const itemCount = getItemCount();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">購物車是空的</h2>
          <p className="text-gray-600 mb-6">快去挑選美味的餐點吧！</p>
          <button onClick={onGoBack} className="btn-primary">
            回到菜單
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <span className="text-xl">←</span>
          <span>繼續點餐</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          購物車 ({itemCount} 項)
        </h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <CartItemCard key={index} item={item} index={index} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg">
            <span className="text-gray-600">商品總計</span>
            <span className="font-semibold">${totalAmount}</span>
          </div>
          
          <div className="border-t pt-4 flex items-center justify-between text-2xl font-bold">
            <span>總金額</span>
            <span className="text-primary-600">${totalAmount}</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full btn-primary text-lg py-3"
          >
            前往結帳
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
