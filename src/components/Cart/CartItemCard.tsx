import { CartItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface CartItemCardProps {
  item: CartItem;
  index: number;
}

const CartItemCard = ({ item, index }: CartItemCardProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex gap-4">
        {/* Item Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
          
          {/* Options */}
          {item.selectedOptions && item.selectedOptions.length > 0 && (
            <div className="text-sm text-gray-600 mb-2">
              {item.selectedOptions.map((opt, idx) => (
                <span key={idx}>
                  {opt.optionName}: {opt.choiceLabel}
                  {opt.priceModifier !== 0 && ` (+$${opt.priceModifier})`}
                  {idx < item.selectedOptions!.length - 1 && ' / '}
                </span>
              ))}
            </div>
          )}

          {/* Note */}
          {item.note && (
            <div className="text-sm text-gray-500 mb-2">
              備註: {item.note}
            </div>
          )}

          {/* Price Info */}
          <div className="text-sm text-gray-600">
            單價: ${item.price}
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <span>
                {' '}+ ${item.selectedOptions.reduce((sum, opt) => sum + opt.priceModifier, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={() => removeFromCart(index)}
            className="text-gray-400 hover:text-red-500 text-xl"
            title="移除"
          >
            🗑️
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(index, item.quantity - 1)}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            >
              -
            </button>
            <span className="w-8 text-center font-bold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(index, item.quantity + 1)}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            >
              +
            </button>
          </div>

          <div className="text-xl font-bold text-primary-600">
            ${item.subtotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
