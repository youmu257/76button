<template>
  <div class="d-flex d-inline-flex align-items-center p-2 panel panel-danger">
    <div
      class="btn-group btn-group-sm"
      role="group"
      aria-label="Basic outlined example"
    >
      <!-- 主要音訊播放按鈕 -->
      <button
        class="btn btn-danger play-button"
        :style="{ '--progress': progress + '%' }"
        @click="togglePlay()"
      >
        {{ buttonName }}
        <i class="bi bi-volume-up-fill icon" />
      </button>
      <audio
        :ref="voiceFileName"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        @timeupdate="updateProgress"
        @ended="resetProgress"
      />
      <!-- Yotube 來源 -->
      <a
        v-if="sourceType == ''"
        class="btn btn-outline-danger d-flex align-items-center justify-content-center"
        :href="sourceUrl"
        target="_blank"
        title="來源"
      >
        <i class="bi bi-youtube" />
      </a>
      <!-- Twitter 來源 -->
      <a
        v-else-if="sourceUrl != ''"
        class="btn btn-twitter btn-outline-twitter d-flex align-items-center justify-content-center"
        :href="sourceUrl"
        target="_blank"
        title="來源"
      >
        <i class="bi bi-twitter" />
      </a>
      <a
        v-else
        class="btn btn-twitter btn-outline-twitter"
      >
        <i class="bi bi-twitter" />
      </a>
      <!-- 下載按鈕 -->
      <button
        type="button"
        class="btn btn-danger"
        @click="downloadMp3()"
      >
        <i class="bi bi-download" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VoiceButton2',
  props: {
    voiceFileName: {
      type: String,
      default: ''
    },
    buttonName:  {
      type: String,
      default: ''
    },
    sourceUrl:  {
      type: String,
      default: ''
    },
    sourceType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      audio: null,
      isPlaying: false,
      progress: 0,
    }
  },
  methods: {
    downloadMp3() {
      // 取得音訊元素的 URL
      const audioElement = this.$refs[this.voiceFileName]
      const audioSrc = audioElement.src

      if (!audioSrc) {
        console.error('音訊檔案來源不存在！')
        return
      }

      // 建立下載連結
      const link = document.createElement('a')
      link.href = audioSrc
      link.click()
    },
    togglePlay() {
      this.audio = this.$refs[this.voiceFileName].cloneNode()
      // 傳給 VoicePage 用來停止撥放上一個聲音
      this.$emit('displayOther', this.audio)
      this.audio.load()
      this.audio.play()
      // 開始播放進度條
      this.updateProgressSmooth()
    },
    updateProgressSmooth() {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100
      if (this.audio.paused || this.audio.ended) {
        // 停止音訊
        this.isPlaying = false
        this.progress = 0
        // 停止動畫
        cancelAnimationFrame(this.animationFrame)
        return
      }
      // 繼續動畫，遞迴持續偵錯 progress
      this.animationFrame = requestAnimationFrame(this.updateProgressSmooth)
    },
  }
}
</script>
<style scoped src="../../css/VoiceButton2.css"></style>