# 阿力雞排訂購系統 - 設定指南

## 快速開始（5 分鐘上手）

### 步驟 1: 安裝 Node.js

如果還沒有安裝 Node.js：

1. 前往 https://nodejs.org/
2. 下載 LTS 版本（推薦）
3. 安裝完成後，開啟終端機輸入以下指令確認：

\`\`\`bash
node --version
npm --version
\`\`\`

### 步驟 2: 下載專案並安裝

\`\`\`bash
# 進入專案資料夾
cd a-li-gee-project

# 安裝所有依賴
npm install
\`\`\`

### 步驟 3: 設定 LINE Notify（重要！）

#### 3-1. 申請 LINE Notify Token

1. 用手機或電腦打開 https://notify-bot.line.me/my/
2. 使用 LINE 帳號登入
3. 點擊「發行權杖」按鈕
4. 填寫資訊：
   - 權杖名稱：阿力雞排訂單通知（或任何你想要的名稱）
   - 選擇聊天室：
     - **建議：建立一個專門的 LINE 群組「阿力雞排訂單」**
     - 將收銀台的人員加入群組
     - 選擇這個群組接收通知
5. 點擊「發行」
6. **重要：複製產生的 Token（只會顯示一次！）**

#### 3-2. 設定環境變數

在專案根目錄建立 \`.env\` 檔案：

\`\`\`bash
# Windows
copy env.example .env

# Mac/Linux
cp env.example .env
\`\`\`

編輯 \`.env\` 檔案，貼上你的 Token：

\`\`\`
VITE_LINE_NOTIFY_TOKEN=你剛才複製的Token
\`\`\`

### 步驟 4: 啟動專案

\`\`\`bash
npm run dev
\`\`\`

看到以下訊息表示成功：

\`\`\`
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
\`\`\`

在瀏覽器開啟 http://localhost:3000 就可以看到網站了！

### 步驟 5: 測試訂單功能

1. 瀏覽菜單，選擇餐點
2. 加入購物車
3. 填寫訂單資訊
4. 送出訂單
5. 檢查你的 LINE 群組是否收到通知！

## 修改菜單

### 方法一：直接編輯 JSON 檔案

打開 \`src/data/menu.json\`，直接修改菜單內容。

**新增餐點範例：**

\`\`\`json
{
  "id": "spicy-chicken-wings",
  "categoryId": "fried-chicken",
  "name": "香辣雞翅",
  "description": "超辣超過癮",
  "price": 60,
  "available": true,
  "options": [
    {
      "id": "spicy-level",
      "name": "辣度",
      "type": "single",
      "required": true,
      "choices": [
        { "id": "medium", "label": "中辣", "priceModifier": 0 },
        { "id": "hot", "label": "大辣", "priceModifier": 0 },
        { "id": "super-hot", "label": "特辣", "priceModifier": 0 }
      ]
    }
  ]
}
\`\`\`

### 方法二：新增分類

在 \`categories\` 陣列中新增：

\`\`\`json
{
  "id": "combo-meals",
  "name": "套餐組合",
  "displayOrder": 4
}
\`\`\`

然後在 \`items\` 中新增屬於這個分類的餐點，設定 \`categoryId: "combo-meals"\`

## 部署到網路上

### 使用 Vercel（免費、最簡單）

1. 將專案上傳到 GitHub：
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   \`\`\`

2. 前往 https://vercel.com 註冊/登入

3. 點擊「New Project」

4. Import 你的 GitHub 倉庫

5. 在「Environment Variables」設定：
   - Name: \`VITE_LINE_NOTIFY_TOKEN\`
   - Value: 你的 LINE Notify Token

6. 點擊「Deploy」

7. 等待部署完成，會得到一個網址如：\`https://your-project.vercel.app\`

8. 測試網站功能是否正常！

### 使用 Netlify（另一個免費選項）

步驟類似 Vercel，差異在於：

- Build command: \`npm run build\`
- Publish directory: \`dist\`

## 常見問題

### Q1: 啟動時出現錯誤

**錯誤訊息：\`command not found: npm\`**
- 解決：需要先安裝 Node.js

**錯誤訊息：\`Cannot find module\`**
- 解決：執行 \`npm install\` 安裝依賴

### Q2: LINE 沒有收到通知

**檢查清單：**

1. 確認 \`.env\` 檔案中的 Token 正確
2. 確認 Token 沒有過期（可以重新申請）
3. 檢查瀏覽器的 Console（F12）是否有錯誤訊息
4. 確認網路連線正常

### Q3: 部署後 LINE 通知不工作

**原因：** Vercel/Netlify 等平台需要在後台設定環境變數

**解決：**
1. 進入專案設定（Settings）
2. 找到 Environment Variables
3. 新增 \`VITE_LINE_NOTIFY_TOKEN\`
4. 重新部署

### Q4: 想要關閉某個餐點

在 \`menu.json\` 中將該餐點的 \`available\` 改為 \`false\`：

\`\`\`json
{
  "id": "chicken-steak-large",
  "available": false,
  ...
}
\`\`\`

### Q5: 如何修改店家資訊

編輯 \`src/components/Header.tsx\`，找到以下區塊：

\`\`\`tsx
<div className="flex items-center gap-2">
  <span>📍</span>
  <span>新竹縣湖口區仁和路170號</span>
</div>
\`\`\`

修改為你的實際資訊。

## 進階功能

### 新增圖片

1. 將圖片放在 \`public/images/\` 資料夾
2. 在 \`menu.json\` 中設定：
   \`\`\`json
   {
     "image": "/images/chicken-steak.jpg",
     ...
   }
   \`\`\`

### 自訂顏色主題

編輯 \`tailwind.config.js\`：

\`\`\`js
colors: {
  primary: {
    500: '#f97316',  // 主色調
    600: '#ea580c',  // 較深
    ...
  }
}
\`\`\`

### 加入 Google Analytics

在 \`index.html\` 的 \`<head>\` 中加入 GA 追蹤碼。

## 需要協助？

如果遇到問題：

1. 檢查瀏覽器 Console (F12)
2. 檢查終端機的錯誤訊息
3. 重新執行 \`npm install\`
4. 重新啟動開發伺服器

## 備份與恢復

### 備份菜單

定期複製 \`src/data/menu.json\` 檔案到安全的地方。

### 恢復菜單

將備份的 \`menu.json\` 覆蓋回 \`src/data/menu.json\`。
