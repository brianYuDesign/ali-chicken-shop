/**
 * 訂單相關工具函數
 */

/**
 * 生成訂單編號
 */
export const generateOrderId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.getTime().toString().slice(-6);
  return `ORDER-${dateStr}-${timeStr}`;
};
