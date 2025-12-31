#!/bin/bash
# 轉換 HEIC 文件為 JPG

cd /Users/ivy/Desktop/michalknitl-website/public/images/daily-life-114-1_ntu_dump

for file in *.heic *.HEIC; do
    if [ -f "$file" ]; then
        jpg_file="${file%.*}.jpg"
        echo "轉換: $file -> $jpg_file"
        sips -s format jpeg "$file" --out "$jpg_file"
    fi
done

# 將 JPG 轉為小寫（如果有的話）
for file in *.JPG; do
    if [ -f "$file" ]; then
        jpg_file="${file%.*}.jpg"
        if [ "$file" != "$jpg_file" ]; then
            mv "$file" "$jpg_file"
            echo "重命名: $file -> $jpg_file"
        fi
    fi
done

echo "轉換完成！"

