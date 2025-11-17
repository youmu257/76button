<template>
  <div class="timeline-container">
    <!-- 頁面標題 -->
    <PageHeader
      msg="祈菈‧貝希毛絲博物館"
      img-src="https://pbs.twimg.com/media/FBqv59MUcAk66Yy?format=jpg&name=900x900"
      :title="currentData.title"
    />
    <hr>
    <!-- 滑動開關 -->
    <div class="toggle-switch">
      <label>
        <input
          v-model="isAlternate"
          type="checkbox"
          @change="toggleTimeline"
        >
        <span class="slider" />
      </label>
    </div>
    <div class="timeline">
      <div
        v-for="(item, index) in currentData.items"
        :key="`${isAlternate}-${index}`"
        class="timeline-item"
        :class="{ 'timeline-item-odd': index % 2 === 1 }"
      >
        <div class="timeline-dot" />
        <div class="timeline-date-center">
          <div class="date-label">
            {{ item.date }}
          </div>
        </div>
        <div class="timeline-content">
          <h3>{{ item.title }}</h3>
          <div class="content-body">
            <p>{{ item.description }}</p>
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="timeline-image"
              @click="openLightbox(item.image)"
            >
            <div
              v-if="item.video"
              :ref="(el) => setVideoRef(el)"
              class="video-container"
              :data-index="index"
            >
              <iframe
                v-if="visibleVideos[index]"
                :src="item.video"
                width="560"
                height="315"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
            <a
              v-if="item.link"
              :href="item.link.url"
              target="_blank"
              class="timeline-link"
            >
              {{ item.link.text }}
            </a>
            <a
              v-if="item.link2"
              :href="item.link2.url"
              target="_blank"
              class="timeline-link"
            >
              {{ item.link2.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="lightboxImage"
      class="lightbox"
      @click="closeLightbox"
    >
      <img
        :src="lightboxImage"
        alt="放大圖片"
      >
    </div>
    <!-- 回到頂端按鈕 -->
    <BackToTop />
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'
import BackToTop from './BackToTop.vue'
import timelineData from '../assets/timeline-chilla-data.json'
import alternateTimelineData from '../assets/timeline-duck-data.json'

export default {
  name: 'Timeline',
  components: {
    PageHeader,
    BackToTop,
  },
  data() {
    return {
      lightboxImage: null, // 燈箱顯示的圖片 URL
      isAlternate: false, // 控制是否切換到另一組 JSON 資料（false: chilla, true: duck）
      visibleVideos: {}, // 記錄哪些影片容器已進入可視範圍，用於延遲載入 iframe
      observer: null, // IntersectionObserver 實例，用於監控影片容器是否進入可視範圍
      videoContainers: [], // 儲存所有影片容器的 DOM 元素引用
    }
  },
  computed: {
    /**
     * 根據 isAlternate 狀態返回對應的時間軸資料
     * @returns {Object} 當前應顯示的時間軸資料（包含 title 和 items）
     */
    currentData() {
      return this.isAlternate ? alternateTimelineData : timelineData
    },
  },
  mounted() {
    // 組件掛載後，等待 DOM 完全渲染再初始化 observer
    this.$nextTick(() => {
      this.initObserver()
    })
  },
  beforeUnmount() {
    // 組件卸載前清理 observer，防止記憶體洩漏
    this.cleanupObserver()
  },
  methods: {
    /**
     * 開啟圖片燈箱
     * @param {string} image - 圖片的 URL
     */
    openLightbox(image) {
      this.lightboxImage = image
    },
    /**
     * 關閉圖片燈箱
     */
    closeLightbox() {
      this.lightboxImage = null
    },
    /**
     * 收集影片容器的 DOM 元素引用
     * 使用函數式 ref，在 Vue 渲染時自動調用
     * @param {HTMLElement} el - 影片容器的 DOM 元素
     */
    setVideoRef(el) {
      if (el && !this.videoContainers.includes(el)) {
        this.videoContainers.push(el)
      }
    },
    /**
     * 切換時間軸資料時的處理
     * 清理舊的 observer、重置狀態、等待 DOM 更新後重新初始化
     */
    toggleTimeline() {
      // 清理舊的 IntersectionObserver
      this.cleanupObserver()
      // 重置影片可見性狀態
      this.visibleVideos = {}
      // 清空影片容器引用
      this.videoContainers = []

      // 等待 DOM 更新完成後重新初始化 observer
      this.$nextTick(() => {
        this.initObserver()
      })
    },
    /**
     * 初始化 IntersectionObserver 來監控影片容器
     * 當影片容器進入可視範圍時才載入 iframe，提升頁面效能
     */
    initObserver() {
      const options = {
        root: null, // 使用視窗作為根元素
        rootMargin: '0px', // 不擴展視窗邊界
        threshold: 0.1, // 當 10% 的元素可見時觸發
      }

      // 建立 IntersectionObserver 實例
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // 當元素進入可視範圍時
          if (entry.isIntersecting) {
            // 從 data-index 屬性取得索引值
            const index = parseInt(entry.target.dataset.index)
            // 標記該影片為可見，觸發 iframe 渲染
            this.visibleVideos[index] = true
            // 停止觀察已載入的元素，避免重複處理
            this.observer.unobserve(entry.target)
          }
        })
      }, options)

      // 對所有影片容器啟動觀察
      this.videoContainers.forEach((container) => {
        if (container) {
          this.observer.observe(container)
        }
      })
    },
    /**
     * 清理 IntersectionObserver 實例
     * 釋放資源，防止記憶體洩漏
     */
    cleanupObserver() {
      if (this.observer) {
        this.observer.disconnect() // 停止所有觀察
        this.observer = null // 釋放引用
      }
    },
  },
}
</script>

<style scoped src="../css/Timeline.css"></style>
