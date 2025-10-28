# AI Survey Frontend

AI Survey Frontend 是一個以 Vite + React + TypeScript 打造的問卷調查前端應用，內建 ECharts 可視化與 MSW 模擬 API。專案支援在開發階段以 Mock 服務回應，或透過 `.env` 指定實際後端服務。

## 環境需求
- Node.js 18+
- npm 9+

## 安裝
```bash
npm install
```

## 開發模式
未設定 `VITE_API_BASE_URL` 時，`npm run dev` 會啟動 MSW Service Worker 以提供模擬 API：
```bash
npm run dev
```
啟動後，可透過以下路由進行開發：
- `http://localhost:5173/dashboard`：儀表板
- `http://localhost:5173/survey/1`：問卷填寫

若需要改用真實後端，請參考[切換至真實 API](#切換至真實-api)。

## 建置
```bash
npm run build
```
命令將輸出至 `dist/` 目錄，供後續部署使用。

## 本地預覽
```bash
npm run preview
```
該指令會以生產組態啟動本地伺服器，預覽 `dist/` 內容。

## 部署至純靜態伺服器
1. 執行 `npm run build` 產生 `dist/`。
2. 將 `dist/` 目錄內容上傳至任一支援靜態資源的伺服器（如 Vercel、Netlify、GitHub Pages）。
3. 若部署環境提供自訂環境變數，請設定 `VITE_API_BASE_URL` 以連線至真實 API；未設定時將自動使用 MSW 模擬。

## 切換至真實 API
1. 在專案根目錄建立 `.env` 檔案。
2. 參考 `.env.example` 並設定：
   ```dotenv
   VITE_API_BASE_URL=http://localhost:5080
   ```
3. 重新啟動開發或預覽伺服器。當 `VITE_API_BASE_URL` 存在時，前端將直接呼叫該路徑，並停用 MSW 模擬 API。

## 專案結構
```
ai-survey-frontend/
├── public/
│   └── mock-data/
│       ├── dashboard.json
│       └── survey-1.json
├── src/
│   ├── components/
│   ├── lib/
│   ├── mocks/
│   ├── pages/
│   ├── styles.css
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
└── package.json
```

## 主要功能
- 問卷填寫頁：支援單選、多選、文字、Likert 題型。
- 儀表板：顯示回收率、樣本數、情緒平均、主題排行與近七日趨勢。
- API 抽象層：自動判斷是否使用 MSW 模擬或指定後端。

## 開發指南
- 所有類型與資料結構請參考 `src/lib/types.ts`。
- 需要新增模擬資料時，可於 `public/mock-data/` 下擴充。
- 若新增 API 端點，請同步更新 `src/mocks/handlers.ts` 以保持模擬環境一致。
