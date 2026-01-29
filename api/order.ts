/**
 * Vercel Serverless Function - 處理訂單並發送 LINE Messaging API 通知
 * 
 * 路徑：/api/order
 * 方法：POST
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// LINE Messaging API 設定
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const STORE_LINE_USER_ID = process.env.STORE_LINE_USER_ID || '';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  selectedOptions?: Array<{
    optionName: string;
    choiceLabel: string;
    priceModifier: number;
  }>;
  note?: string;
}

interface OrderRequest {
  orderId: string;
  orderTime: string;
  customerName: string;
  customerPhone: string;
  pickupMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  scheduledTime?: string;
  items: OrderItem[];
  totalAmount: number;
  note?: string;
}

/**
 * 建立 LINE Flex Message（結構化訂單通知）
 */
function createFlexMessage(order: OrderRequest) {
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
  } = order;

  // 格式化訂單項目
  const itemsContent = items.map((item) => {
    const optionsText = item.selectedOptions
      ? ` (${item.selectedOptions.map((opt) => opt.choiceLabel).join('/')})`
      : '';
    
    return {
      type: 'box',
      layout: 'baseline',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: `${item.name}${optionsText}`,
          color: '#666666',
          size: 'sm',
          flex: 3,
          wrap: true,
        },
        {
          type: 'text',
          text: `x${item.quantity}`,
          color: '#666666',
          size: 'sm',
          flex: 1,
        },
        {
          type: 'text',
          text: `$${item.subtotal}`,
          color: '#666666',
          size: 'sm',
          flex: 2,
          align: 'end',
        },
      ],
    };
  });

  // 建立 Flex Message
  return {
    type: 'flex',
    altText: `新訂單通知 #${orderId}`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🍗 新訂單通知',
            weight: 'bold',
            size: 'xl',
            color: '#ffffff',
          },
          {
            type: 'text',
            text: `#${orderId}`,
            size: 'xs',
            color: '#ffffff',
            margin: 'md',
          },
        ],
        backgroundColor: '#FF6B35',
        paddingAll: '20px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          // 客戶資訊
          {
            type: 'text',
            text: '👤 客戶資訊',
            weight: 'bold',
            size: 'md',
            margin: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '姓名',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: customerName,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '電話',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: customerPhone,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
            ],
          },
          // 取餐方式
          {
            type: 'separator',
            margin: 'xl',
          },
          {
            type: 'text',
            text: `📦 取餐方式：${pickupMethod === 'delivery' ? '🛵 外送' : '🏃 自取'}`,
            weight: 'bold',
            size: 'md',
            margin: 'xl',
          },
          ...(pickupMethod === 'delivery' && deliveryAddress
            ? [
                {
                  type: 'text',
                  text: `📍 ${deliveryAddress}`,
                  size: 'sm',
                  color: '#666666',
                  margin: 'md',
                  wrap: true,
                },
              ]
            : []),
          ...(scheduledTime
            ? [
                {
                  type: 'text',
                  text: `⏰ ${scheduledTime}`,
                  size: 'sm',
                  color: '#666666',
                  margin: 'md',
                },
              ]
            : []),
          // 訂單明細
          {
            type: 'separator',
            margin: 'xl',
          },
          {
            type: 'text',
            text: '🛒 訂單內容',
            weight: 'bold',
            size: 'md',
            margin: 'xl',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: itemsContent,
          },
          // 總金額
          {
            type: 'separator',
            margin: 'xl',
          },
          {
            type: 'box',
            layout: 'baseline',
            margin: 'xl',
            contents: [
              {
                type: 'text',
                text: '總金額',
                weight: 'bold',
                size: 'md',
                flex: 3,
              },
              {
                type: 'text',
                text: `$${totalAmount}`,
                wrap: true,
                weight: 'bold',
                size: 'xl',
                flex: 2,
                align: 'end',
                color: '#FF6B35',
              },
            ],
          },
          // 備註
          ...(note
            ? [
                {
                  type: 'separator',
                  margin: 'xl',
                },
                {
                  type: 'text',
                  text: '📝 備註',
                  weight: 'bold',
                  size: 'sm',
                  margin: 'xl',
                },
                {
                  type: 'text',
                  text: note,
                  size: 'sm',
                  color: '#666666',
                  margin: 'md',
                  wrap: true,
                },
              ]
            : []),
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: new Date(order.orderTime).toLocaleString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            size: 'xs',
            color: '#aaaaaa',
            align: 'center',
          },
        ],
      },
    },
  };
}

/**
 * 發送 LINE Messaging API 訊息
 */
async function sendLineMessage(order: OrderRequest): Promise<boolean> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN 未設定');
    return false;
  }

  if (!STORE_LINE_USER_ID) {
    console.error('STORE_LINE_USER_ID 未設定');
    return false;
  }

  try {
    const flexMessage = createFlexMessage(order);

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: STORE_LINE_USER_ID,
        messages: [flexMessage],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LINE API 錯誤:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('發送 LINE 訊息失敗:', error);
    return false;
  }
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS 設定（允許前端呼叫）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 處理 CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const order: OrderRequest = req.body;

    // 驗證必要欄位
    if (!order.orderId || !order.customerName || !order.customerPhone) {
      return res.status(400).json({
        success: false,
        error: '缺少必要訂單資訊',
      });
    }

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '訂單內容不能為空',
      });
    }

    // 發送 LINE 通知
    const success = await sendLineMessage(order);

    if (success) {
      return res.status(200).json({
        success: true,
        message: '訂單已送出，店家已收到通知',
        orderId: order.orderId,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'LINE 通知發送失敗',
      });
    }
  } catch (error) {
    console.error('處理訂單錯誤:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤',
    });
  }
}
