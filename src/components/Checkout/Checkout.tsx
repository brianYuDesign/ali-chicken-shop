import { useState, FormEvent } from 'react';
import { useCart } from '../../context/CartContext';
import { Order, PickupMethod } from '../../types';
import { generateOrderId } from '../../utils/orderUtils';

interface CheckoutProps {
  onGoBack: () => void;
  onOrderComplete: () => void;
}

const Checkout = ({ onGoBack, onOrderComplete }: CheckoutProps) => {
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [note, setNote] = useState('');

  const totalAmount = getTotalAmount();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 建立訂單物件
      const order: Order = {
        orderId: generateOrderId(),
        orderTime: new Date().toISOString(),
        customerName,
        customerPhone,
        pickupMethod,
        deliveryAddress: pickupMethod === 'delivery' ? deliveryAddress : undefined,
        scheduledTime: scheduledTime || undefined,
        items: cartItems,
        totalAmount,
        note: note.trim() || undefined,
        status: 'pending',
      };

      // 呼叫後端 API 發送訂單
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const result = await response.json();

      if (result.success) {
        // 清空購物車
        clearCart();
        // 完成訂單
        onOrderComplete();
      } else {
        alert('訂單送出失敗，請稍後再試或直接致電：0977-411-311');
      }
    } catch (error) {
      console.error('訂單處理錯誤:', error);
      alert('發生錯誤，請直接致電訂購：0977-411-311');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onGoBack}
          className="text-gray-600 hover:text-gray-800 text-xl"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800">填寫訂單資訊</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">顧客資訊</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="input-field"
              placeholder="請輸入您的姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              聯絡電話 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="input-field"
              placeholder="例如：0912-345-678"
            />
          </div>
        </div>

        {/* Pickup Method */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">取餐方式</h2>

          <div className="grid grid-cols-2 gap-4">
            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                pickupMethod === 'pickup'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                value="pickup"
                checked={pickupMethod === 'pickup'}
                onChange={(e) => setPickupMethod(e.target.value as PickupMethod)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-4xl mb-2">🏃</div>
                <div className="font-semibold">自取</div>
              </div>
            </label>

            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                pickupMethod === 'delivery'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                value="delivery"
                checked={pickupMethod === 'delivery'}
                onChange={(e) => setPickupMethod(e.target.value as PickupMethod)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-4xl mb-2">🛵</div>
                <div className="font-semibold">外送</div>
              </div>
            </label>
          </div>

          {pickupMethod === 'delivery' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                外送地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required={pickupMethod === 'delivery'}
                className="input-field"
                placeholder="請輸入完整地址"
              />
              <p className="text-sm text-gray-500 mt-2">
                ℹ️ 3公里內，滿400元可外送
              </p>
            </div>
          )}
        </div>

        {/* Pickup Time */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">取餐時間</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              預計取餐時間（選填）
            </label>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="input-field"
              placeholder="例如：今日 18:30 或 立即取餐"
            />
            <p className="text-sm text-gray-500 mt-2">
              ℹ️ 不填寫則預設為立即製作（約20-30分鐘）
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">備註</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              其他需求（選填）
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="例如：不要辣、多給醬料、餐具需求等..."
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">訂單摘要</h2>

          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <span className="text-gray-500">
                      {' '}({item.selectedOptions.map(opt => opt.choiceLabel).join('/')})
                    </span>
                  )}
                </span>
                <span className="font-semibold">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center text-2xl font-bold">
            <span>總金額</span>
            <span className="text-primary-600">${totalAmount}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-lg py-4"
        >
          {isSubmitting ? '送出中...' : '確認送出訂單'}
        </button>

        <p className="text-center text-sm text-gray-500">
          送出訂單後，我們會透過 LINE 收到您的訂單通知<br />
          如有問題請致電：0977-411-311
        </p>
      </form>
    </div>
  );
};

export default Checkout;
