#!/usr/bin/env sh
# 參考 https://hsiangfeng.github.io/vue/20200214/1055437216/
# 發生錯誤時執行終止指令
set -e

# 打包編譯
npm run build

# 移動到打包資料夾下，若你有調整的話打包後的資料夾請務必調整
cd dist

# 部署到自定義網域
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
# ssh 模式
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# HTTPS 模式
git push -f https://github.com/youmu257/76button.git master:gh-pages

cd ..
