<template>
  <div class="tag-search-container">
    <!-- 頁面標題 -->
    <PageHeader
      msg="祈菈‧貝希毛絲博物館"
      :img-src="require('@/assets/esu_chilla.png')"
      title="搜尋影片標籤或標題"
    />
    <hr>

    <!-- 搜尋欄位 -->
    <div class="search-input-wrapper">
      <!-- 下拉選單區 -->
      <div class="filter-container">
        <!-- 種類下拉選單 -->
        <div class="filter-group">
          <label for="category-select">種類：</label>
          <select
            id="category-select"
            v-model="selectedCategory"
            class="filter-select"
          >
            <option value="">
              全部
            </option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- 角色下拉選單 -->
        <div class="filter-group">
          <label for="character-select">角色：</label>
          <select
            id="character-select"
            v-model="selectedCharacter"
            class="filter-select"
          >
            <option value="">
              全部
            </option>
            <option
              v-for="character in characters"
              :key="character"
              :value="character"
            >
              {{ character }}
            </option>
          </select>
        </div>
      </div>

      <!-- 搜尋輸入框 -->
      <div class="search-input-container">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="輸入關鍵字搜尋影片標題或標籤（多個關鍵字用空格分隔）..."
          aria-label="搜尋影片"
        >
        <span
          v-if="isSearching"
          class="search-spinner"
          aria-label="搜尋中"
          role="status"
        />
        <i
          v-else-if="searchKeyword"
          class="bi bi-x-circle clear-icon"
          aria-label="清除搜尋"
          @click="clearSearch"
        />
      </div>

      <!-- 目前套用的篩選條件摘要 -->
      <div
        v-if="hasActiveFilters"
        class="active-filters"
      >
        <span
          v-if="selectedCategory"
          class="filter-chip"
        >
          種類：{{ selectedCategory }}
          <i
            class="bi bi-x"
            role="button"
            tabindex="0"
            :aria-label="`移除種類篩選：${selectedCategory}`"
            @click="selectedCategory = ''"
            @keydown.enter="selectedCategory = ''"
          />
        </span>
        <span
          v-if="selectedCharacter"
          class="filter-chip"
        >
          角色：{{ selectedCharacter }}
          <i
            class="bi bi-x"
            role="button"
            tabindex="0"
            :aria-label="`移除角色篩選：${selectedCharacter}`"
            @click="selectedCharacter = ''"
            @keydown.enter="selectedCharacter = ''"
          />
        </span>
        <span
          v-if="searchKeyword"
          class="filter-chip"
        >
          關鍵字：「{{ searchKeyword }}」
          <i
            class="bi bi-x"
            role="button"
            tabindex="0"
            aria-label="清除關鍵字搜尋"
            @click="clearSearch"
            @keydown.enter="clearSearch"
          />
        </span>
        <button
          type="button"
          class="reset-filter-btn"
          @click="resetFilters"
        >
          <i class="bi bi-arrow-counterclockwise" /> 清除所有篩選
        </button>
      </div>
    </div>

    <!-- 載入失敗提示 -->
    <div
      v-if="loadError"
      class="load-error"
    >
      <i class="bi bi-exclamation-triangle" /> 資料載入失敗，請檢查網路連線後重試
      <button
        type="button"
        class="retry-btn"
        @click="retryLoad"
      >
        <i class="bi bi-arrow-clockwise" /> 重新載入
      </button>
    </div>

    <!-- 載入中提示 -->
    <div
      v-else-if="isLoading"
      class="loading-container"
    >
      <div class="loading-spinner" />
      <p>載入中...</p>
    </div>

    <!-- 搜尋結果數量 -->
    <div
      v-else-if="filteredVideos.length > 0"
      class="result-count"
    >
      找到 {{ filteredVideos.length }} 個結果
      <span
        v-if="latestVideoDate"
        class="latest-date"
      >
        （最新影片：{{ latestVideoDate }}）
      </span>
    </div>

    <!-- 結果區塊 -->
    <div class="search-results">
      <div
        v-if="loadError"
        class="placeholder-text"
      >
        <!-- 錯誤訊息已顯示於上方，此處不重複顯示 -->
      </div>

      <div
        v-else-if="isLoading"
        class="placeholder-text"
      >
        <!-- 載入中時不顯示其他內容 -->
      </div>

      <div
        v-else-if="searchKeyword && filteredVideos.length === 0"
        class="no-results"
      >
        找不到符合的結果
      </div>

      <div
        v-else-if="filteredVideos.length > 0"
        class="results-list"
      >
        <div
          v-for="(video, index) in visibleVideos"
          :key="index"
          class="result-item"
        >
          <h3 class="video-title">
            <a
              :href="`https://www.youtube.com/watch?v=${video.url}`"
              target="_blank"
              rel="noopener noreferrer"
              class="video-title-link"
              :aria-label="`前往 ${video.title}`"
            >
              {{ video.title }}
            </a>
          </h3>
          <div class="video-time">
            {{ formatDate(video.time) }}
          </div>
          <div class="video-tags">
            <span
              v-for="(tag, tagIndex) in video.tag"
              :key="tagIndex"
              :class="['tag-badge', `tag-type-${tag.t}`]"
              :title="`依「${tag.n}」（${getTagTypeName(tag.t)}）篩選`"
              role="button"
              tabindex="0"
              @click="filterByTag(tag)"
              @keydown.enter="filterByTag(tag)"
              @keydown.space.prevent="filterByTag(tag)"
            >
              {{ tag.n }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="placeholder-text"
      >
        請輸入關鍵字開始搜尋
      </div>

      <!-- 無限捲動：捲到底自動載入更多，並保留手動按鈕作為可及性備援 -->
      <div
        v-if="visibleVideos.length < filteredVideos.length"
        class="load-more-container"
      >
        <p class="load-more-info">
          已顯示 {{ visibleVideos.length }} / {{ filteredVideos.length }} 筆
        </p>
        <button
          type="button"
          class="load-more-btn"
          @click="loadMore"
        >
          載入更多
        </button>
      </div>
    </div>

    <!-- 回到頂端按鈕 -->
    <BackToTop />
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'
import BackToTop from './BackToTop.vue'
import { readCsvCache, fetchCsvFresh } from '@/utils/csvCache'

/**
 * TagSearch 組件
 *
 * 用途：
 * - 提供影片標籤搜尋功能
 * - 支援標籤關鍵字搜尋
 * - 搜尋結果即時更新（延遲 350ms）
 *
 * @component
 */

// CSV 資料來源
const VIDEO_TAGS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS646227OvUq_-4hpXKdasVYisK6fdKGlX0_zova3YLwQrMd4SVJl6013u6TpS8m7PSfWoaQog-wse0/pub?gid=0&single=true&output=csv'
const FILTER_OPTIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS646227OvUq_-4hpXKdasVYisK6fdKGlX0_zova3YLwQrMd4SVJl6013u6TpS8m7PSfWoaQog-wse0/pub?gid=907338705&single=true&output=csv'

// 標籤類型對應表
const TAG_TYPE_MAP = {
  1: '類型',
  2: '遊戲',
  3: '歌曲',
  4: '人員',
  5: '場次'
}

export default {
  name: 'TagSearch',

  components: {
    PageHeader,
    BackToTop,
  },

  data() {
    return {
      /**
       * 搜尋關鍵字
       * @type {String}
       */
      searchKeyword: '',

      /**
       * 搜尋延遲計時器
       * @type {Number|null}
       */
      searchTimeout: null,

      /**
       * 延遲後的搜尋關鍵字
       * @type {String}
       */
      debouncedKeyword: '',

      /**
       * 影片標籤資料
       * @type {Array}
       */
      videoTags: [],

      /**
       * 選中的種類
       * @type {String}
       */
      selectedCategory: '',

      /**
       * 選中的角色
       * @type {String}
       */
      selectedCharacter: '',

      /**
       * 種類列表
       * @type {Array}
       */
      categories: [],

      /**
       * 角色列表
       * @type {Array}
       */
      characters: [],

      /**
       * 是否正在載入資料
       * @type {Boolean}
       */
      isLoading: true,

      /**
       * 資料載入是否失敗
       * @type {Boolean}
       */
      loadError: false,

      /**
       * 搜尋防抖期間是否顯示「搜尋中」提示
       * @type {Boolean}
       */
      isSearching: false,

      /**
       * 無限捲動目前顯示的筆數
       * @type {Number}
       */
      visibleCount: 20,

      /**
       * 每次捲動到底或按「載入更多」時，增加顯示的筆數
       * @type {Number}
       */
      loadBatchSize: 20,

      /**
       * scroll 事件節流用的旗標
       * @type {Boolean}
       */
      scrollTicking: false,
    }
  },

  computed: {
    /**
     * 過濾後的影片列表
     * @returns {Array} 符合搜尋條件的影片
     */
    filteredVideos() {
      let results = this.videoTags

      // 根據種類篩選
      if (this.selectedCategory) {
        results = results.filter((video) =>
          video.tag.some((tagObj) =>
            tagObj.t === 1 && tagObj.n === this.selectedCategory
          )
        )
      }

      // 根據角色篩選
      if (this.selectedCharacter) {
        results = results.filter((video) =>
          video.tag.some((tagObj) =>
            tagObj.t === 4 && tagObj.n === this.selectedCharacter
          )
        )
      }

      // 根據關鍵字搜尋（標籤名稱和影片標題）
      if (this.debouncedKeyword.trim()) {
        // 分割多個關鍵字（用空格分隔）
        const keywords = this.debouncedKeyword.toLowerCase().trim().split(/\s+/).filter(k => k)
        
        results = results.filter((video) => {
          // 每個關鍵字都要匹配（AND 邏輯）
          return keywords.every(keyword => {
            // 搜尋標籤名稱
            const tagMatch = video.tag.some((tagObj) =>
              tagObj.n && tagObj.n.toLowerCase().includes(keyword)
            )
            // 搜尋影片標題
            const titleMatch = video.title && video.title.toLowerCase().includes(keyword)
            return tagMatch || titleMatch
          })
        })
      }

      // 依照時間排序（由新到舊）
      results.sort((a, b) => {
        const dateA = new Date(a.time)
        const dateB = new Date(b.time)
        return dateB - dateA // 新的在前
      })

      return results
    },

    /**
     * 取得最新影片的日期（根據查詢條件）
     * @returns {String} 格式化後的最新影片日期
     */
    latestVideoDate() {
      if (this.filteredVideos.length === 0) return ''
      
      // 找出篩選結果中最新的時間
      const latestVideo = this.filteredVideos.reduce((latest, video) => {
        const latestDate = new Date(latest.time)
        const currentDate = new Date(video.time)
        return currentDate > latestDate ? video : latest
      })
      
      return this.formatDate(latestVideo.time)
    },

    /**
     * 是否有任何啟用中的篩選條件
     * @returns {Boolean}
     */
    hasActiveFilters() {
      return !!(this.selectedCategory || this.selectedCharacter || this.searchKeyword)
    },

    /**
     * 無限捲動目前應顯示的影片（依 visibleCount 截取）
     * @returns {Array}
     */
    visibleVideos() {
      return this.filteredVideos.slice(0, this.visibleCount)
    },
  },

  watch: {
    /**
     * 監聽搜尋關鍵字變化，短暫防抖後更新結果
     * @param {String} newValue - 新的搜尋關鍵字
     */
    searchKeyword(newValue) {
      // 清除之前的計時器
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.isSearching = true
      // 設定新的延遲計時器（350ms，避免使用者感覺卡頓）
      this.searchTimeout = setTimeout(() => {
        this.debouncedKeyword = newValue
        this.isSearching = false
      }, 350)
    },

    /**
     * 篩選條件改變時，重置無限捲動顯示筆數
     */
    selectedCategory() {
      this.visibleCount = this.loadBatchSize
    },
    selectedCharacter() {
      this.visibleCount = this.loadBatchSize
    },
    debouncedKeyword() {
      this.visibleCount = this.loadBatchSize
    },
  },

  async mounted() {
    await this.loadAllData()

    // 套用從標籤總覽頁帶入的篩選條件
    this.applyIncomingTagFilter()

    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    // 清除計時器
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    /**
     * 載入影片標籤資料和篩選選項資料，供初始掛載與重試按鈕共用
     */
    async loadAllData() {
      this.loadError = false

      // 若本地已有上次抓到的快取，先直接顯示，不用讓使用者空等
      const hasCache = !!(
        readCsvCache(VIDEO_TAGS_CSV_URL) &&
        readCsvCache(FILTER_OPTIONS_CSV_URL)
      )
      this.isLoading = !hasCache

      await Promise.all([
        this.loadVideoTags(),
        this.loadFilterOptions()
      ])

      this.isLoading = false
    },

    /**
     * 重新載入資料（載入失敗時的重試按鈕觸發）
     */
    async retryLoad() {
      await this.loadAllData()
    },

    /**
     * 載入影片標籤資料
     */
    async loadVideoTags() {
      const cached = readCsvCache(VIDEO_TAGS_CSV_URL)
      if (cached) {
        this.videoTags = this.parseCSV(cached)
      }

      try {
        const csvText = await fetchCsvFresh(VIDEO_TAGS_CSV_URL)
        this.videoTags = this.parseCSV(csvText)
      } catch (error) {
        console.error('載入影片標籤資料失敗:', error)
        if (!cached) {
          this.videoTags = []
          this.loadError = true
        }
      }
    },

    /**
     * 解析 CSV 資料為 JSON 格式
     * @param {String} csvText - CSV 文字內容
     * @returns {Array} 解析後的影片資料陣列
     */
    parseCSV(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim())
      const dataLines = lines.slice(1) // 跳過標題列
      
      return dataLines
        .map(line => {
          const fields = this.parseCSVLine(line)
          
          // CSV 欄位順序: 時間, 影片標題, 影片網址, 標籤
          const [time, title, url, tagString] = fields
          
          // 解析標籤 JSON 字串
          let tags = []
          if (tagString) {
            try {
              tags = JSON.parse(tagString)
            } catch (e) {
              console.log(fields)
              console.warn('標籤解析失敗:', tagString, e)
            }
          }

          return { time, title, url, tag: tags }
        })
        .filter(video => video.title && video.url) // 過濾掉空資料
    },

    /**
     * 解析 CSV 單行（處理引號內的逗號和轉義的引號）
     * @param {String} line - CSV 單行內容
     * @returns {Array} 欄位陣列
     */
    parseCSVLine(line) {
      const fields = []
      let field = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const nextChar = line[i + 1]
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // 兩個連續的引號表示一個真正的引號字元
            field += '"'
            i++ // 跳過下一個引號
          } else {
            // 切換引號狀態
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          fields.push(field)
          field = ''
        } else {
          field += char
        }
      }
      
      // 加入最後一個欄位
      fields.push(field)

      return fields
    },

    /**
     * 載入篩選選項資料
     */
    async loadFilterOptions() {
      const cached = readCsvCache(FILTER_OPTIONS_CSV_URL)
      if (cached) {
        this.applyFilterOptionsCsv(cached)
      }

      try {
        const csvText = await fetchCsvFresh(FILTER_OPTIONS_CSV_URL)
        this.applyFilterOptionsCsv(csvText)
      } catch (error) {
        console.error('載入篩選選項失敗:', error)
        if (!cached) {
          this.loadError = true
        }
      }
    },

    /**
     * 解析篩選選項 CSV 並套用到畫面上
     * @param {String} csvText - CSV 文字內容
     */
    applyFilterOptionsCsv(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim())
      const dataLines = lines.slice(1) // 跳過標題列

      const categories = []
      const characters = []

      dataLines.forEach(line => {
        const [name, typeStr] = this.parseCSVLine(line)
        const type = parseInt(typeStr)

        if (!name) return

        if (type === 1) {
          categories.push(name)
        } else if (type === 4) {
          characters.push(name)
        }
      })

      this.categories = categories
      this.characters = characters
    },

    /**
     * 取得標籤類型名稱
     * @param {Number} type - 標籤類型 (1:類型 2:遊戲 3:歌曲 4:人員 5:場次)
     * @returns {String} 標籤類型名稱
     */
    getTagTypeName(type) {
      return TAG_TYPE_MAP[type] || '未知'
    },

    /**
     * 格式化日期
     * @param {String} dateString - ISO 日期字串
     * @returns {String} 格式化後的日期字串
     */
    formatDate(dateString) {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return `${year}-${month}-${day}`
    },

    /**
     * 清除搜尋
     */
    clearSearch() {
      this.searchKeyword = ''
      this.debouncedKeyword = ''
    },

    /**
     * 點擊結果中的標籤，套用對應篩選條件
     * 種類(1) 與 角色(4) 有專屬下拉選單，直接設定；其餘類型則併入關鍵字搜尋
     * @param {Object} tag - 被點擊的標籤 { t: Number, n: String }
     */
    filterByTag(tag) {
      if (tag.t === 1) {
        this.selectedCategory = tag.n
      } else if (tag.t === 4) {
        this.selectedCharacter = tag.n
      } else {
        this.searchKeyword = tag.n
        this.debouncedKeyword = tag.n
      }
    },

    /**
     * 套用從標籤總覽頁（TagSummarySearch）帶入網址查詢參數的篩選條件
     * - 種類(1)：帶入種類下拉選單
     * - 人員(4)：若存在於角色下拉選單中則帶入下拉選單，否則帶入搜尋欄
     * - 其餘類型（遊戲、歌曲等）：帶入搜尋欄
     */
    applyIncomingTagFilter() {
      const { tagType, tagName } = this.$route.query
      if (!tagName) return

      const type = Number(tagType)

      if (type === 1) {
        this.selectedCategory = tagName
      } else if (type === 4 && this.characters.includes(tagName)) {
        this.selectedCharacter = tagName
      } else {
        this.searchKeyword = tagName
        this.debouncedKeyword = tagName
      }

      // 清除網址上的查詢參數，避免重新整理或返回時重複套用
      this.$router.replace({ path: '/video-search' })
    },

    /**
     * 清除所有篩選條件（種類、角色、關鍵字）
     */
    resetFilters() {
      this.selectedCategory = ''
      this.selectedCharacter = ''
      this.clearSearch()
    },

    /**
     * 增加無限捲動目前顯示的筆數（不超過篩選結果總數）
     */
    loadMore() {
      if (this.visibleCount >= this.filteredVideos.length) return
      this.visibleCount = Math.min(this.visibleCount + this.loadBatchSize, this.filteredVideos.length)
    },

    /**
     * 監聽捲動事件，接近頁面底部時自動載入更多結果
     * 使用 requestAnimationFrame 節流，避免高頻率觸發
     */
    handleScroll() {
      if (this.scrollTicking) return
      this.scrollTicking = true

      requestAnimationFrame(() => {
        this.scrollTicking = false

        if (this.isLoading || this.loadError) return

        const scrollPosition = window.innerHeight + window.scrollY
        const threshold = document.documentElement.scrollHeight - 300
        if (scrollPosition >= threshold) {
          this.loadMore()
        }
      })
    },
  },
}
</script>

<style scoped src="../css/VideoSearch.css"></style>
