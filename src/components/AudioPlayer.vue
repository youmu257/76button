<template>
  <div class="audio-player">
    <div class="player-header">
      <h5 class="player-title">
        <i class="bi bi-music-note-beamed" /> 播放器
      </h5>
      <button
        v-if="playingList.length > 0"
        class="btn btn-sm btn-danger stop-all-btn"
        title="停止全部"
        @click="stopAll"
      >
        <i class="bi bi-stop-fill" /> 全部停止
      </button>
    </div>
    <div
      v-if="playingList.length > 0"
      class="playing-list"
    >
      <div
        v-for="item in playingList"
        :key="item.id"
        class="playing-item"
      >
        <span class="playing-name">{{ item.name }}</span>
        <button
          class="btn btn-sm btn-outline-danger stop-btn"
          title="停止播放"
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
    }
  },
  emits: ['stop-all', 'stop-single'],
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
    }
  }
}
</script>

<style scoped src="../css/AudioPlayer.css"></style>
