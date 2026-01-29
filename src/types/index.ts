// 分類
export interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

// 選項選擇
export interface OptionChoice {
  id: string;
  label: string;
  priceModifier: number;
}

// 品項選項
export interface ItemOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  choices: OptionChoice[];
}

// 菜單項目
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  options?: ItemOption[];
}

// 已選擇的選項
export interface SelectedOption {
  optionId: string;
  optionName: string;
  choiceId: string;
  choiceLabel: string;
  priceModifier: number;
}

// 購物車項目
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: SelectedOption[];
  subtotal: number;
  note?: string;
}

// 取餐方式
export type PickupMethod = 'delivery' | 'pickup';

// 訂單狀態
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';

// 訂單
export interface Order {
  orderId: string;
  orderTime: string;
  
  // 顧客資訊
  customerName: string;
  customerPhone: string;
  
  // 取餐資訊
  pickupMethod: PickupMethod;
  deliveryAddress?: string;
  scheduledTime?: string;
  
  // 訂單內容
  items: CartItem[];
  totalAmount: number;
  note?: string;
  
  // 訂單狀態
  status: OrderStatus;
}

// 菜單資料結構
export interface MenuData {
  categories: Category[];
  items: MenuItem[];
}
