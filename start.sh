#!/bin/bash

# 載入 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 確保使用正確的 Node.js 版本
nvm use default

# 進入專案目錄
cd ~/Desktop/michalknitl-website

# 檢查依賴是否已安裝
if [ ! -d "node_modules" ]; then
    echo "正在安裝依賴..."
    yarn install
fi

# 啟動開發服務器
echo "正在啟動開發服務器..."
echo "請在瀏覽器中打開: http://localhost:3000"
yarn dev
