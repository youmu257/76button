<template>
  <div
    class="audio-player"
    :class="{ 'sidebar-open': isSidebarOpen, collapsed: isCollapsed }"
  >
    <button
      v-if="isCollapsed"
      type="button"
      class="player-fab"
      :title="playingList.length > 0 ? `播放器（播放中 ${playingList.length} 個）` : '播放器'"
      @click="isCollapsed = false"
    >
      <i class="bi bi-music-note-beamed" />
      <span
        v-if="playingList.length > 0"
        class="player-fab-badge"
      >{{ playingList.length }}</span>
    </button>

    <template v-else>
      <div class="player-header">
        <h5 class="player-title">
          <i class="bi bi-music-note-beamed" /> 播放器
        </h5>
        <button
          type="button"
          class="player-collapse-btn"
          title="收合播放器"
          aria-label="收合播放器"
          @click="isCollapsed = true"
        >
          <i class="bi bi-chevron-down" />
        </button>
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        <div
          v-if="playingList.length > 0"
          class="playing-list"
        >
          <span class="visually-hidden">正在播放：{{ playingList.map(item => item.name).join('、') }}</span>
          <div
            v-for="item in playingList"
            :key="item.id"
            class="playing-item"
          >
            <span class="playing-name">{{ item.name }}</span>
            <button
              class="btn btn-sm btn-outline-danger stop-btn"
              title="停止播放"
              :aria-label="`停止播放 ${item.name}`"
              @click="stopSingle(item.id)"
            >
              <i class="bi bi-stop-circle" />
            </button>
          </div>
        </div>
        <div
          v-else
          class="empty-state"
        >
          <i class="bi bi-music-note" />
          <p>目前沒有播放中的音訊</p>
        </div>
      </div>
      <div class="player-actions">
        <button
          class="btn btn-sm btn-primary"
          title="隨機播放一個語音"
          @click="playRandom"
        >
          <i class="bi bi-shuffle" /> 隨機
        </button>
        <button
          class="btn btn-sm btn-danger stop-all-btn"
          title="停止全部"
          :disabled="playingList.length === 0"
          @click="stopAll"
        >
          <i class="bi bi-stop-fill" /> 全部停止
        </button>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * AudioPlayer 組件
 * 
 * 功能說明：
 * - 固定在畫面右下角顯示正在播放的音訊列表
 * - 顯示每個正在播放的按鈕名稱
 * - 支援重疊播放，可同時顯示多筆
 * - 提供單獨停止和全部停止按鈕
 */
export default {
  name: 'AudioPlayer',
  props: {
    /**
     * 正在播放的音訊列表
     * @type {Array<{id: string, name: string, audio: HTMLAudioElement}>}
     */
    playingList: {
      type: Array,
      default: () => []
    },
    /**
     * 側邊欄開啟狀態
     * @type {Boolean}
     */
    isSidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['stop-all', 'stop-single', 'play-random'],
  data() {
    return {
      /**
       * 播放器是否收合成小圖示（避免長期佔用畫面角落）
       * @type {Boolean}
       */
      isCollapsed: false,
    }
  },
  methods: {
    /**
     * 停止所有播放
     */
    stopAll() {
      this.$emit('stop-all')
    },
    /**
     * 停止單個音訊播放
     * @param {string} id - 音訊 ID
     */
    stopSingle(id) {
      this.$emit('stop-single', id)
    },
    /**
     * 觸發隨機播放
     */
    playRandom() {
      this.$emit('play-random')
    }
  }
}
</script>

<style scoped src="../css/AudioPlayer.css"></style>
