<template>
  <div class="d-flex d-inline-flex align-items-center p-2 panel panel-primary">
    <div class="panel-heading">
      <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        controls
        preload
      />
    </div>
    <p class="fs-6 lh-sm">
      {{ buttonName }}
    </p>
    <div
      :class="'cursor-pointer toggle-' + voiceFileName"
      pauseStatus
      title="播放"
      @click="play()"
    >
      <i class="bi bi-volume-up-fill icon audio-play-icon" />
    </div>
    <a
      :href="sourceUrl"
      target="_blank"
      title="來源"
    >
      <i class="bi bi-youtube icon youtube-icon" />
    </a>
  </div>
</template>
<script>
export default {
  name: 'VoiceButton1',
  props: {
    voiceFileName:  {
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
  },
  methods: {
    play() {
      let audio = this.$refs[this.voiceFileName]
      // 傳給 VoicePage 用來停止撥放上一個聲音
      this.$emit('displayOther', audio)
      audio.load()
      audio.play()
    }
  }
}
</script>
<style scoped src="../../css/VoiceButton1.css"></style>
