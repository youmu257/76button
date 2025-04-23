<template>
  <div :class="['app-wrapper', { 'msb-x': !isSidebarOpen }]">
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
          <a :href="item.href">
            <span :class="item.icon" />
            <span style="margin-left: 10px;">{{ item.text }}</span>
          </a>
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
      isSidebarOpen: true,
      sidebarItems: sidebarItemList,
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
}
</script>
<style scoped src="../css/CollapseSidebar.css"></style>
<style scoped src="../css/ItemIcon.css"></style>