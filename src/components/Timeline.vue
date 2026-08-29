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
    <!-- 切換按鈕 (只在未開啟滑動開關時顯示) -->
    <div
      v-if="!isAlternate"
      class="tab-buttons"
    >
      <button
        :class="{ active: currentTab === 'history' }"
        @click="switchTab('history')"
      >
        歷史
      </button>
      <button
        :class="{ active: currentTab === 'session' }"
        @click="switchTab('session')"
      >
        場次/線下活動
      </button>
      <button
        :class="{ active: currentTab === 'highlight' }"
        @click="switchTab('highlight')"
      >
        精華/企劃
      </button>
    </div>
    <!-- 依年份分組的時間軸：取代左右交錯排列，所有分頁（含鴨子模式）皆使用 -->
    <div class="history-view">
      <div class="history-layout">
        <aside class="history-rail">
          <div class="history-search">
            <input
              v-model="historySearchKeyword"
              type="text"
              class="history-search-input"
              placeholder="搜尋事件標題或描述..."
              aria-label="搜尋大事記"
            >
            <i
              v-if="historySearchKeyword"
              class="bi bi-x-circle history-clear-icon"
              aria-label="清除搜尋"
              @click="clearHistorySearch"
            />
          </div>
          <nav
            class="history-year-nav"
            aria-label="年份導覽"
          >
            <button
              v-for="group in historyYears"
              :key="group.year"
              type="button"
              :class="['history-year-pill', { active: activeHistoryYear === group.year }]"
              :hidden="!filteredHistoryYears.some((g) => g.year === group.year)"
              @click="scrollToHistoryYear(group.year)"
            >
              <span class="year-num">{{ group.year }}</span>
              <span class="year-count">{{ group.items.length }}</span>
            </button>
          </nav>
        </aside>

        <div class="history-ledger">
          <div
            class="history-spine"
            aria-hidden="true"
          />

          <div
            v-if="filteredHistoryYears.length === 0"
            class="history-empty"
          >
            找不到符合的事件
          </div>

          <section
            v-for="group in filteredHistoryYears"
            :id="`history-year-${group.year}`"
            :key="group.year"
            ref="historyYearSection"
            class="history-year-section"
            :data-year="group.year"
          >
            <div class="history-year-plaque">
              <span class="year-num">{{ group.year }}</span>
              <span class="year-meta">{{ group.items.length }} 筆事件</span>
            </div>

            <div class="history-events">
              <article
                v-for="(item, idx) in group.items"
                :key="`${group.year}-${idx}`"
                class="history-event"
              >
                <div class="history-tick">
                  <span class="history-date">{{ item.date.slice(5).replace('-', '/') }}</span>
                  <span class="history-dot" />
                </div>

                <div class="history-card">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>

                  <template v-if="item.video">
                    <div
                      v-if="getYouTubeId(item)"
                      class="history-media"
                    >
                      <div
                        v-if="!loadedVideoFacades.has(getYouTubeId(item))"
                        class="history-facade"
                        role="button"
                        tabindex="0"
                        :aria-label="`播放：${item.title}`"
                        @click="playVideoFacade(getYouTubeId(item))"
                        @keydown.enter="playVideoFacade(getYouTubeId(item))"
                        @keydown.space.prevent="playVideoFacade(getYouTubeId(item))"
                      >
                        <img
                          :src="`https://img.youtube.com/vi/${getYouTubeId(item)}/mqdefault.jpg`"
                          :alt="item.title"
                          loading="lazy"
                          class="history-thumb"
                        >
                        <span class="history-play-btn"><i class="bi bi-play-fill" /></span>
                      </div>
                      <div
                        v-else
                        class="history-video-frame"
                      >
                        <iframe
                          :src="`https://www.youtube-nocookie.com/embed/${getYouTubeId(item)}?autoplay=1`"
                          :title="item.title"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerpolicy="strict-origin-when-cross-origin"
                          allowfullscreen
                        />
                      </div>
                    </div>
                    <span
                      v-else
                      class="history-chip"
                    ><i class="bi bi-play-fill" /> 直播影片</span>
                  </template>
                  <div
                    v-if="item.image"
                    class="history-media"
                  >
                    <img
                      :src="item.image"
                      :alt="item.title"
                      class="history-image"
                      loading="lazy"
                      @click="openLightbox(item.image)"
                    >
                  </div>

                  <div class="history-links">
                    <a
                      v-if="item.link"
                      :href="item.link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="history-link"
                    >{{ item.link.text }}</a>
                    <a
                      v-if="item.link2"
                      :href="item.link2.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="history-link"
                    >{{ item.link2.text }}</a>
                  </div>
                </div>
              </article>
            </div>
          </section>
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
import timelineChillaData from '../assets/timeline-chilla-data.json'
import timelineSessionData from '../assets/timeline-session-data.json'
import timelineHighlightData from '../assets/timeline-highlight-data.json'
import timelineDuckData from '../assets/timeline-duck-data.json'

export default {
  name: 'Timeline',
  components: {
    PageHeader,
    BackToTop,
  },
  data() {
    return {
      lightboxImage: null, // 燈箱顯示的圖片 URL
      isAlternate: false, // 控制是否切換到 duck 模式
      currentTab: 'history', // 當前選中的分頁（'history', 'session', 'highlight'）
      historySearchKeyword: '', // 歷史時間軸的搜尋關鍵字
      activeHistoryYear: null, // 目前捲動到的年份，用於年份導覽反白
      loadedVideoFacades: new Set(), // 已點擊播放、載入 iframe 的影片 ID
      yearObserver: null, // 監控歷史時間軸年份區塊的 IntersectionObserver
    }
  },
  computed: {
    /**
     * 將目前分頁的資料（currentData）依年份分組
     * @returns {Array<{year: String, items: Array}>}
     */
    historyYears() {
      const map = new Map()
      this.currentData.items.forEach((item) => {
        const year = item.date.slice(0, 4)
        if (!map.has(year)) map.set(year, [])
        map.get(year).push(item)
      })
      return Array.from(map, ([year, items]) => ({ year, items }))
    },

    /**
     * 根據搜尋關鍵字過濾後的年份分組（過濾標題與描述）
     * @returns {Array<{year: String, items: Array}>}
     */
    filteredHistoryYears() {
      const keyword = this.historySearchKeyword.trim().toLowerCase()
      if (!keyword) return this.historyYears

      return this.historyYears
        .map(({ year, items }) => ({
          year,
          items: items.filter((item) =>
            item.title.toLowerCase().includes(keyword) ||
            (item.description || '').toLowerCase().includes(keyword)
          ),
        }))
        .filter((group) => group.items.length > 0)
    },

    /**
     * 根據 isAlternate 和 currentTab 狀態返回對應的時間軸資料
     * @returns {Object} 當前應顯示的時間軸資料（包含 title 和 items）
     */
    currentData() {
      // 如果開啟滑動開關，顯示 duck 資料
      if (this.isAlternate) {
        return timelineDuckData
      }
      // 否則根據選中的分頁顯示對應資料
      switch (this.currentTab) {
      case 'session':
        return timelineSessionData
      case 'highlight':
        return timelineHighlightData
      case 'history':
      default:
        return timelineChillaData
      }
    },
  },
  watch: {
    /**
     * 搜尋關鍵字改變時，DOM 中的年份區塊會增減，需要重新初始化 observer
     */
    historySearchKeyword() {
      this.$nextTick(() => {
        this.initYearObserver()
      })
    },
  },
  mounted() {
    // 組件掛載後，等待 DOM 完全渲染再初始化 observer
    this.$nextTick(() => {
      this.initYearObserver()
    })
  },
  beforeUnmount() {
    // 組件卸載前清理 observer，防止記憶體洩漏
    this.cleanupYearObserver()
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
     * 切換分頁
     * @param {string} tab - 要切換到的分頁 ('history', 'session', 'highlight')
     */
    switchTab(tab) {
      if (this.currentTab === tab) return
      this.currentTab = tab
      // 切換分頁時資料集會改變，重置搜尋與年份反白狀態
      this.historySearchKeyword = ''
      this.activeHistoryYear = null
      this.resetTimeline()
    },
    /**
     * 切換滑動開關時的處理
     * 清理舊的 observer、重置狀態、等待 DOM 更新後重新初始化
     */
    toggleTimeline() {
      this.resetTimeline()
    },
    /**
     * 重置時間軸狀態並重新初始化 observer
     */
    resetTimeline() {
      // 清理依年份分組時間軸的年份 observer
      this.cleanupYearObserver()

      // 等待 DOM 更新完成後重新初始化 observer
      this.$nextTick(() => {
        this.initYearObserver()
      })
    },
    /**
     * 從事件的連結中解析出 YouTube 影片 ID
     * @param {Object} item - 時間軸事件項目
     * @returns {String|null} YouTube 影片 ID，解析失敗則回傳 null
     */
    getYouTubeId(item) {
      const url = (item.link && item.link.url) || (item.link2 && item.link2.url) || ''
      const match = url.match(/(?:\/live\/|\/watch\?v=|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{6,15})/)
      return match ? match[1] : null
    },
    /**
     * 點擊縮圖播放按鈕時，載入真正的 YouTube iframe
     * @param {String} videoId - YouTube 影片 ID
     */
    playVideoFacade(videoId) {
      this.loadedVideoFacades.add(videoId)
    },
    /**
     * 點擊年份導覽時，捲動到對應的年份區塊
     * @param {String} year - 年份字串
     */
    scrollToHistoryYear(year) {
      const el = document.getElementById(`history-year-${year}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    /**
     * 清除歷史時間軸的搜尋關鍵字
     */
    clearHistorySearch() {
      this.historySearchKeyword = ''
    },
    /**
     * 初始化監控歷史時間軸年份區塊的 IntersectionObserver
     * 用於捲動時反白年份導覽中對應的年份
     */
    initYearObserver() {
      this.cleanupYearObserver()

      const sections = this.$refs.historyYearSection
      if (!sections || sections.length === 0) return

      this.yearObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeHistoryYear = entry.target.dataset.year
          }
        })
      }, {
        rootMargin: '-15% 0px -75% 0px',
        threshold: 0,
      })

      sections.forEach((el) => this.yearObserver.observe(el))
    },
    /**
     * 清理年份 IntersectionObserver 實例
     */
    cleanupYearObserver() {
      if (this.yearObserver) {
        this.yearObserver.disconnect()
        this.yearObserver = null
      }
    },
  },
}
</script>

<style scoped src="../css/Timeline.css"></style>
