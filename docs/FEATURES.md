# 網站功能文件

本文件記錄「祈菈語音按鈕」網站（[chilla76cheese.com](https://chilla76cheese.com)）目前的完整功能，供日後開發、維護與交接參考。

> 想知道功能背後程式碼怎麼運作（元件關係、狀態管理、資料流程），請見 [docs/ARCHITECTURE.md](ARCHITECTURE.md)。

## 目錄

- [專案簡介](#專案簡介)
- [技術架構](#技術架構)
- [網站導覽結構](#網站導覽結構)
- [頁面功能](#頁面功能)
  - [語音按鈕頁 `/voice`（首頁）](#語音按鈕頁-voice首頁)
  - [重大歷史時間軸 `/timeline`](#重大歷史時間軸-timeline)
  - [直播搜尋 `/video-search`](#直播搜尋-video-search)
  - [標籤總覽 `/tag-summary`](#標籤總覽-tag-summary)
  - [意見回饋 `/feedback`](#意見回饋-feedback)
  - [感謝名單 `/contributors`](#感謝名單-contributors)
- [共用元件](#共用元件)
- [資料來源](#資料來源)
- [彩蛋功能](#彩蛋功能)
- [建置與部署](#建置與部署)
- [已知技術債](#已知技術債)

## 專案簡介

本站是 VTuber「STORIA 祈菈‧貝希毛絲」的粉絲推廣網站，核心功能是語音按鈕（音效板），並延伸出歷史時間軸、直播影片標籤搜尋等社群整理內容。網站與 STORIA 官方無任何關係，純粹由粉絲自製維運。

## 技術架構

| 項目 | 說明 |
| --- | --- |
| 前端框架 | Vue 3（Options API）＋ Vue Router 4（`createWebHashHistory`，網址帶 `#`） |
| UI 套件 | Bootstrap 5、Bootstrap Icons |
| 建置工具 | Vue CLI 5（`vue-cli-service`，內部使用 webpack 5） |
| Head 管理 | `@morr/vue3-head`，於 [App.vue](../src/App.vue) 動態設定 `<title>`、meta、OG 標籤 |
| 資料來源 | 部分功能讀取專案內 JSON（語音按鈕、時間軸、貢獻者、側邊欄選單），部分功能即時抓取 Google 試算表發佈的 CSV |
| 部署 | GitHub Actions（[deploy.yml](../.github/workflows/deploy.yml)）：push 到 `master` 分支先跑單元測試，測試通過才建置並發佈到 GitHub Pages |

## 網站導覽結構

左側有一個可收合的側邊欄（[CollapseSidebar.vue](../src/components/CollapseSidebar.vue)），選單項目定義於 [sidebar-list.json](../src/assets/sidebar-list.json)：

| 選單文字 | 路徑 |
| --- | --- |
| 語音按鈕 | `/voice` |
| 重大歷史 | `/timeline` |
| 直播搜尋 | `/video-search` |
| 標籤總覽 | `/tag-summary` |
| 意見回饋 | `/feedback` |
| 感謝名單 | `/contributors` |

側邊欄行為：
- 大螢幕（寬度 ≥ 768px）預設展開，小螢幕預設收合；收合時只顯示圖示，展開時顯示圖示＋文字。
- 收合/展開狀態會即時通知 [App.vue](../src/App.vue)，調整主內容區的左邊界（margin-left）。
- 縮小視窗至小裝置尺寸時，若側邊欄仍展開會自動收合。
- 側邊欄下方另有社群連結區塊（[InformationSidebar.vue](../src/components/InformationSidebar.vue)）：YouTube、官方網站（lit.link）、Twitch、X (Twitter)、Discord（新／舊）、Facebook（官方粉專／毛絲專頁）、Plurk、Bluesky、買動漫賣場、三視圖、舊 YouTube 頻道。

路由對照（定義於 [App.vue](../src/App.vue)）：

```
/            → VoicePage（與 /voice 相同，預設首頁）
/voice       → VoicePage
/feedback    → FeedbackForm
/contributors→ ContributorsPage
/timeline    → Timeline
/video-search→ VideoSearch
/tag-summary → TagSummarySearch
```

## 頁面功能

### 語音按鈕頁 `/voice`（首頁）

檔案：[VoicePage.vue](../src/components/VoicePage.vue)

主體是音效板，共 **175 個語音按鈕**，分為 9 個分類（不含彩蛋分類），資料來自 [button-list.json](../src/assets/button-list.json)：

| 分類 | 按鈕數 |
| --- | --- |
| 祈菈 | 41 |
| 祈菈菈 | 14 |
| 福利(祈菈最寵起司團了) | 16 |
| 祈蘿 | 11 |
| 台詞配音 | 13 |
| 祈特音效 | 47 |
| 笑聲 | 25 |
| 呼麻鼠 | 3 |
| 760(肥宅音) | 4 |
| 亂入 王祈菈（彩蛋分類，見下） | 1 |

每個分類以手風琴（accordion）區塊呈現，按鈕本體為 [VoiceButton2.vue](../src/components/buttons/VoiceButton2.vue)。

**單顆按鈕功能：**
- 點擊播放對應 mp3（音檔存於 `src/assets/sound/`），播放時按鈕邊框會顯示進度條（CSS 變數 `--progress`）。
- 按鈕旁顯示音效來源圖示：YouTube 或 Twitter（`sourceType` 決定），點擊會開新分頁前往來源影片/推文的對應時間點。
- 下載按鈕：直接以按鈕名稱建立下載連結取得 mp3。

**播放規則：**
- 預設「單一播放」：再次點擊任一按鈕會蓋掉目前播放中的音效。
- 可切換「重疊播放」開關（頁面上方核取方塊），開啟後可同時播放多個音效。
- 按 **空白鍵** 可停止所有播放中的音效（重疊播放時一次全部停止）。
- 畫面右下角固定顯示 [AudioPlayer.vue](../src/components/AudioPlayer.vue) 播放器面板：列出目前播放中的音效名稱、可個別停止、可「隨機播放」一個非彩蛋語音、可「全部停止」。

**搜尋功能：** 頁面上方搜尋框可依按鈕名稱即時篩選（不分類時隱藏空分類），無結果時顯示提示文字。

**「亂入王祈菈」彩蛋：** 點擊「亂入王祈菈」按鈕時，除了正常播放語音外，會在畫面隨機位置（避開正中央 30% 區域）產生 10 張祈菈圖片，圖片會在 2.5～5 秒間隨機淡出消失；同時在畫面上最多疊加 200 張。按空白鍵會強制清空所有亂入圖片。

**F12 彩蛋：** 按下 `F12` 鍵會觸發隱藏效果——頁面標題變成「歡迎加入大鼠維埃共婆黨」（[App.vue](../src/App.vue)）／「毛主祈萬歲」（VoicePage），頭像圖片替換，並在頁面上方嵌入的隱藏 iframe 依序播放特定 YouTube 影片（祈菈搖 → 5 秒後切換成 Rick Roll），並在瀏覽器主控台印出彩蛋文字。

### 重大歷史時間軸 `/timeline`

檔案：[Timeline.vue](../src/components/Timeline.vue)

以年份分組呈現大事記，左側為可搜尋、可點擊跳轉的年份導覽列，右側為時間軸卡片列表（依捲動位置以 `IntersectionObserver` 自動反白目前年份）。

**四組資料集（互斥切換）：**

| 分頁/開關 | 資料檔 | 標題 | 筆數 |
| --- | --- | --- | --- |
| 歷史 | [timeline-chilla-data.json](../src/assets/timeline-chilla-data.json) | 祈菈的歷史大事 | 77 |
| 場次/線下活動 | [timeline-session-data.json](../src/assets/timeline-session-data.json) | 祈菈的歷史大事 | 17 |
| 精華/企劃 | [timeline-highlight-data.json](../src/assets/timeline-highlight-data.json) | 祈菈的歷史大事 | 14 |
| 「鴨子模式」滑動開關 | [timeline-duck-data.json](../src/assets/timeline-duck-data.json) | 鴨子出沒的時間點 | 32 |

- 頁面上方的滑動開關（toggle switch）用來切換「鴨子模式」（作者本人相關時間軸），開啟後會隱藏「歷史／場次/線下活動／精華/企劃」三個分頁按鈕，只顯示鴨子模式資料。
- 每筆事件包含日期、標題、描述，並可選擇性附加：
  - 影片（`video` 欄位）：若能從連結解析出 YouTube 影片 ID，顯示縮圖 + 播放鈕，點擊後才載入 `youtube-nocookie.com` 的 iframe（點擊播放的 facade 模式，避免預先載入所有影片造成效能負擔）；解析不到 ID 則顯示「直播影片」標籤。
  - 圖片（`image` 欄位）：點擊可開啟燈箱（lightbox）放大檢視，點擊燈箱背景關閉。
  - 一或兩個外部連結（`link` / `link2`）。
- 左側搜尋框可依標題與描述關鍵字即時篩選事件（會保留年份分組結構，篩掉沒有符合項目的年份）。
- 切換分頁或搜尋條件改變時會重新初始化年份監控器，並重置搜尋狀態。
- 頁面右下角提供「回到頂端」按鈕（[BackToTop.vue](../src/components/BackToTop.vue)）。

> 備註：README 記載此頁曾採用「左右交錯排列」的舊版時間軸樣式，已於近期重構為依年份分組的版面，交錯排列的舊程式碼已清除。

### 直播搜尋 `/video-search`

檔案：[VideoSearch.vue](../src/components/VideoSearch.vue)

用來搜尋歷來直播影片的標籤與標題，資料**不是**存在專案內，而是即時從 Google 試算表發佈的 CSV 端點抓取（試算表由社群協作維護）：

- 影片標籤資料：`VIDEO_TAGS_CSV_URL`（欄位：時間、影片標題、影片網址、標籤 JSON 字串）
- 篩選選項資料：`FILTER_OPTIONS_CSV_URL`（種類、角色清單）

標籤型別對照：`1=類型 2=遊戲 3=歌曲 4=人員 5=場次`。

**功能：**
- 「種類」「角色」兩個下拉選單可精準篩選（分別對應標籤類型 1 與 4）。
- 關鍵字搜尋框：支援用空白分隔多個關鍵字，採 AND 邏輯，同時比對標籤名稱與影片標題；輸入後有 1 秒防抖（debounce）延遲再套用。
- 「清除所有篩選」按鈕（有任一篩選條件啟用時才顯示）。
- 搜尋結果依時間新到舊排序，顯示筆數與（篩選後的）最新影片日期。
- 每筆結果顯示影片標題（連到 YouTube 該影片）、日期、所有標籤徽章；點擊標籤徽章可直接套用該標籤為篩選條件（種類/人員套進對應下拉選單，其餘類型套進關鍵字搜尋框）。
- 分頁顯示，每頁 20 筆。
- 支援從「標籤總覽」頁面帶入查詢參數（`tagType` / `tagName`）自動套用篩選條件，套用後會清除網址參數避免重複套用。
- 載入 CSV 時顯示 loading 動畫；載入失敗會在主控台記錄錯誤並以空陣列處理。

### 標籤總覽 `/tag-summary`

檔案：[TagSummarySearch.vue](../src/components/TagSummarySearch.vue)

同樣抓取上述「影片標籤資料」CSV，統計出四種標籤類型各自出現過的所有標籤與出現次數，並依次數排序：

- 四個分頁：開台類型、遊戲、歌曲、人員（分頁按鈕上會顯示各類別的標籤總數）。
- 搜尋框可依名稱篩選目前分頁的標籤。
- 每個標籤卡片顯示名稱與出現次數（次數代表在多少部直播影片中被標記過）。
- 點擊任一標籤卡片，會帶著 `tagType` / `tagName` 查詢參數導向「直播搜尋」頁，自動套用該標籤為篩選條件（即上一節所述的「帶入篩選」機制）。

### 意見回饋 `/feedback`

檔案：[FeedbackForm.vue](../src/components/FeedbackForm.vue)

單純嵌入一個 Google 表單（iframe），讓使用者提交音效請求或站台問題回饋，無額外互動邏輯。

### 感謝名單 `/contributors`

檔案：[ContributorsPage.vue](../src/components/ContributorsPage.vue)

以卡片網格列出所有貢獻者，資料來自 [contributors-list.json](../src/assets/contributors-list.json)，每筆包含姓名與一組貢獻項目（同一人可能有多項貢獻），每項貢獻各自可帶可選的外部連結（例如提供的圖片素材原始貼文）。

## 共用元件

| 元件 | 用途 |
| --- | --- |
| [PageHeader.vue](../src/components/PageHeader.vue) | 各頁面共用的標題區塊：圓形圖片＋主標題＋副標題 |
| [VoicePageFooter.vue](../src/components/VoicePageFooter.vue) | 全站共用頁尾：GitHub 連結、免責聲明、圖示版權聲明、版本號（讀取 `VUE_APP_VERSION` 環境變數） |
| [BackToTop.vue](../src/components/BackToTop.vue) | 捲動超過 300px 後顯示的「回到頂端」浮動按鈕 |
| [CollapseSidebar.vue](../src/components/CollapseSidebar.vue) / [InformationSidebar.vue](../src/components/InformationSidebar.vue) | 見上方「網站導覽結構」 |
| [AudioPlayer.vue](../src/components/AudioPlayer.vue) | 見上方「語音按鈕頁」的固定播放器面板 |

## 資料來源

**內建於專案的 JSON（修改後需重新建置部署）：**

| 檔案 | 用途 |
| --- | --- |
| `src/assets/button-list.json` | 語音按鈕清單與分類 |
| `src/assets/sidebar-list.json` | 側邊欄選單項目 |
| `src/assets/contributors-list.json` | 感謝名單 |
| `src/assets/timeline-chilla-data.json` | 時間軸「歷史」分頁資料 |
| `src/assets/timeline-session-data.json` | 時間軸「場次/線下活動」分頁資料 |
| `src/assets/timeline-highlight-data.json` | 時間軸「精華/企劃」分頁資料 |
| `src/assets/timeline-duck-data.json` | 時間軸「鴨子模式」資料 |
| `src/assets/sound/*.mp3` | 175 個語音按鈕對應的音檔 |

**即時抓取的外部資料（Google 試算表發佈為 CSV，修改試算表內容即可即時反映在網站上，不需重新部署）：**

- 影片標籤資料（直播搜尋、標籤總覽共用）
- 篩選選項資料（種類、角色清單，供直播搜尋頁下拉選單使用）

## 彩蛋功能

| 觸發方式 | 效果 |
| --- | --- |
| 點擊「亂入王祈菈」語音按鈕 | 畫面隨機位置產生 10 張淡出消失的祈菈圖片（累計上限 200 張） |
| 按 `空白鍵`（語音按鈕頁） | 停止所有播放中的音效；若曾觸發亂入效果會一併清空所有亂入圖片 |
| 按 `F12` | 更換頁面標題／頭像／隱藏 iframe，依序播放特定 YouTube 影片（祈菈搖 5 秒後切成 Rick Roll），並在主控台印出彩蛋訊息 |

## 建置與部署

```bash
npm run serve   # 本機開發伺服器
npm run build   # 建置正式版（輸出至 dist/）
npm run lint    # ESLint 檢查
```

- 部署已全面自動化：push 到 `master` 分支會觸發 [GitHub Actions](../.github/workflows/deploy.yml)，分成兩個 job：
  1. `test`：`npm ci` → `npm run test:unit`，跑單元測試。
  2. `deploy`：設定 `needs: test`，只有 `test` job 成功才會執行，依序：
     - **自動遞增版號**：檢查這次推送有沒有動到 `.env`（footer 版本號來源），如果沒有就自動把 patch 版號 +1（例如 `2.0.2` → `2.0.3`）並直接 commit + push 回 `master`（commit message 帶 `[skip ci]`，不會再觸發一次 workflow）；如果這次推送本來就手動改過 `.env`（例如想跳到 `2.1.0`），就尊重手動設定的版本，不會再疊加。
     - `npm ci` → build → 發佈到 GitHub Pages（`peaceiris/actions-gh-pages`）。
     - 若單元測試失敗，`deploy` job 會直接被跳過，不會建置也不會發佈，也不會遞增版號。
- 也可在 GitHub 頁面的 Actions 分頁手動觸發（`workflow_dispatch`），一樣會先跑過 `test` job。
- 建置工具已升級到 Vue CLI 5（webpack 5），不再需要 `NODE_OPTIONS=--openssl-legacy-provider` 這個相容性補丁。

## 已知技術債

- [VoiceButton.vue](../src/components/buttons/VoiceButton.vue) 與 [VoiceButton1.vue](../src/components/buttons/VoiceButton1.vue) 是舊版語音按鈕元件，目前全站沒有任何地方引用，實際使用的是 `VoiceButton2.vue`。若確認不再需要，可考慮移除以減少維護負擔。
- README 中的「To list」（精華推薦頁面、語音考題頁面、小遊戲）目前尚未實作，仍為待辦事項。
