# 阿力雞排線上訂購系統

## 專案簡介

這是為阿力雞排（仁和店）打造的線上訂購系統，讓顧客可以透過網頁瀏覽菜單、加入購物車並完成訂單。訂單送出後會自動透過 LINE Notify 通知商家。

## 功能特色

- 📱 響應式設計，支援手機、平板、電腦
- 🍗 完整菜單展示，支援分類篩選
- 🛒 購物車功能，即時計算金額
- ⚙️ 客製化選項（辣度、甜度、冰塊等）
- 📝 訂單備註與單品備註
- 🚚 外送/自取選擇
- 💬 LINE Notify 即時通知商家
- 💾 購物車資料本地儲存（避免重新整理遺失）

## 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **狀態管理**: React Context API
- **通知**: LINE Notify API

## 開始使用

### 1. 安裝依賴

\`\`\`bash
npm install
\`\`\`

### 2. 設定 LINE Notify Token

1. 前往 [LINE Notify](https://notify-bot.line.me/my/) 申請 Token
2. 建立 \`.env\` 檔案（參考 \`env.example\`）
3. 填入 Token：

\`\`\`
VITE_LINE_NOTIFY_TOKEN=your_line_notify_token_here
\`\`\`

**如何取得 LINE Notify Token：**

1. 訪問 https://notify-bot.line.me/my/
2. 登入 LINE 帳號
3. 點擊「發行權杖」
4. 選擇要接收通知的聊天室（建議建立專用群組）
5. 複製產生的 Token

### 3. 啟動開發伺服器

\`\`\`bash
npm run dev
\`\`\`

專案將在 http://localhost:3000 啟動

### 4. 建置生產版本

\`\`\`bash
npm run build
\`\`\`

建置產物會在 \`dist/\` 資料夾中

## 專案結構

\`\`\`
a-li-gee-project/
├── src/
│   ├── components/        # React 元件
│   │   ├── Menu/         # 菜單相關元件
│   │   ├── Cart/         # 購物車元件
│   │   └── Checkout/     # 結帳流程元件
│   ├── context/
│   │   └── CartContext.tsx  # 購物車狀態管理
│   ├── data/
│   │   └── menu.json     # 菜單資料
│   ├── types/
│   │   └── index.ts      # TypeScript 型別定義
│   ├── utils/
│   │   └── lineNotify.ts # LINE Notify 整合
│   ├── App.tsx           # 主應用程式
│   ├── main.tsx          # 入口檔案
│   └── index.css         # 全域樣式
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## 菜單管理

菜單資料存放在 \`src/data/menu.json\`，您可以直接編輯此檔案來：

- 新增/移除餐點
- 修改價格
- 調整分類
- 設定餐點選項（辣度、甜度等）

格式範例：

\`\`\`json
{
  "id": "chicken-steak-large",
  "categoryId": "fried-chicken",
  "name": "大雞排",
  "description": "酥脆外皮，多汁肉質",
  "price": 65,
  "available": true,
  "options": [
    {
      "id": "spicy-level",
      "name": "辣度",
      "type": "single",
      "required": true,
      "choices": [
        { "id": "no-spicy", "label": "不辣", "priceModifier": 0 },
        { "id": "mild", "label": "微辣", "priceModifier": 0 }
      ]
    }
  ]
}
\`\`\`

## 部署

### Vercel（推薦）

1. 將專案推送到 GitHub
2. 前往 [Vercel](https://vercel.com)
3. Import 專案
4. 設定環境變數：\`VITE_LINE_NOTIFY_TOKEN\`
5. 部署完成！

### Netlify

1. 將專案推送到 GitHub
2. 前往 [Netlify](https://netlify.com)
3. 連結 GitHub 倉庫
4. Build command: \`npm run build\`
5. Publish directory: \`dist\`
6. 設定環境變數：\`VITE_LINE_NOTIFY_TOKEN\`
7. 部署完成！

## LINE Notify 訊息格式

顧客下單後，商家會收到以下格式的 LINE 通知：

\`\`\`
🔔 新訂單通知 #ORDER-20260129-001

👤 顧客資訊
姓名：王小明
電話：0912-345-678

📦 取餐方式：外送
📍 地址：新竹縣湖口區仁和路170號
⏰ 預計時間：今日 18:30

🛒 訂單內容
1. 大雞排 x1 (微辣) - $65
2. 薯條 x1 (起司) - $50
3. 紅茶(大) x1 (半糖/少冰) - $25

💰 總金額：$140

📝 備註：不要蔥

---
下單時間：2026-01-29 17:45
\`\`\`

## 注意事項

1. **LINE Notify Token 安全性**：
   - 不要將 Token 提交到公開的 Git 倉庫
   - 使用環境變數管理 Token
   - 定期更換 Token

2. **CORS 問題**：
   - LINE Notify API 可能遇到 CORS 限制
   - 如果遇到問題，可以考慮加入簡易後端（Node.js + Express）
   - 或使用 Vercel/Netlify 的 Serverless Functions

3. **菜單更新**：
   - 目前菜單是靜態 JSON 檔案
   - 如需動態管理，可以整合後端 API 或 CMS

## 未來擴充建議

- [ ] 加入訂單編號查詢功能
- [ ] 整合 LINE Bot 雙向互動
- [ ] 建立後台管理系統
- [ ] 加入線上金流（信用卡、行動支付）
- [ ] 會員系統與點數累積
- [ ] 訂單歷史記錄
- [ ] 推播通知訂單狀態更新

## 授權

此專案為阿力雞排專用訂購系統

## 聯絡方式

如有問題或建議，歡迎聯繫：

- 商家電話：0977-411-311 / (03)598-0169
- 地址：新竹縣湖口區仁和路170號
- 營業時間：15:00 - 02:00（每日）
