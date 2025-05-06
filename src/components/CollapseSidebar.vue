<template>
  <div class="sidebar-container">
    <!-- Sidebar -->
    <nav
      id="sidebar"
      :class="{ 'active': !isSidebarOpen }"
    >
      <div class="sidebar-header">
        <h3 v-if="isSidebarOpen">
          毛絲選單
        </h3>
        <button
          id="sidebarCollapse"
          @click="toggleSidebar"
        >
          <svg
            v-if="isSidebarOpen"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"
            />
          </svg>
        </button>
      </div>
      <ul class="list-unstyled components">
        <li
          v-for="(item, index) in sidebarItems"
          :key="index"
        >
          <router-link :to="item.href">
            <span :class="item.icon" />
            <span style="margin-left: 10px;">{{ item.text }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import sidebarItemList from '../assets/sidebar-list.json'

export default {
  name: 'CollapseSidebar',
  data() {
    return {
      isSidebarOpen: !this.isSmallDevice(), // 如果是小裝置預設為 false
      sidebarItems: sidebarItemList,
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      // 通知父組件側邊欄狀態變更
      this.$emit('sidebar-toggle', this.isSidebarOpen)
    },
    isSmallDevice() {
      // 檢查是否為小裝置
      return window.innerWidth < 768
    }
  },
  created() {
    // 在組件創建時通知父組件初始狀態
    this.$nextTick(() => {
      this.$emit('sidebar-toggle', this.isSidebarOpen)
    })
    
    // 監聽視窗大小變化，調整側邊欄狀態
    window.addEventListener('resize', () => {
      if (this.isSmallDevice() && this.isSidebarOpen) {
        this.isSidebarOpen = false
        this.$emit('sidebar-toggle', false)
      }
    })
  }
}
</script>

<style scoped src="../css/CollapseSidebar.css"></style>
<style scoped src="../css/ItemIcon.css"></style>