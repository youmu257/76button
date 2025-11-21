<template>
  <!-- 主容器 -->
  <div class="container">
    <!-- 頁面標題區塊 -->
    <PageHeader
      ref="pageHeader"
      :msg="msg"
      :img-src="headerImgSrc"
      :title="infoBlockTitle"
    />

    <!-- 隱藏的彩蛋影片（按 F12 觸發） -->
    <iframe
      ref="rick-roll"
      :class="{ hidden: !f12push }"
      width="560"
      height="315"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    />

    <hr>

    <!-- 播放規則說明 -->
    <div class="rules-section">
      <b>播放規則</b><br>
      語音預設不重疊播放，播放時再次點擊語音按鈕(同一顆或其他顆)會蓋掉原本的聲音<br>
      可以點擊下方按鈕打開重疊播放<br>
      <s>如果覺得太吵</s>可以按<b>空白鍵</b>停止播放(<b>重疊播放時會全部停止</b>)<br>
      備註:
      按鈕旁邊有音訊檔來源(Youtube)，如果是推特符號表示為推特音訊(所以沒有記錄檔，想聽更多去追蹤推特)<br>
    </div>

    <!-- 亂入的王祈菈圖片列表 -->
    <!-- 動態產生，位置隨機，會自動淡出消失 -->
    <img
      v-for="(item, key) in photobombList"
      :key="key"
      ref="photobomb"
      class="img-circle"
      height="150"
      width="150"
      :style="item"
      :src="require('@/assets/photobomb_chilla.png')"
      alt="亂入的王祈菈"
      loading="lazy"
    >

    <!-- 重疊播放開關按鈕 -->
    <button
      type="button"
      class="btn btn-danger"
      :aria-label="overlapPlayback ? '關閉重疊播放' : '開啟重疊播放'"
      @click="switchOverlapPlayback()"
    >
      <input
        type="checkbox"
        :checked="overlapPlayback"
        aria-hidden="true"
      >勾選開啟重疊播放
    </button>

    <!-- 搜尋欄 -->
    <div class="search-section">
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="搜尋語音按鈕..."
          aria-label="搜尋語音按鈕"
        >
        <button
          v-if="searchQuery"
          class="btn btn-outline-secondary"
          type="button"
          @click="searchQuery = ''"
        >
          <i class="bi bi-x-lg" />
        </button>
      </div>
      <div v-if="searchQuery && filteredBtnDataList.length === 0" class="alert alert-info mt-2">
        找不到符合「{{ searchQuery }}」的語音按鈕
      </div>
    </div>

    <hr>

    <!-- 語音按鈕手風琴區塊 -->
    <div
      v-for="(item, index) in filteredBtnDataList"
      :id="`accordionExample-${index}`"
      :key="item.id || index"
      class="d-flex flex-column background accordion"
    >
      <!-- 亂入王祈菈特殊區塊 -->
      <div v-if="item.type === 'photobomb'">
        <h3>
          {{ item.category }}
        </h3>
        <p>註: 一次會亂入10隻祈菈，最多200隻祈菈，祈菈會慢慢消失</p>
      </div>

      <!-- 正常語音按鈕區塊（手風琴標題） -->
      <div
        v-if="item.type !== 'photobomb'"
        class="accordion-item"
      >
        <h2 class="accordion-header">
          <button
            type="button"
            class="accordion-button text-center w-100 clickable"
            data-toggle="collapse"
            :data-target="`#collapseRegion_${index}`"
            :aria-expanded="true"
            :aria-controls="`collapseRegion_${index}`"
          >
            <h3>
              {{ item.category }}
            </h3>
          </button>
        </h2>
      </div>

      <!-- 手風琴內容區塊（語音按鈕列表） -->
      <div
        :id="`collapseRegion_${index}`"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        :data-bs-parent="`#accordionExample-${index}`"
      >
        <div class="accordion-body">
          <!-- 遍歷語音按鈕 -->
          <VoiceButton2
            v-for="(btnData, btnIndex) in item.btnList"
            :key="btnData.id || btnIndex"
            :voice-file-name="btnData.fileName"
            :button-name="btnData.btnName"
            :source-url="btnData.sourceUrl"
            :source-type="btnData.sourceType"
            @displayOther="(audio, buttonName) => handleVoicePlay(item.type, audio, buttonName)"
          />
        </div>
      </div>
    </div>

    <!-- 固定在右下角的播放器 -->
    <AudioPlayer
      :playing-list="currentPlayingList"
      @stop-all="stopPlay(true)"
      @stop-single="stopSingleAudio"
    />
  </div>
</template>

<script>
import VoiceButton2 from './buttons/VoiceButton2.vue'
import PageHeader from './PageHeader.vue'
import AudioPlayer from './AudioPlayer.vue'
import btnList from '../assets/button-list.json'

/**
 * VoicePage 組件
 *
 * 功能說明：
 * - 主要的語音按鈕頁面
 * - 支援語音播放、暫停、重疊播放
 * - 包含「亂入王祈菈」彩蛋功能
 * - 包含 F12 彩蛋（Rick Roll）
 * - 使用手風琴式佈局組織語音按鈕
 * - 支援鍵盤快捷鍵（空白鍵停止播放、F12 觸發彩蛋）
 *
 * 特殊功能：
 * 1. 單一播放模式：新音效會覆蓋舊音效
 * 2. 重疊播放模式：可同時播放多個音效
 * 3. 亂入功能：隨機產生王祈菈圖片，自動淡出消失
 * 4. F12 彩蛋：開啟特殊影片和更換頁面內容
 *
 * @component
 */
export default {
  name: 'VoicePage',
  components: {
    VoiceButton2, // 語音按鈕組件
    PageHeader, // 頁面標題組件
    AudioPlayer, // 固定播放器組件
  },
  props: {
    /**
     * 頁面主標題
     * @type {string}
     */
    msg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * 搜尋關鍵字
       * @type {string}
       */
      searchQuery: '',

      /**
       * 語音按鈕列表資料
       * 從 JSON 檔案匯入，包含多個分類和按鈕
       * @type {Array<Object>}
       */
      btnDataList: btnList,

      /**
       * 當前播放的音訊物件（單一播放模式）
       * @type {HTMLAudioElement|null}
       */
      playNow: null,

      /**
       * 當前播放的音訊列表（重疊播放模式）
       * @type {Array<HTMLAudioElement>}
       */
      playNowList: [],

      /**
       * F12 彩蛋是否已觸發
       * @type {boolean}
       */
      f12push: false,

      /**
       * 資訊區塊標題
       * @type {string}
       */
      infoBlockTitle: '語音按鈕列表',

      /**
       * 頁面標題圖片 URL
       * @type {string}
       */
      headerImgSrc: 'https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096',

      /**
       * 是否開啟重疊播放模式
       * @type {boolean}
       */
      overlapPlayback: false,

      /**
       * 亂入圖片的樣式 Map
       * key: 隨機 ID, value: CSS 樣式字串
       * @type {Map<number, string>}
       */
      photobombList: new Map(),

      /**
       * 待刪除的亂入圖片 ID 集合
       * @type {Set<number>}
       */
      photobombDeleteList: new Set(),

      /**
       * 視窗高度（用於計算亂入圖片位置）
       * @type {number}
       */
      windowHeight: window.innerHeight,

      /**
       * 視窗寬度（用於計算亂入圖片位置）
       * @type {number}
       */
      windowWidth: window.innerWidth,

      /**
       * 當前正在播放的音訊列表（用於顯示在固定播放器中）
       * @type {Array<{id: string, name: string, audio: HTMLAudioElement}>}
       */
      currentPlayingList: [],

      /**
       * 音訊 ID 計數器（用於產生唯一 ID）
       * @type {number}
       */
      audioIdCounter: 0,
    }
  },
  computed: {
    /**
     * 根據搜尋關鍵字過濾按鈕列表
     * 如果沒有搜尋關鍵字，返回完整列表
     * 否則只返回包含搜尋關鍵字的按鈕
     * @returns {Array<Object>} 過濾後的按鈕列表
     */
    filteredBtnDataList() {
      if (!this.searchQuery.trim()) {
        return this.btnDataList
      }

      const query = this.searchQuery.toLowerCase()
      return this.btnDataList.map(category => {
        // 過濾每個分類中的按鈕
        const filteredBtnList = category.btnList.filter(btn => 
          btn.btnName.toLowerCase().includes(query)
        )

        // 只返回有按鈕的分類
        if (filteredBtnList.length > 0) {
          return {
            ...category,
            btnList: filteredBtnList
          }
        }
        return null
      }).filter(category => category !== null)
    }
  },
  created() {
    // 註冊鍵盤事件監聽器
    this.handleKeydown = (e) => {
      // 空白鍵：停止所有音效
      if (e.code === 'Space') {
        this.stopPlay(true)
        e.preventDefault()
      }
      // F12 鍵：觸發彩蛋
      else if (!this.f12push && e.code === 'F12') {
        this.triggerF12Easter()
      }
    }
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    // 移除鍵盤事件監聽器，防止記憶體洩漏
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    /**
     * 處理語音播放事件
     * 根據類型決定是正常播放還是觸發亂入效果
     * @param {string} type - 按鈕類型（'photobomb' 或其他）
     * @param {HTMLAudioElement} audio - 音訊物件
     * @param {string} buttonName - 按鈕名稱
     */
    handleVoicePlay(type, audio, buttonName) {
      if (type === 'photobomb') {
        this.photobombVoice(audio, buttonName)
      } else {
        this.displayOtherVoice(audio, buttonName)
      }
    },

    /**
     * 播放語音（正常模式）
     * 根據重疊播放設定決定播放策略
     * @param {HTMLAudioElement} playVoice - 要播放的音訊物件
     * @param {string} buttonName - 按鈕名稱
     */
    displayOtherVoice(playVoice, buttonName = '未知') {
      const audioId = `audio_${this.audioIdCounter++}`
      
      // 監聽音訊結束事件，自動從播放列表移除
      playVoice.addEventListener('ended', () => {
        this.removeFromPlayingList(audioId)
      })
      
      // 監聽音訊暫停事件（包含手動停止）
      playVoice.addEventListener('pause', () => {
        this.removeFromPlayingList(audioId)
      })

      if (this.overlapPlayback) {
        // 重疊播放：加入播放列表
        this.playNowList.push(playVoice)
        this.currentPlayingList.push({
          id: audioId,
          name: buttonName,
          audio: playVoice
        })
      } else {
        // 單一播放：停止前一個音效
        this.stopPlay()
        this.playNow = playVoice
        this.currentPlayingList = [{
          id: audioId,
          name: buttonName,
          audio: playVoice
        }]
      }
    },

    /**
     * 播放語音並觸發亂入效果
     * 產生 10 張隨機位置的王祈菈圖片
     * @param {HTMLAudioElement} playVoice - 要播放的音訊物件
     * @param {string} buttonName - 按鈕名稱
     */
    photobombVoice(playVoice, buttonName) {
      // 播放語音
      this.displayOtherVoice(playVoice, buttonName)

      // 清理已隱藏的圖片
      this.cleanupPhotobombs()

      // 產生 10 張亂入圖片
      for (let i = 0; i < 10; i++) {
        this.generatePhotobomb(i)
      }
    },

    /**
     * 清理已隱藏的亂入圖片
     * 從 Map 中移除標記為刪除的項目
     */
    cleanupPhotobombs() {
      for (const mapKey of this.photobombDeleteList) {
        this.photobombList.delete(mapKey)
        this.photobombDeleteList.delete(mapKey)
      }
    },

    /**
     * 產生一張亂入圖片
     * 隨機位置，避免在中心區域，會自動淡出消失
     * @param {number} num - 圖片編號（用於產生唯一 key）
     */
    generatePhotobomb(num = 0) {
      // 最多 200 張亂入圖
      if (this.photobombList.size >= 200) {
        return
      }

      // 產生隨機位置（0-100%）
      const x = this.getRandom(100)
      const y = this.getRandom(100)

      // 檢查是否在中心區域（40%-50%）
      const isCenterX = x >= 40 && x <= 50
      const isCenterY = y >= 40 && y <= 50

      // 如果在中心區域，偏移 15% 避免遮擋主要內容
      const randomX = ((isCenterX ? x - 15 : x) / 100) * this.windowWidth
      const randomY = ((isCenterY ? y - 15 : y) / 100) * this.windowHeight

      // 設定初始樣式和唯一 key
      const mapKey = this.getRandom(99999 + num)
      const positionStyle = `z-index: 10; position: absolute; right: ${randomX}px; top: ${randomY}px;`
      this.photobombList.set(mapKey, positionStyle)

      // 開始淡出動畫
      this.startFadeOut(mapKey, positionStyle)
    },

    /**
     * 開始淡出動畫
     * 使用 CSS transition 實現平滑淡出效果
     * @param {number} mapKey - 圖片的唯一識別碼
     * @param {string} baseStyle - 基礎樣式字串
     */
    startFadeOut(mapKey, baseStyle) {
      // 隨機淡出時間 2000~4999 毫秒
      const fadeDuration = this.getRandom(3000) + 2000
      const delay = Math.floor(fadeDuration / 1000)
      const fadeOutStyle = `${baseStyle} opacity:1; transition: opacity ${delay}s ease-out;`
      this.photobombList.set(mapKey, fadeOutStyle)

      // 使用 requestAnimationFrame 確保 DOM 更新後再觸發動畫
      requestAnimationFrame(() => {
        // 設定 opacity 為 0，觸發淡出動畫
        this.photobombList.set(mapKey, `${fadeOutStyle} opacity: 0;`)

        // 動畫結束後隱藏並標記為待刪除
        setTimeout(() => {
          this.photobombList.set(mapKey, `${fadeOutStyle} opacity: 0; display:none`)
          this.photobombDeleteList.add(mapKey)
        }, fadeDuration)
      })
    },

    /**
     * 產生隨機數
     * @param {number} max - 最大值（不包含）
     * @returns {number} 1 到 max 之間的隨機整數
     */
    getRandom(max) {
      return Math.floor(Math.random() * max) + 1
    },

    /**
     * 停止播放音效
     * @param {boolean} stopAll - 是否停止所有效果（包含清空亂入圖）
     */
    stopPlay(stopAll = false) {
      if (this.overlapPlayback) {
        // 重疊播放模式：停止所有音效
        this.stopPlayList()
      } else if (this.playNow != null) {
        // 單一播放模式：停止當前音效
        this.stopPlayList()
        this.playNow.pause()
      }

      // 清空播放列表顯示
      this.currentPlayingList = []

      // 按空白鍵時清空所有亂入圖
      if (stopAll) {
        this.photobombList.clear()
        this.photobombDeleteList.clear()
      }
    },

    /**
     * 停止播放列表中的所有音效
     */
    stopPlayList() {
      if (this.playNowList.length === 0) {
        return
      }

      this.playNowList.forEach((item) => {
        item.pause()
      })
      this.playNowList = []
    },

    /**
     * 切換重疊播放模式
     */
    switchOverlapPlayback() {
      this.overlapPlayback = !this.overlapPlayback
    },

    /**
     * 從播放列表中移除指定音訊
     * @param {string} audioId - 音訊 ID
     */
    removeFromPlayingList(audioId) {
      const index = this.currentPlayingList.findIndex(item => item.id === audioId)
      if (index !== -1) {
        this.currentPlayingList.splice(index, 1)
      }
    },

    /**
     * 停止單個音訊播放
     * @param {string} audioId - 音訊 ID
     */
    stopSingleAudio(audioId) {
      const item = this.currentPlayingList.find(item => item.id === audioId)
      if (item && item.audio) {
        item.audio.pause()
        this.removeFromPlayingList(audioId)
        
        // 從 playNowList 中移除
        const playIndex = this.playNowList.indexOf(item.audio)
        if (playIndex !== -1) {
          this.playNowList.splice(playIndex, 1)
        }
      }
    },

    /**
     * 觸發 F12 彩蛋
     * 播放特殊影片並更換頁面內容
     */
    triggerF12Easter() {
      // 滾動到頂部
      window.scrollTo(0, 0)
      this.f12push = true

      // 播放祈菈搖影片
      this.$refs['rick-roll'].src =
        'https://www.youtube.com/embed/O1FWa6vRFTA?start=19&autoplay=1&mute=0'
      this.headerImgSrc = require('@/assets/chiila_is_our_wife.png')
      this.infoBlockTitle = '毛主祈萬歲'

      // 1 秒後顯示控制台訊息
      setTimeout(() => {
        console.log('%c請看向左邊祈菈搖', 'color:red; font-size: 50px')
        console.log('%c←←←←←←', 'color:red; font-size: 50px')
      }, 1000)

      // 5 秒後切換為 Rick Roll 影片
      setTimeout(() => {
        this.$refs['rick-roll'].src =
          'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&rel=0'
        console.log('%c按 F12 想做啥(́◕◞౪◟◕‵)', 'color:black; font-size: 20px')
      }, 5000)
    },
  },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>
<style scoped src="../css/VoiceButton2.css"></style>
<style scoped src="../css/VoicePage.css"></style>
