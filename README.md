# 76button
[祈菈語音按鈕](https://chilla76cheese.com)<br>
單純推廣用<br>
其中所有語音檔版權為 [STORIA 祈菈‧貝希毛絲](https://www.youtube.com/channel/UCykgAuIjn70_CXLNjZ8zppQ)所有，如有需要下架的音訊檔請再聯絡我

# Description
* 如要更改按鈕可以調整 assets/button-list.json<br>
* 另外 head 部分寫死在 App.vue 中<br>
* 建置步驟
    ```
    # 建置專案
    npm run build
    # 建置結果
    cd dist
    # 以下為推到 github page 步驟
    git init
    git add -A
    git commit -m 'deploy'
    git push -f https://github.com/youmu257/76button.git master:gh-pages
    ```
* Coding style
    * 使用 Eslint 統一 style
    ```
    npm run lint
    ```
# To list
* 隨機播放按鈕
* 顯示是否播放完畢
* 多語系
* 畫面優化(會擺後面)

# Reference
* [Button 樣式](https://www.bestcssbuttongenerator.com/#/19)
* [感謝 Cow Lo 提供圖片素材](https://twitter.com/ud83xji4g/status/1444297977388945411?s=21)
## LICENCE
GPL 授權<br>
詳細請參照 LICENSE 檔案<br>
