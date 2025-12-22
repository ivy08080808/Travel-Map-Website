#!/bin/bash

echo "正在安裝 Node.js 和 Yarn..."

# 載入 nvm（如果存在）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 檢查是否已安裝 Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js 已安裝: $(node --version)"
else
    echo "正在安裝 Node.js..."
    
    # 如果 nvm 存在，使用 nvm 安裝
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        nvm install --lts
        nvm use --lts
        nvm alias default node
    else
        echo "請先安裝 nvm 或直接從 https://nodejs.org/ 下載 Node.js"
        exit 1
    fi
fi

# 檢查是否已安裝 Yarn
if command -v yarn &> /dev/null; then
    echo "✓ Yarn 已安裝: $(yarn --version)"
else
    echo "正在安裝 Yarn..."
    npm install -g yarn
fi

echo ""
echo "✓ 安裝完成！"
echo ""
echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"
echo "Yarn 版本: $(yarn --version)"
echo ""
echo "現在可以運行以下命令："
echo "  cd ~/Desktop/michalknitl-website"
echo "  yarn install"
echo "  yarn dev"
