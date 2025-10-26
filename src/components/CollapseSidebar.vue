<template>
  <!-- 側邊欄容器 -->
  <div class="sidebar-container">
    <!-- 導航側邊欄 -->
    <!-- active class: 當側邊欄收合時套用 -->
    <nav
      id="sidebar"
      :class="{ active: !isSidebarOpen }"
      role="navigation"
      aria-label="主要導航選單"
    >
      <!-- 側邊欄標題區塊 -->
      <div class="sidebar-header">
        <!-- 側邊欄標題（僅在展開時顯示） -->
        <h3 v-if="isSidebarOpen">
          毛絲選單
        </h3>

        <!-- 收合/展開按鈕 -->
        <button
          id="sidebarCollapse"
          type="button"
          :aria-label="isSidebarOpen ? '收合側邊欄' : '展開側邊欄'"
          :aria-expanded="isSidebarOpen"
          @click="toggleSidebar"
        >
          <!-- 左箭頭 SVG（收合狀態） -->
          <svg
            v-if="isSidebarOpen"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            />
          </svg>

          <!-- 右箭頭 SVG（展開狀態） -->
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"
            />
          </svg>
        </button>
      </div>

      <!-- 側邊欄選單列表 -->
      <ul class="list-unstyled components">
        <!-- 遍歷選單項目 -->
        <li
          v-for="(item, index) in sidebarItems"
          :key="item.id || index"
        >
          <!-- 路由連結 -->
          <router-link :to="item.href">
            <!-- 選單圖示 -->
            <span
              :class="item.icon"
              aria-hidden="true"
            />
            <!-- 選單文字 -->
            <span style="margin-left: 10px">{{ item.text }}</span>
          </router-link>
        </li>
      </ul>

      <!-- 分隔線 -->
      <hr class="sidebar-divider">

      <!-- 社群媒體連結容器 -->
      <InformationSidebar :is-sidebar-open="isSidebarOpen" />
    </nav>
  </div>
</template>

<script>
import sidebarItemList from '../assets/sidebar-list.json'
import InformationSidebar from './InformationSidebar.vue'

/**
 * CollapseSidebar 組件
 *
 * 用途：
 * - 可收合的側邊欄導航選單
 * - 響應式設計：小裝置（< 768px）預設收合，大裝置預設展開
 * - 支援手動切換收合/展開狀態
 * - 監聽視窗大小變化自動調整
 * - 包含社群媒體連結（YouTube, Twitter, Discord, Facebook, Plurk, Bluesky）
 *
 * 使用範例：
 * <CollapseSidebar @sidebar-toggle="handleSidebarToggle" />
 *
 * @component
 * @emits {boolean} sidebar-toggle - 側邊欄狀態變更時觸發（true=展開，false=收合）
 */
export default {
  name: 'CollapseSidebar',

  components: {
    InformationSidebar,
  },

  data() {
    return {
      /**
       * 側邊欄開啟狀態
       * 小裝置預設收合，大裝置預設展開
       * @type {Boolean}
       */
      isSidebarOpen: !this.isSmallDevice(),

      /**
       * 側邊欄選單項目列表
       * 從 sidebar-list.json 匯入
       * @type {Array}
       */
      sidebarItems: sidebarItemList,
    }
  },

  created() {
    // 組件創建時通知父組件初始狀態
    this.$nextTick(() => {
      this.$emit('sidebar-toggle', this.isSidebarOpen)
    })

    // 監聽視窗大小變化
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    // 移除事件監聽器，防止記憶體洩漏
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    /**
     * 切換側邊欄開啟/收合狀態
     * 並通知父組件狀態變更
     */
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('sidebar-toggle', this.isSidebarOpen)
    },

    /**
     * 檢查是否為小裝置
     * @returns {Boolean} 視窗寬度 < 768px 為 true，否則為 false
     */
    isSmallDevice() {
      return window.innerWidth < 768
    },

    /**
     * 處理視窗大小變化事件
     * 當視窗縮小至小裝置尺寸時自動收合側邊欄
     */
    handleResize() {
      if (this.isSmallDevice() && this.isSidebarOpen) {
        this.isSidebarOpen = false
        this.$emit('sidebar-toggle', false)
      }
    },
  },
}
</script>

<!-- 引入外部樣式表 -->
<style scoped src="../css/CollapseSidebar.css"></style>
<style scoped src="../css/ItemIcon.css"></style>
