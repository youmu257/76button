<template>
  <div class="tag-search-container">
    <!-- 頁面標題 -->
    <PageHeader
      msg="祈菈直播標籤搜尋"
      img-src="https://cdn.discordapp.com/attachments/832562348669009920/1059859135774064711/1nnnvvvcdf.jpg?ex=6916a4fd&is=6915537d&hm=30853379750e7808432751e39d5d86db22c67f4513d3fd6dcf96847666d56105"
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
          placeholder="輸入關鍵字搜尋影片標題或標籤..."
          aria-label="搜尋影片"
        >
        <i
          v-if="searchKeyword"
          class="bi bi-x-circle clear-icon"
          @click="clearSearch"
          aria-label="清除搜尋"
        />
      </div>
    </div>

    <!-- 搜尋結果數量 -->
    <div
      v-if="filteredVideos.length > 0"
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
        v-if="searchKeyword && filteredVideos.length === 0"
        class="no-results"
      >
        找不到符合的結果
      </div>

      <div
        v-else-if="filteredVideos.length > 0"
        class="results-list"
      >
        <div
          v-for="(video, index) in filteredVideos"
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
              :title="getTagTypeName(tag.t)"
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
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

/**
 * TagSearch 組件
 *
 * 用途：
 * - 提供影片標籤搜尋功能
 * - 支援標籤關鍵字搜尋
 * - 搜尋結果即時更新（延遲1秒）
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
        const keyword = this.debouncedKeyword.toLowerCase()
        results = results.filter((video) => {
          // 搜尋標籤名稱
          const tagMatch = video.tag.some((tagObj) =>
            tagObj.n && tagObj.n.toLowerCase().includes(keyword)
          )
          // 搜尋影片標題
          const titleMatch = video.title && video.title.toLowerCase().includes(keyword)
          return tagMatch || titleMatch
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
  },

  watch: {
    /**
     * 監聽搜尋關鍵字變化，延遲1秒後更新結果
     * @param {String} newValue - 新的搜尋關鍵字
     */
    searchKeyword(newValue) {
      // 清除之前的計時器
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // 設定新的延遲計時器（1秒）
      this.searchTimeout = setTimeout(() => {
        this.debouncedKeyword = newValue
      }, 1000)
    },
  },

  mounted() {
    // 載入影片標籤資料
    this.loadVideoTags()
    // 載入篩選選項資料
    this.loadFilterOptions()
  },

  beforeUnmount() {
    // 清除計時器
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },

  methods: {
    /**
     * 載入影片標籤資料
     */
    async loadVideoTags() {
      try {
        const response = await fetch(VIDEO_TAGS_CSV_URL)
        const csvText = await response.text()
        
        // 解析 CSV 資料
        this.videoTags = this.parseCSV(csvText)
      } catch (error) {
        console.error('載入影片標籤資料失敗:', error)
        this.videoTags = []
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
      try {
        const response = await fetch(FILTER_OPTIONS_CSV_URL)
        const csvText = await response.text()
        
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
      } catch (error) {
        console.error('載入篩選選項失敗:', error)
      }
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
  },
}
</script>

<style scoped src="../css/TagSearch.css"></style>
