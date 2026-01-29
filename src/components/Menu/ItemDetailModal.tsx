import { useState } from 'react';
import { MenuItem, CartItem, SelectedOption } from '../../types';
import { useCart } from '../../context/CartContext';

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: () => void;
}

const ItemDetailModal = ({ item, onClose, onAddToCart }: ItemDetailModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [note, setNote] = useState('');

  // 處理選項變更
  const handleOptionChange = (
    optionId: string,
    optionName: string,
    choiceId: string,
    choiceLabel: string,
    priceModifier: number
  ) => {
    setSelectedOptions(prev => {
      // 移除相同 optionId 的舊選項（單選）
      const filtered = prev.filter(opt => opt.optionId !== optionId);
      // 加入新選項
      return [...filtered, { optionId, optionName, choiceId, choiceLabel, priceModifier }];
    });
  };

  // 計算總價
  const calculateTotal = () => {
    const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.priceModifier, 0);
    return (item.price + optionsTotal) * quantity;
  };

  // 檢查是否可以加入購物車（必填選項都已選擇）
  const canAddToCart = () => {
    if (!item.options) return true;
    
    const requiredOptions = item.options.filter(opt => opt.required);
    const selectedOptionIds = selectedOptions.map(opt => opt.optionId);
    
    return requiredOptions.every(opt => selectedOptionIds.includes(opt.id));
  };

  // 加入購物車
  const handleAddToCart = () => {
    if (!canAddToCart()) return;

    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      subtotal: calculateTotal(),
      note: note.trim() || undefined,
    };

    addToCart(cartItem);
    onAddToCart();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Image */}
          <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center text-8xl">
            {item.categoryId === 'fried-chicken' && '🍗'}
            {item.categoryId === 'side-dishes' && '🍟'}
            {item.categoryId === 'beverages' && '🥤'}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-gray-600">{item.description}</p>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-primary-600">
            ${item.price}
          </div>

          {/* Options */}
          {item.options && item.options.map(option => (
            <div key={option.id} className="space-y-2">
              <label className="block font-semibold text-gray-800">
                {option.name}
                {option.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {option.choices.map(choice => {
                  const isSelected = selectedOptions.some(
                    opt => opt.optionId === option.id && opt.choiceId === choice.id
                  );

                  return (
                    <label
                      key={choice.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={option.id}
                          checked={isSelected}
                          onChange={() =>
                            handleOptionChange(
                              option.id,
                              option.name,
                              choice.id,
                              choice.label,
                              choice.priceModifier
                            )
                          }
                          className="w-4 h-4 text-primary-600"
                        />
                        <span>{choice.label}</span>
                      </div>
                      {choice.priceModifier !== 0 && (
                        <span className="text-sm text-gray-600">
                          {choice.priceModifier > 0 ? '+' : ''}${choice.priceModifier}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Note */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-800">備註</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：不要蔥、少鹽..."
              className="input-field resize-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-800">數量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-xl"
              >
                -
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">小計</div>
            <div className="text-2xl font-bold text-primary-600">
              ${calculateTotal()}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart()}
            className="btn-primary"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
