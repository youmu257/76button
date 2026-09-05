<template>
  <div class="summary-search-container">
    <!-- 頁面標題 -->
    <PageHeader
      msg="祈菈‧貝希毛絲博物館"
      img-src="https://pbs.twimg.com/media/F--gTlqbsAACBPs?format=jpg&name=large"
      title="查看出現過的標籤"
    />
    <hr>

    <!-- 切換按鈕 -->
    <div class="toggle-buttons">
      <button
        :class="['toggle-btn', { active: activeTab === 'streamType' }]"
        @click="activeTab = 'streamType'"
      >
        開台類型 ({{ streamTypes.length }})
      </button>
      <button
        :class="['toggle-btn', { active: activeTab === 'game' }]"
        @click="activeTab = 'game'"
      >
        遊戲 ({{ games.length }})
      </button>
      <button
        :class="['toggle-btn', { active: activeTab === 'song' }]"
        @click="activeTab = 'song'"
      >
        歌曲 ({{ songs.length }})
      </button>
      <button
        :class="['toggle-btn', { active: activeTab === 'character' }]"
        @click="activeTab = 'character'"
      >
        人員 ({{ characters.length }})
      </button>
    </div>

    <!-- 搜尋輸入框 -->
    <div class="search-input-container">
      <input
        v-model="searchKeyword"
        type="text"
        class="search-input"
        placeholder="輸入關鍵字篩選..."
        aria-label="搜尋標籤"
      >
      <i
        v-if="searchKeyword"
        class="bi bi-x-circle clear-icon"
        aria-label="清除搜尋"
        @click="clearSearch"
      />
    </div>

    <!-- 說明文字 -->
    <div class="info-text">
      標籤下的數字代表在直播影片中出現的次數
    </div>

    <!-- 載入中提示 -->
    <div
      v-if="isLoading"
      class="loading-container"
    >
      <div class="loading-spinner" />
      <p>載入中...</p>
    </div>

    <!-- 列表顯示 -->
    <div
      v-else
      class="list-container"
    >
      <div
        v-if="searchKeyword && filteredList.length === 0"
        class="empty-message"
      >
        找不到符合的結果
      </div>
      <div
        v-else
        class="items-grid"
      >
        <div
          v-for="(item, index) in filteredList"
          :key="index"
          class="item-card"
          role="button"
          tabindex="0"
          :title="`前往搜尋含「${item.name}」的影片`"
          @click="goToVideoSearch(item)"
          @keydown.enter="goToVideoSearch(item)"
          @keydown.space.prevent="goToVideoSearch(item)"
        >
          <span class="item-name">{{ item.name }}</span>
          <span class="item-count">({{ item.count }})</span>
        </div>
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
 * TagSummarySearch 組件
 *
 * 用途：
 * - 顯示所有標籤的分類總覽
 * - 可切換查看遊戲、歌曲、人員列表
 *
 * @component
 */

const VIDEO_TAGS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS646227OvUq_-4hpXKdasVYisK6fdKGlX0_zova3YLwQrMd4SVJl6013u6TpS8m7PSfWoaQog-wse0/pub?gid=0&single=true&output=csv'

const TAG_TYPES = {
  STREAM_TYPE: 1,
  GAME: 2,
  SONG: 3,
  CHARACTER: 4,
}

const CSV_FIELD_INDEX = {
  TIMESTAMP: 0,
  TITLE: 1,
  URL: 2,
  TAGS: 3,
}

export default {
  name: 'TagSummarySearch',

  components: {
    PageHeader,
    BackToTop,
  },

  data() {
    return {
      /**
       * 當前顯示的分頁
       * @type {String} 'streamType' | 'game' | 'song' | 'character'
       */
      activeTab: 'streamType',

      /**
       * 搜尋關鍵字
       * @type {String}
       */
      searchKeyword: '',

      /**
       * 開台類型列表（包含名稱和次數）
       * @type {Array<{name: String, count: Number}>}
       */
      streamTypes: [],

      /**
       * 遊戲列表（包含名稱和次數）
       * @type {Array<{name: String, count: Number}>}
       */
      games: [],

      /**
       * 歌曲列表（包含名稱和次數）
       * @type {Array<{name: String, count: Number}>}
       */
      songs: [],

      /**
       * 人員列表（包含名稱和次數）
       * @type {Array<{name: String, count: Number}>}
       */
      characters: [],

      /**
       * 是否正在載入資料
       * @type {Boolean}
       */
      isLoading: true,
    }
  },

  computed: {
    /**
     * 根據當前分頁返回對應的列表
     * @returns {Array<String>} 當前顯示的列表
     */
    currentList() {
      switch (this.activeTab) {
      case 'streamType':
        return this.streamTypes
      case 'game':
        return this.games
      case 'song':
        return this.songs
      case 'character':
        return this.characters
      default:
        return []
      }
    },

    /**
     * 過濾後的列表（根據搜尋關鍵字）
     * @returns {Array<{name: String, count: Number}>} 符合搜尋條件的列表
     */
    filteredList() {
      if (!this.searchKeyword.trim()) {
        return this.currentList
      }

      const keyword = this.searchKeyword.toLowerCase()
      return this.currentList.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    },
  },

  async mounted() {
    // 若本地已有上次抓到的快取，先直接顯示，不用讓使用者空等
    const cached = readCsvCache(VIDEO_TAGS_CSV_URL)
    if (cached) {
      this.applyVideoTagsCsv(cached)
      this.isLoading = false
    }

    await this.loadFilterOptions()
    this.isLoading = false
  },

  methods: {
    /**
     * 載入影片標籤資料並提取不重複的標籤
     */
    async loadFilterOptions() {
      const cached = readCsvCache(VIDEO_TAGS_CSV_URL)

      try {
        const csvText = await fetchCsvFresh(VIDEO_TAGS_CSV_URL)
        this.applyVideoTagsCsv(csvText)
      } catch (error) {
        console.error('載入影片標籤資料失敗:', error)
        if (!cached) {
          // 確保即使失敗也有空陣列
          this.streamTypes = []
          this.games = []
          this.songs = []
          this.characters = []
        }
      }
    },

    /**
     * 解析影片標籤 CSV 並統計、套用到畫面上
     * @param {String} csvText - CSV 文字內容
     */
    applyVideoTagsCsv(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim())
      const dataLines = lines.slice(1) // 跳過標題列

      // 使用 Object 儲存各類型的 Map，簡化代碼結構
      const tagMaps = {
        [TAG_TYPES.STREAM_TYPE]: new Map(),
        [TAG_TYPES.GAME]: new Map(),
        [TAG_TYPES.SONG]: new Map(),
        [TAG_TYPES.CHARACTER]: new Map(),
      }

      // 批次處理標籤
      dataLines.forEach(line => {
        const fields = this.parseCSVLine(line)
        const tagString = fields[CSV_FIELD_INDEX.TAGS]

        if (!tagString) return

        try {
          const tags = JSON.parse(tagString)
          this.processTags(tags, tagMaps)
        } catch (e) {
          // 忽略解析失敗的標籤
        }
      })

      // 轉換為排序後的陣列
      this.streamTypes = this.convertMapToSortedArray(tagMaps[TAG_TYPES.STREAM_TYPE])
      this.games = this.convertMapToSortedArray(tagMaps[TAG_TYPES.GAME])
      this.songs = this.convertMapToSortedArray(tagMaps[TAG_TYPES.SONG])
      this.characters = this.convertMapToSortedArray(tagMaps[TAG_TYPES.CHARACTER])
    },

    /**
     * 處理標籤並統計次數
     * @param {Array} tags - 標籤陣列
     * @param {Object} tagMaps - 各類型標籤的 Map 集合
     */
    processTags(tags, tagMaps) {
      tags.forEach(tag => {
        if (!tag.n || !tagMaps[tag.t]) return
        
        const map = tagMaps[tag.t]
        map.set(tag.n, (map.get(tag.n) || 0) + 1)
      })
    },

    /**
     * 將 Map 轉換為排序後的陣列
     * @param {Map} map - 標籤 Map
     * @returns {Array<{name: String, count: Number}>} 排序後的陣列
     */
    convertMapToSortedArray(map) {
      return Array.from(map, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    },

    /**
     * 解析 CSV 單行（處理引號內的逗號和轉義的引號）
     * @param {String} line - CSV 單行內容
     * @returns {Array<String>} 欄位陣列
     */
    parseCSVLine(line) {
      const fields = []
      let field = ''
      let inQuotes = false
      const len = line.length
      
      for (let i = 0; i < len; i++) {
        const char = line[i]
        
        if (char === '"') {
          // 檢查是否為轉義的引號
          if (inQuotes && line[i + 1] === '"') {
            field += '"'
            i++ // 跳過下一個引號
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          fields.push(field)
          field = ''
        } else {
          field += char
        }
      }
      
      fields.push(field) // 加入最後一個欄位
      return fields
    },

    /**
     * 清除搜尋
     */
    clearSearch() {
      this.searchKeyword = ''
    },

    /**
     * 點擊標籤項目，帶入條件跳轉至影片搜尋頁
     * @param {{name: String, count: Number}} item - 被點擊的標籤項目
     */
    goToVideoSearch(item) {
      const typeByTab = {
        streamType: TAG_TYPES.STREAM_TYPE,
        game: TAG_TYPES.GAME,
        song: TAG_TYPES.SONG,
        character: TAG_TYPES.CHARACTER,
      }

      this.$router.push({
        path: '/video-search',
        query: {
          tagType: typeByTab[this.activeTab],
          tagName: item.name,
        },
      })
    },
  },
}
</script>

<style scoped src="../css/SummarySearch.css"></style>
