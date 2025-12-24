# Chinghua Ivy Lu Website

一個基於 Next.js 的旅行網站。

## 技術棧

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Leaflet (地圖功能)
- Yarn

## 開始使用

### 安裝依賴

```bash
yarn install
```

### 開發模式

```bash
yarn dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看結果。

### 構建生產版本

```bash
yarn build
yarn start
```

## 專案結構

```
chinghua-ivy-lu-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   ├── Travelogues/       # 遊記頁面
│   └── map/               # 地圖頁面
├── components/            # React 組件
│   ├── Navigation.tsx     # 導航選單
│   ├── Hero.tsx           # Hero 區塊
│   ├── TravelogueList.tsx # 遊記列表
│   ├── TravelogueCard.tsx # 遊記卡片
│   └── TravelMap.tsx      # 地圖組件
├── lib/                   # 工具函數和數據
│   └── data.ts            # 遊記和地圖數據
└── public/                # 靜態資源
```

## 功能

- ✅ 響應式導航選單
- ✅ Hero 區塊
- ✅ 遊記列表展示
- ✅ 地圖功能（使用 React Leaflet）
- ✅ 響應式設計
- ✅ 現代化 UI 設計

## 自定義

您可以在 `lib/data.ts` 中修改遊記數據和地圖標記點。
