#!/usr/bin/env python3
import os
import subprocess
from pathlib import Path

# 圖片目錄
image_dir = Path("/Users/ivy/Desktop/michalknitl-website/public/images/daily-life-114-1_ntu_dump")

# 轉換所有 HEIC 文件為 JPG
heic_files = list(image_dir.glob("*.heic")) + list(image_dir.glob("*.HEIC"))

for heic_file in heic_files:
    jpg_file = heic_file.with_suffix('.jpg')
    try:
        # 使用 sips 命令轉換
        subprocess.run(['sips', '-s', 'format', 'jpeg', str(heic_file), '--out', str(jpg_file)], 
                      check=True, capture_output=True)
        print(f"轉換成功: {heic_file.name} -> {jpg_file.name}")
    except subprocess.CalledProcessError as e:
        print(f"轉換失敗: {heic_file.name} - {e}")
    except FileNotFoundError:
        print("錯誤: 找不到 sips 命令。請確保在 macOS 系統上運行。")
        break

print(f"\n總共處理 {len(heic_files)} 個文件")

