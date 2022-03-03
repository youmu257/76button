<template>
  <div class="d-flex d-inline-flex align-items-center p-2 panel panel-danger">
    <div class="panel-heading">
      <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        controls
        preload
      />
    </div>
    <div
      class="btn-group btn-group-sm"
      role="group"
      aria-label="Basic outlined example"
    >
      <button
        type="button"
        class="btn btn-danger"
        :class="'toggle-' + voiceFileName"
        pauseStatus
        title="播放"
        @click="play()"
      >
        {{ buttonName }}
        <i class="bi bi-volume-up-fill icon" />
      </button>
      <a
        v-if="sourceUrl != ''"
        class="btn btn-outline-danger"
        :href="sourceUrl"
        target="_blank"
        title="來源"
      >
        <i class="bi bi-youtube" />
      </a>
      <a
        v-else
        class="btn btn-twitter btn-outline-twitter"
      >
        <i class="bi bi-twitter" />
      </a>
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
  },
  methods: {
    play() {
      let audio = this.$refs[this.voiceFileName].cloneNode()
      // 傳給 VoicePage 用來停止撥放上一個聲音
      this.$emit('displayOther', audio)
      audio.load()
      audio.play()
    }
  }
}
</script>
<style scoped src="../../css/VoiceButton2.css"></style>
