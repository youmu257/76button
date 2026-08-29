# 76button

[祈菈語音按鈕](https://chilla76cheese.com)

單純推廣用。其中所有語音檔版權為 [STORIA 祈菈‧貝希毛絲](https://www.youtube.com/channel/UCykgAuIjn70_CXLNjZ8zppQ) 所有，如有需要下架的音訊檔請再聯絡我。

> 📖 **完整功能說明請見 [docs/FEATURES.md](docs/FEATURES.md)**（各頁面功能、資料來源、彩蛋、技術架構等）

## 開發

```bash
npm run serve   # 啟動本機開發伺服器
npm run build   # 建置正式版（輸出至 dist/）
npm run lint    # 使用 Eslint 檢查程式碼風格
```

- 如要更改語音按鈕，調整 [src/assets/button-list.json](src/assets/button-list.json) 即可。
- `<head>` 相關設定（title、meta、OG 標籤）寫在 [src/App.vue](src/App.vue) 中。
- 程式碼風格規範請見 [docs/CODING_STYLE.md](docs/CODING_STYLE.md)。

## 部署

已改為 GitHub Actions 自動部署，只要 push 到 `master` 分支即可，不用再手動 build / commit；也可以到 GitHub 頁面的 Actions 分頁手動觸發（`workflow_dispatch`）。詳細設定請參考 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)。

## 待辦事項

- 精華推薦頁面
- 語音考題頁面（大概）
- 小遊戲

## Reference

- [Button 樣式](https://www.bestcssbuttongenerator.com/#/19)
- [感謝 Cow Lo 提供圖片素材](https://twitter.com/ud83xji4g/status/1444297977388945411?s=21)

## LICENCE

GPL 授權，詳細請參照 [LICENSE](LICENSE) 檔案。
