# 安裝和啟動指南

## 步驟 1: 安裝 Node.js 和 Yarn

### 方法 1: 使用 Homebrew (推薦)

如果您還沒有安裝 Homebrew，請先安裝：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

然後安裝 Node.js：

```bash
brew install node
```

安裝 Yarn：

```bash
npm install -g yarn
```

### 方法 2: 直接下載 Node.js

1. 訪問 https://nodejs.org/
2. 下載並安裝 LTS 版本
3. 安裝完成後，在終端運行：

```bash
npm install -g yarn
```

## 步驟 2: 安裝專案依賴

在專案目錄中運行：

```bash
cd ~/Desktop/michalknitl-website
# 注意：目錄名稱可能還是 michalknitl-website，但網站內容已更新為 Chinghua Ivy Lu
yarn install
```

## 步驟 3: 啟動開發服務器

```bash
yarn dev
```

然後在瀏覽器中打開：http://localhost:3000

## 其他有用的命令

- `yarn build` - 構建生產版本
- `yarn start` - 啟動生產服務器
- `yarn lint` - 運行代碼檢查
