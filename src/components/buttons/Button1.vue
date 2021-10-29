<template>
  <div class="d-flex d-inline-flex align-items-center p-2 panel panel-primary">
    <div class="panel-heading">
      <audio
          :ref="voiceFileName"
          class="sound-play"
          :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
          controls
          preload
      ></audio>
    </div>
    <p class="fs-6 lh-sm">
      {{ buttonName }}
    </p>
    <div :class="'cursor-pointer toggle-' + voiceFileName"
       pauseStatus
       title="播放"
       @click="play()">
      <i class="bi bi-volume-up-fill icon audio-play-icon"></i>
    </div>
    <a
      :href="sourceUrl"
      target="_blank"
      title="來源">
      <i class="bi bi-youtube icon youtube-icon"></i>
    </a>
  </div>
</template>
<script>
export default {
  name: 'Button1',
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
<style scoped src="../../css/VoiceButton.css"></style>
<style lang="css" scoped>
.cursor-pointer {
  cursor: pointer;
}
.icon {
  padding: 3px;
  padding-right: 3px;
}
.audio-play-icon {
  color: rgba(90, 82, 88, 0.76);
}
.audio-play-icon:hover {
  color: dimgrey;
}
.youtube-icon {
  color: brown;
}
.youtube-icon:hover {
  color: crimson;
}

.fs-6 {
  margin-bottom: 0rem;
}
</style>
