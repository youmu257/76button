<template>
  <!-- 頁面標題區塊：顯示圓形圖片、標題文字和資訊區塊 -->
  <div class="d-flex flex-wrap align-items-center justify-content-center container">
    <!-- 圓形圖片 -->
    <img
      ref="img-circle"
      class="img-circle"
      width="200"
      height="200"
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
      <p class="fs-2">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<script>
/**
 * PageHeader 組件
 *
 * 用途：
 * - 顯示頁面頂部的標題區塊
 * - 包含圓形圖片、主標題和副標題
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
  props: {
    /**
     * 主標題文字
     * 顯示在圖片旁邊的大標題
     * @type {String}
     */
    msg: {
      type: String,
      default: '',
    },

    /**
     * 圖片來源 URL
     * 顯示為圓形圖片
     * @type {String}
     */
    imgSrc: {
      type: String,
      default: '',
    },

    /**
     * 副標題文字
     * 顯示在主標題下方的詳細資訊
     * @type {String}
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
  object-fit: cover; /* 確保圖片為正方形，避免變形 */
}
</style>
