<template>
  <!-- 頁面標題區塊：顯示圓形圖片、標題文字和資訊區塊 -->
  <div class="d-flex flex-wrap align-items-center justify-content-center container">
    <!-- 圓形圖片 -->
    <!-- ref 保留以便未來可能需要的 DOM 操作 -->
    <img
      ref="img-circle"
      class="img-circle"
      height="200"
      width="200"
      :src="imgSrc"
      :alt="msg || '頁面圖示'"
      loading="lazy"
    >
    
    <!-- 標題與資訊區塊容器 -->
    <div>
      <!-- 主標題文字 -->
      <p class="fs-1 py-1">
        {{ msg }}
      </p>
      
      <!-- 詳細資訊區塊 -->
      <InformationBlock :title="title" />
    </div>
  </div>
</template>

<script>
import InformationBlock from './InformationBlock.vue'

/**
 * PageHeader 組件
 * 
 * 功能說明：
 * - 顯示頁面頂部的標題區塊
 * - 包含圓形圖片、主標題文字和詳細資訊區塊
 * - 使用 flexbox 實現響應式排版
 * 
 * 使用範例：
 * <PageHeader 
 *   msg="王祈菈"
 *   imgSrc="/path/to/image.jpg"
 *   title="詳細資訊標題"
 * />
 * 
 * @component
 */
export default {
  name: 'PageHeader',
  components: {
    InformationBlock, // 用於顯示詳細資訊的子組件
  },
  props: {
    /**
     * 主標題文字
     * 顯示在圖片旁邊的大標題
     * @type {string}
     */
    msg: {
      type: String,
      default: '',
    },
    
    /**
     * 圖片來源 URL
     * 顯示為圓形圖片
     * @type {string}
     */
    imgSrc: {
      type: String,
      default: '',
    },
    
    /**
     * 資訊區塊標題
     * 傳遞給 InformationBlock 組件
     * @type {string}
     */
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
/* 圓形圖片樣式 */
.img-circle {
  border-radius: 50%;
  /* 確保圖片為正方形，避免變形 */
  object-fit: cover;
}
</style>