<template>
  <div class="hello">
    <div class="d-flex flex-wrap align-items-center justify-content-center container">
      <img
        class="img-circle"
        height="200"
        src="https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096"
      >
      <div>
        <p class="fs-1 py-1">
          {{ msg }}
        </p>
        <InformationBlock />
      </div>
    </div>
    <iframe
      ref="rick-roll"
      :class="{ hidden: !f12push }"
      width="560"
      height="315"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <hr>
    <b>播放規則</b><br>
    語音不重疊播放，播放時再次點擊語音按鈕(同一顆或其他顆)會蓋掉原本的聲音<br>
    另外<b>空白鍵</b>可以停止播放<br>
    <hr>
    <div class="container mb-5">
      <div
        v-for="(item, index) in btnDataList"
        :key="index"
        class="d-flex flex-column background"
      >
        <p class="fs-3">
          {{ item.category }}
        </p>
        <div class="d-flex flex-wrap justify-content-center">
          <VoiceButton2
            v-for="(btnData, btnIndex) in item.btnList"
            :key="btnIndex"
            :voice-file-name="btnData.fileName"
            :button-name="btnData.btnName"
            :source-url="btnData.sourceUrl"
            @displayOther="displayOtherVoice"
          />
        </div>
        <hr v-if="index !== btnDataList.length - 1">
      </div>
    </div>
  </div>
</template>

<script>
import VoiceButton2 from './buttons/VoiceButton2.vue'
import InformationBlock from './InformationBlock.vue'
import btnList from '../assets/button-list.json'

export default {
  name: 'VoicePage',
  components: {
    VoiceButton2,
    InformationBlock,
  },
  props: {
    msg:  {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      btnDataList: btnList,
      playNow: null,
      f12push: false,
    }
  },
  created() {
    var self = this
    window.addEventListener('keydown', function(e) {
      if (e.code === 'Space') {
        self.stopPlay()
        e.preventDefault()
      } else if (self.f12push == false && e.code === 'F12') {
        window.scrollTo(0,0)
        self.f12push = true
        self.$refs['rick-roll'].src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&&mute=1&rel=0'
      }
    })
  },
  methods:{
    displayOtherVoice(playVoice) {
      this.stopPlay()
      this.playNow = playVoice
    },
    stopPlay() {
      if (this.playNow != null) {
        // 停止播放上一個聲音
        this.playNow.pause()
      }
    },
  },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>
<style>
.img-circle{
  border-radius: 50%;
}
</style>