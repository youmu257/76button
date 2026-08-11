<template>
  <!-- 語音按鈕面板容器 -->
  <div class="panel panel-primary">
    <!-- 音訊播放器區塊 -->
    <div class="panel-heading">
      <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        preload="metadata"
        controls
      />
    </div>
    
    <!-- 按鈕區塊 -->
    <div class="panel-body">
      <button
        type="button"
        :class="['voiceButton', `toggle-${voiceFileName}`]"
        :aria-label="`播放 ${buttonName}`"
        @click="handlePlay"
      >
        {{ buttonName }}
      </button>
    </div>
    
    <!-- 來源連結區塊 -->
    <div class="panel-footer">
      <a
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
        title="查看來源"
        :aria-label="`查看 ${buttonName} 的來源`"
      >
        <!-- 連結圖示 SVG -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-link"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"
          />
          <path
            d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
/**
 * VoiceButton 組件
 * 
 * 功能說明：
 * - 顯示語音按鈕和音訊播放器
 * - 支援點擊播放語音
 * - 顯示來源連結
 * - 透過事件通知父組件播放狀態
 * 
 * 使用範例：
 * <VoiceButton
 *   voice-file-name="laugh1"
 *   button-name="笑聲"
 *   source-url="https://youtube.com/..."
 *   @displayOther="handleVoicePlay"
 * />
 * 
 * @component
 */
export default {
  name: 'VoiceButton',
  props: {
    /**
     * 語音檔案名稱（不含副檔名）
     * 對應 assets/sound/ 目錄下的 mp3 檔案
     * @type {string}
     */
    voiceFileName: {
      type: String,
      required: true,
      default: '',
    },
    
    /**
     * 按鈕顯示的名稱
     * @type {string}
     */
    buttonName: {
      type: String,
      required: true,
      default: '',
    },
    
    /**
     * 語音來源連結 URL
     * @type {string}
     */
    sourceUrl: {
      type: String,
      default: '',
    },
  },
  emits: ['displayOther'],
  methods: {
    /**
     * 處理播放按鈕點擊
     * 載入並播放音訊，同時通知父組件
     */
    handlePlay() {
      const audio = this.$refs[this.voiceFileName]
      
      if (!audio) {
        console.warn(`Audio element not found: ${this.voiceFileName}`)
        return
      }
      
      // 通知父組件（用於停止其他正在播放的音訊）
      this.$emit('displayOther', audio)
      
      // 重新載入並播放
      audio.load()
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error)
      })
    },
  },
}
</script>

<!-- 引入外部樣式表 -->
<!-- scoped 確保樣式只作用於此組件 -->
<style scoped src="../../css/VoiceButton.css"></style>
