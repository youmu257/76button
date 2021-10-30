<template>
  <div class="d-flex d-inline-flex align-items-center p-2 panel panel-danger">
    <div class="panel-heading">
      <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        controls
        preload
      ></audio>
    </div>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
      <button
        type="button"
        class="btn btn-danger"
        :class="'cursor-pointer toggle-' + voiceFileName"
        pauseStatus
        title="播放"
        @click="play()">
        {{ buttonName }}
        <i class="bi bi-volume-up-fill icon"></i>
      </button>
      <a
        class="btn btn-outline-danger"
        :href="sourceUrl"
        target="_blank"
        title="來源">
        <i class="bi bi-youtube icon youtube-icon"></i>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VoiceButton1',
  props: {
    voiceFileName: String,
    buttonName: String,
    sourceUrl: String,
  },
  methods: {
    play() {
      let audio = this.$refs[this.voiceFileName];
      // 傳給 VoicePage 用來停止撥放上一個聲音
      this.$emit('displayOther', audio);
      audio.load();
      audio.play();
    }
  }
}
</script>
<style scoped src="../../css/VoiceButton2.css"></style>
