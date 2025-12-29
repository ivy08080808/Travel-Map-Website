# Chinghua Ivy Lu Website

一個基於 Next.js 的旅行網站，展示旅行遊記、日常生活記錄和互動式地圖。

## 技術棧

### 前端框架
- **Next.js 14+** (App Router) - React 全棧框架，提供服務器端渲染和靜態生成
- **React 18.3** - 用戶界面庫
- **TypeScript 5.5** - 類型安全的 JavaScript 超集

### 樣式與 UI
- **Tailwind CSS 3.4** - 實用優先的 CSS 框架
- **@tailwindcss/typography** - 優雅的排版插件

### 地圖功能
- **React Leaflet 4.2** - React 版本的 Leaflet 地圖庫
- **Leaflet 1.9** - 開源互動式地圖 JavaScript 庫

### 數據庫
- **MongoDB 7.0** - NoSQL 文檔數據庫，用於存儲遊記、留言和日常生活記錄

### 圖片管理
- **Cloudinary 2.8** - 雲端圖片管理與優化服務
- **next-cloudinary 6.17** - Next.js 專用的 Cloudinary 集成
- **browser-image-compression 2.0** - 客戶端圖片壓縮工具

### 富文本編輯
- **React Quill 2.0** - 基於 Quill 的 React 富文本編輯器組件
- **Quill 2.0** - 現代化的富文本編輯器

### 工具庫
- **UUID 13.0** - 生成唯一標識符

### 開發工具
- **ESLint** - 代碼質量檢查
- **PostCSS** - CSS 後處理器
- **Autoprefixer** - 自動添加 CSS 瀏覽器前綴

## 環境變數設置

本項目使用以下第三方服務，需要在環境變數中配置：

- **MongoDB** - 數據庫服務（用於存儲遊記、留言等數據）
- **Cloudinary** - 圖片管理服務（用於圖片存儲和優化）
- **管理員密碼** - 用於訪問管理後台

具體的環境變數配置請參考項目代碼中的使用情況，或聯繫項目維護者獲取配置說明。

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
michalknitl-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局（包含全局樣式和腳本）
│   ├── page.tsx                 # 首頁
│   ├── Travelogues/             # 遊記頁面
│   │   └── [id]/                # 動態遊記頁面
│   ├── daily-life/              # 日常生活頁面
│   │   └── [id]/                # 動態日常生活頁面
│   ├── map/                     # 地圖頁面
│   ├── admin/                   # 管理後台
│   │   ├── Travelogues/         # 遊記管理
│   │   ├── daily-life/          # 日常生活管理
│   │   └── comments/            # 留言管理
│   └── api/                     # API 路由
│       ├── comments/            # 留言 API
│       ├── travelogues/         # 遊記 API
│       ├── daily-life/          # 日常生活 API
│       └── admin/               # 管理員 API
├── components/                   # React 組件
│   ├── Navigation.tsx           # 導航選單
│   ├── Hero.tsx                 # Hero 區塊
│   ├── TravelogueList.tsx       # 遊記列表
│   ├── TravelogueCard.tsx       # 遊記卡片
│   ├── TravelogueContent.tsx    # 遊記內容渲染
│   ├── DailyLifeList.tsx        # 日常生活列表
│   ├── DailyLifeCard.tsx        # 日常生活卡片
│   ├── TravelMap.tsx            # 地圖組件
│   ├── CommentBoard.tsx         # 留言板組件
│   ├── CommentForm.tsx          # 留言表單
│   ├── CommentList.tsx          # 留言列表
│   └── CommentItem.tsx          # 留言項目
├── lib/                          # 工具函數和數據
│   ├── data.ts                  # 遊記和地圖數據（內部配置）
│   ├── mongodb.ts               # MongoDB 連接
│   ├── cloudinary.ts            # Cloudinary 配置
│   ├── auth.ts                  # 認證工具
│   └── i18n.ts                  # 國際化翻譯
├── contexts/                     # React Context
│   └── LanguageContext.tsx      # 語言切換上下文
├── content/                      # 內容文件
│   └── travelogues/             # 遊記 HTML 文件
└── public/                       # 靜態資源
    └── images/                  # 圖片資源
```

## API 文檔

### 公開 API

#### 留言 API

**GET `/api/comments`**
- 獲取所有已審核的留言
- 返回：留言數組（包含留言內容、作者、時間、回覆關係等）

**POST `/api/comments`**
- 提交新留言
- 請求體：`{ name, email, message, parentId? }`
- 返回：創建的留言對象

**GET `/api/comments/[id]`**
- 獲取單個留言詳情
- 返回：留言對象

**PUT `/api/comments/[id]`**
- 更新留言（僅限留言作者）
- 請求體：`{ message }`
- 返回：更新後的留言對象

**DELETE `/api/comments/[id]`**
- 刪除留言（僅限留言作者）
- 返回：成功訊息

#### 遊記 API

**GET `/api/travelogues/[id]`**
- 獲取遊記基本信息
- 返回：`{ title, description, date, coverImage }`

**GET `/api/travelogues/[id]/content`**
- 獲取遊記 HTML 內容
- 返回：`{ content }`

**GET `/api/travelogues/[id]/cover`**
- 獲取遊記封面圖片 URL
- 返回：`{ coverImage }`

#### 日常生活 API

**GET `/api/daily-life/[id]`**
- 獲取日常生活記錄基本信息
- 返回：`{ title, description, date, coverImage }`

**GET `/api/daily-life/[id]/content`**
- 獲取日常生活記錄 HTML 內容
- 返回：`{ content }`

### 管理員 API

所有管理員 API 都需要通過 Cookie 認證。請先調用 `/api/admin/login` 進行登錄。

#### 認證 API

**POST `/api/admin/login`**
- 管理員登錄
- 請求體：`{ password }`
- 返回：`{ success: true }` 並設置認證 Cookie

**POST `/api/admin/logout`**
- 管理員登出
- 返回：`{ success: true }`

#### 留言管理 API

**GET `/api/admin/comments`**
- 獲取所有留言（包括未審核的）
- 需要管理員權限
- 返回：留言數組

**PUT `/api/admin/comments/[id]`**
- 審核/更新留言
- 需要管理員權限
- 請求體：`{ isApproved?, message? }`
- 返回：更新後的留言對象

**DELETE `/api/admin/comments/[id]`**
- 刪除留言
- 需要管理員權限
- 返回：成功訊息

#### 遊記管理 API

**PUT `/api/admin/travelogues/[id]`**
- 更新遊記基本信息
- 需要管理員權限
- 請求體：`{ title?, description?, date?, coverImage? }`
- 返回：更新後的遊記對象

**PUT `/api/admin/travelogues/[id]/content`**
- 更新遊記 HTML 內容
- 需要管理員權限
- 請求體：`{ content }`
- 返回：成功訊息

**PUT `/api/admin/travelogues/[id]/cover`**
- 更新遊記封面圖片
- 需要管理員權限
- 請求體：`{ coverImage }`
- 返回：成功訊息

#### 日常生活管理 API

**PUT `/api/admin/daily-life/[id]`**
- 更新日常生活記錄基本信息
- 需要管理員權限
- 請求體：`{ title?, description?, date?, coverImage? }`
- 返回：更新後的記錄對象

**PUT `/api/admin/daily-life/[id]/content`**
- 更新日常生活記錄 HTML 內容
- 需要管理員權限
- 請求體：`{ content }`
- 返回：成功訊息

**PUT `/api/admin/daily-life/[id]/cover`**
- 更新日常生活記錄封面圖片
- 需要管理員權限
- 請求體：`{ coverImage }`
- 返回：成功訊息

#### 圖片管理 API

**GET `/api/admin/images`**
- 獲取 Cloudinary 中的所有圖片
- 需要管理員權限
- 查詢參數：`folder` (可選，默認為 'travelogues')
- 返回：圖片數組（包含 URL、尺寸、格式等信息）

**POST `/api/admin/upload`**
- 上傳圖片到 Cloudinary
- 需要管理員權限
- 請求體：FormData，包含 `file` 和 `folder`
- 返回：上傳後的圖片信息

## 管理後台

本項目提供完整的管理後台系統，位於 `/admin` 路徑。管理後台用於管理網站的所有內容，包括遊記、日常生活記錄和留言。

### 訪問管理後台

1. 在瀏覽器中訪問 `http://localhost:3000/admin`（開發環境）或 `https://your-domain.com/admin`（生產環境）
2. 輸入管理員密碼（在環境變數 `ADMIN_PASSWORD` 中設置）
3. 登錄成功後即可使用管理功能

### 管理後台功能

#### 1. 留言管理 (`/admin`)

- **查看所有留言**：包括已審核和未審核的留言
- **審核留言**：批准或拒絕留言顯示
- **編輯留言**：修改留言內容
- **刪除留言**：永久刪除不當留言
- **查看回覆關係**：查看留言的父子關係

#### 2. 遊記管理 (`/admin` → 管理 Travelogues)

在主管理頁面點擊「管理 Travelogues」標籤，可以看到所有遊記列表。點擊任一遊記進入詳細管理頁面 (`/admin/Travelogues/[id]`)。

**遊記管理功能：**
- **更新基本信息**：標題、描述、日期
- **更換封面圖片**：
  - 從 Cloudinary 選擇圖片
  - 或上傳新圖片（自動壓縮後上傳到 Cloudinary）
- **編輯內容**：使用富文本編輯器（React Quill）編輯遊記 HTML 內容
  - 支持格式化文本（粗體、斜體、標題等）
  - 插入圖片（從 Cloudinary 選擇或上傳）
  - 創建連結
  - 支持列表、引用等格式

#### 3. 日常生活記錄管理 (`/admin` → 管理 Daily Life)

在主管理頁面點擊「管理 Daily Life」標籤，可以看到所有日常生活記錄列表。點擊任一記錄進入詳細管理頁面 (`/admin/daily-life/[id]`)。

**日常生活記錄管理功能：**
- **更新基本信息**：標題、描述、日期
- **更換封面圖片**：
  - 從 Cloudinary 選擇圖片
  - 或上傳新圖片（自動壓縮後上傳到 Cloudinary）
- **編輯內容**：使用富文本編輯器（React Quill）編輯記錄 HTML 內容
  - 支持格式化文本（粗體、斜體、標題等）
  - 插入圖片（從 Cloudinary 選擇或上傳）
  - 創建連結
  - 支持列表、引用等格式

### 圖片管理

管理後台集成了 Cloudinary 圖片管理服務：

- **圖片瀏覽**：按文件夾分類瀏覽所有上傳的圖片
- **圖片上傳**：
  - 支持拖拽上傳
  - 自動圖片壓縮（使用 `browser-image-compression`）
  - 自動上傳到 Cloudinary
  - 支持選擇上傳到不同文件夾（如 `travelogues`、`daily-life` 等）
- **圖片選擇**：在編輯內容時，可以從 Cloudinary 選擇已上傳的圖片插入

### 安全特性

- **密碼保護**：所有管理功能都需要通過密碼驗證
- **Cookie 認證**：登錄後使用 HTTP-only Cookie 維持會話
- **權限檢查**：所有 API 請求都會驗證管理員身份
- **自動登出**：可以手動登出，清除認證狀態

### 使用流程示例

**編輯遊記內容：**
1. 訪問 `/admin` 並登錄
2. 點擊「管理 Travelogues」標籤
3. 找到要編輯的遊記並點擊
4. 在編輯頁面中：
   - 修改標題、描述、日期等基本信息
   - 點擊「選擇圖片」更換封面，或上傳新圖片
   - 在富文本編輯器中編輯內容
   - 點擊「保存內容」保存更改

**管理留言：**
1. 訪問 `/admin` 並登錄
2. 默認顯示「管理留言」標籤
3. 查看所有留言列表
4. 對每個留言可以：
   - 點擊「批准」或「拒絕」來審核
   - 點擊「編輯」修改內容
   - 點擊「刪除」永久刪除

## 功能特性

- ✅ 響應式導航選單（支持中英文切換）
- ✅ Hero 區塊展示
- ✅ 遊記列表和詳情頁面
- ✅ 日常生活記錄列表和詳情頁面
- ✅ 互動式地圖功能（使用 React Leaflet）
  - 顯示旅行路線
  - 標記地點
  - 支持多種交通工具圖標
- ✅ 留言系統
  - 支持留言和回覆
  - 留言編輯和刪除
  - 管理員審核功能
- ✅ 管理後台
  - 遊記內容管理
  - 日常生活記錄管理
  - 留言審核和管理
  - 圖片上傳和管理（集成 Cloudinary）
  - 富文本編輯器（React Quill）
- ✅ 響應式設計（支持移動端和桌面端）
- ✅ 現代化 UI 設計（Tailwind CSS）
- ✅ 圖片優化和壓縮
- ✅ 多語言支持（中文/英文）

## 數據配置

### ⚠️ 重要說明

`lib/data.ts` 文件包含項目的核心數據配置，包括：
- 遊記數據結構定義
- 地圖標記點和路線數據
- 旅行行程配置

**此文件為內部配置文件，不建議外部修改。** 如需修改遊記內容，請使用管理後台進行編輯，或直接修改 `content/travelogues/` 目錄下的 HTML 文件。

## 部署

本項目已配置 Vercel 部署。推送到 `main` 分支後會自動觸發部署。

### 部署要求

1. 確保所有環境變數已在 Vercel 項目設置中配置
2. MongoDB Atlas 需要將 Vercel 的 IP 地址加入白名單（或允許所有 IP）
3. Cloudinary 帳號需要正確配置

## 開發注意事項

- 所有 API routes 使用 `force-dynamic` 導出，確保正確處理 cookies 和動態數據
- 地圖組件使用動態導入並禁用 SSR，避免服務器端 `window` 對象錯誤
- 圖片上傳前會在客戶端進行壓縮，減少上傳時間和帶寬
- 留言系統使用 sessionId 來識別用戶，存儲在 localStorage 中

## 許可證

私有項目，版權所有。
