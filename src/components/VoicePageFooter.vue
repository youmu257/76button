<template>
  <!-- 頁尾組件：顯示版權聲明、外部連結和版本資訊 -->
  <footer class="footer">
    <div class="footer-background">
      <div>
        <!-- GitHub 專案連結 -->
        <!-- rel="noopener noreferrer" 防止 tabnabbing 攻擊並保護隱私 -->
        <!-- target="_blank" 在新分頁開啟連結 -->
        <a
          href="https://github.com/youmu257/76button"
          target="_blank"
          rel="noopener noreferrer"
          class="text-dark"
        >
          歡迎在 Github 提出任何建議
          <!-- GitHub 圖示 SVG -->
          <!-- aria-hidden="true" 對螢幕閱讀器隱藏裝飾性圖示 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#99999"
            class="bi bi-github"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        
        <!-- 免責聲明 -->
        <div>本站為粉絲純做推廣用，與 STORIA 沒有任何關係</div>
        
        <!-- 圖示版權聲明 -->
        <div>
          Icons made by <a
            href="https://www.freepik.com"
            title="Freepik"
            target="_blank"
            rel="noopener noreferrer"
          >Freepik</a> from <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noopener noreferrer"
          >www.flaticon.com</a>
        </div>
        
        <!-- 顯示應用程式版本號 -->
        <div>v.{{ appVersion }}</div>
      </div>
    </div>
  </footer>
</template>

<script>
/**
 * VoicePageFooter 組件
 * 
 * 功能說明：
 * - 顯示 GitHub 專案連結，方便使用者提出建議或回報問題
 * - 顯示免責聲明，說明本站為粉絲自製內容
 * - 顯示圖示來源版權聲明
 * - 顯示應用程式版本號
 * 
 * 特性：
 * - 純靜態內容，無複雜邏輯
 * - 所有外部連結使用 rel="noopener noreferrer" 確保安全性
 * - SVG 圖示設定 aria-hidden 改善無障礙性
 * 
 * @component
 */
export default {
  name: 'VoicePageFooter',
  data() {
    return {
      /**
       * 應用程式版本號
       * 從環境變數 VUE_APP_VERSION 中讀取，在編譯時注入
       * 如果環境變數未設定，則使用預設值 '1.0.0'
       * 
       * 設定方式：在 .env 檔案中定義 VUE_APP_VERSION=x.x.x
       * 
       * @type {string}
       */
      appVersion: process.env.VUE_APP_VERSION || '1.0.0',
    }
  },
}
</script>

<!-- 引入外部樣式表 -->
<!-- scoped 確保樣式只作用於此組件 -->
<style scoped src="../css/Footer.css"></style>