import axios from 'axios';
import { Order } from '../types';

// LINE Notify Token (需要從環境變數或設定檔讀取)
const LINE_NOTIFY_TOKEN = import.meta.env.VITE_LINE_NOTIFY_TOKEN || '';

/**
 * 格式化訂單訊息
 */
export const formatOrderMessage = (order: Order): string => {
  const {
    orderId,
    customerName,
    customerPhone,
    pickupMethod,
    deliveryAddress,
    scheduledTime,
    items,
    totalAmount,
    note,
    orderTime,
  } = order;

  // 格式化時間
  const formattedTime = new Date(orderTime).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 建立訊息
  let message = `🔔 新訂單通知 #${orderId}\n\n`;
  
  message += `👤 顧客資訊\n`;
  message += `姓名：${customerName}\n`;
  message += `電話：${customerPhone}\n\n`;
  
  message += `📦 取餐方式：${pickupMethod === 'delivery' ? '外送' : '自取'}\n`;
  
  if (pickupMethod === 'delivery' && deliveryAddress) {
    message += `📍 地址：${deliveryAddress}\n`;
  }
  
  if (scheduledTime) {
    message += `⏰ 預計時間：${scheduledTime}\n`;
  }
  
  message += `\n🛒 訂單內容\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x${item.quantity}`;
    
    // 加入選項資訊
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      const optionsText = item.selectedOptions.map(opt => opt.choiceLabel).join('/');
      message += ` (${optionsText})`;
    }
    
    message += ` - $${item.subtotal}\n`;
    
    if (item.note) {
      message += `   備註：${item.note}\n`;
    }
  });
  
  message += `\n💰 總金額：$${totalAmount}\n`;
  
  if (note) {
    message += `\n📝 備註：${note}\n`;
  }
  
  message += `\n---\n下單時間：${formattedTime}`;
  
  return message;
};

/**
 * 發送 LINE Notify 通知
 */
export const sendLineNotify = async (order: Order): Promise<boolean> => {
  if (!LINE_NOTIFY_TOKEN) {
    console.error('LINE Notify Token 未設定');
    return false;
  }

  try {
    const message = formatOrderMessage(order);
    
    const response = await axios.post(
      'https://notify-api.line.me/api/notify',
      new URLSearchParams({ message }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('發送 LINE 通知失敗:', error);
    return false;
  }
};

/**
 * 生成訂單編號
 */
export const generateOrderId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.getTime().toString().slice(-6);
  return `ORDER-${dateStr}-${timeStr}`;
};
