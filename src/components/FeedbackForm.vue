<template>
  <!-- 意見回饋表單頁面容器 -->
  <div class="feedback-container">
    <!-- 頁面標題區塊 -->
    <PageHeader
      ref="pageHeader"
      :msg="msg"
      :img-src="headerImgSrc"
      :title="infoBlockTitle"
    />
    
    <!-- Google 表單嵌入容器 -->
    <div class="form-wrapper">
      <!-- 
        嵌入 Google 表單 iframe
        注意：使用 frameborder="0" 是為了相容舊版瀏覽器
        現代瀏覽器應使用 CSS border: none
      -->
      <iframe
        src="https://forms.gle/ZtSFH3jLDnd1ocAH8"
        width="100%"
        height="700"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="意見回饋表單"
        loading="lazy"
      >
        載入中...
      </iframe>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

/**
 * FeedbackForm 組件
 * 
 * 功能說明：
 * - 顯示意見回饋表單頁面
 * - 嵌入 Google Forms 表單
 * - 包含頁面標題和表單容器
 * - 響應式設計，最大寬度 960px
 * 
 * 使用範例：
 * <FeedbackForm msg="聯絡我們" />
 * 
 * @component
 */
export default {
  name: 'FeedbackForm',
  components: {
    PageHeader, // 頁面標題組件
  },
  props: {
    /**
     * 頁面主標題
     * 顯示在頁面頂部的標題文字
     * @type {string}
     */
    msg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * 頁面標題圖片 URL
       * 使用 Twitter 圖片作為標題圖片
       * @type {string}
       */
      headerImgSrc: 'https://pbs.twimg.com/media/FBl1nswVEAIDNyw?format=jpg&name=4096x4096',
      
      /**
       * 資訊區塊標題
       * 傳遞給 PageHeader 組件的 title prop
       * @type {string}
       */
      infoBlockTitle: '意見回饋表單',
    }
  },
}
</script>

<style scoped>
/* 主容器樣式 */
.feedback-container {
  max-width: 960px; /* 限制最大寬度，提升可讀性 */
  margin: 0 auto; /* 水平置中 */
}

/* 表單容器樣式 */
.form-wrapper {
  background-color: white;
  border-radius: 8px; /* 圓角邊框 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  overflow: hidden; /* 裁切超出圓角的內容 */
  height: 700px; /* 固定高度 */
}

/* iframe 樣式 */
iframe {
  border: none; /* 移除邊框（現代瀏覽器） */
  width: 100%; /* 填滿容器寬度 */
  height: 100%; /* 填滿容器高度 */
}
</style>